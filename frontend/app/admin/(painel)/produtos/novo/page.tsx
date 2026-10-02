"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Categoria = {
  id: number;
  nome: string;
};

type Colecao = {
  id: number;
  nome: string;
};

export default function NovoProdutoPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [colecoes, setColecoes] = useState<Colecao[]>([]);

  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [precoOferta, setPrecoOferta] = useState("");
  const [estoque, setEstoque] = useState("0");
  const [categoriaId, setCategoriaId] = useState("");
  const [colecaoId, setColecaoId] = useState("");

  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState("");

  const [ativo, setAtivo] = useState(true);
  const [destaque, setDestaque] = useState(false);
  const [novo, setNovo] = useState(false);
  const [oferta, setOferta] = useState(false);

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        const token = localStorage.getItem("lumea_token");

        const [categoriasResposta, colecoesResposta] =
          await Promise.all([
            fetch(`${API_URL}/api/categorias`),
            fetch(`${API_URL}/api/colecoes`),
          ]);

        if (!categoriasResposta.ok) {
          throw new Error(
            "Não foi possível carregar as categorias."
          );
        }

        if (!colecoesResposta.ok) {
          throw new Error(
            "Não foi possível carregar as coleções."
          );
        }

        const categoriasDados =
          await categoriasResposta.json();

        const colecoesDados =
          await colecoesResposta.json();

        setCategorias(
          Array.isArray(categoriasDados)
            ? categoriasDados
            : categoriasDados.categorias || []
        );

        setColecoes(
          Array.isArray(colecoesDados)
            ? colecoesDados
            : colecoesDados.colecoes || []
        );

        if (!token) {
          setErro(
            "Sessão administrativa não encontrada."
          );
        }
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar dados."
        );
      }
    }

    carregarDados();
  }, []);

  function gerarSlug(valor: string) {
    return valor
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function alterarNome(valor: string) {
    setNome(valor);

    if (!slug) {
      setSlug(gerarSlug(valor));
    }
  }

  function selecionarImagem(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      setImagem(null);
      setImagemPreview("");
      return;
    }

    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!tiposPermitidos.includes(arquivo.type)) {
      setErro(
        "Formato não permitido. Use JPG, JPEG, PNG, WEBP ou GIF."
      );

      event.target.value = "";
      setImagem(null);
      setImagemPreview("");
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      setErro(
        "A imagem deve ter no máximo 5 MB."
      );

      event.target.value = "";
      setImagem(null);
      setImagemPreview("");
      return;
    }

    setErro("");
    setImagem(arquivo);

    const url = URL.createObjectURL(arquivo);
    setImagemPreview(url);
  }

  async function salvarProduto(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSalvando(true);
    setMensagem("");
    setErro("");

    try {
      const token =
        localStorage.getItem("lumea_token");

      if (!token) {
        throw new Error(
          "Sessão administrativa não encontrada."
        );
      }

      const formulario = new FormData();

      formulario.append("nome", nome);
      formulario.append("slug", slug);
      formulario.append("descricao", descricao);
      formulario.append("preco", preco);
      formulario.append(
        "precoOferta",
        precoOferta
      );
      formulario.append("estoque", estoque);
      formulario.append(
        "categoriaId",
        categoriaId
      );
      formulario.append(
        "colecaoId",
        colecaoId
      );
      formulario.append(
        "ativo",
        String(ativo)
      );
      formulario.append(
        "destaque",
        String(destaque)
      );
      formulario.append(
        "novo",
        String(novo)
      );
      formulario.append(
        "oferta",
        String(oferta)
      );

      if (imagem) {
        formulario.append(
          "imagem",
          imagem
        );
      }

      const resposta = await fetch(
        `${API_URL}/api/produtos`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formulario,
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
            "Não foi possível criar o produto."
        );
      }

      setMensagem(
        "Produto criado com sucesso."
      );

      setNome("");
      setSlug("");
      setDescricao("");
      setPreco("");
      setPrecoOferta("");
      setEstoque("0");
      setCategoriaId("");
      setColecaoId("");
      setImagem(null);
      setImagemPreview("");
      setAtivo(true);
      setDestaque(false);
      setNovo(false);
      setOferta(false);

      const campoImagem =
        document.getElementById(
          "imagem"
        ) as HTMLInputElement | null;

      if (campoImagem) {
        campoImagem.value = "";
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao criar produto."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="min-h-full p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 border-b border-[#ded5ca] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-[#8c7355]">
              Catálogo
            </p>

            <h1 className="mt-2 font-cormorant text-4xl text-[#1f1d1a]">
              Novo produto
            </h1>

            <p className="mt-2 font-montserrat text-xs text-[#756f69]">
              Cadastre um novo produto no catálogo
              LUMÉA.
            </p>
          </div>

          <Link
            href="/admin/produtos"
            className="inline-flex border border-[#cfc4b8] px-5 py-3 font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#5f5042] transition hover:border-[#8c7355] hover:text-[#8c7355]"
          >
            Voltar para produtos
          </Link>
        </div>

        {mensagem && (
          <div className="mb-6 border border-[#c9d8c4] bg-[#eef5eb] px-5 py-4 font-montserrat text-xs text-[#4d6548]">
            {mensagem}
          </div>
        )}

        {erro && (
          <div className="mb-6 border border-[#dfc4bd] bg-[#f8eeeb] px-5 py-4 font-montserrat text-xs text-[#8a5147]">
            {erro}
          </div>
        )}

        <form
          onSubmit={salvarProduto}
          className="space-y-8"
        >
          {/* =========================
              INFORMAÇÕES
          ========================= */}

          <div className="border border-[#ded5ca] bg-white p-6 lg:p-8">
            <h2 className="font-cormorant text-2xl">
              Informações do produto
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Campo
                label="Nome"
                required
                value={nome}
                onChange={alterarNome}
                placeholder="Ex.: Lumière"
              />

              <Campo
                label="Slug"
                required
                value={slug}
                onChange={setSlug}
                placeholder="ex.: lumiere"
              />

              <div className="md:col-span-2">
                <label className="font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#5f5042]">
                  Descrição *
                </label>

                <textarea
                  required
                  value={descricao}
                  onChange={(event) =>
                    setDescricao(
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder="Descreva o produto..."
                  className="mt-2 w-full border border-[#d9d0c6] bg-[#fcfaf7] px-4 py-3 font-montserrat text-sm outline-none transition focus:border-[#8c7355]"
                />
              </div>
            </div>
          </div>

          {/* =========================
              PREÇO E ESTOQUE
          ========================= */}

          <div className="border border-[#ded5ca] bg-white p-6 lg:p-8">
            <h2 className="font-cormorant text-2xl">
              Preço e estoque
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <Campo
                label="Preço"
                required
                type="number"
                step="0.01"
                min="0"
                value={preco}
                onChange={setPreco}
                placeholder="0,00"
              />

              <Campo
                label="Preço promocional"
                type="number"
                step="0.01"
                min="0"
                value={precoOferta}
                onChange={setPrecoOferta}
                placeholder="Opcional"
              />

              <Campo
                label="Estoque"
                required
                type="number"
                min="0"
                step="1"
                value={estoque}
                onChange={setEstoque}
                placeholder="0"
              />
            </div>
          </div>

          {/* =========================
              ORGANIZAÇÃO
          ========================= */}

          <div className="border border-[#ded5ca] bg-white p-6 lg:p-8">
            <h2 className="font-cormorant text-2xl">
              Organização
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <SelectCampo
                label="Categoria"
                required
                value={categoriaId}
                onChange={setCategoriaId}
              >
                <option value="">
                  Selecione uma categoria
                </option>

                {categorias.map(
                  (categoria) => (
                    <option
                      key={categoria.id}
                      value={categoria.id}
                    >
                      {categoria.nome}
                    </option>
                  )
                )}
              </SelectCampo>

              <SelectCampo
                label="Coleção"
                value={colecaoId}
                onChange={setColecaoId}
              >
                <option value="">
                  Nenhuma coleção
                </option>

                {colecoes.map(
                  (colecao) => (
                    <option
                      key={colecao.id}
                      value={colecao.id}
                    >
                      {colecao.nome}
                    </option>
                  )
                )}
              </SelectCampo>
            </div>
          </div>

          {/* =========================
              IMAGEM
          ========================= */}

          <div className="border border-[#ded5ca] bg-white p-6 lg:p-8">
            <h2 className="font-cormorant text-2xl">
              Imagem do produto
            </h2>

            <p className="mt-2 font-montserrat text-xs text-[#756f69]">
              Selecione uma imagem do seu computador.
            </p>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px]">
              <div>
                <label
                  htmlFor="imagem"
                  className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#d9d0c6] bg-[#fcfaf7] px-6 py-12 text-center transition hover:border-[#8c7355]"
                >
                  <span className="font-cormorant text-2xl text-[#5f5042]">
                    Selecionar imagem
                  </span>

                  <span className="mt-2 font-montserrat text-[9px] uppercase tracking-[0.16em] text-[#756f69]">
                    JPG · JPEG · PNG · WEBP · GIF
                  </span>

                  <span className="mt-1 font-montserrat text-[9px] text-[#756f69]">
                    Tamanho máximo: 5 MB
                  </span>
                </label>

                <input
                  id="imagem"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
                  onChange={selecionarImagem}
                  className="sr-only"
                />

                {imagem && (
                  <p className="mt-3 font-montserrat text-xs text-[#5f5042]">
                    Arquivo selecionado:{" "}
                    <strong>
                      {imagem.name}
                    </strong>
                  </p>
                )}
              </div>

              <div className="flex min-h-[280px] items-center justify-center border border-[#ded5ca] bg-[#f3eee8]">
                {imagemPreview ? (
                  <img
                    src={imagemPreview}
                    alt="Pré-visualização do produto"
                    className="h-full max-h-[280px] w-full object-contain"
                  />
                ) : (
                  <div className="px-6 text-center">
                    <p className="font-cormorant text-xl text-[#8c7355]">
                      Pré-visualização
                    </p>

                    <p className="mt-2 font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      A imagem aparecerá aqui
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================
              DESTAQUES
          ========================= */}

          <div className="border border-[#ded5ca] bg-white p-6 lg:p-8">
            <h2 className="font-cormorant text-2xl">
              Destaques
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Checkbox
                label="Produto ativo"
                checked={ativo}
                onChange={setAtivo}
              />

              <Checkbox
                label="Produto em destaque"
                checked={destaque}
                onChange={setDestaque}
              />

              <Checkbox
                label="Produto novo"
                checked={novo}
                onChange={setNovo}
              />

              <Checkbox
                label="Produto em oferta"
                checked={oferta}
                onChange={setOferta}
              />
            </div>
          </div>

          {/* =========================
              AÇÕES
          ========================= */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/produtos"
              className="border border-[#cfc4b8] px-6 py-3 text-center font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#5f5042] transition hover:border-[#8c7355]"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={salvando}
              className="bg-[#1f1d1a] px-7 py-3 font-montserrat text-[9px] uppercase tracking-[0.18em] text-white transition hover:bg-[#8c7355] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando
                ? "Salvando..."
                : "Salvar produto"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

// =========================
// CAMPO
// =========================

function Campo({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  step,
  min,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  step?: string;
  min?: string;
}) {
  return (
    <div>
      <label className="font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#5f5042]">
        {label}
        {required ? " *" : ""}
      </label>

      <input
        required={required}
        type={type}
        step={step}
        min={min}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full border border-[#d9d0c6] bg-[#fcfaf7] px-4 py-3 font-montserrat text-sm outline-none transition focus:border-[#8c7355]"
      />
    </div>
  );
}

// =========================
// SELECT
// =========================

function SelectCampo({
  label,
  required,
  value,
  onChange,
  children,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#5f5042]">
        {label}
        {required ? " *" : ""}
      </label>

      <select
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full border border-[#d9d0c6] bg-[#fcfaf7] px-4 py-3 font-montserrat text-sm outline-none transition focus:border-[#8c7355]"
      >
        {children}
      </select>
    </div>
  );
}

// =========================
// CHECKBOX
// =========================

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 border border-[#e1d9d0] bg-[#fcfaf7] px-4 py-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-4 w-4 accent-[#8c7355]"
      />

      <span className="font-montserrat text-[10px] uppercase tracking-[0.12em] text-[#5f5042]">
        {label}
      </span>
    </label>
  );
}