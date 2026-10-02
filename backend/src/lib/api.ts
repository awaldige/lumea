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
    url.searchParams.set("categoria", parametros.categoria);
  }

  if (parametros?.colecao) {
    url.searchParams.set("colecao", parametros.colecao);
  }

  if (parametros?.busca) {
    url.searchParams.set("busca", parametros.busca);
  }

  if (parametros?.ordenacao) {
    url.searchParams.set("ordenacao", parametros.ordenacao);
  }

  const resposta = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new Error(
      `Não foi possível carregar os produtos. Status: ${resposta.status}`
    );
  }

  return resposta.json();
}

export async function buscarProduto(
  id: number
): Promise<ApiProduto> {
  const resposta = await fetch(`${API_URL}/api/produtos/${id}`, {
    cache: "no-store",
  });

  if (!resposta.ok) {
    if (resposta.status === 404) {
      throw new Error("Produto não encontrado.");
    }

    throw new Error(
      `Não foi possível carregar o produto. Status: ${resposta.status}`
    );
  }

  return resposta.json();
}

export async function buscarCategorias(): Promise<ApiCategoria[]> {
  const resposta = await fetch(`${API_URL}/api/categorias`, {
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new Error(
      `Não foi possível carregar as categorias. Status: ${resposta.status}`
    );
  }

  return resposta.json();
}

export async function buscarColecoes(): Promise<ApiColecao[]> {
  const resposta = await fetch(`${API_URL}/api/colecoes`, {
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new Error(
      `Não foi possível carregar as coleções. Status: ${resposta.status}`
    );
  }

  return resposta.json();
}

export async function buscarColecao(
  slug: string
): Promise<ApiColecao> {
  const resposta = await fetch(
    `${API_URL}/api/colecoes/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  if (!resposta.ok) {
    if (resposta.status === 404) {
      throw new Error("Coleção não encontrada.");
    }

    throw new Error(
      `Não foi possível carregar a coleção. Status: ${resposta.status}`
    );
  }

  return resposta.json();
}