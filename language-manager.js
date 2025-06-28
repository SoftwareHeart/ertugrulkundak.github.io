// ===== COMPLETE TRANSLATION SYSTEM =====
// Tüm sayfa için eksiksiz çeviri sistemi

class CompleteLanguageManager {
    constructor() {
        this.currentLang = 'tr';
        this.supportedLanguages = ['tr', 'en'];
        this.translations = {};
        this.isLoaded = false;
        this.init();
    }

    async init() {
        try {
            await this.loadCompleteTranslations();
            this.currentLang = this.getSavedLanguage() || this.detectBrowserLanguage();
            this.createLanguageSwitcher();
            this.switchLanguage(this.currentLang, false);
            this.isLoaded = true;
            console.log('✅ Complete Language Manager initialized successfully');
        } catch (error) {
            console.error('❌ Language Manager initialization failed:', error);
        }
    }

    async loadCompleteTranslations() {
        this.translations = {
            tr: {
                // Navigation
                'nav.about': 'Hakkımda',
                'nav.experience': 'Deneyim',
                'nav.skills': 'Yetenekler',
                'nav.projects': 'Projeler',
                'nav.contact': 'İletişim',

                // Hero Section
                'hero.title': 'Ertuğrul Kundak',
                'hero.subtitle': 'Full Stack Yazılım Geliştirici',
                'hero.description': 'Clean Architecture ve SOLID prensiplerine bağlı kalarak ölçeklenebilir çözümler üretiyorum. Frontend\'de veri görselleştirme, Backend\'de .NET Core API geliştirme konularında deneyim sahibiyim.',
                'hero.btn.projects': 'Projelerimi İncele',
                'hero.btn.portfolio': 'Portfolyo İndir',
                'hero.btn.cv': 'CV İndir',

                // Stats Section
                'stats.experience': 'Yıl Deneyim',
                'stats.experience.desc': '2 şirkette çalıştım',
                'stats.ranking': 'Hackathon Sıralaması',
                'stats.ranking.desc': '32 takım arasından',
                'stats.award': 'Hackathon Ödülü',
                'stats.award.desc': 'Cyber Security\'22',
                'stats.performance': 'Portföy Optimizasyonu',

                // Section Titles
                'section.about': 'Hakkımda',
                'section.experience': 'Kariyer Deneyimim',
                'section.skills': 'Teknik Yeteneklerim',
                'section.projects': 'Projelerim',
                'section.contact': 'İletişim',

                // About Section
                'about.text1': '<span class="highlight">Full Stack Yazılım Geliştirici</span> olarak Frontend\'de veri görselleştirme, Backend\'de .NET Core API geliştirme konularında deneyim sahibiyim. Clean Architecture ve SOLID prensiplerine bağlı kalarak, ölçeklenebilir çözümler üretiyorum.',
                'about.text2': '<span class="highlight">Portföy optimizasyonu</span> ile %80 performans artışı sağladım ve <span class="highlight">KNN algoritması</span> ile yapay zeka destekli fon öneri sistemi geliştirdim. Cyber Security\'22 Hackathon\'da <span class="highlight">32 takım arasından 2. olarak</span> 5000 TL ödül kazandım.',
                'about.text3': 'Analitik düşünme ve çabuk öğrenme yeteneği ile öne çıkan bir profilim var. Matematik ve tarih alanlarında güçlü akademik altyapıya sahibim. <strong>B1 seviyesinde İngilizce</strong> bilgim bulunmaktadır.',

                // Experience Section - Detailed
                'exp.fullstack.title': 'Full Stack Developer',
                'exp.fullstack.company': 'İyiGelir',
                'exp.fullstack.date': 'Haziran 2024 - Mart 2025',
                'exp.fullstack.desc': 'Yeni mobil ve web uygulaması için API tasarımı, kodlama ve frontend geliştirme süreçlerinde aktif rol aldım. Sistem performansı ve kullanıcı deneyimi odaklı çözümler geliştirdim.',
                'exp.fullstack.item1': '<strong>Performance Optimization:</strong> Portföy sayfası yükleme hızını %80 oranında artırdım',
                'exp.fullstack.item2': '<strong>AI Integration:</strong> KNN algoritması ile yapay zeka destekli fon öneri sistemi geliştirdim',
                'exp.fullstack.item3': '<strong>Bug Fixing & Support:</strong> Destek alanında kritik bugları çözdüm ve sistem kararlılığını artırdım',
                'exp.fullstack.item4': '<strong>Database Optimization:</strong> Veritabanı tablolarına index ekleyerek sorgu performansını optimize ettim',
                'exp.fullstack.item5': '<strong>Responsive Design:</strong> Yeni portföy sayfasında tam responsive tasarım uyguladım',
                'exp.fullstack.item6': '<strong>Data Visualization:</strong> Highcharts kullanarak fon fiyat grafiklerini görselleştirdim',
                'exp.fullstack.item7': '<strong>Analytics Dashboard:</strong> 30 grafik içeren fon detay analiz sayfasını tasarladım (1-3 saniye yükleme)',
                'exp.fullstack.item8': '<strong>Queue Management:</strong> 30 grafiği 5\'er 5\'er kuyruk yapısında yükleyerek optimize ettim',
                'exp.fullstack.item9': '<strong>Multi-Currency:</strong> Dolar-Euro-TL bazlı dinamik sayfa açılımları geliştirdim',
                'exp.fullstack.item10': '<strong>Academic Portal:</strong> Akademik alan tasarımı ve backend-frontend entegrasyonu',

                'exp.intern1.title': 'Stajyer',
                'exp.intern1.company': 'İyiGelir',
                'exp.intern1.date': 'Şubat 2024 - Mayıs 2024',
                'exp.intern1.desc': '75 iş günü boyunca .NET Core MVC projelerinde geliştirme yaaptım. Entity Framework ve database optimizasyonu konularında deneyim kazandım.',
                'exp.intern1.item1': '<strong>Entity Framework:</strong> Code First yaklaşımı ile veritabanı modellemesi',
                'exp.intern1.item2': '<strong>Performance Tuning:</strong> Mevcut sistemde performans optimizasyonları gerçekleştirdim',
                'exp.intern1.item3': '<strong>Portfolio Management:</strong> Portföylerin toplu gösterim sayfasını tasarladım ve kodladım',
                'exp.intern1.item4': '<strong>Advanced Filtering:</strong> Gelişmiş filtreleme sistemleri geliştirdim',
                'exp.intern1.item5': '<strong>Database Design:</strong> İlişkisel veritabanı yapısında iyileştirmeler yaptım',

                'exp.hackathon.title': 'Katılımcı',
                'exp.hackathon.company': 'Cyber Security\'22 Hackathon',
                'exp.hackathon.date': 'Aralık 2022',
                'exp.hackathon.desc': 'Ekip arkadaşlarımla birlikte 32 takım içerisinden savunan takım birincisi, genel yarışma ikincisi olarak <strong>5000 TL\'lik ödülü</strong> kazandık.',

                'exp.intern2.title': 'Stajyer',
                'exp.intern2.company': 'PenDC',
                'exp.intern2.date': 'Temmuz 2023 - Eylül 2023',
                'exp.intern2.desc': 'Zorunlu yaz stajımı 40 iş günü boyunca yaptım. Staj sürecim boyunca HTML/CSS, JavaScript kullanarak blog sitesi yaptım.',

                // Skills Categories
                'skills.backend': 'Backend Geliştirme',
                'skills.frontend': 'Frontend Geliştirme',
                'skills.database': 'Veritabanı & Performance',
                'skills.ai': 'Data Analysis & AI',

                // Project Categories
                'projects.professional': 'Profesyonel Projeler',
                'projects.personal': 'Kişisel Projeler',
                'projects.achievements': 'Başarılar & Ödüller',

                // Professional Projects
                'proj.portfolio.title': 'İyiGelir Portföy Optimizasyonu',
                'proj.portfolio.badge': '%80 Performance',
                'proj.portfolio.desc': 'Portföy sayfası performansını %80 artıran kapsamlı optimizasyon çalışması. Database indexing, responsive design ve sayfa yükleme hızı iyileştirmeleri.',
                'proj.portfolio.btn': 'Full Stack Developer',

                'proj.knn.title': 'KNN Fon Öneri Sistemi',
                'proj.knn.badge': 'Machine Learning',
                'proj.knn.desc': 'KNN algoritması ile yapay zeka destekli fon öneri sistemi. Kullanıcı profiline göre en uygun yatırım fonlarını önerir ve risk analizi yapar.',
                'proj.knn.btn': 'Full Stack Developer',

                'proj.dashboard.title': 'Fon Analiz Dashboard',
                'proj.dashboard.badge': '30 Grafik',
                'proj.dashboard.desc': '30 grafik içeren fon detay analiz sistemi. Highcharts ile fon fiyat görselleştirme ve 10 yıllık veri analizi. Kuyruk yönetimi ile optimize edilmiş yükleme (1-3 saniye).',
                'proj.dashboard.btn': 'Full Stack Developer',

                'proj.management.title': 'Portföy Yönetim Sistemi',
                'proj.management.badge': 'Multi-Currency',
                'proj.management.desc': 'Portföylerin toplu gösterim ve yönetim sistemi. Gelişmiş filtreleme, multi-currency desteği (USD/EUR/TL) ve database index optimizasyonu.',
                'proj.management.btn': 'Stajyer',

                'proj.api.title': 'Mobil & Web API',
                'proj.api.badge': 'RESTful API',
                'proj.api.desc': 'Yeni mobil ve web uygulaması için API tasarımı ve kodlaması. RESTful servisler, clean architecture ve veritabanı entegrasyonu.',
                'proj.api.btn': 'Full Stack Developer',

                'proj.academic.title': 'Akademik Portal',
                'proj.academic.badge': 'Full Stack',
                'proj.academic.desc': 'Akademik alan için tasarlanan kapsamlı portal. Backend API geliştirme, frontend tasarım ve tam stack entegrasyonu.',
                'proj.academic.btn': 'Full Stack Developer',

                // Personal Projects
                'proj.pomodoro.title': 'Pomodoro Çalışması',
                'proj.pomodoro.badge': 'React + .NET',
                'proj.pomodoro.desc': 'Full stack Pomodoro tekniği uygulaması. Kullanıcılar görevlerini yönetebilir, çalışma sürelerini takip edebilir ve detaylı istatistikler görüntüleyebilir.',

                'proj.cargo.title': 'Kargo Şirketi Blog',
                'proj.cargo.badge': 'Admin Panel',
                'proj.cargo.desc': 'Kargo şirketinin tanıtımı ve admin panelden yönetilebilir blog sistemi. Google SEO çalışması, blog CRUD işlemleri ve istatistiksel raporlama.',

                'proj.aes.title': 'AES Şifreleme Uygulaması',
                'proj.aes.badge': 'AES-256',
                'proj.aes.desc': 'AES-256 algoritması ile görüntü dosyalarının güvenli şifrelenmesi. Otomatik anahtar-IV oluşturma, Base64 encoding ve çoklu format desteği.',

                'proj.tree.title': 'TreeSearchAnalyzer',
                'proj.tree.badge': 'C++ Algorithm',
                'proj.tree.desc': 'Binary Search Tree arama algoritmalarının performans analizi. DFS ve BFS algoritmalarının karşılaştırması ve nanosaniye hassasiyetinde ölçüm.',

                // Achievement Project
                'proj.cybersec.title': 'Cyber Security\'22 Hackathon',
                'proj.cybersec.badge': '2. Sıra',
                'proj.cybersec.desc': '32 takım arasından 2. olarak 5000₺ ödül kazandığım siber güvenlik hackathonu. Güvenlik açıklarını tespit etme ve çözüm geliştirme konularında takım liderliği.',
                'proj.cybersec.btn': '5000₺ Ödül Kazandım',

                // Contact Items
                'contact.email': 'E-posta',
                'contact.linkedin': 'LinkedIn',
                'contact.github': 'GitHub',
                'contact.location': 'Konum',
                'contact.phone': 'Telefon',
                'contact.education': 'Eğitim',
                'contact.university': 'Manisa Celal Bayar Üniversitesi<br>Yazılım Mühendisliği (3.31 GANO)',
                'contact.address': 'Kaptanpaşa Mah, Beyoğlu/İstanbul'
            },

            en: {
                // Navigation
                'nav.about': 'About',
                'nav.experience': 'Experience',
                'nav.skills': 'Skills',
                'nav.projects': 'Projects',
                'nav.contact': 'Contact',

                // Hero Section
                'hero.title': 'Ertuğrul Kundak',
                'hero.subtitle': 'Full Stack Software Developer',
                'hero.description': 'I develop scalable solutions by adhering to Clean Architecture and SOLID principles. I have experience in data visualization on the Frontend and .NET Core API development on the Backend.',
                'hero.btn.projects': 'View My Projects',
                'hero.btn.portfolio': 'Download Portfolio',
                'hero.btn.cv': 'Download CV',

                // Stats Section
                'stats.experience': 'Years Experience',
                'stats.experience.desc': 'Worked at 2 companies',
                'stats.ranking': 'Hackathon Ranking',
                'stats.ranking.desc': 'Among 32 teams',
                'stats.award': 'Hackathon Prize',
                'stats.award.desc': 'Cyber Security\'22',
                'stats.performance': 'Performance Boost',

                // Section Titles
                'section.about': 'About Me',
                'section.experience': 'My Career Experience',
                'section.skills': 'Technical Skills',
                'section.projects': 'My Projects',
                'section.contact': 'Contact',

                // About Section
                'about.text1': 'As a <span class="highlight">Full Stack Software Developer</span>, I have experience in data visualization on the Frontend and .NET Core API development on the Backend. I develop scalable solutions by adhering to Clean Architecture and SOLID principles.',
                'about.text2': 'I achieved an 80% performance increase through <span class="highlight">portfolio optimization</span> and developed an AI-powered fund recommendation system using <span class="highlight">KNN algorithm</span>. I came <span class="highlight">2nd among 32 teams</span> in Cyber Security\'22 Hackathon and won 5000 TL prize.',
                'about.text3': 'I have a profile that stands out with analytical thinking and quick learning ability. I have a strong academic background in mathematics and history. I have <strong>B1 level English</strong> proficiency.',

                // Experience Section - Detailed
                'exp.fullstack.title': 'Full Stack Developer',
                'exp.fullstack.company': 'İyiGelir',
                'exp.fullstack.date': 'June 2024 - March 2025',
                'exp.fullstack.desc': 'I actively participated in API design, coding, and frontend development processes for new mobile and web applications. I developed solutions focused on system performance and user experience.',
                'exp.fullstack.item1': '<strong>Performance Optimization:</strong> Increased portfolio page loading speed by 80%',
                'exp.fullstack.item2': '<strong>AI Integration:</strong> Developed AI-powered fund recommendation system using KNN algorithm',
                'exp.fullstack.item3': '<strong>Bug Fixing & Support:</strong> Resolved critical bugs in support area and improved system stability',
                'exp.fullstack.item4': '<strong>Database Optimization:</strong> Optimized query performance by adding indexes to database tables',
                'exp.fullstack.item5': '<strong>Responsive Design:</strong> Implemented fully responsive design on new portfolio page',
                'exp.fullstack.item6': '<strong>Data Visualization:</strong> Visualized fund price charts using Highcharts',
                'exp.fullstack.item7': '<strong>Analytics Dashboard:</strong> Designed fund detail analysis page with 30 charts (1-3 second loading)',
                'exp.fullstack.item8': '<strong>Queue Management:</strong> Optimized by loading 30 charts in queue structure of 5 by 5',
                'exp.fullstack.item9': '<strong>Multi-Currency:</strong> Developed dynamic page expansions based on Dollar-Euro-TL',
                'exp.fullstack.item10': '<strong>Academic Portal:</strong> Academic area design and backend-frontend integration',

                'exp.intern1.title': 'Intern',
                'exp.intern1.company': 'İyiGelir',
                'exp.intern1.date': 'February 2024 - May 2024',
                'exp.intern1.desc': 'I worked on .NET Core MVC projects for 75 business days. I gained experience in Entity Framework and database optimization.',
                'exp.intern1.item1': '<strong>Entity Framework:</strong> Database modeling with Code First approach',
                'exp.intern1.item2': '<strong>Performance Tuning:</strong> Performed performance optimizations in existing system',
                'exp.intern1.item3': '<strong>Portfolio Management:</strong> Designed and coded bulk display page for portfolios',
                'exp.intern1.item4': '<strong>Advanced Filtering:</strong> Developed advanced filtering systems',
                'exp.intern1.item5': '<strong>Database Design:</strong> Made improvements in relational database structure',

                'exp.hackathon.title': 'Participant',
                'exp.hackathon.company': 'Cyber Security\'22 Hackathon',
                'exp.hackathon.date': 'December 2022',
                'exp.hackathon.desc': 'Together with my teammates, we won the <strong>5000 TL prize</strong> as the defending team champion and overall competition runner-up among 32 teams.',

                'exp.intern2.title': 'Intern',
                'exp.intern2.company': 'PenDC',
                'exp.intern2.date': 'July 2023 - September 2023',
                'exp.intern2.desc': 'I completed my mandatory summer internship for 40 business days. During the internship, I created a blog site using HTML/CSS, JavaScript.',

                // Skills Categories
                'skills.backend': 'Backend Development',
                'skills.frontend': 'Frontend Development',
                'skills.database': 'Database & Performance',
                'skills.ai': 'Data Analysis & AI',

                // Project Categories
                'projects.professional': 'Professional Projects',
                'projects.personal': 'Personal Projects',
                'projects.achievements': 'Achievements & Awards',

                // Professional Projects
                'proj.portfolio.title': 'İyiGelir Portfolio Optimization',
                'proj.portfolio.badge': '80% Performance',
                'proj.portfolio.desc': 'Comprehensive optimization work that increased portfolio page performance by 80%. Database indexing, responsive design and page loading speed improvements.',
                'proj.portfolio.btn': 'Full Stack Developer',

                'proj.knn.title': 'KNN Fund Recommendation System',
                'proj.knn.badge': 'Machine Learning',
                'proj.knn.desc': 'AI-powered fund recommendation system using KNN algorithm. Recommends the most suitable investment funds according to user profile and performs risk analysis.',
                'proj.knn.btn': 'Full Stack Developer',

                'proj.dashboard.title': 'Fund Analysis Dashboard',
                'proj.dashboard.badge': '30 Charts',
                'proj.dashboard.desc': 'Fund detail analysis system containing 30 charts. Fund price visualization with Highcharts and 10-year data analysis. Optimized loading with queue management (1-3 seconds).',
                'proj.dashboard.btn': 'Full Stack Developer',

                'proj.management.title': 'Portfolio Management System',
                'proj.management.badge': 'Multi-Currency',
                'proj.management.desc': 'Bulk display and management system for portfolios. Advanced filtering, multi-currency support (USD/EUR/TL) and database index optimization.',
                'proj.management.btn': 'Intern',

                'proj.api.title': 'Mobile & Web API',
                'proj.api.badge': 'RESTful API',
                'proj.api.desc': 'API design and coding for new mobile and web applications. RESTful services, clean architecture and database integration.',
                'proj.api.btn': 'Full Stack Developer',

                'proj.academic.title': 'Academic Portal',
                'proj.academic.badge': 'Full Stack',
                'proj.academic.desc': 'Comprehensive portal designed for academic field. Backend API development, frontend design and full stack integration.',
                'proj.academic.btn': 'Full Stack Developer',

                // Personal Projects
                'proj.pomodoro.title': 'Pomodoro Study App',
                'proj.pomodoro.badge': 'React + .NET',
                'proj.pomodoro.desc': 'Full stack Pomodoro technique application. Users can manage their tasks, track study time and view detailed statistics.',

                'proj.cargo.title': 'Cargo Company Blog',
                'proj.cargo.badge': 'Admin Panel',
                'proj.cargo.desc': 'Cargo company promotion and admin panel manageable blog system. Google SEO work, blog CRUD operations and statistical reporting.',

                'proj.aes.title': 'AES Encryption Application',
                'proj.aes.badge': 'AES-256',
                'proj.aes.desc': 'AES-256 algorithm ile görüntü dosyalarının güvenli şifrelenmesi. Otomatik anahtar-IV oluşturma, Base64 encoding ve çoklu format desteği.',

                'proj.tree.title': 'TreeSearchAnalyzer',
                'proj.tree.badge': 'C++ Algorithm',
                'proj.tree.desc': 'Performance analysis of Binary Search Tree search algorithms. Comparison of DFS and BFS algorithms with nanosecond precision measurement.',

                // Achievement Project
                'proj.cybersec.title': 'Cyber Security\'22 Hackathon',
                'proj.cybersec.badge': '2nd Place',
                'proj.cybersec.desc': 'Cyber security hackathon where I won 5000₺ prize as 2nd place among 32 teams. Team leadership in detecting security vulnerabilities and developing solutions.',
                'proj.cybersec.btn': 'Won 5000₺ Prize',

                // Contact Items
                'contact.email': 'Email',
                'contact.linkedin': 'LinkedIn',
                'contact.github': 'GitHub',
                'contact.location': 'Location',
                'contact.phone': 'Phone',
                'contact.education': 'Education',
                'contact.university': 'Manisa Celal Bayar University<br>Software Engineering (3.31 GPA)',
                'contact.address': 'Kaptanpaşa District, Beyoğlu/Istanbul'
            }
        };
    }

    createLanguageSwitcher() {
        const existingSwitcher = document.querySelector('.language-switcher');
        if (existingSwitcher) {
            existingSwitcher.remove();
        }

        const languageSwitcher = document.createElement('div');
        languageSwitcher.className = 'language-switcher';
        languageSwitcher.innerHTML = `
            <button class="language-toggle" onclick="languageManager.toggleLanguage()" 
                    aria-label="Switch Language" title="Change Language"
                    data-current-lang="${this.currentLang}">
                <div class="language-flag flag-${this.currentLang}"></div>
                <span class="language-text">${this.getLanguageDisplayName(this.currentLang)}</span>
            </button>
        `;

        // Hover efekti için tooltip ekle
        const toggle = languageSwitcher.querySelector('.language-toggle');
        toggle.addEventListener('mouseenter', () => {
            const nextLang = this.currentLang === 'tr' ? 'EN' : 'TR';
            toggle.setAttribute('title', `Switch to ${nextLang}`);
        });

        document.body.appendChild(languageSwitcher);
    }

    getLanguageDisplayName(lang) {
        const names = { 'tr': 'TR', 'en': 'EN' };
        return names[lang] || lang.toUpperCase();
    }

    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage || 'tr';
        const langCode = browserLang.split('-')[0].toLowerCase();
        return this.supportedLanguages.includes(langCode) ? langCode : 'tr';
    }

    getSavedLanguage() {
        try {
            return localStorage.getItem('portfolio-language');
        } catch (error) {
            return null;
        }
    }

    saveLanguage(lang) {
        try {
            localStorage.setItem('portfolio-language', lang);
        } catch (error) {
            console.warn('LocalStorage not available');
        }
    }

    toggleLanguage() {
        const newLang = this.currentLang === 'tr' ? 'en' : 'tr';
        this.switchLanguage(newLang, true);
    }

    async switchLanguage(lang, animate = true) {
        if (!this.supportedLanguages.includes(lang) || lang === this.currentLang) return;

        try {
            // Loading state başlat
            this.setLoadingState(true);

            if (animate) {
                // Overlay ekle
                this.showLanguageSwitchOverlay();
                document.body.classList.add('language-switching');
            }

            // Kısa bir gecikme ile daha pürüzsüz geçiş
            await new Promise(resolve => setTimeout(resolve, 100));

            this.currentLang = lang;
            this.saveLanguage(lang);
            document.documentElement.lang = lang;

            // İçeriği güncelle
            await this.updateAllContentSmoothly();
            this.updateLanguageSwitcher();

            if (animate) {
                // Animasyon süresini artır
                setTimeout(() => {
                    document.body.classList.remove('language-switching');
                    this.hideLanguageSwitchOverlay();
                    this.setLoadingState(false);
                }, 600);
            } else {
                this.setLoadingState(false);
            }

            console.log(`✅ Language switched to: ${lang}`);
        } catch (error) {
            console.error('❌ Error switching language:', error);
            this.setLoadingState(false);
            this.hideLanguageSwitchOverlay();
        }
    }

    setLoadingState(loading) {
        const toggle = document.querySelector('.language-toggle');
        const switcher = document.querySelector('.language-switcher');

        if (toggle) {
            if (loading) {
                toggle.classList.add('loading');
            } else {
                toggle.classList.remove('loading');
            }
        }

        if (switcher) {
            if (loading) {
                switcher.classList.add('loading');
            } else {
                switcher.classList.remove('loading');
            }
        }
    }

    showLanguageSwitchOverlay() {
        let overlay = document.querySelector('.language-switch-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'language-switch-overlay';
            document.body.appendChild(overlay);
        }

        // Kısa bir gecikme ile overlay'i göster
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
    }

    hideLanguageSwitchOverlay() {
        const overlay = document.querySelector('.language-switch-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            // Overlay'i tamamen kaldır
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }

    async updateAllContentSmoothly() {
        // Tüm çevrilebilir elementleri bul
        const elements = document.querySelectorAll('[data-lang]');

        // Önce tüm elementleri fade-out yap
        elements.forEach(element => {
            element.classList.add('updating');
        });

        // Kısa bir gecikme
        await new Promise(resolve => setTimeout(resolve, 150));

        // İçeriği güncelle
        elements.forEach(element => {
            const key = element.getAttribute('data-lang');
            const translation = this.getTranslation(key);
            if (translation) {
                element.innerHTML = translation;
            }
            element.classList.remove('updating');
        });

        // Sayfa başlığı ve meta verilerini güncelle
        this.updatePageMeta();
    }

    updatePageMeta() {
        // Sayfa başlığını güncelle
        const titleKey = this.currentLang === 'tr'
            ? 'Ertuğrul Kundak - Full Stack Developer'
            : 'Ertuğrul Kundak - Full Stack Software Developer';
        document.title = titleKey;

        // Meta açıklamasını güncelle
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            const descKey = this.currentLang === 'tr'
                ? 'Full Stack Yazılım Geliştirici. .NET Core, C#, JavaScript uzmanı. İstanbul\'da yazılım geliştirme hizmetleri.'
                : 'Full Stack Software Developer. .NET Core, C#, JavaScript expert. Software development services in Istanbul.';
            metaDesc.setAttribute('content', descKey);
        }
    }

    updateAllContent() {
        // Eski fonksiyonu yeni fonksiyonla değiştir
        this.updateAllContentSmoothly();
    }

    updateLanguageSwitcher() {
        const flagElement = document.querySelector('.language-flag');
        const textElement = document.querySelector('.language-text');
        const toggleElement = document.querySelector('.language-toggle');

        if (flagElement) {
            flagElement.className = `language-flag flag-${this.currentLang}`;
        }
        if (textElement) {
            textElement.textContent = this.getLanguageDisplayName(this.currentLang);
        }
        if (toggleElement) {
            toggleElement.setAttribute('data-current-lang', this.currentLang);
            const nextLang = this.currentLang === 'tr' ? 'EN' : 'TR';
            toggleElement.setAttribute('title', `Switch to ${nextLang}`);
        }
    }

    getTranslation(key) {
        if (!this.translations[this.currentLang]) {
            return key;
        }
        const translation = this.translations[this.currentLang][key];
        return translation || key;
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    isReady() {
        return this.isLoaded;
    }
}

// Initialize
let languageManager;

function initCompleteLanguageManager() {
    if (!languageManager) {
        languageManager = new CompleteLanguageManager();
        window.languageManager = languageManager;
        console.log('🌐 Complete Language Manager created successfully');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompleteLanguageManager);
} else {
    initCompleteLanguageManager();
}