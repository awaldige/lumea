LUMÉA
E-commerce de peças artesanais

A LUMÉA é uma plataforma de e-commerce desenvolvida para apresentar e comercializar peças de fabricação artesanal, valorizando o caráter artesanal, o cuidado com os detalhes e a identidade de cada peça.

O projeto combina uma experiência de compra elegante e responsiva com uma arquitetura Full Stack, composta por frontend, API, banco de dados e painel administrativo.

🌐 Loja online: https://lumea-oficial.vercel.app/

✨ Sobre o projeto

A LUMÉA foi desenvolvida para oferecer uma experiência digital alinhada à identidade de uma marca de peças artesanais.

A plataforma permite:

Navegação pelo catálogo
Organização por categorias
Visualização detalhada dos produtos
Carrinho de compras
Controle de quantidade de produtos
Gerenciamento de clientes
Autenticação de usuários
Área administrativa
Gerenciamento de produtos
Gerenciamento de categorias
Gerenciamento de coleções
Gerenciamento de pedidos
Gerenciamento de cupons
Edição de dados do administrador

A arquitetura foi estruturada separando frontend, backend e banco de dados, facilitando manutenção, evolução e escalabilidade.

🛍️ Funcionalidades
Loja
Catálogo de produtos
Categorias de produtos
Página individual de produto
Carrinho de compras
Adição e remoção de produtos
Controle de quantidade
Cálculo de subtotal
Interface responsiva
Navegação adaptada para dispositivos móveis
Administração
Login administrativo
Autenticação protegida
Dashboard
Gestão de produtos
Cadastro e edição de produtos
Gestão de categorias
Gestão de coleções
Gestão de clientes
Gestão de pedidos
Gestão de cupons
Alteração de senha
Recuperação de senha
Edição de nome, usuário e e-mail do administrador
🎨 Identidade visual

A interface da LUMÉA segue uma proposta clássica, sofisticada e minimalista.

A identidade visual busca transmitir:

Elegância
Sofisticação
Delicadeza
Exclusividade
Leveza
Caráter artesanal
Cuidado com os detalhes
Identidade das peças

A utilização de tons neutros, tipografia elegante e elementos discretos mantém o foco nos produtos e reforça a proposta da marca.

🧩 Arquitetura
LUMÉA
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── uploads/
│   └── ...
│
├── .gitignore
└── README.md
Frontend

Responsável pela interface da loja, navegação, catálogo, páginas de produtos, carrinho e painel administrativo.

Backend

Responsável pela API, autenticação, regras de negócio, gerenciamento dos dados e comunicação com o banco de dados.

Banco de dados

Responsável pela persistência das informações da aplicação utilizando PostgreSQL com Prisma ORM.

🚀 Tecnologias
Frontend
Next.js
React
TypeScript
Tailwind CSS
Next.js App Router
Backend
Node.js
Express
TypeScript
Prisma ORM
PostgreSQL
JWT
bcrypt
Infraestrutura
Git
GitHub
Vercel
Render
Neon
🗄️ Banco de dados

O backend utiliza PostgreSQL com Prisma ORM.

Entre os principais dados gerenciados pela aplicação estão:

Produtos
Categorias
Coleções
Clientes
Usuários administrativos
Pedidos
Cupons

As credenciais e configurações de conexão são mantidas por meio de variáveis de ambiente.

🔐 Segurança

Informações sensíveis não são armazenadas diretamente no código-fonte.

As configurações privadas são mantidas através de variáveis de ambiente, incluindo:

DATABASE_URL
DATABASE_URL_UNPOOLED
JWT_SECRET
FRONTEND_URL
NEXT_PUBLIC_API_URL

Arquivos .env e .env.local não devem ser enviados ao repositório.

📱 Responsividade

A interface foi desenvolvida para oferecer uma experiência consistente em:

Desktop
Notebook
Tablet
Smartphone
💻 Executando localmente
Pré-requisitos
Node.js
npm
PostgreSQL
Git
Clonar o projeto
git clone https://github.com/awaldige/lumea.git
cd lumea
Frontend
cd frontend
npm install
npm run dev

Frontend:

http://localhost:3000
Backend

Em outro terminal:

cd backend
npm install
npm run dev

A API utiliza a porta definida pela variável PORT.

🔄 Fluxo da aplicação
                    ┌───────────────┐
                    │    Cliente    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   Frontend    │
                    │    Next.js    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   API REST    │
                    │    Express    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    Prisma     │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  PostgreSQL   │
                    └───────────────┘
📦 Produtos de demonstração

O projeto possui produtos de demonstração utilizados durante o desenvolvimento da plataforma.

Alguns exemplos:

Elegance Drop
Lumière
Essence
Éclat
Éclat Dourado
Éclat Lumière
Éclat Charm
Naturelle Folha
Naturelle Essencial
Naturelle Charm
Naturelle Botanique

Os produtos, imagens e conteúdos de demonstração podem ser substituídos pelo catálogo definitivo da marca.

📈 Evolução do projeto

A arquitetura foi desenvolvida pensando na evolução contínua da plataforma.

Entre as possibilidades de expansão estão:

Checkout completo
Integração com meios de pagamento
Integração com WhatsApp
Gestão avançada de estoque
Melhorias no gerenciamento de imagens
Integrações com serviços externos
Melhorias na experiência de compra
📊 Status

Projeto funcional e publicado.

A aplicação possui frontend, API, banco de dados e painel administrativo integrados.

A versão atual utiliza produtos e conteúdos de demonstração enquanto a estrutura comercial definitiva da LUMÉA é preparada.

👨‍💻 Desenvolvimento

Projeto desenvolvido por AW Technology.

GitHub:

https://github.com/awaldige

Repositório:

https://github.com/awaldige/lumea

📄 Licença

Este projeto foi desenvolvido especificamente para a LUMÉA.

O código-fonte, identidade visual, imagens, conteúdos e demais elementos do projeto não devem ser reutilizados, distribuídos ou comercializados sem autorização.