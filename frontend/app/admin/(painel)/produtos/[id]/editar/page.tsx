"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Categoria = {
  id: number;
  nome: string;
  slug: string;
  ativo: boolean;
};

type Colecao = {
  id: number;
  nome: string;
  slug: string;
  ativo: boolean;
};

type Produto = {
  id: number;
  nome: string;
  slug: string;
  descricao: string;
  preco: string | number;
  precoOferta: string | number | null;
  estoque: number;
  ativo: boolean;
  destaque: boolean;
  novo: boolean;
  oferta: boolean;
  imagem: string | null;
  categoriaId: number;
  colecaoId: number | null;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function obterToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("lumea_token") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("lumea_token")
  );
}

function formatarPreco(valor: string | number | null): string {
  if (valor === null || valor === undefined || valor === "") {
    return "";
  }

  return String(valor).replace(".", ",");
}

export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [produto, setProduto] = useState<Produto | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [colecoes, setColecoes] = useState<Colecao[]>([]);

  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [precoOferta, setPrecoOferta] = useState("");
  const [estoque, setEstoque] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [colecaoId, setColecaoId] = useState("");

  const [ativo, setAtivo] = useState(true);
  const [destaque, setDestaque] = useState(false);
  const [novo, setNovo] = useState(false);
  const [oferta, setOferta] = useState(false);

  const [imagemAtual, setImagemAtual] = useState<string | null>(null);
  const [novaImagem, setNovaImagem] = useState<File | null>(null);
  const [previewImagem, setPreviewImagem] = useState<string | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    async function carregarDados() {
      try {
        setCarregando(true);
        setErro("");

        const token = obterToken();

        if (!token) {
          router.push("/admin/login");
          return;
        }

        const [produtoResposta, categoriasResposta, colecoesResposta] =
          await Promise.all([
            fetch(`${API_URL}/api/produtos/admin/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              cache: "no-store",
            }),

            fetch(`${API_URL}/api/categorias`, {
              cache: "no-store",
            }),

            fetch(`${API_URL}/api/colecoes`, {
              cache: "no-store",
            }),
          ]);

        if (
          produtoResposta.status === 401 ||
          produtoResposta.status === 403
        ) {
          router.push("/admin/login");
          return;
        }

        const produtoDados = await produtoResposta.json();

        if (!produtoResposta.ok) {
          throw new Error(
            produtoDados?.mensagem ||
              "Não foi possível carregar o produto."
          );
        }

        const categoriasDados = await categoriasResposta.json();
        const colecoesDados = await colecoesResposta.json();

        const produtoCarregado: Produto =
          produtoDados;

        const categoriasCarregadas: Categoria[] =
          Array.isArray(categoriasDados)
            ? categoriasDados
            : categoriasDados?.categorias || [];

        const colecoesCarregadas: Colecao[] =
          Array.isArray(colecoesDados)
            ? colecoesDados
            : colecoesDados?.colecoes || [];

        setProduto(produtoCarregado);
        setCategorias(categoriasCarregadas);
        setColecoes(colecoesCarregadas);

        setNome(produtoCarregado.nome);
        setSlug(produtoCarregado.slug);
        setDescricao(produtoCarregado.descricao);
        setPreco(formatarPreco(produtoCarregado.preco));
        setPrecoOferta(
          formatarPreco(produtoCarregado.precoOferta)
        );
        setEstoque(String(produtoCarregado.estoque));
        setCategoriaId(String(produtoCarregado.categoriaId));
        setColecaoId(
          produtoCarregado.colecaoId
            ? String(produtoCarregado.colecaoId)
            : ""
        );

        setAtivo(produtoCarregado.ativo);
        setDestaque(produtoCarregado.destaque);
        setNovo(produtoCarregado.novo);
        setOferta(produtoCarregado.oferta);

        setImagemAtual(produtoCarregado.imagem);
      } catch (error) {
        console.error(error);

        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar produto."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [id, router]);

  function alterarImagem(
    evento: ChangeEvent<HTMLInputElement>
  ) {
    const arquivo = evento.target.files?.[0];

    if (!arquivo) {
      return;
    }

    setNovaImagem(arquivo);

    const url = URL.createObjectURL(arquivo);
    setPreviewImagem(url);
  }

  function converterNumero(valor: string): string {
    return valor.replace(",", ".");
  }

  async function salvarProduto(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    setMensagem("");
    setErro("");

    if (!id) {
      setErro("ID do produto não encontrado.");
      return;
    }

    const token = obterToken();

    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (!nome.trim()) {
      setErro("Informe o nome do produto.");
      return;
    }

    if (!slug.trim()) {
      setErro("Informe o slug do produto.");
      return;
    }

    if (!descricao.trim()) {
      setErro("Informe a descrição do produto.");
      return;
    }

    if (!preco.trim()) {
      setErro("Informe o preço do produto.");
      return;
    }

    if (!categoriaId) {
      setErro("Selecione uma categoria.");
      return;
    }

    if (estoque === "" || Number(estoque) < 0) {
      setErro("Informe um estoque válido.");
      return;
    }

    try {
      setSalvando(true);

      const formulario = new FormData();

      formulario.append("nome", nome.trim());
      formulario.append("slug", slug.trim());
      formulario.append("descricao", descricao.trim());

      formulario.append(
        "preco",
        converterNumero(preco)
      );

      if (precoOferta.trim()) {
        formulario.append(
          "precoOferta",
          converterNumero(precoOferta)
        );
      } else {
        formulario.append("precoOferta", "");
      }

      formulario.append("estoque", estoque);
      formulario.append("categoriaId", categoriaId);
      formulario.append("colecaoId", colecaoId);

      formulario.append("ativo", String(ativo));
      formulario.append("destaque", String(destaque));
      formulario.append("novo", String(novo));
      formulario.append("oferta", String(oferta));

      if (novaImagem) {
        formulario.append("imagem", novaImagem);
      }

      const resposta = await fetch(
        `${API_URL}/api/produtos/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formulario,
        }
      );

      const dados = await resposta.json();

      if (
        resposta.status === 401 ||
        resposta.status === 403
      ) {
        router.push("/admin/login");
        return;
      }

      if (!resposta.ok) {
        throw new Error(
          dados?.mensagem ||
            "Não foi possível atualizar o produto."
        );
      }

      const produtoAtualizado: Produto =
        dados.produto;

      setProduto(produtoAtualizado);
      setImagemAtual(produtoAtualizado.imagem);
      setNovaImagem(null);
      setPreviewImagem(null);

      setMensagem(
        dados?.mensagem ||
          "Produto atualizado com sucesso."
      );

      setTimeout(() => {
        setMensagem("");
      }, 4000);
    } catch (error) {
      console.error(error);

      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar produto."
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm tracking-wide text-[#756F69]">
            Carregando produto...
          </p>
        </div>
      </main>
    );
  }

  if (erro && !produto) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-8 text-sm uppercase tracking-[0.18em] text-[#8C7355] transition hover:text-[#1F1D1A]"
          >
            ← Voltar
          </button>

          <div className="border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-700">
              {erro}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col gap-5 border-b border-[#E7DFD5] pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-4 text-xs uppercase tracking-[0.18em] text-[#8C7355] transition hover:text-[#1F1D1A]"
            >
              ← Voltar para produtos
            </button>

            <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#8C7355]">
              Administração
            </p>

            <h1 className="font-cormorant text-4xl text-[#1F1D1A] sm:text-5xl">
              Editar produto
            </h1>

            {produto && (
              <p className="mt-2 text-sm text-[#756F69]">
                Produto #{produto.id}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/admin/produtos")
            }
            className="border border-[#D8C7B0] px-5 py-3 text-xs uppercase tracking-[0.18em] text-[#5F5042] transition hover:border-[#8C7355] hover:bg-[#F3EEE8]"
          >
            Ver produtos
          </button>
        </div>

        {/* Mensagens */}
        {mensagem && (
          <div className="mb-6 border border-[#C9B59D] bg-[#F3EEE8] px-5 py-4">
            <p className="text-sm text-[#5F5042]">
              {mensagem}
            </p>
          </div>
        )}

        {erro && produto && (
          <div className="mb-6 border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm text-red-700">
              {erro}
            </p>
          </div>
        )}

        <form
          onSubmit={salvarProduto}
          className="space-y-8"
        >
          {/* Informações principais */}
          <section className="border border-[#E7DFD5] bg-white p-6 sm:p-8">
            <div className="mb-7">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#8C7355]">
                Informações
              </p>

              <h2 className="font-cormorant text-3xl text-[#1F1D1A]">
                Dados do produto
              </h2>
            </div>

            <div className="grid gap-6">
              <div>
                <label
                  htmlFor="nome"
                  className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#5F5042]"
                >
                  Nome
                </label>

                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) =>
                    setNome(e.target.value)
                  }
                  className="w-full border border-[#D8C7B0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F1D1A] outline-none transition focus:border-[#8C7355]"
                  placeholder="Nome do produto"
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#5F5042]"
                >
                  Slug
                </label>

                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(e.target.value)
                  }
                  className="w-full border border-[#D8C7B0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F1D1A] outline-none transition focus:border-[#8C7355]"
                  placeholder="nome-do-produto"
                />
              </div>

              <div>
                <label
                  htmlFor="descricao"
                  className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#5F5042]"
                >
                  Descrição
                </label>

                <textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) =>
                    setDescricao(e.target.value)
                  }
                  rows={6}
                  className="w-full resize-y border border-[#D8C7B0] bg-[#FAF8F5] px-4 py-3 text-sm leading-6 text-[#1F1D1A] outline-none transition focus:border-[#8C7355]"
                  placeholder="Descrição do produto"
                />
              </div>
            </div>
          </section>

          {/* Preços e estoque */}
          <section className="border border-[#E7DFD5] bg-white p-6 sm:p-8">
            <div className="mb-7">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#8C7355]">
                Comercial
              </p>

              <h2 className="font-cormorant text-3xl text-[#1F1D1A]">
                Preço e estoque
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label
                  htmlFor="preco"
                  className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#5F5042]"
                >
                  Preço
                </label>

                <input
                  id="preco"
                  type="text"
                  inputMode="decimal"
                  value={preco}
                  onChange={(e) =>
                    setPreco(e.target.value)
                  }
                  className="w-full border border-[#D8C7B0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F1D1A] outline-none transition focus:border-[#8C7355]"
                  placeholder="129,90"
                />
              </div>

              <div>
                <label
                  htmlFor="precoOferta"
                  className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#5F5042]"
                >
                  Preço promocional
                </label>

                <input
                  id="precoOferta"
                  type="text"
                  inputMode="decimal"
                  value={precoOferta}
                  onChange={(e) =>
                    setPrecoOferta(e.target.value)
                  }
                  className="w-full border border-[#D8C7B0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F1D1A] outline-none transition focus:border-[#8C7355]"
                  placeholder="99,90"
                />
              </div>

              <div>
                <label
                  htmlFor="estoque"
                  className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#5F5042]"
                >
                  Estoque
                </label>

                <input
                  id="estoque"
                  type="number"
                  min="0"
                  value={estoque}
                  onChange={(e) =>
                    setEstoque(e.target.value)
                  }
                  className="w-full border border-[#D8C7B0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F1D1A] outline-none transition focus:border-[#8C7355]"
                  placeholder="0"
                />
              </div>
            </div>
          </section>

          {/* Organização */}
          <section className="border border-[#E7DFD5] bg-white p-6 sm:p-8">
            <div className="mb-7">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#8C7355]">
                Organização
              </p>

              <h2 className="font-cormorant text-3xl text-[#1F1D1A]">
                Categoria e coleção
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="categoria"
                  className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#5F5042]"
                >
                  Categoria
                </label>

                <select
                  id="categoria"
                  value={categoriaId}
                  onChange={(e) =>
                    setCategoriaId(e.target.value)
                  }
                  className="w-full border border-[#D8C7B0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F1D1A] outline-none transition focus:border-[#8C7355]"
                >
                  <option value="">
                    Selecione uma categoria
                  </option>

                  {categorias
                    .filter((categoria) => categoria.ativo)
                    .map((categoria) => (
                      <option
                        key={categoria.id}
                        value={categoria.id}
                      >
                        {categoria.nome}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="colecao"
                  className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#5F5042]"
                >
                  Coleção
                </label>

                <select
                  id="colecao"
                  value={colecaoId}
                  onChange={(e) =>
                    setColecaoId(e.target.value)
                  }
                  className="w-full border border-[#D8C7B0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F1D1A] outline-none transition focus:border-[#8C7355]"
                >
                  <option value="">
                    Sem coleção
                  </option>

                  {colecoes
                    .filter((colecao) => colecao.ativo)
                    .map((colecao) => (
                      <option
                        key={colecao.id}
                        value={colecao.id}
                      >
                        {colecao.nome}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </section>

          {/* Imagem */}
          <section className="border border-[#E7DFD5] bg-white p-6 sm:p-8">
            <div className="mb-7">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#8C7355]">
                Visual
              </p>

              <h2 className="font-cormorant text-3xl text-[#1F1D1A]">
                Imagem do produto
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.14em] text-[#5F5042]">
                  Imagem atual
                </p>

                <div className="flex min-h-[280px] items-center justify-center border border-[#E7DFD5] bg-[#FAF8F5] p-4">
                  {imagemAtual ? (
                    <img
                      src={
                        imagemAtual.startsWith("http")
                          ? imagemAtual
                          : `${API_URL}${imagemAtual}`
                      }
                      alt={nome || "Imagem do produto"}
                      className="max-h-[260px] max-w-full object-contain"
                    />
                  ) : (
                    <p className="text-sm text-[#756F69]">
                      Este produto não possui imagem.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.14em] text-[#5F5042]">
                  Nova imagem
                </p>

                <label
                  htmlFor="imagem"
                  className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center border border-dashed border-[#D8C7B0] bg-[#FAF8F5] p-6 text-center transition hover:border-[#8C7355] hover:bg-[#F3EEE8]"
                >
                  {previewImagem ? (
                    <img
                      src={previewImagem}
                      alt="Pré-visualização"
                      className="max-h-[220px] max-w-full object-contain"
                    />
                  ) : (
                    <>
                      <span className="mb-3 font-cormorant text-2xl text-[#5F5042]">
                        Selecionar imagem
                      </span>

                      <span className="text-xs uppercase tracking-[0.12em] text-[#756F69]">
                        JPG, JPEG, PNG, WEBP ou GIF
                      </span>

                      <span className="mt-2 text-xs text-[#756F69]">
                        Máximo de 5 MB
                      </span>
                    </>
                  )}

                  <input
                    id="imagem"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
                    onChange={alterarImagem}
                    className="hidden"
                  />
                </label>

                {novaImagem && (
                  <p className="mt-3 text-xs text-[#756F69]">
                    Arquivo selecionado:{" "}
                    {novaImagem.name}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Status */}
          <section className="border border-[#E7DFD5] bg-white p-6 sm:p-8">
            <div className="mb-7">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#8C7355]">
                Visibilidade
              </p>

              <h2 className="font-cormorant text-3xl text-[#1F1D1A]">
                Status do produto
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="flex cursor-pointer items-center gap-3 border border-[#E7DFD5] bg-[#FAF8F5] p-4">
                <input
                  type="checkbox"
                  checked={ativo}
                  onChange={(e) =>
                    setAtivo(e.target.checked)
                  }
                  className="h-4 w-4 accent-[#8C7355]"
                />

                <span className="text-sm text-[#1F1D1A]">
                  Produto ativo
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 border border-[#E7DFD5] bg-[#FAF8F5] p-4">
                <input
                  type="checkbox"
                  checked={destaque}
                  onChange={(e) =>
                    setDestaque(e.target.checked)
                  }
                  className="h-4 w-4 accent-[#8C7355]"
                />

                <span className="text-sm text-[#1F1D1A]">
                  Produto destaque
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 border border-[#E7DFD5] bg-[#FAF8F5] p-4">
                <input
                  type="checkbox"
                  checked={novo}
                  onChange={(e) =>
                    setNovo(e.target.checked)
                  }
                  className="h-4 w-4 accent-[#8C7355]"
                />

                <span className="text-sm text-[#1F1D1A]">
                  Produto novo
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 border border-[#E7DFD5] bg-[#FAF8F5] p-4">
                <input
                  type="checkbox"
                  checked={oferta}
                  onChange={(e) =>
                    setOferta(e.target.checked)
                  }
                  className="h-4 w-4 accent-[#8C7355]"
                />

                <span className="text-sm text-[#1F1D1A]">
                  Em oferta
                </span>
              </label>
            </div>
          </section>

          {/* Ações */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#E7DFD5] pt-7 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={salvando}
              className="border border-[#D8C7B0] px-7 py-3 text-xs uppercase tracking-[0.18em] text-[#5F5042] transition hover:border-[#8C7355] hover:bg-[#F3EEE8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={salvando}
              className="bg-[#8C7355] px-7 py-3 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-[#6F5A43] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando
                ? "Salvando..."
                : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}