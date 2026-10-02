"use client";

import Link from "next/link";

import { useFavorites } from "@/context/FavoritesContext";
import { produtos } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export default function FavoritosPage() {
  const {
    favoritos,
    removerFavorito,
    limparFavoritos,
  } = useFavorites();

  const { adicionarAoCarrinho } = useCart();

  const produtosFavoritos = produtos.filter((produto) =>
    favoritos.includes(produto.id)
  );

  function adicionarCarrinho(
    produto: (typeof produtos)[number]
  ) {
    adicionarAoCarrinho({
      id: produto.id,
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco,
    });

    alert(`${produto.nome} foi adicionado ao carrinho.`);
  }

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      {/* Cabeçalho */}
      <section className="border-b border-[#e7dfd5]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12">
          <Link
            href="/"
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

            Voltar
          </Link>

          <div className="mt-10 flex items-center gap-4">
            <span className="h-px w-10 bg-[#b69a74]" />

            <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.35em] text-[#8c7355]">
              LUMÉA
            </span>
          </div>

          <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-[family-name:var(--font-cormorant)] text-6xl font-medium tracking-[-0.02em] text-[#1f1d1a] sm:text-7xl">
                Favoritos
              </h1>

              <p className="mt-5 max-w-xl font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                Suas peças selecionadas para guardar e revisitar quando
                quiser.
              </p>
            </div>

            {produtosFavoritos.length > 0 && (
              <button
                type="button"
                onClick={limparFavoritos}
                className="w-fit border-b border-[#d8c7b0] pb-1 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.18em] text-[#756f69] transition hover:border-[#8c7355] hover:text-[#8c7355]"
              >
                Limpar favoritos
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
          {produtosFavoritos.length === 0 ? (
            <div className="flex min-h-[45vh] items-center justify-center">
              <div className="max-w-lg text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#d8c7b0]">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" />
                  </svg>
                </div>

                <h2 className="mt-7 font-[family-name:var(--font-cormorant)] text-4xl text-[#1f1d1a]">
                  Nenhum favorito ainda
                </h2>

                <p className="mt-4 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                  Explore nossa coleção e salve as peças que mais combinam
                  com você.
                </p>

                <Link
                  href="/produtos"
                  className="mt-8 inline-flex bg-[#1f1d1a] px-8 py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355]"
                >
                  Explorar joias
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between border-b border-[#e7dfd5] pb-5">
                <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#8f8780]">
                  {produtosFavoritos.length}{" "}
                  {produtosFavoritos.length === 1
                    ? "peça salva"
                    : "peças salvas"}
                </p>
              </div>

              <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {produtosFavoritos.map((produto) => (
                  <article
                    key={produto.id}
                    className="group"
                  >
                    {/* Imagem */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#eee5db]">
                      <Link
                        href={`/produtos/${produto.id}`}
                        aria-label={`Ver ${produto.nome}`}
                        className="absolute inset-0"
                      >
                        <div className="absolute inset-5 border border-[#c9b59d]/40" />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-36 w-36 items-center justify-center rounded-full border border-[#c9b59d]/50 transition duration-500 group-hover:scale-105">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#c9b59d]/40">
                              <span className="font-[family-name:var(--font-cormorant)] text-5xl italic text-[#8c7355]/60">
                                L
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="absolute left-6 top-6 font-[family-name:var(--font-montserrat)] text-[9px] tracking-[0.2em] text-[#8c7355]">
                          LUMÉA
                        </span>
                      </Link>

                      {/* Remover favorito */}
                      <button
                        type="button"
                        onClick={() =>
                          removerFavorito(produto.id)
                        }
                        aria-label={`Remover ${produto.nome} dos favoritos`}
                        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#faf8f5]/90 text-[#8c7355] shadow-sm backdrop-blur-sm transition hover:bg-white"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" />
                        </svg>
                      </button>
                    </div>

                    {/* Informações */}
                    <div className="pt-5">
                      <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#8c7355]">
                        {produto.categoria}
                      </p>

                      <Link href={`/produtos/${produto.id}`}>
                        <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl font-medium text-[#1f1d1a] transition hover:text-[#8c7355]">
                          {produto.nome}
                        </h2>
                      </Link>

                      <div className="mt-3 flex items-center justify-between gap-4">
                        <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#5f5042]">
                          R${" "}
                          {produto.preco
                            .toFixed(2)
                            .replace(".", ",")}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            adicionarCarrinho(produto)
                          }
                          className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.15em] text-[#756f69] transition hover:text-[#8c7355]"
                        >
                          + Carrinho
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}