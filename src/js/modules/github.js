export async function loadGitHubActivity() {
    const username = 'j-peralva'; 
    const activityEl = document.getElementById('github-activity');
    if (!activityEl) return;

    const cacheKey = 'gh_activity_cache';
    const cacheTimeKey = 'gh_activity_time';
    const cacheTTL = 15 * 60 * 1000;

    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);

    if (cachedData && cachedTime && (Date.now() - Number(cachedTime) < cacheTTL)) {
        activityEl.innerHTML = cachedData;
        return;
    }

    try {
        const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public`);
        
        if (eventsRes.ok) {
            const events = await eventsRes.json();
            const pushEvent = events.find(e => e.type === 'PushEvent' && e.payload && e.payload.commits && e.payload.commits.length > 0);
            
            if (pushEvent) {
                const repoName = pushEvent.repo.name.split('/')[1] || pushEvent.repo.name;
                const commitMsg = pushEvent.payload.commits[pushEvent.payload.commits.length - 1].message;
                const truncatedMsg = commitMsg.length > 40 ? commitMsg.substring(0, 40) + '...' : commitMsg;
                
                const htmlContent = `⚡ Último commit público em <a href="https://github.com/${pushEvent.repo.name}" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: none; font-weight: 600;">${repoName}</a>: <em>"${truncatedMsg}"</em>`;
                
                activityEl.innerHTML = htmlContent;
                localStorage.setItem(cacheKey, htmlContent);
                localStorage.setItem(cacheTimeKey, Date.now().toString());
                return;
            }
        }

        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=1`);
        if (reposRes.ok) {
            const repos = await reposRes.json();
            if (repos.length > 0) {
                const lastRepo = repos[0];
                const htmlContent = `⚡ Projeto público recente: <a href="${lastRepo.html_url}" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: none; font-weight: 600;">${lastRepo.name}</a>`;
                
                activityEl.innerHTML = htmlContent;
                localStorage.setItem(cacheKey, htmlContent);
                localStorage.setItem(cacheTimeKey, Date.now().toString());
                return;
            }
        }

        activityEl.innerHTML = '⚡ Perfil ativo no GitHub';
    } catch (err) {
        activityEl.innerHTML = '⚡ Perfil no GitHub: github.com/j-peralva';
    }
}
