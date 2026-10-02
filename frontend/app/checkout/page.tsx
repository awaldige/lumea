"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type PedidoCriado = {
  id: number;
  numero: string;
};

type CupomAplicado = {
  id: number;
  codigo: string;
  percentual: number | null;
  valorFixo: number | null;
  valorMinimo: number;
  desconto: number;
};

export default function CheckoutPage() {
  const router = useRouter();

  const {
    cliente,
    autenticado,
    carregado,
  } = useAuth();

  const {
    itens,
    quantidadeTotal,
    subtotal,
    limparCarrinho,
  } = useCart();

  const [formaPagamento, setFormaPagamento] =
    useState("pix");

  const [pedidoFinalizado, setPedidoFinalizado] =
    useState(false);

  const [pedidoCriado, setPedidoCriado] =
    useState<PedidoCriado | null>(null);

  const [finalizandoPedido, setFinalizandoPedido] =
    useState(false);

  const [erroPedido, setErroPedido] = useState("");

  const [codigoCupom, setCodigoCupom] = useState("");

  const [cupomAplicado, setCupomAplicado] =
    useState<CupomAplicado | null>(null);

  const [aplicandoCupom, setAplicandoCupom] =
    useState(false);

  const [erroCupom, setErroCupom] = useState("");

  const [frete, setFrete] = useState(0);

  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    telefone: "",
    cep: "",
    estado: "",
    endereco: "",
    numero: "",
    complemento: "",
    cidade: "",
  });

  // =========================================================
  // AUTENTICAÇÃO E PREENCHIMENTO AUTOMÁTICO
  // =========================================================

  useEffect(() => {
    if (!carregado) {
      return;
    }

    if (!autenticado) {
      router.replace("/login?redirect=/checkout");
      return;
    }

    if (cliente) {
      setFormulario((atual) => ({
        ...atual,

        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone ?? "",

        cep: cliente.cep ?? "",
        estado: cliente.estado ?? "",
        endereco: cliente.endereco ?? "",
        numero: cliente.numero ?? "",
        complemento: cliente.complemento ?? "",
        cidade: cliente.cidade ?? "",
      }));
    }
  }, [
    carregado,
    autenticado,
    cliente,
    router,
  ]);

  // =========================================================
  // FORMATAÇÃO
  // =========================================================

  function formatarPreco(valor: number) {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
  }

  // =========================================================
  // FRETE SIMULADO
  // =========================================================

  useEffect(() => {
    if (subtotal <= 0) {
      setFrete(0);
      return;
    }

    if (subtotal >= 200) {
      setFrete(0);
      return;
    }

    setFrete(19.9);
  }, [subtotal]);

  // =========================================================
  // DESCONTO
  // =========================================================

  const desconto = cupomAplicado?.desconto ?? 0;

  // =========================================================
  // TOTAL
  // =========================================================

  const total = Math.max(
    subtotal - desconto + frete,
    0
  );

  // =========================================================
  // CAMPOS
  // =========================================================

  function atualizarCampo(
    campo: keyof typeof formulario,
    valor: string
  ) {
    setFormulario((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  // =========================================================
  // LIMPAR FORMULÁRIO
  // =========================================================

  function limparFormulario() {
    setFormulario({
      nome: cliente?.nome ?? "",
      email: cliente?.email ?? "",
      telefone: cliente?.telefone ?? "",
      cep: cliente?.cep ?? "",
      estado: cliente?.estado ?? "",
      endereco: cliente?.endereco ?? "",
      numero: cliente?.numero ?? "",
      complemento: cliente?.complemento ?? "",
      cidade: cliente?.cidade ?? "",
    });

    setFormaPagamento("pix");
  }

  // =========================================================
  // APLICAR CUPOM
  // =========================================================

  async function aplicarCupom() {
    if (aplicandoCupom) {
      return;
    }

    setErroCupom("");

    const codigo = codigoCupom.trim().toUpperCase();

    if (!codigo) {
      setErroCupom("Informe o código do cupom.");
      return;
    }

    if (subtotal <= 0) {
      setErroCupom(
        "Não é possível aplicar um cupom com o carrinho vazio."
      );
      return;
    }

    try {
      setAplicandoCupom(true);

      const resposta = await fetch(
        `${API_URL}/api/cupons/validar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            codigo,
            subtotal,
          }),
        }
      );

      const dados = await resposta
        .json()
        .catch(() => null);

      if (!resposta.ok) {
        throw new Error(
          dados?.message ||
            dados?.mensagem ||
            `Não foi possível validar o cupom. Status: ${resposta.status}`
        );
      }

      if (!dados?.success || !dados?.cupom) {
        throw new Error("Cupom inválido.");
      }

      const cupom = dados.cupom;

      const descontoCalculado =
        Number(cupom.desconto) || 0;

      if (descontoCalculado <= 0) {
        throw new Error(
          "Este cupom não possui desconto válido para este pedido."
        );
      }

      setCupomAplicado({
        id: Number(cupom.id),
        codigo: String(cupom.codigo),
        percentual:
          cupom.percentual !== null
            ? Number(cupom.percentual)
            : null,
        valorFixo:
          cupom.valorFixo !== null
            ? Number(cupom.valorFixo)
            : null,
        valorMinimo:
          Number(cupom.valorMinimo) || 0,
        desconto: Math.min(
          descontoCalculado,
          subtotal
        ),
      });

      setCodigoCupom(String(cupom.codigo));
      setErroCupom("");
    } catch (error) {
      console.error(
        "Erro ao aplicar cupom:",
        error
      );

      setCupomAplicado(null);

      setErroCupom(
        error instanceof Error
          ? error.message
          : "Não foi possível validar o cupom."
      );
    } finally {
      setAplicandoCupom(false);
    }
  }

  // =========================================================
  // REMOVER CUPOM
  // =========================================================

  function removerCupom() {
    setCupomAplicado(null);
    setCodigoCupom("");
    setErroCupom("");
  }

  // =========================================================
  // FINALIZAR PEDIDO
  // =========================================================

  async function handleFinalizarPedido() {
    if (finalizandoPedido) {
      return;
    }

    setErroPedido("");

    if (!carregado) {
      setErroPedido(
        "Aguarde o carregamento da sua conta antes de finalizar o pedido."
      );
      return;
    }

    if (!autenticado || !cliente) {
      router.replace("/login?redirect=/checkout");
      return;
    }

    if (!cliente.id) {
      setErroPedido(
        "Não foi possível identificar o cliente autenticado. Faça login novamente."
      );
      return;
    }

    if (itens.length === 0) {
      setErroPedido("Seu carrinho está vazio.");
      return;
    }

    // =======================================================
    // VALIDAR DADOS
    // =======================================================

    const camposObrigatorios = [
      formulario.nome,
      formulario.email,
      formulario.telefone,
      formulario.cep,
      formulario.estado,
      formulario.endereco,
      formulario.numero,
      formulario.cidade,
    ];

    const existeCampoVazio =
      camposObrigatorios.some(
        (campo) => !campo || campo.trim() === ""
      );

    if (existeCampoVazio) {
      setErroPedido(
        "Preencha todos os campos obrigatórios antes de finalizar o pedido."
      );
      return;
    }

    // =======================================================
    // VALIDAR ITENS DO CARRINHO
    // =======================================================

    const itensPedido = itens.map((item) => ({
      produtoId: Number(item.id),
      quantidade: Number(item.quantidade),
    }));

    const itemInvalido = itensPedido.some(
      (item) =>
        !Number.isInteger(item.produtoId) ||
        item.produtoId <= 0 ||
        !Number.isInteger(item.quantidade) ||
        item.quantidade <= 0
    );

    if (itemInvalido) {
      setErroPedido(
        "Existe um produto inválido no carrinho. Remova-o e adicione-o novamente."
      );
      return;
    }

    // =======================================================
    // PAGAMENTO — SIMULADO
    // =======================================================

    const pagamento =
      formaPagamento === "pix"
        ? "Pix"
        : formaPagamento === "cartao"
          ? "Cartão de crédito"
          : "Boleto";

    // =======================================================
    // CONFIRMAÇÃO
    // =======================================================

    const confirmado = window.confirm(
      `Pedido com ${quantidadeTotal} item(ns).\n\n` +
        `Subtotal: ${formatarPreco(subtotal)}\n` +
        `Desconto: ${formatarPreco(desconto)}\n` +
        `Frete: ${
          frete === 0
            ? "Grátis"
            : formatarPreco(frete)
        }\n` +
        `Total: ${formatarPreco(total)}\n` +
        `Forma de pagamento: ${pagamento}\n\n` +
        `Deseja confirmar o pedido?`
    );

    if (!confirmado) {
      return;
    }

    // =======================================================
    // TOKEN
    // =======================================================

    const token =
      window.localStorage.getItem("lumea-token");

    if (!token) {
      router.replace("/login?redirect=/checkout");
      return;
    }

    // =======================================================
    // ENVIAR PEDIDO
    // =======================================================

    try {
      setFinalizandoPedido(true);

      const payload = {
        itens: itensPedido,
        desconto: Number(desconto.toFixed(2)),
        frete: Number(frete.toFixed(2)),
      };

      console.log(
        "================================="
      );

      console.log("FINALIZANDO PEDIDO");

      console.log("Cliente:", {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
      });

      console.log(
        "API:",
        `${API_URL}/api/pedidos`
      );

      console.log("Payload:", payload);

      console.log(
        "================================="
      );

      const resposta = await fetch(
        `${API_URL}/api/pedidos`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      // =====================================================
      // LER RESPOSTA
      // =====================================================

      const textoResposta =
        await resposta.text();

      let dados: any = null;

      if (textoResposta.trim()) {
        try {
          dados = JSON.parse(textoResposta);
        } catch {
          dados = {
            mensagem: textoResposta,
          };
        }
      }

      console.log(
        "================================="
      );

      console.log(
        "RESPOSTA DA API"
      );

      console.log(
        "Status:",
        resposta.status
      );

      console.log(
        "OK:",
        resposta.ok
      );

      console.log(
        "Dados:",
        dados
      );

      console.log(
        "================================="
      );

      // =====================================================
      // ERRO HTTP
      // =====================================================

      if (!resposta.ok) {
        let mensagem =
          dados?.mensagem ||
          dados?.message ||
          dados?.error;

        if (!mensagem && typeof dados === "string") {
          mensagem = dados;
        }

        if (!mensagem) {
          mensagem =
            `Não foi possível registrar o pedido. Status: ${resposta.status}`;
        }

        throw new Error(mensagem);
      }

      // =====================================================
      // VALIDAR PEDIDO RETORNADO
      // =====================================================

      const pedidoId = Number(dados?.id);

      if (
        !Number.isInteger(pedidoId) ||
        pedidoId <= 0
      ) {
        console.error(
          "Resposta inesperada da API:",
          dados
        );

        throw new Error(
          "O pedido foi processado, mas a API não retornou um ID válido."
        );
      }

      const numeroPedido = String(
        dados?.numero || `LUM-${pedidoId}`
      );

      // =====================================================
      // PEDIDO CRIADO COM SUCESSO
      // =====================================================

      console.log(
        `Pedido ${numeroPedido} criado com sucesso.`
      );

      setPedidoCriado({
        id: pedidoId,
        numero: numeroPedido,
      });

      /*
       * IMPORTANTE:
       * O carrinho só é limpo depois que a API confirmou
       * a criação do pedido.
       */

      limparCarrinho();

      // =====================================================
      // LIMPAR DADOS TEMPORÁRIOS
      // =====================================================

      limparFormulario();

      setCupomAplicado(null);
      setCodigoCupom("");
      setErroCupom("");

      // =====================================================
      // TELA DE SUCESSO
      // =====================================================

      setPedidoFinalizado(true);
    } catch (error) {
      console.error(
        "================================="
      );

      console.error(
        "ERRO AO FINALIZAR PEDIDO"
      );

      console.error(error);

      console.error(
        "================================="
      );

      setErroPedido(
        error instanceof Error
          ? error.message
          : "Não foi possível finalizar o pedido."
      );
    } finally {
      setFinalizandoPedido(false);
    }
  }

  // =========================================================
  // CARREGANDO
  // =========================================================

  if (!carregado) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf8f5]">
        <p className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.25em] text-[#756f69]">
          Verificando sua conta...
        </p>
      </main>
    );
  }

  // =========================================================
  // NÃO AUTENTICADO
  // =========================================================

  if (!autenticado) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-6">
        <div className="text-center">
          <p className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.3em] text-[#8c7355]">
            LUMÉA
          </p>

          <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-4xl text-[#1f1d1a] sm:text-5xl">
            Acesse sua conta
          </h1>

          <p className="mx-auto mt-5 max-w-md font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
            Para finalizar sua compra, entre
            na sua conta ou crie uma nova
            conta LUMÉA.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login?redirect=/checkout"
              className="inline-flex items-center justify-center bg-[#1f1d1a] px-8 py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355]"
            >
              Entrar
            </Link>

            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center border border-[#d8c7b0] px-8 py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#5f5042] transition hover:border-[#8c7355] hover:text-[#8c7355]"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // PEDIDO FINALIZADO
  // =========================================================

  if (pedidoFinalizado) {
    return (
      <main className="min-h-screen bg-[#faf8f5]">
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-2xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#c9b59d]">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="m5 12 4 4L19 6" />
              </svg>
            </div>

            <p className="mt-8 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.35em] text-[#8c7355]">
              LUMÉA
            </p>

            <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-5xl font-medium text-[#1f1d1a] sm:text-6xl">
              Pedido realizado
            </h1>

            <p className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
              Seu pedido foi registrado com
              sucesso. Agradecemos por escolher
              a LUMÉA.
            </p>

            {pedidoCriado && (
              <div className="mx-auto mt-8 max-w-sm border border-[#e7dfd5] bg-white p-6">
                <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#8c7355]">
                  Número do pedido
                </p>

                <p className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                  {pedidoCriado.numero}
                </p>
              </div>
            )}

            <div className="mx-auto mt-10 h-px w-16 bg-[#b69a74]" />

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/pedidos"
                className="inline-flex items-center justify-center bg-[#1f1d1a] px-8 py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355]"
              >
                Ver meus pedidos
              </Link>

              <Link
                href="/produtos"
                className="inline-flex items-center justify-center border border-[#d8c7b0] px-8 py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#5f5042] transition hover:border-[#8c7355] hover:text-[#8c7355]"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // =========================================================
  // CARRINHO VAZIO
  // =========================================================

  if (itens.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf8f5]">
        <section className="border-b border-[#e7dfd5]">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
            <Link
              href="/"
              className="inline-flex items-center gap-3 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#756f69] transition hover:text-[#8c7355]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M19 12H5" />
                <path d="m11 18-6-6 6-6" />
              </svg>

              Voltar
            </Link>
          </div>
        </section>

        <section className="flex min-h-[60vh] items-center justify-center px-6">
          <div className="text-center">
            <p className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.3em] text-[#8c7355]">
              LUMÉA
            </p>

            <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-5xl text-[#1f1d1a] sm:text-6xl">
              Seu carrinho está vazio.
            </h1>

            <p className="mx-auto mt-5 max-w-md font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
              Adicione pelo menos um produto ao
              carrinho para continuar com seu
              pedido.
            </p>

            <Link
              href="/produtos"
              className="mt-8 inline-flex bg-[#1f1d1a] px-8 py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355]"
            >
              Explorar produtos
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // =========================================================
  // CHECKOUT
  // =========================================================

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      {/* Cabeçalho */}

      <section className="border-b border-[#e7dfd5]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12">
          <Link
            href="/carrinho"
            className="mb-10 inline-flex items-center gap-3 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#756f69] transition hover:text-[#8c7355]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M19 12H5" />
              <path d="m11 18-6-6 6-6" />
            </svg>

            Voltar ao carrinho
          </Link>

          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-[#b69a74]" />

            <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.35em] text-[#8c7355]">
              LUMÉA
            </span>
          </div>

          <h1 className="mt-6 font-[family-name:var(--font-cormorant)] text-6xl font-medium tracking-[-0.02em] text-[#1f1d1a] sm:text-7xl">
            Finalizar pedido
          </h1>

          <p className="mt-5 max-w-xl font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
            Preencha seus dados para continuar
            com a entrega do seu pedido.
          </p>
        </div>
      </section>

      {/* Conteúdo */}

      <section>
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div className="space-y-12">

              {/* Seus dados */}

              <section>
                <div className="border-b border-[#e7dfd5] pb-5">
                  <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.25em] text-[#8c7355]">
                    01
                  </p>

                  <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                    Seus dados
                  </h2>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="nome"
                      className="mb-2 block font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.15em] text-[#756f69]"
                    >
                      Nome completo *
                    </label>

                    <input
                      id="nome"
                      type="text"
                      value={formulario.nome}
                      onChange={(e) =>
                        atualizarCampo(
                          "nome",
                          e.target.value
                        )
                      }
                      placeholder="Digite seu nome completo"
                      className="h-12 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.15em] text-[#756f69]"
                    >
                      E-mail *
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={formulario.email}
                      onChange={(e) =>
                        atualizarCampo(
                          "email",
                          e.target.value
                        )
                      }
                      placeholder="seu@email.com"
                      className="h-12 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="telefone"
                      className="mb-2 block font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.15em] text-[#756f69]"
                    >
                      Telefone *
                    </label>

                    <input
                      id="telefone"
                      type="tel"
                      value={formulario.telefone}
                      onChange={(e) =>
                        atualizarCampo(
                          "telefone",
                          e.target.value
                        )
                      }
                      placeholder="(00) 00000-0000"
                      className="h-12 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                    />
                  </div>
                </div>
              </section>

              {/* Endereço */}

              <section>
                <div className="border-b border-[#e7dfd5] pb-5">
                  <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.25em] text-[#8c7355]">
                    02
                  </p>

                  <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                    Endereço de entrega
                  </h2>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="cep"
                      className="mb-2 block font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.15em] text-[#756f69]"
                    >
                      CEP *
                    </label>

                    <input
                      id="cep"
                      type="text"
                      value={formulario.cep}
                      onChange={(e) =>
                        atualizarCampo(
                          "cep",
                          e.target.value
                        )
                      }
                      placeholder="00000-000"
                      className="h-12 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="estado"
                      className="mb-2 block font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.15em] text-[#756f69]"
                    >
                      Estado *
                    </label>

                    <input
                      id="estado"
                      type="text"
                      maxLength={2}
                      value={formulario.estado}
                      onChange={(e) =>
                        atualizarCampo(
                          "estado",
                          e.target.value.toUpperCase()
                        )
                      }
                      placeholder="SP"
                      className="h-12 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm uppercase text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="endereco"
                      className="mb-2 block font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.15em] text-[#756f69]"
                    >
                      Endereço *
                    </label>

                    <input
                      id="endereco"
                      type="text"
                      value={formulario.endereco}
                      onChange={(e) =>
                        atualizarCampo(
                          "endereco",
                          e.target.value
                        )
                      }
                      placeholder="Rua, avenida..."
                      className="h-12 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="numero"
                      className="mb-2 block font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.15em] text-[#756f69]"
                    >
                      Número *
                    </label>

                    <input
                      id="numero"
                      type="text"
                      value={formulario.numero}
                      onChange={(e) =>
                        atualizarCampo(
                          "numero",
                          e.target.value
                        )
                      }
                      placeholder="123"
                      className="h-12 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="complemento"
                      className="mb-2 block font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.15em] text-[#756f69]"
                    >
                      Complemento
                    </label>

                    <input
                      id="complemento"
                      type="text"
                      value={formulario.complemento}
                      onChange={(e) =>
                        atualizarCampo(
                          "complemento",
                          e.target.value
                        )
                      }
                      placeholder="Apartamento, bloco..."
                      className="h-12 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cidade"
                      className="mb-2 block font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.15em] text-[#756f69]"
                    >
                      Cidade *
                    </label>

                    <input
                      id="cidade"
                      type="text"
                      value={formulario.cidade}
                      onChange={(e) =>
                        atualizarCampo(
                          "cidade",
                          e.target.value
                        )
                      }
                      placeholder="Sua cidade"
                      className="h-12 w-full border border-[#d8c7b0] bg-white px-4 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355]"
                    />
                  </div>
                </div>
              </section>

              {/* Pagamento */}

              <section>
                <div className="border-b border-[#e7dfd5] pb-5">
                  <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.25em] text-[#8c7355]">
                    03
                  </p>

                  <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                    Forma de pagamento
                  </h2>
                </div>

                <div className="mt-8 space-y-3">
                  <label
                    className={`flex cursor-pointer items-center justify-between border p-5 transition ${
                      formaPagamento === "pix"
                        ? "border-[#8c7355] bg-[#f3eee8]"
                        : "border-[#e7dfd5] bg-white hover:border-[#d8c7b0]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="pagamento"
                        value="pix"
                        checked={
                          formaPagamento === "pix"
                        }
                        onChange={() =>
                          setFormaPagamento("pix")
                        }
                        className="accent-[#8c7355]"
                      />

                      <div>
                        <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium text-[#1f1d1a]">
                          Pix
                        </p>

                        <p className="mt-1 font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69]">
                          Pagamento instantâneo
                        </p>
                      </div>
                    </div>

                    <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.15em] text-[#8c7355]">
                      Recomendado
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center border p-5 transition ${
                      formaPagamento === "cartao"
                        ? "border-[#8c7355] bg-[#f3eee8]"
                        : "border-[#e7dfd5] bg-white hover:border-[#d8c7b0]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="pagamento"
                        value="cartao"
                        checked={
                          formaPagamento ===
                          "cartao"
                        }
                        onChange={() =>
                          setFormaPagamento(
                            "cartao"
                          )
                        }
                        className="accent-[#8c7355]"
                      />

                      <div>
                        <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium text-[#1f1d1a]">
                          Cartão de crédito
                        </p>

                        <p className="mt-1 font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69]">
                          Pagamento simulado
                        </p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center border p-5 transition ${
                      formaPagamento === "boleto"
                        ? "border-[#8c7355] bg-[#f3eee8]"
                        : "border-[#e7dfd5] bg-white hover:border-[#d8c7b0]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="pagamento"
                        value="boleto"
                        checked={
                          formaPagamento ===
                          "boleto"
                        }
                        onChange={() =>
                          setFormaPagamento(
                            "boleto"
                          )
                        }
                        className="accent-[#8c7355]"
                      />

                      <div>
                        <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium text-[#1f1d1a]">
                          Boleto bancário
                        </p>

                        <p className="mt-1 font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69]">
                          Pagamento simulado
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            {/* Resumo */}

            <aside className="h-fit border border-[#e7dfd5] bg-[#f3eee8] p-8 lg:sticky lg:top-28">
              <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.25em] text-[#8c7355]">
                Seu pedido
              </p>

              <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                Resumo
              </h2>

              {/* Produtos */}

              <div className="mt-8 divide-y divide-[#d8c7b0] border-y border-[#d8c7b0]">
                {itens.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-5"
                  >
                    <div className="flex h-20 w-16 shrink-0 items-center justify-center bg-[#eee5db]">
                      <span className="font-[family-name:var(--font-cormorant)] text-3xl italic text-[#8c7355]/60">
                        L
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.15em] text-[#8c7355]">
                        {item.categoria}
                      </p>

                      <h3 className="mt-1 font-[family-name:var(--font-cormorant)] text-xl text-[#1f1d1a]">
                        {item.nome}
                      </h3>

                      <p className="mt-1 font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69]">
                        Quantidade:{" "}
                        {item.quantidade}
                      </p>
                    </div>

                    <span className="shrink-0 font-[family-name:var(--font-montserrat)] text-xs text-[#5f5042]">
                      {formatarPreco(
                        item.preco *
                          item.quantidade
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cupom */}

              <div className="mt-8">
                <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#8c7355]">
                  Cupom de desconto
                </p>

                {!cupomAplicado ? (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={codigoCupom}
                      onChange={(e) => {
                        setCodigoCupom(
                          e.target.value.toUpperCase()
                        );
                        setErroCupom("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          aplicarCupom();
                        }
                      }}
                      placeholder="CÓDIGO DO CUPOM"
                      disabled={aplicandoCupom}
                      className="h-11 min-w-0 flex-1 border border-[#d8c7b0] bg-white px-3 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.08em] text-[#1f1d1a] outline-none transition placeholder:text-[#aaa19a] focus:border-[#8c7355] disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={aplicarCupom}
                      disabled={aplicandoCupom}
                      className="h-11 shrink-0 bg-[#1f1d1a] px-4 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.15em] text-white transition hover:bg-[#8c7355] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {aplicandoCupom
                        ? "..."
                        : "Aplicar"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 border border-[#c9b59d] bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-[family-name:var(--font-montserrat)] text-[10px] font-medium uppercase tracking-[0.12em] text-[#1f1d1a]">
                          {cupomAplicado.codigo}
                        </p>

                        <p className="mt-1 font-[family-name:var(--font-montserrat)] text-[10px] text-[#8c7355]">
                          Desconto de{" "}
                          {formatarPreco(
                            cupomAplicado.desconto
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={removerCupom}
                        className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.12em] text-[#756f69] transition hover:text-[#8c7355]"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                )}

                {erroCupom && (
                  <p className="mt-3 font-[family-name:var(--font-montserrat)] text-[10px] leading-5 text-[#7a5143]">
                    {erroCupom}
                  </p>
                )}
              </div>

              {/* Resumo financeiro */}

              <div className="mt-6 space-y-4">
                <div className="flex justify-between font-[family-name:var(--font-montserrat)] text-xs text-[#756f69]">
                  <span>Subtotal</span>

                  <span>
                    {formatarPreco(subtotal)}
                  </span>
                </div>

                {desconto > 0 && (
                  <div className="flex justify-between font-[family-name:var(--font-montserrat)] text-xs text-[#8c7355]">
                    <span>Desconto</span>

                    <span>
                      -{" "}
                      {formatarPreco(
                        desconto
                      )}
                    </span>
                  </div>
                )}

                <div className="flex justify-between font-[family-name:var(--font-montserrat)] text-xs text-[#756f69]">
                  <span>Frete</span>

                  <span>
                    {frete === 0
                      ? "Grátis"
                      : formatarPreco(frete)}
                  </span>
                </div>

                {frete > 0 && (
                  <p className="font-[family-name:var(--font-montserrat)] text-[9px] leading-5 text-[#8c7355]">
                    Frete simulado de R$ 19,90.
                    Frete grátis para compras a
                    partir de R$ 200,00.
                  </p>
                )}

                {frete === 0 &&
                  subtotal > 0 && (
                    <p className="font-[family-name:var(--font-montserrat)] text-[9px] leading-5 text-[#8c7355]">
                      Frete grátis para compras a
                      partir de R$ 200,00.
                    </p>
                  )}
              </div>

              {/* Total */}

              <div className="mt-6 flex items-center justify-between border-t border-[#d8c7b0] pt-6">
                <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.15em] text-[#756f69]">
                  Total
                </span>

                <span className="font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
                  {formatarPreco(total)}
                </span>
              </div>

              {/* Erro do pedido */}

              {erroPedido && (
                <div className="mt-6 border border-[#dcc9bd] bg-[#faf4f0] px-4 py-4">
                  <p className="font-[family-name:var(--font-montserrat)] text-xs leading-6 text-[#7a5143]">
                    {erroPedido}
                  </p>
                </div>
              )}

              {/* Finalizar */}

              <button
                type="button"
                onClick={handleFinalizarPedido}
                disabled={finalizandoPedido}
                className="mt-8 flex h-14 w-full items-center justify-center gap-4 bg-[#1f1d1a] px-6 font-[family-name:var(--font-montserrat)] text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {finalizandoPedido
                  ? "Registrando pedido..."
                  : "Finalizar pedido"}

                {!finalizandoPedido && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M5 12h13" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                )}
              </button>

              <p className="mt-5 text-center font-[family-name:var(--font-montserrat)] text-[9px] leading-5 text-[#8f8780]">
                Seus dados serão utilizados
                exclusivamente para
                processamento do pedido e
                entrega.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}