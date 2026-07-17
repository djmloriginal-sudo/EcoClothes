const mysql = require('mysql2/promise');

const {
  DB_HOST = 'localhost',
  DB_PORT = 3306,
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'eco_clothes',
} = process.env;

const poolPromise = initializeDatabase();

async function initializeDatabase() {
  try {
    const initPool = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
    });

    await initPool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await initPool.end();

    const pool = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id VARCHAR(100) PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        criadoEm DATETIME NOT NULL,
        role VARCHAR(50) DEFAULT 'user'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analises (
        id VARCHAR(100) PRIMARY KEY,
        usuarioId VARCHAR(100) NOT NULL,
        composicao TEXT NOT NULL,
        resultado TEXT,
        materiais TEXT,
        dataCriacao DATETIME NOT NULL,
        FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS favoritos (
        id VARCHAR(100) PRIMARY KEY,
        usuarioId VARCHAR(100) NOT NULL,
        composicao TEXT,
        nome TEXT,
        nota DECIMAL(5,2),
        nivel VARCHAR(50),
        materiais TEXT,
        dataAdicionado DATETIME NOT NULL,
        FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS mensagens (
        id VARCHAR(100) PRIMARY KEY,
        usuarioId VARCHAR(100),
        autor TEXT NOT NULL,
        texto TEXT NOT NULL,
        dataCriacao DATETIME NOT NULL,
        FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [columns] = await pool.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'role'`,
      [DB_NAME]
    );

    if (columns.length === 0) {
      await pool.query(`ALTER TABLE usuarios ADD COLUMN role VARCHAR(50) DEFAULT 'user'`);
    }

    console.log('Conexão bem-sucedida ao banco de dados MySQL.');
    return pool;
  } catch (erro) {
    console.error('Erro ao inicializar o banco de dados MySQL:', erro);
    process.exit(1);
  }
}

async function run(sql, params = []) {
  const pool = await poolPromise;
  const [result] = await pool.execute(sql, params);
  return { insertId: result.insertId, changes: result.affectedRows };
}

async function get(sql, params = []) {
  const pool = await poolPromise;
  const [rows] = await pool.execute(sql, params);
  return rows[0] || null;
}

async function all(sql, params = []) {
  const pool = await poolPromise;
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = { get, all, run };