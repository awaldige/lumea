"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "@/context/CartContext";
import { produtos } from "@/lib/products";

export default function CarrinhoPage() {
  const {
    itens,
    subtotal,
    alterarQuantidade,
    removerDoCarrinho,
    limparCarrinho,
  } = useCart();

  const [cupom, setCupom] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [mensagemCupom, setMensagemCupom] = useState("");

  const [cep, setCep] = useState("");
  const [freteCalculado, setFreteCalculado] = useState(false);

  const desconto = cupomAplicado ? subtotal * 0.1 : 0;

  const frete = useMemo(() => {
    if (!freteCalculado) return 0;

    if (subtotal >= 250) {
      return 0;
    }

    return 19.9;
  }, [freteCalculado, subtotal]);

  const total = subtotal - desconto + frete;

  const recomendacoes = produtos
    .filter(
      (produto) =>
        !itens.some((item) => item.id === produto.id)
    )
    .slice(0, 3);

  function aplicarCupom() {
    const codigo = cupom.trim().toUpperCase();

    if (!codigo) {
      setMensagemCupom("Digite um cupom.");
      setCupomAplicado(false);
      return;
    }

    if (codigo === "LUMEA10") {
      setCupomAplicado(true);
      setMensagemCupom("Cupom aplicado: 10% de desconto.");
      return;
    }

    setCupomAplicado(false);
    setMensagemCupom("Cupom inválido.");
  }

  function calcularFrete() {
    if (cep.replace(/\D/g, "").length !== 8) {
      setFreteCalculado(false);
      return;
    }

    setFreteCalculado(true);
  }

  function formatarPreco(valor: number) {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
  }

  if (itens.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf8f5]">
        <section className="border-b border-[#e7dfd5]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
            <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.3em] text-[#8c7355]">
              LUMÉA
            </span>

            <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-6xl text-[#1f1d1a]">
              Seu carrinho
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-10">
          <p className="font-[family-name:var(--font-cormorant)] text-4xl text-[#5f5042]">
            Seu carrinho está vazio.
          </p>

          <p className="mx-auto mt-4 max-w-md font-[family-name:var(--font-montserrat)] text-xs leading-6 text-[#756f69]">
            Descubra nossa coleção e encontre peças para acompanhar
            momentos especiais.
          </p>

          <Link
            href="/produtos"
            className="mt-8 inline-flex bg-[#1f1d1a] px-7 py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355]"
          >
            Continuar comprando
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      {/* Cabeçalho */}
      <section className="border-b border-[#e7dfd5]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
          <Link
            href="/produtos"
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

            Continuar comprando
          </Link>

          <div className="mt-10 flex items-center gap-4">
            <span className="h-px w-10 bg-[#b69a74]" />

            <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.3em] text-[#8c7355]">
              LUMÉA
            </span>
          </div>

          <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-6xl text-[#1f1d1a]">
            Seu carrinho
          </h1>
        </div>
      </section>

      {/* Conteúdo */}
      <section>
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 sm:px-10 lg:grid-cols-[1fr_380px] lg:px-12 lg:py-16">
          {/* Produtos */}
          <div>
            <div className="mb-6 flex items-center justify-between border-b border-[#e7dfd5] pb-5">
              <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.18em] text-[#756f69]">
                {itens.length}{" "}
                {itens.length === 1 ? "item" : "itens"}
              </span>

              <button
                type="button"
                onClick={limparCarrinho}
                className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.16em] text-[#8c7355] underline underline-offset-4"
              >
                Limpar carrinho
              </button>
            </div>

            <div className="space-y-6">
              {itens.map((item) => (
                <article
                  key={item.id}
                  className="grid grid-cols-[100px_1fr] gap-5 border-b border-[#e7dfd5] pb-6 sm:grid-cols-[130px_1fr]"
                >
                  {/* Imagem */}
                  <Link
                    href={`/produtos/${item.id}`}
                    className="relative aspect-[4/5] overflow-hidden bg-[#eee5db]"
                  >
                    <div className="absolute inset-3 border border-[#c9b59d]/40" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c9b59d]/50 sm:h-20 sm:w-20">
                        <span className="font-[family-name:var(--font-cormorant)] text-3xl italic text-[#8c7355]/60 sm:text-4xl">
                          L
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Informações */}
                  <div className="flex min-w-0 flex-col justify-between">
                    <div>
                      <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.18em] text-[#8c7355]">
                        {item.categoria}
                      </p>

                      <Link href={`/produtos/${item.id}`}>
                        <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a] transition hover:text-[#8c7355]">
                          {item.nome}
                        </h2>
                      </Link>

                      <p className="mt-2 font-[family-name:var(--font-montserrat)] text-xs text-[#756f69]">
                        {formatarPreco(item.preco)} cada
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                      {/* Quantidade */}
                      <div className="flex h-10 border border-[#d8c7b0]">
                        <button
                          type="button"
                          onClick={() =>
                            alterarQuantidade(
                              item.id,
                              item.quantidade - 1
                            )
                          }
                          className="w-9 text-lg text-[#756f69] transition hover:text-[#8c7355]"
                        >
                          −
                        </button>

                        <span className="flex w-9 items-center justify-center font-[family-name:var(--font-montserrat)] text-xs">
                          {item.quantidade}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            alterarQuantidade(
                              item.id,
                              item.quantidade + 1
                            )
                          }
                          className="w-9 text-lg text-[#756f69] transition hover:text-[#8c7355]"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-[family-name:var(--font-montserrat)] text-sm text-[#5f5042]">
                        {formatarPreco(
                          item.preco * item.quantidade
                        )}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removerDoCarrinho(item.id)}
                      className="mt-4 self-start font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.15em] text-[#9a928b] transition hover:text-[#8c7355]"
                    >
                      Remover
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Resumo */}
          <aside className="h-fit border border-[#e7dfd5] bg-white p-6 sm:p-8">
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-[#1f1d1a]">
              Resumo do pedido
            </h2>

            {/* Cupom */}
            <div className="mt-8 border-b border-[#e7dfd5] pb-7">
              <label
                htmlFor="cupom"
                className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.18em] text-[#756f69]"
              >
                Cupom de desconto
              </label>

              <div className="mt-3 flex border border-[#d8c7b0]">
                <input
                  id="cupom"
                  type="text"
                  value={cupom}
                  onChange={(event) =>
                    setCupom(event.target.value)
                  }
                  placeholder="Digite seu cupom"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 font-[family-name:var(--font-montserrat)] text-[10px] uppercase outline-none placeholder:normal-case placeholder:text-[#aaa29a]"
                />

                <button
                  type="button"
                  onClick={aplicarCupom}
                  className="px-4 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.12em] text-[#8c7355] transition hover:text-[#1f1d1a]"
                >
                  Aplicar
                </button>
              </div>

              {mensagemCupom && (
                <p className="mt-3 font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69]">
                  {mensagemCupom}
                </p>
              )}

              <p className="mt-3 font-[family-name:var(--font-montserrat)] text-[9px] text-[#aaa29a]">
                Cupom de demonstração: LUMEA10
              </p>
            </div>

            {/* Frete */}
            <div className="border-b border-[#e7dfd5] py-7">
              <label
                htmlFor="cep"
                className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.18em] text-[#756f69]"
              >
                Calcular entrega
              </label>

              <div className="mt-3 flex border border-[#d8c7b0]">
                <input
                  id="cep"
                  type="text"
                  inputMode="numeric"
                  maxLength={9}
                  value={cep}
                  onChange={(event) =>
                    setCep(event.target.value)
                  }
                  placeholder="CEP"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 font-[family-name:var(--font-montserrat)] text-xs outline-none placeholder:text-[#aaa29a]"
                />

                <button
                  type="button"
                  onClick={calcularFrete}
                  className="px-4 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.12em] text-[#8c7355] transition hover:text-[#1f1d1a]"
                >
                  Calcular
                </button>
              </div>

              {freteCalculado && (
                <p className="mt-3 font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69]">
                  {frete === 0
                    ? "Frete grátis para este pedido."
                    : "Entrega padrão disponível."}
                </p>
              )}

              <p className="mt-3 font-[family-name:var(--font-montserrat)] text-[9px] leading-5 text-[#aaa29a]">
                Frete grátis em pedidos a partir de R$ 250,00.
              </p>
            </div>

            {/* Valores */}
            <div className="space-y-4 py-7">
              <div className="flex justify-between gap-4">
                <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#756f69]">
                  Subtotal
                </span>

                <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#5f5042]">
                  {formatarPreco(subtotal)}
                </span>
              </div>

              {cupomAplicado && (
                <div className="flex justify-between gap-4">
                  <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#756f69]">
                    Desconto
                  </span>

                  <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#8c7355]">
                    − {formatarPreco(desconto)}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#756f69]">
                  Frete
                </span>

                <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#5f5042]">
                  {!freteCalculado
                    ? "A calcular"
                    : frete === 0
                      ? "Grátis"
                      : formatarPreco(frete)}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-t border-[#e7dfd5] pt-5">
                <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.16em] text-[#5f5042]">
                  Total
                </span>

                <span className="font-[family-name:var(--font-montserrat)] text-base font-medium text-[#1f1d1a]">
                  {formatarPreco(total)}
                </span>
              </div>
            </div>

            {/* Checkout */}
            <Link
              href="/checkout"
              className="flex w-full items-center justify-center bg-[#1f1d1a] px-6 py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355]"
            >
              Continuar para checkout
            </Link>
          </aside>
        </div>
      </section>

      {/* Recomendações */}
      {recomendacoes.length > 0 && (
        <section className="border-t border-[#e7dfd5]">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
            <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.3em] text-[#8c7355]">
              LUMÉA
            </span>

            <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl text-[#1f1d1a] sm:text-5xl">
              Complete sua escolha
            </h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recomendacoes.map((produto) => (
                <Link
                  key={produto.id}
                  href={`/produtos/${produto.id}`}
                  className="group"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#eee5db]">
                    <div className="absolute inset-5 border border-[#c9b59d]/40" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-32 w-32 items-center justify-center rounded-full border border-[#c9b59d]/50 transition duration-500 group-hover:scale-105">
                        <span className="font-[family-name:var(--font-cormorant)] text-5xl italic text-[#8c7355]/60">
                          L
                        </span>
                      </div>
                    </div>

                    <span className="absolute left-6 top-6 font-[family-name:var(--font-montserrat)] text-[9px] tracking-[0.2em] text-[#8c7355]">
                      LUMÉA
                    </span>
                  </div>

                  <div className="pt-5">
                    <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#8c7355]">
                      {produto.categoria}
                    </p>

                    <h3 className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a] transition group-hover:text-[#8c7355]">
                      {produto.nome}
                    </h3>

                    <span className="mt-2 block font-[family-name:var(--font-montserrat)] text-xs text-[#5f5042]">
                      {formatarPreco(
                        produto.oferta &&
                          produto.precoOferta !== undefined
                          ? produto.precoOferta
                          : produto.preco
                      )}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}