import './css/main.css';
import { initFooterYear } from './js/utils/dom.js';
import { initModalListeners } from './js/modules/modal.js';
import { initSpotlight } from './js/modules/spotlight.js';
import { loadGitHubActivity } from './js/modules/github.js';
import { initContactForm } from './js/modules/contact.js';
import { initTechFilter } from './js/modules/tech-filter.js';

document.addEventListener('DOMContentLoaded', () => {
  initFooterYear();
  initModalListeners();
  initSpotlight();
  initTechFilter();
  loadGitHubActivity();
  initContactForm();
});
