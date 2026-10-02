"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FiltrosProdutos() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoriaAtual = searchParams.get("categoria") || "";
  const buscaAtual = searchParams.get("busca") || "";
  const ordenacaoAtual = searchParams.get("ordenacao") || "";

  const [busca, setBusca] = useState(buscaAtual);

  function atualizarFiltros(
    categoria?: string,
    novaBusca?: string,
    novaOrdenacao?: string
  ) {
    const params = new URLSearchParams();

    const categoriaFinal =
      categoria !== undefined ? categoria : categoriaAtual;

    const buscaFinal =
      novaBusca !== undefined ? novaBusca : buscaAtual;

    const ordenacaoFinal =
      novaOrdenacao !== undefined
        ? novaOrdenacao
        : ordenacaoAtual;

    if (categoriaFinal) {
      params.set("categoria", categoriaFinal);
    }

    if (buscaFinal.trim()) {
      params.set("busca", buscaFinal.trim());
    }

    if (ordenacaoFinal) {
      params.set("ordenacao", ordenacaoFinal);
    }

    const query = params.toString();

    router.push(query ? `/produtos?${query}` : "/produtos");
  }

  function realizarBusca() {
    atualizarFiltros(undefined, busca, undefined);
  }

  function limparFiltros() {
    setBusca("");
    router.push("/produtos");
  }

  return (
    <div className="mb-12 border-b border-[#e7dfd5] pb-8">
      {/* Categorias */}
      <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
        <button
          type="button"
          onClick={() => atualizarFiltros("")}
          className={`font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.18em] transition ${
            !categoriaAtual
              ? "text-[#8c7355]"
              : "text-[#756f69] hover:text-[#8c7355]"
          }`}
        >
          Todas
        </button>

        <button
          type="button"
          onClick={() => atualizarFiltros("Brincos")}
          className={`font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.18em] transition ${
            categoriaAtual === "Brincos"
              ? "text-[#8c7355]"
              : "text-[#756f69] hover:text-[#8c7355]"
          }`}
        >
          Brincos
        </button>

        <button
          type="button"
          onClick={() => atualizarFiltros("Colares")}
          className={`font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.18em] transition ${
            categoriaAtual === "Colares"
              ? "text-[#8c7355]"
              : "text-[#756f69] hover:text-[#8c7355]"
          }`}
        >
          Colares
        </button>

        <button
          type="button"
          onClick={() => atualizarFiltros("Pulseiras")}
          className={`font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.18em] transition ${
            categoriaAtual === "Pulseiras"
              ? "text-[#8c7355]"
              : "text-[#756f69] hover:text-[#8c7355]"
          }`}
        >
          Pulseiras
        </button>

        <button
          type="button"
          onClick={() => atualizarFiltros("Novidades")}
          className={`font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.18em] transition ${
            categoriaAtual === "Novidades"
              ? "text-[#8c7355]"
              : "text-[#756f69] hover:text-[#8c7355]"
          }`}
        >
          Novidades
        </button>

        <button
          type="button"
          onClick={() => atualizarFiltros("Ofertas")}
          className={`font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.18em] transition ${
            categoriaAtual === "Ofertas"
              ? "text-[#8c7355]"
              : "text-[#756f69] hover:text-[#8c7355]"
          }`}
        >
          Ofertas
        </button>
      </div>

      {/* Busca + ordenação */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Busca */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            realizarBusca();
          }}
          className="flex w-full max-w-md border border-[#e7dfd5] bg-white"
        >
          <input
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar produtos..."
            className="min-w-0 flex-1 bg-transparent px-4 py-3 font-[family-name:var(--font-montserrat)] text-xs text-[#1f1d1a] outline-none placeholder:text-[#aaa29a]"
          />

          <button
            type="submit"
            aria-label="Buscar"
            className="px-4 text-[#756f69] transition hover:text-[#8c7355]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </button>
        </form>

        {/* Ordenação */}
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.16em] text-[#756f69]">
            Ordenar
          </span>

          <select
            value={ordenacaoAtual}
            onChange={(event) =>
              atualizarFiltros(
                undefined,
                undefined,
                event.target.value
              )
            }
            className="border-b border-[#d8c7b0] bg-transparent py-2 pr-8 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.12em] text-[#5f5042] outline-none"
          >
            <option value="">Padrão</option>
            <option value="menor">Menor preço</option>
            <option value="maior">Maior preço</option>
            <option value="nome">Nome A–Z</option>
          </select>
        </div>
      </div>

      {/* Limpar filtros */}
      {(categoriaAtual || buscaAtual || ordenacaoAtual) && (
        <button
          type="button"
          onClick={limparFiltros}
          className="mt-6 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.16em] text-[#8c7355] underline underline-offset-4 transition hover:text-[#1f1d1a]"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}