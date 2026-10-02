"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// =========================
// TIPOS
// =========================

type Administrador = {
  id: number;
  nome: string;
  email: string;
  perfil: "CLIENTE" | "ADMIN";
};

type ResumoDashboard = {
  vendas: number;
  pedidos: number;
  clientes: number;
  clientesAtivos: number;
  produtos: number;
  estoqueBaixo: number;
  pedidosPendentes: number;
  ticketMedio: number;
};

type VendaPeriodo = {
  data: string;
  total: number;
  pedidos: number;
};

type PedidoRecente = {
  id: number;
  numero: string;
  status:
    | "PENDENTE"
    | "CONFIRMADO"
    | "EM_PREPARACAO"
    | "ENVIADO"
    | "ENTREGUE"
    | "CANCELADO";
  total: string | number;
  criadoEm: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
};

type ProdutoEstoqueBaixo = {
  id: number;
  nome: string;
  estoque: number;
  imagem: string | null;
};

type DashboardResponse = {
  sucesso: boolean;
  mensagem: string;
  administrador: Administrador;
  resumo: ResumoDashboard;
  relatorio: {
    periodo: number;
    dataInicio: string;
    dataFim: string;
    vendas: VendaPeriodo[];
  };
  pedidosRecentes: PedidoRecente[];
  produtosEstoqueBaixo: ProdutoEstoqueBaixo[];
};

// =========================
// HELPERS
// =========================

function formatarMoeda(valor: number | string) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function formatarDataCurta(data: string) {
  return new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function obterClasseStatus(status: PedidoRecente["status"]) {
  switch (status) {
    case "PENDENTE":
      return "bg-[#f5ead8] text-[#80643d]";

    case "CONFIRMADO":
      return "bg-[#e8efe7] text-[#50654d]";

    case "EM_PREPARACAO":
      return "bg-[#eee8f0] text-[#68556e]";

    case "ENVIADO":
      return "bg-[#e6edf1] text-[#506473]";

    case "ENTREGUE":
      return "bg-[#e4eee6] text-[#4d6653]";

    case "CANCELADO":
      return "bg-[#f1e5e2] text-[#7a5143]";

    default:
      return "bg-[#f3eee8] text-[#756f69]";
  }
}

function traduzirStatus(status: PedidoRecente["status"]) {
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

// =========================
// PÁGINA
// =========================

export default function AdminPage() {
  const router = useRouter();

  const [administrador, setAdministrador] =
    useState<Administrador | null>(null);

  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [periodo, setPeriodo] = useState(30);

  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState("");

  // =========================
  // CARREGAR DASHBOARD
  // =========================

  useEffect(() => {
    async function carregarDashboard() {
      const token = localStorage.getItem("lumea_token");

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        setCarregando(true);
        setErro("");

        const resposta = await fetch(
          `${API_URL}/api/admin/dashboard?periodo=${periodo}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const dados: DashboardResponse = await resposta.json();

        if (!resposta.ok) {
          localStorage.removeItem("lumea_token");
          localStorage.removeItem("lumea_usuario");

          router.replace("/admin/login");
          return;
        }

        setAdministrador(dados.administrador);
        setDashboard(dados);
      } catch {
        setErro("Não foi possível conectar ao servidor.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, [periodo, router]);

  // =========================
  // DADOS DO GRÁFICO
  // =========================

  const dadosGrafico = useMemo(() => {
    if (!dashboard?.relatorio?.vendas) {
      return [];
    }

    return dashboard.relatorio.vendas;
  }, [dashboard]);

  const maiorVenda = useMemo(() => {
    if (!dadosGrafico.length) {
      return 1;
    }

    return Math.max(
      ...dadosGrafico.map((item) => Number(item.total)),
      1
    );
  }, [dadosGrafico]);

  const totalVendasPeriodo = useMemo(() => {
    return dadosGrafico.reduce(
      (total, item) => total + Number(item.total),
      0
    );
  }, [dadosGrafico]);

  const totalPedidosPeriodo = useMemo(() => {
    return dadosGrafico.reduce(
      (total, item) => total + Number(item.pedidos),
      0
    );
  }, [dadosGrafico]);

  // =========================
  // LOADING
  // =========================

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-6">
        <div className="text-center">
          <div className="mx-auto mb-5 h-px w-12 bg-[#b69a74]" />

          <p className="font-cormorant text-3xl text-[#1f1d1a]">
            LUMÉA
          </p>

          <p className="mt-2 font-montserrat text-[9px] uppercase tracking-[0.28em] text-[#756f69]">
            Carregando painel
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERRO
  // =========================

  if (erro) {
    return (
      <div className="min-h-screen bg-[#faf8f5] px-6 py-12">
        <div className="mx-auto max-w-2xl border border-[#e2d9ce] bg-white p-10 text-center">
          <p className="font-cormorant text-3xl text-[#1f1d1a]">
            Não foi possível carregar o painel
          </p>

          <p className="mt-3 font-montserrat text-sm text-[#756f69]">
            {erro}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-7 border border-[#d8c7b0] px-6 py-3 font-montserrat text-[9px] uppercase tracking-[0.18em] text-[#5f5042] transition hover:bg-[#1f1d1a] hover:text-white"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const { resumo } = dashboard;

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 xl:px-12">

        {/* =========================
            CABEÇALHO
        ========================= */}

        <header className="mb-10">
          <div className="flex flex-col gap-6 border-b border-[#ded5ca] pb-8 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#b69a74]" />

                <p className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-[#8c7355]">
                  Painel administrativo
                </p>
              </div>

              <h1 className="font-cormorant text-5xl font-medium leading-none text-[#1f1d1a] sm:text-6xl">
                Visão geral
              </h1>

              <p className="mt-4 max-w-xl font-montserrat text-xs leading-relaxed text-[#756f69] sm:text-sm">
                Acompanhe vendas, pedidos, clientes e o desempenho
                da operação LUMÉA.
              </p>
            </div>

            <div className="w-full border border-[#e2d9ce] bg-white px-5 py-4 sm:w-auto sm:min-w-[260px]">
              <p className="font-montserrat text-[8px] uppercase tracking-[0.18em] text-[#9a938c]">
                Administrador
              </p>

              <p className="mt-1 font-cormorant text-2xl text-[#1f1d1a]">
                {administrador?.nome}
              </p>

              <p className="mt-1 truncate font-montserrat text-[9px] text-[#756f69]">
                {administrador?.email}
              </p>
            </div>
          </div>
        </header>

        {/* =========================
            MÉTRICAS PRINCIPAIS
        ========================= */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8">

          {/* VENDAS */}
          <div className="min-w-0 xl:col-span-2">
            <MetricCard
              titulo="Vendas"
              valor={formatarMoeda(resumo.vendas)}
              descricao="Total não cancelado"
              destaque
            />
          </div>

          {/* PEDIDOS */}
          <div className="min-w-0 xl:col-span-1">
            <MetricCard
              titulo="Pedidos"
              valor={String(resumo.pedidos)}
              descricao="Registrados"
            />
          </div>

          {/* CLIENTES */}
          <div className="min-w-0 xl:col-span-1">
            <MetricCard
              titulo="Clientes"
              valor={String(resumo.clientes)}
              descricao={`${resumo.clientesAtivos} ativos`}
            />
          </div>

          {/* TICKET MÉDIO */}
          <div className="min-w-0 xl:col-span-2">
            <MetricCard
              titulo="Ticket médio"
              valor={formatarMoeda(resumo.ticketMedio)}
              descricao="Média por pedido"
            />
          </div>

          {/* PRODUTOS */}
          <div className="min-w-0 xl:col-span-1">
            <MetricCard
              titulo="Produtos"
              valor={String(resumo.produtos)}
              descricao="Ativos"
            />
          </div>

          {/* ESTOQUE */}
          <div className="min-w-0 xl:col-span-1">
            <MetricCard
              titulo="Estoque baixo"
              valor={String(resumo.estoqueBaixo)}
              descricao="Até 5 unidades"
              alerta={resumo.estoqueBaixo > 0}
            />
          </div>
        </section>

        {/* =========================
            DESTAQUE + RELATÓRIO
        ========================= */}

        <section className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">

          {/* RELATÓRIO */}

          <div className="min-w-0 border border-[#e2d9ce] bg-white">

            <div className="flex flex-col gap-6 border-b border-[#eee7df] p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <p className="font-montserrat text-[9px] uppercase tracking-[0.22em] text-[#8c7355]">
                  Desempenho
                </p>

                <h2 className="mt-2 font-cormorant text-3xl text-[#1f1d1a] sm:text-4xl">
                  Relatório de vendas
                </h2>

                <p className="mt-2 max-w-lg font-montserrat text-xs leading-relaxed text-[#756f69]">
                  Evolução das vendas e pedidos no período selecionado.
                </p>
              </div>

              <div className="flex w-fit border border-[#ded5ca] bg-[#faf8f5] p-1">
                {[7, 30, 90].map((opcao) => (
                  <button
                    key={opcao}
                    type="button"
                    onClick={() => setPeriodo(opcao)}
                    className={`px-4 py-2.5 font-montserrat text-[8px] uppercase tracking-[0.12em] transition ${
                      periodo === opcao
                        ? "bg-[#1f1d1a] text-white"
                        : "text-[#756f69] hover:text-[#1f1d1a]"
                    }`}
                  >
                    {opcao} dias
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8">

              <div className="mb-8 grid gap-3 sm:grid-cols-3">
                <ReportSummary
                  titulo="Vendas no período"
                  valor={formatarMoeda(totalVendasPeriodo)}
                />

                <ReportSummary
                  titulo="Pedidos no período"
                  valor={String(totalPedidosPeriodo)}
                />

                <ReportSummary
                  titulo="Período analisado"
                  valor={`${periodo} dias`}
                />
              </div>

              {/* GRÁFICO */}

              <div className="overflow-x-auto">
                <div
                  className="flex min-w-[620px] items-end gap-1 border-b border-l border-[#e7dfd5] px-3 pt-8"
                  style={{ height: 300 }}
                >
                  {dadosGrafico.map((item) => {
                    const altura =
                      Number(item.total) > 0
                        ? Math.max(
                            (Number(item.total) / maiorVenda) * 225,
                            6
                          )
                        : 2;

                    return (
                      <div
                        key={item.data}
                        className="group flex h-full min-w-[14px] flex-1 flex-col justify-end"
                      >
                        <div className="relative flex justify-center">
                          <div
                            className="w-full max-w-[26px] bg-[#c9b59d] transition-all duration-300 group-hover:bg-[#8c7355]"
                            style={{
                              height: `${altura}px`,
                            }}
                            title={`${formatarData(
                              item.data
                            )}: ${formatarMoeda(item.total)}`}
                          />

                          {Number(item.total) > 0 && (
                            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap border border-[#3a3631] bg-[#1f1d1a] px-3 py-2 font-montserrat text-[9px] text-white shadow-lg group-hover:block">
                              {formatarMoeda(item.total)}
                            </div>
                          )}
                        </div>

                        <span className="mt-3 text-center font-montserrat text-[8px] text-[#9a938c]">
                          {periodo <= 30 ||
                          item.data.endsWith("01") ||
                          item.data.endsWith("15") ||
                          item.data.endsWith("30")
                            ? formatarDataCurta(item.data)
                            : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RESUMO LATERAL */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">

            <div className="relative overflow-hidden border border-[#d8c7b0] bg-[#1f1d1a] p-7 text-white">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full border border-[#8c7355]/40" />

              <p className="relative font-montserrat text-[8px] uppercase tracking-[0.2em] text-[#c9b59d]">
                Vendas totais
              </p>

              <p className="relative mt-4 whitespace-nowrap font-cormorant text-4xl">
                {formatarMoeda(resumo.vendas)}
              </p>

              <div className="relative mt-5 h-px w-10 bg-[#b69a74]" />

              <p className="relative mt-4 font-montserrat text-[9px] leading-relaxed text-[#c9c3bc]">
                Valor acumulado dos pedidos não cancelados.
              </p>
            </div>

            <div className="border border-[#e2d9ce] bg-white p-7">
              <p className="font-montserrat text-[8px] uppercase tracking-[0.2em] text-[#8c7355]">
                Pedidos pendentes
              </p>

              <p className="mt-3 font-cormorant text-4xl text-[#1f1d1a]">
                {resumo.pedidosPendentes}
              </p>

              <p className="mt-2 font-montserrat text-[9px] leading-relaxed text-[#756f69]">
                Pedidos aguardando confirmação.
              </p>

              <Link
                href="/admin/pedidos"
                className="mt-5 inline-flex border-b border-[#b69a74] pb-1 font-montserrat text-[8px] uppercase tracking-[0.14em] text-[#8c7355] transition hover:text-[#1f1d1a]"
              >
                Ver pedidos
              </Link>
            </div>
          </div>
        </section>

        {/* =========================
            PEDIDOS + ALERTAS
        ========================= */}

        <section className="mt-8 grid gap-5 xl:grid-cols-[1.6fr_1fr]">

          {/* PEDIDOS */}

          <div className="border border-[#e2d9ce] bg-white">

            <div className="flex items-end justify-between border-b border-[#eee7df] p-6 sm:p-7">
              <div>
                <p className="font-montserrat text-[9px] uppercase tracking-[0.22em] text-[#8c7355]">
                  Operação
                </p>

                <h2 className="mt-2 font-cormorant text-3xl text-[#1f1d1a]">
                  Pedidos recentes
                </h2>
              </div>

              <Link
                href="/admin/pedidos"
                className="border-b border-[#b69a74] pb-1 font-montserrat text-[8px] uppercase tracking-[0.14em] text-[#8c7355] transition hover:text-[#1f1d1a]"
              >
                Ver todos
              </Link>
            </div>

            <div className="divide-y divide-[#eee7df]">
              {dashboard.pedidosRecentes.length === 0 ? (
                <div className="p-8">
                  <p className="font-montserrat text-xs text-[#756f69]">
                    Nenhum pedido registrado.
                  </p>
                </div>
              ) : (
                dashboard.pedidosRecentes.map((pedido) => (
                  <Link
                    href={`/admin/pedidos/${pedido.id}`}
                    key={pedido.id}
                    className="group flex flex-col gap-5 p-6 transition hover:bg-[#faf8f5] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#e2d9ce] bg-[#faf8f5]">
                        <span className="font-cormorant text-lg text-[#8c7355]">
                          L
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="font-montserrat text-xs font-medium text-[#1f1d1a]">
                          #{pedido.numero}
                        </p>

                        <p className="mt-1 truncate font-montserrat text-[10px] text-[#756f69]">
                          {pedido.usuario.nome}
                        </p>

                        <p className="mt-1 font-montserrat text-[9px] text-[#9a938c]">
                          {formatarData(pedido.criadoEm)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      <span
                        className={`inline-flex whitespace-nowrap px-3 py-1.5 font-montserrat text-[8px] uppercase tracking-[0.1em] ${obterClasseStatus(
                          pedido.status
                        )}`}
                      >
                        {traduzirStatus(pedido.status)}
                      </span>

                      <span className="whitespace-nowrap font-montserrat text-xs font-medium text-[#1f1d1a]">
                        {formatarMoeda(pedido.total)}
                      </span>

                      <span className="hidden text-[#b69a74] transition group-hover:translate-x-1 sm:inline">
                        →
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* ALERTAS */}

          <div className="border border-[#e2d9ce] bg-white">

            <div className="border-b border-[#eee7df] p-6 sm:p-7">
              <p className="font-montserrat text-[9px] uppercase tracking-[0.22em] text-[#8c7355]">
                Atenção
              </p>

              <h2 className="mt-2 font-cormorant text-3xl text-[#1f1d1a]">
                Alertas
              </h2>
            </div>

            <div className="divide-y divide-[#eee7df]">
              <AlertItem
                titulo="Pedidos pendentes"
                valor={resumo.pedidosPendentes}
                descricao="Pedidos aguardando confirmação."
                href="/admin/pedidos"
                alerta={resumo.pedidosPendentes > 0}
              />

              <AlertItem
                titulo="Estoque baixo"
                valor={resumo.estoqueBaixo}
                descricao="Produtos com até 5 unidades."
                href="/admin/produtos"
                alerta={resumo.estoqueBaixo > 0}
              />

              <AlertItem
                titulo="Clientes ativos"
                valor={resumo.clientesAtivos}
                descricao="Clientes atualmente ativos."
                href="/admin/clientes"
              />
            </div>
          </div>
        </section>

        {/* =========================
            ESTOQUE BAIXO
        ========================= */}

        {dashboard.produtosEstoqueBaixo.length > 0 && (
          <section className="mt-8 border border-[#e2d9ce] bg-white">

            <div className="flex flex-col gap-4 border-b border-[#eee7df] p-6 sm:flex-row sm:items-end sm:justify-between sm:p-7">
              <div>
                <p className="font-montserrat text-[9px] uppercase tracking-[0.22em] text-[#8c7355]">
                  Inventário
                </p>

                <h2 className="mt-2 font-cormorant text-3xl text-[#1f1d1a]">
                  Produtos com estoque baixo
                </h2>
              </div>

              <Link
                href="/admin/produtos"
                className="w-fit border-b border-[#b69a74] pb-1 font-montserrat text-[8px] uppercase tracking-[0.14em] text-[#8c7355] transition hover:text-[#1f1d1a]"
              >
                Gerenciar produtos
              </Link>
            </div>

            <div className="grid gap-px bg-[#eee7df] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {dashboard.produtosEstoqueBaixo.map((produto) => (
                <Link
                  href={`/admin/produtos/${produto.id}/editar`}
                  key={produto.id}
                  className="group bg-white p-6 transition hover:bg-[#faf8f5]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-cormorant text-xl text-[#1f1d1a]">
                      {produto.nome}
                    </p>

                    <span
                      className={`shrink-0 font-montserrat text-sm font-medium ${
                        produto.estoque === 0
                          ? "text-[#7a5143]"
                          : "text-[#8c7355]"
                      }`}
                    >
                      {produto.estoque}
                    </span>
                  </div>

                  <div className="mt-5 h-px w-8 bg-[#d8c7b0] transition-all group-hover:w-14 group-hover:bg-[#8c7355]" />

                  <p className="mt-4 font-montserrat text-[8px] uppercase tracking-[0.12em] text-[#9a938c]">
                    unidades disponíveis
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* =========================
            ACESSOS RÁPIDOS
        ========================= */}

        <section className="mt-12">

          <div className="mb-6">
            <p className="font-montserrat text-[9px] uppercase tracking-[0.22em] text-[#8c7355]">
              Administração
            </p>

            <h2 className="mt-2 font-cormorant text-3xl text-[#1f1d1a]">
              Acessos rápidos
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <DashboardCard
              href="/admin/produtos"
              numero="01"
              titulo="Produtos"
              descricao="Gerencie produtos, preços, estoque e destaque."
            />

            <DashboardCard
              href="/admin/categorias"
              numero="02"
              titulo="Categorias"
              descricao="Organize as categorias da loja."
            />

            <DashboardCard
              href="/admin/colecoes"
              numero="03"
              titulo="Coleções"
              descricao="Gerencie coleções e seus produtos."
            />

            <DashboardCard
              href="/admin/pedidos"
              numero="04"
              titulo="Pedidos"
              descricao="Acompanhe e atualize os pedidos."
            />

            <DashboardCard
              href="/admin/cupons"
              numero="05"
              titulo="Cupons"
              descricao="Gerencie descontos e condições de uso."
            />

            <DashboardCard
              href="/admin/clientes"
              numero="06"
              titulo="Clientes"
              descricao="Visualize e gerencie os clientes cadastrados."
            />
          </div>
        </section>

        {/* =========================
            STATUS
        ========================= */}

        <section className="mt-12 border border-[#e2d9ce] bg-white">

          <div className="flex flex-col gap-2 border-b border-[#eee7df] p-6 sm:p-7">
            <p className="font-montserrat text-[9px] uppercase tracking-[0.22em] text-[#8c7355]">
              Sistema
            </p>

            <h2 className="font-cormorant text-3xl text-[#1f1d1a]">
              Status administrativo
            </h2>
          </div>

          <div className="grid sm:grid-cols-3">
            <StatusItem
              titulo="Autenticação"
              valor="Ativa"
            />

            <StatusItem
              titulo="Perfil"
              valor={administrador?.perfil || "ADMIN"}
            />

            <StatusItem
              titulo="API"
              valor="Conectada"
            />
          </div>
        </section>

        <div className="h-8" />
      </div>
    </div>
  );
}

// =========================
// MÉTRICA
// =========================

function MetricCard({
  titulo,
  valor,
  descricao,
  alerta = false,
  destaque = false,
}: {
  titulo: string;
  valor: string;
  descricao: string;
  alerta?: boolean;
  destaque?: boolean;
}) {
  return (
    <div
      className={`relative flex min-h-[142px] h-full min-w-0 flex-col justify-between overflow-hidden border p-5 transition sm:p-6 ${
        alerta
          ? "border-[#d8c0b5] bg-[#fffdfb]"
          : destaque
            ? "border-[#c9b59d] bg-[#f4eee7]"
            : "border-[#e2d9ce] bg-white"
      }`}
    >
      {destaque && (
        <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full border border-[#b69a74]/30" />
      )}

      <div className="relative min-w-0">
        <p className="whitespace-nowrap font-montserrat text-[8px] uppercase tracking-[0.16em] text-[#756f69]">
          {titulo}
        </p>

        <p
          className={`mt-4 whitespace-nowrap font-cormorant text-[2rem] leading-none sm:text-[2.15rem] ${
            alerta
              ? "text-[#7a5143]"
              : "text-[#1f1d1a]"
          }`}
        >
          {valor}
        </p>
      </div>

      <p className="relative mt-4 whitespace-nowrap font-montserrat text-[9px] text-[#9a938c]">
        {descricao}
      </p>
    </div>
  );
}

// =========================
// RESUMO
// =========================

function ReportSummary({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="min-w-0 border border-[#eee7df] bg-[#faf8f5] p-5">
      <p className="font-montserrat text-[8px] uppercase tracking-[0.16em] text-[#756f69]">
        {titulo}
      </p>

      <p className="mt-3 whitespace-nowrap font-cormorant text-2xl text-[#1f1d1a]">
        {valor}
      </p>
    </div>
  );
}

// =========================
// ALERTA
// =========================

function AlertItem({
  titulo,
  valor,
  descricao,
  href,
  alerta = false,
}: {
  titulo: string;
  valor: number;
  descricao: string;
  href: string;
  alerta?: boolean;
}) {
  return (
    <Link
      href={href}
      className="block p-6 transition hover:bg-[#faf8f5]"
    >
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="font-montserrat text-xs font-medium text-[#1f1d1a]">
            {titulo}
          </p>

          <p className="mt-2 font-montserrat text-[9px] leading-relaxed text-[#756f69]">
            {descricao}
          </p>
        </div>

        <span
          className={`shrink-0 font-cormorant text-3xl leading-none ${
            alerta
              ? "text-[#7a5143]"
              : "text-[#8c7355]"
          }`}
        >
          {valor}
        </span>
      </div>
    </Link>
  );
}

// =========================
// CARD
// =========================

function DashboardCard({
  href,
  numero,
  titulo,
  descricao,
}: {
  href: string;
  numero: string;
  titulo: string;
  descricao: string;
}) {
  return (
    <Link
      href={href}
      className="group block border border-[#e2d9ce] bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:border-[#c9b59d] hover:shadow-[0_14px_35px_rgba(31,29,26,0.06)]"
    >
      <div className="flex items-start justify-between">
        <span className="font-montserrat text-[8px] tracking-[0.14em] text-[#b69a74]">
          {numero}
        </span>

        <span className="font-montserrat text-sm text-[#b69a74] transition group-hover:translate-x-1">
          →
        </span>
      </div>

      <p className="mt-8 font-cormorant text-2xl text-[#1f1d1a]">
        {titulo}
      </p>

      <p className="mt-3 max-w-sm font-montserrat text-xs leading-relaxed text-[#756f69]">
        {descricao}
      </p>

      <div className="mt-7 h-px w-8 bg-[#b69a74] transition-all duration-300 group-hover:w-14" />
    </Link>
  );
}

// =========================
// STATUS
// =========================

function StatusItem({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="border-r border-[#eee7df] p-6 last:border-r-0 sm:p-7">
      <div className="flex items-center gap-3">
        <span className="h-1.5 w-1.5 rounded-full bg-[#8c7355]" />

        <p className="font-montserrat text-[8px] uppercase tracking-[0.18em] text-[#756f69]">
          {titulo}
        </p>
      </div>

      <p className="mt-3 font-montserrat text-sm font-medium text-[#1f1d1a]">
        {valor}
      </p>
    </div>
  );
}