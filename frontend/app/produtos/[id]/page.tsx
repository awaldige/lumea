
"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";

import { buscarProduto, type ApiProduto } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

type ProdutoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function formatarPreco(valor: number) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

function obterUrlImagem(imagem?: string | null) {
  if (!imagem) {
    return null;
  }

  if (
    imagem.startsWith("http://") ||
    imagem.startsWith("https://")
  ) {
    return imagem;
  }

  return `${API_URL}${imagem.startsWith("/") ? "" : "/"}${imagem}`;
}

function nomeCategoria(produto: ApiProduto): string {
  if (
    typeof produto.categoria === "object" &&
    produto.categoria !== null &&
    "nome" in produto.categoria &&
    typeof produto.categoria.nome === "string"
  ) {
    return produto.categoria.nome;
  }

  return "";
}

function obterDetalhes(produto: ApiProduto): string[] {
  const categoria = nomeCategoria(produto).toLowerCase();

  if (categoria === "brincos") {
    return [
      "Design elegante e atemporal",
      "Acabamento cuidadosamente selecionado",
      "Ideal para ocasiões especiais ou uso diário",
    ];
  }

  if (categoria === "colares") {
    return [
      "Design sofisticado e versátil",
      "Acabamento cuidadosamente selecionado",
      "Peça ideal para diferentes ocasiões",
    ];
  }

  if (categoria === "pulseiras") {
    return [
      "Design delicado e elegante",
      "Acabamento cuidadosamente selecionado",
      "Ideal para composição",
    ];
  }

  return [
    "Design cuidadosamente selecionado",
    "Acabamento sofisticado",
    "Peça versátil",
  ];
}

function obterDisponibilidade(produto: ApiProduto) {
  const estoque = Number(produto.estoque);

  if (estoque <= 0) {
    return "Produto indisponível";
  }

  if (estoque <= 5) {
    return "Últimas unidades";
  }

  return "Em estoque";
}

export default function ProdutoPage({
  params,
}: ProdutoPageProps) {
  const { id } = use(params);

  const { adicionarAoCarrinho } = useCart();
  const { isFavorito, alternarFavorito } = useFavorites();

  const [produto, setProduto] = useState<ApiProduto | null>(null);
  const [relacionados, setRelacionados] = useState<ApiProduto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    let ativo = true;

    async function carregarProduto() {
      try {
        setCarregando(true);
        setErro(false);

        const produtoId = Number(id);

        if (!Number.isInteger(produtoId)) {
          setErro(true);
          return;
        }

        const produtoApi = await buscarProduto(produtoId);

        if (!ativo) {
          return;
        }

        setProduto(produtoApi);
        setRelacionados([]);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);

        if (ativo) {
          setErro(true);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarProduto();

    return () => {
      ativo = false;
    };
  }, [id]);

  const favorito = produto
    ? isFavorito(Number(produto.id))
    : false;

  const precoOriginal = produto
    ? Number(produto.preco)
    : 0;

  const precoOferta =
    produto?.precoOferta !== null &&
    produto?.precoOferta !== undefined
      ? Number(produto.precoOferta)
      : undefined;

  const precoFinal =
    produto?.oferta && precoOferta !== undefined
      ? precoOferta
      : precoOriginal;

  const subtotal = useMemo(
    () => precoFinal * quantidade,
    [precoFinal, quantidade]
  );

  function diminuirQuantidade() {
    setQuantidade((atual) => Math.max(1, atual - 1));
  }

  function aumentarQuantidade() {
    if (!produto) {
      return;
    }

    setQuantidade((atual) =>
      Math.min(Number(produto.estoque), atual + 1)
    );
  }

  function adicionarProduto() {
    if (!produto || Number(produto.estoque) <= 0) {
      return;
    }

    for (let i = 0; i < quantidade; i++) {
      adicionarAoCarrinho({
        id: Number(produto.id),
        nome: String(produto.nome),
        categoria: nomeCategoria(produto),
        preco: precoFinal,
      });
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#faf8f5]">
        <section className="border-b border-[#e7dfd5]">
          <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-3 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#756f69] transition hover:text-[#8c7355]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M19 12H5" />
                <path d="m11 18-6-6 6-6" />
              </svg>

              Voltar para produtos
            </Link>
          </div>
        </section>

        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-6">
          <p className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.25em] text-[#8c7355]">
            Carregando produto...
          </p>
        </div>
      </main>
    );
  }

  if (erro || !produto) {
    return (
      <main className="min-h-screen bg-[#faf8f5] px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.25em] text-[#8c7355]">
            LUMÉA
          </p>

          <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-5xl text-[#1f1d1a]">
            Produto não encontrado
          </h1>

          <Link
            href="/produtos"
            className="mt-8 inline-flex border-b border-[#8c7355] pb-2 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#5f5042]"
          >
            Voltar para produtos
          </Link>
        </div>
      </main>
    );
  }

  const detalhes = obterDetalhes(produto);
  const disponibilidade = obterDisponibilidade(produto);
  const indisponivel = Number(produto.estoque) <= 0;
  const urlImagemProduto = obterUrlImagem(produto.imagem);

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      {/* Cabeçalho */}

      <section className="border-b border-[#e7dfd5]">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12">
          <Link
            href="/produtos"
            className="inline-flex items-center gap-3 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#756f69] transition hover:text-[#8c7355]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M19 12H5" />
              <path d="m11 18-6-6 6-6" />
            </svg>

            Voltar para produtos
          </Link>
        </div>
      </section>

      {/* Produto */}

      <section>
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-20">
          {/* Imagem */}

          <div className="relative aspect-[4/5] overflow-hidden bg-[#eee5db]">
            <div className="absolute inset-6 z-10 border border-[#c9b59d]/40 pointer-events-none" />

            {urlImagemProduto ? (
              <img
                src={urlImagemProduto}
                alt={String(produto.nome)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-64 w-64 items-center justify-center rounded-full border border-[#c9b59d]/50">
                  <div className="flex h-44 w-44 items-center justify-center rounded-full border border-[#c9b59d]/40">
                    <span className="font-[family-name:var(--font-cormorant)] text-8xl italic text-[#8c7355]/60">
                      L
                    </span>
                  </div>
                </div>
              </div>
            )}

            <span className="absolute left-8 top-8 z-20 font-[family-name:var(--font-montserrat)] text-[10px] tracking-[0.25em] text-[#8c7355]">
              LUMÉA
            </span>

            {(Boolean(produto.novo) || Boolean(produto.oferta)) && (
              <div className="absolute bottom-8 left-8 z-20">
                {produto.oferta ? (
                  <span className="bg-[#1f1d1a] px-4 py-3 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.15em] text-white">
                    Oferta
                  </span>
                ) : (
                  <span className="border border-[#8c7355] bg-[#faf8f5]/95 px-4 py-3 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.15em] text-[#8c7355]">
                    Novo
                  </span>
                )}
              </div>
            )}

            {/* Favorito */}

            <button
              type="button"
              onClick={() => alternarFavorito(Number(produto.id))}
              aria-label={
                favorito
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"
              }
              aria-pressed={favorito}
              className="absolute right-8 top-8 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-[#faf8f5]/90 text-[#8c7355] backdrop-blur-sm"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill={favorito ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" />
              </svg>
            </button>
          </div>

          {/* Informações */}

          <div className="flex flex-col justify-center">
            <p className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.3em] text-[#8c7355]">
              {nomeCategoria(produto)}
            </p>

            <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-5xl font-medium text-[#1f1d1a] sm:text-6xl">
              {String(produto.nome)}
            </h1>

            <div className="mt-6">
              {produto.oferta && precoOferta !== undefined ? (
                <div className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-montserrat)] text-sm text-[#9a928b] line-through">
                    {formatarPreco(precoOriginal)}
                  </span>

                  <span className="font-[family-name:var(--font-montserrat)] text-lg font-medium text-[#8c7355]">
                    {formatarPreco(precoFinal)}
                  </span>
                </div>
              ) : (
                <span className="font-[family-name:var(--font-montserrat)] text-lg text-[#5f5042]">
                  {formatarPreco(precoFinal)}
                </span>
              )}
            </div>

            <div className="my-8 h-px w-full bg-[#e7dfd5]" />

            <p className="max-w-xl font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
              {typeof produto.descricao === "string"
                ? produto.descricao
                : String(produto.descricao ?? "")}
            </p>

            {/* Detalhes */}

            <div className="mt-8">
              <h2 className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#5f5042]">
                Detalhes
              </h2>

              <ul className="mt-4 space-y-3">
                {detalhes.map((detalhe) => (
                  <li
                    key={detalhe}
                    className="flex items-start gap-3 font-[family-name:var(--font-montserrat)] text-xs leading-6 text-[#756f69]"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#b69a74]" />
                    {detalhe}
                  </li>
                ))}
              </ul>
            </div>

            {/* Disponibilidade */}

            <div className="mt-8 flex items-center gap-3">
              <span
                className={`h-2 w-2 rounded-full ${
                  indisponivel
                    ? "bg-[#9a928b]"
                    : "bg-[#8c7355]"
                }`}
              />

              <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.16em] text-[#756f69]">
                {disponibilidade}
              </span>
            </div>

            {/* Quantidade */}

            <div className="mt-8">
              <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.18em] text-[#5f5042]">
                Quantidade
              </span>

              <div className="mt-3 flex h-12 w-36 items-center border border-[#d8c7b0]">
                <button
                  type="button"
                  onClick={diminuirQuantidade}
                  disabled={indisponivel}
                  className="flex h-full w-12 items-center justify-center text-lg text-[#756f69] transition hover:text-[#8c7355] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Diminuir quantidade"
                >
                  −
                </button>

                <span className="flex-1 text-center font-[family-name:var(--font-montserrat)] text-xs text-[#1f1d1a]">
                  {quantidade}
                </span>

                <button
                  type="button"
                  onClick={aumentarQuantidade}
                  disabled={
                    indisponivel ||
                    quantidade >= Number(produto.estoque)
                  }
                  className="flex h-full w-12 items-center justify-center text-lg text-[#756f69] transition hover:text-[#8c7355] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>
            </div>

            {/* Subtotal */}

            <div className="mt-6 flex items-center justify-between border-t border-[#e7dfd5] pt-5">
              <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.18em] text-[#756f69]">
                Subtotal
              </span>

              <span className="font-[family-name:var(--font-montserrat)] text-sm font-medium text-[#5f5042]">
                {formatarPreco(subtotal)}
              </span>
            </div>

            {/* Adicionar */}

            <button
              type="button"
              onClick={adicionarProduto}
              disabled={indisponivel}
              className="mt-6 w-full bg-[#1f1d1a] px-6 py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.22em] text-white transition hover:bg-[#8c7355] disabled:cursor-not-allowed disabled:bg-[#9a928b]"
            >
              {indisponivel
                ? "Produto indisponível"
                : "Adicionar ao carrinho"}
            </button>

            {/* Entrega */}

            <div className="mt-8 border-t border-[#e7dfd5] pt-6">
              <div className="flex gap-4">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mt-1 shrink-0 text-[#8c7355]"
                >
                  <path d="M3 6h11v10H3z" />
                  <path d="M14 10h4l3 3v3h-7z" />
                  <circle cx="7" cy="18" r="2" />
                  <circle cx="18" cy="18" r="2" />
                </svg>

                <div>
                  <h3 className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.18em] text-[#5f5042]">
                    Entrega
                  </h3>

                  <p className="mt-2 font-[family-name:var(--font-montserrat)] text-xs leading-6 text-[#756f69]">
                    Consulte as opções de entrega disponíveis no
                    checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Relacionados */}

      {relacionados.length > 0 && (
        <section className="border-t border-[#e7dfd5]">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
            <div className="flex items-end justify-between gap-6">
              <div>
                <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.3em] text-[#8c7355]">
                  LUMÉA
                </span>

                <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl text-[#1f1d1a] sm:text-5xl">
                  Você também pode gostar
                </h2>
              </div>

              <Link
                href="/produtos"
                className="hidden border-b border-[#8c7355] pb-2 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.18em] text-[#5f5042] sm:block"
              >
                Ver coleção
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((item) => {
                const itemPreco =
                  item.oferta &&
                  item.precoOferta !== null &&
                  item.precoOferta !== undefined
                    ? Number(item.precoOferta)
                    : Number(item.preco);

                const urlImagemRelacionada =
                  obterUrlImagem(item.imagem);

                return (
                  <Link
                    key={String(item.id)}
                    href={`/produtos/${item.id}`}
                    className="group"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#eee5db]">
                      <div className="absolute inset-5 z-10 border border-[#c9b59d]/40 pointer-events-none" />

                      {urlImagemRelacionada ? (
                        <img
                          src={urlImagemRelacionada}
                          alt={String(item.nome)}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-32 w-32 items-center justify-center rounded-full border border-[#c9b59d]/50 transition duration-500 group-hover:scale-105">
                            <span className="font-[family-name:var(--font-cormorant)] text-5xl italic text-[#8c7355]/60">
                              L
                            </span>
                          </div>
                        </div>
                      )}

                      <span className="absolute left-6 top-6 z-20 font-[family-name:var(--font-montserrat)] text-[9px] tracking-[0.2em] text-[#8c7355]">
                        LUMÉA
                      </span>
                    </div>

                    <div className="pt-5">
                      <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#8c7355]">
                        {nomeCategoria(item)}
                      </p>

                      <h3 className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a] transition group-hover:text-[#8c7355]">
                        {String(item.nome)}
                      </h3>

                      <span className="mt-2 block font-[family-name:var(--font-montserrat)] text-xs text-[#5f5042]">
                        {formatarPreco(itemPreco)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

