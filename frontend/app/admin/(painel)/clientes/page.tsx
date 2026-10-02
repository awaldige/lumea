"use client";

import { useEffect, useMemo, useState } from "react";

type Cliente = {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm?: string;
  pedidosCount?: number;
};

type Pedido = {
  id: number;
  numero: string;
  status: string;
  subtotal?: string | number;
  desconto?: string | number;
  frete?: string | number;
  total: string | number;
  criadoEm: string;
};

type ClienteDetalhe = Cliente & {
  pedidos: Pedido[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [clienteSelecionado, setClienteSelecionado] =
    useState<ClienteDetalhe | null>(null);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const [carregando, setCarregando] = useState(true);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  function obterToken() {
    return localStorage.getItem("lumea_token");
  }

  // =========================
  // LISTAR CLIENTES
  // =========================

  async function carregarClientes() {
    try {
      setCarregando(true);
      setErro("");

      const token = obterToken();

      if (!token) {
        setErro("Sessão administrativa não encontrada.");
        return;
      }

      const resposta = await fetch(
        `${API_URL}/api/clientes/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados?.mensagem ||
            "Não foi possível carregar os clientes."
        );
      }

      setClientes(
        Array.isArray(dados)
          ? dados
          : dados.clientes || []
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar clientes."
      );
    } finally {
      setCarregando(false);
    }
  }

  // =========================
  // VER CLIENTE
  // =========================

  async function abrirDetalhes(id: number) {
    try {
      setCarregandoDetalhe(true);
      setErro("");
      setMensagem("");

      const token = obterToken();

      if (!token) {
        setErro("Sessão administrativa não encontrada.");
        return;
      }

      const resposta = await fetch(
        `${API_URL}/api/clientes/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados?.mensagem ||
            "Não foi possível carregar os dados do cliente."
        );
      }

      setClienteSelecionado(dados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar cliente."
      );
    } finally {
      setCarregandoDetalhe(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  // =========================
  // FILTROS
  // =========================

  const clientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return clientes.filter((cliente) => {
      const correspondeBusca =
        !termo ||
        cliente.nome
          .toLowerCase()
          .includes(termo) ||
        cliente.email
          .toLowerCase()
          .includes(termo) ||
        (cliente.telefone || "")
          .toLowerCase()
          .includes(termo);

      const correspondeStatus =
        filtroStatus === "todos" ||
        (filtroStatus === "ativos" &&
          cliente.ativo) ||
        (filtroStatus === "inativos" &&
          !cliente.ativo);

      return (
        correspondeBusca &&
        correspondeStatus
      );
    });
  }, [clientes, busca, filtroStatus]);

  // =========================
  // RESUMO
  // =========================

  const totalClientes = clientes.length;

  const clientesAtivos = clientes.filter(
    (cliente) => cliente.ativo
  ).length;

  const clientesInativos = clientes.filter(
    (cliente) => !cliente.ativo
  ).length;

  // =========================
  // FORMATAÇÃO
  // =========================

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString(
      "pt-BR"
    );
  }

  function formatarMoeda(
    valor: string | number
  ) {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] px-4 py-6 text-[#1f1d1a] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =========================
            CABEÇALHO
        ========================= */}

        <div className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-[#8c7355]">
            Administração
          </p>

          <h1 className="font-cormorant text-4xl text-[#1f1d1a]">
            Clientes
          </h1>

          <p className="mt-2 text-sm text-[#756f69]">
            Consulte os clientes cadastrados na LUMÉA.
          </p>
        </div>

        {/* =========================
            MENSAGENS
        ========================= */}

        {mensagem && (
          <div className="mb-5 rounded border border-[#d8c7b0] bg-white px-4 py-3 text-sm text-[#5f5042]">
            {mensagem}
          </div>
        )}

        {erro && (
          <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        {/* =========================
            RESUMO
        ========================= */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="border border-[#e7dfd5] bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#756f69]">
              Total
            </p>

            <p className="mt-2 font-cormorant text-3xl">
              {totalClientes}
            </p>
          </div>

          <div className="border border-[#e7dfd5] bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#756f69]">
              Ativos
            </p>

            <p className="mt-2 font-cormorant text-3xl text-[#8c7355]">
              {clientesAtivos}
            </p>
          </div>

          <div className="border border-[#e7dfd5] bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#756f69]">
              Inativos
            </p>

            <p className="mt-2 font-cormorant text-3xl">
              {clientesInativos}
            </p>
          </div>

        </div>

        {/* =========================
            FILTROS
        ========================= */}

        <div className="mb-6 flex flex-col gap-3 border border-[#e7dfd5] bg-white p-4 md:flex-row">

          <input
            type="text"
            value={busca}
            onChange={(e) =>
              setBusca(e.target.value)
            }
            placeholder="Buscar por nome, e-mail ou telefone..."
            className="h-11 flex-1 border border-[#e7dfd5] bg-[#faf8f5] px-4 text-sm outline-none transition focus:border-[#8c7355]"
          />

          <select
            value={filtroStatus}
            onChange={(e) =>
              setFiltroStatus(e.target.value)
            }
            className="h-11 border border-[#e7dfd5] bg-[#faf8f5] px-4 text-sm outline-none focus:border-[#8c7355]"
          >
            <option value="todos">
              Todos
            </option>

            <option value="ativos">
              Ativos
            </option>

            <option value="inativos">
              Inativos
            </option>
          </select>

        </div>

        {/* =========================
            TABELA
        ========================= */}

        <div className="overflow-hidden border border-[#e7dfd5] bg-white">

          {carregando ? (
            <div className="p-10 text-center text-sm text-[#756f69]">
              Carregando clientes...
            </div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#756f69]">
              Nenhum cliente encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] text-left">

                <thead>
                  <tr className="border-b border-[#e7dfd5] bg-[#faf8f5]">

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.15em] text-[#756f69]">
                      Cliente
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.15em] text-[#756f69]">
                      Contato
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.15em] text-[#756f69]">
                      Pedidos
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.15em] text-[#756f69]">
                      Cadastro
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.15em] text-[#756f69]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-[0.15em] text-[#756f69]">
                      Ações
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {clientesFiltrados.map(
                    (cliente) => (
                      <tr
                        key={cliente.id}
                        className="border-b border-[#eee7df] last:border-b-0"
                      >

                        <td className="px-5 py-5">

                          <p className="font-medium">
                            {cliente.nome}
                          </p>

                          <p className="mt-1 text-xs text-[#756f69]">
                            #{cliente.id}
                          </p>

                        </td>

                        <td className="px-5 py-5">

                          <p className="text-sm">
                            {cliente.email}
                          </p>

                          {cliente.telefone && (
                            <p className="mt-1 text-xs text-[#756f69]">
                              {cliente.telefone}
                            </p>
                          )}

                        </td>

                        <td className="px-5 py-5 text-sm">
                          {cliente.pedidosCount ?? 0}
                        </td>

                        <td className="px-5 py-5 text-sm text-[#756f69]">
                          {formatarData(
                            cliente.criadoEm
                          )}
                        </td>

                        <td className="px-5 py-5">

                          <span
                            className={`inline-flex px-3 py-1 text-xs ${
                              cliente.ativo
                                ? "bg-[#f3eee8] text-[#5f5042]"
                                : "bg-[#f1eeee] text-[#756f69]"
                            }`}
                          >
                            {cliente.ativo
                              ? "Ativo"
                              : "Inativo"}
                          </span>

                        </td>

                        {/* AÇÃO: SOMENTE VISUALIZAÇÃO */}

                        <td className="px-5 py-5">

                          <div className="flex justify-end">

                            <button
                              onClick={() =>
                                abrirDetalhes(
                                  cliente.id
                                )
                              }
                              className="border border-[#d8c7b0] px-4 py-2 text-xs uppercase tracking-[0.12em] text-[#5f5042] transition hover:bg-[#faf8f5]"
                            >
                              Ver
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

      {/* =====================================================
          MODAL - VER CLIENTE
      ===================================================== */}

      {clienteSelecionado && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-white">

            <div className="flex items-center justify-between border-b border-[#e7dfd5] px-6 py-5">

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-[#8c7355]">
                  Cliente #{clienteSelecionado.id}
                </p>

                <h2 className="mt-1 font-cormorant text-3xl">
                  {clienteSelecionado.nome}
                </h2>

              </div>

              <button
                onClick={() =>
                  setClienteSelecionado(null)
                }
                className="text-2xl text-[#756f69] hover:text-[#1f1d1a]"
                aria-label="Fechar"
              >
                ×
              </button>

            </div>

            <div className="space-y-8 p-6">

              {/* =========================
                  DADOS
              ========================= */}

              <section>

                <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#8c7355]">
                  Dados do cliente
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <p className="text-xs text-[#756f69]">
                      Nome
                    </p>

                    <p className="mt-1 text-sm">
                      {clienteSelecionado.nome}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#756f69]">
                      E-mail
                    </p>

                    <p className="mt-1 text-sm">
                      {clienteSelecionado.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#756f69]">
                      Telefone
                    </p>

                    <p className="mt-1 text-sm">
                      {clienteSelecionado.telefone ||
                        "Não informado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#756f69]">
                      Cadastro
                    </p>

                    <p className="mt-1 text-sm">
                      {formatarData(
                        clienteSelecionado.criadoEm
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#756f69]">
                      Status
                    </p>

                    <p className="mt-1 text-sm">
                      {clienteSelecionado.ativo
                        ? "Ativo"
                        : "Inativo"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#756f69]">
                      Pedidos
                    </p>

                    <p className="mt-1 text-sm">
                      {clienteSelecionado.pedidos?.length ?? 0}
                    </p>
                  </div>

                </div>

              </section>

              {/* =========================
                  HISTÓRICO
              ========================= */}

              <section>

                <div className="mb-4 flex items-center justify-between gap-4">

                  <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[#8c7355]">
                    Histórico de pedidos
                  </h3>

                  {!carregandoDetalhe && (
                    <span className="text-xs text-[#756f69]">
                      {clienteSelecionado.pedidos?.length ?? 0}{" "}
                      {(clienteSelecionado.pedidos?.length ?? 0) === 1
                        ? "pedido"
                        : "pedidos"}
                    </span>
                  )}

                </div>

                {carregandoDetalhe ? (

                  <p className="text-sm text-[#756f69]">
                    Carregando histórico...
                  </p>

                ) : clienteSelecionado.pedidos?.length ? (

                  <div className="overflow-hidden border border-[#e7dfd5]">

                    <table className="w-full text-left">

                      <thead>

                        <tr className="border-b border-[#e7dfd5] bg-[#faf8f5]">

                          <th className="px-4 py-3 text-xs uppercase tracking-[0.1em]">
                            Pedido
                          </th>

                          <th className="px-4 py-3 text-xs uppercase tracking-[0.1em]">
                            Status
                          </th>

                          <th className="px-4 py-3 text-xs uppercase tracking-[0.1em]">
                            Total
                          </th>

                          <th className="px-4 py-3 text-xs uppercase tracking-[0.1em]">
                            Data
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {clienteSelecionado.pedidos.map(
                          (pedido) => (

                            <tr
                              key={pedido.id}
                              className="border-b border-[#eee7df] last:border-0"
                            >

                              <td className="px-4 py-3 text-sm">
                                {pedido.numero}
                              </td>

                              <td className="px-4 py-3 text-sm">
                                {pedido.status}
                              </td>

                              <td className="px-4 py-3 text-sm">
                                {formatarMoeda(
                                  pedido.total
                                )}
                              </td>

                              <td className="px-4 py-3 text-sm text-[#756f69]">
                                {formatarData(
                                  pedido.criadoEm
                                )}
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                ) : (

                  <div className="border border-[#e7dfd5] bg-[#faf8f5] p-5 text-sm text-[#756f69]">
                    Este cliente ainda não possui pedidos.
                  </div>

                )}

              </section>

              {/* =========================
                  RODAPÉ
              ========================= */}

              <div className="flex justify-end border-t border-[#e7dfd5] pt-5">

                <button
                  onClick={() =>
                    setClienteSelecionado(null)
                  }
                  className="border border-[#d8c7b0] px-5 py-3 text-xs uppercase tracking-[0.15em] text-[#5f5042] transition hover:bg-[#faf8f5]"
                >
                  Fechar
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}