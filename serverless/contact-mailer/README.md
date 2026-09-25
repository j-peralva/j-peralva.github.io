# Serverless Contact Mailer (AWS Lambda + Python)

A lightweight, zero-dependency serverless backend service engineered to process contact form submissions securely via Google SMTP with Cloudflare Turnstile anti-bot verification and AWS API Gateway integration.

---

## 🔒 Security Architecture

1. **Zero External Dependencies:** Built strictly with Python 3.12+ Standard Library modules (`smtplib`, `ssl`, `urllib.request`, `json`, `os`), eliminating the need for Lambda Layers, reducing cold start times to near-zero, and preventing supply chain vulnerabilities.
2. **CORS & Gateway Protection:** Fronted by AWS API Gateway (`/contact`) restricting origins, enforcing preflight `OPTIONS` handling, and protecting against traffic bursts.
3. **Turnstile Anti-Bot Verification:** Mandatory server-side token validation against Cloudflare's `siteverify` API before triggering any SMTP network calls.
4. **Memory & Payload Sanitization:** Strict character length limits enforced on all input fields (Name: 100, Email: 120, Subject: 150, Message: 3000) to prevent buffer and memory overload.
5. **IAM Least Privilege & Concurrency Limits:** Operates under standard `AWSLambdaBasicExecutionRole` with reserved concurrency set to `5` to prevent DDoS cost inflation.

---

## ⚙️ AWS Deployment & Environment Variables

### 1. Lambda Environment Variables
Configure the following in **AWS Lambda -> Configuration -> Environment variables**:

| Variable | Description |
| :--- | :--- |
| `GMAIL_USER` | Sender Gmail account address |
| `GMAIL_APP_PASS` | 16-character Google App Password |
| `RECIPIENT_EMAIL` | Target email address to receive contact submissions |
| `CAPTCHA_SECRET_KEY` | Cloudflare Turnstile Secret Key |

### 2. AWS API Gateway Configuration
1. Create an HTTP/REST API Gateway pointing to the Lambda function resource (`/contact`).
2. Configure CORS settings:
   * **Allowed Origin:** `https://j-peralva.github.io`
   * **Allowed Headers:** `Content-Type`
   * **Allowed Methods:** `POST, OPTIONS`
3. Enable Throttling / Rate-Limiting rules to protect the endpoint.

---

## 🚀 Scalability & Migration Path

Currently, Google SMTP App Passwords provide optimal performance for portfolio contact volumes. Should traffic increase significantly, the architecture can be seamlessly migrated to **AWS SES (Simple Email Service)** or **Resend** by replacing the SMTP block in `lambda_function.py` with the corresponding SDK/HTTP endpoint, keeping the validation layer intact.