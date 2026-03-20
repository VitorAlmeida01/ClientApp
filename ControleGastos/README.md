# ControleGastos

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Configuracao da API (EC2) via variavel de ambiente

Este projeto foi configurado para ler a URL da API em runtime pela variavel de ambiente `API_BASE_URL`.

### 1. Como funciona

- Antes de iniciar/buildar, o script `npm run runtime-config` gera o arquivo `public/runtime-config.js`.
- O valor de `API_BASE_URL` e escrito nesse arquivo.
- O app usa esse valor para converter chamadas `/api/...` em `API_BASE_URL + /api/...`.

### 2. Comandos prontos

Desenvolvimento com backend local (via proxy local):

```bash
npm run start:local
```

Desenvolvimento apontando para EC2:

```bash
API_BASE_URL=https://seu-backend-ec2.amazonaws.com npm run start:ec2
```

Build de producao apontando para EC2:

```bash
API_BASE_URL=https://seu-backend-ec2.amazonaws.com npm run build:prod
```

Build sem URL (mantem chamadas relativas `/api`):

```bash
npm run build:prod
```

### 3. Proxy em desenvolvimento

- `proxy.conf.json`: `/api` -> `http://localhost:8080`
- `proxy.ec2.conf.json`: `/api` -> `https://SEU_BACKEND_EC2.amazonaws.com`

### 4. Observacoes de producao

- Publique o conteudo de `dist/controle-gastos` apos o build.
- Se front e API estiverem em dominios diferentes, configure CORS no backend.
- Prefira HTTPS + dominio (ex: `api.seudominio.com`).

### 5. Imagem Docker com API_BASE_URL em runtime

Build da imagem:

```bash
docker compose build web
```

Subir container informando a URL da API:

```bash
API_BASE_URL=http://34.204.168.225:8080 docker compose up -d
```

Ver logs do container:

```bash
docker compose logs -f web
```

Parar:

```bash
docker compose down
```

Observacao:

- Com essa abordagem, voce pode trocar `API_BASE_URL` na subida do container sem alterar codigo.
