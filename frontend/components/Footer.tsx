import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1f1d1a] text-[#faf8f5]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        {/* =====================================================
            BLOCO PRINCIPAL
        ====================================================== */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* =====================================================
              MARCA
          ====================================================== */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="group inline-block font-[family-name:var(--font-cormorant)] text-[2.3rem] font-medium tracking-[0.18em] transition-colors duration-300 hover:text-[#d8c7b0] sm:text-4xl"
            >
              LUMÉA
            </Link>

            <div className="mt-5 h-px w-10 bg-[#8c7355] transition-all duration-300 group-hover:w-16" />

            <p className="mt-5 max-w-md font-[family-name:var(--font-montserrat)] text-[11px] leading-7 text-[#c9bfb5] sm:text-xs sm:leading-7">
              Peças artesanais criadas com cuidado para
              celebrar a beleza dos detalhes e acompanhar
              momentos que permanecem.
            </p>

            <p className="mt-6 font-[family-name:var(--font-cormorant)] text-lg italic text-[#b69a74] sm:text-xl">
              Artesanalmente especial.
            </p>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex min-h-9 items-center gap-3 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.18em] text-[#c9bfb5] transition-colors duration-300 hover:text-white sm:mt-8 sm:text-[10px]"
            >
              <span className="h-px w-6 bg-[#8c7355]" />
              Instagram
              <span className="text-[#8c7355]">↗</span>
            </a>
          </div>

          {/* =====================================================
              NAVEGAÇÃO
          ====================================================== */}
          <div className="lg:col-span-2">
            <h3 className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.24em] text-[#b69a74] sm:text-[10px]">
              Navegação
            </h3>

            <nav className="mt-4 flex flex-col gap-1 sm:mt-5 sm:gap-2">
              {[
                ["Início", "/"],
                ["Sobre a LUMÉA", "/sobre"],
                ["Coleção", "/produtos"],
                ["Novidades", "/produtos?filtro=novidades"],
                ["Ofertas", "/produtos?filtro=ofertas"],
                ["Carrinho", "/carrinho"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="group inline-flex min-h-8 items-center font-[family-name:var(--font-montserrat)] text-[11px] text-[#c9bfb5] transition-colors duration-300 hover:text-white sm:text-xs"
                >
                  <span className="mr-0 w-0 overflow-hidden text-[#8c7355] transition-all duration-300 group-hover:mr-2 group-hover:w-2">
                    →
                  </span>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* =====================================================
              CATEGORIAS
          ====================================================== */}
          <div className="lg:col-span-2">
            <h3 className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.24em] text-[#b69a74] sm:text-[10px]">
              Categorias
            </h3>

            <nav className="mt-4 flex flex-col gap-1 sm:mt-5 sm:gap-2">
              {[
                ["Brincos", "/produtos?categoria=brincos"],
                ["Colares", "/produtos?categoria=colares"],
                ["Pulseiras", "/produtos?categoria=pulseiras"],
                ["Favoritos", "/favoritos"],
                ["Minha conta", "/minha-conta"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="group inline-flex min-h-8 items-center font-[family-name:var(--font-montserrat)] text-[11px] text-[#c9bfb5] transition-colors duration-300 hover:text-white sm:text-xs"
                >
                  <span className="mr-0 w-0 overflow-hidden text-[#8c7355] transition-all duration-300 group-hover:mr-2 group-hover:w-2">
                    →
                  </span>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* =====================================================
              ATENDIMENTO
          ====================================================== */}
          <div className="lg:col-span-3">
            <h3 className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.24em] text-[#b69a74] sm:text-[10px]">
              Atendimento
            </h3>

            <p className="mt-4 max-w-xs font-[family-name:var(--font-montserrat)] text-[11px] leading-6 text-[#c9bfb5] sm:mt-5 sm:text-xs">
              Estamos aqui para ajudar você em cada
              escolha e tornar sua experiência com a
              LUMÉA especial.
            </p>

            <Link
              href="/contato"
              className="mt-4 inline-flex min-h-9 items-center font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.16em] text-[#faf8f5] transition-colors duration-300 hover:text-[#d8c7b0] sm:mt-5 sm:text-[10px]"
            >
              Fale conosco
              <span className="ml-2 text-[#8c7355]">→</span>
            </Link>
          </div>
        </div>

        {/* =====================================================
            BLOCO INSTITUCIONAL
        ====================================================== */}
        <div className="mt-14 border-y border-white/10 py-8 sm:mt-16 sm:py-9">
          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
            {/* Compra */}
            <div className="flex gap-4">
              <span className="mt-1 font-[family-name:var(--font-cormorant)] text-xl text-[#b69a74]">
                01
              </span>

              <div>
                <span className="font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.2em] text-[#b69a74] sm:text-[9px]">
                  Compra
                </span>

                <p className="mt-2 font-[family-name:var(--font-montserrat)] text-[10px] leading-5 text-[#8f8780] sm:text-[11px]">
                  Uma experiência de compra simples,
                  cuidadosa e transparente.
                </p>
              </div>
            </div>

            {/* Atendimento */}
            <div className="flex gap-4">
              <span className="mt-1 font-[family-name:var(--font-cormorant)] text-xl text-[#b69a74]">
                02
              </span>

              <div>
                <span className="font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.2em] text-[#b69a74] sm:text-[9px]">
                  Atendimento
                </span>

                <p className="mt-2 font-[family-name:var(--font-montserrat)] text-[10px] leading-5 text-[#8f8780] sm:text-[11px]">
                  Suporte para acompanhar sua jornada
                  antes e depois da compra.
                </p>
              </div>
            </div>

            {/* Artesanal */}
            <div className="flex gap-4">
              <span className="mt-1 font-[family-name:var(--font-cormorant)] text-xl text-[#b69a74]">
                03
              </span>

              <div>
                <span className="font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.2em] text-[#b69a74] sm:text-[9px]">
                  Artesanal
                </span>

                <p className="mt-2 font-[family-name:var(--font-montserrat)] text-[10px] leading-5 text-[#8f8780] sm:text-[11px]">
                  Cuidado com os detalhes e identidade
                  presente em cada peça.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            FRASE DA MARCA
        ====================================================== */}
        <div className="py-8 text-center sm:py-10">
          <p className="font-[family-name:var(--font-cormorant)] text-xl italic tracking-wide text-[#8f8780] sm:text-2xl">
            Detalhes que permanecem.
          </p>
        </div>

        {/* =====================================================
            RODAPÉ FINAL
        ====================================================== */}
        <div className="flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="font-[family-name:var(--font-montserrat)] text-[9px] leading-5 tracking-[0.06em] text-[#756f69] sm:text-[10px]">
            © 2026 LUMÉA. Todos os direitos reservados.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/politica-de-privacidade"
              className="font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.14em] text-[#756f69] transition-colors duration-300 hover:text-[#c9bfb5] sm:text-[9px]"
            >
              Privacidade
            </Link>

            <Link
              href="/termos"
              className="font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.14em] text-[#756f69] transition-colors duration-300 hover:text-[#c9bfb5] sm:text-[9px]"
            >
              Termos
            </Link>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <span className="font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.14em] text-[#756f69] sm:text-[9px]">
              Peças artesanais & acessórios
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}