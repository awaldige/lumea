import Link from "next/link";

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#1f1d1a]">
      {/* Cabeçalho */}
      <section className="border-b border-[#e7dfd5]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#b69a74]" />

              <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.35em] text-[#8c7355]">
                Sobre a LUMÉA
              </span>
            </div>

            <h1 className="mt-7 font-[family-name:var(--font-cormorant)] text-6xl font-medium leading-[0.95] tracking-[-0.02em] sm:text-7xl lg:text-8xl">
              Beleza criada
              <br />
              com cuidado.
            </h1>

            <p className="mt-8 max-w-2xl font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
              A LUMÉA nasceu para valorizar a beleza dos detalhes e
              transformar peças artesanais em parte de momentos especiais,
              unindo delicadeza, personalidade e uma estética atemporal.
            </p>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="border-b border-[#e7dfd5] bg-[#f3eee8]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="relative min-h-[460px] overflow-hidden bg-[#e9dfd4]">
            <div className="absolute inset-8 border border-[#c9b59d]/50 sm:inset-12" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-[#c9b59d]/60 sm:h-80 sm:w-80">
                <div className="absolute h-48 w-48 rounded-full border border-[#c9b59d]/50 sm:h-60 sm:w-60" />

                <div className="absolute h-32 w-32 rounded-full border border-[#c9b59d]/40 sm:h-44 sm:w-44" />

                <span className="font-[family-name:var(--font-cormorant)] text-[120px] italic text-[#8c7355]/40 sm:text-[150px]">
                  L
                </span>
              </div>
            </div>

            <span className="absolute bottom-8 left-8 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.25em] text-[#8c7355] sm:bottom-10 sm:left-10">
              LUMÉA
            </span>
          </div>

          <div className="flex items-center px-8 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24 xl:px-20">
            <div className="max-w-lg">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-[#b69a74]" />

                <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.3em] text-[#8c7355]">
                  Nosso propósito
                </span>
              </div>

              <h2 className="mt-6 font-[family-name:var(--font-cormorant)] text-5xl font-medium leading-[1] sm:text-6xl">
                O valor está nos detalhes.
              </h2>

              <p className="mt-8 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                Acreditamos que uma peça pode representar muito mais do que
                um acessório. Ela pode acompanhar histórias, marcar momentos
                e fazer parte de lembranças especiais.
              </p>

              <p className="mt-5 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                Por isso, valorizamos o caráter artesanal e o cuidado presente
                em cada detalhe, buscando criar uma experiência que una
                beleza, delicadeza e personalidade.
              </p>

              <p className="mt-5 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                Na LUMÉA, cada escolha faz parte de uma proposta: oferecer
                peças que tenham presença, identidade e significado para quem
                as escolhe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="border-b border-[#e7dfd5] bg-[#faf8f5]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#b69a74]" />

              <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.3em] text-[#8c7355]">
                Essência LUMÉA
              </span>
            </div>

            <h2 className="mt-6 font-[family-name:var(--font-cormorant)] text-5xl font-medium sm:text-6xl">
              O que nos inspira.
            </h2>
          </div>

          <div className="mt-14 grid gap-px bg-[#d8c7b0] md:grid-cols-3">
            <article className="bg-[#faf8f5] px-8 py-10 sm:px-10 sm:py-12">
              <span className="font-[family-name:var(--font-montserrat)] text-[9px] tracking-[0.25em] text-[#8c7355]">
                01
              </span>

              <h3 className="mt-8 font-[family-name:var(--font-cormorant)] text-3xl">
                Artesanal
              </h3>

              <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-6 text-[#756f69]">
                Valorizamos o caráter artesanal e os detalhes que contribuem
                para dar identidade a cada peça.
              </p>
            </article>

            <article className="bg-[#faf8f5] px-8 py-10 sm:px-10 sm:py-12">
              <span className="font-[family-name:var(--font-montserrat)] text-[9px] tracking-[0.25em] text-[#8c7355]">
                02
              </span>

              <h3 className="mt-8 font-[family-name:var(--font-cormorant)] text-3xl">
                Atemporal
              </h3>

              <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-6 text-[#756f69]">
                Buscamos uma estética que valorize a beleza e acompanhe
                diferentes estilos e momentos.
              </p>
            </article>

            <article className="bg-[#faf8f5] px-8 py-10 sm:px-10 sm:py-12">
              <span className="font-[family-name:var(--font-montserrat)] text-[9px] tracking-[0.25em] text-[#8c7355]">
                03
              </span>

              <h3 className="mt-8 font-[family-name:var(--font-cormorant)] text-3xl">
                Cuidado
              </h3>

              <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-6 text-[#756f69]">
                Cada etapa é pensada para proporcionar uma experiência
                especial, desde a escolha da peça até a entrega.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Chamada final */}
      <section className="bg-[#1f1d1a]">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:px-10 lg:px-12 lg:py-24">
          <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.3em] text-[#b69a74]">
            LUMÉA
          </span>

          <h2 className="mx-auto mt-5 max-w-3xl font-[family-name:var(--font-cormorant)] text-5xl font-medium leading-[1] text-[#faf8f5] sm:text-6xl">
            Peças artesanais criadas com cuidado para momentos que
            permanecem.
          </h2>

          <Link
            href="/produtos"
            className="mt-10 inline-flex items-center justify-center border border-[#8c7355] px-7 py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#faf8f5] transition hover:bg-[#8c7355]"
          >
            Conhecer a coleção
          </Link>
        </div>
      </section>
    </main>
  );
}