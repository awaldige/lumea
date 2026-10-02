"use client";

import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

const recursosPublicos = [
  {
    numero: "01",
    titulo: "Coleção",
    descricao:
      "Explore nossas peças artesanais organizadas por categorias, novidades e ofertas.",
    href: "/produtos",
    link: "Explorar coleção",
  },
  {
    numero: "02",
    titulo: "Detalhes das peças",
    descricao:
      "Conheça cada peça, seus detalhes, disponibilidade, preço e produtos relacionados.",
    href: "/produtos/1",
    link: "Conhecer uma peça",
  },
  {
    numero: "03",
    titulo: "A essência artesanal",
    descricao:
      "Conheça o cuidado, a delicadeza e a atenção aos detalhes presentes na proposta da LUMÉA.",
    href: "/sobre",
    link: "Conhecer a LUMÉA",
  },
  {
    numero: "04",
    titulo: "Atendimento",
    descricao:
      "Entre em contato com a LUMÉA para tirar dúvidas e receber atendimento durante sua experiência.",
    href: "/contato",
    link: "Falar conosco",
  },
];

const recursosCliente = [
  {
    numero: "05",
    titulo: "Sua seleção",
    descricao:
      "Salve as peças que mais combinam com você e encontre novamente suas escolhas favoritas.",
    href: "/favoritos",
    link: "Ver sua seleção",
  },
  {
    numero: "06",
    titulo: "Acompanhe seu pedido",
    descricao:
      "Consulte seus pedidos e acompanhe as informações e o status de cada compra realizada.",
    href: "/pedidos",
    link: "Ver meus pedidos",
  },
];

const institucionais = [
  {
    titulo: "Sobre a LUMÉA",
    href: "/sobre",
  },
  {
    titulo: "Contato",
    href: "/contato",
  },
  {
    titulo: "Privacidade",
    href: "/politica-de-privacidade",
  },
  {
    titulo: "Termos de Uso",
    href: "/termos",
  },
  {
    titulo: "Trocas e Devoluções",
    href: "/trocas-e-devolucoes",
  },
];

export default function ExperienciaLumea() {
  const { autenticado, carregado } = useAuth();

  const recursos = [
    ...recursosPublicos,
    ...(carregado && autenticado ? recursosCliente : []),
  ];

  const clienteLogado = carregado && autenticado;

  return (
    <section className="border-b border-[#e7dfd5] bg-[#faf8f5]">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        {/* Cabeçalho */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-[#b69a74]" />

            <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.35em] text-[#8c7355]">
              Experiência LUMÉA
            </span>
          </div>

          <h2 className="mt-6 font-[family-name:var(--font-cormorant)] text-5xl font-medium leading-[1] tracking-[-0.02em] text-[#1f1d1a] sm:text-6xl">
            Uma experiência pensada
            <span className="block italic font-normal">
              em cada detalhe.
            </span>
          </h2>

          <p className="mt-7 max-w-2xl font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
            Da descoberta das peças artesanais ao momento da compra, cada
            etapa da experiência LUMÉA foi pensada para ser simples,
            elegante e especial.
          </p>
        </div>

        {/* Cards */}
        <div
          className={`mt-14 grid gap-5 sm:grid-cols-2 ${
            clienteLogado ? "lg:grid-cols-3" : "lg:grid-cols-2"
          }`}
        >
          {recursos.map((recurso) => (
            <article
              key={recurso.numero}
              className="group flex min-h-[310px] flex-col border border-[#e2d8cc] bg-[#faf8f5] px-7 py-9 transition-all duration-300 hover:border-[#c9b59d] hover:bg-[#f3eee8] sm:px-9 sm:py-10"
            >
              <div className="flex items-start justify-between">
                <span className="font-[family-name:var(--font-montserrat)] text-[9px] tracking-[0.25em] text-[#8c7355]">
                  {recurso.numero}
                </span>

                <span className="font-[family-name:var(--font-cormorant)] text-2xl italic text-[#c9b59d] transition-transform duration-300 group-hover:scale-110">
                  L
                </span>
              </div>

              <h3 className="mt-8 font-[family-name:var(--font-cormorant)] text-3xl font-medium leading-tight text-[#1f1d1a]">
                {recurso.titulo}
              </h3>

              <p className="mt-4 max-w-md font-[family-name:var(--font-montserrat)] text-xs leading-6 text-[#756f69]">
                {recurso.descricao}
              </p>

              <div className="mt-auto pt-8">
                <Link
                  href={recurso.href}
                  className="inline-flex items-center gap-3 border-b border-[#8c7355] pb-2 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.18em] text-[#5f5042] transition hover:text-[#8c7355]"
                >
                  {recurso.link}

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Institucional */}
        <div className="mt-16 border-t border-[#e7dfd5] pt-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.25em] text-[#8c7355]">
                LUMÉA
              </span>

              <h3 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-medium text-[#1f1d1a] sm:text-4xl">
                Conheça nossa essência.
              </h3>

              <p className="mt-3 max-w-xl font-[family-name:var(--font-montserrat)] text-xs leading-6 text-[#756f69]">
                Conheça melhor a proposta artesanal, o atendimento e as
                condições da experiência LUMÉA.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-4 lg:max-w-xl lg:justify-end">
              {institucionais.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.15em] text-[#756f69] transition hover:text-[#8c7355]"
                >
                  {item.titulo}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Assinatura da marca */}
        <div className="mt-14 grid gap-5 border-t border-[#e7dfd5] pt-8 sm:grid-cols-3">
          <div>
            <span className="block font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
              Artesanal
            </span>

            <span className="mt-1 block font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.18em] text-[#9a928b]">
              Produção cuidadosa
            </span>
          </div>

          <div>
            <span className="block font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
              Atemporal
            </span>

            <span className="mt-1 block font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.18em] text-[#9a928b]">
              Estética clássica
            </span>
          </div>

          <div>
            <span className="block font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
              Especial
            </span>

            <span className="mt-1 block font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.18em] text-[#9a928b]">
              Cada detalhe importa
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}