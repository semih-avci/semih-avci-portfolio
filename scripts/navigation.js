(() => {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const toggle = nav.querySelector('.nav-toggle');
    const button = nav.querySelector('.nav-burger');
    const links = nav.querySelector('.nav-links');
    const compact = window.matchMedia('(max-width: 1199px)');
    nav.setAttribute('aria-label', 'Navigation principale');
    links.id = 'site-menu';
    button.setAttribute('role', 'button');
    button.tabIndex = 0;
    button.setAttribute('aria-controls', links.id);
    nav.querySelectorAll('a.active').forEach(link => link.setAttribute('aria-current', 'page'));

    const sync = () => {
        const open = compact.matches && toggle.checked;
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
        links.inert = compact.matches && !open;
        document.documentElement.classList.toggle('site-menu-open', open);
    };
    toggle.addEventListener('change', sync);
    button.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggle.checked = !toggle.checked;
            sync();
        }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle.checked) {
            toggle.checked = false;
            sync();
            button.focus();
        }
    });
    document.addEventListener('click', event => {
        if (!nav.contains(event.target) && toggle.checked) {
            toggle.checked = false;
            sync();
        }
    });
    compact.addEventListener('change', () => {
        toggle.checked = false;
        sync();
    });
    sync();
})();
