
// ===== MOBILE MENU TOGGLE - Simplified and working =====
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav a');

    if (!mobileToggle || !navMenu) {
        console.log('❌ Mobile menu elements not found');
        return;
    }

    // Simple toggle function
    mobileToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Simple toggle
        if (navMenu.classList.contains('mobile-menu-open')) {
            // Close menu
            navMenu.classList.remove('mobile-menu-open');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
            mobileToggle.setAttribute('aria-expanded', 'false');
        } else {
            // Open menu
            navMenu.classList.add('mobile-menu-open');
            mobileToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
            mobileToggle.setAttribute('aria-expanded', 'true');
        }
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('mobile-menu-open');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!mobileToggle.contains(e.target) &&
            !navMenu.contains(e.target) &&
            navMenu.classList.contains('mobile-menu-open')) {
            navMenu.classList.remove('mobile-menu-open');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('mobile-menu-open')) {
            navMenu.classList.remove('mobile-menu-open');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('mobile-menu-open');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    });

    console.log('✅ Mobile menu initialized successfully');
}

// Smooth scrolling for navigation links
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

// ===== ACTIVE NAVIGATION ON SCROLL =====
function updateActiveNavigation() {
    let current = '';
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120; // Nav height offset
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    // Update navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// ===== NAVBAR SCROLL EFFECT =====
function handleNavbarScroll() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

// ===== OPTIMIZED SCROLL LISTENER =====
let ticking = false;

function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateActiveNavigation();
            handleNavbarScroll();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = '0.1s';
            entry.target.style.animationFillMode = 'forwards';
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// ===== ENHANCED COUNTER ANIMATION =====
function animateCounter(element, target, originalText) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 saniye
    const stepTime = duration / 100;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        // Orijinal format bilgisini koruyarak güncelle
        if (originalText.includes('%')) {
            element.textContent = Math.round(current) + '%';
        } else if (originalText.includes('₺')) {
            element.textContent = Math.round(current).toLocaleString('tr-TR') + '₺';
        } else if (originalText.includes('.') && !originalText.includes('₺')) {
            element.textContent = current.toFixed(2);
        } else if (originalText.includes('+')) {
            element.textContent = Math.round(current) + '+';
        } else {
            element.textContent = Math.round(current).toLocaleString('tr-TR');
        }
    }, stepTime);
}

// ===== STATS COUNTER OBSERVER =====
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numberElement = entry.target.querySelector('.stat-number');
            if (!numberElement || numberElement.dataset.animated) return;

            const originalText = numberElement.textContent;

            // Sayısal değeri çıkar (rakamlar ve nokta)
            const numberMatch = originalText.match(/[\d.]+/);
            const number = numberMatch ? parseFloat(numberMatch[0]) : 0;

            // Animasyonu başlat
            numberElement.textContent = '0';
            numberElement.dataset.animated = 'true';

            // Küçük gecikme ile daha smooth görünüm
            setTimeout(() => {
                animateCounter(numberElement, number, originalText);
            }, 200);

            // Bir kez çalışsın
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
});

// ===== TYPEWRITER EFFECT FOR HERO TITLE =====
function typeWriter() {
    const heroTitle = document.querySelector('.hero-content h1');
    if (!heroTitle) return;

    const titleText = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';

    let i = 0;
    const speed = 100; // Typing speed

    function type() {
        if (i < titleText.length) {
            heroTitle.textContent += titleText.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    // Start typing after a delay
    setTimeout(type, 1000);
}

// ===== FLOATING PARTICLES SYSTEM =====
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.heroSection = document.querySelector('#hero');
        this.isRunning = false;
        this.maxParticles = window.innerWidth > 768 ? 15 : 8;
    }

    createParticle() {
        if (!this.heroSection || this.particles.length >= this.maxParticles) return;

        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 2; // 2-6px
        const opacity = Math.random() * 0.5 + 0.3; // 0.3-0.8

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, ${opacity});
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
        `;

        const x = Math.random() * this.heroSection.offsetWidth;
        const y = Math.random() * this.heroSection.offsetHeight;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        this.heroSection.appendChild(particle);
        this.particles.push(particle);

        this.animateParticle(particle);
    }

    animateParticle(particle) {
        let opacity = parseFloat(particle.style.opacity || 0.5);
        let size = parseFloat(particle.style.width);
        let posY = parseFloat(particle.style.top);

        const animate = () => {
            opacity -= 0.005;
            size += 0.05;
            posY -= 0.5;

            particle.style.opacity = opacity;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.top = posY + 'px';

            if (opacity > 0 && posY > -20) {
                requestAnimationFrame(animate);
            } else {
                this.removeParticle(particle);
            }
        };

        requestAnimationFrame(animate);
    }

    removeParticle(particle) {
        const index = this.particles.indexOf(particle);
        if (index > -1) {
            this.particles.splice(index, 1);
            particle.remove();
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;

        const createInterval = setInterval(() => {
            if (this.heroSection && this.isRunning) {
                this.createParticle();
            } else {
                clearInterval(createInterval);
            }
        }, 500);
    }

    stop() {
        this.isRunning = false;
        this.particles.forEach(particle => particle.remove());
        this.particles = [];
    }
}

// ===== LAZY LOADING FOR IMAGES =====
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== KEYBOARD NAVIGATION SUPPORT =====
function initKeyboardNavigation() {
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function () {
        document.body.classList.remove('keyboard-navigation');
    });
}

// ===== ERROR HANDLING FOR IMAGES =====
function initImageErrorHandling() {
    window.addEventListener('error', function (e) {
        if (e.target.tagName === 'IMG') {
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250"><rect width="250" height="250" fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="16" fill="%23999">Resim yüklenemedi</text></svg>';
        }
    }, true);
}

// ===== DARK MODE SUPPORT =====
function initDarkMode() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    function handleColorSchemeChange(e) {
        if (e.matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    prefersDarkScheme.addListener(handleColorSchemeChange);
    handleColorSchemeChange(prefersDarkScheme);
}

// ===== MAIN INITIALIZATION FUNCTION =====
let portfolioInitialized = false; // Prevent double initialization

function initializePortfolio() {
    if (portfolioInitialized) {
        console.log('⚠️ Portfolio already initialized, skipping...');
        return;
    }

    console.log('🚀 Portfolio initialization started...');
    portfolioInitialized = true;

    // Initialize all components
    initMobileMenu();
    initLazyLoading();
    initKeyboardNavigation();
    initImageErrorHandling();
    initDarkMode();


    initLanguageManager();
    // Start typewriter effect
    typeWriter();

    // Initialize particle system
    const particleSystem = new ParticleSystem();
    particleSystem.start();

    // Observe elements for animations
    document.querySelectorAll('.loading').forEach(el => {
        animationObserver.observe(el);
    });

    // Initialize stats counter with proper timing
    setTimeout(() => {
        document.querySelectorAll('.stat-item').forEach(item => {
            statsObserver.observe(item);
        });
    }, 300);

    console.log('✅ Portfolio initialized successfully!');
}

// Language Manager entegrasyonu
function initLanguageManager() {
    // Language Manager'ın yüklenmesini bekle
    if (typeof LanguageManager !== 'undefined') {
        if (!window.languageManager) {
            window.languageManager = new LanguageManager();
            console.log('🌐 Language Manager integrated successfully');
        }
    } else {
        // LanguageManager henüz yüklenmemişse bekle
        setTimeout(initLanguageManager, 100);
    }
}

// Dil değiştiğinde smooth scroll'u güncelle
function updateSmoothScrolling() {
    // Yeniden smooth scrolling listener'ları ekle
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Eski listener'ları temizle
        anchor.replaceWith(anchor.cloneNode(true));
    });

    // Yeni listener'ları ekle
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
}

// Dil değişikliği sonrası yeniden initialization
function reinitializeAfterLanguageChange() {
    // Stats counter'ları yeniden başlat
    document.querySelectorAll('.stat-item').forEach(item => {
        const numberElement = item.querySelector('.stat-number');
        if (numberElement) {
            numberElement.dataset.animated = '';
        }
    });

    // Animation observer'ları yeniden başlat
    setTimeout(() => {
        document.querySelectorAll('.stat-item').forEach(item => {
            statsObserver.observe(item);
        });
    }, 500);

    // Smooth scrolling'i güncelle
    updateSmoothScrolling();
}

// Language Manager için callback ekle
if (window.languageManager) {
    // Dil değiştiğinde çalışacak callback
    const originalSwitchLanguage = window.languageManager.switchLanguage;
    window.languageManager.switchLanguage = function (lang, animate = true) {
        const result = originalSwitchLanguage.call(this, lang, animate);

        // Dil değişikliği sonrası yeniden initialization
        setTimeout(() => {
            reinitializeAfterLanguageChange();
        }, 600);

        return result;
    };
}

// SEO ve Meta tag güncellemeleri
function updateSEOForLanguage(lang) {
    // Meta tags güncelle
    const metaTags = {
        tr: {
            title: 'Ertuğrul Kundak - Full Stack Yazılım Geliştirici',
            description: 'Full Stack Yazılım Geliştirici. .NET Core, C#, JavaScript uzmanı. İstanbul\'da yazılım geliştirme hizmetleri.',
            keywords: 'Ertuğrul Kundak, Full Stack Developer, .NET Core, C#, JavaScript, İstanbul, Yazılım Geliştirici',
            ogTitle: 'Ertuğrul Kundak - Full Stack Yazılım Geliştirici',
            ogDescription: 'Clean Architecture ve SOLID prensiplerine bağlı kalarak ölçeklenebilir çözümler üretiyorum.'
        },
        en: {
            title: 'Ertuğrul Kundak - Full Stack Software Developer',
            description: 'Full Stack Software Developer. .NET Core, C#, JavaScript expert. Software development services in Istanbul.',
            keywords: 'Ertuğrul Kundak, Full Stack Developer, .NET Core, C#, JavaScript, Istanbul, Software Developer',
            ogTitle: 'Ertuğrul Kundak - Full Stack Software Developer',
            ogDescription: 'I develop scalable solutions by adhering to Clean Architecture and SOLID principles.'
        }
    };

    const tags = metaTags[lang] || metaTags.tr;

    // Update title
    document.title = tags.title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', tags.description);
    }

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
        metaKeywords.setAttribute('content', tags.keywords);
    }

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.setAttribute('content', tags.ogTitle);
    }

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.setAttribute('content', tags.ogDescription);
    }
}

// URL güncelleme (opsiyonel - SEO için)
function updateURLForLanguage(lang) {
    if (history.pushState) {
        const newURL = window.location.pathname + (lang === 'en' ? '?lang=en' : '');
        history.pushState({ language: lang }, '', newURL);
    }
}

// URL'den dil algılama (opsiyonel)
function getLanguageFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    return langParam && ['tr', 'en'].includes(langParam) ? langParam : null;
}

// Gelişmiş hata yakalama
window.addEventListener('error', function (e) {
    if (e.target.tagName === 'SCRIPT' && e.target.src.includes('language')) {
        console.warn('Language script loading failed, falling back to default language');
        // Fallback: Varsayılan dili kullan
        document.documentElement.lang = 'tr';
    }
});

// Performance monitoring
const languagePerformance = {
    start: Date.now(),

    measure(step) {
        const elapsed = Date.now() - this.start;
        console.log(`🚀 Language ${step}: ${elapsed}ms`);
    }
};

// Language Manager yükleme tamamlandığında
document.addEventListener('languageManagerReady', function () {
    languagePerformance.measure('Manager Ready');

    // URL'den dil kontrolü
    const urlLang = getLanguageFromURL();
    if (urlLang && window.languageManager) {
        window.languageManager.switchLanguage(urlLang, false);
    }

    // SEO güncellemesi
    if (window.languageManager) {
        updateSEOForLanguage(window.languageManager.getCurrentLanguage());
    }
});

// Dil değişikliği event'i
document.addEventListener('languageChanged', function (event) {
    const newLang = event.detail.language;

    // SEO güncellemesi
    updateSEOForLanguage(newLang);

    // URL güncellemesi (opsiyonel)
    updateURLForLanguage(newLang);

    languagePerformance.measure(`Changed to ${newLang}`);
});

// Browser back/forward button desteği
window.addEventListener('popstate', function (event) {
    if (event.state && event.state.language && window.languageManager) {
        window.languageManager.switchLanguage(event.state.language, false);
    }
});

// Klavye kısayolu: Alt + L ile dil değiştirme
document.addEventListener('keydown', function (e) {
    if (e.altKey && e.key.toLowerCase() === 'l' && window.languageManager) {
        e.preventDefault();
        window.languageManager.toggleLanguage();
    }
});

console.log('🌐 Language integration loaded successfully');

// ===== START EVERYTHING - Fixed double initialization =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    // DOM is already ready
    initializePortfolio();
}

// Remove backup initialization to prevent double loading
// window.addEventListener('load', function () {
//     if (!document.querySelector('.stat-item[data-initialized]')) {
//         console.log('🔄 Running backup initialization...');
//         setTimeout(initializePortfolio, 200);
//     }
// });

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== EASTER EGG =====
if (portfolioInitialized) {
    console.log(`
🎉 Ertuğrul Kundak Portfolio
🚀 Made with ❤️ and modern JavaScript
📱 Responsive & Accessible Design
⚡ Optimized for Performance

📧 ertugrulkundak@hotmail.com
🔗 linkedin.com/in/ertuğrul-kundak
👨‍💻 github.com/SoftwareHeart
`);
}
