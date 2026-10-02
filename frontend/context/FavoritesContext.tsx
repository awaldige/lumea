"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { useAuth } from "@/context/AuthContext";

type FavoritesContextType = {
  favoritos: number[];
  quantidadeFavoritos: number;
  isFavorito: (id: number) => boolean;
  alternarFavorito: (id: number) => void;
  removerFavorito: (id: number) => void;
  limparFavoritos: () => void;
};

const FavoritesContext = createContext<
  FavoritesContextType | undefined
>(undefined);

function obterStorageKey(clienteId?: number | null) {
  if (!clienteId) {
    return "lumea-favoritos-anonimo";
  }

  return `lumea-favoritos-cliente-${clienteId}`;
}

export function FavoritesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { cliente } = useAuth();

  const clienteId = cliente?.id ?? null;

  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [carregado, setCarregado] = useState(false);

  const storageKey = obterStorageKey(clienteId);

  /*
   * =========================================================
   * CARREGAR FAVORITOS DO CLIENTE
   * =========================================================
   */

  useEffect(() => {
    setCarregado(false);

    try {
      const favoritosSalvos =
        window.localStorage.getItem(storageKey);

      console.log(
        "Favoritos carregados:",
        storageKey,
        favoritosSalvos
      );

      if (favoritosSalvos) {
        const dados = JSON.parse(favoritosSalvos);

        if (Array.isArray(dados)) {
          setFavoritos(
            dados.filter(
              (id): id is number =>
                typeof id === "number"
            )
          );
        } else {
          setFavoritos([]);
        }
      } else {
        setFavoritos([]);
      }
    } catch (error) {
      console.error(
        "Erro ao carregar favoritos:",
        error
      );

      setFavoritos([]);
    } finally {
      setCarregado(true);
    }
  }, [storageKey]);

  /*
   * =========================================================
   * SALVAR FAVORITOS
   * =========================================================
   */

  useEffect(() => {
    if (!carregado) {
      return;
    }

    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(favoritos)
      );

      console.log(
        "Favoritos atualizados:",
        storageKey,
        favoritos
      );
    } catch (error) {
      console.error(
        "Erro ao salvar favoritos:",
        error
      );
    }
  }, [
    favoritos,
    carregado,
    storageKey,
  ]);

  /*
   * =========================================================
   * VERIFICAR FAVORITO
   * =========================================================
   */

  function isFavorito(id: number) {
    return favoritos.includes(id);
  }

  /*
   * =========================================================
   * ALTERNAR FAVORITO
   * =========================================================
   */

  function alternarFavorito(id: number) {
    setFavoritos((atuais) => {
      if (atuais.includes(id)) {
        return atuais.filter(
          (favoritoId) => favoritoId !== id
        );
      }

      return [...atuais, id];
    });
  }

  /*
   * =========================================================
   * REMOVER FAVORITO
   * =========================================================
   */

  function removerFavorito(id: number) {
    setFavoritos((atuais) =>
      atuais.filter(
        (favoritoId) => favoritoId !== id
      )
    );
  }

  /*
   * =========================================================
   * LIMPAR FAVORITOS
   * =========================================================
   */

  function limparFavoritos() {
    setFavoritos([]);

    try {
      window.localStorage.removeItem(storageKey);

      console.log(
        "Favoritos limpos:",
        storageKey
      );
    } catch (error) {
      console.error(
        "Erro ao limpar favoritos:",
        error
      );
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favoritos,
        quantidadeFavoritos: favoritos.length,
        isFavorito,
        alternarFavorito,
        removerFavorito,
        limparFavoritos,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites deve ser utilizado dentro de um FavoritesProvider."
    );
  }

  return context;
}