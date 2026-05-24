/**
 * Lenis Smooth Scroll - exactamente igual que en demo-detailedcenter
 * Se usa lenis.min.js que ya está en la carpeta js/
 */
(function () {
    /* ---------- Lenis smooth scroll ---------- */
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });
        window.__lenis = lenis;
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
        document.documentElement.classList.add('lenis');
    } else {
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    const smoothScrollTo = (targetY) => {
        if (lenis) {
            lenis.scrollTo(targetY, { offset: -80 });
        } else {
            window.scrollTo({ top: targetY - 80, behavior: 'smooth' });
        }
    };

    // Anchor links del menú
    document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href').replace('/', '');
            if (!href || href === '#') return;
            const el = document.querySelector(href);
            if (!el) return;
            e.preventDefault();
            const top = el.getBoundingClientRect().top + window.scrollY;
            smoothScrollTo(top);
        });
    });

    // Asegurarse de que el modal no tenga conflicto con Lenis
    const modalEl = document.getElementById('project-modal');
    if (modalEl) {
        modalEl.addEventListener('mouseenter', () => {
            if (lenis) lenis.stop();
        });
        modalEl.addEventListener('mouseleave', () => {
            if (lenis) lenis.start();
        });
    }
})();
