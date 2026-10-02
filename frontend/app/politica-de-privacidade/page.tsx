import Link from "next/link";

export default function PoliticaDePrivacidadePage() {
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
            Política de Privacidade
          </h1>

          <div className="mt-6 h-px w-12 bg-[#b69a74]" />

          <p className="mt-6 max-w-2xl font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#756f69] sm:text-sm sm:leading-8">
            A LUMÉA valoriza a privacidade, a transparência e o cuidado
            com as informações utilizadas durante sua experiência em nosso
            site.
          </p>

          <p className="mt-4 font-[family-name:var(--font-montserrat)] text-[10px] uppercase tracking-[0.12em] text-[#8f8780] sm:text-[11px]">
            Última atualização: 2026
          </p>
        </div>

        {/* =====================================================
            CONTEÚDO DA POLÍTICA
        ====================================================== */}
        <div className="space-y-12 sm:space-y-14">
          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              1. Compromisso com a privacidade
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              A LUMÉA busca proporcionar uma experiência de compra clara,
              segura e cuidadosa. Esta Política de Privacidade apresenta,
              de forma geral, como as informações fornecidas durante a
              utilização do site podem ser tratadas.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              2. Informações fornecidas pelo usuário
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              Durante a utilização da plataforma, poderão ser solicitadas
              informações necessárias para criação de conta, atendimento,
              realização e acompanhamento de pedidos e demais funcionalidades
              disponibilizadas pela LUMÉA.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              3. Utilização das informações
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              As informações poderão ser utilizadas para possibilitar o
              funcionamento da conta do usuário, processar pedidos,
              disponibilizar funcionalidades da plataforma, prestar
              atendimento e melhorar a experiência oferecida pela LUMÉA.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              4. Conta e autenticação
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              Quando o usuário cria uma conta, determinadas informações são
              utilizadas para identificação e autenticação. O acesso à conta
              deve ser realizado utilizando credenciais mantidas sob
              responsabilidade do próprio usuário.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              5. Pedidos e informações relacionadas
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              Informações relacionadas aos pedidos poderão ser armazenadas
              para permitir seu processamento, acompanhamento, consulta do
              histórico e atendimento relacionado à compra.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              6. Segurança das informações
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              A LUMÉA adota medidas técnicas e organizacionais compatíveis
              com a estrutura da plataforma para proteger as informações
              contra acessos não autorizados, alterações indevidas e outros
              riscos relacionados ao tratamento de dados.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              7. Compartilhamento de informações
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              As informações poderão ser compartilhadas quando isso for
              necessário para o funcionamento de serviços relacionados à
              experiência de compra, cumprimento de obrigações legais ou
              atendimento de solicitações legítimas das autoridades
              competentes.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              8. Direitos do usuário
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              O usuário poderá solicitar informações relacionadas aos seus
              dados pessoais e exercer os direitos previstos na legislação
              aplicável, observadas as condições e limitações estabelecidas
              pelas normas vigentes.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium sm:text-3xl">
              9. Alterações desta política
            </h2>

            <p className="mt-4 font-[family-name:var(--font-montserrat)] text-xs leading-7 text-[#5f5953] sm:text-sm sm:leading-8">
              Esta Política de Privacidade poderá ser atualizada sempre que
              necessário para refletir alterações na plataforma, nos
              processos da LUMÉA ou na legislação aplicável. A versão
              disponibilizada no site será a vigente no momento correspondente.
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