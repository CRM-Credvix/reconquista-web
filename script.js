// URL PUBLICA de recebimento. Nunca insira tokens, senhas ou credenciais aqui.
const WEBHOOK_URL = "https://SEU-WEBHOOK-AQUI";

const form = document.getElementById("request-form");
const button = document.getElementById("submit-button");
const buttonLabel = document.getElementById("button-label");
const panel = document.getElementById("status-panel");
const statusTitle = document.getElementById("status-title");
const statusMessage = document.getElementById("status-message");
const statusIcon = document.getElementById("status-icon");
let submitting = false;

function setStatus(state, title, message) {
  panel.dataset.state = state;
  statusTitle.textContent = title;
  statusMessage.textContent = message;
  statusIcon.textContent = {idle:"i", sending:"…", requested:"✓", error:"!"}[state] || "i";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (submitting) return;
  if (!/^https:\/\/[^\s]+$/i.test(WEBHOOK_URL) || WEBHOOK_URL.includes("SEU-WEBHOOK-AQUI")) {
    setStatus("error", "Webhook não configurado", "Configure WEBHOOK_URL no arquivo script.js antes de usar.");
    return;
  }

  submitting = true;
  button.disabled = true;
  button.setAttribute("aria-busy", "true");
  buttonLabel.textContent = "Enviando solicitação...";
  setStatus("sending", "Enviando solicitação", "Aguarde enquanto registramos o pedido.");

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        solicitado_em: new Date().toISOString()
      }),
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) throw new Error("HTTP " + response.status);
    setStatus("requested", "Solicitação recebida", "O webhook confirmou o pedido. A conclusão do robô deve ser acompanhada no serviço de automação.");
  } catch (error) {
    const reason = error.name === "TimeoutError"
      ? "Tempo limite excedido. Verifique se o pedido chegou antes de tentar novamente."
      : "Não foi possível confirmar o recebimento. Verifique sua conexão, a URL e o CORS do webhook antes de reenviar.";
    setStatus("error", "Solicitação não confirmada", reason);
    console.error("Falha na solicitação:", error);
  } finally {
    submitting = false;
    button.disabled = false;
    button.removeAttribute("aria-busy");
    buttonLabel.textContent = "Solicitar extração Reconquista";
  }
});
