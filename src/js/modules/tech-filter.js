export function filterTechs() {
    const input = document.getElementById('tech-search');
    if (!input) return;
    const query = input.value.toLowerCase().trim();
    document.querySelectorAll('.tech-badge').forEach(badge => {
        const match = badge.textContent.toLowerCase().includes(query);
        badge.classList.toggle('hidden', !match);
    });
}

export function initTechFilter() {
    const input = document.getElementById('tech-search');
    if (input) {
        input.addEventListener('input', filterTechs);
    }
    window.filterTechs = filterTechs;
}
