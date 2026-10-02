const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type ApiCategoria = {
  id: number;
  nome: string;
  slug: string;
  descricao: string | null;
  ativo: boolean;
};

export type ApiColecao = {
  id: number;
  nome: string;
  slug: string;
  descricao: string | null;
  ativo: boolean;
};

export type ApiProduto = {
  id: number;
  nome: string;
  slug: string;
  descricao: string;
  preco: string | number;
  precoOferta: string | number | null;
  estoque: number;
  ativo: boolean;
  destaque: boolean;
  novo: boolean;
  oferta: boolean;
  imagem: string | null;

  categoriaId: number;
  categoria: ApiCategoria;

  colecaoId: number | null;
  colecao: ApiColecao | null;
};

function obterMensagemErro(
  dados: unknown,
  fallback: string
): string {
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

async function lerJson<T>(resposta: Response): Promise<T> {
  const texto = await resposta.text();

  if (!texto) {
    throw new Error(
      `A API retornou uma resposta vazia. Status: ${resposta.status}`
    );
  }

  try {
    return JSON.parse(texto) as T;
  } catch {
    throw new Error(
      `A API retornou uma resposta inválida. Status: ${resposta.status}`
    );
  }
}

/**
 * Busca produtos com filtros.
 *
 * Filtros suportados pelo backend:
 * - categoria
 * - colecao
 * - busca
 * - ordenacao
 *
 * Novidades e ofertas são filtradas no catálogo
 * porque atualmente são propriedades do produto:
 * novo / oferta.
 */
export async function buscarProdutos(
  parametros?: {
    categoria?: string;
    colecao?: string;
    busca?: string;
    ordenacao?: string;
  }
): Promise<ApiProduto[]> {
  const url = new URL(`${API_URL}/api/produtos`);

  if (parametros?.categoria) {
    url.searchParams.set(
      "categoria",
      parametros.categoria
    );
  }

  if (parametros?.colecao) {
    url.searchParams.set(
      "colecao",
      parametros.colecao
    );
  }

  if (parametros?.busca) {
    url.searchParams.set(
      "busca",
      parametros.busca
    );
  }

  if (parametros?.ordenacao) {
    url.searchParams.set(
      "ordenacao",
      parametros.ordenacao
    );
  }

  const resposta = await fetch(url.toString(), {
    cache: "no-store",
  });

  const dados = await lerJson<unknown>(resposta);

  if (!resposta.ok) {
    throw new Error(
      obterMensagemErro(
        dados,
        `Não foi possível carregar os produtos. Status: ${resposta.status}`
      )
    );
  }

  if (Array.isArray(dados)) {
    return dados as ApiProduto[];
  }

  if (
    typeof dados === "object" &&
    dados !== null &&
    "produtos" in dados &&
    Array.isArray(dados.produtos)
  ) {
    return dados.produtos as ApiProduto[];
  }

  return [];
}

/**
 * Busca um produto pelo ID.
 */
export async function buscarProduto(
  id: number
): Promise<ApiProduto> {
  const resposta = await fetch(
    `${API_URL}/api/produtos/${id}`,
    {
      cache: "no-store",
    }
  );

  const dados = await lerJson<unknown>(resposta);

  if (!resposta.ok) {
    throw new Error(
      obterMensagemErro(
        dados,
        `Não foi possível carregar o produto. Status: ${resposta.status}`
      )
    );
  }

  return dados as ApiProduto;
}

/**
 * Busca categorias ativas.
 */
export async function buscarCategorias(): Promise<
  ApiCategoria[]
> {
  const resposta = await fetch(
    `${API_URL}/api/categorias`,
    {
      cache: "no-store",
    }
  );

  const dados = await lerJson<unknown>(resposta);

  if (!resposta.ok) {
    throw new Error(
      obterMensagemErro(
        dados,
        `Não foi possível carregar as categorias. Status: ${resposta.status}`
      )
    );
  }

  if (Array.isArray(dados)) {
    return dados as ApiCategoria[];
  }

  if (
    typeof dados === "object" &&
    dados !== null &&
    "categorias" in dados &&
    Array.isArray(dados.categorias)
  ) {
    return dados.categorias as ApiCategoria[];
  }

  return [];
}

/**
 * Busca todas as coleções ativas.
 */
export async function buscarColecoes(): Promise<
  ApiColecao[]
> {
  const resposta = await fetch(
    `${API_URL}/api/colecoes`,
    {
      cache: "no-store",
    }
  );

  const dados = await lerJson<unknown>(resposta);

  if (!resposta.ok) {
    throw new Error(
      obterMensagemErro(
        dados,
        `Não foi possível carregar as coleções. Status: ${resposta.status}`
      )
    );
  }

  if (Array.isArray(dados)) {
    return dados as ApiColecao[];
  }

  if (
    typeof dados === "object" &&
    dados !== null &&
    "colecoes" in dados &&
    Array.isArray(dados.colecoes)
  ) {
    return dados.colecoes as ApiColecao[];
  }

  return [];
}

/**
 * Busca uma coleção pelo slug.
 */
export async function buscarColecao(
  slug: string
): Promise<ApiColecao> {
  const resposta = await fetch(
    `${API_URL}/api/colecoes/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  const dados = await lerJson<unknown>(resposta);

  if (!resposta.ok) {
    throw new Error(
      obterMensagemErro(
        dados,
        `Não foi possível carregar a coleção. Status: ${resposta.status}`
      )
    );
  }

  return dados as ApiColecao;
}