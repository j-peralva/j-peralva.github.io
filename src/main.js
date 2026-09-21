import './css/main.css';
import { initFooterYear, copyEmail } from './js/utils/dom.js';
import { initSpotlight } from './js/modules/spotlight.js';
import { loadGitHubActivity } from './js/modules/github.js';

window.copyEmail = copyEmail;

document.addEventListener('DOMContentLoaded', () => {
    initFooterYear();
    initSpotlight();
    loadGitHubActivity();
});
