"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Categoria = {
  id: number;
  nome: string;
  slug: string;
  descricao: string | null;
  ativo: boolean;
  _count?: {
    produtos: number;
  };
};

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [busca, setBusca] = useState("");

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [erro, setErro] = useState("");

  const [mensagem, setMensagem] =
    useState("");

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [descricao, setDescricao] =
    useState("");

  const [ativo, setAtivo] =
    useState(true);

  async function carregarCategorias() {
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
        `${API_URL}/api/categorias/admin`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          cache: "no-store",
        }
      );

      const dados =
        await resposta.json();

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
            "Não foi possível carregar as categorias."
        );
      }

      if (Array.isArray(dados)) {
        setCategorias(dados);
      } else if (
        dados &&
        Array.isArray(
          dados.categorias
        )
      ) {
        setCategorias(
          dados.categorias
        );
      } else {
        setCategorias([]);
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as categorias."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  const categoriasFiltradas =
    useMemo(() => {
      const termo =
        busca.trim().toLowerCase();

      if (!termo) {
        return categorias;
      }

      return categorias.filter(
        (categoria) =>
          categoria.nome
            .toLowerCase()
            .includes(termo) ||
          categoria.slug
            .toLowerCase()
            .includes(termo) ||
          categoria.descricao
            ?.toLowerCase()
            .includes(termo)
      );
    }, [categorias, busca]);

  function limparFormulario() {
    setEditandoId(null);
    setNome("");
    setSlug("");
    setDescricao("");
    setAtivo(true);
  }

  function iniciarEdicao(
    categoria: Categoria
  ) {
    setEditandoId(categoria.id);

    setNome(categoria.nome);
    setSlug(categoria.slug);
    setDescricao(
      categoria.descricao || ""
    );

    setAtivo(categoria.ativo);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function salvarCategoria(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    setErro("");
    setMensagem("");

    if (!nome.trim()) {
      setErro(
        "Informe o nome da categoria."
      );
      return;
    }

    if (!slug.trim()) {
      setErro(
        "Informe o slug da categoria."
      );
      return;
    }

    const token =
      localStorage.getItem(
        "lumea_token"
      );

    if (!token) {
      window.location.href =
        "/admin/login";

      return;
    }

    try {
      setSalvando(true);

      const corpo = {
        nome: nome.trim(),
        slug: slug.trim().toLowerCase(),
        descricao:
          descricao.trim() || null,
        ativo,
      };

      const url = editandoId
        ? `${API_URL}/api/categorias/${editandoId}`
        : `${API_URL}/api/categorias`;

      const resposta = await fetch(
        url,
        {
          method: editandoId
            ? "PUT"
            : "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(corpo),
        }
      );

      const dados =
        await resposta.json();

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
            "Não foi possível salvar a categoria."
        );
      }

      setMensagem(
        dados?.mensagem ||
          (editandoId
            ? "Categoria atualizada com sucesso."
            : "Categoria criada com sucesso.")
      );

      limparFormulario();

      await carregarCategorias();

      setTimeout(() => {
        setMensagem("");
      }, 4000);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a categoria."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function inativarCategoria(
    categoria: Categoria
  ) {
    const confirmar =
      window.confirm(
        `Deseja realmente inativar a categoria "${categoria.nome}"?\n\nEla deixará de aparecer nas opções públicas da loja.`
      );

    if (!confirmar) {
      return;
    }

    const token =
      localStorage.getItem(
        "lumea_token"
      );

    if (!token) {
      window.location.href =
        "/admin/login";

      return;
    }

    try {
      setErro("");
      setMensagem("");

      const resposta = await fetch(
        `${API_URL}/api/categorias/${categoria.id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const dados =
        await resposta.json();

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
            "Não foi possível inativar a categoria."
        );
      }

      setCategorias(
        (categoriasAtuais) =>
          categoriasAtuais.map(
            (item) =>
              item.id === categoria.id
                ? {
                    ...item,
                    ativo: false,
                  }
                : item
          )
      );

      setMensagem(
        dados?.mensagem ||
          "Categoria inativada com sucesso."
      );

      if (
        editandoId === categoria.id
      ) {
        limparFormulario();
      }

      setTimeout(() => {
        setMensagem("");
      }, 4000);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível inativar a categoria."
      );
    }
  }

  if (carregando) {
    return (
      <div className="p-6 lg:p-10">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#756f69]">
            Carregando categorias...
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
            Categorias
          </h1>

          <p className="mt-3 font-montserrat text-sm text-[#756f69]">
            Organize os produtos da
            loja por categorias.
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
        <section className="mb-8 border border-[#e2d9ce] bg-white p-6 lg:p-8">

          <div className="mb-7">
            <p className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-[#8c7355]">
              {editandoId
                ? "Editar categoria"
                : "Nova categoria"}
            </p>

            <h2 className="mt-2 font-cormorant text-3xl text-[#1f1d1a]">
              {editandoId
                ? "Alterar categoria"
                : "Cadastrar categoria"}
            </h2>
          </div>

          <form
            onSubmit={salvarCategoria}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label
                  htmlFor="nome"
                  className="block font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]"
                >
                  Nome
                </label>

                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(event) =>
                    setNome(
                      event.target.value
                    )
                  }
                  placeholder="Ex.: Brincos"
                  className="mt-3 w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="block font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]"
                >
                  Slug
                </label>

                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(event) =>
                    setSlug(
                      event.target.value
                    )
                  }
                  placeholder="ex.: brincos"
                  className="mt-3 w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                />
              </div>

            </div>

            <div>
              <label
                htmlFor="descricao"
                className="block font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]"
              >
                Descrição
              </label>

              <textarea
                id="descricao"
                value={descricao}
                onChange={(event) =>
                  setDescricao(
                    event.target.value
                  )
                }
                rows={4}
                placeholder="Descrição da categoria..."
                className="mt-3 w-full resize-y border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm leading-6 text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={ativo}
                onChange={(event) =>
                  setAtivo(
                    event.target.checked
                  )
                }
                className="h-4 w-4 accent-[#8c7355]"
              />

              <span className="font-montserrat text-xs text-[#5f5042]">
                Categoria ativa
              </span>
            </label>

            <div className="flex flex-col gap-3 border-t border-[#eee7df] pt-6 sm:flex-row sm:justify-end">

              {editandoId && (
                <button
                  type="button"
                  onClick={limparFormulario}
                  disabled={salvando}
                  className="border border-[#d8c7b0] px-6 py-3 font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#5f5042] transition hover:border-[#8c7355] hover:bg-[#f3eee8] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>
              )}

              <button
                type="submit"
                disabled={salvando}
                className="bg-[#1f1d1a] px-6 py-3 font-montserrat text-[9px] uppercase tracking-[0.18em] text-white transition hover:bg-[#8c7355] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {salvando
                  ? "Salvando..."
                  : editandoId
                    ? "Salvar alterações"
                    : "Criar categoria"}
              </button>

            </div>
          </form>
        </section>

        {/* Busca */}
        <div className="mb-6 border border-[#e2d9ce] bg-white p-5">

          <label className="block font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
            Buscar categoria
          </label>

          <input
            type="text"
            value={busca}
            onChange={(event) =>
              setBusca(
                event.target.value
              )
            }
            placeholder="Nome, slug ou descrição..."
            className="mt-3 w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
          />

        </div>

        {/* Lista */}
        <div className="overflow-hidden border border-[#e2d9ce] bg-white">

          <div className="border-b border-[#e2d9ce] px-5 py-4">
            <p className="font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
              {categoriasFiltradas.length} categoria
              {categoriasFiltradas.length !==
              1
                ? "s"
                : ""}
            </p>
          </div>

          {categoriasFiltradas.length ===
          0 ? (
            <div className="p-10 text-center">
              <p className="font-cormorant text-2xl">
                Nenhuma categoria encontrada
              </p>

              <p className="mt-2 font-montserrat text-xs text-[#756f69]">
                Tente alterar os termos
                da busca.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] table-fixed">

                <thead>
                  <tr className="border-b border-[#e2d9ce] bg-[#f5f2ed]">

                    <th className="w-[23%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Categoria
                    </th>

                    <th className="w-[23%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Slug
                    </th>

                    <th className="w-[25%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Descrição
                    </th>

                    <th className="w-[10%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Produtos
                    </th>

                    <th className="w-[9%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Status
                    </th>

                    <th className="w-[10%] px-5 py-4 text-right font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Ações
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {categoriasFiltradas.map(
                    (categoria) => (
                      <tr
                        key={categoria.id}
                        className="border-b border-[#eee7df] last:border-b-0"
                      >

                        <td className="px-5 py-5">
                          <p className="truncate font-cormorant text-xl">
                            {categoria.nome}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="truncate font-montserrat text-[10px] text-[#756f69]">
                            {categoria.slug}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="truncate font-montserrat text-xs text-[#5f5042]">
                            {categoria.descricao ||
                              "—"}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-montserrat text-xs">
                            {categoria._count
                              ?.produtos ??
                              0}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex px-2 py-1 font-montserrat text-[8px] uppercase tracking-[0.12em] ${
                              categoria.ativo
                                ? "bg-[#e7eee4] text-[#4f6547]"
                                : "bg-[#eee7e2] text-[#756f69]"
                            }`}
                          >
                            {categoria.ativo
                              ? "Ativo"
                              : "Inativo"}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center justify-end gap-4 whitespace-nowrap">

                            <button
                              type="button"
                              onClick={() =>
                                iniciarEdicao(
                                  categoria
                                )
                              }
                              className="font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#8c7355] transition hover:text-[#1f1d1a]"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                inativarCategoria(
                                  categoria
                                )
                              }
                              disabled={
                                !categoria.ativo
                              }
                              className="font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#9a6758] transition hover:text-[#7a5143] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {categoria.ativo
                                ? "Inativar"
                                : "Inativa"}
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