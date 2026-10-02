"use client";

import Link from "next/link";
import Image from "next/image";

import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

type ProductCardProps = {
  id: number;
  nome: string;
  categoria: string;
  preco: string;
  precoNumero?: number;
  novo?: boolean;
  oferta?: boolean;
  precoOferta?: number;
  imagem?: string | null;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function obterUrlImagem(imagem?: string | null) {
  if (!imagem) return null;

  if (
    imagem.startsWith("http://") ||
    imagem.startsWith("https://")
  ) {
    return imagem;
  }

  return `${API_URL}${imagem.startsWith("/") ? "" : "/"}${imagem}`;
}

export default function ProductCard({
  id,
  nome,
  categoria,
  preco,
  precoNumero,
  novo = false,
  oferta = false,
  precoOferta,
  imagem,
}: ProductCardProps) {
  const { adicionarAoCarrinho } = useCart();

  const { isFavorito, alternarFavorito } = useFavorites();

  const favorito = isFavorito(id);

  const valorOriginal =
    precoNumero ??
    Number(
      preco
        .replace("R$", "")
        .replace(",", ".")
        .trim()
    );

  const valorFinal =
    oferta && precoOferta !== undefined
      ? precoOferta
      : valorOriginal;

  const urlImagem = obterUrlImagem(imagem);

  function formatarPreco(valor: number) {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
  }

  function handleAdicionarCarrinho() {
    adicionarAoCarrinho({
      id,
      nome,
      categoria,
      preco: valorFinal,
    });
  }

  function handleFavorito(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();
    alternarFavorito(id);
  }

  return (
    <article className="group">
      {/* Imagem */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#eee5db]">
        <Link
          href={`/produtos/${id}`}
          aria-label={`Ver ${nome}`}
          className="absolute inset-0"
        >
          {urlImagem ? (
            <Image
              src={urlImagem}
              alt={nome}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <>
              <div className="absolute inset-5 border border-[#c9b59d]/40" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-36 w-36 items-center justify-center rounded-full border border-[#c9b59d]/50 transition duration-500 group-hover:scale-105">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#c9b59d]/40">
                    <span className="font-[family-name:var(--font-cormorant)] text-5xl italic text-[#8c7355]/60">
                      L
                    </span>
                  </div>
                </div>
              </div>

              <span className="absolute left-6 top-6 font-[family-name:var(--font-montserrat)] text-[9px] tracking-[0.2em] text-[#8c7355]">
                LUMÉA
              </span>
            </>
          )}
        </Link>

        {/* Selo do produto */}
        {(novo || oferta) && (
          <div className="absolute left-5 bottom-5 flex gap-2">
            {oferta && (
              <span className="bg-[#1f1d1a] px-3 py-2 font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.15em] text-white">
                Oferta
              </span>
            )}

            {novo && !oferta && (
              <span className="border border-[#8c7355] bg-[#faf8f5]/95 px-3 py-2 font-[family-name:var(--font-montserrat)] text-[8px] uppercase tracking-[0.15em] text-[#8c7355]">
                Novo
              </span>
            )}
          </div>
        )}

        {/* Favorito */}
        <button
          type="button"
          onClick={handleFavorito}
          aria-label={
            favorito
              ? `Remover ${nome} dos favoritos`
              : `Adicionar ${nome} aos favoritos`
          }
          aria-pressed={favorito}
          className={`absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#faf8f5]/90 backdrop-blur-sm transition ${
            favorito
              ? "text-[#8c7355] opacity-100"
              : "text-[#756f69] opacity-0 group-hover:opacity-100"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={favorito ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" />
          </svg>
        </button>
      </div>

      {/* Informações */}
      <div className="pt-5">
        <p className="font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.2em] text-[#8c7355]">
          {categoria}
        </p>

        <Link href={`/produtos/${id}`}>
          <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl font-medium text-[#1f1d1a] transition hover:text-[#8c7355]">
            {nome}
          </h2>
        </Link>

        <div className="mt-3 flex items-center justify-between gap-3">
          {/* Preço */}
          <div className="flex items-center gap-2">
            {oferta && precoOferta !== undefined ? (
              <>
                <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-[#9a928b] line-through">
                  {formatarPreco(valorOriginal)}
                </span>

                <span className="font-[family-name:var(--font-montserrat)] text-xs font-medium text-[#8c7355]">
                  {formatarPreco(valorFinal)}
                </span>
              </>
            ) : (
              <span className="font-[family-name:var(--font-montserrat)] text-xs text-[#5f5042]">
                {formatarPreco(valorFinal)}
              </span>
            )}
          </div>

          {/* Carrinho */}
          <button
            type="button"
            onClick={handleAdicionarCarrinho}
            className="shrink-0 font-[family-name:var(--font-montserrat)] text-[9px] uppercase tracking-[0.15em] text-[#756f69] transition hover:text-[#8c7355]"
          >
            + Carrinho
          </button>
        </div>
      </div>
    </article>
  );
}