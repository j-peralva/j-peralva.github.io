# Serverless Contact Mailer (AWS Lambda + Python)

Microsserviço serverless de disparo de e-mails para formulários de contato, projetado para operar com **zero dependências externas** e alta proteção anti-abuso.

---

## 🔒 Arquitetura de Segurança

1. **Zero External Dependencies:** Utiliza estritamente os pacotes da Standard Library do Python (`smtplib`, `ssl`, `urllib`), dispensando *Lambda Layers* e reduzindo a superfície de ataque.
2. **CORS Restrito:** Responde apenas a requisições com origem autorizada (`https://j-peralva.github.io`).
3. **Turnstile Anti-Bot:** Verificação server-side obrigatória do token antes de qualquer chamada de rede SMTP.
4. **Proteção de Memória:** Limite rígido de caracteres em todos os campos de entrada para prevenir ataques de estouro de payload.
5. **IAM Least Privilege:** Requer apenas a política padrão `AWSLambdaBasicExecutionRole` (gravação de logs no CloudWatch).

---

## ⚙️ Implantação na AWS

1. Crie uma função Lambda na AWS:
   * **Runtime:** Python 3.12 (ou superior)
   * **Arquitetura:** `arm64` (Graviton2 — menor custo e menor latência) ou `x86_64`
2. Cole o código de `lambda_function.py` no editor de código da Lambda.
3. Configure as variáveis de ambiente em **Configuration -> Environment variables**:
   * `GMAIL_USER`
   * `GMAIL_APP_PASS`
   * `RECIPIENT_EMAIL`
   * `CAPTCHA_SECRET_KEY`
4. Habilite o **Function URL** (ou associe a um **API Gateway HTTP API**):
   * **Auth type:** `NONE`
   * **Configure CORS:**
     * Allow Origin: `https://j-peralva.github.io`
     * Allow Headers: `content-type`
     * Allow Methods: `POST, OPTIONS`
5. Em **Configuration -> Concurrency**, defina a **Reserved Concurrency** para `5` para limitar execuções concorrentes e evitar custos não planejados.
