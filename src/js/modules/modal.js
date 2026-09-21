import { loadTurnstileScript } from './contact.js';

let lastActiveElement = null;

export function openModal(id) {
    if (id === 'modal-contact') {
        loadTurnstileScript();
    }

    lastActiveElement = document.activeElement;
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }, 10);
}

export function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        if (lastActiveElement) lastActiveElement.focus();
    }, 300);
}

export function closeModalOutside(event, id) {
    if (event.target.classList.contains('modal-overlay')) {
        closeModal(id);
    }
}

export function initModalListeners() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

if (typeof window !== 'undefined') {
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.closeModalOutside = closeModalOutside;
}
