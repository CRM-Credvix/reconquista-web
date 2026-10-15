# Credvix — Reconquista Web

Site estático (HTML + CSS + JavaScript puro, sem build nem frameworks) para registrar solicitações de extração Reconquista por webhook. Visual alinhado ao **Credvix Design System v0.2**, incluindo sidebar grafite, identidade laranja, tokens CSS, contraste, responsividade e feedback acessível.

## Publicação no GitHub Pages

Repositório: `CRM-Credvix/reconquista-web`

1. Acesse **Settings → Pages** no repositório.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Em **Branch**, escolha `main` e `/(root)`; clique **Save**.
4. Aguarde a publicação e acesse: **https://crm-credvix.github.io/reconquista-web/**

O endereço acima depende de o GitHub Pages estar habilitado e a publicação concluída. Não coloque arquivos do projeto MOP-CNC aqui.

## Configuração do webhook

Edite a constante no início de `script.js`:

```js
const WEBHOOK_URL = "https://SEU-WEBHOOK-AQUI";
```

O formulário envia:

```json
{
  "franquia": "51545",
  "solicitado_em": "2026-10-15T12:00:00.000Z"
}
```

`solicitado_em` é produzido com `new Date().toISOString()` no instante real da solicitação. Uma resposta HTTP 2xx confirma **somente o recebimento do pedido**, não a execução completa do robô.

Para funcionar do GitHub Pages, o receptor precisa ser HTTPS, responder a `OPTIONS` quando houver preflight CORS e permitir a origem `https://crm-credvix.github.io`. CORS **não é autenticação**. Proteja o receptor no servidor com controle de acesso, limites de taxa, validação de payload e deduplicação.

## Franquias

O `select` contém apenas a franquia **51545**, que estava confirmada no contexto do projeto; cadastre as demais opções oficiais editando `index.html`. O código enviado hoje **identifica o pedido**, mas não modifica o escopo do extrator Python.

## Integração ao robô real

O arquivo fornecido `bot_reconquista.py` realiza extração **Power BI → XLSX → validação → Google Sheets** usando Python/Playwright e um perfil persistente de navegador. Executa localmente por `python bot_reconquista.py run`, com `config.json`, bibliotecas e credenciais necessárias.

**Limitação verificada:** o CLI do robô não aceita `franquia` como parâmetro. Não presumir que a seleção limita a extração a essa loja.

O GitHub Pages é estático e **não executa Python**. Para ligar a interface ao robô, falta desenvolver/configurar um webhook autenticado, um serviço de fila e um worker confiável na máquina/servidor que dispõe do ambiente e credenciais do robô. Nenhum token, configuração interna, arquivo de sessão, senha, credencial Google ou dados de clientes devem entrar no repositório público.

## Testes sugeridos

1. Abra a página, tente enviar sem selecionar a franquia (deve mostrar erro de validação).
2. Com o webhook placeholder (ainda não configurado), selecione 51545 e verifique o alerta de configuração.
3. Após configurar o webhook de testes, valide o JSON recebido e uma resposta 2xx.
4. Teste erro 500, falha de conexão, tempo limite e prevenção de clique duplo.
5. Teste em celular, teclado e foco visível.

**Estado:** front-end entregue ao repositório. Integração real e GitHub Pages dependem das configurações descritas.
