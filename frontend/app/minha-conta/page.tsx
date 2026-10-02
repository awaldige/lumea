"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

type FormularioPerfil = {
  nome: string;
  telefone: string;
  cep: string;
  estado: string;
  endereco: string;
  numero: string;
  complemento: string;
  cidade: string;
};

type FormularioSenha = {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
};

export default function MinhaContaPage() {
  const router = useRouter();

  const {
    cliente,
    autenticado,
    carregado,
    atualizarPerfil,
    logout,
  } = useAuth();

  const { quantidadeTotal } = useCart();
  const { quantidadeFavoritos } = useFavorites();

  const [saindo, setSaindo] = useState(false);

  const [editandoPerfil, setEditandoPerfil] =
    useState(false);

  const [salvandoPerfil, setSalvandoPerfil] =
    useState(false);

  const [mensagemPerfil, setMensagemPerfil] =
    useState("");

  const [erroPerfil, setErroPerfil] =
    useState("");

  const [formulario, setFormulario] =
    useState<FormularioPerfil>({
      nome: "",
      telefone: "",
      cep: "",
      estado: "",
      endereco: "",
      numero: "",
      complemento: "",
      cidade: "",
    });

  const [alterandoSenha, setAlterandoSenha] =
    useState(false);

  const [salvandoSenha, setSalvandoSenha] =
    useState(false);

  const [mensagemSenha, setMensagemSenha] =
    useState("");

  const [erroSenha, setErroSenha] =
    useState("");

  const [senha, setSenha] =
    useState<FormularioSenha>({
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    });

  /**
   * Redireciona para login quando a sessão
   * já foi verificada e não existe usuário.
   */
  useEffect(() => {
    if (carregado && !autenticado) {
      router.replace("/login?redirect=/minha-conta");
    }
  }, [carregado, autenticado, router]);

  /**
   * Preenche o formulário com os dados
   * atuais do cliente.
   */
  useEffect(() => {
    if (!cliente) {
      return;
    }

    setFormulario({
      nome: cliente.nome ?? "",
      telefone: cliente.telefone ?? "",
      cep: cliente.cep ?? "",
      estado: cliente.estado ?? "",
      endereco: cliente.endereco ?? "",
      numero: cliente.numero ?? "",
      complemento: cliente.complemento ?? "",
      cidade: cliente.cidade ?? "",
    });
  }, [cliente]);

  /**
   * Atualiza um campo do formulário.
   */
  function alterarCampo(
    campo: keyof FormularioPerfil,
    valor: string
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  /**
   * Abre a edição do perfil/endereço.
   */
  function iniciarEdicaoPerfil() {
    setMensagemPerfil("");
    setErroPerfil("");

    if (cliente) {
      setFormulario({
        nome: cliente.nome ?? "",
        telefone: cliente.telefone ?? "",
        cep: cliente.cep ?? "",
        estado: cliente.estado ?? "",
        endereco: cliente.endereco ?? "",
        numero: cliente.numero ?? "",
        complemento: cliente.complemento ?? "",
        cidade: cliente.cidade ?? "",
      });
    }

    setEditandoPerfil(true);
  }

  /**
   * Cancela a edição e restaura os dados
   * atuais do cliente.
   */
  function cancelarEdicaoPerfil() {
    setMensagemPerfil("");
    setErroPerfil("");

    if (cliente) {
      setFormulario({
        nome: cliente.nome ?? "",
        telefone: cliente.telefone ?? "",
        cep: cliente.cep ?? "",
        estado: cliente.estado ?? "",
        endereco: cliente.endereco ?? "",
        numero: cliente.numero ?? "",
        complemento: cliente.complemento ?? "",
        cidade: cliente.cidade ?? "",
      });
    }

    setEditandoPerfil(false);
  }

  /**
   * Salva nome, telefone e endereço.
   */
  async function salvarPerfil(
    evento: React.FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    setMensagemPerfil("");
    setErroPerfil("");

    if (
      !formulario.nome.trim() ||
      !formulario.cep.trim() ||
      !formulario.estado.trim() ||
      !formulario.cidade.trim() ||
      !formulario.endereco.trim() ||
      !formulario.numero.trim()
    ) {
      setErroPerfil(
        "Preencha todos os campos obrigatórios."
      );
      return;
    }

    setSalvandoPerfil(true);

    try {
      const sucesso = await atualizarPerfil({
        nome: formulario.nome.trim(),
        telefone: formulario.telefone.trim(),
        cep: formulario.cep.trim(),
        estado: formulario.estado.trim(),
        endereco: formulario.endereco.trim(),
        numero: formulario.numero.trim(),
        complemento: formulario.complemento.trim(),
        cidade: formulario.cidade.trim(),
      });

      if (!sucesso) {
        setErroPerfil(
          "Não foi possível atualizar seus dados."
        );
        return;
      }

      setMensagemPerfil(
        "Seus dados foram atualizados com sucesso."
      );

      setEditandoPerfil(false);
    } catch (error) {
      console.error(
        "Erro ao atualizar perfil:",
        error
      );

      setErroPerfil(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar seus dados."
      );
    } finally {
      setSalvandoPerfil(false);
    }
  }

  /**
   * Atualiza campo de senha.
   */
  function alterarCampoSenha(
    campo: keyof FormularioSenha,
    valor: string
  ) {
    setSenha((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  /**
   * Abre o formulário de alteração de senha.
   */
  function iniciarAlteracaoSenha() {
    setMensagemSenha("");
    setErroSenha("");

    setSenha({
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    });

    setAlterandoSenha(true);
  }

  /**
   * Cancela alteração de senha.
   */
  function cancelarAlteracaoSenha() {
    setMensagemSenha("");
    setErroSenha("");

    setSenha({
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    });

    setAlterandoSenha(false);
  }

  /**
   * Altera a senha através da API.
   */
  async function salvarNovaSenha(
    evento: React.FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    setMensagemSenha("");
    setErroSenha("");

    if (
      !senha.senhaAtual ||
      !senha.novaSenha ||
      !senha.confirmarSenha
    ) {
      setErroSenha(
        "Preencha todos os campos de senha."
      );
      return;
    }

    if (senha.novaSenha.length < 6) {
      setErroSenha(
        "A nova senha deve ter pelo menos 6 caracteres."
      );
      return;
    }

    if (
      senha.novaSenha !== senha.confirmarSenha
    ) {
      setErroSenha(
        "A confirmação da nova senha não confere."
      );
      return;
    }

    if (
      senha.senhaAtual === senha.novaSenha
    ) {
      setErroSenha(
        "A nova senha deve ser diferente da senha atual."
      );
      return;
    }

    const token = localStorage.getItem(
      "lumea-token"
    );

    if (!token) {
      router.replace(
        "/login?redirect=/minha-conta"
      );
      return;
    }

    setSalvandoSenha(true);

    try {
      const resposta = await fetch(
        "http://localhost:4000/api/auth/alterar-senha",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            senhaAtual: senha.senhaAtual,
            novaSenha: senha.novaSenha,
          }),
        }
      );

      const texto = await resposta.text();

      let dados: {
        sucesso?: boolean;
        mensagem?: string;
      } = {};

      try {
        dados = texto
          ? JSON.parse(texto)
          : {};
      } catch {
        dados = {};
      }

      if (!resposta.ok) {
        if (
          resposta.status === 401 ||
          resposta.status === 403
        ) {
          localStorage.removeItem(
            "lumea-token"
          );
          localStorage.removeItem(
            "lumea-cliente"
          );

          router.replace(
            "/login?redirect=/minha-conta"
          );

          return;
        }

        throw new Error(
          dados.mensagem ??
            "Não foi possível alterar a senha."
        );
      }

      setMensagemSenha(
        dados.mensagem ??
          "Senha alterada com sucesso."
      );

      setSenha({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      });

      setAlterandoSenha(false);
    } catch (error) {
      console.error(
        "Erro ao alterar senha:",
        error
      );

      setErroSenha(
        error instanceof Error
          ? error.message
          : "Não foi possível alterar a senha."
      );
    } finally {
      setSalvandoSenha(false);
    }
  }

  /**
   * Logout.
   */
  function handleLogout() {
    setSaindo(true);

    logout();

    window.location.replace("/");
  }

  if (!carregado) {
    return (
      <main className="min-h-screen bg-[#faf8f5]">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="text-sm tracking-[0.12em] text-[#756f69]">
            CARREGANDO SUA CONTA
          </p>
        </div>
      </main>
    );
  }

  if (!autenticado || !cliente) {
    return null;
  }

  const enderecoPreenchido =
    Boolean(
      cliente.cep ||
        cliente.estado ||
        cliente.cidade ||
        cliente.endereco ||
        cliente.numero ||
        cliente.complemento
    );

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">

        {/* Cabeçalho */}
        <div className="mb-10">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.18em] text-[#8c7355] transition hover:text-[#5f5042]"
          >
            LUMÉA
          </Link>

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.18em] text-[#8c7355]">
                Minha conta
              </span>

              <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-4xl text-[#1f1d1a] md:text-5xl">
                Olá, {cliente.nome}
              </h1>

              <p className="mt-2 text-sm text-[#756f69]">
                Gerencie seus dados, pedidos e
                preferências.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={saindo}
              className="border border-[#d8c7b0] px-5 py-3 text-xs uppercase tracking-[0.14em] text-[#5f5042] transition hover:bg-[#f3eee8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saindo
                ? "Saindo..."
                : "Sair da conta"}
            </button>
          </div>
        </div>

        {/* Mensagem de sucesso do perfil */}
        {mensagemPerfil && (
          <div className="mb-6 border border-[#d8c7b0] bg-[#f3eee8] px-5 py-4 text-sm text-[#5f5042]">
            {mensagemPerfil}
          </div>
        )}

        {/* Mensagem de erro do perfil */}
        {erroPerfil && (
          <div className="mb-6 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {erroPerfil}
          </div>
        )}

        {/* Grid principal */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">

          {/* Coluna principal */}
          <div className="space-y-6">

            {/* Perfil */}
            <section className="border border-[#e7dfd5] bg-white p-7 md:p-8">
              <div className="flex flex-col gap-4 border-b border-[#eee5db] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.18em] text-[#8c7355]">
                    Seus dados
                  </span>

                  <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                    Perfil
                  </h2>
                </div>

                {!editandoPerfil && (
                  <button
                    type="button"
                    onClick={iniciarEdicaoPerfil}
                    className="border border-[#d8c7b0] px-5 py-3 text-xs uppercase tracking-[0.14em] text-[#5f5042] transition hover:bg-[#f3eee8]"
                  >
                    Editar dados
                  </button>
                )}
              </div>

              {!editandoPerfil ? (
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <span className="text-xs uppercase tracking-[0.12em] text-[#8c7355]">
                      Nome
                    </span>

                    <p className="mt-2 text-sm text-[#1f1d1a]">
                      {cliente.nome ||
                        "Não informado"}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs uppercase tracking-[0.12em] text-[#8c7355]">
                      E-mail
                    </span>

                    <p className="mt-2 break-all text-sm text-[#1f1d1a]">
                      {cliente.email}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs uppercase tracking-[0.12em] text-[#8c7355]">
                      Telefone
                    </span>

                    <p className="mt-2 text-sm text-[#1f1d1a]">
                      {cliente.telefone ||
                        "Não informado"}
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={salvarPerfil}
                  className="mt-6 space-y-6"
                >
                  <div>
                    <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a]">
                      Dados pessoais
                    </h3>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#756f69]">
                        Nome *
                      </label>

                      <input
                        type="text"
                        value={formulario.nome}
                        onChange={(evento) =>
                          alterarCampo(
                            "nome",
                            evento.target.value
                          )
                        }
                        className="w-full border border-[#d8c7b0] bg-[#faf8f5] px-4 py-3 text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#756f69]">
                        E-mail
                      </label>

                      <input
                        type="email"
                        value={cliente.email}
                        disabled
                        className="w-full cursor-not-allowed border border-[#e7dfd5] bg-[#f3eee8] px-4 py-3 text-sm text-[#756f69]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#756f69]">
                        Telefone
                      </label>

                      <input
                        type="tel"
                        value={formulario.telefone}
                        onChange={(evento) =>
                          alterarCampo(
                            "telefone",
                            evento.target.value
                          )
                        }
                        placeholder="(11) 99999-9999"
                        className="w-full border border-[#d8c7b0] bg-[#faf8f5] px-4 py-3 text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                      />
                    </div>
                  </div>

                  <div className="border-t border-[#eee5db] pt-6">
                    <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a]">
                      Endereço de entrega
                    </h3>
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#756f69]">
                        CEP *
                      </label>

                      <input
                        type="text"
                        value={formulario.cep}
                        onChange={(evento) =>
                          alterarCampo(
                            "cep",
                            evento.target.value
                          )
                        }
                        placeholder="00000-000"
                        className="w-full border border-[#d8c7b0] bg-[#faf8f5] px-4 py-3 text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#756f69]">
                        Estado *
                      </label>

                      <input
                        type="text"
                        value={formulario.estado}
                        onChange={(evento) =>
                          alterarCampo(
                            "estado",
                            evento.target.value
                          )
                        }
                        placeholder="SP"
                        maxLength={2}
                        className="w-full border border-[#d8c7b0] bg-[#faf8f5] px-4 py-3 text-sm uppercase text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#756f69]">
                        Cidade *
                      </label>

                      <input
                        type="text"
                        value={formulario.cidade}
                        onChange={(evento) =>
                          alterarCampo(
                            "cidade",
                            evento.target.value
                          )
                        }
                        className="w-full border border-[#d8c7b0] bg-[#faf8f5] px-4 py-3 text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-[1fr_180px]">
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#756f69]">
                        Endereço *
                      </label>

                      <input
                        type="text"
                        value={formulario.endereco}
                        onChange={(evento) =>
                          alterarCampo(
                            "endereco",
                            evento.target.value
                          )
                        }
                        placeholder="Rua, avenida..."
                        className="w-full border border-[#d8c7b0] bg-[#faf8f5] px-4 py-3 text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#756f69]">
                        Número *
                      </label>

                      <input
                        type="text"
                        value={formulario.numero}
                        onChange={(evento) =>
                          alterarCampo(
                            "numero",
                            evento.target.value
                          )
                        }
                        className="w-full border border-[#d8c7b0] bg-[#faf8f5] px-4 py-3 text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#756f69]">
                      Complemento
                    </label>

                    <input
                      type="text"
                      value={formulario.complemento}
                      onChange={(evento) =>
                        alterarCampo(
                          "complemento",
                          evento.target.value
                        )
                      }
                      placeholder="Apartamento, bloco, sala..."
                      className="w-full border border-[#d8c7b0] bg-[#faf8f5] px-4 py-3 text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={cancelarEdicaoPerfil}
                      disabled={salvandoPerfil}
                      className="border border-[#d8c7b0] px-6 py-3 text-xs uppercase tracking-[0.14em] text-[#5f5042] transition hover:bg-[#f3eee8] disabled:opacity-50"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={salvandoPerfil}
                      className="bg-[#1f1d1a] px-6 py-3 text-xs uppercase tracking-[0.14em] text-white transition hover:bg-[#5f5042] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {salvandoPerfil
                        ? "Salvando..."
                        : "Salvar alterações"}
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* Entrega */}
            <section className="border border-[#e7dfd5] bg-white p-7 md:p-8">
              <div className="flex flex-col gap-4 border-b border-[#eee5db] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.18em] text-[#8c7355]">
                    Entrega
                  </span>

                  <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                    Endereço de entrega
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={iniciarEdicaoPerfil}
                  className="border border-[#d8c7b0] px-5 py-3 text-xs uppercase tracking-[0.14em] text-[#5f5042] transition hover:bg-[#f3eee8]"
                >
                  Editar endereço
                </button>
              </div>

              <div className="mt-6">
                {!enderecoPreenchido ? (
                  <div className="border border-dashed border-[#d8c7b0] bg-[#faf8f5] px-6 py-8 text-center">
                    <p className="text-sm text-[#756f69]">
                      Você ainda não cadastrou um
                      endereço de entrega.
                    </p>

                    <button
                      type="button"
                      onClick={iniciarEdicaoPerfil}
                      className="mt-4 text-xs uppercase tracking-[0.14em] text-[#8c7355] underline underline-offset-4 transition hover:text-[#5f5042]"
                    >
                      Cadastrar endereço
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
                    <div>
                      <span className="text-xs uppercase tracking-[0.12em] text-[#8c7355]">
                        CEP
                      </span>

                      <p className="mt-2 text-sm text-[#1f1d1a]">
                        {cliente.cep ||
                          "Não informado"}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-[0.12em] text-[#8c7355]">
                        Estado
                      </span>

                      <p className="mt-2 text-sm text-[#1f1d1a]">
                        {cliente.estado ||
                          "Não informado"}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-[0.12em] text-[#8c7355]">
                        Cidade
                      </span>

                      <p className="mt-2 text-sm text-[#1f1d1a]">
                        {cliente.cidade ||
                          "Não informado"}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-[0.12em] text-[#8c7355]">
                        Endereço
                      </span>

                      <p className="mt-2 text-sm text-[#1f1d1a]">
                        {cliente.endereco ||
                          "Não informado"}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-[0.12em] text-[#8c7355]">
                        Número
                      </span>

                      <p className="mt-2 text-sm text-[#1f1d1a]">
                        {cliente.numero ||
                          "Não informado"}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-[0.12em] text-[#8c7355]">
                        Complemento
                      </span>

                      <p className="mt-2 text-sm text-[#1f1d1a]">
                        {cliente.complemento ||
                          "Não informado"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Segurança */}
            <section className="border border-[#e7dfd5] bg-white p-7 md:p-8">
              <div className="border-b border-[#eee5db] pb-6">
                <span className="text-xs uppercase tracking-[0.18em] text-[#8c7355]">
                  Segurança
                </span>

                <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                  Senha
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#756f69]">
                  Mantenha sua senha atualizada
                  para proteger sua conta.
                </p>
              </div>

              {mensagemSenha && (
                <div className="mt-6 border border-[#d8c7b0] bg-[#f3eee8] px-5 py-4 text-sm text-[#5f5042]">
                  {mensagemSenha}
                </div>
              )}

              {erroSenha && (
                <div className="mt-6 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                  {erroSenha}
                </div>
              )}

              {!alterandoSenha ? (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={iniciarAlteracaoSenha}
                    className="border border-[#d8c7b0] px-5 py-3 text-xs uppercase tracking-[0.14em] text-[#5f5042] transition hover:bg-[#f3eee8]"
                  >
                    Alterar senha
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={salvarNovaSenha}
                  className="mt-6 space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#756f69]">
                      Senha atual *
                    </label>

                    <input
                      type="password"
                      value={senha.senhaAtual}
                      onChange={(evento) =>
                        alterarCampoSenha(
                          "senhaAtual",
                          evento.target.value
                        )
                      }
                      className="w-full border border-[#d8c7b0] bg-[#faf8f5] px-4 py-3 text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#756f69]">
                      Nova senha *
                    </label>

                    <input
                      type="password"
                      value={senha.novaSenha}
                      onChange={(evento) =>
                        alterarCampoSenha(
                          "novaSenha",
                          evento.target.value
                        )
                      }
                      className="w-full border border-[#d8c7b0] bg-[#faf8f5] px-4 py-3 text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                      required
                      minLength={6}
                    />

                    <p className="mt-2 text-xs text-[#756f69]">
                      A senha deve ter pelo menos
                      6 caracteres.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#756f69]">
                      Confirmar nova senha *
                    </label>

                    <input
                      type="password"
                      value={senha.confirmarSenha}
                      onChange={(evento) =>
                        alterarCampoSenha(
                          "confirmarSenha",
                          evento.target.value
                        )
                      }
                      className="w-full border border-[#d8c7b0] bg-[#faf8f5] px-4 py-3 text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={cancelarAlteracaoSenha}
                      disabled={salvandoSenha}
                      className="border border-[#d8c7b0] px-6 py-3 text-xs uppercase tracking-[0.14em] text-[#5f5042] transition hover:bg-[#f3eee8] disabled:opacity-50"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={salvandoSenha}
                      className="bg-[#1f1d1a] px-6 py-3 text-xs uppercase tracking-[0.14em] text-white transition hover:bg-[#5f5042] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {salvandoSenha
                        ? "Alterando..."
                        : "Alterar senha"}
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>

          {/* Coluna lateral */}
          <div className="space-y-6">

            {/* Pedidos */}
            <Link
              href="/pedidos"
              className="block border border-[#e7dfd5] bg-white p-7 transition hover:border-[#d8c7b0] hover:bg-[#fdfbf8]"
            >
              <span className="text-xs uppercase tracking-[0.18em] text-[#8c7355]">
                Histórico
              </span>

              <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                Seus pedidos
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#756f69]">
                Consulte seus pedidos e
                acompanhe o status de cada compra.
              </p>

              <span className="mt-6 inline-block text-xs uppercase tracking-[0.14em] text-[#5f5042]">
                Ver pedidos →
              </span>
            </Link>

            {/* Favoritos */}
            <Link
              href="/favoritos"
              className="block border border-[#e7dfd5] bg-white p-7 transition hover:border-[#d8c7b0] hover:bg-[#fdfbf8]"
            >
              <span className="text-xs uppercase tracking-[0.18em] text-[#8c7355]">
                Seus favoritos
              </span>

              <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                {quantidadeFavoritos}{" "}
                {quantidadeFavoritos === 1
                  ? "item"
                  : "itens"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#756f69]">
                Produtos que você salvou para
                consultar novamente.
              </p>

              <span className="mt-6 inline-block text-xs uppercase tracking-[0.14em] text-[#5f5042]">
                Ver favoritos →
              </span>
            </Link>

            {/* Carrinho */}
            <Link
              href="/carrinho"
              className="block border border-[#e7dfd5] bg-white p-7 transition hover:border-[#d8c7b0] hover:bg-[#fdfbf8]"
            >
              <span className="text-xs uppercase tracking-[0.18em] text-[#8c7355]">
                Seu carrinho
              </span>

              <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                {quantidadeTotal}{" "}
                {quantidadeTotal === 1
                  ? "item"
                  : "itens"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#756f69]">
                Continue sua seleção ou revise
                os produtos adicionados.
              </p>

              <span className="mt-6 inline-block text-xs uppercase tracking-[0.14em] text-[#5f5042]">
                Ver carrinho →
              </span>
            </Link>
          </div>
        </div>

        {/* Voltar */}
        <div className="mt-10 border-t border-[#e7dfd5] pt-8">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.14em] text-[#8c7355] transition hover:text-[#5f5042]"
          >
            ← Continuar navegando
          </Link>
        </div>
      </div>
    </main>
  );
}