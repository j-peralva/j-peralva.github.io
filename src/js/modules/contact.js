const API_URL = import.meta.env.VITE_API_URL;

const LIMITS = {
  name: 100,
  email: 120,
  subject: 150,
  message: 3000
};

// Função para exibir a notificação no canto inferior direito
function showNotification(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 10000; pointer-events: none;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? '#10b981' : '#ef4444'; // Verde para sucesso, vermelho para erro
  toast.style.cssText = `background: ${bgColor}; color: #ffffff; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: inherit; font-size: 0.9rem; font-weight: 500; opacity: 0; transform: translateY(20px); transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); pointer-events: auto;`;
  toast.textContent = message;

  container.appendChild(toast);

  // Animação de entrada
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
  });

  // Remove após 4 segundos
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

export function loadTurnstileScript() {
  if (document.querySelector('script[src*="turnstile"]')) return;
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

function getFormInputs(form) {
  if (!form) return {};
  return {
    nameInput: form.querySelector('#contact-name, [name="name"]'),
    emailInput: form.querySelector('#contact-email, [name="email"]'),
    subjectInput: form.querySelector('#contact-subject, [name="subject"]'),
    messageInput: form.querySelector('#contact-message, [name="message"]'),
    submitBtn: form.querySelector('button[type="submit"]')
  };
}

function setupFormAttributes(form) {
  if (!form) return;
  const { nameInput, emailInput, subjectInput, messageInput } = getFormInputs(form);

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

    const current = messageInput.value.length;
    counterContainer.textContent = `${current} / ${LIMITS.message} caracteres`;
    counterContainer.style.color = current >= LIMITS.message ? '#ff4d4d' : 'inherit';
  }
}

export function initContactForm() {
  document.addEventListener('input', (e) => {
    const form = e.target.closest('#contact-form');
    if (form) setupFormAttributes(form);
  });

  document.addEventListener('focusin', (e) => {
    const form = e.target.closest('#contact-form');
    if (form) setupFormAttributes(form);
  });

  const initialForm = document.querySelector('#contact-form');
  if (initialForm) setupFormAttributes(initialForm);

  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('#contact-form');
    if (!form) return;

    e.preventDefault();
    setupFormAttributes(form);

    const { nameInput, emailInput, subjectInput, messageInput, submitBtn } = getFormInputs(form);

    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const subject = subjectInput?.value.trim() || 'Contato via Personal Hub';
    const message = messageInput?.value.trim() || '';

    const captchaInput = form.querySelector('[name="cf-turnstile-response"]');
    const captchaToken = captchaInput ? captchaInput.value : '';

    if (!name || !email || !message) {
      showNotification('Preencha todos os campos obrigatórios.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Por favor, insira um e-mail válido.', 'error');
      return;
    }

    if (message.length > LIMITS.message) {
      showNotification(`A mensagem excede o limite de ${LIMITS.message} caracteres.`, 'error');
      return;
    }

    if (!captchaToken) {
      showNotification('Conclua a verificação de segurança (CAPTCHA).', 'error');
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
        body: JSON.stringify({ name, email, subject, message, captchaToken })
      });

      const result = await response.json();

      if (response.ok) {
        showNotification('Mensagem enviada com sucesso!', 'success');
        form.reset();
        const counter = form.querySelector('#message-char-counter');
        if (counter) counter.textContent = `0 / ${LIMITS.message} caracteres`;
      } else {
        showNotification(`Erro: ${result.error || 'Falha no servidor.'}`, 'error');
      }
    } catch (err) {
      console.error('Erro no envio:', err);
      showNotification('Falha de conexão. Tente novamente mais tarde.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || 'Enviar';
      }
    }
  });
}
