document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const activeLink = nav?.querySelector('[aria-current="page"]');

    if (nav && activeLink && nav.scrollWidth > nav.clientWidth) {
        const targetScrollLeft = activeLink.offsetLeft - (nav.clientWidth / 2) + (activeLink.offsetWidth / 2);
        nav.scrollLeft = Math.max(0, targetScrollLeft);
    }

    const experienceTabs = document.querySelectorAll('.experience-tab');
    const experiencePanels = document.querySelectorAll('[role="tabpanel"]');

    experienceTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const selectedPanel = document.getElementById(tab.getAttribute('aria-controls'));

            experienceTabs.forEach((item) => {
                const isSelected = item === tab;
                item.classList.toggle('is-active', isSelected);
                item.setAttribute('aria-selected', isSelected);
            });

            experiencePanels.forEach((panel) => {
                panel.hidden = panel !== selectedPanel;
            });
        });
    });
});
