import Image from "next/image";
import Link from "next/link";

import {
  buscarProdutos,
  type ApiProduto,
} from "@/lib/api";

function formatarPreco(valor: string | number) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default async function Colecao() {
  let produtoColecao: ApiProduto | null = null;

  try {
    const produtos = await buscarProdutos();
    produtoColecao = produtos[0] ?? null;
  } catch (error) {
    console.error("Erro ao carregar coleção:", error);
  }

  const precoProduto = produtoColecao
    ? produtoColecao.precoOferta !== null && produtoColecao.oferta
      ? produtoColecao.precoOferta
      : produtoColecao.preco
    : null;

  return (
    <section
      id="colecoes"
      className="border-b border-[#e7dfd5] bg-[#f3eee8]"
    >
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">

        {/* Área visual */}
        <div className="relative min-h-[420px] overflow-hidden bg-[#e9dfd4] sm:min-h-[500px] lg:min-h-[620px]">

          {/* Imagem da coleção */}
          <div className="absolute inset-0">
            <Image
              src="/colecao-essencia.jpg"
              alt="Coleção Essência LUMÉA"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
            />

            {/* Camada suave */}
            <div className="pointer-events-none absolute inset-0 bg-[#1f1d1a]/10 mix-blend-multiply" />
          </div>

          {/* Moldura */}
          <div className="pointer-events-none absolute inset-5 border border-white/50 sm:inset-8 lg:inset-10" />

          {/* Identificação */}
          <div className="absolute bottom-7 left-7 drop-shadow-sm sm:bottom-10 sm:left-10 lg:bottom-12 lg:left-12">
            <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.25em] text-white/90 sm:text-[10px] sm:tracking-[0.3em]">
              LUMÉA
            </p>

            <p className="mt-1.5 font-[family-name:var(--font-cormorant)] text-xl italic text-white sm:mt-2 sm:text-2xl">
              Coleção Essência
            </p>
          </div>

          {/* Número */}
          <span className="absolute right-7 top-7 font-[family-name:var(--font-montserrat)] text-[8px] tracking-[0.18em] text-white/90 drop-shadow-sm sm:right-10 sm:top-10 sm:text-[9px] sm:tracking-[0.2em] lg:right-12 lg:top-12">
            01 / 01
          </span>
        </div>

        {/* Conteúdo */}
        <div className="flex items-center px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24 xl:px-20">
          <div className="max-w-lg">

            {/* Identificação */}
            <div className="mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4">
              <span className="h-px w-8 bg-[#b69a74] sm:w-10" />

              <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.28em] text-[#8c7355] sm:text-[10px] sm:tracking-[0.35em]">
                A nova coleção
              </span>
            </div>

            {/* Título */}
            <h2 className="font-[family-name:var(--font-cormorant)] text-[2.9rem] font-medium leading-[0.94] tracking-[-0.02em] text-[#1f1d1a] sm:text-6xl">
              Beleza que
              <span className="block italic font-normal">
                permanece.
              </span>
            </h2>

            {/* Descrição */}
            <p className="mt-6 font-[family-name:var(--font-montserrat)] text-[13px] leading-6 text-[#756f69] sm:mt-8 sm:text-sm sm:leading-7">
              Criada para celebrar a beleza dos pequenos detalhes, a coleção
              Essência reúne peças artesanais, delicadas, atemporais e
              cuidadosamente produzidas.
            </p>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-[13px] leading-6 text-[#756f69] sm:mt-5 sm:text-sm sm:leading-7">
              Peças criadas artesanalmente para acompanhar histórias,
              momentos e memórias que permanecem.
            </p>

            {/* Produto conectado à coleção */}
            {produtoColecao && (
              <div className="mt-7 border-l border-[#c9b59d] pl-4 sm:mt-8">
                <span className="font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.18em] text-[#8c7355] sm:text-[9px] sm:tracking-[0.2em]">
                  Peça em destaque
                </span>

                <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-[family-name:var(--font-cormorant)] text-xl text-[#1f1d1a] sm:text-2xl">
                    {produtoColecao.nome}
                  </span>

                  {precoProduto !== null && (
                    <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69]">
                      {formatarPreco(precoProduto)}
                    </span>
                  )}
                </div>

                <span className="mt-1 block font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.14em] text-[#9a9189]">
                  {produtoColecao.categoria.nome}
                </span>
              </div>
            )}

            {/* Ações */}
            <div className="mt-8 flex flex-col items-start gap-5 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
              <Link
                href="/produtos"
                className="inline-flex min-h-11 items-center gap-4 border-b border-[#8c7355] pb-3 font-[family-name:var(--font-montserrat)] text-[9px] font-medium uppercase tracking-[0.18em] text-[#5f5042] transition hover:text-[#8c7355] sm:gap-5 sm:text-[10px] sm:tracking-[0.2em]"
              >
                Descobrir coleção

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h13" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>

              <Link
                href="/produtos?ordenacao=menor-preco"
                className="inline-flex min-h-10 items-center font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.16em] text-[#8c7355] transition hover:text-[#1f1d1a] sm:text-[10px] sm:tracking-[0.18em]"
              >
                Ver peças
              </Link>
            </div>

            {/* Informações */}
            <div className="mt-10 grid max-w-md grid-cols-2 gap-5 border-t border-[#e0d5c9] pt-6 sm:mt-12 sm:gap-6 sm:pt-7">
              <div>
                <span className="block font-[family-name:var(--font-cormorant)] text-xl text-[#1f1d1a] sm:text-2xl">
                  Atemporal
                </span>

                <span className="mt-1 block font-[family-name:var(--font-montserrat)] text-[7px] uppercase tracking-[0.12em] text-[#8f8780] sm:text-[8px] sm:tracking-[0.15em]">
                  Estilo
                </span>
              </div>

              <div>
                <span className="block font-[family-name:var(--font-cormorant)] text-xl text-[#1f1d1a] sm:text-2xl">
                  Artesanal
                </span>

                <span className="mt-1 block font-[family-name:var(--font-montserrat)] text-[7px] uppercase tracking-[0.12em] text-[#8f8780] sm:text-[8px] sm:tracking-[0.15em]">
                  Produção
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}