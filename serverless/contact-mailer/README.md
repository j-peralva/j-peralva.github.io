# Serverless Contact Mailer (AWS Lambda + Python)

A lightweight, zero-dependency serverless backend service designed to handle contact form submissions securely via Google SMTP with Cloudflare Turnstile anti-bot verification.

---

## 🔒 Security Architecture

1. **Zero External Dependencies:** Built strictly with Python's Standard Library (`smtplib`, `ssl`, `urllib`), eliminating the need for Lambda Layers and reducing supply chain vulnerability risks.
2. **Strict CORS Policy:** Only accepts requests originating from `https://j-peralva.github.io`.
3. **Turnstile Anti-Bot Protection:** Mandatory server-side token validation before triggering any SMTP network calls.
4. **Memory & Payload Sanitization:** Strict character length limits enforced on all input fields (Name, Email, Subject, Message) to prevent buffer and memory overload attacks.
5. **IAM Least Privilege:** Requires only the default `AWSLambdaBasicExecutionRole` policy for Amazon CloudWatch logging.

---

## ⚙️ AWS Deployment & Configuration

1. **Create an AWS Lambda Function:**
   * **Runtime:** Python 3.12+
   * **Architecture:** `arm64` (Graviton2) or `x86_64`
2. **Deploy Code:** Paste the content of `lambda_function.py` into the AWS Lambda Code Editor.
3. **Environment Variables:**
   Navigate to **Configuration -> Environment variables** and add:
   * `GMAIL_USER`: Sender Gmail address.
   * `GMAIL_APP_PASS`: 16-character Google App Password.
   * `RECIPIENT_EMAIL`: Target email address to receive contact form messages.
   * `CAPTCHA_SECRET_KEY`: Secret Key generated in Cloudflare Turnstile.
4. **Enable Function URL / API Gateway:**
   * **Auth type:** `NONE`
   * **CORS Settings:**
     * **Allow Origin:** `https://j-peralva.github.io`
     * **Allow Headers:** `content-type`
     * **Allow Methods:** `POST, OPTIONS`
5. **Concurrency Limit:**
   In **Configuration -> Concurrency**, set **Reserved Concurrency** to `5` to prevent unexpected billing or DDoS abuse.
