document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main section[id]');
    const sectionLinkMap = {};

    navLinks.forEach(link => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            sectionLinkMap[targetId.slice(1)] = link;
        }

        link.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    event.preventDefault();
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    navLinks.forEach(item => item.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    function setActiveLink(sectionId) {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + sectionId);
        });
    }

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60% 0px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    } else {
        function updateActiveLink() {
            let currentSectionId = '';

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 120 && rect.bottom > 120) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            if (currentSectionId) {
                setActiveLink(currentSectionId);
            }
        }

        updateActiveLink();
        window.addEventListener('scroll', updateActiveLink);
    }

    const visionTabs = document.querySelectorAll('.vision-tab');
    const visionCopies = document.querySelectorAll('.vision-copy');
    const visionScreens = document.querySelectorAll('.vision-screen-image');
    const telemetryRows = document.querySelectorAll('.telemetry-row');

    function setVisionActive(activeKey, activeTab) {
        visionTabs.forEach(tab => {
            const isActive = tab === activeTab || tab.dataset.visionTab === activeKey;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        visionCopies.forEach(copy => {
            const match = copy.dataset.visionPanel === activeKey;
            copy.classList.toggle('vision-copy--active', match);
            copy.setAttribute('aria-hidden', match ? 'false' : 'true');
        });

        visionScreens.forEach(screen => {
            const match = screen.dataset.visionPanel === activeKey;
            screen.classList.toggle('vision-screen-active', match);
            screen.setAttribute('aria-hidden', match ? 'false' : 'true');
        });

        telemetryRows.forEach(row => {
            const match = row.dataset.visionPanel === activeKey;
            row.classList.toggle('hidden', !match);
        });
    }

    function initVisionTabs() {
        const initialTab = document.querySelector('.vision-tab.active') || visionTabs[0];
        const initialKey = initialTab ? initialTab.dataset.visionTab : (visionTabs[0] && visionTabs[0].dataset.visionTab);
        if (initialKey) setVisionActive(initialKey, initialTab);

        visionTabs.forEach((tab, idx) => {
            tab.addEventListener('click', function () {
                const activeKey = this.dataset.visionTab;
                setVisionActive(activeKey, this);
            });

            tab.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = visionTabs[(idx + 1) % visionTabs.length];
                    next.focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = visionTabs[(idx - 1 + visionTabs.length) % visionTabs.length];
                    prev.focus();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    visionTabs[0].focus();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    visionTabs[visionTabs.length - 1].focus();
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const activeKey = this.dataset.visionTab;
                    setVisionActive(activeKey, this);
                }
            });
        });
    }

    initVisionTabs();
});
