"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AlterarSenhaPage() {
  const router = useRouter();

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  async function alterarSenha(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErro("");
    setSucesso(false);

    if (novaSenha.length < 6) {
      setErro(
        "A nova senha deve possuir pelo menos 6 caracteres."
      );
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas informadas não são iguais.");
      return;
    }

    if (senhaAtual === novaSenha) {
      setErro(
        "A nova senha deve ser diferente da senha atual."
      );
      return;
    }

    const token = localStorage.getItem("lumea_token");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(
        `${API_URL}/api/auth/alterar-senha`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            senhaAtual,
            novaSenha,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        if (resposta.status === 401) {
          localStorage.removeItem("lumea_token");
          localStorage.removeItem("lumea_usuario");

          router.replace("/admin/login");
          return;
        }

        throw new Error(
          dados?.mensagem ||
            "Não foi possível alterar a senha."
        );
      }

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      setSucesso(true);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível alterar a senha."
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
              Alteração de senha
            </p>
          </div>

          <form
            onSubmit={alterarSenha}
            className="border border-[#e7dfd5] bg-white p-7 shadow-[0_18px_50px_rgba(31,29,26,0.05)] sm:p-9"
          >
            <div>
              <h2 className="font-cormorant text-2xl font-medium">
                Alterar senha
              </h2>

              <p className="mt-2 font-montserrat text-xs leading-relaxed text-[#756f69]">
                Para sua segurança, informe sua senha atual
                antes de cadastrar uma nova.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="senhaAtual"
                  className="mb-2 block font-montserrat text-[10px] font-medium uppercase tracking-[0.18em] text-[#5f5042]"
                >
                  Senha atual
                </label>

                <input
                  id="senhaAtual"
                  type="password"
                  value={senhaAtual}
                  onChange={(event) =>
                    setSenhaAtual(event.target.value)
                  }
                  required
                  autoComplete="current-password"
                  className="w-full border border-[#e7dfd5] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                />
              </div>

              <div>
                <label
                  htmlFor="novaSenha"
                  className="mb-2 block font-montserrat text-[10px] font-medium uppercase tracking-[0.18em] text-[#5f5042]"
                >
                  Nova senha
                </label>

                <input
                  id="novaSenha"
                  type="password"
                  value={novaSenha}
                  onChange={(event) =>
                    setNovaSenha(event.target.value)
                  }
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full border border-[#e7dfd5] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmarSenha"
                  className="mb-2 block font-montserrat text-[10px] font-medium uppercase tracking-[0.18em] text-[#5f5042]"
                >
                  Confirmar nova senha
                </label>

                <input
                  id="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(event) =>
                    setConfirmarSenha(event.target.value)
                  }
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full border border-[#e7dfd5] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                />
              </div>
            </div>

            {erro && (
              <div className="mt-5 border border-[#dcc9bd] bg-[#faf4f0] px-4 py-3">
                <p className="font-montserrat text-xs leading-relaxed text-[#7a5143]">
                  {erro}
                </p>
              </div>
            )}

            {sucesso && (
              <div className="mt-5 border border-[#d8c7b0] bg-[#f7f3ed] px-4 py-3">
                <p className="font-montserrat text-xs leading-relaxed text-[#5f5042]">
                  Senha alterada com sucesso.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="mt-7 w-full bg-[#1f1d1a] px-5 py-3.5 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando
                ? "Atualizando..."
                : "Alterar senha"}
            </button>
          </form>

          <div className="mt-7 flex flex-col items-center gap-3">
            <Link
              href="/admin"
              className="font-montserrat text-[10px] uppercase tracking-[0.18em] text-[#756f69] transition hover:text-[#8c7355]"
            >
              Voltar para o painel
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
