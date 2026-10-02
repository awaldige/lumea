"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
};

type ItemPedido = {
  id: number;
  quantidade: number;
  precoUnitario: string | number;
  subtotal: string | number;
  produto: ProdutoPedido;
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
  itens: ItemPedido[];
};

const statusLabels: Record<StatusPedido, string> = {
  PENDENTE: "Pedido pendente",
  CONFIRMADO: "Pedido confirmado",
  EM_PREPARACAO: "Em preparação",
  ENVIADO: "Pedido enviado",
  ENTREGUE: "Pedido entregue",
  CANCELADO: "Pedido cancelado",
};

const statusEtapas: StatusPedido[] = [
  "PENDENTE",
  "CONFIRMADO",
  "EM_PREPARACAO",
  "ENVIADO",
  "ENTREGUE",
];

function formatarMoeda(valor: string | number) {
  return `R$ ${Number(valor).toFixed(2).replace(".", ",")}`;
}

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(data));
}

function obterIndiceStatus(status: StatusPedido) {
  return statusEtapas.indexOf(status);
}

async function lerResposta(resposta: Response) {
  const texto = await resposta.text();

  if (!texto) {
    return {};
  }

  try {
    return JSON.parse(texto);
  } catch {
    return {
      mensagem: "A API retornou uma resposta inválida.",
    };
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

export default function PedidoDetalhePage() {
  const router = useRouter();
  const params = useParams();

  const { autenticado, carregado } = useAuth();

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  /*
   * Proteção da página
   */
  useEffect(() => {
    if (carregado && !autenticado) {
      router.replace("/login");
    }
  }, [carregado, autenticado, router]);

  /*
   * Carrega o pedido
   */
  useEffect(() => {
    if (!carregado || !autenticado) {
      return;
    }

    /*
     * IMPORTANTE:
     * O AuthContext utiliza "lumea-token".
     */
    const token = localStorage.getItem("lumea-token");

    if (!token) {
      console.warn(
        "Token de autenticação não encontrado."
      );

      router.replace("/login");
      return;
    }

    const id = params?.id;

    if (!id || Array.isArray(id)) {
      setErro("Pedido inválido.");
      setCarregando(false);
      return;
    }

    async function carregarPedido() {
      try {
        setCarregando(true);
        setErro("");

        console.log(
          "Carregando detalhes do pedido:",
          id
        );

        const resposta = await fetch(
          `${API_URL}/api/pedidos/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const dados = await lerResposta(resposta);

        /*
         * Sessão inválida/expirada
         */
        if (
          resposta.status === 401 ||
          resposta.status === 403
        ) {
          console.warn(
            "Sessão inválida ao carregar pedido."
          );

          localStorage.removeItem("lumea-token");
          localStorage.removeItem("lumea-cliente");

          router.replace(
            `/login?redirect=/pedidos/${id}`
          );

          return;
        }

        if (!resposta.ok) {
          throw new Error(
            obterMensagemErro(
              dados,
              "Não foi possível carregar o pedido."
            )
          );
        }

        /*
         * Validação mínima da resposta
         */
        if (
          !dados ||
          typeof dados !== "object" ||
          !("id" in dados)
        ) {
          throw new Error(
            "A API não retornou um pedido válido."
          );
        }

        setPedido(dados as Pedido);

        console.log(
          "Pedido carregado:",
          dados
        );
      } catch (error) {
        console.error(
          "Erro ao carregar pedido:",
          error
        );

        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o pedido."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarPedido();
  }, [carregado, autenticado, params, router]);

  /*
   * Carregamento inicial
   */
  if (
    !carregado ||
    !autenticado ||
    carregando
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf8f5]">
        <p className="font-[family-name:var(--font-montserrat)] text-xs uppercase tracking-[0.2em] text-[#756f69]">
          Carregando pedido...
        </p>
      </main>
    );
  }

  /*
   * Erro
   */
  if (erro || !pedido) {
    return (
      <main className="min-h-screen bg-[#faf8f5]">
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

        <section className="px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="border border-[#e7dfd5] bg-white p-8 text-center sm:p-12">
              <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.3em] text-[#8c7355]">
                Pedido
              </span>

              <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl text-[#1f1d1a]">
                Não foi possível carregar o pedido
              </h1>

              <p className="mx-auto mt-4 max-w-lg font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                {erro ||
                  "O pedido não foi encontrado."}
              </p>

              <Link
                href="/pedidos"
                className="mt-8 inline-flex bg-[#1f1d1a] px-8 py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355]"
              >
                Voltar aos pedidos
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const indiceAtual = obterIndiceStatus(
    pedido.status
  );

  return (
    <main className="min-h-screen bg-[#faf8f5]">
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

      <section className="px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-5xl">

          {/* Cabeçalho */}
          <div className="border-b border-[#e7dfd5] pb-10">
            <Link
              href="/pedidos"
              className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.18em] text-[#756f69] transition hover:text-[#8c7355]"
            >
              ← Voltar aos pedidos
            </Link>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.35em] text-[#8c7355]">
                  Detalhes do pedido
                </span>

                <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-5xl font-medium text-[#1f1d1a] sm:text-6xl">
                  {pedido.numero}
                </h1>

                <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs text-[#756f69]">
                  Realizado em{" "}
                  {formatarData(
                    pedido.criadoEm
                  )}
                </p>
              </div>

              <div className="sm:text-right">
                <span className="inline-flex border border-[#d8c7b0] px-4 py-2 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.15em] text-[#8c7355]">
                  {statusLabels[pedido.status]}
                </span>
              </div>
            </div>
          </div>

          {/* Acompanhamento */}
          <div className="mt-10 border border-[#e7dfd5] bg-white p-6 sm:p-8">
            <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#8c7355]">
              Acompanhamento
            </span>

            {pedido.status === "CANCELADO" ? (
              <div className="mt-6 border border-[#dcc9bd] bg-[#faf4f0] p-5">
                <p className="font-[family-name:var(--font-montserrat)] text-xs uppercase tracking-[0.12em] text-[#7a5143]">
                  Este pedido foi cancelado.
                </p>
              </div>
            ) : (
              <div className="mt-8 overflow-x-auto">
                <div className="min-w-[650px]">
                  <div className="flex items-start">
                    {statusEtapas.map(
                      (status, index) => {
                        const concluido =
                          index <= indiceAtual;

                        const atual =
                          status ===
                          pedido.status;

                        return (
                          <div
                            key={status}
                            className="relative flex-1"
                          >
                            {index <
                              statusEtapas.length -
                                1 && (
                              <div
                                className={`absolute left-1/2 right-0 top-3 h-px ${
                                  index <
                                  indiceAtual
                                    ? "bg-[#8c7355]"
                                    : "bg-[#e7dfd5]"
                                }`}
                              />
                            )}

                            <div className="relative flex flex-col items-center text-center">
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                                  concluido
                                    ? "border-[#8c7355] bg-[#8c7355]"
                                    : "border-[#d8c7b0] bg-white"
                                }`}
                              >
                                {concluido && (
                                  <span className="text-[10px] text-white">
                                    ✓
                                  </span>
                                )}
                              </div>

                              <p
                                className={`mt-3 max-w-[120px] font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.08em] ${
                                  atual
                                    ? "font-medium text-[#8c7355]"
                                    : "text-[#756f69]"
                                }`}
                              >
                                {statusLabels[
                                  status
                                ]}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Itens */}
          <div className="mt-6 border border-[#e7dfd5] bg-white">
            <div className="border-b border-[#e7dfd5] p-6 sm:px-8">
              <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#8c7355]">
                Produtos
              </span>

              <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                Itens do pedido
              </h2>
            </div>

            <div className="divide-y divide-[#eee5db]">
              {pedido.itens.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center border border-[#e7dfd5] bg-[#f3eee8]">
                      {item.produto.imagem ? (
                        <img
                          src={
                            item.produto.imagem.startsWith(
                              "http"
                            )
                              ? item.produto.imagem
                              : `${API_URL}${item.produto.imagem}`
                          }
                          alt={item.produto.nome}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-[family-name:var(--font-cormorant)] text-2xl text-[#c9b59d]">
                          L
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a]">
                        {item.produto.nome}
                      </h3>

                      <p className="mt-2 font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69]">
                        Quantidade:{" "}
                        {item.quantidade}
                      </p>

                      <p className="mt-1 font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69]">
                        Valor unitário:{" "}
                        {formatarMoeda(
                          item.precoUnitario
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.15em] text-[#8c7355]">
                      Subtotal
                    </p>

                    <p className="mt-1 font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a]">
                      {formatarMoeda(
                        item.subtotal
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo financeiro */}
          <div className="mt-6 border border-[#e7dfd5] bg-[#f3eee8] p-6 sm:p-8">
            <div className="flex flex-col gap-8 md:flex-row md:justify-between">
              <div>
                <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#8c7355]">
                  Resumo
                </span>

                <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                  Valores do pedido
                </h2>
              </div>

              <div className="w-full max-w-md space-y-4">
                <div className="flex items-center justify-between gap-6">
                  <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#756f69]">
                    Subtotal
                  </span>

                  <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#1f1d1a]">
                    {formatarMoeda(
                      pedido.subtotal
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#756f69]">
                    Desconto
                  </span>

                  <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#8c7355]">
                    -{" "}
                    {formatarMoeda(
                      pedido.desconto
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#756f69]">
                    Frete
                  </span>

                  <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#1f1d1a]">
                    {formatarMoeda(
                      pedido.frete
                    )}
                  </span>
                </div>

                <div className="border-t border-[#d8c7b0] pt-4">
                  <div className="flex items-center justify-between gap-6">
                    <span className="font-[family-name:var(--font-montserrat)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#5f5042]">
                      Total
                    </span>

                    <span className="font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                      {formatarMoeda(
                        pedido.total
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="mt-10 flex flex-col gap-4 border-t border-[#e7dfd5] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/pedidos"
              className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#756f69] transition hover:text-[#8c7355]"
            >
              ← Voltar aos pedidos
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
