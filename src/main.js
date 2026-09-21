import './css/main.css';
import { initFooterYear, copyEmail } from './js/utils/dom.js';
import { initModalListeners, openModal, closeModal, closeModalOutside } from './js/modules/modal.js';
import { initSpotlight } from './js/modules/spotlight.js';
import { loadGitHubActivity } from './js/modules/github.js';
import { initContactForm } from './js/modules/contact.js';

// Funções expostas para chamadas via onclick no HTML
window.copyEmail = copyEmail;
window.openModal = openModal;
window.closeModal = closeModal;
window.closeModalOutside = closeModalOutside;

document.addEventListener('DOMContentLoaded', () => {
    initFooterYear();
    initModalListeners();
    initSpotlight();
    loadGitHubActivity();
    initContactForm();
});
