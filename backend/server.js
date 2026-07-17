const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { get, all, run } = require('./dbconfig');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function parseJson(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (erro) {
    return value;
  }
}

async function criarUsuarioAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'empresaecoclothes@gmail.com';
  const adminSenha = process.env.ADMIN_PASSWORD || 'ecomiguelematheus';

  const usuarioExistente = await get('SELECT * FROM usuarios WHERE email = ?', [normalizeEmail(adminEmail)]);
  if (usuarioExistente) {
    return;
  }

  const senhaCriptografada = await bcrypt.hash(adminSenha, 10);
  const admin = {
    id: createId('usuario'),
    nome: 'Administrador EcoClothes',
    email: normalizeEmail(adminEmail),
    senha: senhaCriptografada,
    criadoEm: new Date().toISOString(),
    role: 'admin',
  };

  await run(
    'INSERT INTO usuarios (id, nome, email, senha, criadoEm, role) VALUES (?, ?, ?, ?, ?, ?)',
    [admin.id, admin.nome, admin.email, admin.senha, admin.criadoEm, admin.role]
  );
}

function getTecidos() {
  const filePath = path.resolve(__dirname, '../frontend/data/tecidos.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return data.tecidos;
}

const recuperacoes = new Map();

function gerarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function enviarCodigoPorEmail(email, codigo, nome = '') {
  const usuario = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const senha = process.env.GMAIL_PASS || process.env.EMAIL_PASS;

  if (!usuario || !senha) {
    console.warn('Credenciais do Gmail não configuradas. Código de recuperação:', codigo);
    throw new Error('Credenciais do Gmail não configuradas.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: usuario,
      pass: senha,
    },
  });

  await transporter.sendMail({
    from: `EcoClothes <${usuario}>`,
    to: email,
    subject: 'Código de recuperação de senha - EcoClothes',
    html: `
      <h3>Olá, ${nome || 'usuário'}!</h3>
      <p>Você solicitou a recuperação da sua senha no EcoClothes.</p>
      <p>Use o código abaixo para redefinir sua senha:</p>
      <h2>${codigo}</h2>
      <p>Este código expira em 15 minutos.</p>
      <p>Se você não fez essa solicitação, ignore este e-mail.</p>
    `,
  });

  return true;
}

app.get('/health', (req, res) => {
  res.json({ ok: true, mensagem: 'Backend do EcoClothes funcionando' });
});

app.post('/usuarios', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome?.trim() || !email?.trim() || !senha?.trim()) {
    return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios.' });
  }

  const emailNormalizado = normalizeEmail(email);

  const usuarioExistente = await get('SELECT id FROM usuarios WHERE email = ?', [emailNormalizado]);
  if (usuarioExistente) {
    return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' });
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);
  const novoUsuario = {
    id: createId('usuario'),
    nome: nome.trim(),
    email: emailNormalizado,
    senha: senhaCriptografada,
    criadoEm: new Date().toISOString(),
  };

  await run(
    'INSERT INTO usuarios (id, nome, email, senha, criadoEm) VALUES (?, ?, ?, ?, ?)',
    [novoUsuario.id, novoUsuario.nome, novoUsuario.email, novoUsuario.senha, novoUsuario.criadoEm]
  );

  res.status(201).json({
    sucesso: true,
    mensagem: 'Usuário cadastrado com sucesso',
    data: {
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
    },
  });
});

app.get('/usuarios', async (req, res) => {
  const usuarios = await all('SELECT id, nome, email, criadoEm, role FROM usuarios ORDER BY criadoEm DESC');
  res.json(usuarios);
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email?.trim() || !senha?.trim()) {
    return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
  }

  const usuario = await get('SELECT * FROM usuarios WHERE email = ?', [normalizeEmail(email)]);

  if (!usuario) {
    return res.status(401).json({ mensagem: 'Usuário não encontrado.' });
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

  if (!senhaCorreta) {
    return res.status(401).json({ mensagem: 'Senha incorreta.' });
  }

  const { senha: _, ...usuarioSemSenha } = usuario;

  res.json({
    sucesso: true,
    mensagem: 'Login bem-sucedido',
    data: usuarioSemSenha,
  });
});

app.get('/tecidos', (req, res) => {
  res.json(getTecidos());
});

app.get('/analises', async (req, res) => {
  const analises = await all(
    `SELECT a.*, u.nome AS usuarioNome
     FROM analises a
     LEFT JOIN usuarios u ON a.usuarioId = u.id
     ORDER BY a.dataCriacao DESC`
  );

  res.json(analises.map((item) => ({
    ...item,
    resultado: parseJson(item.resultado),
    materiais: parseJson(item.materiais),
  })));
});

app.put('/analises/:id', async (req, res) => {
  const { usuarioId, role, composicao, resultado, materiais } = req.body;
  const { id } = req.params;

  const analiseExistente = await get('SELECT * FROM analises WHERE id = ?', [id]);
  if (!analiseExistente) {
    return res.status(404).json({ mensagem: 'Análise não encontrada.' });
  }

  if (analiseExistente.usuarioId !== usuarioId && role !== 'admin') {
    return res.status(403).json({ mensagem: 'Não autorizado a editar esta análise.' });
  }

  const analiseAtualizada = {
    ...analiseExistente,
    composicao: composicao ?? analiseExistente.composicao,
    resultado: resultado ? JSON.stringify(resultado) : analiseExistente.resultado,
    materiais: materiais ? JSON.stringify(materiais) : analiseExistente.materiais,
  };

  await run(
    'UPDATE analises SET composicao = ?, resultado = ?, materiais = ? WHERE id = ?',
    [analiseAtualizada.composicao, analiseAtualizada.resultado, analiseAtualizada.materiais, id]
  );

  res.json({ sucesso: true, mensagem: 'Análise atualizada com sucesso', data: analiseAtualizada });
});

app.delete('/analises/:id', async (req, res) => {
  const { usuarioId, role } = req.body;
  const { id } = req.params;

  const analiseExistente = await get('SELECT * FROM analises WHERE id = ?', [id]);
  if (!analiseExistente) {
    return res.status(404).json({ mensagem: 'Análise não encontrada.' });
  }

  if (analiseExistente.usuarioId !== usuarioId && role !== 'admin') {
    return res.status(403).json({ mensagem: 'Não autorizado a remover esta análise.' });
  }

  await run('DELETE FROM analises WHERE id = ?', [id]);

  res.json({ sucesso: true, mensagem: 'Análise removida com sucesso' });
});

app.get('/mensagens', async (req, res) => {
  const mensagens = await all(`SELECT * FROM mensagens ORDER BY dataCriacao ASC`);
  res.json(mensagens);
});

app.post('/mensagens', async (req, res) => {
  const { usuarioId, autor, texto } = req.body;

  if (!autor?.trim() || !texto?.trim()) {
    return res.status(400).json({ mensagem: 'Autor e texto são obrigatórios.' });
  }

  const mensagem = {
    id: createId('msg'),
    usuarioId: usuarioId || null,
    autor: autor.trim(),
    texto: texto.trim(),
    dataCriacao: new Date().toISOString(),
  };

  await run(
    'INSERT INTO mensagens (id, usuarioId, autor, texto, dataCriacao) VALUES (?, ?, ?, ?, ?)',
    [mensagem.id, mensagem.usuarioId, mensagem.autor, mensagem.texto, mensagem.dataCriacao]
  );

  res.status(201).json({ sucesso: true, mensagem: 'Mensagem enviada com sucesso', data: mensagem });
});

app.delete('/mensagens/:id', async (req, res) => {
  const { usuarioId, role } = req.body;
  const { id } = req.params;

  const mensagemExistente = await get('SELECT * FROM mensagens WHERE id = ?', [id]);
  if (!mensagemExistente) {
    return res.status(404).json({ mensagem: 'Mensagem não encontrada.' });
  }

  if (mensagemExistente.usuarioId !== usuarioId && role !== 'admin') {
    return res.status(403).json({ mensagem: 'Não autorizado a remover esta mensagem.' });
  }

  await run('DELETE FROM mensagens WHERE id = ?', [id]);

  res.json({ sucesso: true, mensagem: 'Mensagem removida com sucesso' });
});

app.post('/recuperar-senha', async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) {
    return res.status(400).json({ mensagem: 'Informe um e-mail para recuperar a senha.' });
  }

  const usuario = await get('SELECT id, nome, email FROM usuarios WHERE email = ?', [normalizeEmail(email)]);

  if (!usuario) {
    return res.json({ sucesso: true, mensagem: 'Se o e-mail estiver cadastrado, enviaremos instruções.' });
  }

  const codigo = gerarCodigo();
  recuperacoes.set(usuario.email, {
    codigo,
    usuarioId: usuario.id,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });

  try {
    await enviarCodigoPorEmail(usuario.email, codigo, usuario.nome);
    return res.json({
      sucesso: true,
      mensagem: 'Código enviado para o seu e-mail. Verifique também a caixa de spam.',
    });
  } catch (erro) {
    console.error('Erro ao enviar e-mail:', erro.message);
    return res.status(500).json({
      mensagem: 'Não foi possível enviar o e-mail. Verifique as credenciais do Gmail.',
    });
  }
});

app.post('/verificar-codigo', (req, res) => {
  const { email, codigo } = req.body;

  const recuperacao = recuperacoes.get(normalizeEmail(email));

  if (!recuperacao || recuperacao.codigo !== codigo) {
    return res.status(400).json({ mensagem: 'Código inválido.' });
  }

  if (Date.now() > recuperacao.expiresAt) {
    recuperacoes.delete(normalizeEmail(email));
    return res.status(400).json({ mensagem: 'Código expirado.' });
  }

  return res.json({ sucesso: true, mensagem: 'Código validado com sucesso.', usuarioId: recuperacao.usuarioId });
});

app.post('/redefinir-senha', async (req, res) => {
  const { email, codigo, senha } = req.body;

  if (!email?.trim() || !codigo || !senha?.trim()) {
    return res.status(400).json({ mensagem: 'Informe e-mail, código e nova senha.' });
  }

  const recuperacao = recuperacoes.get(normalizeEmail(email));

  if (!recuperacao || recuperacao.codigo !== codigo) {
    return res.status(400).json({ mensagem: 'Código inválido.' });
  }

  if (Date.now() > recuperacao.expiresAt) {
    recuperacoes.delete(normalizeEmail(email));
    return res.status(400).json({ mensagem: 'Código expirado.' });
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);
  await run('UPDATE usuarios SET senha = ? WHERE id = ?', [senhaCriptografada, recuperacao.usuarioId]);
  recuperacoes.delete(normalizeEmail(email));

  return res.json({ sucesso: true, mensagem: 'Senha redefinida com sucesso.' });
});

app.post('/analises', async (req, res) => {
  const { usuarioId, composicao, resultado, materiais } = req.body;

  if (!usuarioId || !composicao) {
    return res.status(400).json({ mensagem: 'Usuário e composição são obrigatórios.' });
  }

  const analise = {
    id: createId('analise'),
    usuarioId,
    composicao,
    resultado: JSON.stringify(resultado || {}),
    materiais: JSON.stringify(materiais || []),
    dataCriacao: new Date().toISOString(),
  };

  await run(
    'INSERT INTO analises (id, usuarioId, composicao, resultado, materiais, dataCriacao) VALUES (?, ?, ?, ?, ?, ?)',
    [analise.id, analise.usuarioId, analise.composicao, analise.resultado, analise.materiais, analise.dataCriacao]
  );

  res.status(201).json({ sucesso: true, mensagem: 'Análise salva com sucesso', data: analise });
});

app.get('/usuarios/:id/analises', async (req, res) => {
  const analises = await all('SELECT * FROM analises WHERE usuarioId = ? ORDER BY dataCriacao DESC', [req.params.id]);
  res.json(analises.map((item) => ({
    ...item,
    resultado: parseJson(item.resultado),
    materiais: parseJson(item.materiais),
  })));
});

app.post('/favoritos', async (req, res) => {
  const { usuarioId, id, composicao, nome, nota, nivel, materiais } = req.body;

  if (!usuarioId || !id) {
    return res.status(400).json({ mensagem: 'Usuário e identificação do favorito são obrigatórios.' });
  }

  const favoritoExistente = await get('SELECT id FROM favoritos WHERE usuarioId = ? AND id = ?', [usuarioId, id]);
  if (favoritoExistente) {
    return res.json({ sucesso: true, mensagem: 'Favorito já existe', data: favoritoExistente });
  }

  const favorito = {
    id,
    usuarioId,
    composicao,
    nome,
    nota,
    nivel,
    materiais: JSON.stringify(materiais || []),
    dataAdicionado: new Date().toISOString(),
  };

  await run(
    'INSERT INTO favoritos (id, usuarioId, composicao, nome, nota, nivel, materiais, dataAdicionado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [favorito.id, favorito.usuarioId, favorito.composicao, favorito.nome, favorito.nota, favorito.nivel, favorito.materiais, favorito.dataAdicionado]
  );

  res.status(201).json({ sucesso: true, mensagem: 'Favorito salvo com sucesso', data: favorito });
});

app.get('/usuarios/:id/favoritos', async (req, res) => {
  const favoritos = await all('SELECT * FROM favoritos WHERE usuarioId = ? ORDER BY dataAdicionado DESC', [req.params.id]);
  res.json(favoritos.map((item) => ({
    ...item,
    materiais: parseJson(item.materiais),
  })));
});

app.put('/favoritos/:id', async (req, res) => {
  const { usuarioId, role, nome, composicao, nota, nivel, materiais } = req.body;
  const { id } = req.params;

  const favoritoExistente = await get('SELECT * FROM favoritos WHERE id = ?', [id]);
  if (!favoritoExistente) {
    return res.status(404).json({ mensagem: 'Favorito não encontrado.' });
  }

  if (usuarioId && favoritoExistente.usuarioId !== usuarioId && role !== 'admin') {
    return res.status(403).json({ mensagem: 'Não autorizado a editar este favorito.' });
  }

  const favoritoAtualizado = {
    ...favoritoExistente,
    nome: nome ?? favoritoExistente.nome,
    composicao: composicao ?? favoritoExistente.composicao,
    nota: nota ?? favoritoExistente.nota,
    nivel: nivel ?? favoritoExistente.nivel,
    materiais: materiais ? JSON.stringify(materiais) : favoritoExistente.materiais,
  };

  await run(
    'UPDATE favoritos SET nome = ?, composicao = ?, nota = ?, nivel = ?, materiais = ? WHERE id = ?',
    [
      favoritoAtualizado.nome,
      favoritoAtualizado.composicao,
      favoritoAtualizado.nota,
      favoritoAtualizado.nivel,
      favoritoAtualizado.materiais,
      id,
    ]
  );

  res.json({ sucesso: true, mensagem: 'Favorito atualizado com sucesso', data: favoritoAtualizado });
});

app.delete('/favoritos/:id', async (req, res) => {
  const { usuarioId, role } = req.body;
  const favorito = await get('SELECT * FROM favoritos WHERE id = ?', [req.params.id]);

  if (!favorito) {
    return res.status(404).json({ mensagem: 'Favorito não encontrado.' });
  }

  if (favorito.usuarioId !== usuarioId && role !== 'admin') {
    return res.status(403).json({ mensagem: 'Não autorizado a remover este favorito.' });
  }

  await run('DELETE FROM favoritos WHERE id = ?', [req.params.id]);

  res.json({ sucesso: true, mensagem: 'Favorito removido com sucesso' });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await criarUsuarioAdmin();
    console.log('Admin criado ou já existente.');
  } catch (erro) {
    console.error('Erro ao criar usuário admin:', erro.message);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startServer();

module.exports = app;