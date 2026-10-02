"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type PerfilUsuario = "CLIENTE" | "ADMIN";

export type Cliente = {
  id?: number;
  nome: string;
  email: string;
  telefone: string;

  cep: string;
  estado: string;
  endereco: string;
  numero: string;
  complemento: string;
  cidade: string;

  perfil: PerfilUsuario;
};

type DadosPerfil = {
  nome: string;
  telefone: string;

  cep: string;
  estado: string;
  endereco: string;
  numero: string;
  complemento: string;
  cidade: string;
};

type AuthContextType = {
  cliente: Cliente | null;
  autenticado: boolean;
  carregado: boolean;

  cadastrar: (
    nome: string,
    email: string,
    telefone: string,
    senha: string,
    cep: string,
    estado: string,
    endereco: string,
    numero: string,
    complemento: string,
    cidade: string
  ) => Promise<boolean>;

  login: (
    email: string,
    senha: string
  ) => Promise<boolean>;

  atualizarPerfil: (
    dados: DadosPerfil
  ) => Promise<boolean>;

  logout: () => void;
};

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

const CLIENTE_STORAGE_KEY = "lumea-cliente";
const TOKEN_STORAGE_KEY = "lumea-token";

type UsuarioApi = {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;

  cep: string | null;
  estado: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  cidade: string | null;

  perfil: PerfilUsuario;
  ativo: boolean;
};

type RespostaAuth = {
  sucesso: boolean;
  mensagem: string;
  token?: string;
  usuario?: UsuarioApi;
};

function transformarUsuario(
  usuario: UsuarioApi
): Cliente {
  return {
    id: usuario.id,

    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone ?? "",

    cep: usuario.cep ?? "",
    estado: usuario.estado ?? "",
    endereco: usuario.endereco ?? "",
    numero: usuario.numero ?? "",
    complemento: usuario.complemento ?? "",
    cidade: usuario.cidade ?? "",

    perfil: usuario.perfil,
  };
}

/*
 * Lê a resposta da API com segurança.
 *
 * Evita quebrar o frontend caso a API retorne:
 * - resposta vazia;
 * - JSON inválido;
 * - mensagem em formato diferente.
 */
async function lerResposta(
  resposta: Response
): Promise<unknown> {
  const texto = await resposta.text();

  if (!texto) {
    return {};
  }

  try {
    return JSON.parse(texto);
  } catch {
    return {
      sucesso: false,
      mensagem:
        "A API retornou uma resposta inválida.",
    };
  }
}

function obterMensagemErro(
  dados: unknown,
  mensagemPadrao: string
): string {
  if (
    typeof dados === "object" &&
    dados !== null &&
    "mensagem" in dados &&
    typeof dados.mensagem === "string"
  ) {
    return dados.mensagem;
  }

  if (
    typeof dados === "object" &&
    dados !== null &&
    "message" in dados &&
    typeof dados.message === "string"
  ) {
    return dados.message;
  }

  return mensagemPadrao;
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cliente, setCliente] =
    useState<Cliente | null>(null);

  const [carregado, setCarregado] =
    useState(false);

  // =========================================================
  // LIMPAR SESSÃO LOCAL
  // =========================================================

  function limparSessaoLocal() {
    try {
      window.localStorage.removeItem(
        TOKEN_STORAGE_KEY
      );

      window.localStorage.removeItem(
        CLIENTE_STORAGE_KEY
      );
    } catch (error) {
      console.error(
        "Erro ao limpar sessão:",
        error
      );
    }

    setCliente(null);
  }

  // =========================================================
  // SALVAR CLIENTE LOCALMENTE
  // =========================================================

  function salvarClienteLocal(
    usuario: UsuarioApi
  ): Cliente {
    const usuarioAtual =
      transformarUsuario(usuario);

    window.localStorage.setItem(
      CLIENTE_STORAGE_KEY,
      JSON.stringify(usuarioAtual)
    );

    setCliente(usuarioAtual);

    return usuarioAtual;
  }

  // =========================================================
  // RECUPERAR SESSÃO
  // =========================================================

  useEffect(() => {
    async function recuperarSessao() {
      try {
        const token =
          window.localStorage.getItem(
            TOKEN_STORAGE_KEY
          );

        if (!token) {
          setCliente(null);
          return;
        }

        const resposta = await fetch(
          `${API_URL}/api/auth/me`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
            },

            cache: "no-store",
          }
        );

        const dados =
          (await lerResposta(
            resposta
          )) as RespostaAuth;

        // -----------------------------------------------------
        // TOKEN INVÁLIDO / SESSÃO EXPIRADA
        // -----------------------------------------------------

        if (
          !resposta.ok ||
          !dados.sucesso ||
          !dados.usuario
        ) {
          limparSessaoLocal();
          return;
        }

        // -----------------------------------------------------
        // USUÁRIO INATIVO
        // -----------------------------------------------------

        if (!dados.usuario.ativo) {
          console.warn(
            "Usuário autenticado está inativo."
          );

          limparSessaoLocal();
          return;
        }

        // -----------------------------------------------------
        // TRANSFORMAR E SALVAR USUÁRIO
        // -----------------------------------------------------

        salvarClienteLocal(
          dados.usuario
        );
      } catch (error) {
        console.error(
          "Erro ao recuperar sessão:",
          error
        );

        limparSessaoLocal();
      } finally {
        setCarregado(true);
      }
    }

    recuperarSessao();
  }, []);

  // =========================================================
  // CADASTRO
  // =========================================================

  async function cadastrar(
    nome: string,
    email: string,
    telefone: string,
    senha: string,
    cep: string,
    estado: string,
    endereco: string,
    numero: string,
    complemento: string,
    cidade: string
  ): Promise<boolean> {
    try {
      const resposta = await fetch(
        `${API_URL}/api/auth/cadastro`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            nome: nome.trim(),
            email: email.trim(),
            telefone: telefone.trim(),
            senha,

            cep: cep.trim(),
            estado: estado.trim(),
            endereco: endereco.trim(),
            numero: numero.trim(),
            complemento: complemento.trim(),
            cidade: cidade.trim(),
          }),
        }
      );

      const dados =
        (await lerResposta(
          resposta
        )) as RespostaAuth;

      // -----------------------------------------------------
      // ERRO
      // -----------------------------------------------------

      if (
        !resposta.ok ||
        !dados.sucesso ||
        !dados.usuario ||
        !dados.token
      ) {
        console.error(
          "Erro no cadastro:",
          obterMensagemErro(
            dados,
            "Não foi possível realizar o cadastro."
          )
        );

        return false;
      }

      // -----------------------------------------------------
      // GARANTIR QUE O CADASTRO É CLIENTE
      // -----------------------------------------------------

      if (
        dados.usuario.perfil !==
        "CLIENTE"
      ) {
        console.error(
          "O cadastro retornou um perfil inesperado:",
          dados.usuario.perfil
        );

        return false;
      }

      // -----------------------------------------------------
      // NOVO CLIENTE
      // -----------------------------------------------------

      const novoCliente =
        transformarUsuario(
          dados.usuario
        );

      // -----------------------------------------------------
      // SUBSTITUIR COMPLETAMENTE A SESSÃO ANTERIOR
      // -----------------------------------------------------

      window.localStorage.setItem(
        TOKEN_STORAGE_KEY,
        dados.token
      );

      window.localStorage.setItem(
        CLIENTE_STORAGE_KEY,
        JSON.stringify(novoCliente)
      );

      setCliente(novoCliente);

      console.log(
        "Novo cliente autenticado:",
        {
          id: novoCliente.id,
          nome: novoCliente.nome,
          email: novoCliente.email,
          perfil: novoCliente.perfil,
        }
      );

      return true;
    } catch (error) {
      console.error(
        "Erro ao cadastrar cliente:",
        error
      );

      return false;
    }
  }

  // =========================================================
  // LOGIN
  // =========================================================

  async function login(
    email: string,
    senha: string
  ): Promise<boolean> {
    try {
      const resposta = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            senha,
          }),
        }
      );

      const dados =
        (await lerResposta(
          resposta
        )) as RespostaAuth;

      // -----------------------------------------------------
      // ERRO
      // -----------------------------------------------------

      if (
        !resposta.ok ||
        !dados.sucesso ||
        !dados.usuario ||
        !dados.token
      ) {
        console.error(
          "Erro no login:",
          obterMensagemErro(
            dados,
            "Não foi possível realizar o login."
          )
        );

        return false;
      }

      // -----------------------------------------------------
      // TRANSFORMAR USUÁRIO
      // -----------------------------------------------------

      const usuarioLogado =
        transformarUsuario(
          dados.usuario
        );

      // -----------------------------------------------------
      // SALVAR TOKEN NOVO
      // -----------------------------------------------------

      window.localStorage.setItem(
        TOKEN_STORAGE_KEY,
        dados.token
      );

      // -----------------------------------------------------
      // SALVAR USUÁRIO NOVO
      // -----------------------------------------------------

      window.localStorage.setItem(
        CLIENTE_STORAGE_KEY,
        JSON.stringify(usuarioLogado)
      );

      // -----------------------------------------------------
      // ATUALIZAR ESTADO
      // -----------------------------------------------------

      setCliente(usuarioLogado);

      console.log(
        "Login realizado:",
        {
          id: usuarioLogado.id,
          nome: usuarioLogado.nome,
          email: usuarioLogado.email,
          perfil: usuarioLogado.perfil,
        }
      );

      return true;
    } catch (error) {
      console.error(
        "Erro ao realizar login:",
        error
      );

      return false;
    }
  }

  // =========================================================
  // ATUALIZAR PERFIL
  // =========================================================

  async function atualizarPerfil(
    dadosPerfil: DadosPerfil
  ): Promise<boolean> {
    try {
      const token =
        window.localStorage.getItem(
          TOKEN_STORAGE_KEY
        );

      if (!token) {
        console.error(
          "Token não encontrado para atualizar o perfil."
        );

        limparSessaoLocal();

        return false;
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
            nome: dadosPerfil.nome.trim(),
            telefone:
              dadosPerfil.telefone.trim(),

            cep: dadosPerfil.cep.trim(),
            estado:
              dadosPerfil.estado.trim(),
            endereco:
              dadosPerfil.endereco.trim(),
            numero:
              dadosPerfil.numero.trim(),
            complemento:
              dadosPerfil.complemento.trim(),
            cidade:
              dadosPerfil.cidade.trim(),
          }),
        }
      );

      const dados =
        (await lerResposta(
          resposta
        )) as RespostaAuth;

      // -----------------------------------------------------
      // SESSÃO EXPIRADA
      // -----------------------------------------------------

      if (
        resposta.status === 401 ||
        resposta.status === 403
      ) {
        console.warn(
          "Sessão expirada ao atualizar perfil."
        );

        limparSessaoLocal();

        return false;
      }

      // -----------------------------------------------------
      // ERRO DA API
      // -----------------------------------------------------

      if (
        !resposta.ok ||
        !dados.sucesso ||
        !dados.usuario
      ) {
        console.error(
          "Erro ao atualizar perfil:",
          obterMensagemErro(
            dados,
            "Não foi possível atualizar seus dados."
          )
        );

        return false;
      }

      // -----------------------------------------------------
      // USUÁRIO INATIVO
      // -----------------------------------------------------

      if (!dados.usuario.ativo) {
        console.warn(
          "Usuário atualizado está inativo."
        );

        limparSessaoLocal();

        return false;
      }

      // -----------------------------------------------------
      // ATUALIZAR CLIENTE
      // -----------------------------------------------------

      const clienteAtualizado =
        salvarClienteLocal(
          dados.usuario
        );

      console.log(
        "Perfil atualizado:",
        {
          id: clienteAtualizado.id,
          nome: clienteAtualizado.nome,
          email: clienteAtualizado.email,
        }
      );

      return true;
    } catch (error) {
      console.error(
        "Erro ao atualizar perfil:",
        error
      );

      return false;
    }
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  function logout() {
    try {
      window.localStorage.removeItem(
        TOKEN_STORAGE_KEY
      );

      window.localStorage.removeItem(
        CLIENTE_STORAGE_KEY
      );
    } catch (error) {
      console.error(
        "Erro ao encerrar sessão:",
        error
      );
    }

    setCliente(null);
  }

  // =========================================================
  // CONTEXTO
  // =========================================================

  return (
    <AuthContext.Provider
      value={{
        cliente,

        autenticado:
          cliente !== null,

        carregado,

        cadastrar,
        login,
        atualizarPerfil,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ===========================================================
// HOOK
// ===========================================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser utilizado dentro de um AuthProvider."
    );
  }

  return context;
}