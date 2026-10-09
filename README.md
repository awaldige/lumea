# LUMÉA — Joias e Acessórios Artesanais

### Elegância, autenticidade e cuidado em cada detalhe.

A **LUMÉA** é uma plataforma de e-commerce desenvolvida para apresentar e comercializar peças artesanais com uma identidade visual elegante e uma experiência de navegação intuitiva.

O projeto combina uma vitrine digital sofisticada com recursos de gerenciamento administrativo, reunindo catálogo de produtos, coleções e funcionalidades para administração da loja.

🔗 **Loja online:** [Acessar a LUMÉA](https://lumea.vercel.app/)

---

## ✨ Sobre o projeto

A LUMÉA foi concebida para valorizar a singularidade das peças artesanais, destacando seus detalhes, sua identidade e o cuidado presente em cada criação.

Além da experiência da loja, o projeto contempla uma estrutura administrativa para gerenciamento dos dados e funcionalidades da plataforma.

Do ponto de vista técnico, a aplicação integra um frontend moderno, uma API própria e um banco de dados relacional, demonstrando a implementação de uma solução Full Stack.

## 🛍️ Funcionalidades

### Loja virtual

- Catálogo de produtos.
- Organização por categorias e coleções.
- Páginas de apresentação dos produtos.
- Carrinho de compras.
- Interface com identidade visual elegante.
- Navegação entre as áreas da loja.

### Painel administrativo

- Autenticação administrativa.
- Gerenciamento de produtos.
- Gerenciamento de categorias e coleções.
- Administração de cupons.
- Gerenciamento de pedidos e clientes.
- Funcionalidades administrativas protegidas por autenticação.

*Os recursos específicos disponíveis devem ser conferidos na versão publicada e no código atual do projeto.*

## 🧰 Tecnologias utilizadas

### Frontend

- **Next.js** — framework para construção da aplicação web.
- **React** — criação de componentes e interfaces.
- **TypeScript** — tipagem estática e organização do código.
- **Tailwind CSS** — estilização da interface, caso mantido na versão atual.

### Backend

- **Node.js** — ambiente de execução.
- **Express** — estrutura da API.
- **TypeScript** — desenvolvimento tipado do servidor.
- **Prisma ORM** — acesso e gerenciamento dos dados.
- **bcryptjs** — suporte à proteção de senhas por hash.

### Banco de dados e infraestrutura

- **PostgreSQL** — armazenamento relacional.
- **Neon** — banco de dados PostgreSQL gerenciado.
- **Vercel** — hospedagem da aplicação frontend.

## 🏗️ Arquitetura

A plataforma utiliza uma arquitetura separada em camadas:

1. **Frontend:** interface com a qual os usuários interagem.
2. **Backend:** API responsável pelas operações e regras de negócio.
3. **Banco de dados:** armazenamento persistente das informações.
4. **Camada de acesso a dados:** integração entre o backend e o PostgreSQL por meio do Prisma.

Essa organização facilita a manutenção, a evolução e a separação de responsabilidades da aplicação.

## 🚀 Executando o projeto localmente

### Pré-requisitos

- Node.js em uma versão compatível com o projeto.
- npm.
- Acesso a um banco PostgreSQL.
- Git.

### 1. Clone o repositório

```bash
git clone https://github.com/awaldige/lumea.git
cd lumea
```

### 2. Configure o backend

Entre na pasta do backend e instale as dependências:

```bash
cd backend
npm install
```

Configure as variáveis de ambiente conforme o arquivo de exemplo do projeto. A conexão com o PostgreSQL deve ser definida na configuração utilizada pelo Prisma.

Execute as migrações existentes, seguindo os scripts e as instruções do projeto.

Inicie o servidor utilizando o script de desenvolvimento definido no `package.json`.

### 3. Configure o frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd frontend
npm install
```

Configure a URL da API conforme as variáveis de ambiente esperadas pela aplicação.

Inicie o frontend utilizando o script de desenvolvimento definido no `package.json`.

> Os comandos exatos de migração e execução devem seguir os scripts presentes nos respectivos arquivos `package.json`. Não utilize credenciais reais no README nem publique arquivos `.env`.

## 🎨 Identidade visual

A experiência visual da LUMÉA segue uma proposta clássica e sofisticada, com:

- Paleta de tons neutros e bege.
- Tipografia elegante.
- Apresentação visual voltada a peças artesanais.
- Atenção à organização dos produtos e aos detalhes da interface.

A proposta é unir tecnologia e identidade de marca para criar uma vitrine digital coerente com os produtos apresentados.

## 🔮 Evoluções futuras

Entre as possibilidades de evolução da plataforma estão:

- Integração com provedores de pagamento.
- Automação do fluxo de compra e confirmação de pedidos.
- Integração com serviços de entrega.
- Aprimoramento de relatórios administrativos.
- Melhorias de desempenho, acessibilidade e experiência mobile.

Essas possibilidades não representam funcionalidades necessariamente disponíveis na versão atual.

## 👨‍💻 Desenvolvimento

**AW TECHNOLOGY — André Waldige**

Projeto desenvolvido para demonstrar conhecimentos em desenvolvimento Full Stack, construção de interfaces, integração com APIs e modelagem de dados relacionais.

- **GitHub:** [@awaldige](https://github.com/awaldige)
- **Portfólio:** [andre-waldige.vercel.app](https://andre-waldige.vercel.app)

---

**LUMÉA — peças com identidade, tecnologia com propósito.**
