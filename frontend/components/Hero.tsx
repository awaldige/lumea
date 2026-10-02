import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#e7dfd5] bg-[#faf8f5]">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        {/* Conteúdo */}
        <div className="flex items-center px-6 py-20 sm:px-10 sm:py-24 lg:px-12 lg:py-32 xl:px-20">
          <div className="max-w-2xl">
            {/* Identificação */}
            <div className="mb-6 flex items-center gap-3 sm:mb-7 sm:gap-4">
              <span className="h-px w-8 bg-[#b69a74] sm:w-10" />

              <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.28em] text-[#8c7355] sm:text-[10px] sm:tracking-[0.35em]">
                Nova coleção
              </span>
            </div>

            {/* Título */}
            <h1 className="font-[family-name:var(--font-cormorant)] text-[3.4rem] font-medium leading-[0.92] tracking-[-0.025em] text-[#1f1d1a] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              Elegância
              <span className="block italic font-normal">
                em cada detalhe.
              </span>
            </h1>

            {/* Descrição */}
            <p className="mt-7 max-w-xl font-[family-name:var(--font-montserrat)] text-[13px] leading-6 text-[#756f69] sm:mt-8 sm:text-sm sm:leading-7">
              Peças artesanais criadas com cuidado para
              transformar momentos especiais em memórias
              inesquecíveis.
            </p>

            {/* Links */}
            <div className="mt-9 flex flex-col gap-5 sm:mt-10 sm:flex-row sm:items-center sm:gap-7">
              <Link
                href="/produtos"
                className="inline-flex min-h-11 w-fit items-center gap-4 border-b border-[#8c7355] pb-3 font-[family-name:var(--font-montserrat)] text-[9px] font-medium uppercase tracking-[0.18em] text-[#5f5042] transition hover:text-[#8c7355] sm:gap-5 sm:text-[10px] sm:tracking-[0.2em]"
              >
                Explorar coleção

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
                href="/produtos?filtro=novidades"
                className="inline-flex min-h-10 w-fit items-center font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.16em] text-[#8c7355] transition hover:text-[#1f1d1a] sm:text-[10px] sm:tracking-[0.18em]"
              >
                Ver novidades
              </Link>
            </div>

            {/* Indicadores */}
            <div className="mt-12 grid max-w-md grid-cols-2 gap-6 border-t border-[#e7dfd5] pt-6 sm:mt-14 sm:gap-8 sm:pt-7">
              <div>
                <span className="block font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a] sm:text-3xl">
                  08
                </span>

                <span className="mt-1 block font-[family-name:var(--font-montserrat)] text-[7px] uppercase tracking-[0.16em] text-[#9a928b] sm:text-[8px] sm:tracking-[0.18em]">
                  Peças artesanais
                </span>
              </div>

              <div>
                <span className="block font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a] sm:text-3xl">
                  03
                </span>

                <span className="mt-1 block font-[family-name:var(--font-montserrat)] text-[7px] uppercase tracking-[0.16em] text-[#9a928b] sm:text-[8px] sm:tracking-[0.18em]">
                  Categorias
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual com a imagem */}
        <div className="relative min-h-[440px] overflow-hidden bg-[#e9dfd4] sm:min-h-[540px] lg:min-h-[680px]">
          {/* Imagem principal */}
          <Image
            src="/hero-brinco.jpg"
            alt="Brinco artesanal da LUMÉA"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-700 hover:scale-105"
          />

          {/* Camada suave sobre a imagem */}
          <div className="pointer-events-none absolute inset-0 bg-[#1f1d1a]/10 mix-blend-multiply" />

          {/* Moldura elegante */}
          <div className="pointer-events-none absolute inset-5 border border-white/40 sm:inset-8 lg:inset-10" />

          {/* Identificação sobre a imagem */}
          <div className="absolute bottom-7 left-7 drop-shadow-sm sm:bottom-10 sm:left-10 lg:bottom-12 lg:left-12">
            <p className="font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.25em] text-white/90 sm:text-[9px] sm:tracking-[0.3em]">
              LUMÉA
            </p>

            <p className="mt-1.5 font-[family-name:var(--font-cormorant)] text-xl italic text-white sm:text-2xl">
              Peças artesanais
            </p>
          </div>

          {/* Indicador */}
          <span className="absolute right-7 top-7 font-[family-name:var(--font-montserrat)] text-[8px] tracking-[0.18em] text-white/90 drop-shadow-sm sm:right-10 sm:top-10 sm:text-[9px] sm:tracking-[0.2em] lg:right-12 lg:top-12">
            01 / 01
          </span>
        </div>
      </div>
    </section>
  );
}