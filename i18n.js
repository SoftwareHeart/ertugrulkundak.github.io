/* ===============================================
   TR / EN dil değiştirici
   Sayfadaki Türkçe metinleri, boşluklar normalize edilmiş
   halleriyle sözlükte arar; bulduğu metni İngilizceye çevirir,
   orijinali saklar (TR'ye dönünce geri yazılır).
   Sözlükte olmayan metin (teknoloji adları vb.) olduğu gibi kalır.
   =============================================== */
(function () {
    'use strict';

    const EN = {
        // Yükleme ekranı, masaüstü, widget
        'Yazılım Mühendisi · Backend & Full Stack (.NET / Java)': 'Software Engineer · Backend & Full Stack (.NET / Java)',
        'Yükleniyor...': 'Loading...',
        'Projelerim': 'My Projects',
        'Hakkımda.txt': 'About.txt',
        'İletişim': 'Contact',
        'Kariyer': 'Career',
        'Mayın.exe': 'Mines.exe',
        'Notlar.md': 'Notes.md',
        'Yazılım Mühendisi · Backend & Full Stack': 'Software Engineer · Backend & Full Stack',
        'yıl deneyim': 'years of experience',
        'performans artışı': 'performance gain',
        'grafik dashboard': 'chart dashboard',
        'hackathon derecesi': 'hackathon placing',
        "CV'yi Aç": 'Open CV',
        'Projeler': 'Projects',
        'E-posta Gönder': 'Send Email',
        'Yenile': 'Refresh',
        'Masaüstünü Özelleştir': 'Customize Desktop',
        'Sistem Hatası (Şaka)': 'System Error (Joke)',

        // Projeler
        'Seçili Projeler': 'Selected Projects',
        'Bankacılık ve finansal teknoloji alanında geliştirdiğim kurumsal ve kişisel projeler.': 'Corporate and personal projects I built in banking and financial technology.',
        'BkCompany — Uçtan Uca E-Ticaret Platformu': 'BkCompany — End-to-End E-Commerce Platform',
        'Türkiye pazarı için tasarladığım, mağaza vitrini ve yönetim panelini birlikte sunan canlı e-ticaret platformu (~94 bin satır TypeScript, 40+ tablo, 60+ test dosyası). Paynet 3D Secure ödeme ve iade akışı, misafir ve üye sepeti, kayıtlı kartlar, kupon/kampanya motoru, mesafeli satış sözleşmesi onayı, terk edilmiş sepet hatırlatmaları, analitik raporlar ve admin paneli.':
            'A live e-commerce platform I designed for the Turkish market, with both a storefront and an admin panel (~94k lines of TypeScript, 40+ tables, 60+ test files). Paynet 3D Secure payment and refund flow, guest and member carts, saved cards, coupon/campaign engine, distance-sales contract consent, abandoned-cart reminders, analytics reports and an admin panel.',
        'Entegrasyonlar:': 'Integrations:',
        'Paynet (3D Secure ödeme ve iade), Aras Kargo (gönderi kaydı ve otomatik takip), BiFatura (e-fatura), Trendyol (ürün/kategori senkronu), Resend ve AWS SES (e-posta), Google OAuth.':
            'Paynet (3D Secure payments and refunds), Aras Kargo (shipment registration and automatic tracking), BiFatura (e-invoice), Trendyol (product/category sync), Resend and AWS SES (email), Google OAuth.',
        'Canlı Siteyi Görüntüle': 'View Live Site',
        'Özel repo — kaynak kod paylaşılamıyor': "Private repo — source code can't be shared",
        '30 grafik içeren fon detay analiz sayfası (1-3 saniye yükleme süresi). Queue management sistemi ile %30 performans optimizasyonu, çoklu para birimi destekli dinamik sayfa yapısı ve JWT tabanlı kimlik doğrulama.':
            'Fund detail analysis page with 30 charts (1–3 second load time). 30% performance optimization with a queue management system, a multi-currency dynamic page structure and JWT-based authentication.',
        'Yapay Zeka Destekli Yatırım Öneri Sistemi': 'AI-Powered Investment Recommendation System',
        'KNN Algoritması': 'KNN Algorithm',
        'Makine Öğrenmesi': 'Machine Learning',
        'KNN algoritması ile kullanıcıya özel fon öneri motoru. Kullanıcı davranış verilerinin analiz edilmesiyle öneri doğruluğunun artırılması.':
            'A user-specific fund recommendation engine built on the KNN algorithm. Recommendation accuracy improved by analysing user behaviour data.',
        'Çoklu Para Birimi Fon Portföy Sistemi': 'Multi-Currency Fund Portfolio System',
        'Fonlar için kapsamlı portföy yönetim sistemi. USD, EUR ve TRY destekli dinamik kur dönüşümü, gerçek zamanlı performans takibi ve RESTful API mimarisi ile çoklu platform entegrasyonu.':
            'A comprehensive portfolio management system for funds. Dynamic exchange-rate conversion for USD, EUR and TRY, real-time performance tracking and multi-platform integration through a RESTful API architecture.',
        'Core Banking Servis Entegrasyonları': 'Core Banking Service Integrations',
        'Şekerbank bünyesinde banka içi modüller ile 3. parti servisler arasında servis/API entegrasyonları; Oracle üzerinde sorgu, stored procedure ve rapor geliştirmeleri.':
            'Service/API integrations between in-bank modules and third-party services at Şekerbank; query, stored procedure and report development on Oracle.',
        'Kurumsal proje — kaynak kod paylaşılamıyor': "Corporate project — source code can't be shared",
        'Aleris Global Logistics — Kurumsal Web Sitesi': 'Aleris Global Logistics — Corporate Website',
        'Lojistik firması için uçtan uca geliştirilen kurumsal web sitesi. Türkçe-İngilizce çoklu dil desteği, dinamik içerik yönetimi ve responsive tasarım.':
            'An end-to-end corporate website built for a logistics company. Turkish-English multilingual support, dynamic content management and responsive design.',
        'Pomodoro Zamanlayıcı Uygulaması': 'Pomodoro Timer App',
        'React ile responsive arayüz, C# Web API ile RESTful servisler. Gerçek zamanlı sayaç özellikleri ve oturum yönetimi.':
            'Responsive UI with React and RESTful services with a C# Web API. Real-time timer features and session management.',
        'Hackathon — 2. Sıra': 'Hackathon — 2nd Place',
        'Problem Çözme': 'Problem Solving',
        'Takım Çalışması': 'Teamwork',
        'İnovasyon': 'Innovation',
        '32 takımın katıldığı hackathonda takımımla 2. sırayı elde ettim; sınırlı sürede çok disiplinli ekip çalışması ve hızlı problem çözme deneyimi kazandım.':
            'My team took 2nd place among 32 teams; I gained experience in highly disciplined teamwork and fast problem solving under limited time.',

        // CV
        'Yazılım Mühendisi | Backend ve Full Stack Geliştirici (.NET / Java)': 'Software Engineer | Backend and Full Stack Developer (.NET / Java)',
        'İstanbul, Türkiye': 'Istanbul, Türkiye',
        'Profesyonel Özet': 'Professional Summary',
        "Bankacılık ve finansal teknoloji sektöründe 2,5 yılı aşkın deneyime sahip Yazılım Mühendisiyim. Şekerbank'ta Java tabanlı core banking uygulamaları, servis entegrasyonları ve Oracle/MSSQL veritabanı geliştirme alanlarında çalışıyorum. Öncesinde ASP.NET Core ve Entity Framework ile mobil ve web uygulamaları için güvenli RESTful API'ler geliştirdim; portföy sayfası performansını %40 iyileştirdim, 30 grafik içeren finansal analiz dashboard'u kurguladım ve KNN algoritması ile yapay zeka destekli fon öneri sistemi tasarladım. Kişisel olarak Next.js, TypeScript ve PostgreSQL ile Paynet ödeme, Aras Kargo ve e-fatura entegrasyonlarını içeren, canlıda çalışan uçtan uca bir e-ticaret platformu (BkCompany) geliştiriyorum.":
            "I am a Software Engineer with over 2.5 years of experience in banking and financial technology. At Şekerbank I work on Java-based core banking applications, service integrations and Oracle/MSSQL database development. Previously I built secure RESTful APIs for mobile and web applications with ASP.NET Core and Entity Framework; I improved portfolio page performance by 40%, designed a financial analysis dashboard with 30 charts and built an AI-assisted fund recommendation system with the KNN algorithm. On my own time I'm developing BkCompany, a live end-to-end e-commerce platform built with Next.js, TypeScript and PostgreSQL, including Paynet payment, Aras Kargo and e-invoice integrations.",
        'Güçlü olduğum alanlar:': 'Strengths:',
        'sistem entegrasyonu, SQL sorgu optimizasyonu, JWT tabanlı kimlik doğrulama, performans iyileştirme ve veri görselleştirme.':
            'system integration, SQL query optimization, JWT-based authentication, performance tuning and data visualization.',
        'Teknik Yetkinlikler': 'Technical Skills',
        'Programlama Dilleri': 'Programming Languages',
        'Web Servisleri': 'Web Services',
        'N-Tier Mimari': 'N-Tier Architecture',
        'Veritabanı': 'Database',
        'Index Yönetimi': 'Index Management',
        'Sorgu Optimizasyonu': 'Query Optimization',
        'Veritabanı Tasarımı': 'Database Design',
        'Entegrasyon': 'Integration',
        'Sistem Entegrasyonları': 'System Integrations',
        '3. Parti Servisler': 'Third-Party Services',
        'API Dokümantasyonu': 'API Documentation',
        'Ödeme Entegrasyonu (3D Secure)': 'Payment Integration (3D Secure)',
        'Aras Kargo (SOAP) Entegrasyonu': 'Aras Kargo (SOAP) Integration',
        'e-Fatura Entegrasyonu': 'e-Invoice Integration',
        'Cron / Zamanlanmış Görevler': 'Cron / Scheduled Jobs',
        'Responsive Tasarım': 'Responsive Design',
        'Veri Görselleştirme': 'Data Visualization',
        'Yapay Zeka ve Algoritmalar': 'AI and Algorithms',
        'Öneri Sistemleri': 'Recommender Systems',
        'Veri Analizi': 'Data Analysis',
        'Araçlar ve Süreçler': 'Tools and Processes',
        'Hata Yönetimi': 'Error Handling',
        'İş Deneyimi': 'Work Experience',
        'Yazılım Mühendisi': 'Software Engineer',
        'Güncel': 'Current',
        'Şekerbank T.A.Ş. - İstanbul | Aralık 2025 - Halen': 'Şekerbank T.A.Ş. - Istanbul | December 2025 - Present',
        'Core Banking Geliştirme:': 'Core Banking Development:',
        'Java tabanlı core banking (temel bankacılık) uygulamalarında yeni geliştirmeler yapıyor ve mevcut modüllerin bakımını üstleniyorum.':
            'I build new features and maintain existing modules in Java-based core banking applications.',
        'Sistem Entegrasyonları:': 'System Integrations:',
        'Banka içi modüller ve 3. parti servisler arasında servis/API entegrasyonları geliştiriyor, JSON ve XML tabanlı veri alışverişini yönetiyorum.':
            'I develop service/API integrations between in-bank modules and third-party services and manage JSON- and XML-based data exchange.',
        'Veritabanı Geliştirme:': 'Database Development:',
        'Oracle ve Microsoft SQL Server üzerinde sorgu, stored procedure ve rapor geliştirmeleri yaparak sorgu performansını optimize ediyorum.':
            'I develop queries, stored procedures and reports on Oracle and Microsoft SQL Server and optimize query performance.',
        'Hata Analizi ve Destek:': 'Defect Analysis and Support:',
        'Canlı ortamdan gelen hata kayıtlarını analiz edip kök neden tespiti ve kalıcı çözüm geliştirme süreçlerinde görev alıyorum.':
            'I analyze production error logs and take part in root-cause analysis and permanent-fix efforts.',
        'Kod Kalitesi:': 'Code Quality:',
        'Versiyon kontrolü ve kod gözden geçirme süreçlerine katılarak bankacılık uygulamalarında kod standartlarının korunmasına katkı sağlıyorum.':
            'I take part in version control and code review processes, helping maintain coding standards in banking applications.',
        'İYİGELİR - İstanbul | Mayıs 2024 - Mart 2025': 'İYİGELİR - Istanbul | May 2024 - March 2025',
        'Mobil ve Web API Geliştirme:': 'Mobile and Web API Development:',
        'Mobil ve web uygulamaları için RESTful API tasarımı, kodlama ve frontend geliştirme süreçlerinde aktif rol aldım.':
            'I played an active role in RESTful API design, coding and frontend development for mobile and web applications.',
        'Performans Optimizasyonu:': 'Performance Optimization:',
        'Portföy sayfası yükleme hızını %40 oranında artırarak kullanıcı deneyimini belirgin şekilde iyileştirdim.':
            'I improved portfolio page load speed by 40%, noticeably improving the user experience.',
        'Yapay Zeka Entegrasyonu:': 'AI Integration:',
        'KNN algoritması kullanarak yapay zeka destekli fon öneri sistemi geliştirdim.':
            'I built an AI-assisted fund recommendation system using the KNN algorithm.',
        'Veri Görselleştirme ve Analitik:': 'Data Visualization and Analytics:',
        "Highcharts ile fon fiyat grafikleri ve 30 grafik içeren analiz dashboard'u geliştirdim (1-3 saniye yükleme süresi).":
            'I built fund price charts and an analysis dashboard with 30 charts using Highcharts (1–3 second load time).',
        'Veritabanı ve Güvenlik:': 'Database and Security:',
        'Veritabanı tablolarına index ekleyerek sorgu performansını optimize ettim; JWT tabanlı kimlik doğrulama ve API güvenlik önlemlerini entegre ettim.':
            'I optimized query performance by adding indexes to database tables and integrated JWT-based authentication and API security measures.',
        'Sistem Mimarisi:': 'System Architecture:',
        '.NET Core middleware çözümleri, queue management sistemi ve çoklu para birimi (USD-EUR-TRY) destekli dinamik sayfa yapıları oluşturdum.':
            'I built .NET Core middleware solutions, a queue management system and dynamic page structures supporting multiple currencies (USD-EUR-TRY).',
        'Hata Yönetimi ve Kalite:': 'Error Handling and Quality:',
        'Kullanıcı bildirimlerinden gelen hataları analiz edip çözerek sistem genelinde hata oranında önemli azalma sağladım.':
            'I analyzed and fixed errors reported by users, significantly reducing the overall error rate.',
        'Yazılım Stajyeri': 'Software Intern',
        'İYİGELİR - İstanbul | Şubat 2024 - Mayıs 2024': 'İYİGELİR - Istanbul | February 2024 - May 2024',
        '.NET Core Geliştirme:': '.NET Core Development:',
        'MVC mimarisiyle geliştirilmiş projelerde geliştirme görevleri aldım.': 'I took development tasks on projects built with the MVC architecture.',
        'API Geliştirme:': 'API Development:',
        "RESTful API'lerin güncellenmesi ve modüler hale getirilmesine katkı sağladım.": 'I contributed to updating RESTful APIs and making them modular.',
        'Kod Optimizasyonu:': 'Code Optimization:',
        'Kod analizi, hata düzeltme ve performans iyileştirme çalışmaları gerçekleştirdim.': 'I carried out code analysis, bug fixing and performance improvement work.',
        'Versiyon Kontrolü:': 'Version Control:',
        'Git ve GitHub üzerinden versiyon kontrol süreçlerinde yer aldım.': 'I took part in version control processes with Git and GitHub.',
        'PENDC - Bursa | Temmuz 2023 - Ağustos 2023': 'PENDC - Bursa | July 2023 - August 2023',
        'Frontend Geliştirme:': 'Frontend Development:',
        'HTML, CSS ve JavaScript kullanarak blog sitesi geliştirdim.': 'I built a blog site using HTML, CSS and JavaScript.',
        'Arayüz Geliştirme:': 'UI Development:',
        'Sayfa yapısı, stil düzenlemeleri ve kullanıcı arayüzü fonksiyonlarını oluşturdum.': 'I created the page structure, styling and user interface functions.',
        'Kişisel Projeler': 'Personal Projects',
        'BkCompany — E-Ticaret Platformu': 'BkCompany — E-Commerce Platform',
        'Next.js 16 · TypeScript · Prisma · PostgreSQL | Kasım 2025 - Halen |': 'Next.js 16 · TypeScript · Prisma · PostgreSQL | November 2025 - Present |',
        'Ödeme Altyapısı:': 'Payment Infrastructure:',
        'Paynet 3D Secure ödeme, taksit, kayıtlı kart ve tam iade akışını geliştirdim; stok düşümü, sipariş ve ödeme kaydı tek veritabanı işleminde atomik yapılıyor, aynı işlem referansı iki kez ödeme üretemiyor.':
            'I built the Paynet 3D Secure payment, installment, saved-card and full-refund flows; stock deduction, order and payment records are written atomically in a single database transaction, and the same transaction reference can never create two payments.',
        'Sipariş Yaşam Döngüsü:': 'Order Lifecycle:',
        'Tek noktadan yönetilen sipariş durum makinesi, iptal-iade, iade/değişim talepleri, cayma süresinin tesliminden itibaren işletilmesi ve misafir siparişlerinin sonradan hesaba güvenli şekilde bağlanması.':
            'A single-source order state machine, cancellation and refunds, return/exchange requests, withdrawal period counted from delivery, and secure linking of guest orders to an account later.',
        'Aras Kargo Entegrasyonu:': 'Aras Kargo Integration:',
        "Aras SOAP servisiyle gönderi kaydı (SetOrder), koli barkodu ve Code128 sevk fişi üretimi; cron ile (30 dk) takip numarası, kargoya veriliş ve teslim bilgisinin geri okunması (QT1/QT12), siparişin durum makinesinden otomatik ilerletilmesi. Aras'ın canlı yanıtlarındaki doküman farklarına karşı yedek sorgu stratejisi, Türkiye saatine göre tarih çevirme, kaybolan kargonun tespiti ve admin bildirimi, iptalde önce Aras kaydını kapatıp sonra para iadesi (parası dönmüş paketin yola çıkmasını önleyen sıralama) ve alıcı ödemeli şube iadesi.":
            "Shipment registration through the Aras SOAP service (SetOrder), box barcode and Code128 dispatch slip generation; reading tracking number, handoff and delivery info back via cron (every 30 min, QT1/QT12) and advancing the order automatically through the state machine. A fallback query strategy for differences between Aras's live responses and its documentation, Turkey-time date conversion, detection of lost shipments with admin notification, closing the Aras record before refunding on cancellation (an ordering that stops a refunded parcel from being shipped), and consignee-pays branch returns.",
        'Güvenlik ve Mevzuat:': 'Security and Compliance:',
        'Google OAuth hesap bağlama kuralları, imzalı sipariş bağlantıları, IP tabanlı rate limiting ve mesafeli satış sözleşmesi / ön bilgilendirme formu onayının kayıt altına alınması.':
            'Google OAuth account-linking rules, signed order links, IP-based rate limiting, and recording consent to the distance-sales contract / pre-information form.',
        'Diğer Entegrasyonlar:': 'Other Integrations:',
        'BiFatura e-fatura, Trendyol ürün/kategori senkronu, Resend ve AWS SES ile işlem e-postaları, terk edilmiş sepet hatırlatmaları.':
            'BiFatura e-invoice, Trendyol product/category sync, transactional emails via Resend and AWS SES, abandoned-cart reminders.',
        'Dağıtım ve Operasyon:': 'Deployment and Operations:',
        'Docker ve Coolify üzerinde canlı yayın; zamanlanmış görevler (kargo takibi, sepet hatırlatma, bildirim temizliği), KVKK uyumlu aydınlatma ve çerez onayı, imzalı e-posta bağlantıları.':
            'Live deployment on Docker and Coolify; scheduled jobs (shipment tracking, cart reminders, notification cleanup), privacy notice and cookie consent compliant with Turkish data-protection law (KVKK), signed email links.',
        'Yönetim Paneli ve Analitik:': 'Admin Panel and Analytics:',
        'Ürün/varyant, kampanya, kupon, koleksiyon ve müşteri yönetimi; CLV, kohort ve stok analizi grafikleri ile raporlama.':
            'Product/variant, campaign, coupon, collection and customer management; reporting with CLV, cohort and inventory analysis charts.',
        'Kalite:': 'Quality:',
        '60+ Jest test dosyası, 40+ tablolu Prisma şeması ve 35+ migration; sahte Paynet/Aras servisleriyle uçtan uca doğrulama akışı.':
            '60+ Jest test files, a 40+ table Prisma schema and 35+ migrations; an end-to-end verification flow using fake Paynet/Aras services.',
        'Eğitim': 'Education',
        'Yazılım Mühendisliği, Lisans': "Software Engineering, Bachelor's",
        'Manisa Celal Bayar Üniversitesi | 2020 - 2024': 'Manisa Celal Bayar University | 2020 - 2024',
        'Başarılar': 'Achievements',
        'Hackathon - 2. Sıra:': 'Hackathon - 2nd Place:',
        'Diller': 'Languages',
        'Türkçe': 'Turkish',
        'Anadil': 'Native',
        'İngilizce': 'English',
        'B1 — Orta Düzey': 'B1 — Intermediate',
        "CV'yi PDF Olarak İndir": 'Download CV as PDF',

        // Hakkımda dışı pencereler: iletişim
        'Benimle İletişime Geçin': 'Get in Touch',
        'Yeni fırsatlar ve iş birlikleri için bana ulaşmaktan çekinmeyin.': 'Feel free to reach out for new opportunities and collaborations.',
        'Birlikte harika projeler geliştirelim!': "Let's build great projects together!",
        'Bana Mesaj Gönderin': 'Send Me a Message',
        'Adınız': 'Your name',
        'E-posta adresiniz': 'Your email',
        'Mesajınız': 'Your message',
        'Gönder': 'Send',

        // Skill tree
        'Highcharts / Veri Görselleştirme': 'Highcharts / Data Visualization',
        'Code Review / Hata Yönetimi': 'Code Review / Error Handling',
        '%40 hız artışı': '40% speed gain',
        '32 takım, 2. sıra': '32 teams, 2nd place',
        '30 grafik': '30 charts',
        'KNN öneri motoru': 'KNN recommendation engine',
        'JWT implementasyonu': 'JWT implementation',

        // Kariyer
        'Kariyer Yolculuğum': 'My Career Journey',
        'Kariyer Timeline': 'Career Timeline',
        'Aralık 2025 - Halen': 'December 2025 - Present',
        'Şekerbank T.A.Ş. - İstanbul': 'Şekerbank T.A.Ş. - Istanbul',
        'Java tabanlı core banking uygulamalarında geliştirme': 'Development on Java-based core banking applications',
        'Servis / API entegrasyonları (JSON - XML)': 'Service / API integrations (JSON - XML)',
        'Oracle ve MSSQL sorgu ve stored procedure optimizasyonu': 'Oracle and MSSQL query and stored procedure optimization',
        'Mayıs 2024 - Mart 2025': 'May 2024 - March 2025',
        'İYİGELİR - İstanbul': 'İYİGELİR - Istanbul',
        'KNN algoritması ile yapay zeka destekli fon öneri sistemi': 'AI-assisted fund recommendation system with the KNN algorithm',
        'Portföy sayfasında %40 performans iyileştirmesi': '40% performance improvement on the portfolio page',
        "30 grafik içeren finansal analiz dashboard'u": 'Financial analysis dashboard with 30 charts',
        'Şubat 2024 - Mayıs 2024': 'February 2024 - May 2024',
        '.NET Core MVC projeleri': '.NET Core MVC projects',
        'RESTful API geliştirme ve modülerleştirme': 'RESTful API development and modularization',
        'Kod analizi ve performans optimizasyonu': 'Code analysis and performance optimization',
        'Temmuz 2023 - Ağustos 2023': 'July 2023 - August 2023',
        'Frontend geliştirme (HTML, CSS, JavaScript)': 'Frontend development (HTML, CSS, JavaScript)',
        'Blog sitesi projesi': 'Blog site project',
        'Arayüz ve stil düzenlemeleri': 'UI and styling work',
        'Manisa Celal Bayar Üniversitesi': 'Manisa Celal Bayar University',
        'Yazılım Mühendisliği eğitimi': 'Software Engineering degree',
        '32 takımlı hackathonda 2. sıra': '2nd place in a 32-team hackathon',

        // Başlat menüsü
        'Hakkımda': 'About',
        'Kapat': 'Shut Down',
        'Yeniden Başlat': 'Restart',
        'Mayın Tarlası': 'Minesweeper',
        'Notlar': 'Notes',
        'Görünüm': 'Appearance',

        // Pencere başlıkları
        'Komut İstemi': 'Command Prompt',
        'Görünüm Ayarları': 'Appearance Settings',

        // Mayın tarlası
        'Kolay (9×9, 10 mayın)': 'Easy (9×9, 10 mines)',
        'Orta (12×12, 24 mayın)': 'Medium (12×12, 24 mines)',
        'Bayrak modu': 'Flag mode',
        'Yeni Oyun': 'New Game',
        'Sağ tık veya basılı tutma: bayrak koyar.': 'Right-click or long-press to place a flag.',

        // Notlar
        'Mühendislik Notları': 'Engineering Notes',
        'BkCompany’yi geliştirirken karşıma çıkan sorunlar ve öğrendiklerim.': 'Problems I ran into while building BkCompany and what I learned.',
        'Önce kargo, sonra para': 'Cargo first, money second',
        "Sipariş iptalinde parayı Aras kaydı kapanmadan iade edersem, depodaki sevk fişi okutulduğunda parası dönmüş bir paket yola çıkabilir. BkCompany'de iptal bu yüzden önce Aras kaydını kapatır: takip numarası çıkmışsa iptal durur ve sipariş kargoya alınır, ancak ondan sonra Paynet iadesi yapılır. Aras'a ulaşılamazsa da iptal durur; çünkü yola çıkmış bir paketi iptal etmek geri alınamaz, bekletmek ise güvenlidir.":
            "If I refund the payment on a cancellation before the Aras record is closed, a parcel whose money has already been returned can still leave the warehouse once its dispatch slip is scanned. That's why cancellation in BkCompany closes the Aras record first: if a tracking number already exists, the cancellation stops and the order is marked as shipped, and only after that is the Paynet refund made. If Aras can't be reached the cancellation also stops, because cancelling a parcel that has already left can't be undone, while waiting is safe.",
        'Sipariş iptali': 'Order cancellation',
        'Canlı yanıt dokümandaki gibi değildi': "The live response didn't match the docs",
        "Aras'ın sorgu servisinin canlı yanıtı dokümandan farklı çıktı: satırlar farklı bir etiketin içinde geliyor, teslim saati ayrı bir alanda dönüyor ve aynı gün çıkan gönderi listede hiç görünmüyor. Çözüm olarak listede eşleşmeyen açık siparişleri tek tek sipariş koduyla sorguluyorum. Ders: entegrasyonu dokümana değil, canlı yanıta göre yaz ve ayrıştırıcıyı gerçek yanıt örnekleriyle test et.":
            "The live response of Aras's query service turned out different from its documentation: rows come inside a different tag, the delivery time is returned in a separate field, and a shipment sent out the same day doesn't show up in the list at all. As a fix I query open orders that don't match the list one by one by their order code. Lesson: write the integration against the live response, not the docs, and test the parser with real response samples.",
        'Entegrasyon': 'Integration',
        "Prisma'da undefined filtresi sessizce yok sayılır": 'In Prisma, an undefined filter is silently ignored',
        "Prisma, where içinde değeri undefined olan bir filtreyi yok sayar. Misafir ödeme oturumunu çerezdeki token ile ararken token yoksa filtre kalkar, sorgu yalnızca id'ye düşer ve başkasının oturumunu döndürebilir. Bu yüzden kural şu: erişim filtresi asla undefined kalmamalı.":
            "Prisma ignores a filter whose value is undefined inside where. When looking up a guest checkout session by the token in a cookie, a missing token drops the filter, the query falls back to the id alone and can return somebody else's session. So the rule is: an access filter must never be left undefined.",
        'Güvenlik': 'Security',
        'Misafir ödeme': 'Guest checkout',
        'Sunucu UTC çalışır, Aras Türkiye saatiyle yazar': 'The server runs on UTC, Aras writes Turkey time',
        "Aras'ın teslim tarihleri Türkiye saatiyle geliyor, konteyner ise UTC çalışıyor. new Date(y, m, d) kullanınca teslim 3 saat kayıyor ve gün sınırındaki kayıt bir önceki güne yazılıyor. Tarihleri sabit UTC+3 üzerinden çeviren tek bir fonksiyon kullanıyorum; aynı sebeple yılı ve ayı da Türkiye saatine göre okuyorum (sipariş numarasındaki yıl/ay dahil).":
            "Aras's delivery dates come in Turkey time while the container runs on UTC. With new Date(y, m, d) the delivery shifts by 3 hours and a record at the day boundary is written to the previous day. I use a single function that converts dates through a fixed UTC+3, and for the same reason I read the year and month in Turkey time too (including the year/month in the order number).",
        'Zaman dilimi': 'Time zone',

        // Duvar kâğıdı
        'Masaüstü Arka Planı': 'Desktop Background',
        'Beğendiğin bir arka planı seç; tercihin bu tarayıcıda hatırlanır.': 'Pick a background you like; your choice is remembered in this browser.',
        'Klasik XP': 'Classic XP',
        'Gökyüzü': 'Sky',
        'Gece': 'Night',
        'Gün Batımı': 'Sunset',
        'Grafit': 'Graphite'
    };

    // title / aria-label / placeholder değerleri
    const EN_ATTR = {
        'Projelerim': 'My Projects',
        'Hakkımda': 'About',
        'İletişim': 'Contact',
        'Kariyer': 'Career',
        'E-posta': 'Email',
        "CV'yi indir": 'Download CV',
        'Başlat': 'Start',
        'Küçült': 'Minimize',
        'Büyüt': 'Maximize',
        'Kapat': 'Close',
        'Kopyala': 'Copy',
        'Mayın Tarlası': 'Minesweeper',
        'Notlar': 'Notes',
        'Sesi aç / kapat': 'Toggle sound',
        'Dili değiştir': 'Change language',
        'Yeni oyun': 'New game',
        'Zorluk': 'Difficulty',
        'Komut': 'Command',
        'Mavi ekran': 'Blue screen',
        'Mayın tarlası': 'Minesweeper grid'
    };

    const ABOUT_EN = `=========================================
              ABOUT ME
=========================================

Hi! I'm Ertuğrul Kundak.

I'm a Software Engineer with over 2.5 years of
experience in banking and financial technology.

I currently work at Şekerbank T.A.Ş. on Java-based core
banking applications. I build the service/API integrations
between in-bank modules and third-party services, and I
develop queries, stored procedures and reports on Oracle
and MSSQL with a focus on performance optimization.

Before that, at İYİGELİR, I built secure RESTful APIs for
mobile and web applications with ASP.NET Core and Entity
Framework:

  * Improved portfolio page load speed by 40%
  * Designed a financial analysis dashboard with 30 charts
    (1-3 second load time)
  * Built an AI-assisted fund recommendation system with
    the KNN algorithm
  * Developed JWT-based authentication and middleware
    solutions

Areas of Expertise:

  [x] Core Banking Development and System Integrations
  [x] ASP.NET Core / .NET Framework and Java
  [x] RESTful API Design and JWT Security
  [x] Oracle / MSSQL - PL/SQL, T-SQL, Query Optimization
  [x] Financial Data Analytics and Visualization
  [x] Performance Tuning and Defect Analysis

My team took 2nd place in a hackathon with 32 teams.

Manisa Celal Bayar University - Software Engineering (2020-2024)

"Writing performant code means perfecting
 the user experience."

=========================================`;

    const META_EN = {
        title: 'Ertuğrul Kundak | Software Engineer — Backend & Full Stack (.NET / Java)',
        description: 'Ertuğrul Kundak — Software Engineer with 2.5+ years of experience in banking and financial technology. Core banking, service integrations, C#, Java, ASP.NET Core, Oracle, MSSQL, RESTful API.',
        ogTitle: 'Ertuğrul Kundak | Software Engineer — Backend & Full Stack',
        ogDescription: '2.5+ years in banking and fintech. Core banking development, service integrations, Oracle/MSSQL optimization, RESTful APIs with ASP.NET Core.'
    };

    // Not: görev çubuğu etiketleri features.js içinde pencere başlığından yeniden yazılır.
    const textStore = new WeakMap();
    const attrStore = new WeakMap();
    let lang = 'tr';
    let aboutOriginal = null;
    const metaOriginal = {};

    const norm = (s) => s.replace(/\s+/g, ' ').trim();

    function textNodes(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const parent = node.parentNode;
                if (!parent) return NodeFilter.FILTER_REJECT;
                const tag = parent.nodeName;
                if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
                if (parent.closest && parent.closest('[data-no-i18n]')) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        const list = [];
        let n;
        while ((n = walker.nextNode())) list.push(n);
        return list;
    }

    function applyText(root, toEn) {
        textNodes(root).forEach((node) => {
            if (toEn) {
                const orig = textStore.has(node) ? textStore.get(node) : node.nodeValue;
                const en = EN[norm(orig)];
                if (en === undefined) return;
                if (!textStore.has(node)) textStore.set(node, orig);
                const lead = orig.match(/^\s*/)[0];
                const trail = orig.match(/\s*$/)[0];
                node.nodeValue = lead + en + trail;
            } else if (textStore.has(node)) {
                node.nodeValue = textStore.get(node);
                textStore.delete(node);
            }
        });
    }

    function applyAttrs(root, toEn) {
        root.querySelectorAll('[title],[aria-label],[placeholder]').forEach((el) => {
            ['title', 'aria-label', 'placeholder'].forEach((attr) => {
                if (!el.hasAttribute(attr)) return;
                let saved = attrStore.get(el);
                if (toEn) {
                    const orig = saved && attr in saved ? saved[attr] : el.getAttribute(attr);
                    const en = EN_ATTR[orig];
                    if (en === undefined) return;
                    if (!saved) { saved = {}; attrStore.set(el, saved); }
                    saved[attr] = orig;
                    el.setAttribute(attr, en);
                } else if (saved && attr in saved) {
                    el.setAttribute(attr, saved[attr]);
                    delete saved[attr];
                }
            });
        });
    }

    function applyAbout(toEn) {
        const pre = document.getElementById('aboutText');
        if (!pre) return;
        if (aboutOriginal === null) aboutOriginal = pre.textContent;
        pre.textContent = toEn ? ABOUT_EN : aboutOriginal;
    }

    function applyMeta(toEn) {
        const setMeta = (selector, attr, key, value) => {
            const el = document.querySelector(selector);
            if (!el) return;
            if (!(key in metaOriginal)) metaOriginal[key] = el.getAttribute(attr);
            el.setAttribute(attr, toEn ? value : metaOriginal[key]);
        };
        if (!('title' in metaOriginal)) metaOriginal.title = document.title;
        document.title = toEn ? META_EN.title : metaOriginal.title;
        setMeta('meta[name="description"]', 'content', 'description', META_EN.description);
        setMeta('meta[property="og:title"]', 'content', 'ogTitle', META_EN.ogTitle);
        setMeta('meta[property="og:description"]', 'content', 'ogDescription', META_EN.ogDescription);
    }

    function setLang(next, opts) {
        const toEn = next === 'en';
        lang = toEn ? 'en' : 'tr';
        document.documentElement.lang = lang;
        applyText(document.body, toEn);
        applyAttrs(document.body, toEn);
        applyAbout(toEn);
        applyMeta(toEn);
        try { localStorage.setItem('ek:lang', lang); } catch (e) { /* tercih saklanamazsa sorun değil */ }
        document.dispatchEvent(new CustomEvent('langchange', { detail: { lang, initial: !!(opts && opts.initial) } }));
    }

    window.I18N = {
        get lang() { return lang; },
        set: setLang,
        toggle() { setLang(lang === 'en' ? 'tr' : 'en'); },
        // JS ile üretilen metinler için: L('Türkçe', 'English')
        L(tr, en) { return lang === 'en' ? en : tr; }
    };

    // script.js içindeki sabit Türkçe metinler için (örn. toast): t('Kapatılıyor...')
    window.t = function (tr) {
        return lang === 'en' ? (EN[norm(tr)] || tr) : tr;
    };

    document.addEventListener('DOMContentLoaded', function () {
        let saved = 'tr';
        try { saved = localStorage.getItem('ek:lang') || 'tr'; } catch (e) { /* yok say */ }
        if (saved === 'en') setLang('en', { initial: true });
    });
})();
