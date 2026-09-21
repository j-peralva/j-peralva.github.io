export function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Captura o token do Cloudflare Turnstile ou Google reCAPTCHA
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

        const LAMBDA_API_URL = 'https://SEU-ENDPOINT-LAMBDA.amazonaws.com/';

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
