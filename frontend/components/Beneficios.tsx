export default function Beneficios() {
  const beneficios = [
    {
      numero: "01",
      titulo: "Compra segura",
      descricao:
        "Seus dados protegidos durante toda a experiência de compra.",
      icone: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <rect x="5" y="10" width="14" height="10" rx="1" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      ),
    },
    {
      numero: "02",
      titulo: "Envio especial",
      descricao:
        "Cada pedido preparado com cuidado para chegar até você.",
      icone: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M3 6h11v10H3z" />
          <path d="M14 10h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      ),
    },
    {
      numero: "03",
      titulo: "Atendimento",
      descricao:
        "Um atendimento próximo para ajudar em cada escolha.",
      icone: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M4 12a8 8 0 0 1 16 0" />
          <path d="M4 12v5a2 2 0 0 0 2 2h2" />
          <path d="M20 12v5a2 2 0 0 1-2 2h-2" />
          <path d="M8 19h4" />
        </svg>
      ),
    },
  ];

  return (
    <section className="border-b border-[#e7dfd5] bg-[#f3eee8]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-6 border-b border-[#d8c7b0] pb-8 sm:pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="h-px w-8 bg-[#b69a74] sm:w-10" />

              <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.28em] text-[#8c7355] sm:text-[10px] sm:tracking-[0.35em]">
                Experiência LUMÉA
              </span>
            </div>

            <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-[2.9rem] font-medium leading-none tracking-[-0.02em] text-[#1f1d1a] sm:mt-5 sm:text-6xl">
              Pensada para você.
            </h2>
          </div>

          <p className="max-w-md font-[family-name:var(--font-montserrat)] text-[11px] leading-6 text-[#756f69] sm:text-xs md:text-right">
            Cada detalhe da experiência LUMÉA foi pensado para tornar
            sua escolha mais tranquila, especial e segura.
          </p>
        </div>

        {/* Benefícios */}
        <div className="mt-8 grid gap-px bg-[#d8c7b0] sm:mt-10 md:grid-cols-3">
          {beneficios.map((beneficio) => (
            <article
              key={beneficio.numero}
              className="group bg-[#f3eee8] px-6 py-8 transition-colors duration-300 hover:bg-[#eee5db] sm:px-8 sm:py-10 lg:px-10 lg:py-12"
            >
              <div className="flex items-start justify-between">
                <span className="font-[family-name:var(--font-montserrat)] text-[8px] tracking-[0.22em] text-[#8c7355] sm:text-[9px] sm:tracking-[0.25em]">
                  {beneficio.numero}
                </span>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c9b59d] text-[#8c7355] transition duration-500 group-hover:scale-105 group-hover:bg-[#faf8f5]">
                  {beneficio.icone}
                </div>
              </div>

              <h3 className="mt-7 font-[family-name:var(--font-cormorant)] text-[1.75rem] font-medium leading-none text-[#1f1d1a] sm:mt-8 sm:text-3xl">
                {beneficio.titulo}
              </h3>

              <p className="mt-3 max-w-xs font-[family-name:var(--font-montserrat)] text-[11px] leading-6 text-[#756f69] sm:mt-4 sm:text-xs">
                {beneficio.descricao}
              </p>

              <div className="mt-7 h-px w-8 bg-[#b69a74] transition-all duration-500 group-hover:w-14 sm:mt-8" />
            </article>
          ))}
        </div>

        {/* Assinatura */}
        <div className="mt-8 flex flex-col gap-2 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span className="font-[family-name:var(--font-montserrat)] text-[7px] uppercase tracking-[0.22em] text-[#9a928b] sm:text-[8px] sm:tracking-[0.25em]">
            LUMÉA
          </span>

          <span className="font-[family-name:var(--font-cormorant)] text-base italic text-[#756f69] sm:text-lg">
            Essencialmente elegante
          </span>
        </div>
      </div>
    </section>
  );
}