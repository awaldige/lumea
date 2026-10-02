
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useState,
} from "react";

import ProductCard from "@/components/ProductCard";

import {
  buscarCategorias,
  buscarProdutos,
  type ApiCategoria,
  type ApiProduto,
} from "@/lib/api";

function formatarPreco(valor: string | number) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function ProdutosConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoriaSelecionada =
    searchParams.get("categoria") ?? "";

  const colecaoSelecionada =
    searchParams.get("colecao") ?? "";

  const buscaSelecionada =
    searchParams.get("busca") ?? "";

  const ordenacaoSelecionada =
    searchParams.get("ordenacao") ?? "mais-recentes";

  const filtroSelecionado =
    searchParams.get("filtro") ?? "";

  const [produtos, setProdutos] = useState<ApiProduto[]>([]);
  const [categorias, setCategorias] = useState<ApiCategoria[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarCatalogo() {
      setCarregando(true);

      try {
        const [produtosApi, categoriasApi] =
          await Promise.all([
            buscarProdutos({
              categoria:
                categoriaSelecionada || undefined,
              colecao:
                colecaoSelecionada || undefined,
              busca:
                buscaSelecionada || undefined,
              ordenacao:
                ordenacaoSelecionada || undefined,
            }),
            buscarCategorias(),
          ]);

        if (!ativo) return;

        let produtosFiltrados = produtosApi;

        if (filtroSelecionado === "novidades") {
          produtosFiltrados = produtosFiltrados.filter(
            (produto) => produto.novo
          );
        }

        if (filtroSelecionado === "ofertas") {
          produtosFiltrados = produtosFiltrados.filter(
            (produto) => produto.oferta
          );
        }

        setProdutos(produtosFiltrados);
        setCategorias(categoriasApi);
      } catch (error) {
        console.error(
          "Erro ao carregar catálogo:",
          error
        );

        if (ativo) {
          setProdutos([]);
          setCategorias([]);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarCatalogo();

    return () => {
      ativo = false;
    };
  }, [
    categoriaSelecionada,
    colecaoSelecionada,
    buscaSelecionada,
    ordenacaoSelecionada,
    filtroSelecionado,
  ]);

  const categoriaAtual = categorias.find(
    (categoria) =>
      categoria.slug === categoriaSelecionada
  );

  const tituloCatalogo =
    filtroSelecionado === "novidades"
      ? "Novidades"
      : filtroSelecionado === "ofertas"
        ? "Ofertas"
        : categoriaAtual?.nome ??
          (colecaoSelecionada
            ? "Coleção"
            : "Nossa coleção");

  const subtituloCatalogo =
    filtroSelecionado === "novidades"
      ? "Descubra as peças mais recentes da LUMÉA."
      : filtroSelecionado === "ofertas"
        ? "Peças selecionadas com condições especiais."
        : categoriaAtual?.descricao ??
          "Peças artesanais criadas com cuidado, delicadeza e identidade.";

  const quantidadeProdutos = produtos.length;

  const possuiFiltros = Boolean(
    categoriaSelecionada ||
      colecaoSelecionada ||
      buscaSelecionada ||
      filtroSelecionado ||
      ordenacaoSelecionada !== "mais-recentes"
  );

  function montarUrl(
    alteracoes: Record<string, string | undefined>
  ) {
    const query = new URLSearchParams(
      searchParams.toString()
    );

    Object.entries(alteracoes).forEach(
      ([chave, valor]) => {
        if (valor) {
          query.set(chave, valor);
        } else {
          query.delete(chave);
        }
      }
    );

    const queryString = query.toString();

    return queryString
      ? `/produtos?${queryString}`
      : "/produtos";
  }

  /*
   * Navegação principal da coleção.
   *
   * Categoria, coleção, novidades e ofertas são
   * tratados como filtros exclusivos.
   *
   * Assim, ao selecionar uma nova opção, a anterior
   * deixa de ficar marcada.
   */
  function montarUrlColecao(
    tipo:
      | "todas"
      | "categoria"
      | "colecao"
      | "novidades"
      | "ofertas",
    valor?: string
  ) {
    const query = new URLSearchParams(
      searchParams.toString()
    );

    // Remove todos os filtros exclusivos
    query.delete("categoria");
    query.delete("colecao");
    query.delete("filtro");

    if (tipo === "categoria" && valor) {
      query.set("categoria", valor);
    }

    if (tipo === "colecao" && valor) {
      query.set("colecao", valor);
    }

    if (tipo === "novidades") {
      query.set("filtro", "novidades");
    }

    if (tipo === "ofertas") {
      query.set("filtro", "ofertas");
    }

    const queryString = query.toString();

    return queryString
      ? `/produtos?${queryString}`
      : "/produtos";
  }

  function alterarOrdenacao(valor: string) {
    const url = montarUrl({
      ordenacao:
        valor === "mais-recentes"
          ? undefined
          : valor,
    });

    router.push(url);
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#1f1d1a]">
      {/* Cabeçalho */}

      <section className="border-b border-[#e7dfd5] bg-[#f3eee8]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="flex flex-col gap-8">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-3 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.18em] text-[#756f69] transition hover:text-[#8c7355]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M19 12H5" />
                <path d="m11 18-6-6 6-6" />
              </svg>

              Voltar para início
            </Link>

            <div>
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="h-px w-8 bg-[#b69a74] sm:w-10" />

                <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.28em] text-[#8c7355] sm:text-[10px] sm:tracking-[0.35em]">
                  LUMÉA
                </span>
              </div>

              <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-[3.1rem] font-medium leading-none tracking-[-0.02em] text-[#1f1d1a] sm:text-6xl lg:text-7xl">
                {tituloCatalogo}.
              </h1>

              <p className="mt-5 max-w-2xl font-[family-name:var(--font-montserrat)] text-[12px] leading-6 text-[#756f69] sm:text-sm sm:leading-7">
                {subtituloCatalogo}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros */}

      <section className="border-b border-[#e7dfd5] bg-[#faf8f5]">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-5">
            {/* Busca */}

            <form
              action="/produtos"
              method="get"
              className="flex flex-col gap-3 sm:flex-row"
            >
              {categoriaSelecionada && (
                <input
                  type="hidden"
                  name="categoria"
                  value={categoriaSelecionada}
                />
              )}

              {colecaoSelecionada && (
                <input
                  type="hidden"
                  name="colecao"
                  value={colecaoSelecionada}
                />
              )}

              {filtroSelecionado && (
                <input
                  type="hidden"
                  name="filtro"
                  value={filtroSelecionado}
                />
              )}

              <div className="flex flex-1 items-center border border-[#d8c7b0] bg-white">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="ml-4 shrink-0 text-[#8c7355]"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="6"
                  />
                  <path d="m16 16 4 4" />
                </svg>

                <input
                  type="search"
                  name="busca"
                  defaultValue={buscaSelecionada}
                  placeholder="Buscar uma peça..."
                  className="h-12 w-full bg-transparent px-4 font-[family-name:var(--font-montserrat)] text-xs text-[#1f1d1a] outline-none placeholder:text-[#aaa29a]"
                />
              </div>

              <button
                type="submit"
                className="h-12 border border-[#8c7355] px-7 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.18em] text-[#5f5042] transition hover:bg-[#8c7355] hover:text-white"
              >
                Buscar
              </button>
            </form>

            {/* Navegação de filtros */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {/* Todas */}

                <Link
                  href={montarUrlColecao("todas")}
                  className={`border px-4 py-2 font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.15em] transition ${
                    !categoriaSelecionada &&
                    !colecaoSelecionada &&
                    !filtroSelecionado
                      ? "border-[#8c7355] bg-[#8c7355] text-white"
                      : "border-[#d8c7b0] text-[#756f69] hover:border-[#8c7355] hover:text-[#8c7355]"
                  }`}
                >
                  Todas
                </Link>

                {/* Categorias */}

                {categorias.map(
                  (categoria) => (
                    <Link
                      key={categoria.id}
                      href={montarUrlColecao(
                        "categoria",
                        categoria.slug
                      )}
                      className={`border px-4 py-2 font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.15em] transition ${
                        categoriaSelecionada ===
                        categoria.slug
                          ? "border-[#8c7355] bg-[#8c7355] text-white"
                          : "border-[#d8c7b0] text-[#756f69] hover:border-[#8c7355] hover:text-[#8c7355]"
                      }`}
                    >
                      {categoria.nome}
                    </Link>
                  )
                )}

                {/* Novidades */}

                <Link
                  href={montarUrlColecao(
                    "novidades"
                  )}
                  className={`border px-4 py-2 font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.15em] transition ${
                    filtroSelecionado ===
                    "novidades"
                      ? "border-[#8c7355] bg-[#8c7355] text-white"
                      : "border-[#d8c7b0] text-[#756f69] hover:border-[#8c7355] hover:text-[#8c7355]"
                  }`}
                >
                  Novidades
                </Link>

                {/* Ofertas */}

                <Link
                  href={montarUrlColecao(
                    "ofertas"
                  )}
                  className={`border px-4 py-2 font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.15em] transition ${
                    filtroSelecionado ===
                    "ofertas"
                      ? "border-[#8c7355] bg-[#8c7355] text-white"
                      : "border-[#d8c7b0] text-[#756f69] hover:border-[#8c7355] hover:text-[#8c7355]"
                  }`}
                >
                  Ofertas
                </Link>
              </div>

              {/* Ordenação */}

              <div className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.15em] text-[#9a928b]">
                  Ordenar
                </span>

                <select
                  value={ordenacaoSelecionada}
                  onChange={(event) =>
                    alterarOrdenacao(
                      event.target.value
                    )
                  }
                  aria-label="Ordenar produtos"
                  className="h-9 border border-[#d8c7b0] bg-white px-3 font-[family-name:var(--font-montserrat)] text-[9px] text-[#756f69] outline-none transition focus:border-[#8c7355]"
                >
                  <option value="mais-recentes">
                    Mais recentes
                  </option>

                  <option value="menor-preco">
                    Menor preço
                  </option>

                  <option value="maior-preco">
                    Maior preço
                  </option>
                </select>
              </div>
            </div>

            {/* Limpar */}

            {possuiFiltros && (
              <div>
                <Link
                  href="/produtos"
                  className="font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.16em] text-[#8c7355] transition hover:text-[#1f1d1a]"
                >
                  Limpar filtros
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Produtos */}

      <section>
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="mb-8 flex items-end justify-between border-b border-[#e7dfd5] pb-5 sm:mb-10">
            <div>
              <span className="font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.18em] text-[#8c7355]">
                Seleção LUMÉA
              </span>

              <p className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a] sm:text-3xl">
                {carregando
                  ? "Carregando peças..."
                  : `${quantidadeProdutos} ${
                      quantidadeProdutos === 1
                        ? "peça encontrada"
                        : "peças encontradas"
                    }`}
              </p>
            </div>
          </div>

          {carregando ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4">
              {Array.from({ length: 4 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="min-w-0"
                  >
                    <div className="mb-3 h-3 w-20 animate-pulse bg-[#eee5db]" />

                    <div className="aspect-[4/5] animate-pulse bg-[#eee5db]" />

                    <div className="mt-4 h-4 w-2/3 animate-pulse bg-[#eee5db]" />

                    <div className="mt-2 h-3 w-1/3 animate-pulse bg-[#eee5db]" />
                  </div>
                )
              )}
            </div>
          ) : produtos.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4">
              {produtos.map(
                (produto, index) => (
                  <div
                    key={produto.id}
                    className="relative min-w-0"
                  >
                    <div className="mb-3 flex items-center justify-between sm:mb-4">
                      <span className="font-[family-name:var(--font-montserrat)] text-[7px] uppercase tracking-[0.14em] text-[#aaa29a] sm:text-[8px] sm:tracking-[0.2em]">
                        {produto.novo
                          ? "Novidade"
                          : produto.oferta
                            ? "Oferta"
                            : "Seleção artesanal"}
                      </span>

                      <span className="font-[family-name:var(--font-montserrat)] text-[7px] tracking-[0.16em] text-[#aaa29a] sm:text-[8px] sm:tracking-[0.2em]">
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>
                    </div>

                    <ProductCard
                      id={produto.id}
                      nome={produto.nome}
                      categoria={
                        produto.categoria.nome
                      }
                      preco={`R$ ${Number(
                        produto.preco
                      )
                        .toFixed(2)
                        .replace(".", ",")}`}
                      precoNumero={Number(
                        produto.preco
                      )}
                      novo={produto.novo}
                      oferta={produto.oferta}
                      precoOferta={
                        produto.precoOferta !==
                        null
                          ? Number(
                              produto.precoOferta
                            )
                          : undefined
                      }
                      imagem={produto.imagem}
                    />
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="border border-[#e2d8cc] bg-[#f3eee8] px-6 py-16 text-center sm:px-10 sm:py-20">
              <span className="font-[family-name:var(--font-cormorant)] text-5xl italic text-[#c9b59d]">
                L
              </span>

              <h2 className="mt-5 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                Nenhuma peça encontrada.
              </h2>

              <p className="mx-auto mt-3 max-w-md font-[family-name:var(--font-montserrat)] text-xs leading-6 text-[#756f69]">
                Tente alterar os filtros ou
                realizar uma nova busca.
              </p>

              <Link
                href="/produtos"
                className="mt-7 inline-flex min-h-10 items-center border-b border-[#8c7355] pb-2 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.18em] text-[#5f5042] transition hover:text-[#8c7355]"
              >
                Ver todas as peças
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function ProdutosPage() {
  return (
    <Suspense fallback={null}>
      <ProdutosConteudo />
    </Suspense>
  );
}
