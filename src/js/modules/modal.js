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
  requestAnimationFrame(() => {
    modal.classList.add('active');
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  });
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

export function initModalListeners() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-target]');
    if (trigger) {
      const targetId = trigger.getAttribute('data-modal-target');
      openModal(targetId);
      return;
    }

    const closeBtn = e.target.closest('[data-modal-close]');
    if (closeBtn) {
      const modal = closeBtn.closest('.modal-overlay');
      if (modal) closeModal(modal.id);
      return;
    }

    if (e.target.classList.contains('modal-overlay')) {
      closeModal(e.target.id);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach((modal) => {
        closeModal(modal.id);
      });
    }
  });
}
