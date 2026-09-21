const LAMBDA_URL = 'https://fkjx2ewiyx7jebu4ic62amtjle0unjjv.lambda-url.us-east-1.on.aws/';

const LIMITS = {
  name: 100,
  email: 120,
  subject: 150,
  message: 3000
};

export function loadTurnstileScript() {
  if (document.querySelector('script[src*="turnstile"]')) return;
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

export function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const nameInput = form.querySelector('[name="name"]');
  const emailInput = form.querySelector('[name="email"]');
  const subjectInput = form.querySelector('[name="subject"]');
  const messageInput = form.querySelector('[name="message"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  if (nameInput) { nameInput.required = true; nameInput.maxLength = LIMITS.name; }
  if (emailInput) { emailInput.required = true; emailInput.maxLength = LIMITS.email; emailInput.type = 'email'; }
  if (subjectInput) { subjectInput.maxLength = LIMITS.subject; }

  if (messageInput) {
    messageInput.required = true;
    messageInput.maxLength = LIMITS.message;

    let counterContainer = form.querySelector('#message-char-counter');
    if (!counterContainer) {
      counterContainer = document.createElement('small');
      counterContainer.id = 'message-char-counter';
      counterContainer.style.cssText = 'display: block; text-align: right; margin-top: 4px; opacity: 0.7; font-size: 0.8rem;';
      messageInput.parentNode.insertBefore(counterContainer, messageInput.nextSibling);
    }

    const updateCounter = () => {
      const current = messageInput.value.length;
      counterContainer.textContent = `${current} /${LIMITS.message} caracteres`;
      counterContainer.style.color = current >= LIMITS.message ? '#ff4d4d' : 'inherit';
    };

    messageInput.addEventListener('input', updateCounter);
    updateCounter();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const subject = subjectInput?.value.trim() || 'Contato via Personal Hub';
    const message = messageInput?.value.trim() || '';

    const captchaInput = form.querySelector('[name="cf-turnstile-response"]');
    const captchaToken = captchaInput ? captchaInput.value : '';

    if (!name || !email || !message) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome, E-mail e Mensagem).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    if (message.length > LIMITS.message) {
      alert(`Sua mensagem excede o limite máximo de ${LIMITS.message} caracteres.`);
      return;
    }

    if (!captchaToken) {
      alert('Por favor, conclua a verificação de segurança (CAPTCHA) antes de enviar.');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
    }

    try {
      const response = await fetch(LAMBDA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          captchaToken
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Mensagem enviada com sucesso! Em breve entrarei em contato.');
        form.reset();
        if (messageInput) {
          const counter = form.querySelector('#message-char-counter');
          if (counter) counter.textContent = `0 / ${LIMITS.message} caracteres`;
        }
      } else {
        alert(`Erro ao enviar: ${result.error || 'Ocorreu uma falha no servidor.'}`);
      }
    } catch (err) {
      console.error('Erro no envio:', err);
      alert('Não foi possível se conectar ao servidor de e-mail. Verifique sua conexão.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || 'Enviar';
      }
    }
  });
}
