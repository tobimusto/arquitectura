const projectsData = {
    'el-canton': {
        title: 'El Cantón',
        subtitle: 'El Cantón, Puertos',
        hero: 'image_144', // Fallback to image from index if cant find
        gallery: ['image_163', 'image_168', 'image_177', 'image_178']
    },
    'cardales': {
        title: 'El Campo Cardales 071',
        subtitle: 'El Campo Cardales, Los Cardales',
        hero: 'image_195',
        gallery: ['image_183', 'image_186', 'image_200']
    },
    'tipas': {
        title: 'Nordelta, Tipas',
        subtitle: 'Nordelta, Tipas',
        hero: 'image_189',
        gallery: ['image_176', 'image_167', 'image_180']
    },
    'el-campo-1': {
        title: 'El Campo Cardales I',
        subtitle: 'El Campo Cardales, Los Cardales',
        hero: 'image_171',
        gallery: ['image_188', 'image_215', 'image_174']
    },
    'el-campo-3': {
        title: 'El Campo Cardales III',
        subtitle: 'El Campo Cardales, Los Cardales',
        hero: 'image_216',
        gallery: ['image_204', 'image_206', 'image_217']
    },
    'el-campo-2': {
        title: 'El Campo Cardales II',
        subtitle: 'El Campo Cardales, Los Cardales',
        hero: 'image_205',
        gallery: ['image_207', 'image_229', 'image_228']
    },
    'castanos': {
        title: 'Nordelta Castaños',
        subtitle: 'Castaños, Nordelta',
        hero: 'image_159',
        gallery: ['image_185', 'image_192', 'image_193']
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Inject modal HTML
    const modalHTML = `
        <div id="project-modal" class="modal-overlay">
            <div class="modal-content">
                <button id="modal-close" class="modal-close">&times;</button>
                <div class="modal-hero">
                    <img id="modal-hero-img" src="" alt="Hero">
                    <div class="modal-hero-overlay"></div>
                    <div class="modal-info">
                        <h2 id="modal-title" class="modal-title"></h2>
                        <p id="modal-subtitle" class="modal-subtitle"></p>
                    </div>
                </div>
                <div id="modal-gallery" class="modal-gallery">
                    <!-- Gallery images will be injected here -->
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close');
    const heroImg = document.getElementById('modal-hero-img');
    const titleEl = document.getElementById('modal-title');
    const subtitleEl = document.getElementById('modal-subtitle');
    const galleryEl = document.getElementById('modal-gallery');

    function openModal(projectId) {
        const data = projectsData[projectId];
        if (!data) return;

        // Try to fetch original source from the index HTML link or fallback to a placeholder/id
        heroImg.src = data.hero;
        titleEl.textContent = data.title;
        subtitleEl.textContent = data.subtitle;

        galleryEl.innerHTML = '';
        data.gallery.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.loading = 'lazy';
            galleryEl.appendChild(img);
        });

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Intercept project links
    const projectLinks = document.querySelectorAll('a[href^="/proyectos/"]');
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = new URL(link.href);
            const projectId = url.pathname.split('/').pop();
            
            // Get the image source from the thumbnail inside the link to use as hero
            const img = link.querySelector('img');
            if (img && img.src) {
                if (projectsData[projectId]) {
                    projectsData[projectId].hero = img.src;
                }
            }

            // Get thumbnail srcset for gallery to have high quality
            if (img && img.srcset) {
                const parts = img.srcset.split(',');
                // take a few highest res images
                const res = parts[parts.length - 1].trim().split(' ')[0];
                if (projectsData[projectId]) {
                     // Just use the high res hero as a demo gallery since we don't have all original subpage images downloaded
                    projectsData[projectId].gallery = [res, res, res]; 
                }
            }

            openModal(projectId);
        });
    });
});
