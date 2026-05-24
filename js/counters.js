
// ======================================================
// 6. CONTADOR ANIMADO — Sobre Nosotros (20+, 100%, 1:1)
// ======================================================
(function() {
    function animateCounter(el, target, duration) {
        const start = performance.now();
        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        };
        requestAnimationFrame(update);
    }

    function animateProgressBar(bar, duration) {
        const targetWidth = bar.dataset.width || '100%';
        bar.style.transition = 'width ' + duration + 'ms cubic-bezier(0.16, 1, 0.3, 1)';
        bar.getBoundingClientRect(); // forzar reflow
        bar.style.width = targetWidth;
    }

    document.addEventListener('DOMContentLoaded', function() {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                const section = entry.target;
                section.querySelectorAll('.stat-counter[data-target]').forEach(function(el, i) {
                    const target = parseInt(el.dataset.target, 10);
                    setTimeout(function() { animateCounter(el, target, 1200); }, i * 150);
                });
                section.querySelectorAll('.progress-bar-inner[data-width]').forEach(function(bar, i) {
                    setTimeout(function() { animateProgressBar(bar, 1400); }, i * 150 + 200);
                });
                statsObserver.unobserve(section);
            });
        }, { threshold: 0.3 });

        const nosotrosSection = document.getElementById('nosotros');
        if (nosotrosSection) statsObserver.observe(nosotrosSection);
    });
})();
