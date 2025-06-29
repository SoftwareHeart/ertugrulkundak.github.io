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

    // Mobil cihazlarda typewriter animasyonunu devre dışı bırak
    if (window.innerWidth <= 768) {
        heroTitle.style.opacity = '1';
        return;
    }

    const titleText = heroTitle.getAttribute('data-lang') ?
        (window.languageManager ? window.languageManager.getTranslation(heroTitle.getAttribute('data-lang')) : heroTitle.textContent) :
        heroTitle.textContent;

    if (!titleText || titleText.trim() === '') return;

    // Typewriter animasyonunu sadece bir kez çalıştır
    if (heroTitle.dataset.typewriterCompleted === 'true') {
        heroTitle.style.opacity = '1';
        return;
    }

    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';

    let i = 0;
    const speed = 80; // Biraz daha hızlı
    let timeoutId;

    function type() {
        if (i < titleText.length) {
            heroTitle.textContent += titleText.charAt(i);
            i++;
            timeoutId = setTimeout(type, speed);
        } else {
            // Animasyon tamamlandı olarak işaretle
            heroTitle.dataset.typewriterCompleted = 'true';
        }
    }

    // Önceki timeout'ları temizle
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    // Start typing after a delay
    setTimeout(type, 800);
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
    initProjectFilters();
    initProjectCardAnimations();

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

// Language Manager entegrasyonu - CompleteLanguageManager ile uyumlu
function initLanguageManager() {
    // CompleteLanguageManager'ın yüklenmesini bekle
    if (window.languageManager && window.languageManager.isReady()) {
        console.log('🌐 Complete Language Manager already ready');

        // Dil yöneticisi hazır olduğunda callback'leri ekle
        if (window.languageManager) {
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

        return;
    }

    // Language Manager henüz yüklenmemişse bekle
    setTimeout(initLanguageManager, 100);
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

// CompleteLanguageManager yükleme tamamlandığında
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

// ===== PROJECT FILTERING SYSTEM =====
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterButtons.length || !projectCards.length) {
        console.log('❌ Project filter elements not found');
        return;
    }

    // Add touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const filtersContainer = document.querySelector('.project-filters');

    // Touch events for mobile swipe
    if (filtersContainer) {
        filtersContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        filtersContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            const currentActive = document.querySelector('.filter-btn.active');
            const currentIndex = Array.from(filterButtons).indexOf(currentActive);

            if (diff > 0) {
                // Swipe left - next filter
                const nextIndex = (currentIndex + 1) % filterButtons.length;
                filterButtons[nextIndex].click();
            } else {
                // Swipe right - previous filter
                const prevIndex = currentIndex === 0 ? filterButtons.length - 1 : currentIndex - 1;
                filterButtons[prevIndex].click();
            }
        }
    }

    filterButtons.forEach((button, index) => {
        // Click event
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Update active button with animation
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.transform = 'scale(1)';
            });

            button.classList.add('active');
            button.style.transform = 'scale(1.05)';

            // Reset transform after animation
            setTimeout(() => {
                button.style.transform = '';
            }, 200);

            // Filter projects with smooth animation
            filterProjects(filter);
        });

        // Touch feedback for mobile
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
        }, { passive: true });

        button.addEventListener('touchend', () => {
            button.style.transform = '';
        }, { passive: true });

        // Keyboard navigation
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    // Auto-scroll to active filter on mobile
    function scrollToActiveFilter() {
        const activeButton = document.querySelector('.filter-btn.active');
        if (activeButton && window.innerWidth <= 768) {
            activeButton.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    // Filter projects function
    function filterProjects(filter) {
        const cards = document.querySelectorAll('.project-card');
        let visibleCount = 0;

        cards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;

            if (shouldShow) {
                card.style.display = 'block';
                card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show no results message if needed
        showNoResultsMessage(visibleCount === 0);

        // Scroll to active filter
        scrollToActiveFilter();

        // Update URL hash for bookmarking
        updateFilterHash(filter);
    }

    // Show/hide no results message
    function showNoResultsMessage(show) {
        let noResults = document.querySelector('.no-results-message');

        if (show) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results-message';
                noResults.innerHTML = `
                    <div class="no-results-content">
                        <i class="fas fa-search"></i>
                        <h3 data-lang="projects.no-results.title">Sonuç Bulunamadı</h3>
                        <p data-lang="projects.no-results.desc">Seçilen kategoride proje bulunmamaktadır.</p>
                    </div>
                `;
                document.querySelector('.project-grid').appendChild(noResults);
            }
            noResults.style.display = 'block';
        } else if (noResults) {
            noResults.style.display = 'none';
        }
    }

    // Update URL hash for filter bookmarking
    function updateFilterHash(filter) {
        if (history.pushState) {
            const newHash = filter === 'all' ? '' : `#filter=${filter}`;
            history.pushState(null, null, newHash);
        }
    }

    // Load filter from URL hash on page load
    function loadFilterFromHash() {
        const hash = window.location.hash;
        const match = hash.match(/#filter=(\w+)/);

        if (match) {
            const filter = match[1];
            const button = document.querySelector(`[data-filter="${filter}"]`);
            if (button) {
                button.click();
            }
        }
    }

    // Initialize filter from URL hash
    loadFilterFromHash();

    console.log('✅ Project filters initialized successfully');
}

// ===== PROJECT MODAL SYSTEM =====
const projectData = {
    tr: {
        portfolio: {
            title: 'İyiGelir Portföy Optimizasyonu',
            description: 'Portföy sayfası performansını %80 artıran kapsamlı optimizasyon çalışması. Database indexing, responsive design ve sayfa yükleme hızı iyileştirmeleri.',
            details: [
                'Performance Optimization: Portföy sayfası yükleme hızını %80 oranında artırdım',
                'Database Indexing: Veritabanı tablolarına index ekleyerek sorgu performansını optimize ettim',
                'Responsive Design: Yeni portföy sayfasında tam responsive tasarım uyguladım',
                'Data Visualization: Highcharts kullanarak fon fiyat grafiklerini görselleştirdim',
                'Analytics Dashboard: 30 grafik içeren fon detay analiz sayfasını tasarladım (1-3 saniye yükleme)',
                'Queue Management: 30 grafiği 5\'er 5\'er kuyruk yapısında yükleyerek optimize ettim',
                'Multi-Currency: Dolar-Euro-TL bazlı dinamik sayfa açılımları geliştirdim'
            ],
            technologies: ['.NET Core API', 'Performance Optimization', 'Database Tuning', 'Responsive Design', 'Highcharts', 'Queue Management'],
            role: 'Full Stack Developer',
            duration: '2024',
            impact: 'Portföy sayfası yükleme hızı %80 artış'
        },
        knn: {
            title: 'KNN Fon Öneri Sistemi',
            description: 'KNN algoritması ile yapay zeka destekli fon öneri sistemi. Kullanıcı profiline göre en uygun yatırım fonlarını önerir ve risk analizi yapar.',
            details: [
                'Machine Learning Integration: KNN algoritması ile yapay zeka destekli fon öneri sistemi geliştirdim',
                'User Profile Analysis: Kullanıcı risk toleransı ve yatırım hedeflerine göre öneri sistemi',
                'Risk Assessment: Fon risk analizi ve karşılaştırma algoritmaları',
                'Performance Optimization: Algoritma performansını optimize ederek hızlı öneri sistemi',
                'Data Processing: Büyük veri setlerinde etkili işleme ve analiz'
            ],
            technologies: ['C#', '.NET Core', 'Machine Learning', 'KNN Algorithm', 'Data Analysis', 'Risk Assessment'],
            role: 'Full Stack Developer',
            duration: '2024',
            impact: 'Yapay zeka destekli fon öneri sistemi'
        },
        dashboard: {
            title: 'Fon Analiz Dashboard',
            description: '30 grafik içeren fon detay analiz sistemi. Highcharts ile fon fiyat görselleştirme ve 10 yıllık veri analizi. Kuyruk yönetimi ile optimize edilmiş yükleme (1-3 saniye).',
            details: [
                'Data Visualization: 30 farklı grafik ile kapsamlı fon analizi',
                'Highcharts Integration: Gelişmiş grafik kütüphanesi entegrasyonu',
                'Queue Management: 30 grafiği 5\'er 5\'er kuyruk yapısında yükleyerek optimize ettim',
                'Performance Optimization: 1-3 saniye yükleme süresi ile hızlı erişim',
                'Historical Data: 10 yıllık fon verisi analizi ve görselleştirme',
                'Interactive Charts: Kullanıcı etkileşimli grafik ve filtreleme sistemi'
            ],
            technologies: ['Highcharts', 'Queue Management', 'Data Visualization', 'Performance', 'JavaScript', 'API Integration'],
            role: 'Full Stack Developer',
            duration: '2024',
            impact: '30 grafik ile kapsamlı analiz dashboard'
        },
        management: {
            title: 'Portföy Yönetim Sistemi',
            description: 'Portföylerin toplu gösterim ve yönetim sistemi. Gelişmiş filtreleme, multi-currency desteği (USD/EUR/TL) ve database index optimizasyonu.',
            details: [
                'Portfolio Management: Portföylerin toplu gösterim sayfasını tasarladım ve kodladım',
                'Advanced Filtering: Gelişmiş filtreleme sistemleri geliştirdim',
                'Multi-Currency Support: USD/EUR/TL bazlı dinamik para birimi desteği',
                'Database Optimization: İlişkisel veritabanı yapısında iyileştirmeler yaptım',
                'Entity Framework: Code First yaklaşımı ile veritabanı modellemesi',
                'Performance Tuning: Mevcut sistemde performans optimizasyonları gerçekleştirdim'
            ],
            technologies: ['Entity Framework', 'Database Index', 'Multi-Currency', 'Advanced Filtering', 'ASP.NET Core MVC'],
            role: 'Stajyer',
            duration: '2024',
            impact: 'Gelişmiş portföy yönetim sistemi'
        },
        pomodoro: {
            title: 'Pomodoro Çalışması',
            description: 'Full stack Pomodoro tekniği uygulaması. Kullanıcılar görevlerini yönetebilir, çalışma sürelerini takip edebilir ve detaylı istatistikler görüntüleyebilir.',
            details: [
                'Full Stack Development: React frontend ve .NET Core backend entegrasyonu',
                'User Authentication: JWT tabanlı güvenli kullanıcı kimlik doğrulama',
                'Task Management: Görev oluşturma, düzenleme ve silme işlemleri',
                'Time Tracking: Pomodoro tekniği ile çalışma süresi takibi',
                'Statistics Dashboard: Detaylı çalışma istatistikleri ve raporlama',
                'Responsive Design: Mobil uyumlu modern arayüz tasarımı'
            ],
            technologies: ['React.js', 'ASP.NET Core', 'SQL Server', 'JWT Auth', 'RESTful API', 'Responsive Design'],
            role: 'Kişisel Proje',
            duration: '2023',
            impact: 'Tam özellikli Pomodoro uygulaması',
            github: 'https://github.com/SoftwareHeart/pomodoro-client'
        },
        cargo: {
            title: 'Kargo Şirketi Blog',
            description: 'Kargo şirketinin tanıtımı ve admin panelden yönetilebilir blog sistemi. Google SEO çalışması, blog CRUD işlemleri ve istatistiksel raporlama.',
            details: [
                'Admin Panel: Yönetim paneli ile blog içerik yönetimi',
                'SEO Optimization: Google SEO çalışması ve meta tag optimizasyonu',
                'CRUD Operations: Blog yazıları için tam CRUD işlemleri',
                'Content Management: Zengin metin editörü ile içerik yönetimi',
                'Statistics Dashboard: Blog istatistikleri ve raporlama sistemi',
                'Responsive Design: Mobil uyumlu modern tasarım'
            ],
            technologies: ['ASP.NET Core MVC', 'Entity Framework', 'Admin Panel', 'SEO', 'CRUD Operations', 'Bootstrap'],
            role: 'Kişisel Proje',
            duration: '2023',
            impact: 'SEO optimizasyonlu blog sistemi',
            github: 'https://github.com/SoftwareHeart/KargoAdmin'
        },
        aes: {
            title: 'AES Şifreleme Uygulaması',
            description: 'AES-256 algoritması ile görüntü dosyalarının güvenli şifrelenmesi. Otomatik anahtar-IV oluşturma, Base64 encoding ve çoklu format desteği.',
            details: [
                'Cryptography: AES-256 algoritması ile güvenli şifreleme',
                'File Processing: Görüntü dosyalarının şifrelenmesi ve çözülmesi',
                'Key Management: Otomatik anahtar-IV oluşturma sistemi',
                'Base64 Encoding: Şifrelenmiş verilerin Base64 formatında saklanması',
                'Multi-Format Support: Çoklu görüntü formatı desteği',
                'User Interface: Kullanıcı dostu Windows Forms arayüzü'
            ],
            technologies: ['C# WinForms', 'AES-256', 'Cryptography', 'File Processing', 'Base64 Encoding', 'Security'],
            role: 'Kişisel Proje',
            duration: '2023',
            impact: 'Güvenli dosya şifreleme sistemi',
            github: 'https://github.com/SoftwareHeart/Aes_Sifreleme'
        },
        cybersec: {
            title: 'Cyber Security\'22 Hackathon',
            description: '32 takım arasından 2. olarak 5000₺ ödül kazandığım siber güvenlik hackathonu. Güvenlik açıklarını tespit etme ve çözüm geliştirme konularında takım liderliği.',
            details: [
                'Team Leadership: 4 kişilik takımda liderlik ve koordinasyon',
                'Penetration Testing: Güvenlik açıklarını tespit etme ve analiz',
                'Problem Solving: Karmaşık güvenlik problemlerine çözüm geliştirme',
                'Competition Strategy: 32 takım arasından 2. sıraya yükselme',
                'Security Analysis: Sistem güvenlik analizi ve raporlama',
                'Award Achievement: 5000₺ ödül kazanma başarısı'
            ],
            technologies: ['Cyber Security', 'Penetration Testing', 'Team Leadership', 'Problem Solving', 'Security Analysis'],
            role: 'Takım Lideri',
            duration: '2022',
            impact: '32 takım arasından 2. sıra ve 5000₺ ödül'
        }
    },
    en: {
        portfolio: {
            title: 'İyiGelir Portfolio Optimization',
            description: 'Comprehensive optimization work that increased portfolio page performance by 80%. Database indexing, responsive design and page loading speed improvements.',
            details: [
                'Performance Optimization: Increased portfolio page loading speed by 80%',
                'Database Indexing: Optimized query performance by adding indexes to database tables',
                'Responsive Design: Implemented fully responsive design in new portfolio page',
                'Data Visualization: Visualized fund price charts using Highcharts',
                'Analytics Dashboard: Designed fund detail analysis page with 30 charts (1-3 second loading)',
                'Queue Management: Optimized by loading 30 charts in groups of 5 using queue structure',
                'Multi-Currency: Developed dynamic page openings based on USD-EUR-TL'
            ],
            technologies: ['.NET Core API', 'Performance Optimization', 'Database Tuning', 'Responsive Design', 'Highcharts', 'Queue Management'],
            role: 'Full Stack Developer',
            duration: '2024',
            impact: '80% increase in portfolio page loading speed'
        },
        knn: {
            title: 'KNN Fund Recommendation System',
            description: 'AI-powered fund recommendation system using KNN algorithm. Recommends the most suitable investment funds based on user profile and performs risk analysis.',
            details: [
                'Machine Learning Integration: Developed AI-powered fund recommendation system using KNN algorithm',
                'User Profile Analysis: Recommendation system based on user risk tolerance and investment goals',
                'Risk Assessment: Fund risk analysis and comparison algorithms',
                'Performance Optimization: Fast recommendation system by optimizing algorithm performance',
                'Data Processing: Effective processing and analysis of large datasets'
            ],
            technologies: ['C#', '.NET Core', 'Machine Learning', 'KNN Algorithm', 'Data Analysis', 'Risk Assessment'],
            role: 'Full Stack Developer',
            duration: '2024',
            impact: 'AI-powered fund recommendation system'
        },
        dashboard: {
            title: 'Fund Analysis Dashboard',
            description: 'Fund detail analysis system with 30 charts. Fund price visualization with Highcharts and 10-year data analysis. Optimized loading with queue management (1-3 seconds).',
            details: [
                'Data Visualization: Comprehensive fund analysis with 30 different charts',
                'Highcharts Integration: Advanced chart library integration',
                'Queue Management: Optimized by loading 30 charts in groups of 5 using queue structure',
                'Performance Optimization: Fast access with 1-3 second loading time',
                'Historical Data: Analysis and visualization of 10-year fund data',
                'Interactive Charts: User-interactive charts and filtering system'
            ],
            technologies: ['Highcharts', 'Queue Management', 'Data Visualization', 'Performance', 'JavaScript', 'API Integration'],
            role: 'Full Stack Developer',
            duration: '2024',
            impact: 'Comprehensive analysis dashboard with 30 charts'
        },
        management: {
            title: 'Portfolio Management System',
            description: 'Bulk display and management system for portfolios. Advanced filtering, multi-currency support (USD/EUR/TL) and database index optimization.',
            details: [
                'Portfolio Management: Designed and coded bulk display page for portfolios',
                'Advanced Filtering: Developed advanced filtering systems',
                'Multi-Currency Support: Dynamic currency support based on USD/EUR/TL',
                'Database Optimization: Improvements in relational database structure',
                'Entity Framework: Database modeling with Code First approach',
                'Performance Tuning: Performance optimizations in existing system'
            ],
            technologies: ['Entity Framework', 'Database Index', 'Multi-Currency', 'Advanced Filtering', 'ASP.NET Core MVC'],
            role: 'Intern',
            duration: '2024',
            impact: 'Advanced portfolio management system'
        },
        pomodoro: {
            title: 'Pomodoro Study App',
            description: 'Full stack Pomodoro technique application. Users can manage their tasks, track study times and view detailed statistics.',
            details: [
                'Full Stack Development: React frontend and .NET Core backend integration',
                'User Authentication: Secure user authentication with JWT',
                'Task Management: Task creation, editing and deletion operations',
                'Time Tracking: Study time tracking with Pomodoro technique',
                'Statistics Dashboard: Detailed study statistics and reporting',
                'Responsive Design: Mobile-compatible modern interface design'
            ],
            technologies: ['React.js', 'ASP.NET Core', 'SQL Server', 'JWT Auth', 'RESTful API', 'Responsive Design'],
            role: 'Personal Project',
            duration: '2023',
            impact: 'Full-featured Pomodoro application',
            github: 'https://github.com/SoftwareHeart/pomodoro-client'
        },
        cargo: {
            title: 'Cargo Company Blog',
            description: 'Cargo company introduction and blog system manageable from admin panel. Google SEO work, blog CRUD operations and statistical reporting.',
            details: [
                'Admin Panel: Blog content management with admin panel',
                'SEO Optimization: Google SEO work and meta tag optimization',
                'CRUD Operations: Full CRUD operations for blog posts',
                'Content Management: Content management with rich text editor',
                'Statistics Dashboard: Blog statistics and reporting system',
                'Responsive Design: Mobile-compatible modern design'
            ],
            technologies: ['ASP.NET Core MVC', 'Entity Framework', 'Admin Panel', 'SEO', 'CRUD Operations', 'Bootstrap'],
            role: 'Personal Project',
            duration: '2023',
            impact: 'SEO optimized blog system',
            github: 'https://github.com/SoftwareHeart/KargoAdmin'
        },
        aes: {
            title: 'AES Encryption Application',
            description: 'AES-256 algorithm for secure encryption of image files. Automatic key-IV generation, Base64 encoding and multi-format support.',
            details: [
                'Cryptography: Secure encryption with AES-256 algorithm',
                'File Processing: Encryption and decryption of image files',
                'Key Management: Automatic key-IV generation system',
                'Base64 Encoding: Storage of encrypted data in Base64 format',
                'Multi-Format Support: Multi-image format support',
                'User Interface: User-friendly Windows Forms interface'
            ],
            technologies: ['C# WinForms', 'AES-256', 'Cryptography', 'File Processing', 'Base64 Encoding', 'Security'],
            role: 'Personal Project',
            duration: '2023',
            impact: 'Secure file encryption system',
            github: 'https://github.com/SoftwareHeart/Aes_Sifreleme'
        },
        cybersec: {
            title: 'Cyber Security\'22 Hackathon',
            description: 'Cybersecurity hackathon where I won 5000₺ prize as 2nd place among 32 teams. Team leadership in detecting security vulnerabilities and developing solutions.',
            details: [
                'Team Leadership: Leadership and coordination in 4-person team',
                'Penetration Testing: Detection and analysis of security vulnerabilities',
                'Problem Solving: Developing solutions to complex security problems',
                'Competition Strategy: Rising to 2nd place among 32 teams',
                'Security Analysis: System security analysis and reporting',
                'Award Achievement: Success in winning 5000₺ prize'
            ],
            technologies: ['Cyber Security', 'Penetration Testing', 'Team Leadership', 'Problem Solving', 'Security Analysis'],
            role: 'Team Leader',
            duration: '2022',
            impact: '2nd place among 32 teams and 5000₺ prize'
        }
    }
};

// Global variable to track current open modal
let currentOpenModal = null;

function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');

    // Get current language
    const currentLang = window.languageManager ? window.languageManager.getCurrentLanguage() : 'tr';

    // Get project data for current language
    const project = projectData[currentLang] ? projectData[currentLang][projectId] : projectData.tr[projectId];
    if (!project) {
        console.error('Project data not found:', projectId, 'for language:', currentLang);
        return;
    }

    // Store current modal info for language updates
    currentOpenModal = projectId;

    // Set modal title
    modalTitle.textContent = project.title;

    // Build modal content with language support
    let content = `
        <div class="modal-project-info">
            <div class="project-description">
                <h4 data-lang="modal.project.description">Proje Açıklaması</h4>
                <p>${project.description}</p>
            </div>
            
            <div class="project-details">
                <h4 data-lang="modal.project.details">Teknik Detaylar</h4>
                <ul>
                    ${project.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
            
            <div class="project-tech">
                <h4 data-lang="modal.project.technologies">Kullanılan Teknolojiler</h4>
                <div class="tech-tags">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            
            <div class="project-meta">
                <div class="meta-item">
                    <strong data-lang="modal.project.role">Rol:</strong> ${project.role}
                </div>
                <div class="meta-item">
                    <strong data-lang="modal.project.duration">Süre:</strong> ${project.duration}
                </div>
                <div class="meta-item">
                    <strong data-lang="modal.project.impact">Etki:</strong> ${project.impact}
                </div>
                ${project.github ? `
                <div class="meta-item">
                    <strong data-lang="modal.project.github">GitHub:</strong> 
                    <a href="${project.github}" target="_blank" rel="noopener">
                        <i class="fab fa-github"></i> <span data-lang="modal.project.view.github">Projeyi İncele</span>
                    </a>
                </div>
                ` : ''}
            </div>
        </div>
    `;

    modalContent.innerHTML = content;
    modal.style.display = 'block';

    // Update modal content with current language
    if (window.languageManager) {
        window.languageManager.updateAllContent();
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Add escape key listener
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeProjectModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    currentOpenModal = null;
}

// Function to update modal content when language changes
function updateModalContent() {
    if (currentOpenModal) {
        openProjectModal(currentOpenModal);
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('projectModal');
    if (e.target === modal) {
        closeProjectModal();
    }
});

// ===== ENHANCED PROJECT CARD ANIMATIONS =====
function initProjectCardAnimations() {
    const projectCards = document.querySelectorAll('.project-card');

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    projectCards.forEach(card => {
        cardObserver.observe(card);
    });
}
