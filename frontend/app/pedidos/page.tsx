"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type ProdutoPedido = {
  id: number;
  nome: string;
  imagem: string | null;
};

type ItemPedido = {
  id: number;
  quantidade: number;
  precoUnitario: string | number;
  subtotal: string | number;
  produto: ProdutoPedido;
};

type StatusPedido =
  | "PENDENTE"
  | "CONFIRMADO"
  | "EM_PREPARACAO"
  | "ENVIADO"
  | "ENTREGUE"
  | "CANCELADO";

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
  itens: ItemPedido[];
};

const nomesStatus: Record<StatusPedido, string> = {
  PENDENTE: "Pedido pendente",
  CONFIRMADO: "Pedido confirmado",
  EM_PREPARACAO: "Em preparação",
  ENVIADO: "Pedido enviado",
  ENTREGUE: "Pedido entregue",
  CANCELADO: "Pedido cancelado",
};

function formatarPreco(valor: string | number) {
  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    return "R$ 0,00";
  }

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data: string) {
  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return "Data não disponível";
  }

  return dataConvertida.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

async function lerRespostaJson(
  resposta: Response
): Promise<unknown> {
  const texto = await resposta.text();

  if (!texto) {
    return null;
  }

  try {
    return JSON.parse(texto);
  } catch {
    throw new Error(
      `A API retornou uma resposta inválida. Status: ${resposta.status}`
    );
  }
}

function obterMensagemErro(
  dados: unknown,
  fallback: string
) {
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

  return fallback;
}

export default function PedidosPage() {
  const router = useRouter();

  const {
    cliente,
    autenticado,
    carregado,
  } = useAuth();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregandoPedidos, setCarregandoPedidos] =
    useState(true);
  const [erro, setErro] = useState("");

  /*
   * REDIRECIONAMENTO
   *
   * Só verificamos a autenticação depois que
   * o AuthContext terminou de carregar.
   */
  useEffect(() => {
    if (!carregado) {
      return;
    }

    if (!autenticado || !cliente) {
      router.replace("/login?redirect=/pedidos");
    }
  }, [
    carregado,
    autenticado,
    cliente,
    router,
  ]);

  /*
   * CARREGAR PEDIDOS
   */
  useEffect(() => {
    let cancelado = false;

    async function carregarPedidos() {
      if (!carregado) {
        return;
      }

      if (!autenticado || !cliente) {
        setCarregandoPedidos(false);
        return;
      }

      /*
       * IMPORTANTE:
       * O AuthContext utiliza "lumea-token".
       */
      const token =
        window.localStorage.getItem("lumea-token");

      if (!token) {
        if (!cancelado) {
          setErro(
            "Sua sessão não foi encontrada. Faça login novamente."
          );
          setCarregandoPedidos(false);
        }

        router.replace("/login?redirect=/pedidos");
        return;
      }

      try {
        if (!cancelado) {
          setCarregandoPedidos(true);
          setErro("");
        }

        console.log(
          "Carregando pedidos do cliente:",
          cliente.id
        );

        const resposta = await fetch(
          `${API_URL}/api/pedidos`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            cache: "no-store",
          }
        );

        const dados =
          await lerRespostaJson(resposta);

        if (!resposta.ok) {
          /*
           * Token inválido ou expirado.
           */
          if (
            resposta.status === 401 ||
            resposta.status === 403
          ) {
            window.localStorage.removeItem(
              "lumea-token"
            );

            window.localStorage.removeItem(
              "lumea-cliente"
            );

            if (!cancelado) {
              setPedidos([]);
              setErro(
                "Sua sessão expirou. Faça login novamente."
              );
              setCarregandoPedidos(false);
            }

            router.replace("/login?redirect=/pedidos");
            return;
          }

          throw new Error(
            obterMensagemErro(
              dados,
              "Não foi possível carregar seus pedidos."
            )
          );
        }

        /*
         * O backend retorna diretamente um array
         * de pedidos.
         */
        const pedidosRecebidos = Array.isArray(dados)
          ? (dados as Pedido[])
          : [];

        console.log(
          "Pedidos carregados:",
          pedidosRecebidos.length
        );

        if (!cancelado) {
          setPedidos(pedidosRecebidos);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar pedidos:",
          error
        );

        if (!cancelado) {
          setErro(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar seus pedidos."
          );
          setPedidos([]);
        }
      } finally {
        if (!cancelado) {
          setCarregandoPedidos(false);
        }
      }
    }

    carregarPedidos();

    return () => {
      cancelado = true;
    };
  }, [
    carregado,
    autenticado,
    cliente,
    router,
  ]);

  /*
   * ESTADO INICIAL
   */
  if (!carregado || !autenticado || !cliente) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf8f5]">
        <p className="font-[family-name:var(--font-montserrat)] text-xs uppercase tracking-[0.2em] text-[#756f69]">
          Carregando...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      {/* HEADER */}

      <header className="border-b border-[#e7dfd5]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10 lg:px-12">
          <Link
            href="/"
            className="font-[family-name:var(--font-cormorant)] text-3xl tracking-[0.25em] text-[#1f1d1a]"
          >
            LUMÉA
          </Link>

          <Link
            href="/minha-conta"
            className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#756f69] transition hover:text-[#8c7355]"
          >
            Minha conta
          </Link>
        </div>
      </header>

      {/* CONTEÚDO */}

      <section className="px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-5xl">

          {/* TÍTULO */}

          <div className="border-b border-[#e7dfd5] pb-10">
            <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.35em] text-[#8c7355]">
              Área do cliente
            </span>

            <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-5xl font-medium text-[#1f1d1a] sm:text-6xl">
              Meus pedidos
            </h1>

            <p className="mt-4 max-w-xl font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
              Olá, {cliente.nome.split(" ")[0]}. Aqui você
              poderá acompanhar seus pedidos e consultar
              seu histórico de compras.
            </p>
          </div>

          {/* ERRO */}

          {erro && (
            <div className="mt-8 border border-[#dcc9bd] bg-[#faf4f0] px-5 py-4">
              <p className="font-[family-name:var(--font-montserrat)] text-xs leading-5 text-[#7a5143]">
                {erro}
              </p>
            </div>
          )}

          {/* CARREGANDO */}

          {carregandoPedidos && (
            <div className="mt-10 border border-[#e7dfd5] bg-white p-10 text-center">
              <p className="font-[family-name:var(--font-montserrat)] text-xs uppercase tracking-[0.2em] text-[#756f69]">
                Carregando seus pedidos...
              </p>
            </div>
          )}

          {/* SEM PEDIDOS */}

          {!carregandoPedidos &&
            !erro &&
            pedidos.length === 0 && (
              <div className="mt-10 border border-[#e7dfd5] bg-white px-6 py-16 text-center">
                <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.3em] text-[#8c7355]">
                  Histórico de compras
                </span>

                <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                  Você ainda não realizou pedidos.
                </h2>

                <p className="mx-auto mt-4 max-w-md font-[family-name:var(--font-montserrat)] text-xs leading-6 text-[#756f69]">
                  Quando você realizar uma compra,
                  seus pedidos aparecerão aqui.
                </p>

                <Link
                  href="/produtos"
                  className="mt-7 inline-flex bg-[#1f1d1a] px-8 py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355]"
                >
                  Explorar produtos
                </Link>
              </div>
            )}

          {/* PEDIDOS */}

          {!carregandoPedidos &&
            !erro &&
            pedidos.length > 0 && (
              <div className="mt-10 space-y-6">
                {pedidos.map((pedido) => (
                  <article
                    key={pedido.id}
                    className="border border-[#e7dfd5] bg-white"
                  >

                    {/* CABEÇALHO DO PEDIDO */}

                    <div className="flex flex-col gap-5 border-b border-[#e7dfd5] p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                      <div>
                        <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#8c7355]">
                          Pedido
                        </span>

                        <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a]">
                          {pedido.numero}
                        </h2>

                        <p className="mt-2 font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69]">
                          Realizado em{" "}
                          {formatarData(pedido.criadoEm)}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <span className="inline-flex border border-[#d8c7b0] px-4 py-2 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.15em] text-[#8c7355]">
                          {nomesStatus[pedido.status]}
                        </span>

                        <p className="mt-3 font-[family-name:var(--font-montserrat)] text-xs text-[#756f69]">
                          Total
                        </p>

                        <p className="mt-1 font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a]">
                          {formatarPreco(pedido.total)}
                        </p>
                      </div>
                    </div>

                    {/* ITENS */}

                    <div className="p-6 sm:px-8">
                      <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#8c7355]">
                        Itens
                      </span>

                      <div className="mt-5 divide-y divide-[#eee5db]">
                        {Array.isArray(pedido.itens) &&
                          pedido.itens.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                            >
                              <div>
                                <p className="font-[family-name:var(--font-cormorant)] text-xl text-[#1f1d1a]">
                                  {item.produto?.nome ||
                                    "Produto"}
                                </p>

                                <p className="mt-1 font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69]">
                                  Quantidade:{" "}
                                  {item.quantidade}
                                </p>
                              </div>

                              <p className="font-[family-name:var(--font-montserrat)] text-xs text-[#5f5042]">
                                {formatarPreco(
                                  item.subtotal
                                )}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* RESUMO FINANCEIRO */}

                    <div className="border-t border-[#e7dfd5] bg-[#faf8f5] px-6 py-5 sm:px-8">
                      <div className="flex flex-col gap-2 sm:ml-auto sm:max-w-xs">

                        <div className="flex justify-between gap-6">
                          <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69]">
                            Subtotal
                          </span>

                          <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-[#5f5042]">
                            {formatarPreco(
                              pedido.subtotal
                            )}
                          </span>
                        </div>

                        {Number(pedido.desconto) > 0 && (
                          <div className="flex justify-between gap-6">
                            <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69]">
                              Desconto
                            </span>

                            <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-[#6d8066]">
                              -{" "}
                              {formatarPreco(
                                pedido.desconto
                              )}
                            </span>
                          </div>
                        )}

                        {Number(pedido.frete) > 0 && (
                          <div className="flex justify-between gap-6">
                            <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69]">
                              Frete
                            </span>

                            <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-[#5f5042]">
                              {formatarPreco(
                                pedido.frete
                              )}
                            </span>
                          </div>
                        )}

                        <div className="mt-2 flex justify-between gap-6 border-t border-[#e7dfd5] pt-3">
                          <span className="font-[family-name:var(--font-montserrat)] text-[10px] font-medium uppercase tracking-[0.12em] text-[#5f5042]">
                            Total
                          </span>

                          <span className="font-[family-name:var(--font-cormorant)] text-xl text-[#1f1d1a]">
                            {formatarPreco(
                              pedido.total
                            )}
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* DETALHES */}

                    <div className="border-t border-[#e7dfd5] px-6 py-5 sm:px-8">
                      <Link
                        href={`/pedidos/${pedido.id}`}
                        className="inline-flex border border-[#1f1d1a] px-6 py-3 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.18em] text-[#1f1d1a] transition hover:bg-[#1f1d1a] hover:text-white"
                      >
                        Ver detalhes
                      </Link>
                    </div>

                  </article>
                ))}
              </div>
            )}

          {/* NAVEGAÇÃO */}

          <div className="mt-10 flex flex-col gap-4 border-t border-[#e7dfd5] pt-8 sm:flex-row sm:items-center sm:justify-between">

            <Link
              href="/minha-conta"
              className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#756f69] transition hover:text-[#8c7355]"
            >
              ← Voltar para minha conta
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center bg-[#1f1d1a] px-8 py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355]"
            >
              Continuar comprando
            </Link>

          </div>
        </div>
      </section>
    </main>
  );
}