"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type RespostaRecuperacao = {
  sucesso?: boolean;
  mensagem?: string;
  linkRecuperacao?: string;
};

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [linkRecuperacao, setLinkRecuperacao] = useState("");

  async function enviarSolicitacao(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMensagem("");
    setErro("");
    setLinkRecuperacao("");
    setCarregando(true);

    try {
      const resposta = await fetch(
        `${API_URL}/api/auth/esqueci-senha`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const dados =
        (await resposta.json()) as RespostaRecuperacao;

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
            "Não foi possível processar a solicitação."
        );
      }

      setMensagem(
        dados.mensagem ||
          "Se o e-mail estiver cadastrado, as instruções de recuperação serão disponibilizadas."
      );

      /*
       * Em desenvolvimento, o backend disponibiliza
       * o link para teste.
       *
       * Em produção, esse link não deve ser exibido.
       */
      if (dados.linkRecuperacao) {
        setLinkRecuperacao(dados.linkRecuperacao);
      }

      setEmail("");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível processar a solicitação."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] px-6 py-12 text-[#1f1d1a]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-10 text-center">
            <p className="font-montserrat text-[10px] uppercase tracking-[0.35em] text-[#8c7355]">
              Administração
            </p>

            <h1 className="mt-3 font-cormorant text-5xl font-medium tracking-[0.08em]">
              LUMÉA
            </h1>

            <p className="mt-3 font-montserrat text-sm text-[#756f69]">
              Recuperação de senha
            </p>
          </div>

          <form
            onSubmit={enviarSolicitacao}
            className="border border-[#e7dfd5] bg-white p-7 shadow-[0_18px_50px_rgba(31,29,26,0.05)] sm:p-9"
          >
            <div>
              <h2 className="font-cormorant text-2xl font-medium text-[#1f1d1a]">
                Esqueceu sua senha?
              </h2>

              <p className="mt-2 font-montserrat text-xs leading-relaxed text-[#756f69]">
                Informe o e-mail cadastrado para iniciar a
                recuperação da sua senha administrativa.
              </p>
            </div>

            <div className="mt-6">
              <label
                htmlFor="email"
                className="mb-2 block font-montserrat text-[10px] font-medium uppercase tracking-[0.18em] text-[#5f5042]"
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
                required
                autoComplete="email"
                autoFocus
                placeholder="Digite seu e-mail"
                className="w-full border border-[#e7dfd5] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
              />
            </div>

            {erro && (
              <div className="mt-5 border border-[#dcc9bd] bg-[#faf4f0] px-4 py-3">
                <p className="font-montserrat text-xs leading-relaxed text-[#7a5143]">
                  {erro}
                </p>
              </div>
            )}

            {mensagem && (
              <div className="mt-5 border border-[#d8c7b0] bg-[#f7f3ed] px-4 py-3">
                <p className="font-montserrat text-xs leading-relaxed text-[#5f5042]">
                  {mensagem}
                </p>
              </div>
            )}

            {linkRecuperacao && (
              <div className="mt-5 border border-[#d8c7b0] bg-[#faf8f5] p-4">
                <p className="font-montserrat text-[10px] font-medium uppercase tracking-[0.15em] text-[#8c7355]">
                  Link de teste — ambiente de desenvolvimento
                </p>

                <Link
                  href={linkRecuperacao}
                  className="mt-3 block break-all font-montserrat text-xs leading-relaxed text-[#5f5042] underline underline-offset-4 transition hover:text-[#8c7355]"
                >
                  Abrir página de redefinição
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="mt-7 w-full bg-[#1f1d1a] px-5 py-3.5 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando
                ? "Processando..."
                : "Continuar"}
            </button>
          </form>

          <div className="mt-7 flex flex-col items-center gap-3">
            <Link
              href="/admin/login"
              className="font-montserrat text-[10px] uppercase tracking-[0.18em] text-[#756f69] transition hover:text-[#8c7355]"
            >
              Voltar para o login
            </Link>

            <Link
              href="/"
              className="font-montserrat text-[10px] uppercase tracking-[0.18em] text-[#756f69] transition hover:text-[#8c7355]"
            >
              Voltar para a loja
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}