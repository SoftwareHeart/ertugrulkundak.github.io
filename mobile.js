// Mobil katman — script.js'ten SONRA yüklenmelidir.
(function () {
    const mq = window.matchMedia('(max-width: 768px)');
    const isMobile = () => mq.matches;
    const startMenu = document.getElementById('startMenu');
    const startBtn = document.querySelector('.start-btn');

    // Telefonda tek seferde tek pencere: yenisi açılınca diğerlerini kapat
    const prevOpen = openWindow;
    openWindow = function (windowId) {
        if (isMobile()) {
            document.querySelectorAll('.window.active').forEach(w => {
                if (w.id !== windowId) {
                    w.classList.remove('active', 'minimized');
                    removeFromTaskbar(w.id);
                }
            });
            if (startMenu) startMenu.classList.remove('active');
        }
        prevOpen(windowId);
    };

    // Küçült = kapat (mobilde görev çubuğu listesi yok)
    const prevMinimize = minimizeWindow;
    minimizeWindow = function (windowId) {
        if (isMobile()) return closeWindow(windowId);
        prevMinimize(windowId);
    };

    // Açık pencere / başlat menüsü durumunu body sınıflarına yansıt
    const sync = () => {
        const open = !!document.querySelector('.window.active:not(.closing)');
        document.body.classList.toggle('sheet-open', open && isMobile());
        if (startBtn && startMenu) startBtn.classList.toggle('is-open', startMenu.classList.contains('active'));
    };
    const observer = new MutationObserver(sync);
    document.querySelectorAll('.window').forEach(w => observer.observe(w, { attributes: true, attributeFilter: ['class'] }));
    if (startMenu) observer.observe(startMenu, { attributes: true, attributeFilter: ['class'] });
    mq.addEventListener ? mq.addEventListener('change', sync) : mq.addListener(sync);

    // Başlık çubuğundan aşağı kaydırarak kapat
    document.querySelectorAll('.window').forEach(win => {
        const header = win.querySelector('.window-header');
        if (!header) return;
        let y0 = null, dy = 0, t0 = 0;

        header.addEventListener('touchstart', e => {
            if (!isMobile() || e.target.closest('button')) return;
            y0 = e.touches[0].clientY; dy = 0; t0 = Date.now();
            win.classList.add('dragging');
        }, { passive: true });

        header.addEventListener('touchmove', e => {
            if (y0 === null) return;
            dy = Math.max(0, e.touches[0].clientY - y0);
            win.style.transform = `translateY(${dy}px)`;
        }, { passive: true });

        const end = () => {
            if (y0 === null) return;
            const fast = dy > 40 && (dy / Math.max(1, Date.now() - t0)) > 0.6;
            win.classList.remove('dragging');
            if (dy > 120 || fast) {
                win.style.setProperty('--sheet-dy', dy + 'px');
                win.style.transform = '';
                closeWindow(win.id);
                setTimeout(() => win.style.removeProperty('--sheet-dy'), 350);
            } else {
                win.style.transition = 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)';
                win.style.transform = '';
                setTimeout(() => (win.style.transition = ''), 260);
            }
            y0 = null;
        };
        header.addEventListener('touchend', end);
        header.addEventListener('touchcancel', end);
    });

    // Android geri tuşu / geri hareketi açık pencereyi kapatsın
    window.addEventListener('popstate', () => {
        const open = document.querySelector('.window.active:not(.closing)');
        if (isMobile() && open) closeWindow(open.id);
    });
    const baseOpen = openWindow;
    openWindow = function (windowId) {
        const wasOpen = document.querySelector('.window.active');
        baseOpen(windowId);
        if (isMobile() && !wasOpen && !(history.state && history.state.sheet)) {
            history.pushState({ sheet: windowId }, '');
        }
    };
    const baseClose = closeWindow;
    closeWindow = function (windowId) {
        baseClose(windowId);
        if (isMobile() && history.state && history.state.sheet) history.back();
    };
})();
