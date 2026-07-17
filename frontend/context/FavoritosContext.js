import { createContext, useContext, useEffect, useState } from 'react';
import { getUsuarioAtual, requestJson, setUsuarioAtual } from '../services/api';

const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState([]);
  const [usuario, setUsuario] = useState(getUsuarioAtual());

  async function carregarFavoritos() {
    const usuarioAtual = usuario || getUsuarioAtual();
    if (!usuarioAtual?.id) {
      setFavoritos([]);
      return;
    }

    try {
      const resposta = await requestJson(`/usuarios/${usuarioAtual.id}/favoritos`);
      setFavoritos(resposta || []);
    } catch (erro) {
      console.log('Erro ao carregar favoritos:', erro.message);
    }
  }

  useEffect(() => {
    carregarFavoritos();
  }, [usuario]);

  async function adicionarFavorito(item) {
    const usuarioAtual = usuario || getUsuarioAtual();
    if (!usuarioAtual?.id) {
      return;
    }

    const favorito = {
      usuarioId: usuarioAtual.id,
      ...item,
      dataAdicionado: new Date().toISOString(),
    };

    try {
      await requestJson('/favoritos', {
        method: 'POST',
        body: JSON.stringify(favorito),
      });
    } catch (erro) {
      console.log('Erro ao salvar favorito:', erro.message);
    }

    setFavoritos((prev) => {
      const existe = prev.find((f) => f.id === item.id);
      if (existe) return prev;
      return [...prev, favorito];
    });
  }

  async function removerFavorito(id) {
    const usuarioAtual = usuario || getUsuarioAtual();
    try {
      await requestJson(`/favoritos/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ usuarioId: usuarioAtual?.id, role: usuarioAtual?.role }),
      });
    } catch (erro) {
      console.log('Erro ao remover favorito:', erro.message);
    }

    setFavoritos((prev) => prev.filter((f) => f.id !== id));
  }

  async function editarFavorito(id, data) {
    const usuarioAtual = usuario || getUsuarioAtual();
    if (!usuarioAtual?.id) {
      return;
    }

    try {
      const resposta = await requestJson(`/favoritos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ usuarioId: usuarioAtual.id, role: usuarioAtual.role, ...data }),
      });
      setFavoritos((prev) => prev.map((f) => (f.id === id ? resposta.data : f)));
    } catch (erro) {
      console.log('Erro ao editar favorito:', erro.message);
    }
  }

  function isFavorito(id) {
    return favoritos.some((f) => f.id === id);
  }

  function atualizarUsuario(novoUsuario) {
    setUsuarioAtual(novoUsuario);
    setUsuario(novoUsuario);
  }

  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        adicionarFavorito,
        removerFavorito,
        editarFavorito,
        isFavorito,
        carregarFavoritos,
        atualizarUsuario,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de FavoritosProvider');
  }
  return context;
}
