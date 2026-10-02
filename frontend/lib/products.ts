export type Product = {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  descricao: string;
  detalhes: string[];
  disponibilidade: string;

  // Recursos comerciais do catálogo
  novo?: boolean;
  oferta?: boolean;
  precoOferta?: number;
};

export const produtos: Product[] = [
  {
    id: 1,
    nome: "Elegance Drop",
    categoria: "Brincos",
    preco: 129.9,
    descricao:
      "Uma peça delicada e sofisticada, criada para trazer elegância aos pequenos detalhes.",
    detalhes: [
      "Design elegante e atemporal",
      "Acabamento cuidadosamente selecionado",
      "Ideal para ocasiões especiais ou uso diário",
    ],
    disponibilidade: "Em estoque",
    novo: true,
  },

  {
    id: 2,
    nome: "Lumière",
    categoria: "Colares",
    preco: 159.9,
    descricao:
      "Um colar delicado que combina sofisticação e versatilidade para diferentes momentos.",
    detalhes: [
      "Design clássico",
      "Acabamento sofisticado",
      "Peça versátil",
    ],
    disponibilidade: "Em estoque",
    novo: true,
  },

  {
    id: 3,
    nome: "Essence",
    categoria: "Pulseiras",
    preco: 139.9,
    descricao:
      "Uma pulseira elegante pensada para complementar produções com delicadeza.",
    detalhes: [
      "Design delicado",
      "Estilo atemporal",
      "Ideal para composição",
    ],
    disponibilidade: "Em estoque",
    oferta: true,
    precoOferta: 119.9,
  },

  {
    id: 4,
    nome: "Éclat",
    categoria: "Brincos",
    preco: 119.9,
    descricao:
      "Uma peça sofisticada para quem aprecia detalhes discretos e elegantes.",
    detalhes: [
      "Design contemporâneo",
      "Acabamento refinado",
      "Leve e versátil",
    ],
    disponibilidade: "Em estoque",
  },

  {
    id: 5,
    nome: "Pure Lumière",
    categoria: "Colares",
    preco: 179.9,
    descricao:
      "Elegância minimalista em uma peça criada para acompanhar diferentes ocasiões.",
    detalhes: [
      "Design minimalista",
      "Estilo sofisticado",
      "Uso versátil",
    ],
    disponibilidade: "Em estoque",
    novo: true,
  },

  {
    id: 6,
    nome: "Étoile",
    categoria: "Pulseiras",
    preco: 149.9,
    descricao:
      "Uma pulseira inspirada na delicadeza e no brilho dos pequenos detalhes.",
    detalhes: [
      "Design elegante",
      "Acabamento refinado",
      "Peça versátil",
    ],
    disponibilidade: "Em estoque",
    oferta: true,
    precoOferta: 129.9,
  },

  {
    id: 7,
    nome: "Belle",
    categoria: "Brincos",
    preco: 109.9,
    descricao:
      "Uma escolha delicada para completar o visual com personalidade.",
    detalhes: [
      "Design clássico",
      "Visual delicado",
      "Ideal para o dia a dia",
    ],
    disponibilidade: "Em estoque",
  },

  {
    id: 8,
    nome: "Élégance",
    categoria: "Colares",
    preco: 189.9,
    descricao:
      "Uma peça marcante que traduz a proposta elegante e atemporal da LUMÉA.",
    detalhes: [
      "Design sofisticado",
      "Acabamento cuidadosamente selecionado",
      "Ideal para ocasiões especiais",
    ],
    disponibilidade: "Em estoque",
    oferta: true,
    precoOferta: 169.9,
  },
];