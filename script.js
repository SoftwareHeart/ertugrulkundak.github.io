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

    // Power button (optional - just closes menu for now)
    const powerBtn = document.querySelector('.start-menu-power');
    if (powerBtn) {
        powerBtn.addEventListener('click', function() {
            startMenu.classList.remove('active');
            // You can add additional functionality here
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
    const windows = document.querySelectorAll('.window.active');

    windows.forEach(window => {
        if (!window.classList.contains('maximized')) {
            // Ensure windows stay within viewport
            const rect = window.getBoundingClientRect();

            if (rect.right > window.innerWidth) {
                window.style.left = (window.innerWidth - rect.width - 20) + 'px';
            }

            if (rect.bottom > window.innerHeight - 50) {
                window.style.top = (window.innerHeight - 50 - rect.height - 20) + 'px';
            }
        }
    });
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

// Console welcome message
console.log('%c🖥️ Windows Desktop Portfolio', 'font-size: 20px; font-weight: bold; color: #0078d4;');
console.log('%cWelcome to my interactive portfolio! Feel free to explore.', 'font-size: 14px; color: #666;');
console.log('%cBuilt with vanilla JavaScript, HTML & CSS', 'font-size: 12px; color: #999;');
