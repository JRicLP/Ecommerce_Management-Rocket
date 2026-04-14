# Ecommerce Management

Sistema de gerenciamento de e-commerce desenvolvido como atividade prática do **Rocket Lab 2026 — Visagio**. Permite que o gerente da loja visualize o catálogo de produtos, acesse detalhes de desempenho de vendas e avaliações, e realize operações de criação, edição e remoção de produtos.

---

## Tecnologias utilizadas

**Backend**
- Python 3.11+
- FastAPI
- SQLAlchemy (ORM)
- Alembic (migrações)
- SQLite
- Pydantic

**Frontend**
- Vite + React 18
- TypeScript
- React Router v6
- Axios
- TailwindCSS v3

---

## Pré-requisitos

Certifique-se de ter instalado na sua máquina:

- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

---

## Instalação e execução

### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/Ecommerce_Management-Rocket.git
cd Ecommerce_Management-Rocket
```

### 2. Configure o backend

**Crie e ative o ambiente virtual:**

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux / Mac
python -m venv venv
source venv/bin/activate
```

**Instale as dependências:**

```bash
cd backend
pip install -r requirements.txt
```

**Configure as variáveis de ambiente:**

```bash
cp .env.example .env
```

**Execute as migrações para criar as tabelas:**

```bash
alembic upgrade head
```

**Popule o banco de dados com os dados iniciais:**

```bash
python seed.py
```

**Inicie o servidor:**

```bash
python -m app.main
```

O backend estará disponível em: [http://localhost:8000](http://localhost:8000)

Documentação interativa da API: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 3. Configure o frontend

Abra um novo terminal na raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em: [http://localhost:5173](http://localhost:5173)

---

## Estrutura do projeto

Ecommerce_Management-Rocket/
├── backend/
│   ├── app/
│   │   ├── main.py               # Ponto de entrada da API
│   │   ├── database.py           # Configuração do banco de dados
│   │   ├── config.py             # Variáveis de ambiente
│   │   ├── crud.py               # Lógica de acesso ao banco
│   │   ├── models/               # Models do SQLAlchemy
│   │   │   ├── produto.py
│   │   │   ├── pedido.py
│   │   │   ├── item_pedido.py
│   │   │   ├── avaliacao_pedido.py
│   │   │   ├── consumidor.py
│   │   │   └── vendedor.py
│   │   ├── schemas/              # Schemas Pydantic
│   │   │   ├── produto.py
│   │   │   ├── avaliacao_pedido.py
│   │   │   └── venda.py
│   │   └── routers/              # Rotas da API
│   │       └── produtos.py
│   ├── alembic/                  # Migrações do banco
│   ├── csvs/                     # Dados iniciais
│   ├── seed.py                   # Script de população do banco
│   ├── requirements.txt
│   └── .env.example
└── frontend/
└── src/
├── components/           # Componentes reutilizáveis
│   ├── Navbar.tsx
│   ├── StarRating.tsx
│   ├── ConfirmModal.tsx
│   └── Toast.tsx
├── pages/                # Páginas da aplicação
│   ├── Catalog.tsx
│   ├── ProductDetails.tsx
│   ├── ProductFormulary.tsx
│   └── NotFound.tsx
├── services/
│   └── api.ts            # Serviço centralizado de API
├── types/
│   └── index.ts          # Interfaces TypeScript
└── utils/
└── categoriaImagens.ts  # Mapeamento de imagens por categoria
---

## Funcionalidades

- **Catálogo de produtos** com imagens por categoria e paginação
- **Busca** por nome ou categoria com debounce
- **Detalhes do produto** com medidas, desempenho de vendas e avaliações
- **Média de avaliações** com exibição em estrelas
- **Criação, edição e remoção** de produtos com confirmação
- **Feedback visual** com notificações de sucesso após cada ação
- **Página 404** para rotas inválidas
- **Responsividade** para dispositivos móveis

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/produtos/` | Lista produtos com paginação |
| `GET` | `/produtos/search?q=` | Busca produtos por nome ou categoria |
| `GET` | `/produtos/{id}` | Retorna detalhes de um produto |
| `GET` | `/produtos/{id}/avaliacoes` | Retorna avaliações e média do produto |
| `GET` | `/produtos/{id}/vendas` | Retorna desempenho de vendas do produto |
| `POST` | `/produtos/` | Cria um novo produto |
| `PUT` | `/produtos/{id}` | Atualiza um produto existente |
| `DELETE` | `/produtos/{id}` | Remove um produto |

---

## Observações

- O banco de dados SQLite é criado localmente em `backend/database.db` após rodar as migrações.
- O arquivo `.env` não é versionado por segurança — use o `.env.example` como base.
- Os dois servidores (backend e frontend) precisam estar rodando simultaneamente para o sistema funcionar corretamente.

