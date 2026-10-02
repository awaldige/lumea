"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Produto = {
  id: number;
  nome: string;
  slug: string;
  descricao: string;
  preco: string | number;
  precoOferta: string | number | null;
  estoque: number;
  ativo: boolean;
  destaque: boolean;
  novo: boolean;
  oferta: boolean;
  imagem: string | null;
  categoria?: {
    id: number;
    nome: string;
    slug: string;
  } | null;
};

export default function AdminProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState("");

  async function carregarProdutos() {
    const token = localStorage.getItem("lumea_token");

    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    try {
      setErro("");

      const resposta = await fetch(
        `${API_URL}/api/produtos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const dados = await resposta.json();

      if (
        resposta.status === 401 ||
        resposta.status === 403
      ) {
        window.location.href = "/admin/login";
        return;
      }

      if (!resposta.ok) {
        throw new Error(
          dados?.mensagem ||
            "Não foi possível carregar os produtos."
        );
      }

      if (Array.isArray(dados)) {
        setProdutos(dados);
      } else if (
        dados &&
        Array.isArray(dados.produtos)
      ) {
        setProdutos(dados.produtos);
      } else {
        setProdutos([]);
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os produtos."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return produtos;
    }

    return produtos.filter((produto) => {
      return (
        produto.nome.toLowerCase().includes(termo) ||
        produto.slug.toLowerCase().includes(termo) ||
        produto.categoria?.nome
          ?.toLowerCase()
          .includes(termo)
      );
    });
  }, [produtos, busca]);

  function formatarPreco(
    preco: string | number
  ) {
    const valor =
      typeof preco === "number"
        ? preco
        : Number(preco);

    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  async function excluirProduto(produto: Produto) {
    const confirmar = window.confirm(
      `Deseja realmente excluir o produto "${produto.nome}"?\n\nO produto será inativado e deixará de aparecer na loja.`
    );

    if (!confirmar) {
      return;
    }

    const token = localStorage.getItem("lumea_token");

    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    try {
      setExcluindoId(produto.id);
      setErro("");
      setMensagem("");

      const resposta = await fetch(
        `${API_URL}/api/produtos/${produto.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados = await resposta.json();

      if (
        resposta.status === 401 ||
        resposta.status === 403
      ) {
        window.location.href = "/admin/login";
        return;
      }

      if (!resposta.ok) {
        throw new Error(
          dados?.mensagem ||
            "Não foi possível excluir o produto."
        );
      }

      setProdutos((produtosAtuais) =>
        produtosAtuais.filter(
          (item) => item.id !== produto.id
        )
      );

      setMensagem(
        dados?.mensagem ||
          "Produto excluído com sucesso."
      );

      setTimeout(() => {
        setMensagem("");
      }, 4000);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o produto."
      );
    } finally {
      setExcluindoId(null);
    }
  }

  if (carregando) {
    return (
      <div className="p-6 lg:p-10">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#756f69]">
            Carregando produtos...
          </p>
        </div>
      </div>
    );
  }

  if (erro && produtos.length === 0) {
    return (
      <div className="p-6 lg:p-10">
        <div className="border border-[#e2d9ce] bg-white p-8">
          <p className="font-montserrat text-sm text-[#7a5143]">
            {erro}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[#8c7355]">
              Administração
            </p>

            <h1 className="mt-2 font-cormorant text-4xl font-medium sm:text-5xl">
              Produtos
            </h1>

            <p className="mt-3 font-montserrat text-sm text-[#756f69]">
              Gerencie os produtos cadastrados na loja.
            </p>
          </div>

          <Link
            href="/admin/produtos/novo"
            className="inline-flex items-center justify-center bg-[#1f1d1a] px-5 py-3 font-montserrat text-[9px] uppercase tracking-[0.18em] text-white transition hover:bg-[#8c7355]"
          >
            Novo produto
          </Link>
        </div>

        {/* Mensagem de sucesso */}
        {mensagem && (
          <div className="mb-6 border border-[#d8c7b0] bg-[#f3eee8] px-5 py-4">
            <p className="font-montserrat text-sm text-[#5f5042]">
              {mensagem}
            </p>
          </div>
        )}

        {/* Erro */}
        {erro && produtos.length > 0 && (
          <div className="mb-6 border border-[#e2d9ce] bg-white px-5 py-4">
            <p className="font-montserrat text-sm text-[#7a5143]">
              {erro}
            </p>
          </div>
        )}

        {/* Busca */}
        <div className="mb-6 border border-[#e2d9ce] bg-white p-5">
          <label className="block font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
            Buscar produto
          </label>

          <input
            type="text"
            value={busca}
            onChange={(event) =>
              setBusca(event.target.value)
            }
            placeholder="Nome, slug ou categoria..."
            className="mt-3 w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
          />
        </div>

        {/* Tabela */}
        <div className="overflow-hidden border border-[#e2d9ce] bg-white">

          <div className="border-b border-[#e2d9ce] px-5 py-4">
            <p className="font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
              {produtosFiltrados.length} produto
              {produtosFiltrados.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          {produtosFiltrados.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-cormorant text-2xl">
                Nenhum produto encontrado
              </p>

              <p className="mt-2 font-montserrat text-xs text-[#756f69]">
                Tente alterar os termos da busca.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] table-fixed">

                <thead>
                  <tr className="border-b border-[#e2d9ce] bg-[#f5f2ed]">

                    <th className="w-[27%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Produto
                    </th>

                    <th className="w-[16%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Categoria
                    </th>

                    <th className="w-[15%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Preço
                    </th>

                    <th className="w-[10%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Estoque
                    </th>

                    <th className="w-[12%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Status
                    </th>

                    <th className="w-[20%] px-5 py-4 text-right font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Ações
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {produtosFiltrados.map(
                    (produto) => (
                      <tr
                        key={produto.id}
                        className="border-b border-[#eee7df] last:border-b-0"
                      >

                        <td className="px-5 py-5">
                          <p className="truncate font-cormorant text-xl">
                            {produto.nome}
                          </p>

                          <p className="mt-1 truncate font-montserrat text-[10px] text-[#756f69]">
                            {produto.slug}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="truncate font-montserrat text-xs text-[#5f5042]">
                            {produto.categoria?.nome ||
                              "Sem categoria"}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-montserrat text-xs font-medium">
                            {formatarPreco(
                              produto.preco
                            )}
                          </p>

                          {produto.precoOferta && (
                            <p className="mt-1 whitespace-nowrap font-montserrat text-[10px] text-[#8c7355]">
                              Oferta:{" "}
                              {formatarPreco(
                                produto.precoOferta
                              )}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-montserrat text-xs">
                            {produto.estoque}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex px-2 py-1 font-montserrat text-[8px] uppercase tracking-[0.12em] ${
                              produto.ativo
                                ? "bg-[#e7eee4] text-[#4f6547]"
                                : "bg-[#eee7e2] text-[#756f69]"
                            }`}
                          >
                            {produto.ativo
                              ? "Ativo"
                              : "Inativo"}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center justify-end gap-4 whitespace-nowrap">

                            <Link
                              href={`/admin/produtos/${produto.id}/editar`}
                              className="font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#8c7355] transition hover:text-[#1f1d1a]"
                            >
                              Editar
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                excluirProduto(produto)
                              }
                              disabled={
                                excluindoId === produto.id ||
                                !produto.ativo
                              }
                              className="font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#9a6758] transition hover:text-[#7a5143] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {excluindoId === produto.id
                                ? "Excluindo..."
                                : produto.ativo
                                  ? "Excluir"
                                  : "Inativo"}
                            </button>

                          </div>
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}