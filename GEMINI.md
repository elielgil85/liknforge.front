# Guia de Integração: Frontend e API de Encurtador de URL

Este documento descreve como o frontend da aplicação LinkForge (Next.js) deve interagir com a API de backend para encurtamento de URLs. O backend é um serviço Node.js/Express separado que se conecta a um banco de dados MongoDB.

## Visão Geral da Arquitetura

O frontend Next.js não lida diretamente com a lógica de armazenamento ou redirecionamento de URLs. Ele delega essas tarefas para uma API de backend externa. Para facilitar a comunicação durante o desenvolvimento e contornar restrições de CORS, o Next.js utiliza um proxy.

O arquivo `next.config.ts` está configurado com uma regra de `rewrites`. Qualquer requisição feita do frontend para o caminho `/api/backend/*` será automaticamente encaminhada pelo servidor Next.js para o servidor backend rodando em `http://localhost:3001/*`.

**Isso significa que todo o código do frontend deve fazer chamadas de API para caminhos relativos, como `/api/backend/shorten`.**

## Endpoints da API

O backend expõe duas rotas principais que o frontend utilizará.

---

### 1. Encurtar uma URL

-   **Endpoint no Frontend:** `POST /api/backend/shorten`
-   **Funcionalidade:** Recebe uma URL longa e retorna um código curto para ela.
-   **Corpo da Requisição (Request Body):** A requisição deve ser do tipo `application/json` com a seguinte estrutura:
    ```json
    {
      "long_url": "https://sua-url-longa-aqui.com"
    }
    ```
-   **Resposta de Sucesso (200 OK):** Um objeto JSON contendo o código curto gerado.
    ```json
    {
      "short_code": "aB1cD2e"
    }
    ```
-   **Lógica no Frontend:** Após receber a resposta, o frontend deve montar a URL final para o usuário, combinando seu próprio domínio com o `short_code` recebido. Por exemplo: `https://<dominio-do-frontend>/aB1cD2e`.

---

### 2. Obter URL Longa para Redirecionamento

-   **Endpoint no Frontend:** `GET /api/backend/:shortCode` (onde `:shortCode` é o código do link).
-   **Funcionalidade:** Busca a URL longa original associada a um código curto.
-   **Parâmetro de URL:** O `shortCode` gerado pela rota `/shorten`.
-   **Resposta de Sucesso (200 OK):** Um objeto JSON contendo a URL longa original.
    ```json
    {
      "long_url": "https://sua-url-longa-aqui.com"
    }
    ```
-   **Resposta de Erro (404 Not Found):** Se o `shortCode` não for encontrado, a API retornará um status `404` com um corpo de erro em JSON.
    ```json
    {
      "error": "URL not found"
    }
    ```
-   **Lógica no Frontend:** A página de redirecionamento (`src/app/[shortCode]/page.tsx`) deve chamar este endpoint. Se receber uma resposta de sucesso, ela deve usar o `long_url` para redirecionar o usuário com `redirect(long_url)`. Se receber um erro, deve acionar a página 404 do Next.js com `notFound()`.
