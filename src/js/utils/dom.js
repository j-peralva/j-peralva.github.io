export function initFooterYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

export function copyEmail(email) {
    navigator.clipboard.writeText(email).then(() => {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    }).catch(err => console.error('Erro ao copiar e-mail:', err));
}
