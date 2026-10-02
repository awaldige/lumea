# LUMÉA

### E-commerce de peças artesanais

A **LUMÉA** é uma plataforma de e-commerce desenvolvida para apresentar e comercializar peças de fabricação artesanal, valorizando o caráter artesanal, o cuidado com os detalhes e a identidade de cada peça.

O projeto foi desenvolvido com foco em uma experiência de compra elegante, intuitiva e responsiva, combinando uma identidade visual clássica e sofisticada com uma estrutura preparada para evolução.

---

## ✨ Sobre o projeto

A LUMÉA foi criada para oferecer uma experiência digital alinhada à proposta da marca.

A plataforma permite que os clientes naveguem pelo catálogo, explorem diferentes categorias, visualizem detalhes dos produtos e adicionem itens ao carrinho.

A arquitetura do projeto foi organizada separando **frontend** e **backend**, permitindo maior organização, manutenção e evolução da aplicação.

---

## 🛍️ Principais funcionalidades

- Catálogo de produtos
- Organização de produtos por categorias
- Navegação entre categorias
- Página individual de produto
- Visualização de informações dos produtos
- Adição de produtos ao carrinho
- Alteração da quantidade de produtos
- Remoção de produtos do carrinho
- Limpeza do carrinho
- Cálculo automático do subtotal
- Contagem de itens no carrinho
- Interface responsiva
- Navegação otimizada para dispositivos móveis
- Gerenciamento de imagens dos produtos
- Estrutura preparada para expansão do e-commerce

---

## 🎨 Identidade visual

A identidade visual da LUMÉA foi desenvolvida para transmitir uma sensação de:

- Elegância
- Sofisticação
- Delicadeza
- Exclusividade
- Leveza
- Caráter artesanal
- Cuidado com os detalhes
- Identidade das peças

A interface utiliza uma estética clássica e minimalista, com tons neutros e elementos visuais discretos.

A proposta é manter o foco nos produtos e transmitir uma experiência visual compatível com peças artesanais e de identidade própria.

---

## 🧩 Estrutura do projeto

O projeto está dividido em duas aplicações principais:

```text
lumea/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── uploads/
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
Frontend

Responsável pela interface da loja, navegação, catálogo, páginas de produtos e carrinho de compras.

Backend

Responsável pela API, persistência de dados, gerenciamento dos produtos e comunicação com o banco de dados.

🚀 Tecnologias utilizadas
Frontend
Next.js
React
TypeScript
CSS
Next.js App Router
Backend
Node.js
Express
Prisma
PostgreSQL
Ferramentas e ambiente
Git
GitHub
npm
🏷️ Categorias de produtos

A loja possui uma estrutura organizada por categorias.

Brincos

Peças delicadas desenvolvidas para valorizar diferentes composições e ocasiões.

Colares

Peças que combinam elegância, presença e identidade.

Pulseiras

Detalhes que complementam a composição com sofisticação e delicadeza.

💎 Produtos

O projeto possui produtos de demonstração utilizados durante o desenvolvimento da plataforma.

Coleção principal
Elegance Drop — Brinco
Lumière — Colar
Essence — Pulseira
Éclat — Brinco
Coleção Éclat
Éclat Dourado — Brinco
Éclat Lumière — Colar
Éclat Charm — Pulseira
Coleção Naturelle
Naturelle Folha — Brinco
Naturelle Essencial — Colar
Naturelle Charm — Pulseira
Naturelle Botanique — Colar

Os produtos, descrições e imagens utilizados durante o desenvolvimento podem ser substituídos posteriormente pelo catálogo definitivo da marca.

🛒 Carrinho de compras

A plataforma possui um sistema de carrinho que permite ao usuário:

Adicionar produtos
Visualizar os produtos selecionados
Aumentar a quantidade
Diminuir a quantidade
Remover produtos
Limpar o carrinho
Visualizar a quantidade total de itens
Visualizar o subtotal da compra

O carrinho foi estruturado para permitir futuras integrações com processos de checkout e pagamento.

📱 Responsividade

A interface foi desenvolvida para proporcionar uma experiência consistente em diferentes dispositivos.

O projeto contempla:

Desktop
Notebook
Tablet
Smartphone

A estrutura responsiva permite que o catálogo e as funcionalidades da loja sejam utilizados em diferentes tamanhos de tela.

💻 Como executar o projeto
Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

Node.js
npm
PostgreSQL
Git
Frontend

Entre na pasta do frontend:

cd frontend

Instale as dependências:

npm install

Configure as variáveis de ambiente necessárias no arquivo:

.env.local

Depois execute o projeto:

npm run dev

O frontend estará disponível em:

http://localhost:3000
Backend

Abra outro terminal e entre na pasta do backend:

cd backend

Instale as dependências:

npm install

Configure as variáveis de ambiente necessárias.

Depois execute o servidor:

npm run dev
🔐 Variáveis de ambiente

As variáveis de ambiente são mantidas fora do controle de versão.

Arquivos como:

.env
.env.local
.env.development.local
.env.test.local
.env.production.local

não devem ser enviados para o GitHub.

Esses arquivos podem conter informações como:

URLs de banco de dados
Credenciais
Tokens
Chaves de API
Configurações privadas

Nunca publique credenciais ou informações sensíveis diretamente no repositório.

🗄️ Banco de dados

O backend utiliza PostgreSQL como banco de dados e Prisma como ORM.

A estrutura de dados é organizada por meio do Prisma, permitindo trabalhar com:

Produtos
Categorias
Dados relacionados ao catálogo
Persistência das informações da aplicação

As configurações de conexão devem ser definidas por meio das variáveis de ambiente do backend.

📂 Imagens dos produtos

As imagens utilizadas pelos produtos ficam organizadas dentro da estrutura do backend.

backend/
└── uploads/
    └── produtos/

Essa estrutura permite organizar os arquivos relacionados ao catálogo de produtos.

🔄 Fluxo básico da aplicação

O funcionamento geral da plataforma segue o seguinte fluxo:

Usuário
   │
   ▼
Frontend
   │
   ├── Catálogo
   │
   ├── Categorias
   │
   ├── Página do produto
   │
   └── Carrinho
   │
   ▼
Backend / API
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
📈 Estrutura preparada para evolução

A arquitetura da LUMÉA foi desenvolvida pensando na possibilidade de expansão da plataforma.

Entre as futuras evoluções possíveis estão:

Integração com meios de pagamento
Finalização de pedidos
Checkout
Integração com WhatsApp
Sistema de pedidos
Área administrativa
Gestão de produtos
Gestão de estoque
Gestão de clientes
Cupons de desconto
Controle de pedidos
Melhorias no gerenciamento de imagens
Integração com serviços externos
Melhorias na experiência de compra
🛠️ Desenvolvimento

O projeto foi desenvolvido utilizando uma arquitetura separada entre frontend e backend.

Frontend

Responsável pela experiência visual e interação do usuário.

frontend/
Backend

Responsável pela API, regras de negócio e persistência dos dados.

backend/

Essa separação facilita a manutenção e permite que cada camada evolua de maneira independente.

📌 Status do projeto

Em desenvolvimento

A LUMÉA encontra-se em fase de desenvolvimento e estruturação para apresentação e futura utilização comercial.

A versão atual contém produtos e imagens de demonstração utilizados durante o desenvolvimento.

🎯 Objetivo do projeto

O objetivo da LUMÉA é oferecer uma experiência digital que valorize as peças artesanais e permita que cada produto seja apresentado de maneira elegante e organizada.

Mais do que apenas uma loja virtual, a proposta é criar uma experiência que valorize:

O caráter artesanal, o cuidado com os detalhes e a identidade de cada peça.

👨‍💻 Desenvolvimento

Projeto desenvolvido por AW Technology.

GitHub

https://github.com/awaldige

📦 Repositório

O código-fonte do projeto está disponível no GitHub:

https://github.com/awaldige/lumea

📄 Licença

Este projeto é de uso privado e foi desenvolvido especificamente para a LUMÉA.

O código-fonte, identidade visual, imagens, conteúdos e demais elementos do projeto não devem ser reutilizados, distribuídos ou comercializados sem autorização
