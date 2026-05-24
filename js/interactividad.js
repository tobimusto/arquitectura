document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar dinámico con transición suave
    const header = document.querySelector('header');
    // La transición ya está en CSS (animaciones.css), el JS solo agrega/quita la clase
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // 2. Carrusel Principal (Hero Slider)
    const heroSection = document.querySelector('section[aria-label="Destacados"]');
    if (heroSection) {
        const slidesContainer = heroSection.querySelector('div[aria-live="polite"]');
        // Solo los divs que TIENEN una imagen (descartar overlays de gradiente)
        const slides = Array.from(slidesContainer.querySelectorAll(':scope > div')).filter(d => d.querySelector('img'));
        
        // Obtenemos los botones dots
        const dotsContainer = heroSection.querySelector('.flex.items-center.gap-2');
        let dots = [];
        if (dotsContainer) {
            dots = Array.from(dotsContainer.querySelectorAll('button'));
        }

        // Flechas
        const arrowBtns = heroSection.querySelectorAll('button.rounded-full');
        const prevBtn = arrowBtns[0]; // asumiendo que el primero es prev
        const nextBtn = arrowBtns[1]; // el segundo es next

        let currentSlide = 0;
        let slideInterval;

        function goToSlide(index) {
            // normalizar índice circularmente
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            // limpiar activos
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => {
                d.classList.remove('active', 'bg-white');
                d.classList.add('bg-white/30');
            });

            // establecer nuevo activo
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            
            if (dots[currentSlide]) {
                dots[currentSlide].classList.remove('bg-white/30');
                dots[currentSlide].classList.add('active', 'bg-white');
            }
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        // Inicializar clases
        slides.forEach(s => s.classList.add('hero-slide'));
        dots.forEach((dot, idx) => {
            dot.classList.add('hero-dot');
            dot.addEventListener('click', () => {
                goToSlide(idx);
                resetInterval();
            });
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }

        goToSlide(0);
        resetInterval();
    }

    // 4. Animaciones Fade-Up al Scrollear (Intersection Observer)
    // Agregamos la clase reveal-up a varios elementos de interés que no la tengan
    const elementsToReveal = document.querySelectorAll(`
        section h2, 
        section h3, 
        section p, 
        .grid > div,
        .gallery-scroll-container > div
    `);

    elementsToReveal.forEach((el, index) => {
        // No animar elementos del hero o modales
        if (el.closest('section[aria-label="Destacados"]') || el.closest('.modal-overlay') || el.tagName === 'HEADER') return;
        
        el.classList.add('reveal-up');
        // stagger effects based on visual order
        if (index % 3 === 1) el.classList.add('delay-100');
        if (index % 3 === 2) el.classList.add('delay-200');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => {
        observer.observe(el);
    });

    // ======================================================
    // 5. CARRUSEL DE OBRAS (Galería)
    // ======================================================
    const obrasCarousel = document.querySelector('[aria-label="Galer\u00EDa de im\u00E1genes"]');
    if (obrasCarousel) {
        const track = obrasCarousel.querySelector('.-ml-4.flex');
        const slides = Array.from(track ? track.children : []);

        if (slides.length > 1) {
            // 1. Fix aspect-ratio de cada slide (reemplaza Tailwind aspect-[16/9])
            slides.forEach(slide => {
                const btn = slide.querySelector('button');
                if (btn) btn.classList.add('obras-slide-btn');
            });

            // 2. Envolver el track en un contenedor relativo para las flechas
            const wrapper = obrasCarousel.querySelector('.overflow-hidden.rounded-2xl');
            if (wrapper) wrapper.style.position = 'relative';

            // 3. Crear flechas prev/next
            const prevArrow = document.createElement('button');
            prevArrow.className = 'obras-arrow prev';
            prevArrow.setAttribute('aria-label', 'Imagen anterior');
            prevArrow.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;

            const nextArrow = document.createElement('button');
            nextArrow.className = 'obras-arrow next';
            nextArrow.setAttribute('aria-label', 'Imagen siguiente');
            nextArrow.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

            if (wrapper) {
                wrapper.appendChild(prevArrow);
                wrapper.appendChild(nextArrow);
            }

            // 4. Crear dots
            const dotsWrap = document.createElement('div');
            dotsWrap.className = 'obras-dots';
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'obras-dot';
                dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
                dotsWrap.appendChild(dot);
            });
            obrasCarousel.appendChild(dotsWrap);
            const dots = Array.from(dotsWrap.querySelectorAll('.obras-dot'));

            // 5. Lógica de navegación
            let current = 0;
            let autoTimer;

            function goTo(idx) {
                if (idx < 0) idx = slides.length - 1;
                if (idx >= slides.length) idx = 0;
                current = idx;

                // Mover el track con translate
                track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                track.style.transform = `translateX(calc(-${current * 100}% - ${current}rem))`;

                // Actualizar dots
                dots.forEach((d, i) => d.classList.toggle('active', i === current));
            }

            function resetAuto() {
                clearInterval(autoTimer);
                autoTimer = setInterval(() => goTo(current + 1), 4000);
            }

            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => { goTo(i); resetAuto(); });
            });
            prevArrow.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
            nextArrow.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

            // Touch/swipe support
            let touchStartX = 0;
            track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
            track.addEventListener('touchend', e => {
                const diff = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); resetAuto(); }
            }, { passive: true });

            // Inicializar
            goTo(0);
            resetAuto();
        }
    }
});
