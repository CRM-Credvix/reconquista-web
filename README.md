# Credvix — Reconquista Web

Site estático de solicitação da extração Reconquista, em HTML, CSS e JavaScript puro, sem framework e sem build. O visual segue o **Credvix Design System v0.2**.

## Acessar e publicar

Repositório: `CRM-Credvix/reconquista-web`  
Site (quando o GitHub Pages estiver publicado): **https://crm-credvix.github.io/reconquista-web/**

Configuração do GitHub Pages: `Settings → Pages → Deploy from a branch → main → /(root) → Save`.

## Funcionamento da tela

A tela possui **um único botão "Solicitar extração Reconquista"**, sem seleção de franquia/loja. O robô atual processa o conjunto de dados Reconquista e **não aceita código de franquia como parâmetro**.

O botão impede cliques duplicados durante o envio e exibe os estados "Enviando solicitação", "Solicitação recebida" ou "Solicitação não confirmada". O status de recebimento representa apenas uma resposta HTTP 2xx do webhook, **não a conclusão do robô**.

## Configurar o webhook

Edite apenas a constante no início do arquivo `script.js`:

```js
const WEBHOOK_URL = "https://SEU-WEBHOOK-AQUI";
```

Uma solicitação válida faz `POST` HTTPS com cabeçalho `Content-Type: application/json` e JSON:

```json
{
  "solicitado_em": "2026-10-15T12:00:00.000Z"
}
```

A data real é obtida via `new Date().toISOString()`. **Não existe mais o campo `franquia`**. O serviço receptor deverá ser compatível com esse contrato, aceitar CORS da origem `https://crm-credvix.github.io` (incluindo `OPTIONS` preflight) e retornar um status 2xx apenas quando o pedido estiver registrado.

O GitHub Pages é público e estático: **não coloque segredos nem credenciais no código**. Controle de acesso, limitação de taxa, validação e prevenção de duplicações pertencem ao servidor. CORS sozinho não impede acessos indevidos.

## Como conectar o robô

O arquivo `bot_reconquista.py` utiliza Power BI, Playwright e Google Sheets. A execução completa é `python bot_reconquista.py run` em um ambiente Python apropriado com `config.json`, sessão Microsoft e credenciais Google armazenadas separadamente.

GitHub Pages **não executa Python**. Será necessário um serviço receptor autenticado e um processo de execução confiável na máquina/servidor do robô. O webhook continua com URL placeholder: a integração **não está ativa** até essa configuração e testes.

## Checklist de testes

1. Com a URL placeholder, clique no botão e confirme a mensagem **Webhook não configurado**.
2. Configure uma URL de teste HTTPS com CORS e verifique recebimento de `solicitado_em` no JSON.
3. Confirme resposta 2xx e erro HTTP 500, indisponibilidade ou timeout.
4. Teste clique duplo e comportamento em celular e teclado.

Nenhuma alteração foi feita no robô Python ou no projeto MOP-CNC.
