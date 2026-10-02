"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { produtos } from "@/lib/products";

export default function Header() {
  const { quantidadeTotal } = useCart();

  const { quantidadeFavoritos } = useFavorites();

  const { cliente, autenticado, carregado } = useAuth();

  const [pesquisaAberta, setPesquisaAberta] = useState(false);
  const [termo, setTermo] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);

  const resultados =
    termo.trim() === ""
      ? []
      : produtos.filter((produto) => {
          const busca = termo.toLowerCase().trim();

          return (
            produto.nome.toLowerCase().includes(busca) ||
            produto.categoria.toLowerCase().includes(busca)
          );
        });

  function abrirPesquisa() {
    setPesquisaAberta(true);
    setMenuAberto(false);
  }

  function fecharPesquisa() {
    setPesquisaAberta(false);
    setTermo("");
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  function alternarMenu() {
    setMenuAberto((atual) => !atual);
    setPesquisaAberta(false);
  }

  /*
   * Fecha menu e pesquisa com ESC
   */
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        fecharPesquisa();
        fecharMenu();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /*
   * Impede o scroll da página quando o menu
   * mobile ou a pesquisa estiverem abertos.
   */
  useEffect(() => {
    const bloqueado = menuAberto || pesquisaAberta;

    document.body.style.overflow = bloqueado ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAberto, pesquisaAberta]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e7dfd5] bg-[#faf8f5]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            onClick={fecharMenu}
            className="shrink-0 font-[family-name:var(--font-cormorant)] text-2xl font-semibold tracking-[0.18em] text-[#1f1d1a] transition hover:text-[#8c7355] sm:text-3xl sm:tracking-[0.22em]"
          >
            LUMÉA
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden items-center gap-7 md:flex lg:gap-10">
            <Link
              href="/#inicio"
              className="py-2 font-[family-name:var(--font-montserrat)] text-xs uppercase tracking-[0.18em] text-[#1f1d1a] transition hover:text-[#8c7355]"
            >
              Início
            </Link>

            <Link
              href="/produtos"
              className="py-2 font-[family-name:var(--font-montserrat)] text-xs uppercase tracking-[0.18em] text-[#1f1d1a] transition hover:text-[#8c7355]"
            >
              Joias
            </Link>

            <Link
              href="/#colecoes"
              className="py-2 font-[family-name:var(--font-montserrat)] text-xs uppercase tracking-[0.18em] text-[#1f1d1a] transition hover:text-[#8c7355]"
            >
              Coleções
            </Link>

            <Link
              href="/produtos?categoria=Ofertas"
              className="py-2 font-[family-name:var(--font-montserrat)] text-xs uppercase tracking-[0.18em] text-[#756f69] transition hover:text-[#8c7355]"
            >
              Ofertas
            </Link>
          </nav>

          {/* Ações */}
          <div className="flex shrink-0 items-center gap-4 sm:gap-5">
            {/* Pesquisa */}
            <button
              type="button"
              aria-label="Pesquisar"
              onClick={abrirPesquisa}
              className="flex h-9 w-9 items-center justify-center text-[#1f1d1a] transition hover:text-[#8c7355]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 5 5" />
              </svg>
            </button>

            {/* Conta desktop/tablet */}
            {carregado && (
              <Link
                href={autenticado ? "/minha-conta" : "/login"}
                aria-label={autenticado ? "Minha conta" : "Entrar"}
                className="hidden h-9 w-9 items-center justify-center text-[#1f1d1a] transition hover:text-[#8c7355] sm:flex"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c.8-3.5 3.1-5.5 7-5.5s6.2 2 7 5.5" />
                </svg>
              </Link>
            )}

            {/* Favoritos — somente logado */}
            {carregado && autenticado && (
              <Link
                href="/favoritos"
                aria-label={`Favoritos com ${quantidadeFavoritos} produtos`}
                className="relative hidden h-9 w-9 items-center justify-center text-[#1f1d1a] transition hover:text-[#8c7355] sm:flex"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={quantidadeFavoritos > 0 ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" />
                </svg>

                {quantidadeFavoritos > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8c7355] px-1 text-[9px] text-white">
                    {quantidadeFavoritos}
                  </span>
                )}
              </Link>
            )}

            {/* Carrinho */}
            <Link
              href="/carrinho"
              aria-label={`Carrinho com ${quantidadeTotal} itens`}
              className="relative flex h-9 w-9 items-center justify-center text-[#1f1d1a] transition hover:text-[#8c7355]"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 8h16l-1 12H5L4 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>

              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8c7355] px-1 text-[9px] text-white">
                {quantidadeTotal}
              </span>
            </Link>

            {/* Menu mobile */}
            <button
              type="button"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuAberto}
              onClick={alternarMenu}
              className="flex h-9 w-9 items-center justify-center text-[#1f1d1a] transition hover:text-[#8c7355] md:hidden"
            >
              {menuAberto ? (
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              ) : (
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {menuAberto && (
          <div className="border-t border-[#e7dfd5] bg-[#faf8f5] md:hidden">
            <nav className="mx-auto max-w-7xl px-5 py-4 sm:px-6">
              <div className="flex flex-col">
                <Link
                  href="/#inicio"
                  onClick={fecharMenu}
                  className="border-b border-[#e7dfd5] py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#5f5042] transition hover:text-[#8c7355]"
                >
                  Início
                </Link>

                <Link
                  href="/produtos"
                  onClick={fecharMenu}
                  className="border-b border-[#e7dfd5] py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#5f5042] transition hover:text-[#8c7355]"
                >
                  Joias
                </Link>

                <Link
                  href="/#colecoes"
                  onClick={fecharMenu}
                  className="border-b border-[#e7dfd5] py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#5f5042] transition hover:text-[#8c7355]"
                >
                  Coleções
                </Link>

                <Link
                  href="/produtos?categoria=Ofertas"
                  onClick={fecharMenu}
                  className="border-b border-[#e7dfd5] py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#5f5042] transition hover:text-[#8c7355]"
                >
                  Ofertas
                </Link>

                {/* Conta mobile */}
                {carregado && (
                  <Link
                    href={autenticado ? "/minha-conta" : "/login"}
                    onClick={fecharMenu}
                    className="border-b border-[#e7dfd5] py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#5f5042] transition hover:text-[#8c7355]"
                  >
                    {autenticado
                      ? `Minha conta${
                          cliente?.nome
                            ? ` — ${cliente.nome.split(" ")[0]}`
                            : ""
                        }`
                      : "Entrar"}
                  </Link>
                )}

                {/* Favoritos mobile — somente logado */}
                {carregado && autenticado && (
                  <Link
                    href="/favoritos"
                    onClick={fecharMenu}
                    className="border-b border-[#e7dfd5] py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#5f5042] transition hover:text-[#8c7355]"
                  >
                    Favoritos ({quantidadeFavoritos})
                  </Link>
                )}

                {/* Carrinho mobile */}
                <Link
                  href="/carrinho"
                  onClick={fecharMenu}
                  className="py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#5f5042] transition hover:text-[#8c7355]"
                >
                  Carrinho ({quantidadeTotal})
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Painel de pesquisa */}
      {pesquisaAberta && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#faf8f5]">
          <div className="mx-auto min-h-full max-w-4xl px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between gap-4 border-b border-[#e7dfd5] pb-6">
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.3em] text-[#8c7355]">
                  LUMÉA
                </p>

                <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a] sm:text-3xl">
                  Pesquisar produtos
                </h2>
              </div>

              <button
                type="button"
                onClick={fecharPesquisa}
                aria-label="Fechar pesquisa"
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#d8c7b0] text-[#756f69] transition hover:border-[#8c7355] hover:text-[#8c7355]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            {/* Campo */}
            <div className="relative mt-7 sm:mt-8">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7355]"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 5 5" />
              </svg>

              <input
                autoFocus
                type="search"
                value={termo}
                onChange={(event) => setTermo(event.target.value)}
                placeholder="Digite o nome da joia..."
                className="h-14 w-full border border-[#d8c7b0] bg-white pl-12 pr-12 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
              />

              {termo && (
                <button
                  type="button"
                  onClick={() => setTermo("")}
                  aria-label="Limpar pesquisa"
                  className="absolute right-4 top-1/2 flex -translate-y-1/2 text-[#8f8780] transition hover:text-[#8c7355]"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Resultados */}
            <div className="mt-8">
              {termo.trim() === "" ? (
                <div className="py-12 text-center">
                  <p className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#8f8780]">
                    Encontre sua próxima peça
                  </p>

                  <p className="mt-3 font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a]">
                    Pesquise por nome ou categoria
                  </p>
                </div>
              ) : resultados.length > 0 ? (
                <div>
                  <p className="mb-5 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#8f8780]">
                    {resultados.length}{" "}
                    {resultados.length === 1
                      ? "produto encontrado"
                      : "produtos encontrados"}
                  </p>

                  <div className="divide-y divide-[#e7dfd5] border-y border-[#e7dfd5]">
                    {resultados.map((produto) => (
                      <Link
                        key={produto.id}
                        href={`/produtos/${produto.id}`}
                        onClick={fecharPesquisa}
                        className="flex items-center gap-4 py-5 transition hover:bg-[#f3eee8] sm:gap-5"
                      >
                        {/* Imagem */}
                        <div className="flex h-20 w-16 shrink-0 items-center justify-center bg-[#eee5db]">
                          <span className="font-[family-name:var(--font-cormorant)] text-3xl italic text-[#8c7355]/60">
                            L
                          </span>
                        </div>

                        {/* Informações */}
                        <div className="min-w-0 flex-1">
                          <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.18em] text-[#8c7355]">
                            {produto.categoria}
                          </p>

                          <h3 className="mt-1 truncate font-[family-name:var(--font-cormorant)] text-xl text-[#1f1d1a] sm:text-2xl">
                            {produto.nome}
                          </h3>

                          <p className="mt-1 line-clamp-2 font-[family-name:var(--font-montserrat)] text-[11px] leading-5 text-[#756f69] sm:text-xs">
                            {produto.descricao}
                          </p>

                          {/* Preço mobile */}
                          <span className="mt-2 block font-[family-name:var(--font-montserrat)] text-xs text-[#5f5042] sm:hidden">
                            R$ {produto.preco.toFixed(2).replace(".", ",")}
                          </span>
                        </div>

                        {/* Preço desktop */}
                        <div className="hidden shrink-0 sm:block">
                          <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#5f5042]">
                            R$ {produto.preco.toFixed(2).replace(".", ",")}
                          </span>
                        </div>

                        {/* Seta */}
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="shrink-0 text-[#8c7355]"
                        >
                          <path d="M5 12h13" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d8c7b0]">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="11" cy="11" r="6.5" />
                      <path d="m16 16 5 5" />
                    </svg>
                  </div>

                  <h3 className="mt-6 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                    Nenhum produto encontrado
                  </h3>

                  <p className="mt-3 font-[family-name:var(--font-montserrat)] text-xs text-[#756f69]">
                    Tente pesquisar por outro nome ou categoria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}