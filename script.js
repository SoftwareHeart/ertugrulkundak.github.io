// Global Variables
let zIndexCounter = 1000;
let activeWindow = null;
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let dragElement = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen, then hide after 2.5 seconds
    const loadingScreen = document.getElementById('loadingScreen');

    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 2500);

    initializeDesktopIcons();
    initializeClock();
    initializeContextMenu();
    initializeWindows();
    initializeStartMenu();
});

// Desktop Icons - Click Handler
function initializeDesktopIcons() {
    const icons = document.querySelectorAll('.desktop-icon');

    icons.forEach(icon => {
        // Single click to open window (more intuitive for web)
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            const windowId = this.getAttribute('data-window');
            openWindow(windowId);
        });

        // Also support double click
        icon.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            const windowId = this.getAttribute('data-window');
            openWindow(windowId);
        });
    });

    // Deselect icons when clicking on desktop
    document.getElementById('desktop').addEventListener('click', function(e) {
        if (e.target === this) {
            deselectAllIcons();
        }
    });
}

// Select/Deselect Icons
function selectIcon(icon) {
    deselectAllIcons();
    icon.classList.add('selected');
}

function deselectAllIcons() {
    const icons = document.querySelectorAll('.desktop-icon');
    icons.forEach(icon => icon.classList.remove('selected'));
}

// Clock Update
function initializeClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}`;
}

// Context Menu
function initializeContextMenu() {
    const contextMenu = document.getElementById('contextMenu');
    const desktop = document.getElementById('desktop');

    desktop.addEventListener('contextmenu', function(e) {
        e.preventDefault();

        // Position context menu
        contextMenu.style.left = e.clientX + 'px';
        contextMenu.style.top = e.clientY + 'px';
        contextMenu.classList.add('active');
    });

    // Close context menu on click outside
    document.addEventListener('click', function(e) {
        if (!contextMenu.contains(e.target)) {
            contextMenu.classList.remove('active');
        }
    });
}

function refreshDesktop() {
    // Refresh animation
    const desktop = document.getElementById('desktop');
    desktop.style.opacity = '0.5';
    setTimeout(() => {
        desktop.style.opacity = '1';
    }, 200);

    // Close context menu
    document.getElementById('contextMenu').classList.remove('active');
}

// Start Menu
function initializeStartMenu() {
    const startBtn = document.querySelector('.start-btn');
    const startMenu = document.getElementById('startMenu');
    const menuItems = document.querySelectorAll('.start-menu-item');

    // Toggle start menu
    startBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        startMenu.classList.toggle('active');
    });

    // Open windows from start menu
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const windowId = this.getAttribute('data-window');
            openWindow(windowId);
            startMenu.classList.remove('active');
        });
    });

    // Close start menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
            startMenu.classList.remove('active');
        }
    });

    // Power button - closes browser tab with animation
    const powerBtn = document.querySelector('.start-menu-power');
    if (powerBtn) {
        powerBtn.addEventListener('click', function() {
            startMenu.classList.remove('active');
            shutdownComputer();
        });
    }
}

// Window Management
function initializeWindows() {
    const windows = document.querySelectorAll('.window');

    windows.forEach(window => {
        const header = window.querySelector('.window-header');

        // Make window draggable
        header.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') {
                return; // Don't drag if clicking on buttons
            }

            startDragging(e, window);
        });

        // Bring window to front on click
        window.addEventListener('mousedown', function() {
            bringToFront(window.id);
        });
    });
}

// Open Window
function openWindow(windowId) {
    const window = document.getElementById(windowId);
    if (!window) return;

    // Check if already open
    if (window.classList.contains('active')) {
        bringToFront(windowId);
        return;
    }

    // Position window (centered with slight offset for multiple windows)
    const offsetX = (zIndexCounter - 1000) * 30;
    const offsetY = (zIndexCounter - 1000) * 30;

    window.style.left = `${150 + (offsetX % 200)}px`;
    window.style.top = `${100 + (offsetY % 150)}px`;

    // Show window with animation
    window.classList.add('active', 'opening');
    window.classList.remove('minimized');

    setTimeout(() => {
        window.classList.remove('opening');
    }, 300);

    // Add to taskbar
    addToTaskbar(windowId);

    // Bring to front
    bringToFront(windowId);
}

// Close Window
function closeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (!window) return;

    // Close animation
    window.classList.add('closing');

    setTimeout(() => {
        window.classList.remove('active', 'closing');
        removeFromTaskbar(windowId);
    }, 300);
}

// Minimize Window
function minimizeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (!window) return;

    // Add minimizing animation
    window.classList.add('minimizing');

    setTimeout(() => {
        window.classList.add('minimized');
        window.classList.remove('active', 'minimizing');
    }, 300);

    // Update taskbar item
    const taskbarItem = document.querySelector(`[data-window-id="${windowId}"]`);
    if (taskbarItem) {
        taskbarItem.classList.remove('active');
    }
}

// Maximize Window
function maximizeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (!window) return;

    if (window.classList.contains('maximized')) {
        // Restore
        window.classList.remove('maximized');
    } else {
        // Maximize
        window.classList.add('maximized');
    }
}

// Bring Window to Front
function bringToFront(windowId) {
    const window = document.getElementById(windowId);
    if (!window) return;

    zIndexCounter++;
    window.style.zIndex = zIndexCounter;
    activeWindow = windowId;

    // Update taskbar active state
    const taskbarItems = document.querySelectorAll('.taskbar-item');
    taskbarItems.forEach(item => {
        if (item.getAttribute('data-window-id') === windowId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Drag Window Functions
function startDragging(e, window) {
    // Don't drag if maximized
    if (window.classList.contains('maximized')) return;

    isDragging = true;
    dragElement = window;

    initialX = e.clientX - window.offsetLeft;
    initialY = e.clientY - window.offsetTop;

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
}

function drag(e) {
    if (!isDragging) return;

    e.preventDefault();

    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    // Boundary checks
    const maxX = window.innerWidth - dragElement.offsetWidth;
    const maxY = window.innerHeight - 50 - dragElement.offsetHeight; // 50px for taskbar

    currentX = Math.max(0, Math.min(currentX, maxX));
    currentY = Math.max(0, Math.min(currentY, maxY));

    dragElement.style.left = currentX + 'px';
    dragElement.style.top = currentY + 'px';
}

function stopDragging() {
    isDragging = false;
    dragElement = null;

    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDragging);
}

// Taskbar Management
function addToTaskbar(windowId) {
    // Check if already in taskbar
    const existingItem = document.querySelector(`[data-window-id="${windowId}"]`);
    if (existingItem) {
        existingItem.classList.add('active');
        return;
    }

    const window = document.getElementById(windowId);
    const title = window.querySelector('.window-title span').textContent;
    const icon = window.querySelector('.window-title i').className;

    const taskbarItems = document.getElementById('taskbarItems');

    const taskbarItem = document.createElement('button');
    taskbarItem.className = 'taskbar-item active';
    taskbarItem.setAttribute('data-window-id', windowId);

    taskbarItem.innerHTML = `
        <i class="${icon}"></i>
        <span>${title}</span>
    `;

    taskbarItem.addEventListener('click', function() {
        toggleWindowFromTaskbar(windowId);
    });

    taskbarItems.appendChild(taskbarItem);
}

function removeFromTaskbar(windowId) {
    const taskbarItem = document.querySelector(`[data-window-id="${windowId}"]`);
    if (taskbarItem) {
        taskbarItem.remove();
    }
}

function toggleWindowFromTaskbar(windowId) {
    const window = document.getElementById(windowId);

    if (window.classList.contains('minimized')) {
        // Restore window
        window.classList.remove('minimized');
        window.classList.add('active');
        bringToFront(windowId);
    } else if (window.classList.contains('active') && activeWindow === windowId) {
        // Minimize if already active
        minimizeWindow(windowId);
    } else {
        // Bring to front
        window.classList.add('active');
        bringToFront(windowId);
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + F4 to close active window
    if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        if (activeWindow) {
            closeWindow(activeWindow);
        }
    }

    // Escape to close context menu
    if (e.key === 'Escape') {
        document.getElementById('contextMenu').classList.remove('active');
    }
});

// Prevent text selection while dragging
document.addEventListener('selectstart', function(e) {
    if (isDragging) {
        e.preventDefault();
    }
});

// Window resize observer for responsive behavior
window.addEventListener('resize', function() {
    const openWindows = document.querySelectorAll('.window.active');

    // Pencereler ekran dışında kalmasın
    openWindows.forEach(win => keepWindowInViewport(win));
});

// Touch support for mobile
let touchStartX = 0;
let touchStartY = 0;
let touchElement = null;

document.addEventListener('touchstart', function(e) {
    const target = e.target.closest('.window-header');
    if (!target) return;

    const window = target.closest('.window');
    if (window.classList.contains('maximized')) return;

    touchElement = window;
    touchStartX = e.touches[0].clientX - window.offsetLeft;
    touchStartY = e.touches[0].clientY - window.offsetTop;
}, { passive: true });

document.addEventListener('touchmove', function(e) {
    if (!touchElement) return;

    const currentX = e.touches[0].clientX - touchStartX;
    const currentY = e.touches[0].clientY - touchStartY;

    // Boundary checks
    const maxX = window.innerWidth - touchElement.offsetWidth;
    const maxY = window.innerHeight - 50 - touchElement.offsetHeight;

    const boundedX = Math.max(0, Math.min(currentX, maxX));
    const boundedY = Math.max(0, Math.min(currentY, maxY));

    touchElement.style.left = boundedX + 'px';
    touchElement.style.top = boundedY + 'px';
}, { passive: true });

document.addEventListener('touchend', function() {
    touchElement = null;
}, { passive: true });

// Shutdown Computer Function
function shutdownComputer() {
    const loadingScreen = document.getElementById('loadingScreen');

    // Show loading screen again with shutdown text
    const loadingText = loadingScreen.querySelector('.loading-text');
    const mainTitle = loadingScreen.querySelector('h1');
    const subtitle = loadingScreen.querySelector('p:not(.loading-text)');
    const windowsLogo = loadingScreen.querySelector('.windows-logo');
    const loadingBar = loadingScreen.querySelector('.loading-bar');

    // Change text and hide elements
    loadingText.textContent = 'Kapatılıyor...';
    mainTitle.textContent = 'Güle güle';
    subtitle.textContent = 'Sistem kapatılıyor';

    // Hide loading bar
    loadingBar.style.opacity = '0';

    // Show the loading screen with shutdown animation
    loadingScreen.classList.remove('hidden');
    loadingScreen.classList.add('shutdown');

    // Add spinning animation to Windows logo
    windowsLogo.style.animation = 'shutdownSpin 2s ease-out forwards';

    // Wait for animation to complete, then close the tab
    setTimeout(() => {
        // Try to close the window/tab
        window.close();

        // If window.close() doesn't work (browser security), show a message
        setTimeout(() => {
            loadingScreen.style.background = '#000';
            loadingText.textContent = 'Bu sekme otomatik kapatılamıyor';
            loadingText.style.fontSize = '14px';
            mainTitle.style.display = 'none';
            subtitle.style.display = 'none';
            windowsLogo.style.display = 'none';

            const closeMessage = document.createElement('p');
            closeMessage.textContent = 'Lütfen sekmeyi manuel olarak kapatın (Ctrl+W)';
            closeMessage.style.fontSize = '12px';
            closeMessage.style.marginTop = '10px';
            closeMessage.style.opacity = '0.7';
            loadingScreen.querySelector('.loading-content').appendChild(closeMessage);
        }, 500);
    }, 2500);
}

// Console welcome message
console.log('%c🖥️ Windows Desktop Portfolio', 'font-size: 20px; font-weight: bold; color: #0078d4;');
console.log('%cWelcome to my interactive portfolio! Feel free to explore.', 'font-size: 14px; color: #666;');
console.log('%cBuilt with vanilla JavaScript, HTML & CSS', 'font-size: 12px; color: #999;');

/* ===============================================
   2026 REFRESH — widget / görev çubuğu kısayolları,
   kopyalama, tarih, klavye ve konumlandırma
   =============================================== */

// Pencere konumunu görünür alanın içinde tut (açılışta taşmayı engeller)
function keepWindowInViewport(win) {
    if (!win || win.classList.contains('maximized')) return;

    const taskbarHeight = 50;
    const maxLeft = Math.max(8, window.innerWidth - win.offsetWidth - 8);
    const maxTop = Math.max(8, window.innerHeight - taskbarHeight - win.offsetHeight - 8);

    const left = Math.min(parseInt(win.style.left, 10) || 0, maxLeft);
    const top = Math.min(parseInt(win.style.top, 10) || 0, maxTop);

    win.style.left = Math.max(8, left) + 'px';
    win.style.top = Math.max(8, top) + 'px';
}

// Mevcut openWindow davranışını koruyup üzerine konum düzeltmesi ekliyoruz
const baseOpenWindow = openWindow;
openWindow = function (windowId) {
    baseOpenWindow(windowId);
    const win = document.getElementById(windowId);
    if (win) {
        // Küçük ekranlarda pencereyi ortala
        if (window.innerWidth <= 768) {
            win.style.left = '2.5vw';
            win.style.top = '12px';
        }
        keepWindowInViewport(win);
    }
};

// Widget, görev çubuğu ve sağ tık menüsündeki kısayollar
function initializeShortcuts() {
    const shortcuts = document.querySelectorAll(
        '.widget-btn[data-window], .quick-btn[data-window], .context-item[data-window]'
    );

    shortcuts.forEach(el => {
        el.addEventListener('click', function () {
            openWindow(this.getAttribute('data-window'));
            document.getElementById('contextMenu').classList.remove('active');
        });
    });
}

// Masaüstü simgeleri için klavye desteği
function initializeIconKeyboard() {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openWindow(this.getAttribute('data-window'));
            }
        });
    });
}

// Başlık çubuğuna çift tıklayarak büyüt / küçült
function initializeHeaderDoubleClick() {
    document.querySelectorAll('.window').forEach(win => {
        const header = win.querySelector('.window-header');
        if (!header) return;

        header.addEventListener('dblclick', function (e) {
            if (e.target.closest('.window-controls')) return;
            maximizeWindow(win.id);
        });
    });
}

// Kısa bildirim (toast)
let toastTimer = null;

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

// İletişim bilgilerini kopyala
function initializeCopyButtons() {
    document.querySelectorAll('.copy-btn[data-copy]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const value = this.getAttribute('data-copy');
            const icon = this.querySelector('i');

            const done = () => {
                showToast('Kopyalandı: ' + value);
                if (icon) {
                    icon.className = 'fas fa-check';
                    setTimeout(() => (icon.className = 'fas fa-copy'), 1500);
                }
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(value).then(done).catch(() => fallbackCopy(value, done));
            } else {
                fallbackCopy(value, done);
            }
        });
    });
}

function fallbackCopy(value, done) {
    const area = document.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();

    try {
        document.execCommand('copy');
        done();
    } catch (err) {
        showToast('Kopyalanamadı, elle kopyalayabilirsiniz');
    }

    document.body.removeChild(area);
}

// Saatin altında tarih
function initializeClockDate() {
    const dateEl = document.getElementById('clockDate');
    if (!dateEl) return;

    const render = () => {
        dateEl.textContent = new Date().toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    render();
    setInterval(render, 60000);
}

// Escape ile başlat menüsünü de kapat
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const startMenu = document.getElementById('startMenu');
        if (startMenu) startMenu.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    initializeShortcuts();
    initializeIconKeyboard();
    initializeHeaderDoubleClick();
    initializeCopyButtons();
    initializeClockDate();
});

// Bağlantıyla doğrudan pencere açma (ör. ?open=projeler) ve geniş ekranda
// açılışta CV'yi gösterme — ziyaretçi boş bir masaüstü ile karşılaşmasın
const WINDOW_ALIASES = {
    projects: 'projects-window',
    projeler: 'projects-window',
    cv: 'cv-window',
    about: 'about-window',
    hakkimda: 'about-window',
    contact: 'contact-window',
    iletisim: 'contact-window',
    timeline: 'timeline-window',
    kariyer: 'timeline-window',
    skills: 'skills-window',
    yetenekler: 'skills-window'
};

document.addEventListener('DOMContentLoaded', function () {
    const requested = new URLSearchParams(window.location.search).get('open');
    const targetId = requested
        ? (WINDOW_ALIASES[requested.toLowerCase()] || requested)
        : (window.innerWidth >= 1024 ? 'cv-window' : null);

    if (!targetId || !document.getElementById(targetId)) return;

    setTimeout(() => openWindow(targetId), 2800);
});
