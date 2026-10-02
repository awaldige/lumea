import Link from "next/link";

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#1f1d1a]">
      {/* =====================================================
          CABEÇALHO
      ====================================================== */}
      <header className="border-b border-[#e7dfd5] bg-[#faf8f5]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 sm:px-8 sm:py-8">
          <Link
            href="/"
            className="font-[family-name:var(--font-cormorant)] text-3xl font-medium tracking-[0.18em] text-[#1f1d1a] transition-colors duration-300 hover:text-[#8c7355] sm:text-4xl"
          >
            LUMÉA
          </Link>

          <Link
            href="/"
            className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.16em] text-[#756f69] transition-colors duration-300 hover:text-[#8c7355] sm:text-[10px]"
          >
            Voltar ao início
          </Link>
        </div>
      </header>

      {/* =====================================================
          CONTEÚDO
      ====================================================== */}
      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
        {/* Introdução */}
        <div className="mb-14 border-b border-[#e7dfd5] pb-10 sm:mb-16 sm:pb-12">
          <span className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.24em] text-[#8c7355] sm:text-[10px]">
            Institucional
          </span>

          <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-medium leading-tight text-[#1f1d1a] sm:text-5xl lg:text-6xl">
            Termos de Uso
          </h1>

          <div className="mt-6 h-px w-12 bg-[#b69a74]" />

          <p className="mt-6 max-w-2xl font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#756f69] sm:text-sm sm:leading-8">
            Estes termos estabelecem as condições gerais de utilização do
            site e dos serviços disponibilizados pela LUMÉA.
          </p>

          <p className="mt-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.12em] text-[#8f8780] sm:text-[11px]">
            Última atualização: 2026
          </p>
        </div>

        {/* =====================================================
            CONTEÚDO DOS TERMOS
        ====================================================== */}
        <div className="space-y-12 sm:space-y-14">
          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              1. Sobre estes termos
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              Ao acessar e utilizar o site da LUMÉA, o usuário declara estar
              ciente das condições apresentadas nesta página. A utilização
              da plataforma deve ocorrer de acordo com estes termos e com a
              legislação aplicável.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              2. Utilização do site
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              O site da LUMÉA disponibiliza informações sobre produtos,
              categorias, coleções e funcionalidades relacionadas à
              experiência de compra. O usuário deve utilizar a plataforma
              de forma adequada, respeitando a legislação e os direitos de
              terceiros.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              3. Produtos e informações
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              A LUMÉA busca apresentar informações claras sobre seus produtos,
              incluindo descrições, imagens, preços e disponibilidade.
              Características, disponibilidade e informações comerciais podem
              ser atualizadas a qualquer momento.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              4. Cadastro e conta
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              Algumas funcionalidades podem exigir a criação de uma conta.
              O usuário é responsável pelas informações fornecidas no
              cadastro e pela utilização adequada de suas credenciais de
              acesso.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              5. Pedidos e compras
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              Os pedidos realizados através da plataforma estão sujeitos à
              disponibilidade dos produtos e às condições apresentadas no
              momento da compra. As informações do pedido poderão ser
              disponibilizadas ao usuário para acompanhamento através de sua
              conta.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              6. Preços e disponibilidade
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              Os preços, condições promocionais e disponibilidade dos
              produtos podem ser alterados pela LUMÉA. As condições
              apresentadas durante o processo de compra serão consideradas
              para o respectivo pedido, observadas as condições aplicáveis.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              7. Cupons e benefícios
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              Cupons e condições promocionais, quando disponibilizados,
              poderão possuir regras específicas de validade, utilização,
              valor mínimo, limite de uso ou outras condições informadas no
              momento de sua disponibilização.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              8. Propriedade intelectual
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              Elementos presentes no site, incluindo identidade visual,
              textos, imagens, logotipo, elementos gráficos e demais
              conteúdos disponibilizados pela LUMÉA, não devem ser
              reproduzidos ou utilizados de forma indevida sem autorização,
              quando protegidos pela legislação aplicável.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              9. Disponibilidade da plataforma
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              A LUMÉA busca manter o site disponível e funcionando
              adequadamente, mas determinadas funcionalidades poderão sofrer
              interrupções temporárias decorrentes de manutenção, atualizações
              ou fatores técnicos.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              10. Alterações dos termos
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              Estes termos poderão ser atualizados sempre que necessário para
              refletir alterações na plataforma, nos serviços oferecidos ou
              na legislação aplicável. A versão disponibilizada no site será
              a vigente no momento correspondente.
            </p>
          </section>
        </div>

        {/* =====================================================
            ENCERRAMENTO
        ====================================================== */}
        <div className="mt-16 border-t border-[#e7dfd5] pt-10 text-center sm:mt-20 sm:pt-12">
          <p className="font-[family-name:var(--font-cormorant)] text-3xl font-medium tracking-[0.12em]">
            LUMÉA
          </p>

          <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg italic text-[#8c7355]">
            Uma experiência pensada com clareza e cuidado.
          </p>

          <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <Link
              href="/produtos"
              className="inline-flex min-h-11 items-center justify-center border border-[#8c7355] px-7 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.18em] text-[#5f5042] transition-all duration-300 hover:bg-[#8c7355] hover:text-white"
            >
              Conhecer a coleção
            </Link>

            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.16em] text-[#756f69] transition-colors duration-300 hover:text-[#8c7355]"
            >
              ↑ Voltar ao início
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}