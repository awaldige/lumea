"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type UsuarioLogin = {
  id: number;
  nome: string;
  nomeUsuario?: string | null;
  email: string;
  telefone?: string | null;
  ativo: boolean;
  perfil?: "CLIENTE" | "ADMIN";
};

type RespostaLogin = {
  token: string;
  usuario: UsuarioLogin;
};

export default function AdminLoginPage() {
  const router = useRouter();

  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("lumea_token");
    const usuarioSalvo = localStorage.getItem("lumea_usuario");

    if (!token) {
      return;
    }

    try {
      const usuario = usuarioSalvo
        ? (JSON.parse(usuarioSalvo) as UsuarioLogin)
        : null;

      if (usuario?.perfil === "ADMIN") {
        router.replace("/admin");
      }
    } catch {
      localStorage.removeItem("lumea_usuario");
    }
  }, [router]);

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identificador: identificador.trim(),
          senha,
        }),
      });

      const dados = (await resposta.json()) as
        | RespostaLogin
        | { mensagem?: string };

      if (!resposta.ok) {
        throw new Error(
          "mensagem" in dados && dados.mensagem
            ? dados.mensagem
            : "Não foi possível realizar o login."
        );
      }

      const respostaLogin = dados as RespostaLogin;
      const usuario = respostaLogin.usuario;

      if (!usuario) {
        throw new Error("Dados do usuário não retornados pela API.");
      }

      if (usuario.perfil !== "ADMIN") {
        throw new Error(
          "Este usuário não possui acesso administrativo."
        );
      }

      if (!usuario.ativo) {
        throw new Error("Este usuário está inativo.");
      }

      localStorage.setItem("lumea_token", respostaLogin.token);

      localStorage.setItem(
        "lumea_usuario",
        JSON.stringify(usuario)
      );

      router.replace("/admin");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar o login."
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
              Acesso ao painel administrativo
            </p>
          </div>

          <form
            onSubmit={entrar}
            className="border border-[#e7dfd5] bg-white p-7 shadow-[0_18px_50px_rgba(31,29,26,0.05)] sm:p-9"
          >
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="identificador"
                  className="mb-2 block font-montserrat text-[10px] font-medium uppercase tracking-[0.18em] text-[#5f5042]"
                >
                  E-mail ou nome de usuário
                </label>

                <input
                  id="identificador"
                  type="text"
                  value={identificador}
                  onChange={(event) =>
                    setIdentificador(event.target.value)
                  }
                  required
                  autoComplete="username"
                  autoFocus
                  placeholder="Digite seu e-mail ou nome de usuário"
                  className="w-full border border-[#e7dfd5] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                />
              </div>

              <div>
                <label
                  htmlFor="senha"
                  className="mb-2 block font-montserrat text-[10px] font-medium uppercase tracking-[0.18em] text-[#5f5042]"
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
                  required
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  className="w-full border border-[#e7dfd5] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
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

            <button
              type="submit"
              disabled={carregando}
              className="mt-7 w-full bg-[#1f1d1a] px-5 py-3.5 font-montserrat text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>

            <div className="mt-5 text-center">
              <Link
                href="/admin/esqueci-senha"
                className="font-montserrat text-[10px] uppercase tracking-[0.15em] text-[#756f69] transition hover:text-[#8c7355]"
              >
                Esqueci minha senha
              </Link>
            </div>
          </form>

          <div className="mt-7 text-center">
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