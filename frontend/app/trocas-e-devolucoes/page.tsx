import Link from "next/link";

export default function TrocasDevolucoesPage() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#1f1d1a]">
      {/* Cabeçalho */}
      <section className="border-b border-[#e7dfd5]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#b69a74]" />

              <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.35em] text-[#8c7355]">
                Trocas e Devoluções
              </span>
            </div>

            <h1 className="mt-7 font-[family-name:var(--font-cormorant)] text-6xl font-medium leading-[0.95] tracking-[-0.02em] sm:text-7xl lg:text-8xl">
              Cuidado também
              <br />
              depois da compra.
            </h1>

            <p className="mt-8 max-w-2xl font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
              Conheça as orientações gerais para solicitações de troca,
              devolução e atendimento relacionadas aos pedidos realizados
              na LUMÉA.
            </p>

            <p className="mt-5 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.18em] text-[#9a928b]">
              Última atualização: setembro de 2026
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="border-b border-[#e7dfd5] bg-[#f3eee8]">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10 lg:px-12 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
            {/* Índice */}
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.25em] text-[#8c7355]">
                Neste documento
              </span>

              <nav className="mt-5 flex flex-col gap-3">
                <a
                  href="#trocas"
                  className="font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69] transition hover:text-[#8c7355]"
                >
                  Trocas
                </a>

                <a
                  href="#devolucoes"
                  className="font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69] transition hover:text-[#8c7355]"
                >
                  Devoluções
                </a>

                <a
                  href="#produto"
                  className="font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69] transition hover:text-[#8c7355]"
                >
                  Condições do produto
                </a>

                <a
                  href="#avaria"
                  className="font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69] transition hover:text-[#8c7355]"
                >
                  Produto com problema
                </a>

                <a
                  href="#solicitacao"
                  className="font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69] transition hover:text-[#8c7355]"
                >
                  Como solicitar
                </a>

                <a
                  href="#atendimento"
                  className="font-[family-name:var(--font-montserrat)] text-[10px] text-[#756f69] transition hover:text-[#8c7355]"
                >
                  Atendimento
                </a>
              </nav>
            </aside>

            {/* Texto */}
            <div className="space-y-12">
              {/* 01 - Trocas */}
              <section id="trocas">
                <span className="font-[family-name:var(--font-montserrat)] text-[9px] tracking-[0.25em] text-[#8c7355]">
                  01
                </span>

                <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-medium sm:text-5xl">
                  Trocas
                </h2>

                <p className="mt-5 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                  Solicitações de troca deverão ser realizadas pelos canais
                  de atendimento disponibilizados pela LUMÉA, observando as
                  condições aplicáveis ao pedido e os direitos previstos na
                  legislação de consumo.
                </p>

                <p className="mt-5 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                  A análise da solicitação poderá considerar o motivo
                  informado, as condições do produto e as informações
                  relacionadas ao pedido original.
                </p>
              </section>

              {/* 02 - Devoluções */}
              <section
                id="devolucoes"
                className="border-t border-[#d8c7b0] pt-12"
              >
                <span className="font-[family-name:var(--font-montserrat)] text-[9px] tracking-[0.25em] text-[#8c7355]">
                  02
                </span>

                <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-medium sm:text-5xl">
                  Devoluções
                </h2>

                <p className="mt-5 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                  O cliente poderá solicitar a devolução de um pedido
                  conforme as condições aplicáveis à compra e os direitos
                  previstos na legislação de consumo.
                </p>

                <p className="mt-5 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                  Após o recebimento da solicitação, a LUMÉA informará as
                  orientações necessárias para o procedimento, incluindo as
                  instruções relacionadas ao envio do produto, quando
                  aplicável.
                </p>
              </section>

              {/* 03 - Condições do produto */}
              <section
                id="produto"
                className="border-t border-[#d8c7b0] pt-12"
              >
                <span className="font-[family-name:var(--font-montserrat)] text-[9px] tracking-[0.25em] text-[#8c7355]">
                  03
                </span>

                <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-medium sm:text-5xl">
                  Condições do produto
                </h2>

                <p className="mt-5 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                  Sempre que aplicável, o produto deverá ser devolvido
                  conforme as orientações fornecidas pela LUMÉA, acompanhado
                  dos itens e acessórios relacionados ao pedido.
                </p>

                <p className="mt-5 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                  Os produtos recebidos poderão ser avaliados de acordo com
                  o motivo informado na solicitação e com as condições
                  previstas para o respectivo procedimento.
                </p>
              </section>

              {/* 04 - Produto com problema */}
              <section
                id="avaria"
                className="border-t border-[#d8c7b0] pt-12"
              >
                <span className="font-[family-name:var(--font-montserrat)] text-[9px] tracking-[0.25em] text-[#8c7355]">
                  04
                </span>

                <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-medium sm:text-5xl">
                  Produto com problema
                </h2>

                <p className="mt-5 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                  Caso você receba um produto com algum problema ou
                  identifique uma situação que precise de análise, entre em
                  contato com a LUMÉA assim que possível.
                </p>

                <p className="mt-5 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                  Para facilitar o atendimento, poderão ser solicitadas
                  informações sobre o pedido e registros que auxiliem na
                  compreensão e análise da situação.
                </p>
              </section>

              {/* 05 - Como solicitar */}
              <section
                id="solicitacao"
                className="border-t border-[#d8c7b0] pt-12"
              >
                <span className="font-[family-name:var(--font-montserrat)] text-[9px] tracking-[0.25em] text-[#8c7355]">
                  05
                </span>

                <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-medium sm:text-5xl">
                  Como solicitar
                </h2>

                <div className="mt-7 space-y-5">
                  <div className="flex gap-5">
                    <span className="font-[family-name:var(--font-cormorant)] text-2xl text-[#8c7355]">
                      01
                    </span>

                    <p className="pt-1 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                      Entre em contato com a LUMÉA informando o número do
                      pedido e o motivo da solicitação.
                    </p>
                  </div>

                  <div className="flex gap-5 border-t border-[#d8c7b0] pt-5">
                    <span className="font-[family-name:var(--font-cormorant)] text-2xl text-[#8c7355]">
                      02
                    </span>

                    <p className="pt-1 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                      Aguarde as orientações do atendimento sobre os próximos
                      passos.
                    </p>
                  </div>

                  <div className="flex gap-5 border-t border-[#d8c7b0] pt-5">
                    <span className="font-[family-name:var(--font-cormorant)] text-2xl text-[#8c7355]">
                      03
                    </span>

                    <p className="pt-1 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                      Siga as instruções recebidas para conclusão da análise
                      e do procedimento correspondente.
                    </p>
                  </div>
                </div>
              </section>

              {/* 06 - Atendimento */}
              <section
                id="atendimento"
                className="border-t border-[#d8c7b0] pt-12"
              >
                <span className="font-[family-name:var(--font-montserrat)] text-[9px] tracking-[0.25em] text-[#8c7355]">
                  06
                </span>

                <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-medium sm:text-5xl">
                  Atendimento
                </h2>

                <p className="mt-5 font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                  Em caso de dúvidas sobre trocas, devoluções ou qualquer
                  situação relacionada ao seu pedido, entre em contato com a
                  equipe da LUMÉA.
                </p>

                <Link
                  href="/contato"
                  className="mt-7 inline-flex items-center gap-4 border-b border-[#8c7355] pb-2 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#5f5042] transition hover:text-[#8c7355]"
                >
                  Falar com a LUMÉA
                  <span>→</span>
                </Link>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* Chamada final */}
      <section className="bg-[#1f1d1a]">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:px-10 lg:px-12 lg:py-20">
          <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.3em] text-[#b69a74]">
            LUMÉA
          </span>

          <h2 className="mx-auto mt-5 max-w-2xl font-[family-name:var(--font-cormorant)] text-4xl font-medium leading-[1] text-[#faf8f5] sm:text-5xl">
            Cuidado e atenção em todos os momentos da sua compra.
          </h2>

          <Link
            href="/produtos"
            className="mt-8 inline-flex items-center justify-center border border-[#8c7355] px-7 py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-[#faf8f5] transition hover:bg-[#8c7355]"
          >
            Conhecer a coleção
          </Link>
        </div>
      </section>
    </main>
  );
}