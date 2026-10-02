import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categorias from "@/components/Categorias";
import Colecao from "@/components/Colecao";
import ProdutosDestaque from "@/components/ProdutosDestaque";
import Beneficios from "@/components/Beneficios";
import ExperienciaLumea from "@/components/ExperienciaLumea";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Categorias />
        <Colecao />
        <ProdutosDestaque />
        <Beneficios />
        <ExperienciaLumea />
      </main>

      <Footer />
    </>
  );
}