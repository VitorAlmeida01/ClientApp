# ControleGastos

Aplicação web para controle de gastos pessoais, desenvolvida em Angular 19. Permite cadastrar, categorizar e visualizar despesas com gráficos e filtros por período, além de painel administrativo para gerenciamento de usuários.

---

## Funcionalidades

### Autenticação
- Login com e-mail e senha (JWT)
- Cadastro de novo usuário
- Logout com limpeza de sessão
- Proteção de rotas por guards (`authenticationGuard`, `adminGuard`)

### Gastos
- Listagem de todos os gastos do usuário
- Cadastro de novo gasto com valor, categoria e descrição
- Edição e exclusão de gastos (com confirmação)
- Filtro por categoria
- Filtro por período: hoje, semana, mês, 6 meses e ano

### Categorias
- Listagem de categorias
- Criação, edição e exclusão de categorias

### Dashboard
- Gráfico de linha: evolução dos gastos no tempo (dia, semana, mês, 6 meses)
- Gráfico de barras: total de gastos por categoria
- Cards de resumo: total gasto, ticket médio, maior período e quantidade total

### Perfil
- Visualização de nome e e-mail extraídos do token JWT

### Administração (admin only)
- Listagem de todos os usuários
- Edição e exclusão de usuários

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Angular 19.2 |
| Linguagem | TypeScript 5.8 |
| UI Components | Angular Material 19.2 |
| Estilização | Tailwind CSS 4.1 |
| Gráficos | Chart.js 4.5 |
| Reatividade | RxJS 7.8 |
| Testes | Vitest 4.0 |
| Containerização | Docker + Nginx |
| Build | Angular CLI 19 |

---

## Estrutura do Projeto

```
src/app/
├── components/
│   ├── login/                    # Formulário de login
│   ├── sign-up/                  # Formulário de cadastro
│   ├── card-gastos/              # Card de exibição de gasto
│   ├── card-cadastro-gastos/     # Formulário de criação/edição de gasto
│   ├── card-categorias/          # Card de exibição de categoria
│   ├── card-cadastro-categoria/  # Formulário de criação/edição de categoria
│   └── card-perfil/              # Card de perfil do usuário
├── pages/
│   ├── main-page/                # Página inicial pública
│   ├── dashboard-page/           # Página de dashboard
│   ├── cadastrar-gastos/         # Página de gestão de gastos
│   ├── categorias-page/          # Página de gestão de categorias
│   ├── perfil-page/              # Página de perfil
│   └── usuarios-page/            # Página de administração de usuários
├── dashboard/                    # Componente de gráficos e métricas
├── shared/
│   ├── screen-base/              # Layout base com navbar e menu
│   └── confirmation-dialog/      # Dialog reutilizável de confirmação
├── services/
│   ├── Auth/                     # Autenticação e gestão do token JWT
│   ├── Gastos/                   # CRUD e filtros de gastos
│   ├── Categorias/               # CRUD de categorias
│   └── Usuarios/                 # Registro e gestão de usuários
├── models/                       # Interfaces e DTOs de dados
└── app.routes.ts                 # Configuração de rotas
```

---

## Rotas

| Rota | Componente | Proteção |
|---|---|---|
| `/` | MainPage | Pública |
| `/login` | LoginComponent | Pública |
| `/signUp` | SignUpComponent | Pública |
| `/dashboard` | DashboardPage | `authenticationGuard` |
| `/gastos` | CadastrarGastos | `authenticationGuard` |
| `/categorias` | CategoriasPage | `authenticationGuard` |
| `/perfil` | PerfilPage | `authenticationGuard` |
| `/usuarios` | UsuariosPage | `adminGuard` |

---

## Endpoints da API

### Auth
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/login` | Login do usuário |
| `GET` | `/api/auth/me` | Dados do usuário logado |

### Gastos
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/gastos` | Listar todos os gastos |
| `GET` | `/api/gastos/tipo/{tipo}` | Listar por categoria |
| `GET` | `/api/gastos/total` | Total geral |
| `GET` | `/api/gastos/total/tipo/{tipo}` | Total por categoria |
| `GET` | `/api/gastos/periodo/dia` | Gastos do dia |
| `GET` | `/api/gastos/periodo/semana` | Gastos da semana |
| `GET` | `/api/gastos/periodo/mes` | Gastos do mês |
| `GET` | `/api/gastos/periodo/6meses` | Gastos dos últimos 6 meses |
| `POST` | `/api/gastos` | Criar gasto |
| `PUT` | `/api/gastos/{id}` | Atualizar gasto |
| `DELETE` | `/api/gastos/{id}` | Remover gasto |

### Categorias
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/categorias` | Listar categorias |
| `POST` | `/api/categorias` | Criar categoria |
| `PUT` | `/api/categorias/{id}` | Atualizar categoria |
| `DELETE` | `/api/categorias/{id}` | Remover categoria |

### Usuários
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/usuarios/register` | Cadastrar usuário |
| `GET` | `/api/usuarios` | Listar usuários (admin) |
| `PUT` | `/api/usuarios/{id}` | Atualizar usuário |
| `DELETE` | `/api/usuarios/{id}` | Remover usuário (admin) |

---

## Instalação e Execução

### Pré-requisitos
- Node.js 20+
- Angular CLI 19+

### Instalar dependências

```bash
npm install
```

### Desenvolvimento com backend local

```bash
npm run start:local
```

O proxy redireciona `/api` para `http://localhost:8080`.

### Desenvolvimento apontando para EC2

```bash
API_BASE_URL=https://seu-backend-ec2.amazonaws.com npm run start:ec2
```

### Build de produção

```bash
# Com URL externa
API_BASE_URL=https://seu-backend-ec2.amazonaws.com npm run build:prod

# Com chamadas relativas /api
npm run build:prod
```

Os artefatos de build ficam em `dist/controle-gastos`.

---

## Docker

### Build da imagem

```bash
docker compose build web
```

### Subir o container

```bash
API_BASE_URL=http://seu-backend:8080 docker compose up -d
```

### Logs

```bash
docker compose logs -f web
```

### Parar

```bash
docker compose down
```

A variável `API_BASE_URL` é injetada em runtime via `public/runtime-config.js`, sem necessidade de rebuild da imagem.

---

## Testes

```bash
ng test
```

Utiliza [Vitest](https://vitest.dev/) como test runner.
