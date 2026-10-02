"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

type Colecao = {
  id: number;
  nome: string;
  slug: string;
  descricao: string | null;
  ativo: boolean;
  _count?: {
    produtos: number;
  };
};

type FormularioColecao = {
  nome: string;
  slug: string;
  descricao: string;
  ativo: boolean;
};

const formularioInicial: FormularioColecao = {
  nome: "",
  slug: "",
  descricao: "",
  ativo: true,
};

export default function AdminColecoesPage() {
  const [colecoes, setColecoes] = useState<Colecao[]>(
    []
  );

  const [formulario, setFormulario] =
    useState<FormularioColecao>(
      formularioInicial
    );

  const [busca, setBusca] = useState("");
  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [excluindoId, setExcluindoId] =
    useState<number | null>(null);

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] =
    useState("");

  async function carregarColecoes() {
    const token =
      localStorage.getItem("lumea_token");

    if (!token) {
      window.location.href =
        "/admin/login";
      return;
    }

    try {
      setErro("");

      const resposta = await fetch(
        `${API_URL}/api/colecoes/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const dados = await resposta.json();

      if (
        resposta.status === 401 ||
        resposta.status === 403
      ) {
        window.location.href =
          "/admin/login";
        return;
      }

      if (!resposta.ok) {
        throw new Error(
          dados?.mensagem ||
            "Não foi possível carregar as coleções."
        );
      }

      if (Array.isArray(dados)) {
        setColecoes(dados);
      } else if (
        dados &&
        Array.isArray(dados.colecoes)
      ) {
        setColecoes(dados.colecoes);
      } else {
        setColecoes([]);
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as coleções."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarColecoes();
  }, []);

  function gerarSlug(valor: string) {
    return valor
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function alterarNome(valor: string) {
    setFormulario((atual) => ({
      ...atual,
      nome: valor,
      slug:
        editandoId !== null
          ? atual.slug
          : gerarSlug(valor),
    }));
  }

  function limparFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setErro("");
  }

  function editarColecao(colecao: Colecao) {
    setEditandoId(colecao.id);

    setFormulario({
      nome: colecao.nome,
      slug: colecao.slug,
      descricao:
        colecao.descricao || "",
      ativo: colecao.ativo,
    });

    setMensagem("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function salvarColecao(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const token =
      localStorage.getItem("lumea_token");

    if (!token) {
      window.location.href =
        "/admin/login";
      return;
    }

    if (!formulario.nome.trim()) {
      setErro(
        "Informe o nome da coleção."
      );
      return;
    }

    if (!formulario.slug.trim()) {
      setErro(
        "Informe o slug da coleção."
      );
      return;
    }

    try {
      setSalvando(true);
      setErro("");
      setMensagem("");

      const metodo =
        editandoId !== null
          ? "PUT"
          : "POST";

      const url =
        editandoId !== null
          ? `${API_URL}/api/colecoes/${editandoId}`
          : `${API_URL}/api/colecoes`;

      const resposta = await fetch(url, {
        method: metodo,

        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          nome: formulario.nome.trim(),
          slug: formulario.slug
            .trim()
            .toLowerCase(),
          descricao:
            formulario.descricao.trim() ||
            null,
          ativo: formulario.ativo,
        }),
      });

      const dados = await resposta.json();

      if (
        resposta.status === 401 ||
        resposta.status === 403
      ) {
        window.location.href =
          "/admin/login";
        return;
      }

      if (!resposta.ok) {
        throw new Error(
          dados?.mensagem ||
            "Não foi possível salvar a coleção."
        );
      }

      setMensagem(
        editandoId !== null
          ? "Coleção atualizada com sucesso."
          : "Coleção criada com sucesso."
      );

      limparFormulario();

      await carregarColecoes();

      setTimeout(() => {
        setMensagem("");
      }, 4000);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a coleção."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function inativarColecao(
    colecao: Colecao
  ) {
    const confirmar = window.confirm(
      `Deseja realmente inativar a coleção "${colecao.nome}"?\n\nEla deixará de aparecer na loja.`
    );

    if (!confirmar) {
      return;
    }

    const token =
      localStorage.getItem("lumea_token");

    if (!token) {
      window.location.href =
        "/admin/login";
      return;
    }

    try {
      setExcluindoId(colecao.id);
      setErro("");
      setMensagem("");

      const resposta = await fetch(
        `${API_URL}/api/colecoes/${colecao.id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados = await resposta.json();

      if (
        resposta.status === 401 ||
        resposta.status === 403
      ) {
        window.location.href =
          "/admin/login";
        return;
      }

      if (!resposta.ok) {
        throw new Error(
          dados?.mensagem ||
            "Não foi possível inativar a coleção."
        );
      }

      setColecoes((atuais) =>
        atuais.map((item) =>
          item.id === colecao.id
            ? {
                ...item,
                ativo: false,
              }
            : item
        )
      );

      setMensagem(
        dados?.mensagem ||
          "Coleção inativada com sucesso."
      );

      if (editandoId === colecao.id) {
        limparFormulario();
      }

      setTimeout(() => {
        setMensagem("");
      }, 4000);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível inativar a coleção."
      );
    } finally {
      setExcluindoId(null);
    }
  }

  const colecoesFiltradas =
    useMemo(() => {
      const termo = busca
        .trim()
        .toLowerCase();

      if (!termo) {
        return colecoes;
      }

      return colecoes.filter(
        (colecao) =>
          colecao.nome
            .toLowerCase()
            .includes(termo) ||
          colecao.slug
            .toLowerCase()
            .includes(termo) ||
          colecao.descricao
            ?.toLowerCase()
            .includes(termo)
      );
    }, [colecoes, busca]);

  if (carregando) {
    return (
      <div className="p-6 lg:p-10">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#756f69]">
            Carregando coleções...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Cabeçalho */}
        <div className="mb-8">
          <p className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[#8c7355]">
            Administração
          </p>

          <h1 className="mt-2 font-cormorant text-4xl font-medium sm:text-5xl">
            Coleções
          </h1>

          <p className="mt-3 font-montserrat text-sm text-[#756f69]">
            Organize os produtos em coleções
            especiais da LUMÉA.
          </p>
        </div>

        {/* Mensagem */}
        {mensagem && (
          <div className="mb-6 border border-[#d8c7b0] bg-[#f3eee8] px-5 py-4">
            <p className="font-montserrat text-sm text-[#5f5042]">
              {mensagem}
            </p>
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div className="mb-6 border border-[#e2d9ce] bg-white px-5 py-4">
            <p className="font-montserrat text-sm text-[#7a5143]">
              {erro}
            </p>
          </div>
        )}

        {/* Formulário */}
        <div className="mb-8 border border-[#e2d9ce] bg-white p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#8c7355]">
                {editandoId !== null
                  ? "Editar coleção"
                  : "Nova coleção"}
              </p>

              <h2 className="mt-2 font-cormorant text-3xl">
                {editandoId !== null
                  ? "Atualizar coleção"
                  : "Cadastrar coleção"}
              </h2>
            </div>

            {editandoId !== null && (
              <button
                type="button"
                onClick={limparFormulario}
                className="font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69] transition hover:text-[#1f1d1a]"
              >
                Cancelar edição
              </button>
            )}
          </div>

          <form
            onSubmit={salvarColecao}
            className="space-y-5"
          >
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="block font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
                  Nome
                </label>

                <input
                  type="text"
                  value={formulario.nome}
                  onChange={(event) =>
                    alterarNome(
                      event.target.value
                    )
                  }
                  placeholder="Ex.: Essência"
                  className="mt-3 w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                />
              </div>

              <div>
                <label className="block font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
                  Slug
                </label>

                <input
                  type="text"
                  value={formulario.slug}
                  onChange={(event) =>
                    setFormulario(
                      (atual) => ({
                        ...atual,
                        slug: gerarSlug(
                          event.target.value
                        ),
                      })
                    )
                  }
                  placeholder="ex.: essencia"
                  className="mt-3 w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                />
              </div>

            </div>

            <div>
              <label className="block font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
                Descrição
              </label>

              <textarea
                value={formulario.descricao}
                onChange={(event) =>
                  setFormulario(
                    (atual) => ({
                      ...atual,
                      descricao:
                        event.target.value,
                    })
                  )
                }
                rows={4}
                placeholder="Descrição da coleção..."
                className="mt-3 w-full resize-none border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={formulario.ativo}
                onChange={(event) =>
                  setFormulario(
                    (atual) => ({
                      ...atual,
                      ativo:
                        event.target.checked,
                    })
                  )
                }
                className="h-4 w-4 accent-[#8c7355]"
              />

              <span className="font-montserrat text-xs text-[#5f5042]">
                Coleção ativa
              </span>
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={salvando}
                className="bg-[#1f1d1a] px-6 py-3 font-montserrat text-[9px] uppercase tracking-[0.18em] text-white transition hover:bg-[#8c7355] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {salvando
                  ? "Salvando..."
                  : editandoId !== null
                    ? "Salvar alterações"
                    : "Criar coleção"}
              </button>

              {editandoId !== null && (
                <button
                  type="button"
                  onClick={limparFormulario}
                  className="border border-[#d8c7b0] px-6 py-3 font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#5f5042] transition hover:border-[#8c7355]"
                >
                  Limpar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Busca */}
        <div className="mb-6 border border-[#e2d9ce] bg-white p-5">
          <label className="block font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
            Buscar coleção
          </label>

          <input
            type="text"
            value={busca}
            onChange={(event) =>
              setBusca(event.target.value)
            }
            placeholder="Nome, slug ou descrição..."
            className="mt-3 w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
          />
        </div>

        {/* Tabela */}
        <div className="overflow-hidden border border-[#e2d9ce] bg-white">

          <div className="border-b border-[#e2d9ce] px-5 py-4">
            <p className="font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
              {colecoesFiltradas.length} coleção
              {colecoesFiltradas.length !== 1
                ? "ões"
                : ""}
            </p>
          </div>

          {colecoesFiltradas.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-cormorant text-2xl">
                Nenhuma coleção encontrada
              </p>

              <p className="mt-2 font-montserrat text-xs text-[#756f69]">
                Cadastre uma coleção ou altere
                os termos da busca.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] table-fixed">

                <thead>
                  <tr className="border-b border-[#e2d9ce] bg-[#f5f2ed]">

                    <th className="w-[22%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Coleção
                    </th>

                    <th className="w-[18%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Slug
                    </th>

                    <th className="w-[30%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Descrição
                    </th>

                    <th className="w-[10%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Produtos
                    </th>

                    <th className="w-[10%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Status
                    </th>

                    <th className="w-[10%] px-5 py-4 text-right font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Ações
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {colecoesFiltradas.map(
                    (colecao) => (
                      <tr
                        key={colecao.id}
                        className="border-b border-[#eee7df] last:border-b-0"
                      >

                        <td className="px-5 py-5">
                          <p className="truncate font-cormorant text-xl">
                            {colecao.nome}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="truncate font-montserrat text-xs text-[#5f5042]">
                            {colecao.slug}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="line-clamp-2 font-montserrat text-xs text-[#756f69]">
                            {colecao.descricao ||
                              "Sem descrição"}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-montserrat text-xs">
                            {colecao._count
                              ?.produtos ?? 0}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex px-2 py-1 font-montserrat text-[8px] uppercase tracking-[0.12em] ${
                              colecao.ativo
                                ? "bg-[#e7eee4] text-[#4f6547]"
                                : "bg-[#eee7e2] text-[#756f69]"
                            }`}
                          >
                            {colecao.ativo
                              ? "Ativo"
                              : "Inativo"}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center justify-end gap-4 whitespace-nowrap">

                            <button
                              type="button"
                              onClick={() =>
                                editarColecao(
                                  colecao
                                )
                              }
                              className="font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#8c7355] transition hover:text-[#1f1d1a]"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                inativarColecao(
                                  colecao
                                )
                              }
                              disabled={
                                excluindoId ===
                                  colecao.id ||
                                !colecao.ativo
                              }
                              className="font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#9a6758] transition hover:text-[#7a5143] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {excluindoId ===
                              colecao.id
                                ? "Inativando..."
                                : colecao.ativo
                                  ? "Inativar"
                                  : "Inativo"}
                            </button>

                          </div>
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}