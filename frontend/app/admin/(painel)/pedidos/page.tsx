"use client";

import { useEffect, useMemo, useState } from "react";

type StatusPedido =
  | "PENDENTE"
  | "CONFIRMADO"
  | "EM_PREPARACAO"
  | "ENVIADO"
  | "ENTREGUE"
  | "CANCELADO";

type ProdutoPedido = {
  id: number;
  nome: string;
  imagem: string | null;
  preco?: string | number;
};

type ItemPedido = {
  id: number;
  quantidade: number;
  precoUnitario: string | number;
  subtotal: string | number;
  produto: ProdutoPedido;
};

type UsuarioPedido = {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
};

type Pedido = {
  id: number;
  numero: string;
  status: StatusPedido;
  subtotal: string | number;
  desconto: string | number;
  frete: string | number;
  total: string | number;
  criadoEm: string;
  atualizadoEm: string;
  usuario: UsuarioPedido;
  itens: ItemPedido[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const statusOpcoes: StatusPedido[] = [
  "PENDENTE",
  "CONFIRMADO",
  "EM_PREPARACAO",
  "ENVIADO",
  "ENTREGUE",
  "CANCELADO",
];

function formatarMoeda(valor: string | number) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function nomeStatus(status: StatusPedido) {
  switch (status) {
    case "PENDENTE":
      return "Pendente";

    case "CONFIRMADO":
      return "Confirmado";

    case "EM_PREPARACAO":
      return "Em preparação";

    case "ENVIADO":
      return "Enviado";

    case "ENTREGUE":
      return "Entregue";

    case "CANCELADO":
      return "Cancelado";

    default:
      return status;
  }
}

function classeStatus(status: StatusPedido) {
  switch (status) {
    case "PENDENTE":
      return "bg-[#f3eee8] text-[#756f69]";

    case "CONFIRMADO":
      return "bg-[#eee7df] text-[#5f5042]";

    case "EM_PREPARACAO":
      return "bg-[#e9dfd4] text-[#6b5948]";

    case "ENVIADO":
      return "bg-[#e8dfd5] text-[#705f4e]";

    case "ENTREGUE":
      return "bg-[#ded4c8] text-[#4f453c]";

    case "CANCELADO":
      return "bg-[#eee1dc] text-[#8a5f54]";

    default:
      return "bg-[#f3eee8] text-[#756f69]";
  }
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<
    StatusPedido | "TODOS"
  >("TODOS");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [pedidoSelecionado, setPedidoSelecionado] =
    useState<Pedido | null>(null);

  const [novoStatus, setNovoStatus] =
    useState<StatusPedido>("PENDENTE");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("lumea_token")
      : null;

  async function carregarPedidos() {
    try {
      setCarregando(true);
      setErro("");

      if (!token) {
        setErro("Sessão não encontrada. Faça login novamente.");
        return;
      }

      const resposta = await fetch(
        `${API_URL}/api/pedidos/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados?.mensagem || "Não foi possível carregar os pedidos."
        );
      }

      setPedidos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error(error);

      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar pedidos."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPedidos();
  }, []);

  const pedidosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return pedidos.filter((pedido) => {
      const correspondeBusca =
        !termo ||
        pedido.numero.toLowerCase().includes(termo) ||
        pedido.usuario.nome.toLowerCase().includes(termo) ||
        pedido.usuario.email.toLowerCase().includes(termo);

      const correspondeStatus =
        filtroStatus === "TODOS" ||
        pedido.status === filtroStatus;

      return correspondeBusca && correspondeStatus;
    });
  }, [pedidos, busca, filtroStatus]);

  async function atualizarStatus() {
    if (!pedidoSelecionado || !token) {
      return;
    }

    try {
      setErro("");
      setSucesso("");

      const resposta = await fetch(
        `${API_URL}/api/pedidos/admin/${pedidoSelecionado.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: novoStatus,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados?.mensagem ||
            "Não foi possível atualizar o status."
        );
      }

      setPedidos((anteriores) =>
        anteriores.map((pedido) =>
          pedido.id === pedidoSelecionado.id
            ? {
                ...pedido,
                status: novoStatus,
              }
            : pedido
        )
      );

      setPedidoSelecionado((pedido) =>
        pedido
          ? {
              ...pedido,
              status: novoStatus,
            }
          : null
      );

      setSucesso("Status do pedido atualizado com sucesso.");

      setTimeout(() => {
        setSucesso("");
      }, 3000);
    } catch (error) {
      console.error(error);

      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar status."
      );
    }
  }

  function abrirPedido(pedido: Pedido) {
    setPedidoSelecionado(pedido);
    setNovoStatus(pedido.status);
    setErro("");
    setSucesso("");
  }

  function fecharPedido() {
    setPedidoSelecionado(null);
    setErro("");
    setSucesso("");
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] px-4 py-8 text-[#1f1d1a] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* CABEÇALHO */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.28em] text-[#8c7355]">
                Administração
              </p>

              <h1 className="font-cormorant text-4xl tracking-wide text-[#1f1d1a] sm:text-5xl">
                Pedidos
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#756f69]">
                Acompanhe os pedidos realizados e atualize o
                status de cada solicitação.
              </p>
            </div>

            <div className="rounded-full border border-[#e7dfd5] bg-white px-5 py-3 text-sm text-[#756f69] shadow-sm">
              <span className="font-medium text-[#1f1d1a]">
                {pedidos.length}
              </span>{" "}
              pedido{pedidos.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        {/* MENSAGENS */}
        {erro && (
          <div className="mb-6 rounded-xl border border-[#e4cfc7] bg-[#fbf3f0] px-4 py-3 text-sm text-[#8a5f54]">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-6 rounded-xl border border-[#d8cbbb] bg-[#f5f0ea] px-4 py-3 text-sm text-[#5f5042]">
            {sucesso}
          </div>
        )}

        {/* FILTROS */}
        <section className="mb-6 rounded-2xl border border-[#e7dfd5] bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_240px]">
            <div>
              <label
                htmlFor="busca"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-[#756f69]"
              >
                Buscar pedido
              </label>

              <input
                id="busca"
                type="text"
                value={busca}
                onChange={(event) =>
                  setBusca(event.target.value)
                }
                placeholder="Número, cliente ou e-mail..."
                className="w-full rounded-xl border border-[#e7dfd5] bg-[#faf8f5] px-4 py-3 text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#b69a74] focus:ring-1 focus:ring-[#b69a74]"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-[#756f69]"
              >
                Status
              </label>

              <select
                id="status"
                value={filtroStatus}
                onChange={(event) =>
                  setFiltroStatus(
                    event.target.value as
                      | StatusPedido
                      | "TODOS"
                  )
                }
                className="w-full rounded-xl border border-[#e7dfd5] bg-[#faf8f5] px-4 py-3 text-sm text-[#1f1d1a] outline-none transition focus:border-[#b69a74] focus:ring-1 focus:ring-[#b69a74]"
              >
                <option value="TODOS">Todos os status</option>

                {statusOpcoes.map((status) => (
                  <option key={status} value={status}>
                    {nomeStatus(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* LISTAGEM */}
        <section className="overflow-hidden rounded-2xl border border-[#e7dfd5] bg-white shadow-sm">
          {carregando ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-[#756f69]">
                Carregando pedidos...
              </p>
            </div>
          ) : pedidosFiltrados.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3eee8] text-[#8c7355]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 7.5 12 3 4 7.5m16 0v9L12 21l-8-4.5v-9m16 0-8 4.5m0 0L4 7.5m8 4.5V21"
                  />
                </svg>
              </div>

              <h2 className="font-cormorant text-2xl text-[#1f1d1a]">
                Nenhum pedido encontrado
              </h2>

              <p className="mt-2 text-sm text-[#756f69]">
                Os pedidos realizados aparecerão nesta área.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-[#e7dfd5] bg-[#faf8f5]">
                      <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.14em] text-[#756f69]">
                        Pedido
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.14em] text-[#756f69]">
                        Cliente
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.14em] text-[#756f69]">
                        Data
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.14em] text-[#756f69]">
                        Total
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.14em] text-[#756f69]">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-[0.14em] text-[#756f69]">
                        Ação
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {pedidosFiltrados.map((pedido) => (
                      <tr
                        key={pedido.id}
                        className="border-b border-[#eee7df] last:border-b-0 hover:bg-[#fcfaf8]"
                      >
                        <td className="px-5 py-5">
                          <span className="font-medium text-[#1f1d1a]">
                            {pedido.numero}
                          </span>

                          <p className="mt-1 text-xs text-[#9a9189]">
                            {pedido.itens.length}{" "}
                            {pedido.itens.length === 1
                              ? "item"
                              : "itens"}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-medium text-[#1f1d1a]">
                            {pedido.usuario.nome}
                          </p>

                          <p className="mt-1 text-xs text-[#756f69]">
                            {pedido.usuario.email}
                          </p>
                        </td>

                        <td className="px-5 py-5 text-sm text-[#756f69]">
                          {formatarData(pedido.criadoEm)}
                        </td>

                        <td className="px-5 py-5">
                          <span className="font-medium text-[#1f1d1a]">
                            {formatarMoeda(pedido.total)}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${classeStatus(
                              pedido.status
                            )}`}
                          >
                            {nomeStatus(pedido.status)}
                          </span>
                        </td>

                        <td className="px-5 py-5 text-right">
                          <button
                            type="button"
                            onClick={() => abrirPedido(pedido)}
                            className="rounded-lg border border-[#d8c7b0] px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#6b5948] transition hover:bg-[#f3eee8]"
                          >
                            Visualizar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}
              <div className="divide-y divide-[#eee7df] md:hidden">
                {pedidosFiltrados.map((pedido) => (
                  <button
                    key={pedido.id}
                    type="button"
                    onClick={() => abrirPedido(pedido)}
                    className="block w-full p-5 text-left transition hover:bg-[#fcfaf8]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-[#1f1d1a]">
                          {pedido.numero}
                        </p>

                        <p className="mt-1 text-sm text-[#756f69]">
                          {pedido.usuario.nome}
                        </p>

                        <p className="mt-1 text-xs text-[#9a9189]">
                          {formatarData(pedido.criadoEm)}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${classeStatus(
                          pedido.status
                        )}`}
                      >
                        {nomeStatus(pedido.status)}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#eee7df] pt-4">
                      <span className="text-xs uppercase tracking-[0.12em] text-[#756f69]">
                        Total
                      </span>

                      <span className="font-medium text-[#1f1d1a]">
                        {formatarMoeda(pedido.total)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* MODAL DO PEDIDO */}
      {pedidoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1d1a]/45 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#e7dfd5] bg-[#faf8f5] shadow-2xl">
            {/* CABEÇALHO MODAL */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#e7dfd5] bg-[#faf8f5] px-5 py-5 sm:px-7">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#8c7355]">
                  Detalhes do pedido
                </p>

                <h2 className="mt-1 font-cormorant text-3xl text-[#1f1d1a]">
                  {pedidoSelecionado.numero}
                </h2>
              </div>

              <button
                type="button"
                onClick={fecharPedido}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e7dfd5] text-[#756f69] transition hover:bg-white hover:text-[#1f1d1a]"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              {/* CLIENTE */}
              <section className="rounded-xl border border-[#e7dfd5] bg-white p-5">
                <h3 className="font-cormorant text-2xl text-[#1f1d1a]">
                  Cliente
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[#9a9189]">
                      Nome
                    </p>

                    <p className="mt-1 text-sm text-[#1f1d1a]">
                      {pedidoSelecionado.usuario.nome}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[#9a9189]">
                      E-mail
                    </p>

                    <p className="mt-1 break-all text-sm text-[#1f1d1a]">
                      {pedidoSelecionado.usuario.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[#9a9189]">
                      Telefone
                    </p>

                    <p className="mt-1 text-sm text-[#1f1d1a]">
                      {pedidoSelecionado.usuario.telefone ||
                        "Não informado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[#9a9189]">
                      Data
                    </p>

                    <p className="mt-1 text-sm text-[#1f1d1a]">
                      {formatarData(
                        pedidoSelecionado.criadoEm
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {/* ITENS */}
              <section className="rounded-xl border border-[#e7dfd5] bg-white p-5">
                <h3 className="font-cormorant text-2xl text-[#1f1d1a]">
                  Itens do pedido
                </h3>

                <div className="mt-4 divide-y divide-[#eee7df]">
                  {pedidoSelecionado.itens.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#1f1d1a]">
                          {item.produto.nome}
                        </p>

                        <p className="mt-1 text-xs text-[#756f69]">
                          {item.quantidade} ×{" "}
                          {formatarMoeda(item.precoUnitario)}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-medium text-[#1f1d1a]">
                        {formatarMoeda(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* RESUMO */}
              <section className="rounded-xl border border-[#e7dfd5] bg-white p-5">
                <h3 className="font-cormorant text-2xl text-[#1f1d1a]">
                  Resumo financeiro
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4 text-[#756f69]">
                    <span>Subtotal</span>
                    <span>
                      {formatarMoeda(
                        pedidoSelecionado.subtotal
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-[#756f69]">
                    <span>Desconto</span>
                    <span>
                      -{" "}
                      {formatarMoeda(
                        pedidoSelecionado.desconto
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-[#756f69]">
                    <span>Frete</span>
                    <span>
                      {formatarMoeda(
                        pedidoSelecionado.frete
                      )}
                    </span>
                  </div>

                  <div className="border-t border-[#e7dfd5] pt-4">
                    <div className="flex justify-between gap-4">
                      <span className="font-medium text-[#1f1d1a]">
                        Total
                      </span>

                      <span className="font-medium text-[#8c7355]">
                        {formatarMoeda(
                          pedidoSelecionado.total
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* STATUS */}
              <section className="rounded-xl border border-[#e7dfd5] bg-white p-5">
                <h3 className="font-cormorant text-2xl text-[#1f1d1a]">
                  Status do pedido
                </h3>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <select
                    value={novoStatus}
                    onChange={(event) =>
                      setNovoStatus(
                        event.target.value as StatusPedido
                      )
                    }
                    className="flex-1 rounded-xl border border-[#e7dfd5] bg-[#faf8f5] px-4 py-3 text-sm text-[#1f1d1a] outline-none focus:border-[#b69a74] focus:ring-1 focus:ring-[#b69a74]"
                  >
                    {statusOpcoes.map((status) => (
                      <option key={status} value={status}>
                        {nomeStatus(status)}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={atualizarStatus}
                    disabled={
                      novoStatus ===
                      pedidoSelecionado.status
                    }
                    className="rounded-xl bg-[#8c7355] px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[#756044] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Atualizar status
                  </button>
                </div>
              </section>
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-[#e7dfd5] px-5 py-5 sm:px-7">
              <button
                type="button"
                onClick={fecharPedido}
                className="w-full rounded-xl border border-[#d8c7b0] bg-white px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-[#6b5948] transition hover:bg-[#f3eee8]"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
