document.addEventListener('DOMContentLoaded', () => {
    const masonryGrid = document.getElementById('masonry-grid');
    const videoTrack = document.querySelector('.video-track');
    const videoSlider = document.querySelector('.video-pinterest-slider');
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightboxBtn = document.getElementById('close-lightbox');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentActiveIndex = 1;
    const totalImages = 50;
    const totalVideos = 8; // Limitado exactamente a tus 8 videos requeridos
    
    // Metadatos adaptados e íntimos para Isa e Isabella
    const moodCaptions = [
        "In fleeting daylight — Isa", "Shadows against your skin", "The luxury of quiet hours",
        "Soft contours and heavy thoughts", "Fleeting frames, remembered", "Captured mid-laugh — Isa",
        "Echoes of gold light", "Moments before sunrise", "Editorial framework of Isabella",
        "A quiet, cinematic gaze", "Silhouette dynamics", "Postures of warmth and light"
    ];

    // 1. INYECCIÓN Y CONSTRUCCIÓN INTERACTIVA DE VIDEOS (Estilo Pinterest)
    function generateVideoSlider() {
        if (!videoTrack) return;
        let videoHTML = '';
        
        // Formatos asimétricos alternados para dar el look estético y fluido de Pinterest
        const videoSizes = [
            { w: '260px', h: '440px', mt: 'mt-0' },
            { w: '320px', h: '400px', mt: 'mt-8' },
            { w: '280px', h: '460px', mt: 'mt-2' },
            { w: '300px', h: '420px', mt: 'mt-12' },
            { w: '270px', h: '450px', mt: 'mt-0' },
            { w: '310px', h: '390px', mt: 'mt-6' },
            { w: '290px', h: '470px', mt: 'mt-4' },
            { w: '330px', h: '410px', mt: 'mt-10' }
        ];

        for (let i = 1; i <= totalVideos; i++) {
            const layout = videoSizes[(i - 1) % videoSizes.length];
            videoHTML += `
                <div class="video-card ${layout.mt} shrink-0 relative overflow-hidden rounded-2xl group cursor-pointer" style="width: ${layout.w};">
                    <video class="w-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none" style="height: ${layout.h};" loop muted playsinline poster="assets/img/gallery/${i}.jpg">
                        <source src="assets/video/${i}.mp4" type="video/mp4">
                    </video>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-between p-5 transition-opacity duration-300">
                        <div class="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-80 group-hover:opacity-100 self-end">
                            <span class="play-icon text-white text-xs">▶</span>
                        </div>
                        <div>
                            <span class="font-space text-[10px] tracking-widest text-rose-400 uppercase block mb-1">Clip #${i}</span>
                            <p class="font-sans text-xs italic text-white/80">Isa — Motion File</p>
                        </div>
                    </div>
                </div>
            `;
        }
        videoTrack.innerHTML = videoHTML;
        registerVideoInteractions();
        initializeInertialVideoSlider();
    }

    // Lógica para reproducir/pausar videos al hacer clic
    function registerVideoInteractions() {
        const videoCards = document.querySelectorAll('.video-card');
        videoCards.forEach(card => {
            card.addEventListener('click', () => {
                const video = card.querySelector('video');
                const playIcon = card.querySelector('.play-icon');
                
                if (video.paused) {
                    // Detener cualquier otro video antes de reproducir este
                    document.querySelectorAll('.video-card video').forEach(v => {
                        v.pause();
                        v.parentElement.querySelector('.play-icon').textContent = '▶';
                    });
                    
                    video.play();
                    playIcon.textContent = '⏸';
                } else {
                    video.pause();
                    playIcon.textContent = '▶';
                }
            });
        });
    }

    // Algoritmo de Física Remanente/Inercia para Arrastre del Carrusel de Videos
    function initializeInertialVideoSlider() {
        if (!videoSlider) return;
        let isDown = false;
        let startX;
        let scrollLeft;
        let velocity = 0;
        let frameId = 0;

        videoSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            videoSlider.classList.add('active');
            startX = e.pageX - videoSlider.offsetLeft;
            scrollLeft = videoSlider.scrollLeft;
            cancelAnimationFrame(frameId);
        });

        videoSlider.addEventListener('mouseleave', () => { isDown = false; });
        videoSlider.addEventListener('mouseup', () => {
            isDown = false;
            videoSlider.classList.remove('active');
            smoothInertiaLoop();
        });

        videoSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - videoSlider.offsetLeft;
            const walk = (x - startX) * 1.5;
            const prevScroll = videoSlider.scrollLeft;
            videoSlider.scrollLeft = scrollLeft - walk;
            velocity = videoSlider.scrollLeft - prevScroll;
        });

        // Soporte Mobile Touch
        videoSlider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - videoSlider.offsetLeft;
            scrollLeft = videoSlider.scrollLeft;
            cancelAnimationFrame(frameId);
        });
        videoSlider.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - videoSlider.offsetLeft;
            const walk = (x - startX) * 1.2;
            videoSlider.scrollLeft = scrollLeft - walk;
        });

        function smoothInertiaLoop() {
            if (Math.abs(velocity) > 0.5) {
                videoSlider.scrollLeft += velocity;
                velocity *= 0.93; // Nivel de fricción fluida
                frameId = requestAnimationFrame(smoothInertiaLoop);
            }
        }
    }

    // 2. CONSTRUCCIÓN DE CUADRÍCULA DE FOTOS (Mosaico Asimétrico)
    function generateGalleryStructure() {
        let internalHTML = '';
        
        for (let i = 1; i <= totalImages; i++) {
            const caption = moodCaptions[i % moodCaptions.length];
            
            internalHTML += `
                <div class="masonry-item" data-index="${i}">
                    <div class="absolute inset-0 gallery-card-overlay z-10 transition-opacity flex items-end p-6">
                        <p class="text-white font-space uppercase text-xs tracking-widest opacity-90">${caption}</p>
                    </div>
                    <img 
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 4'%3E%3C/svg%3E" 
                        data-src="assets/img/gallery/${i}.jpg" 
                        alt="Isa Recuerdos Image ${i}" 
                        class="lazy-loading"
                    />
                </div>
            `;
        }
        masonryGrid.innerHTML = internalHTML;
        initializeLazyLoading();
        registerCardInteractions();
    }

    function initializeLazyLoading() {
        const imageElements = masonryGrid.querySelectorAll('img');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const trueSource = img.getAttribute('data-src');
                    img.src = trueSource;
                    img.onload = () => {
                        img.classList.remove('lazy-loading');
                        img.classList.add('lazy-loaded');
                    };
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '0px 0px 300px 0px' });

        imageElements.forEach(img => imageObserver.observe(img));
    }

    // 3. CONTROLADOR INTERACTIVO DEL LIGHTBOX
    function registerCardInteractions() {
        const items = document.querySelectorAll('.masonry-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const absoluteIndex = parseInt(item.getAttribute('data-index'), 10);
                openLightbox(absoluteIndex);
            });
        });
    }

    function openLightbox(index) {
        currentActiveIndex = index;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderLightboxActiveState();
    }

    function renderLightboxActiveState() {
        lightboxImg.classList.remove('active');
        setTimeout(() => {
            lightboxImg.src = `assets/img/gallery/${currentActiveIndex}.jpg`;
            lightboxCounter.textContent = `${String(currentActiveIndex).padStart(2, '0')} / ${totalImages}`;
            
            const captionIndex = currentActiveIndex % moodCaptions.length;
            lightboxCaption.textContent = `Isa — ${moodCaptions[captionIndex]}.`;
            
            lightboxImg.onload = () => {
                lightboxImg.classList.add('active');
            };
        }, 150);
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxImg.classList.remove('active');
        document.body.style.overflow = '';
    }

    function processNextImage() {
        currentActiveIndex = currentActiveIndex >= totalImages ? 1 : currentActiveIndex + 1;
        renderLightboxActiveState();
    }

    function processPrevImage() {
        currentActiveIndex = currentActiveIndex <= 1 ? totalImages : currentActiveIndex - 1;
        renderLightboxActiveState();
    }

    closeLightboxBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', processNextImage);
    prevBtn.addEventListener('click', processPrevImage);

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') processNextImage();
        if (e.key === 'ArrowLeft') processPrevImage();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.id === 'lightbox-img-wrapper') {
            closeLightbox();
        }
    });

    // Inicialización de Ejecución
    generateVideoSlider();
    generateGalleryStructure();
});
