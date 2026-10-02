"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { useAuth } from "@/context/AuthContext";

export type CartItem = {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  quantidade: number;
};

type CartContextType = {
  itens: CartItem[];
  quantidadeTotal: number;
  subtotal: number;
  adicionarAoCarrinho: (
    produto: Omit<CartItem, "quantidade">
  ) => void;
  removerDoCarrinho: (id: number) => void;
  alterarQuantidade: (id: number, quantidade: number) => void;
  limparCarrinho: () => void;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

function obterStorageKey(clienteId?: number | null) {
  if (!clienteId) {
    return "lumea-carrinho-anonimo";
  }

  return `lumea-carrinho-cliente-${clienteId}`;
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { cliente, carregado: carregandoAuth } = useAuth();

  const clienteId = cliente?.id ?? null;

  const [itens, setItens] = useState<CartItem[]>([]);
  const [carregado, setCarregado] = useState(false);

  /*
   * =========================================================
   * CHAVE DO CARRINHO ATUAL
   * =========================================================
   */

  const storageKey = obterStorageKey(clienteId);

  /*
   * =========================================================
   * CARREGAR CARRINHO DO CLIENTE
   * =========================================================
   */

  useEffect(() => {
    if (carregandoAuth) {
      return;
    }

    setCarregado(false);

    try {
      const carrinhoSalvo =
        window.localStorage.getItem(storageKey);

      console.log(
        "Carrinho carregado:",
        storageKey,
        carrinhoSalvo
      );

      if (carrinhoSalvo) {
        const dados = JSON.parse(carrinhoSalvo);

        if (Array.isArray(dados)) {
          setItens(dados);
        } else {
          setItens([]);
        }
      } else {
        setItens([]);
      }
    } catch (error) {
      console.error(
        "Erro ao carregar carrinho:",
        error
      );

      setItens([]);
    } finally {
      setCarregado(true);
    }
  }, [storageKey, carregandoAuth]);

  /*
   * =========================================================
   * SALVAR ALTERAÇÕES DO CARRINHO
   * =========================================================
   */

  useEffect(() => {
    if (!carregado || carregandoAuth) {
      return;
    }

    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(itens)
      );

      console.log(
        "Carrinho atualizado:",
        storageKey,
        itens
      );
    } catch (error) {
      console.error(
        "Erro ao salvar carrinho:",
        error
      );
    }
  }, [itens, carregado, carregandoAuth, storageKey]);

  /*
   * =========================================================
   * ADICIONAR PRODUTO
   * =========================================================
   */

  function adicionarAoCarrinho(
    produto: Omit<CartItem, "quantidade">
  ) {
    setItens((itensAtuais) => {
      const existente = itensAtuais.find(
        (item) => item.id === produto.id
      );

      let novoCarrinho: CartItem[];

      if (existente) {
        novoCarrinho = itensAtuais.map((item) =>
          item.id === produto.id
            ? {
                ...item,
                quantidade: item.quantidade + 1,
              }
            : item
        );
      } else {
        novoCarrinho = [
          ...itensAtuais,
          {
            id: produto.id,
            nome: produto.nome,
            categoria: produto.categoria,
            preco: Number(produto.preco),
            quantidade: 1,
          },
        ];
      }

      console.log(
        "PRODUTO ADICIONADO:",
        produto.nome
      );

      console.log(
        "CARRINHO DO CLIENTE:",
        storageKey,
        novoCarrinho
      );

      return novoCarrinho;
    });
  }

  /*
   * =========================================================
   * REMOVER PRODUTO
   * =========================================================
   */

  function removerDoCarrinho(id: number) {
    setItens((itensAtuais) => {
      return itensAtuais.filter(
        (item) => item.id !== id
      );
    });
  }

  /*
   * =========================================================
   * ALTERAR QUANTIDADE
   * =========================================================
   */

  function alterarQuantidade(
    id: number,
    quantidade: number
  ) {
    if (quantidade <= 0) {
      removerDoCarrinho(id);
      return;
    }

    setItens((itensAtuais) =>
      itensAtuais.map((item) =>
        item.id === id
          ? {
              ...item,
              quantidade,
            }
          : item
      )
    );
  }

  /*
   * =========================================================
   * LIMPAR CARRINHO
   * =========================================================
   */

  function limparCarrinho() {
    setItens([]);

    try {
      window.localStorage.removeItem(storageKey);

      console.log(
        "Carrinho limpo:",
        storageKey
      );
    } catch (error) {
      console.error(
        "Erro ao limpar carrinho:",
        error
      );
    }
  }

  /*
   * =========================================================
   * TOTAL DE ITENS
   * =========================================================
   */

  const quantidadeTotal = itens.reduce(
    (total, item) =>
      total + item.quantidade,
    0
  );

  /*
   * =========================================================
   * SUBTOTAL
   * =========================================================
   */

  const subtotal = itens.reduce(
    (total, item) =>
      total +
      Number(item.preco) * item.quantidade,
    0
  );

  return (
    <CartContext.Provider
      value={{
        itens,
        quantidadeTotal,
        subtotal,
        adicionarAoCarrinho,
        removerDoCarrinho,
        alterarQuantidade,
        limparCarrinho,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart deve ser utilizado dentro de um CartProvider."
    );
  }

  return context;
}