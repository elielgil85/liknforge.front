# LinkForge - Encurtador de URL

![LinkForge Logo](docs/blueprint.md)

## Visão Geral

LinkForge é uma aplicação moderna de encurtamento de URLs, construída com Next.js para o frontend e Node.js/Express para o backend, utilizando MongoDB como banco de dados. O objetivo é fornecer uma solução rápida e eficiente para transformar URLs longas em links curtos e gerenciáveis.

## Arquitetura

O projeto é dividido em duas partes principais:

-   **Frontend (Next.js):** Responsável pela interface do usuário, onde os usuários podem encurtar URLs e visualizar os links gerados. Ele se comunica com o backend através de rotas de API internas do Next.js.
-   **Backend (Node.js/Express):** Uma API RESTful que lida com a lógica de encurtamento de URLs, armazenamento no MongoDB e redirecionamento de links curtos para suas URLs originais.

### Fluxo de Comunicação

Em desenvolvimento, o frontend (Next.js) faz chamadas para rotas de API internas do Next.js (ex: `/api/shorten`). Essas rotas de API, que rodam no servidor Next.js, então fazem requisições para o backend real (Node.js/Express), que pode estar rodando em `http://localhost:3001`.

Em produção, as rotas de API do Next.js se comunicam diretamente com o backend implantado (ex: `https://liknforge-back.onrender.com`), abstraindo a URL do backend do frontend do navegador.

## Funcionalidades

-   Encurtamento de URLs longas.
-   Redirecionamento de links curtos para URLs originais.
-   Interface de usuário intuitiva e responsiva.

## Começando

Siga estas instruções para configurar e executar o projeto LinkForge localmente.

### Pré-requisitos

Certifique-se de ter o seguinte instalado em sua máquina:

-   [Node.js](https://nodejs.org/) (versão LTS recomendada)
-   [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/) (gerenciador de pacotes)
-   [MongoDB](https://www.mongodb.com/docs/manual/installation/) (servidor de banco de dados)

### Instalação

1.  **Clone o repositório do frontend:**
    ```bash
    git clone https://github.com/seu-usuario/linkforge-front.git
    cd linkforge-front
    ```

2.  **Instale as dependências do frontend:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env.local` na raiz do projeto frontend com o seguinte conteúdo:
    ```
    NEXT_PUBLIC_APP_URL=http://localhost:9002
    # Em produção, este valor deve ser a URL pública do seu frontend (ex: https://seufriend.com)
    ```

4.  **Configure e execute o Backend:**
    Certifique-se de que seu projeto de backend (Node.js/Express) esteja configurado e rodando. O frontend espera que o backend esteja acessível em `http://localhost:3001` em desenvolvimento. Consulte o `README.md` do repositório do backend para instruções específicas de configuração e execução.

### Executando o Projeto

Para iniciar o servidor de desenvolvimento do frontend:

```bash
npm run dev
# ou
yarn dev
```

O frontend estará acessível em `http://localhost:9002` (ou a porta configurada pelo Next.js).

## Endpoints da API (Perspectiva do Frontend)

O frontend interage com as seguintes rotas de API do Next.js, que por sua vez se comunicam com o backend:

-   **`POST /api/shorten`**
    -   **Funcionalidade:** Encurta uma URL longa.
    -   **Corpo da Requisição:** `{ "long_url": "https://sua-url-longa-aqui.com" }`
    -   **Resposta de Sucesso:** `{ "shortUrl": "http://seu-dominio/abcde", "originalUrl": "https://sua-url-longa-aqui.com" }`

-   **`GET /:shortCode`**
    -   **Funcionalidade:** Redireciona para a URL longa original associada a um código curto. Esta rota é tratada diretamente pelo Next.js Server Component (`src/app/[shortCode]/page.tsx`) que faz a chamada direta ao backend.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues para bugs ou sugestões, e enviar Pull Requests com melhorias.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.