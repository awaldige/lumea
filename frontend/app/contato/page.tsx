import Link from "next/link";

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#1f1d1a]">
      {/* Cabeçalho */}
      <section className="border-b border-[#e7dfd5]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#b69a74]" />

              <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.35em] text-[#8c7355]">
                Contato
              </span>
            </div>

            <h1 className="mt-7 font-[family-name:var(--font-cormorant)] text-6xl font-medium leading-[0.95] tracking-[-0.02em] sm:text-7xl lg:text-8xl">
              Estamos aqui
              <br />
              para você.
            </h1>

            <p className="mt-8 max-w-2xl font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
              Tem alguma dúvida sobre nossas peças, pedidos ou sobre a
              experiência LUMÉA? Envie uma mensagem. Será um prazer
              conversar com você.
            </p>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="border-b border-[#e7dfd5] bg-[#f3eee8]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          {/* Informações */}
          <div className="relative overflow-hidden bg-[#e9dfd4] px-8 py-16 sm:px-12 sm:py-20 lg:min-h-[700px] lg:px-16 lg:py-24">
            <div className="absolute inset-8 border border-[#c9b59d]/50 sm:inset-12" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center gap-4">
                  <span className="h-px w-10 bg-[#b69a74]" />

                  <span className="font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.3em] text-[#8c7355]">
                    Atendimento LUMÉA
                  </span>
                </div>

                <h2 className="mt-6 max-w-md font-[family-name:var(--font-cormorant)] text-5xl font-medium leading-[1] sm:text-6xl">
                  Cada conversa
                  <span className="block italic font-normal">
                    importa.
                  </span>
                </h2>

                <p className="mt-8 max-w-md font-[family-name:var(--font-montserrat)] text-sm leading-7 text-[#756f69]">
                  Nosso atendimento foi pensado para oferecer uma
                  experiência próxima e cuidadosa, assim como cada
                  detalhe das nossas peças.
                </p>
              </div>

              <div className="mt-16 space-y-8">
                <div className="border-t border-[#c9b59d] pt-5">
                  <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.25em] text-[#8c7355]">
                    Atendimento
                  </span>

                  <p className="mt-3 font-[family-name:var(--font-cormorant)] text-2xl text-[#1f1d1a]">
                    Fale conosco
                  </p>

                  <p className="mt-2 font-[family-name:var(--font-montserrat)] text-xs leading-6 text-[#756f69]">
                    Envie sua mensagem pelo formulário e entraremos
                    em contato.
                  </p>
                </div>

                <div className="border-t border-[#c9b59d] pt-5">
                  <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.25em] text-[#8c7355]">
                    LUMÉA
                  </span>

                  <p className="mt-3 font-[family-name:var(--font-cormorant)] text-2xl italic text-[#5f5042]">
                    Peças artesanais
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="flex items-center bg-[#faf8f5] px-8 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24 xl:px-20">
            <div className="w-full max-w-xl">
              <div className="mb-10">
                <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.25em] text-[#8c7355]">
                  Envie uma mensagem
                </span>

                <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl font-medium text-[#1f1d1a] sm:text-5xl">
                  Como podemos ajudar?
                </h2>
              </div>

              <form className="space-y-7">
                {/* Nome */}
                <div>
                  <label
                    htmlFor="nome"
                    className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#756f69]"
                  >
                    Nome
                  </label>

                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Seu nome"
                    className="mt-3 w-full border-b border-[#d8c7b0] bg-transparent px-0 py-3 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa29a] focus:border-[#8c7355]"
                  />
                </div>

                {/* E-mail */}
                <div>
                  <label
                    htmlFor="email"
                    className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#756f69]"
                  >
                    E-mail
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="seu@email.com"
                    className="mt-3 w-full border-b border-[#d8c7b0] bg-transparent px-0 py-3 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa29a] focus:border-[#8c7355]"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label
                    htmlFor="telefone"
                    className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#756f69]"
                  >
                    Telefone
                  </label>

                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Seu telefone"
                    className="mt-3 w-full border-b border-[#d8c7b0] bg-transparent px-0 py-3 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition placeholder:text-[#aaa29a] focus:border-[#8c7355]"
                  />
                </div>

                {/* Assunto */}
                <div>
                  <label
                    htmlFor="assunto"
                    className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#756f69]"
                  >
                    Assunto
                  </label>

                  <select
                    id="assunto"
                    name="assunto"
                    defaultValue=""
                    required
                    className="mt-3 w-full border-b border-[#d8c7b0] bg-transparent px-0 py-3 font-[family-name:var(--font-montserrat)] text-sm text-[#1f1d1a] outline-none transition focus:border-[#8c7355]"
                  >
                    <option value="" disabled>
                      Selecione um assunto
                    </option>

                    <option value="produto">
                      Dúvida sobre produto
                    </option>

                    <option value="pedido">
                      Meu pedido
                    </option>

                    <option value="troca">
                      Trocas e devoluções
                    </option>

                    <option value="pagamento">
                      Pagamento
                    </option>

                    <option value="outro">
                      Outro assunto
                    </option>
                  </select>
                </div>

                {/* Mensagem */}
                <div>
                  <label
                    htmlFor="mensagem"
                    className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#756f69]"
                  >
                    Mensagem
                  </label>

                  <textarea
                    id="mensagem"
                    name="mensagem"
                    rows={5}
                    required
                    placeholder="Escreva sua mensagem..."
                    className="mt-3 w-full resize-none border-b border-[#d8c7b0] bg-transparent px-0 py-3 font-[family-name:var(--font-montserrat)] text-sm leading-6 text-[#1f1d1a] outline-none transition placeholder:text-[#aaa29a] focus:border-[#8c7355]"
                  />
                </div>

                {/* Botão */}
                <div className="pt-3">
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center bg-[#1f1d1a] px-7 py-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#8c7355] sm:w-auto"
                  >
                    Enviar mensagem
                  </button>
                </div>

                <p className="font-[family-name:var(--font-montserrat)] text-[9px] leading-5 text-[#9a928b]">
                  O formulário está preparado para integração com o
                  sistema de atendimento da LUMÉA.
                </p>
              </form>
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
            Cuidado em cada detalhe, da escolha ao atendimento.
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