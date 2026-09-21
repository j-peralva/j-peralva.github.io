let turnstileLoaded = false;

export function loadTurnstileScript() {
    if (turnstileLoaded || document.getElementById('turnstile-script')) return;

    const script = document.createElement('script');
    script.id = 'turnstile-script';
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    turnstileLoaded = true;
}

export function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const captchaInput = form.querySelector('[name="cf-turnstile-response"], [name="g-recaptcha-response"]');
        const captchaToken = captchaInput ? captchaInput.value : '';

        if (!captchaToken) {
            alert('Por favor, complete a verificação do CAPTCHA.');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        const payload = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value,
            captchaToken: captchaToken
        };

        const LAMBDA_API_URL = 'https://fkjx2ewiyx7jebu4ic62amtjle0unjjv.lambda-url.us-east-1.on.aws/';

        try {
            const res = await fetch(LAMBDA_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const toast = document.getElementById('toast');
                if (toast) {
                    toast.textContent = 'Mensagem enviada com sucesso!';
                    toast.classList.add('show');
                    setTimeout(() => toast.classList.remove('show'), 3000);
                }
                form.reset();
                if (window.closeModal) window.closeModal('modal-contact');
            } else {
                const errData = await res.json();
                throw new Error(errData.error || 'Falha na resposta do servidor.');
            }
        } catch (err) {
            alert(`Erro ao enviar: ${err.message}`);
            console.error('Erro de envio:', err);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}
