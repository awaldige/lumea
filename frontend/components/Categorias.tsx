"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { buscarCategorias, type ApiCategoria } from "@/lib/api";

type CategoriaExibicao = ApiCategoria & {
  descricaoExibicao: string;
  numero: string;
};

const descricoes: Record<string, string> = {
  brincos: "Detalhes que iluminam",
  colares: "Elegância para cada momento",
  pulseiras: "Delicadeza em movimento",
};

const imagens: Record<string, string> = {
  brincos: "/categoria-brincos.jpg",
  colares: "/categoria-colares.jpg",
  pulseiras: "/categoria-pulseiras.jpg",
};

export default function Categorias() {
  const [categorias, setCategorias] = useState<CategoriaExibicao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const dados = await buscarCategorias();

        const categoriasFormatadas = dados
          .filter((categoria) => categoria.ativo)
          .slice(0, 3)
          .map((categoria, index) => ({
            ...categoria,
            descricaoExibicao:
              descricoes[categoria.slug] ?? "Detalhes que encantam",
            numero: String(index + 1).padStart(2, "0"),
          }));

        setCategorias(categoriasFormatadas);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      } finally {
        setCarregando(false);
      }
    }

    carregarCategorias();
  }, []);

  return (
    <section className="border-b border-[#e7dfd5] bg-[#faf8f5]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">

        {/* Cabeçalho */}
        <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end sm:gap-8">
          <div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="h-px w-8 bg-[#b69a74] sm:w-10" />

              <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.28em] text-[#8c7355] sm:text-[10px] sm:tracking-[0.3em]">
                Explore
              </span>
            </div>

            <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-[2.75rem] leading-none text-[#1f1d1a] sm:mt-5 sm:text-6xl">
              Encontre seu estilo
            </h2>
          </div>

          <Link
            href="/produtos"
            className="inline-flex min-h-10 items-center self-start border-b border-[#8c7355] pb-2 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.16em] text-[#5f5042] transition hover:text-[#8c7355] sm:self-auto sm:text-[10px] sm:tracking-[0.18em]"
          >
            Ver coleção completa
          </Link>
        </div>

        {/* Categorias */}
        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3">
          {carregando
            ? [1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="relative aspect-[4/5] animate-pulse overflow-hidden bg-[#eee5db]"
                >
                  <div className="absolute inset-4 border border-[#c9b59d]/30 sm:inset-5" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-40 w-40 rounded-full border border-[#c9b59d]/30 sm:h-48 sm:w-48" />
                  </div>
                </div>
              ))
            : categorias.map((categoria) => {
                const imagem = imagens[categoria.slug];

                return (
                  <Link
                    key={categoria.id}
                    href={`/produtos?categoria=${encodeURIComponent(
                      categoria.slug
                    )}`}
                    className="group relative overflow-hidden bg-[#eee5db]"
                  >
                    {/* Área visual */}
                    <div className="relative aspect-[4/5]">

                      {/* Imagem */}
                      {imagem && (
                        <Image
                          src={imagem}
                          alt={`${categoria.nome} - LUMÉA`}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                      )}

                      {/* Camada suave */}
                      <div className="pointer-events-none absolute inset-0 bg-[#1f1d1a]/10 transition duration-500 group-hover:bg-[#1f1d1a]/5" />

                      {/* Moldura */}
                      <div className="pointer-events-none absolute inset-4 border border-white/50 transition duration-500 group-hover:inset-6 sm:inset-5 sm:group-hover:inset-7" />

                      {/* Número */}
                      <span className="absolute left-5 top-5 font-[family-name:var(--font-montserrat)] text-[8px] tracking-[0.18em] text-white drop-shadow-sm sm:left-7 sm:top-7 sm:text-[9px] sm:tracking-[0.2em]">
                        {categoria.numero}
                      </span>

                      {/* Conteúdo */}
                      <div className="absolute bottom-6 left-5 right-16 sm:bottom-7 sm:left-7 sm:right-20">
                        <span className="font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.2em] text-white/80 drop-shadow-sm sm:text-[9px] sm:tracking-[0.22em]">
                          Categoria
                        </span>

                        <h3 className="mt-1.5 font-[family-name:var(--font-cormorant)] text-[2rem] leading-none text-white drop-shadow-sm sm:mt-2 sm:text-4xl">
                          {categoria.nome}
                        </h3>

                        <p className="mt-1 font-[family-name:var(--font-montserrat)] text-[9px] leading-5 text-white/85 drop-shadow-sm sm:text-[10px]">
                          {categoria.descricaoExibicao}
                        </p>
                      </div>

                      {/* Seta */}
                      <div className="absolute bottom-6 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 text-white transition duration-500 group-hover:bg-[#1f1d1a] group-hover:text-white sm:bottom-8 sm:right-7">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}