"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

type Cupom = {
  id: number;
  codigo: string;
  descricao: string | null;
  percentual: string | number | null;
  valorFixo: string | number | null;
  valorMinimo: string | number | null;
  limiteUso: number | null;
  usosRealizados: number;
  ativo: boolean;
  validadeInicio: string | null;
  validadeFim: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

type TipoDesconto = "percentual" | "fixo";

type FormularioCupom = {
  codigo: string;
  descricao: string;
  tipoDesconto: TipoDesconto;
  valorDesconto: string;
  valorMinimo: string;
  limiteUso: string;
  ativo: boolean;
  validadeInicio: string;
  validadeFim: string;
};

const formularioInicial: FormularioCupom = {
  codigo: "",
  descricao: "",
  tipoDesconto: "percentual",
  valorDesconto: "",
  valorMinimo: "",
  limiteUso: "",
  ativo: true,
  validadeInicio: "",
  validadeFim: "",
};

export default function AdminCuponsPage() {
  const [cupons, setCupons] = useState<Cupom[]>([]);

  const [formulario, setFormulario] =
    useState<FormularioCupom>(
      formularioInicial
    );

  const [busca, setBusca] = useState("");

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [inativandoId, setInativandoId] =
    useState<number | null>(null);

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] =
    useState("");

  // =========================
  // CARREGAR CUPONS
  // =========================

  async function carregarCupons() {
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
        `${API_URL}/api/cupons/admin`,
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
            "Não foi possível carregar os cupons."
        );
      }

      if (Array.isArray(dados)) {
        setCupons(dados);
      } else if (
        dados &&
        Array.isArray(dados.cupons)
      ) {
        setCupons(dados.cupons);
      } else {
        setCupons([]);
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os cupons."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCupons();
  }, []);

  // =========================
  // FORMATAÇÕES
  // =========================

  function formatarMoeda(
    valor: string | number | null
  ) {
    if (
      valor === null ||
      valor === undefined ||
      valor === ""
    ) {
      return "—";
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
      return "—";
    }

    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarPercentual(
    valor: string | number | null
  ) {
    if (
      valor === null ||
      valor === undefined ||
      valor === ""
    ) {
      return "—";
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
      return "—";
    }

    return `${numero.toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )}%`;
  }

  function formatarData(
    valor: string | null
  ) {
    if (!valor) {
      return "—";
    }

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
      return "—";
    }

    return data.toLocaleDateString(
      "pt-BR"
    );
  }

  function formatarDataInput(
    valor: string | null
  ) {
    if (!valor) {
      return "";
    }

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
      return "";
    }

    const ano = data.getFullYear();
    const mes = String(
      data.getMonth() + 1
    ).padStart(2, "0");
    const dia = String(
      data.getDate()
    ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

  // =========================
  // LIMPAR FORMULÁRIO
  // =========================

  function limparFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setErro("");
  }

  // =========================
  // EDITAR CUPOM
  // =========================

  function editarCupom(cupom: Cupom) {
    const percentual =
      cupom.percentual !== null
        ? String(cupom.percentual)
        : null;

    const valorFixo =
      cupom.valorFixo !== null
        ? String(cupom.valorFixo)
        : null;

    setEditandoId(cupom.id);

    setFormulario({
      codigo: cupom.codigo,
      descricao:
        cupom.descricao || "",
      tipoDesconto:
        percentual !== null
          ? "percentual"
          : "fixo",
      valorDesconto:
        percentual !== null
          ? percentual
          : valorFixo || "",
      valorMinimo:
        cupom.valorMinimo !== null
          ? String(cupom.valorMinimo)
          : "",
      limiteUso:
        cupom.limiteUso !== null
          ? String(cupom.limiteUso)
          : "",
      ativo: cupom.ativo,
      validadeInicio:
        formatarDataInput(
          cupom.validadeInicio
        ),
      validadeFim:
        formatarDataInput(
          cupom.validadeFim
        ),
    });

    setMensagem("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================
  // SALVAR CUPOM
  // =========================

  async function salvarCupom(
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

    if (!formulario.codigo.trim()) {
      setErro(
        "Informe o código do cupom."
      );
      return;
    }

    if (!formulario.valorDesconto.trim()) {
      setErro(
        "Informe o valor do desconto."
      );
      return;
    }

    const valorDesconto = Number(
      formulario.valorDesconto
        .replace(",", ".")
    );

    if (
      !Number.isFinite(valorDesconto) ||
      valorDesconto <= 0
    ) {
      setErro(
        "Informe um valor de desconto válido."
      );
      return;
    }

    if (
      formulario.tipoDesconto ===
        "percentual" &&
      valorDesconto > 100
    ) {
      setErro(
        "O percentual não pode ser maior que 100%."
      );
      return;
    }

    if (
      formulario.valorMinimo &&
      Number(
        formulario.valorMinimo.replace(
          ",",
          "."
        )
      ) < 0
    ) {
      setErro(
        "O valor mínimo não pode ser negativo."
      );
      return;
    }

    if (
      formulario.limiteUso &&
      (!Number.isInteger(
        Number(formulario.limiteUso)
      ) ||
        Number(formulario.limiteUso) <= 0)
    ) {
      setErro(
        "O limite de uso deve ser um número inteiro maior que zero."
      );
      return;
    }

    if (
      formulario.validadeInicio &&
      formulario.validadeFim &&
      formulario.validadeFim <
        formulario.validadeInicio
    ) {
      setErro(
        "A data final não pode ser anterior à data inicial."
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
          ? `${API_URL}/api/cupons/${editandoId}`
          : `${API_URL}/api/cupons`;

      const corpo = {
        codigo: formulario.codigo
          .trim()
          .toUpperCase(),

        descricao:
          formulario.descricao.trim() ||
          null,

        percentual:
          formulario.tipoDesconto ===
          "percentual"
            ? valorDesconto
            : null,

        valorFixo:
          formulario.tipoDesconto ===
          "fixo"
            ? valorDesconto
            : null,

        valorMinimo:
          formulario.valorMinimo
            ? Number(
                formulario.valorMinimo.replace(
                  ",",
                  "."
                )
              )
            : null,

        limiteUso:
          formulario.limiteUso
            ? Number(
                formulario.limiteUso
              )
            : null,

        ativo: formulario.ativo,

        validadeInicio:
          formulario.validadeInicio
            ? formulario.validadeInicio
            : null,

        validadeFim:
          formulario.validadeFim
            ? formulario.validadeFim
            : null,
      };

      const resposta = await fetch(
        url,
        {
          method: metodo,

          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
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
            "Não foi possível salvar o cupom."
        );
      }

      setMensagem(
        editandoId !== null
          ? "Cupom atualizado com sucesso."
          : "Cupom criado com sucesso."
      );

      limparFormulario();

      await carregarCupons();

      setTimeout(() => {
        setMensagem("");
      }, 4000);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o cupom."
      );
    } finally {
      setSalvando(false);
    }
  }

  // =========================
  // INATIVAR CUPOM
  // =========================

  async function inativarCupom(
    cupom: Cupom
  ) {
    const confirmar =
      window.confirm(
        `Deseja realmente inativar o cupom "${cupom.codigo}"?\n\nEle deixará de ser considerado ativo.`
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
      setInativandoId(cupom.id);
      setErro("");
      setMensagem("");

      const resposta = await fetch(
        `${API_URL}/api/cupons/${cupom.id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
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
            "Não foi possível inativar o cupom."
        );
      }

      setCupons((atuais) =>
        atuais.map((item) =>
          item.id === cupom.id
            ? {
                ...item,
                ativo: false,
              }
            : item
        )
      );

      setMensagem(
        dados?.mensagem ||
          "Cupom inativado com sucesso."
      );

      if (editandoId === cupom.id) {
        limparFormulario();
      }

      setTimeout(() => {
        setMensagem("");
      }, 4000);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível inativar o cupom."
      );
    } finally {
      setInativandoId(null);
    }
  }

  // =========================
  // BUSCA
  // =========================

  const cuponsFiltrados =
    useMemo(() => {
      const termo = busca
        .trim()
        .toLowerCase();

      if (!termo) {
        return cupons;
      }

      return cupons.filter(
        (cupom) =>
          cupom.codigo
            .toLowerCase()
            .includes(termo) ||
          cupom.descricao
            ?.toLowerCase()
            .includes(termo)
      );
    }, [cupons, busca]);

  // =========================
  // CARREGANDO
  // =========================

  if (carregando) {
    return (
      <div className="p-6 lg:p-10">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#756f69]">
            Carregando cupons...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // INTERFACE
  // =========================

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Cabeçalho */}
        <div className="mb-8">
          <p className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[#8c7355]">
            Administração
          </p>

          <h1 className="mt-2 font-cormorant text-4xl font-medium sm:text-5xl">
            Cupons
          </h1>

          <p className="mt-3 font-montserrat text-sm text-[#756f69]">
            Gerencie os cupons e condições de
            desconto da LUMÉA.
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
                  ? "Editar cupom"
                  : "Novo cupom"}
              </p>

              <h2 className="mt-2 font-cormorant text-3xl">
                {editandoId !== null
                  ? "Atualizar cupom"
                  : "Cadastrar cupom"}
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
            onSubmit={salvarCupom}
            className="space-y-6"
          >

            {/* Código / descrição */}
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="block font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
                  Código
                </label>

                <input
                  type="text"
                  value={formulario.codigo}
                  onChange={(event) =>
                    setFormulario(
                      (atual) => ({
                        ...atual,
                        codigo:
                          event.target.value
                            .toUpperCase(),
                      })
                    )
                  }
                  placeholder="Ex.: LUMEA10"
                  className="mt-3 w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm uppercase text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                />
              </div>

              <div>
                <label className="block font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
                  Descrição
                </label>

                <input
                  type="text"
                  value={
                    formulario.descricao
                  }
                  onChange={(event) =>
                    setFormulario(
                      (atual) => ({
                        ...atual,
                        descricao:
                          event.target.value,
                      })
                    )
                  }
                  placeholder="Ex.: Desconto especial"
                  className="mt-3 w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                />
              </div>

            </div>

            {/* Tipo / valor */}
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="block font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
                  Tipo de desconto
                </label>

                <select
                  value={
                    formulario.tipoDesconto
                  }
                  onChange={(event) =>
                    setFormulario(
                      (atual) => ({
                        ...atual,
                        tipoDesconto:
                          event.target
                            .value as TipoDesconto,
                        valorDesconto: "",
                      })
                    )
                  }
                  className="mt-3 w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                >
                  <option value="percentual">
                    Percentual
                  </option>

                  <option value="fixo">
                    Valor fixo
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
                  {formulario.tipoDesconto ===
                  "percentual"
                    ? "Percentual de desconto"
                    : "Valor do desconto"}
                </label>

                <div className="relative mt-3">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={
                      formulario.valorDesconto
                    }
                    onChange={(event) =>
                      setFormulario(
                        (atual) => ({
                          ...atual,
                          valorDesconto:
                            event.target.value,
                        })
                      )
                    }
                    placeholder={
                      formulario.tipoDesconto ===
                      "percentual"
                        ? "Ex.: 10"
                        : "Ex.: 25,00"
                    }
                    className="w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 pr-12 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-montserrat text-xs text-[#756f69]">
                    {formulario.tipoDesconto ===
                    "percentual"
                      ? "%"
                      : "R$"}
                  </span>
                </div>
              </div>

            </div>

            {/* Condições */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              <div>
                <label className="block font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
                  Valor mínimo
                </label>

                <input
                  type="text"
                  inputMode="decimal"
                  value={
                    formulario.valorMinimo
                  }
                  onChange={(event) =>
                    setFormulario(
                      (atual) => ({
                        ...atual,
                        valorMinimo:
                          event.target.value,
                      })
                    )
                  }
                  placeholder="Ex.: 100,00"
                  className="mt-3 w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                />
              </div>

              <div>
                <label className="block font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
                  Limite de uso
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={
                    formulario.limiteUso
                  }
                  onChange={(event) =>
                    setFormulario(
                      (atual) => ({
                        ...atual,
                        limiteUso:
                          event.target.value,
                      })
                    )
                  }
                  placeholder="Ex.: 100"
                  className="mt-3 w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                />

                <p className="mt-2 font-montserrat text-[9px] text-[#756f69]">
                  Deixe vazio para uso ilimitado.
                </p>
              </div>

              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3 pb-3">
                  <input
                    type="checkbox"
                    checked={
                      formulario.ativo
                    }
                    onChange={(event) =>
                      setFormulario(
                        (atual) => ({
                          ...atual,
                          ativo:
                            event.target
                              .checked,
                        })
                      )
                    }
                    className="h-4 w-4 accent-[#8c7355]"
                  />

                  <span className="font-montserrat text-xs text-[#5f5042]">
                    Cupom ativo
                  </span>
                </label>
              </div>

            </div>

            {/* Validade */}
            <div>
              <p className="font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
                Período de validade
              </p>

              <div className="mt-3 grid gap-5 md:grid-cols-2">

                <div>
                  <label className="block font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                    Início
                  </label>

                  <input
                    type="date"
                    value={
                      formulario.validadeInicio
                    }
                    onChange={(event) =>
                      setFormulario(
                        (atual) => ({
                          ...atual,
                          validadeInicio:
                            event.target.value,
                        })
                      )
                    }
                    className="mt-2 w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                  />
                </div>

                <div>
                  <label className="block font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                    Fim
                  </label>

                  <input
                    type="date"
                    value={
                      formulario.validadeFim
                    }
                    onChange={(event) =>
                      setFormulario(
                        (atual) => ({
                          ...atual,
                          validadeFim:
                            event.target.value,
                        })
                      )
                    }
                    className="mt-2 w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                  />
                </div>

              </div>
            </div>

            {/* Botões */}
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
                    : "Criar cupom"}
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
            Buscar cupom
          </label>

          <input
            type="text"
            value={busca}
            onChange={(event) =>
              setBusca(event.target.value)
            }
            placeholder="Código ou descrição..."
            className="mt-3 w-full border border-[#e2d9ce] bg-[#faf8f5] px-4 py-3 font-montserrat text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
          />
        </div>

        {/* Tabela */}
        <div className="overflow-hidden border border-[#e2d9ce] bg-white">

          <div className="border-b border-[#e2d9ce] px-5 py-4">
            <p className="font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#756f69]">
              {cuponsFiltrados.length} cupom
              {cuponsFiltrados.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          {cuponsFiltrados.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-cormorant text-2xl">
                Nenhum cupom encontrado
              </p>

              <p className="mt-2 font-montserrat text-xs text-[#756f69]">
                Cadastre um cupom ou altere os
                termos da busca.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px] table-fixed">

                <thead>
                  <tr className="border-b border-[#e2d9ce] bg-[#f5f2ed]">

                    <th className="w-[15%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Código
                    </th>

                    <th className="w-[16%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Desconto
                    </th>

                    <th className="w-[14%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Mínimo
                    </th>

                    <th className="w-[13%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Usos
                    </th>

                    <th className="w-[17%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Validade
                    </th>

                    <th className="w-[10%] px-5 py-4 text-left font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Status
                    </th>

                    <th className="w-[15%] px-5 py-4 text-right font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#756f69]">
                      Ações
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {cuponsFiltrados.map(
                    (cupom) => (
                      <tr
                        key={cupom.id}
                        className="border-b border-[#eee7df] last:border-b-0"
                      >

                        <td className="px-5 py-5">
                          <p className="font-montserrat text-xs font-medium uppercase">
                            {cupom.codigo}
                          </p>

                          <p className="mt-1 truncate font-montserrat text-[10px] text-[#756f69]">
                            {cupom.descricao ||
                              "Sem descrição"}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-montserrat text-xs font-medium">
                            {cupom.percentual !==
                            null
                              ? formatarPercentual(
                                  cupom.percentual
                                )
                              : formatarMoeda(
                                  cupom.valorFixo
                                )}
                          </p>

                          <p className="mt-1 font-montserrat text-[9px] uppercase tracking-[0.08em] text-[#756f69]">
                            {cupom.percentual !==
                            null
                              ? "Percentual"
                              : "Valor fixo"}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-montserrat text-xs">
                            {formatarMoeda(
                              cupom.valorMinimo
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-montserrat text-xs">
                            {cupom.usosRealizados}
                            {" / "}
                            {cupom.limiteUso ??
                              "∞"}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          {cupom.validadeInicio ||
                          cupom.validadeFim ? (
                            <div className="font-montserrat text-[10px] text-[#5f5042]">
                              <p>
                                {formatarData(
                                  cupom.validadeInicio
                                )}
                              </p>

                              <p className="mt-1 text-[#756f69]">
                                até{" "}
                                {formatarData(
                                  cupom.validadeFim
                                )}
                              </p>
                            </div>
                          ) : (
                            <span className="font-montserrat text-[10px] text-[#756f69]">
                              Sem validade
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex px-2 py-1 font-montserrat text-[8px] uppercase tracking-[0.12em] ${
                              cupom.ativo
                                ? "bg-[#e7eee4] text-[#4f6547]"
                                : "bg-[#eee7e2] text-[#756f69]"
                            }`}
                          >
                            {cupom.ativo
                              ? "Ativo"
                              : "Inativo"}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center justify-end gap-4 whitespace-nowrap">

                            <button
                              type="button"
                              onClick={() =>
                                editarCupom(
                                  cupom
                                )
                              }
                              className="font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#8c7355] transition hover:text-[#1f1d1a]"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                inativarCupom(
                                  cupom
                                )
                              }
                              disabled={
                                inativandoId ===
                                  cupom.id ||
                                !cupom.ativo
                              }
                              className="font-montserrat text-[9px] uppercase tracking-[0.14em] text-[#9a6758] transition hover:text-[#7a5143] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {inativandoId ===
                              cupom.id
                                ? "Inativando..."
                                : cupom.ativo
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