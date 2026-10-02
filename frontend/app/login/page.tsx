"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();

  const {
    login,
    autenticado,
    carregado,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (carregado && autenticado) {
      router.replace("/minha-conta");
    }
  }, [carregado, autenticado, router]);

  function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErro("");

    if (!email.trim() || !senha) {
      setErro("Preencha seu e-mail e sua senha.");
      return;
    }

    setCarregando(true);

    const sucesso = login(email, senha);

    if (!sucesso) {
      setErro(
        "E-mail ou senha incorretos."
      );
      setCarregando(false);
      return;
    }

    router.push("/minha-conta");
  }

  if (!carregado) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf8f5]">
        <p className="font-[family-name:var(--font-montserrat)] text-xs uppercase tracking-[0.2em] text-[#756f69]">
          Carregando...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5]">

      {/* Cabeçalho */}
      <header className="border-b border-[#e7dfd5]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10 lg:px-12">

          <Link
            href="/"
            className="font-[family-name:var(--font-cormorant)] text-3xl tracking-[0.25em] text-[#1f1d1a]"
          >
            LUMÉA
          </Link>

          <Link
            href="/cadastro"
            className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#756f69] transition hover:text-[#8c7355]"
          >
            Criar conta
          </Link>

        </div>
      </header>

      {/* Login */}
      <section className="px-6 py-16 sm:px-10 lg:py-24">

        <div className="mx-auto max-w-xl">

          <div className="text-center">

            <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.35em] text-[#8c7355]">
              LUMÉA
            </span>

            <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-5xl font-medium text-[#1f1d1a] sm:text-6xl">
              Bem-vindo de volta
            </h1>

            <p className="mx-auto mt-5 max-w-md font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
              Entre na sua conta para acompanhar seus
              pedidos e acessar suas preferências.
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="mt-12"
          >

            {/* E-mail */}
            <div>

              <label
                htmlFor="email"
                className="mb-2 block font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#5f5042]"
              >
                E-mail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                placeholder="seuemail@exemplo.com"
                className="h-14 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
              />

            </div>

            {/* Senha */}
            <div className="mt-6">

              <label
                htmlFor="senha"
                className="mb-2 block font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#5f5042]"
              >
                Senha
              </label>

              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(event) =>
                  setSenha(event.target.value)
                }
                autoComplete="current-password"
                placeholder="Digite sua senha"
                className="h-14 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
              />

            </div>

            {/* Erro */}
            {erro && (
              <div className="mt-6 border border-[#d8c7b0] bg-[#f3eee8] px-4 py-4">

                <p className="font-[family-name:var(--font-montserrat)] text-xs leading-5 text-[#8c7355]">
                  {erro}
                </p>

              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={carregando}
              className="mt-8 flex h-14 w-full items-center justify-center bg-[#1f1d1a] px-6 font-[family-name:var(--font-montserrat)] text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando
                ? "Entrando..."
                : "Entrar"}
            </button>

          </form>

          {/* Cadastro */}
          <div className="mt-10 border-t border-[#e7dfd5] pt-8 text-center">

            <p className="font-[family-name:var(--font-montserrat)] text-xs text-[#756f69]">
              Ainda não possui uma conta?
            </p>

            <Link
              href="/cadastro"
              className="mt-3 inline-block font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.18em] text-[#8c7355] transition hover:text-[#1f1d1a]"
            >
              Criar minha conta
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}