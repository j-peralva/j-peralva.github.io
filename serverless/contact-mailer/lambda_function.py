import json
import os
import smtplib
import ssl
import urllib.parse
import urllib.request
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

ALLOWED_ORIGIN = "https://j-peralva.github.io"
MAX_NAME_LENGTH = 100
MAX_EMAIL_LENGTH = 120
MAX_SUBJECT_LENGTH = 150
MAX_MESSAGE_LENGTH = 3000

def build_response(status_code: int, payload: dict) -> dict:
    return {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
            "Content-Type": "application/json"
        },
        "body": json.dumps(payload)
    }

def verify_captcha(token: str) -> bool:
    secret_key = os.environ.get("CAPTCHA_SECRET_KEY")
    if not secret_key:
        return True  # Modo permissivo caso a chave não esteja configurada

    url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    data = urllib.parse.urlencode({
        'secret': secret_key,
        'response': token
    }).encode('utf-8')

    try:
        req = urllib.request.Request(url, data=data, method="POST")
        with urllib.request.urlopen(req, timeout=5) as response:
            result = json.loads(response.read().decode('utf-8'))
            return bool(result.get("success", False))
    except Exception as err:
        print(f"[SECURITY ALERT] Falha ao verificar token Turnstile: {err}")
        return False

def lambda_handler(event: dict, context) -> dict:
    http_method = event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method")

    # Tratamento de preflight CORS
    if http_method == "OPTIONS":
        return build_response(200, {"message": "Preflight OK"})

    if http_method != "POST":
        return build_response(405, {"error": "Método não permitido."})

    try:
        raw_body = event.get("body", "{}")
        body = json.loads(raw_body) if isinstance(raw_body, str) else raw_body

        name = str(body.get("name", "")).strip()
        email = str(body.get("email", "")).strip()
        subject = str(body.get("subject", "Contato via Hub Pessoal")).strip()
        message = str(body.get("message", "")).strip()
        captcha_token = str(body.get("captchaToken", "")).strip()

        # Validação de campos obrigatórios
        if not name or not email or not message:
            return build_response(400, {"error": "Nome, e-mail e mensagem são obrigatórios."})

        # Prevenção contra abusos de tamanho de payload
        if (len(name) > MAX_NAME_LENGTH or 
            len(email) > MAX_EMAIL_LENGTH or 
            len(subject) > MAX_SUBJECT_LENGTH or 
            len(message) > MAX_MESSAGE_LENGTH):
            return build_response(400, {"error": "Limite de caracteres excedido."})

        # Validação do CAPTCHA anti-bot
        if not captcha_token or not verify_captcha(captcha_token):
            return build_response(403, {"error": "Validação de segurança (CAPTCHA) reprovada."})

        # Variáveis de ambiente configuradas na AWS
        smtp_user = os.environ.get("GMAIL_USER")
        smtp_pass = os.environ.get("GMAIL_APP_PASS")
        recipient = os.environ.get("RECIPIENT_EMAIL", smtp_user)

        if not smtp_user or not smtp_pass:
            print("[CRITICAL] Variáveis GMAIL_USER ou GMAIL_APP_PASS ausentes.")
            return build_response(500, {"error": "Serviço de e-mail não configurado."})

        # Construção da mensagem SMTP
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = recipient
        msg['Subject'] = f"[Hub Contact] {subject} - {name}"
        msg['Reply-To'] = email

        email_body = (
            f"Novo contato recebido pelo Hub Pessoal:\n\n"
            f"Remetente: {name} <{email}>\n"
            f"Assunto: {subject}\n"
            f"----------------------------------------\n"
            f"Mensagem:\n{message}\n"
        )
        msg.attach(MIMEText(email_body, 'plain', 'utf-8'))

        # Disparo seguro via SSL (porta 465)
        context_ssl = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context_ssl, timeout=10) as server:
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, recipient, msg.as_string())

        return build_response(200, {"message": "Mensagem entregue com sucesso!"})

    except json.JSONDecodeError:
        return build_response(400, {"error": "Payload JSON inválido."})
    except Exception as e:
        print(f"[ERROR] Falha na execução da Lambda: {e}")
        # Resposta genérica para não vazar stack trace ao cliente
        return build_response(500, {"error": "Ocorreu um erro interno ao processar o contato."})
