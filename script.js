document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const activeLink = nav?.querySelector('[aria-current="page"]');

    if (nav && activeLink && nav.scrollWidth > nav.clientWidth) {
        const targetScrollLeft = activeLink.offsetLeft - (nav.clientWidth / 2) + (activeLink.offsetWidth / 2);
        nav.scrollLeft = Math.max(0, targetScrollLeft);
    }

    const subpageHeaderTargets = document.querySelectorAll('body:not(.home-page) header > :not(nav)');
    const subpageContentTargets = document.querySelectorAll(
        'body:not(.home-page) main section, body:not(.home-page) main .education-card, body:not(.home-page) main .project-card'
    );

    subpageHeaderTargets.forEach((target) => {
        target.classList.add('animate__animated', 'animate__slideInUp', 'page-load-reveal');
    });

    subpageContentTargets.forEach((target) => {
        target.classList.add('animate__animated', 'animate__fadeInUp', 'page-load-reveal');
    });

    const homeNav = document.querySelector('.home-main-nav');
    const homeTitle = document.querySelector('.home-page-title');
    const homeAbout = document.querySelector('.home-about');
    const hero = document.querySelector('.hero');
    const scrollPrompt = document.querySelector('.scroll-prompt');

    if (homeNav && homeTitle && homeAbout && hero) {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        const shouldOpenAboutDirectly = window.location.hash === '#about-me';

        if (!shouldOpenAboutDirectly) {
            window.scrollTo(0, 0);
            window.addEventListener('load', () => window.scrollTo(0, 0), { once: true });
        }

        let hasRevealedHomeContent = false;
        let hasHiddenHero = false;
        let hasStartedHeroExit = false;
        let isAbsorbingEntryMomentum = false;
        let heroExitFallback = null;
        let entryMomentumFallback = null;
        let touchStartY = null;

        const enterHomePage = () => {
            if (hasStartedHeroExit || hasRevealedHomeContent) {
                return;
            }

            hasStartedHeroExit = true;
            document.body.classList.add('is-entering-home');
            revealHomeContent();
            hero.classList.add('animate__animated', 'animate__fadeOutUp');
            removeHeroScrollAndKeyboardTriggers();
            heroExitFallback = window.setTimeout(hideHero, 850);
        };

        const revealHomeContent = () => {
            if (hasRevealedHomeContent) {
                return;
            }

            hasRevealedHomeContent = true;
            document.body.classList.add('has-revealed-home');
            homeNav.classList.add('is-revealed', 'animate__animated', 'animate__slideInUp');
            homeTitle.classList.add('is-revealed', 'animate__animated', 'animate__slideInUp', 'page-load-reveal');
            homeAbout.classList.add('is-revealed', 'animate__animated', 'animate__slideInUp', 'page-load-reveal');
            requestAnimationFrame(() => window.scrollTo(0, 0));
        };

        const hideHero = () => {
            if (hasHiddenHero) {
                return;
            }

            hasHiddenHero = true;
            document.body.classList.remove('is-entering-home');
            document.body.classList.add('has-entered-home');
            window.clearTimeout(heroExitFallback);
            requestAnimationFrame(() => window.scrollTo(0, 0));

            if (shouldOpenAboutDirectly) {
                removeHeroEntryListeners();
                return;
            }

            isAbsorbingEntryMomentum = true;
            document.body.classList.add('is-settling-home');
            entryMomentumFallback = window.setTimeout(() => {
                isAbsorbingEntryMomentum = false;
                document.body.classList.remove('is-settling-home');
                removeHeroEntryListeners();
                window.scrollTo(0, 0);
            }, 350);
        };

        const showAboutDirectly = () => {
            hasStartedHeroExit = true;
            revealHomeContent();
            hideHero();
        };

        hero.addEventListener('animationend', (event) => {
            if (event.target === hero && hero.classList.contains('animate__fadeOutUp')) {
                hideHero();
            }
        });

        hero.addEventListener('animationcancel', hideHero);

        const revealAfterHeroLeaves = () => {
            const heroBottom = hero.offsetTop + hero.offsetHeight;

            if (window.scrollY >= heroBottom - 2) {
                enterHomePage();
            }
        };

        const handleWheelEntry = (event) => {
            if (hasStartedHeroExit && (!hasHiddenHero || isAbsorbingEntryMomentum)) {
                event.preventDefault();
                window.scrollTo(0, 0);
                return;
            }

            if (event.deltaY > 0) {
                event.preventDefault();
                enterHomePage();
            }
        };

        const handleTouchStart = (event) => {
            touchStartY = event.touches[0].clientY;
        };

        const handleTouchMoveEntry = (event) => {
            if (hasStartedHeroExit && (!hasHiddenHero || isAbsorbingEntryMomentum)) {
                event.preventDefault();
                window.scrollTo(0, 0);
                return;
            }

            if (touchStartY === null) {
                return;
            }

            const touchCurrentY = event.touches[0].clientY;

            if (touchStartY - touchCurrentY > 20) {
                event.preventDefault();
                enterHomePage();
            }
        };

        const handleKeyboardEntry = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                enterHomePage();
            }
        };

        function removeHeroScrollAndKeyboardTriggers() {
            window.removeEventListener('scroll', revealAfterHeroLeaves);
            window.removeEventListener('keydown', handleKeyboardEntry);
        }

        function removeHeroEntryListeners() {
            window.clearTimeout(entryMomentumFallback);
            removeHeroScrollAndKeyboardTriggers();
            window.removeEventListener('wheel', handleWheelEntry);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMoveEntry);
            document.body.classList.remove('is-settling-home');
        }

        if (shouldOpenAboutDirectly) {
            showAboutDirectly();
        } else {
            window.addEventListener('scroll', revealAfterHeroLeaves, { passive: true });
            window.addEventListener('wheel', handleWheelEntry, { passive: false });
            window.addEventListener('touchstart', handleTouchStart, { passive: true });
            window.addEventListener('touchmove', handleTouchMoveEntry, { passive: false });
            window.addEventListener('keydown', handleKeyboardEntry);
        }

        scrollPrompt?.addEventListener('click', (event) => {
            event.preventDefault();
            enterHomePage();
        });
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
