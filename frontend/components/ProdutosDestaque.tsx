
import Link from "next/link";

import ProductCard from "@/components/ProductCard";

import { buscarProdutos, type ApiProduto } from "@/lib/api";

function formatarPreco(valor: string | number) {
  return Number(valor).toFixed(2).replace(".", ",");
}

export default async function ProdutosDestaque() {
  let produtosDestaque: ApiProduto[] = [];

  try {
    const produtos = await buscarProdutos();

    produtosDestaque = produtos
      .filter((produto) => produto.destaque)
      .slice(0, 4);
  } catch (error) {
    console.error(
      "Erro ao carregar produtos em destaque:",
      error
    );
  }

  return (
    <section
      id="ofertas"
      className="border-b border-[#e7dfd5] bg-[#faf8f5]"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">

        {/* Cabeçalho */}
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end md:gap-8">
          <div>
            <div className="mb-4 flex items-center gap-3 sm:mb-5 sm:gap-4">
              <span className="h-px w-8 bg-[#b69a74] sm:w-10" />

              <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.28em] text-[#8c7355] sm:text-[10px] sm:tracking-[0.35em]">
                Seleção LUMÉA
              </span>
            </div>

            <h2 className="font-[family-name:var(--font-cormorant)] text-[2.9rem] font-medium leading-none tracking-[-0.02em] text-[#1f1d1a] sm:text-6xl">
              Peças em destaque.
            </h2>

            <p className="mt-4 max-w-xl font-[family-name:var(--font-montserrat)] text-[13px] leading-6 text-[#756f69] sm:mt-5 sm:text-sm sm:leading-7">
              Uma seleção de peças artesanais que traduzem a essência
              da LUMÉA: delicadeza, elegância e personalidade.
            </p>
          </div>

          {/* Link para catálogo */}
          <Link
            href="/produtos"
            className="inline-flex min-h-10 items-center gap-3 self-start border-b border-[#8c7355] pb-2 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.16em] text-[#5f5042] transition hover:text-[#8c7355] md:self-auto md:text-[10px] md:tracking-[0.2em]"
          >
            Ver todas

            <svg
              width="16"
              height="16"
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
        </div>

        {/* Produtos */}
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:mt-14 sm:gap-x-6 sm:gap-y-14 lg:mt-16 lg:grid-cols-4">
          {produtosDestaque.map((produto, index) => (
            <div
              key={produto.id}
              className="relative min-w-0"
            >
              {/* Número da seleção */}
              <div className="mb-3 flex items-center justify-between sm:mb-4">
                <span className="font-[family-name:var(--font-montserrat)] text-[7px] uppercase tracking-[0.14em] text-[#aaa29a] sm:text-[8px] sm:tracking-[0.2em]">
                  Seleção artesanal
                </span>

                <span className="font-[family-name:var(--font-montserrat)] text-[7px] tracking-[0.16em] text-[#aaa29a] sm:text-[8px] sm:tracking-[0.2em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <ProductCard
                id={produto.id}
                nome={produto.nome}
                categoria={produto.categoria.nome}
                preco={`R$ ${formatarPreco(produto.preco)}`}
                precoNumero={Number(produto.preco)}
                novo={produto.novo}
                oferta={produto.oferta}
                precoOferta={
                  produto.precoOferta !== null
                    ? Number(produto.precoOferta)
                    : undefined
                }
                imagem={produto.imagem}
              />
            </div>
          ))}
        </div>

        {/* Rodapé */}
        <div className="mt-12 flex flex-col gap-5 border-t border-[#e7dfd5] pt-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between sm:pt-7">
          <div>
            <p className="font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.16em] text-[#8c7355] sm:text-[9px] sm:tracking-[0.18em]">
              Produção artesanal LUMÉA
            </p>

            <p className="mt-1.5 font-[family-name:var(--font-cormorant)] text-base italic text-[#756f69] sm:mt-2 sm:text-lg">
              Cada detalhe importa.
            </p>
          </div>

          <Link
            href="/produtos?ordenacao=nome"
            className="inline-flex min-h-10 items-center self-start font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.16em] text-[#8c7355] transition hover:text-[#1f1d1a] sm:self-auto sm:text-[10px] sm:tracking-[0.18em]"
          >
            Explorar por nome →
          </Link>
        </div>
      </div>
    </section>
  );
}



