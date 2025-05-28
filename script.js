document.addEventListener('DOMContentLoaded', function() {
    // Configuración del Intersection Observer mejorado
    const observerOptions = {
        threshold: [0.1, 0.3, 0.5],
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animar elementos hijos si existen
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observar elementos con animaciones
    document.querySelectorAll('.beneficio, .cta-destacado, .redes-sociales').forEach(el => {
        observer.observe(el);
    });

    // Detección de dispositivo mejorada
    function detectarDispositivo() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
        const isTablet = /ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP)))/.test(userAgent);
        
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.documentElement.classList.add('touch-device');
            if (isMobile) {
                document.documentElement.classList.add('mobile-device');
            } else if (isTablet) {
                document.documentElement.classList.add('tablet-device');
            }
        } else {
            document.documentElement.classList.add('no-touch-device', 'desktop-device');
        }
    }

    detectarDispositivo();

    // Performance optimizado para redimensionamiento
    let resizeTimeout;
    let ticking = false;

    function handleResize() {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Re-observar elementos si es necesario
                document.querySelectorAll('.beneficio, .cta-destacado, .redes-sociales').forEach(el => {
                    if (!el.classList.contains('visible')) {
                        observer.unobserve(el);
                        observer.observe(el);
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150);
    });

    // Función de compartir mejorada para redes sociales
    function configurarCompartir() {
        const shareData = {
            title: 'CodeMisiones | Diseño Web Profesional',
            text: 'Diseño web profesional que aumenta ventas para emprendedores en Misiones, Argentina',
            url: window.location.href
        };

        // Web Share API nativa
        if (navigator.share) {
            const shareButton = document.createElement('button');
            shareButton.className = 'boton-principal compartir';
            shareButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 0.5rem;">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                </svg>
                Compartir
            `;
            shareButton.style.marginTop = '1rem';
            shareButton.style.fontSize = '0.95rem';
            
            shareButton.addEventListener('click', async () => {
                try {
                    await navigator.share(shareData);
                    // Analytics tracking
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'share', {
                            method: 'web_share_api',
                            content_type: 'website'
                        });
                    }
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.log('Error al compartir:', err);
                        // Fallback a compartir manual
                        mostrarOpcionesCompartir();
                    }
                }
            });
            
            const ctaSection = document.querySelector('.cta-destacado');
            if (ctaSection) {
                ctaSection.appendChild(shareButton);
            }
        }
    }

    // Opciones de compartir manual como fallback
    function mostrarOpcionesCompartir() {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent('CodeMisiones | Diseño Web Profesional');
        const text = encodeURIComponent('Diseño web profesional que aumenta ventas');

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            whatsapp: `https://wa.me/?text=${text}%20${url}`
        };

        // Crear modal simple de compartir
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: #1a1a1a;
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            max-width: 300px;
            width: 90%;
        `;

        content.innerHTML = `
            <h3 style="color: white; margin-bottom: 1rem;">Compartir en:</h3>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="${shareUrls.facebook}" target="_blank" style="color: #1877F2; text-decoration: none; padding: 0.5rem;">Facebook</a>
                <a href="${shareUrls.twitter}" target="_blank" style="color: #1DA1F2; text-decoration: none; padding: 0.5rem;">Twitter</a>
                <a href="${shareUrls.whatsapp}" target="_blank" style="color: #25D366; text-decoration: none; padding: 0.5rem;">WhatsApp</a>
            </div>
            <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" style="
                margin-top: 1rem;
                background: #333;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                cursor: pointer;
            ">Cerrar</button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    configurarCompartir();

    // Tracking de interacciones (para analytics)
    function trackearInteraccion(tipo, elemento) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'engagement',
                event_label: tipo,
                value: elemento
            });
        }
    }

    // Event listeners para tracking
    document.querySelectorAll('.boton-principal').forEach(btn => {
        btn.addEventListener('click', () => {
            trackearInteraccion('cta_click', btn.textContent.trim());
        });
    });

    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            trackearInteraccion('social_click', btn.textContent.trim());
        });
    });

    // Lazy loading para imágenes (si se agregan en el futuro)
    function lazyLoadImages() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    lazyLoadImages();

    // Smooth scroll para anchors (si se agregan)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Preload crítico para mejorar performance
    function preloadCriticalResources() {
        const criticalImages = [
            // Agregar URLs de imágenes críticas aquí si las hay
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    preloadCriticalResources();

    // Service Worker registration (opcional para PWA)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Optimización de scroll performance
    let scrollTimeout;
    let isScrolling = false;

    function handleScroll() {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                // Aquí se pueden agregar efectos de scroll si se necesitan
                isScrolling = false;
            });
            isScrolling = true;
        }
    }

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 10);
    }, { passive: true });

    // Detección de conexión lenta
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            document.documentElement.classList.add('slow-connection');
            // Reducir animaciones en conexiones lentas
            document.querySelectorAll('*').forEach(el => {
                el.style.animationDuration = '0.1s';
                el.style.transitionDuration = '0.1s';
            });
        }
    }

    // Error handling para recursos que no cargan
    window.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            e.target.style.display = 'none';
            console.log('Image failed to load:', e.target.src);
        }
    }, true);

    console.log('CodeMisiones - Sitio web inicializado correctamente');
});