document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Smooth Parallax Implementation for Cinematic Hero (Tu código base)
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxBg = document.querySelector('.parallax-bg');
        if (parallaxBg) {
            parallaxBg.style.setProperty('--scroll-offset', `${scrolled * 0.4}px`);
        }
    });

    // 2. Intersection Observer for Orchestrating Page Entrance reveals (Tu código base)
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const sectionsToReveal = document.querySelectorAll('.reveal-section');
    sectionsToReveal.forEach(section => {
        revealObserver.observe(section);
    });

    // 3. Smooth Scrolling behavior for Anchor links (Tu código base)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. ALGORITMO INTERACTIVO DE ARRASTRE INERCIAL (Efecto Pinterest Scroll)
    const slider = document.querySelector('.pinterest-slider');
    let isDown = false;
    let startX;
    let scrollLeft;
    let velocity = 0;
    let frameId = 0;

    if (slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            cancelAnimationFrame(frameId); // Detiene la inercia si el usuario hace click de nuevo
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
            smoothInertiaLoop(); // Dispara el deslizamiento suave remanente
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const currentWalk = (x - startX) * 1.5; // Multiplicador de fuerza de empuje
            const previousScroll = slider.scrollLeft;
            slider.scrollLeft = scrollLeft - currentWalk;
            velocity = slider.scrollLeft - previousScroll; // Calcula la aceleración actual
        });

        // Soporte de gestos fluidos en smartphones móviles
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            cancelAnimationFrame(frameId);
        });

        slider.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - slider.offsetLeft;
            const currentWalk = (x - startX) * 1.2;
            slider.scrollLeft = scrollLeft - currentWalk;
        });

        // Ciclo matemático de fricción física para desacelerar suavemente
        function smoothInertiaLoop() {
            if (Math.abs(velocity) > 0.5) {
                slider.scrollLeft += velocity;
                velocity *= 0.93; // Fricción suave (mientras más cercano a 1, más resbala)
                frameId = requestAnimationFrame(smoothInertiaLoop);
            }
        }
    }
});
