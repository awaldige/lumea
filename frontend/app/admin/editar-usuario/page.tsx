"use client";

import { useEffect, useState } from "react";

type Usuario = {
  id: number;
  nome: string;
  nomeUsuario: string;
  email: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

export default function EditarUsuarioPage() {
  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [mensagem, setMensagem] =
    useState("");

  const [erro, setErro] = useState("");

  useEffect(() => {
    try {
      const usuarioSalvo =
        localStorage.getItem("lumea_usuario");

      if (!usuarioSalvo) {
        setErro(
          "Usuário não encontrado. Faça login novamente."
        );
        return;
      }

      setUsuario(JSON.parse(usuarioSalvo));
    } catch (error) {
      console.error(
        "Erro ao carregar usuário:",
        error
      );

      setErro(
        "Não foi possível carregar os dados do usuário."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  function atualizarCampo(
    campo: keyof Usuario,
    valor: string
  ) {
    if (!usuario) return;

    setUsuario({
      ...usuario,
      [campo]: valor,
    });

    setMensagem("");
    setErro("");
  }

  async function salvarAlteracoes() {
    if (!usuario) return;

    setSalvando(true);
    setMensagem("");
    setErro("");

    try {
      const token =
        localStorage.getItem("lumea_token");

      if (!token) {
        setErro(
          "Sessão não encontrada. Faça login novamente."
        );
        return;
      }

      const resposta = await fetch(
        `${API_URL}/api/auth/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: usuario.nome,
            nomeUsuario: usuario.nomeUsuario,
            email: usuario.email,

            // Mantém os dados atuais do usuário
            // exigidos pelo backend.
            telefone: "",
            cep: "",
            estado: "",
            endereco: "",
            numero: "",
            complemento: "",
            cidade: "",
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok || !dados.sucesso) {
        setErro(
          dados.mensagem ||
            "Não foi possível salvar as alterações."
        );
        return;
      }

      setUsuario(dados.usuario);

      localStorage.setItem(
        "lumea_usuario",
        JSON.stringify(dados.usuario)
      );

      setMensagem(
        "Dados atualizados com sucesso."
      );
    } catch (error) {
      console.error(
        "Erro ao salvar alterações:",
        error
      );

      setErro(
        "Não foi possível conectar ao servidor."
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#faf8f5] px-6 py-12">
        <div className="mx-auto max-w-xl">
          <p className="text-sm text-[#756f69]">
            Carregando dados...
          </p>
        </div>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="min-h-screen bg-[#faf8f5] px-6 py-12">
        <div className="mx-auto max-w-xl">
          <p className="text-sm text-red-600">
            {erro}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] px-6 py-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-[#1f1d1a]">
            Editar usuário
          </h1>

          <p className="mt-2 text-sm text-[#756f69]">
            Atualize seus dados de acesso.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e7dfd5] bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                Nome
              </label>

              <input
                type="text"
                value={usuario.nome}
                onChange={(e) =>
                  atualizarCampo(
                    "nome",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-[#e7dfd5] px-4 py-3 text-sm outline-none transition focus:border-[#8c7355]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                Nome de usuário
              </label>

              <input
                type="text"
                value={usuario.nomeUsuario}
                onChange={(e) =>
                  atualizarCampo(
                    "nomeUsuario",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-[#e7dfd5] px-4 py-3 text-sm outline-none transition focus:border-[#8c7355]"
              />

              <p className="mt-1 text-xs text-[#756f69]">
                Use apenas letras, números, ponto, hífen
                ou sublinhado.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                E-mail
              </label>

              <input
                type="email"
                value={usuario.email}
                onChange={(e) =>
                  atualizarCampo(
                    "email",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-[#e7dfd5] px-4 py-3 text-sm outline-none transition focus:border-[#8c7355]"
              />
            </div>
          </div>

          {mensagem && (
            <p className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {mensagem}
            </p>
          )}

          {erro && (
            <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {erro}
            </p>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={salvarAlteracoes}
              disabled={salvando}
              className="rounded-lg bg-[#1f1d1a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#8c7355] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando
                ? "Salvando..."
                : "Salvar alterações"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}