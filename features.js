/* ===============================================
   FEATURES — ses, terminal, mayın tarlası, duvar
   kâğıdı, BSOD, iletişim formu, dil düğmesi,
   erişilebilirlik ve (opsiyonel) analitik kancaları
   script.js ve i18n.js'ten sonra yüklenir.
   =============================================== */
(function () {
    'use strict';

    const $ = (sel, root) => (root || document).querySelector(sel);
    const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
    const L = (tr, en) => (window.I18N ? window.I18N.L(tr, en) : tr);

    const storage = {
        get(key, fallback) {
            try {
                const v = localStorage.getItem(key);
                return v === null ? fallback : v;
            } catch (e) { return fallback; }
        },
        set(key, value) {
            try { localStorage.setItem(key, value); } catch (e) { /* özel modda yazılamayabilir */ }
        }
    };

    // Analitik kancası: sayfaya Plausible (veya uyumlu) betik eklenirse olaylar gider.
    // Betik yoksa hiçbir şey gönderilmez.
    function track(name, props) {
        try {
            if (typeof window.plausible === 'function') {
                window.plausible(name, props ? { props } : undefined);
            }
        } catch (e) { /* analitik asla siteyi bozmamalı */ }
    }

    // İletişim formu için isteğe bağlı uç nokta (örn. Formspree: 'https://formspree.io/f/xxxx').
    // Boşsa form, e-posta uygulamasını önceden doldurulmuş mesajla açar.
    const FORM_ENDPOINT = '';
    const CONTACT_EMAIL = 'ertugrulkundak@hotmail.com';

    /* ---------------- Ses ---------------- */
    const Sound = (function () {
        let ctx = null;
        let enabled = storage.get('ek:sound', 'off') === 'on';

        function ensure() {
            if (!ctx) {
                const AC = window.AudioContext || window.webkitAudioContext;
                if (!AC) return null;
                ctx = new AC();
            }
            if (ctx.state === 'suspended') ctx.resume();
            return ctx;
        }

        function tone(freq, start, dur, type, vol) {
            const c = ensure();
            if (!c) return;
            const t = c.currentTime + start;
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.exponentialRampToValueAtTime(vol || 0.06, t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(t);
            osc.stop(t + dur + 0.03);
        }

        function noise(dur, vol) {
            const c = ensure();
            if (!c) return;
            const len = Math.floor(c.sampleRate * dur);
            const buffer = c.createBuffer(1, len, c.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
            const src = c.createBufferSource();
            const gain = c.createGain();
            gain.gain.value = vol || 0.2;
            src.buffer = buffer;
            src.connect(gain);
            gain.connect(c.destination);
            src.start();
        }

        const patterns = {
            open() { tone(660, 0, 0.08, 'triangle', 0.045); tone(880, 0.05, 0.1, 'triangle', 0.045); },
            close() { tone(660, 0, 0.08, 'triangle', 0.045); tone(440, 0.05, 0.1, 'triangle', 0.045); },
            click() { tone(520, 0, 0.04, 'square', 0.025); },
            ding() { tone(988, 0, 0.25, 'sine', 0.07); tone(1319, 0.12, 0.4, 'sine', 0.06); },
            startup() {
                [392, 523, 659, 784].forEach((f, i) => tone(f, i * 0.14, 0.75 - i * 0.08, 'sine', 0.06));
                tone(261, 0, 1.1, 'triangle', 0.035);
            },
            error() { tone(220, 0, 0.18, 'square', 0.05); tone(196, 0.2, 0.28, 'square', 0.05); },
            win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.06)); },
            boom() { noise(0.6, 0.22); tone(70, 0, 0.5, 'sawtooth', 0.08); },
            flag() { tone(740, 0, 0.06, 'triangle', 0.045); },
            reveal() { tone(400 + Math.random() * 80, 0, 0.04, 'sine', 0.035); }
        };

        function play(name) {
            if (!enabled) return;
            try { if (patterns[name]) patterns[name](); } catch (e) { /* ses çalınamazsa sorun değil */ }
        }

        function refreshButton() {
            const btn = $('#soundToggle');
            if (!btn) return;
            btn.setAttribute('aria-pressed', String(enabled));
            const icon = $('i', btn);
            if (icon) icon.className = enabled ? 'fas fa-volume-high' : 'fas fa-volume-xmark';
        }

        function set(value) {
            enabled = value;
            storage.set('ek:sound', value ? 'on' : 'off');
            refreshButton();
            if (value) { ensure(); play('startup'); }
        }

        return {
            play, set, refreshButton,
            get enabled() { return enabled; }
        };
    })();

    /* ---------------- Pencere sistemine kancalar ---------------- */
    const WINDOW_TARGETS = {
        projects: 'projects-window', projeler: 'projects-window',
        cv: 'cv-window',
        about: 'about-window', hakkimda: 'about-window',
        contact: 'contact-window', iletisim: 'contact-window',
        timeline: 'timeline-window', kariyer: 'timeline-window', career: 'timeline-window',
        skills: 'skills-window', yetenekler: 'skills-window', skilltree: 'skills-window',
        terminal: 'terminal-window',
        minesweeper: 'minesweeper-window', mayin: 'minesweeper-window', mines: 'minesweeper-window',
        notes: 'notes-window', notlar: 'notes-window',
        wallpaper: 'wallpaper-window', gorunum: 'wallpaper-window', appearance: 'wallpaper-window'
    };

    function hookWindows() {
        const baseOpen = openWindow;
        openWindow = function (windowId) {
            const el = document.getElementById(windowId);
            const wasOpen = el && el.classList.contains('active');
            baseOpen(windowId);
            if (!el) return;
            if (!wasOpen) {
                Sound.play('open');
                track('window_open', { window: windowId });
            }
            setTimeout(() => {
                if (windowId === 'terminal-window') Term.focus();
                else if (windowId === 'minesweeper-window') Mines.ensure();
                else if (window.innerWidth > 768) el.focus({ preventScroll: true });
            }, 60);
        };

        const baseClose = closeWindow;
        closeWindow = function (windowId) {
            Sound.play('close');
            baseClose(windowId);
        };
    }

    function initWindowAccessibility() {
        $$('.window').forEach((win) => {
            const title = $('.window-title span', win);
            win.setAttribute('role', 'dialog');
            win.setAttribute('tabindex', '-1');
            if (title) win.setAttribute('aria-label', title.textContent.trim());
        });
        refreshControlLabels();

        const toast = $('#toast');
        if (toast) {
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
        }

        // Esc: açık menü yoksa en üstteki pencereyi kapat
        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape') return;
            const tag = (e.target && e.target.tagName) || '';
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            if ($('#bsod.show')) return;
            const menuOpen = $('#startMenu.active') || $('#contextMenu.active');
            if (menuOpen) return;
            if (typeof activeWindow !== 'undefined' && activeWindow) {
                const win = document.getElementById(activeWindow);
                if (win && win.classList.contains('active')) closeWindow(activeWindow);
            }
        }, true); // yakalama aşaması: script.js menüyü kapatmadan önce çalışsın
    }

    function refreshControlLabels() {
        $$('.window-controls button').forEach((btn) => {
            const t = btn.getAttribute('title');
            if (t) btn.setAttribute('aria-label', t);
        });
        $$('.window').forEach((win) => {
            const title = $('.window-title span', win);
            if (title) win.setAttribute('aria-label', title.textContent.trim());
        });
    }

    // Görev çubuğu öğeleri pencere başlığından kopyalanır; dil değişince yeniden eşitle
    function refreshTaskbarLabels() {
        $$('.taskbar-item[data-window-id]').forEach((item) => {
            const win = document.getElementById(item.getAttribute('data-window-id'));
            const title = win && $('.window-title span', win);
            const label = $('span', item);
            if (title && label) label.textContent = title.textContent;
        });
    }

    /* ---------------- Terminal ---------------- */
    const Term = (function () {
        const out = $('#termOutput');
        const input = $('#termInput');
        const body = $('#termBody');
        const history = [];
        let cursor = 0;
        let booted = false;
        const startedAt = Date.now();

        if (!out || !input || !body) return { focus() {} };

        function scrollDown() { body.scrollTop = body.scrollHeight; }

        function print(text, cls) {
            const div = document.createElement('div');
            div.className = 't-line' + (cls ? ' ' + cls : '');
            div.textContent = text;
            out.appendChild(div);
            scrollDown();
        }

        function printLink(label, href, prefix) {
            const div = document.createElement('div');
            div.className = 't-line';
            if (prefix) div.appendChild(document.createTextNode(prefix));
            const a = document.createElement('a');
            a.href = href;
            a.textContent = label;
            if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
            div.appendChild(a);
            out.appendChild(div);
            scrollDown();
        }

        function table(rows) {
            const width = Math.max.apply(null, rows.map((r) => r[0].length)) + 2;
            rows.forEach((r) => print(r[0].padEnd(width) + L(r[1], r[2])));
        }

        const commands = {
            help() {
                print(L('Kullanılabilir komutlar:', 'Available commands:'), 't-accent');
                table([
                    ['about', 'kısa tanıtım', 'short introduction'],
                    ['skills', 'teknik yetkinlikler', 'technical skills'],
                    ['projects', 'projelerin listesi', 'list of projects'],
                    ['experience', 'iş deneyimi', 'work experience'],
                    ['contact', 'iletişim bilgileri', 'contact details'],
                    ['cv', 'CV penceresini aç', 'open the CV window'],
                    ['open <ad>', 'pencere aç (projects, cv, about, notes...)', 'open a window (projects, cv, about, notes...)'],
                    ['neofetch', 'sistem bilgisi kartı', 'system info card'],
                    ['wallpaper <ad>', 'xp, sky, night, sunset, aurora, graphite', 'xp, sky, night, sunset, aurora, graphite'],
                    ['lang <tr|en>', 'dili değiştir', 'switch language'],
                    ['sound <on|off>', 'sesi aç/kapat', 'toggle sound'],
                    ['minesweeper', 'mayın tarlasını başlat', 'start minesweeper'],
                    ['bsod', 'kritik hata ekranı (şaka)', 'blue screen (joke)'],
                    ['clear', 'ekranı temizle', 'clear the screen'],
                    ['whoami, date, echo, ls', '', '']
                ]);
            },
            about() {
                print(L('Ertuğrul Kundak — Yazılım Mühendisi (Backend & Full Stack, .NET / Java)', 'Ertuğrul Kundak — Software Engineer (Backend & Full Stack, .NET / Java)'), 't-ok');
                print(L('Bankacılık ve fintech alanında 2,5+ yıl deneyim. Şu an Şekerbank\'ta Java tabanlı core banking uygulamalarında çalışıyor; boş zamanlarında BkCompany e-ticaret platformunu geliştiriyor.',
                    'Over 2.5 years in banking and fintech. Currently works on Java-based core banking applications at Şekerbank and builds the BkCompany e-commerce platform on the side.'));
            },
            skills() {
                table([
                    ['Backend', 'C#, Java, ASP.NET Core, Entity Framework, RESTful API, JWT', 'C#, Java, ASP.NET Core, Entity Framework, RESTful API, JWT'],
                    ['Frontend', 'React, Next.js, TypeScript, Tailwind CSS', 'React, Next.js, TypeScript, Tailwind CSS'],
                    ['Database', 'Oracle, MSSQL, PostgreSQL, Prisma, PL/SQL, T-SQL', 'Oracle, MSSQL, PostgreSQL, Prisma, PL/SQL, T-SQL'],
                    ['Integration', 'Paynet 3DS, Aras Kargo (SOAP), BiFatura, Trendyol', 'Paynet 3DS, Aras Kargo (SOAP), BiFatura, Trendyol'],
                    ['Tools', 'Git, Docker, Coolify, Jest, Postman', 'Git, Docker, Coolify, Jest, Postman']
                ]);
            },
            projects() {
                print('1. BkCompany — ' + L('uçtan uca e-ticaret platformu', 'end-to-end e-commerce platform'));
                printLink('bkcompany.com.tr', 'https://bkcompany.com.tr/', '   ');
                print('2. Financial Analytics Dashboard');
                print('3. ' + L('Yapay zeka destekli yatırım öneri sistemi (KNN)', 'AI-powered investment recommendation system (KNN)'));
                print('4. ' + L('Çoklu para birimi fon portföy sistemi', 'Multi-currency fund portfolio system'));
                print('5. ' + L('Core banking servis entegrasyonları', 'Core banking service integrations'));
                print('6. Aleris Global Logistics — ' + L('kurumsal web sitesi', 'corporate website'));
                print(L("Ayrıntı için 'open projects' yazın.", "Type 'open projects' for details."), 't-dim');
            },
            experience() {
                table([
                    ['2025-12 →', 'Şekerbank — Yazılım Mühendisi (Core Banking, Java/Oracle)', 'Şekerbank — Software Engineer (Core Banking, Java/Oracle)'],
                    ['2024-05 →', 'İYİGELİR — Yazılım Mühendisi (ASP.NET Core, API, dashboard)', 'İYİGELİR — Software Engineer (ASP.NET Core, API, dashboard)'],
                    ['2024-02 →', 'İYİGELİR — Yazılım Stajyeri', 'İYİGELİR — Software Intern'],
                    ['2023-07 →', 'PENDC — Yazılım Stajyeri', 'PENDC — Software Intern']
                ]);
            },
            contact() {
                printLink(CONTACT_EMAIL, 'mailto:' + CONTACT_EMAIL, 'email     ');
                printLink('github.com/SoftwareHeart', 'https://github.com/SoftwareHeart', 'github    ');
                printLink('linkedin.com/in/ertugrul-kundak', 'https://www.linkedin.com/in/ertugrul-kundak/', 'linkedin  ');
            },
            cv() {
                openWindow('cv-window');
                print(L('CV penceresi açıldı.', 'CV window opened.'), 't-ok');
            },
            open(args) {
                const key = (args[0] || '').toLowerCase().replace(/[^a-z]/g, '');
                const id = WINDOW_TARGETS[key];
                if (!id) {
                    print(L('Kullanım: open <projects|cv|about|contact|timeline|skills|terminal|minesweeper|notes|wallpaper>', 'Usage: open <projects|cv|about|contact|timeline|skills|terminal|minesweeper|notes|wallpaper>'), 't-err');
                    return;
                }
                openWindow(id);
                print(L('Açıldı: ', 'Opened: ') + id.replace('-window', ''), 't-ok');
            },
            github() { window.open('https://github.com/SoftwareHeart', '_blank', 'noopener'); },
            linkedin() { window.open('https://www.linkedin.com/in/ertugrul-kundak/', '_blank', 'noopener'); },
            whoami() { print('ertugrul'); },
            date() { print(new Date().toLocaleString(window.I18N && window.I18N.lang === 'en' ? 'en-GB' : 'tr-TR')); },
            echo(args) { print(args.join(' ')); },
            ls() { print('projects/  cv.pdf  about.txt  contact  notes.md  skilltree.exe  mines.exe'); },
            clear() { out.textContent = ''; },
            neofetch() {
                const up = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
                [
                    '  ┌────────┐   ertugrul@portfolio',
                    '  │   EK   │   ──────────────────',
                    '  └────────┘   OS:      Windows XP (web edition)',
                    '               Role:    ' + L('Yazılım Mühendisi', 'Software Engineer'),
                    '               Stack:   C# · Java · TypeScript',
                    '               DB:      Oracle · MSSQL · PostgreSQL',
                    '               Now:     Core Banking @ Şekerbank',
                    '               Uptime:  ' + up + 's',
                    '               Shell:   portfolio-sh 1.0'
                ].forEach((l) => print(l, 't-accent'));
            },
            wallpaper(args) {
                const name = (args[0] || '').toLowerCase();
                if (!Wallpaper.has(name)) {
                    print(L('Kullanım: wallpaper <xp|sky|night|sunset|aurora|graphite>', 'Usage: wallpaper <xp|sky|night|sunset|aurora|graphite>'), 't-err');
                    return;
                }
                Wallpaper.set(name);
                print(L('Arka plan: ', 'Wallpaper: ') + name, 't-ok');
            },
            lang(args) {
                const next = (args[0] || '').toLowerCase();
                if (next !== 'tr' && next !== 'en') {
                    print(L('Kullanım: lang <tr|en>', 'Usage: lang <tr|en>'), 't-err');
                    return;
                }
                window.I18N.set(next);
                print(next === 'en' ? 'Language: English' : 'Dil: Türkçe', 't-ok');
            },
            sound(args) {
                const v = (args[0] || '').toLowerCase();
                if (v !== 'on' && v !== 'off') {
                    print(L('Kullanım: sound <on|off>', 'Usage: sound <on|off>'), 't-err');
                    return;
                }
                Sound.set(v === 'on');
                print(L('Ses: ', 'Sound: ') + v, 't-ok');
            },
            minesweeper() { openWindow('minesweeper-window'); },
            bsod() { showBsod(); },
            sudo() { print(L('ertugrul, sudoers dosyasında değil. Bu olay rapor edilecek.', 'ertugrul is not in the sudoers file. This incident will be reported.'), 't-err'); },
            exit() { closeWindow('terminal-window'); }
        };
        commands.mines = commands.minesweeper;
        commands.ver = function () { print('Portfolio [Version 5.1.2600]'); };

        function run(raw) {
            const line = raw.trim();
            const row = document.createElement('div');
            row.className = 't-line';
            const p = document.createElement('span');
            p.className = 't-prompt';
            p.textContent = 'ertugrul@portfolio:~$ ';
            const c = document.createElement('span');
            c.className = 't-cmd';
            c.textContent = raw;
            row.appendChild(p);
            row.appendChild(c);
            out.appendChild(row);

            if (!line) return;
            history.push(line);
            cursor = history.length;
            track('terminal_command', { command: line.split(/\s+/)[0].toLowerCase().slice(0, 20) });

            const parts = line.split(/\s+/);
            const name = parts[0].toLowerCase();
            const handler = Object.prototype.hasOwnProperty.call(commands, name) ? commands[name] : null;
            if (!handler) {
                print(L("'" + name + "' komutu bulunamadı. 'help' yazın.", "'" + name + "': command not found. Type 'help'."), 't-err');
                Sound.play('error');
                return;
            }
            handler(parts.slice(1));
            scrollDown();
        }

        function complete() {
            const value = input.value.trim().toLowerCase();
            if (!value || value.indexOf(' ') !== -1) return;
            const matches = Object.keys(commands).filter((c) => c.indexOf(value) === 0);
            if (matches.length === 1) input.value = matches[0] + ' ';
            else if (matches.length > 1) print(matches.join('  '), 't-dim');
        }

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                const v = input.value;
                input.value = '';
                run(v);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (cursor > 0) { cursor--; input.value = history[cursor] || ''; }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (cursor < history.length) { cursor++; input.value = history[cursor] || ''; }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                complete();
            } else if (e.key === 'l' && e.ctrlKey) {
                e.preventDefault();
                commands.clear();
            }
        });

        body.addEventListener('click', function () {
            if (!window.getSelection || window.getSelection().toString() === '') input.focus();
        });

        function boot() {
            if (booted) return;
            booted = true;
            print('Portfolio [Version 5.1.2600]', 't-dim');
            print(L("Hoş geldiniz! Komutları görmek için 'help' yazın.", "Welcome! Type 'help' to see the commands."), 't-ok');
            print('');
        }

        return {
            focus() { boot(); input.focus({ preventScroll: true }); }
        };
    })();

    /* ---------------- Mayın Tarlası ---------------- */
    const Mines = (function () {
        const grid = $('#msGrid');
        if (!grid) return { ensure() {} };

        const face = $('#msFace');
        const mineCount = $('#msMines');
        const timeEl = $('#msTime');
        const statusEl = $('#msStatus');
        const bestEl = $('#msBest');
        const levelSel = $('#msLevel');
        const flagBtn = $('#msFlagMode');
        const newBtn = $('#msNew');

        const LEVELS = {
            easy: { rows: 9, cols: 9, mines: 10 },
            medium: { rows: 12, cols: 12, mines: 24 }
        };

        let level = 'easy';
        let cells = [];
        let over = false;
        let started = false;
        let revealedCount = 0;
        let flags = 0;
        let seconds = 0;
        let timer = null;
        let flagMode = false;
        let built = false;
        let pressTimer = null;
        let longPressed = false;

        const pad = (n) => String(Math.max(0, Math.min(999, n))).padStart(3, '0');

        function neighbors(i) {
            const { rows, cols } = LEVELS[level];
            const r = Math.floor(i / cols);
            const c = i % cols;
            const list = [];
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (!dr && !dc) continue;
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) list.push(nr * cols + nc);
                }
            }
            return list;
        }

        function bestKey() { return 'ek:ms:best:' + level; }

        function renderBest() {
            const best = parseInt(storage.get(bestKey(), ''), 10);
            bestEl.textContent = isNaN(best)
                ? L('En iyi süre: —', 'Best time: —')
                : L('En iyi süre: ', 'Best time: ') + best + L(' sn', ' s');
        }

        function setStatus(text) { statusEl.textContent = text; }

        function newGame() {
            clearInterval(timer);
            const { rows, cols, mines } = LEVELS[level];
            cells = Array.from({ length: rows * cols }, () => ({ mine: false, adj: 0, open: false, flag: false }));
            over = false;
            started = false;
            revealedCount = 0;
            flags = 0;
            seconds = 0;

            grid.textContent = '';
            grid.style.gridTemplateColumns = 'repeat(' + cols + ', var(--ms-cell))';
            const frag = document.createDocumentFragment();
            for (let i = 0; i < rows * cols; i++) {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'ms-cell';
                b.dataset.i = String(i);
                b.setAttribute('aria-label', L('Kapalı hücre', 'Hidden cell'));
                frag.appendChild(b);
            }
            grid.appendChild(frag);

            face.textContent = '🙂';
            mineCount.textContent = pad(mines);
            timeEl.textContent = pad(0);
            setStatus(L('Bir hücreye tıklayarak başla.', 'Click a cell to start.'));
            renderBest();
            built = true;
        }

        function placeMines(safe) {
            const { mines } = LEVELS[level];
            const forbidden = new Set([safe].concat(neighbors(safe)));
            let placed = 0;
            while (placed < mines) {
                const i = Math.floor(Math.random() * cells.length);
                if (cells[i].mine || forbidden.has(i)) continue;
                cells[i].mine = true;
                placed++;
            }
            cells.forEach((cell, i) => {
                cell.adj = neighbors(i).filter((n) => cells[n].mine).length;
            });
        }

        function paint(i) {
            const cell = cells[i];
            const el = grid.children[i];
            if (!el) return;
            el.className = 'ms-cell';
            el.textContent = '';
            if (cell.open) {
                el.classList.add('open');
                if (cell.mine) {
                    el.textContent = '💣';
                    el.setAttribute('aria-label', L('Mayın', 'Mine'));
                } else if (cell.adj) {
                    el.textContent = String(cell.adj);
                    el.classList.add('n' + cell.adj);
                    el.setAttribute('aria-label', String(cell.adj));
                } else {
                    el.setAttribute('aria-label', L('Boş', 'Empty'));
                }
            } else if (cell.flag) {
                el.textContent = '🚩';
                el.setAttribute('aria-label', L('Bayrak', 'Flag'));
            } else {
                el.setAttribute('aria-label', L('Kapalı hücre', 'Hidden cell'));
            }
        }

        function startTimer() {
            clearInterval(timer);
            timer = setInterval(() => {
                seconds++;
                timeEl.textContent = pad(seconds);
            }, 1000);
        }

        function reveal(i) {
            const stack = [i];
            while (stack.length) {
                const idx = stack.pop();
                const cell = cells[idx];
                if (cell.open || cell.flag) continue;
                cell.open = true;
                revealedCount++;
                paint(idx);
                if (cell.adj === 0 && !cell.mine) {
                    neighbors(idx).forEach((n) => { if (!cells[n].open && !cells[n].flag) stack.push(n); });
                }
            }
        }

        function lose(hit) {
            over = true;
            clearInterval(timer);
            cells.forEach((cell, i) => {
                if (cell.mine && !cell.flag) { cell.open = true; paint(i); }
            });
            grid.children[hit].classList.add('boom');
            face.textContent = '😵';
            setStatus(L('Mayına bastın! Yeni oyun için yüze tıkla.', 'You hit a mine! Click the face for a new game.'));
            Sound.play('boom');
        }

        function win() {
            over = true;
            clearInterval(timer);
            face.textContent = '😎';
            cells.forEach((cell, i) => {
                if (cell.mine && !cell.flag) { cell.flag = true; paint(i); }
            });
            mineCount.textContent = pad(0);
            const best = parseInt(storage.get(bestKey(), ''), 10);
            if (isNaN(best) || seconds < best) {
                storage.set(bestKey(), String(seconds));
                setStatus(L('Kazandın! Yeni rekor: ' + seconds + ' sn 🎉', 'You won! New record: ' + seconds + ' s 🎉'));
            } else {
                setStatus(L('Kazandın! Süre: ' + seconds + ' sn 🎉', 'You won! Time: ' + seconds + ' s 🎉'));
            }
            renderBest();
            Sound.play('win');
            track('minesweeper_win', { level });
        }

        function toggleFlag(i) {
            const cell = cells[i];
            if (cell.open || over) return;
            const { mines } = LEVELS[level];
            if (!cell.flag && flags >= mines) return;
            cell.flag = !cell.flag;
            flags += cell.flag ? 1 : -1;
            mineCount.textContent = pad(mines - flags);
            paint(i);
            Sound.play('flag');
        }

        function open(i) {
            if (over) return;
            const cell = cells[i];
            if (cell.open || cell.flag) return;
            if (!started) {
                started = true;
                placeMines(i);
                startTimer();
                setStatus('');
            }
            if (cell.mine) {
                cell.open = true;
                paint(i);
                lose(i);
                return;
            }
            reveal(i);
            Sound.play('reveal');
            const { rows, cols, mines } = LEVELS[level];
            if (revealedCount === rows * cols - mines) win();
        }

        function activate(i) {
            if (flagMode) toggleFlag(i);
            else open(i);
        }

        grid.addEventListener('click', function (e) {
            const btn = e.target.closest('.ms-cell');
            if (!btn) return;
            if (longPressed) { longPressed = false; return; }
            activate(parseInt(btn.dataset.i, 10));
        });

        grid.addEventListener('contextmenu', function (e) {
            const btn = e.target.closest('.ms-cell');
            e.preventDefault();
            if (!btn || longPressed) return;
            toggleFlag(parseInt(btn.dataset.i, 10));
        });

        grid.addEventListener('pointerdown', function (e) {
            if (e.pointerType !== 'touch') return;
            const btn = e.target.closest('.ms-cell');
            if (!btn) return;
            longPressed = false;
            clearTimeout(pressTimer);
            pressTimer = setTimeout(function () {
                longPressed = true;
                toggleFlag(parseInt(btn.dataset.i, 10));
                if (navigator.vibrate) navigator.vibrate(15);
            }, 420);
        });

        ['pointerup', 'pointerleave', 'pointercancel'].forEach((type) => {
            grid.addEventListener(type, function () { clearTimeout(pressTimer); });
        });

        face.addEventListener('click', newGame);
        newBtn.addEventListener('click', newGame);
        levelSel.addEventListener('change', function () {
            level = levelSel.value;
            newGame();
        });
        flagBtn.addEventListener('click', function () {
            flagMode = !flagMode;
            flagBtn.setAttribute('aria-pressed', String(flagMode));
        });

        document.addEventListener('langchange', function () {
            if (!built) return;
            renderBest();
            if (!started && !over) setStatus(L('Bir hücreye tıklayarak başla.', 'Click a cell to start.'));
        });

        return {
            ensure() { if (!built) newGame(); }
        };
    })();

    /* ---------------- Duvar kâğıdı ---------------- */
    const Wallpaper = (function () {
        const names = ['xp', 'sky', 'night', 'sunset', 'aurora', 'graphite'];
        const buttons = $$('.wp-swatch');

        function mark(name) {
            buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.wp === name)));
        }

        function set(name) {
            if (names.indexOf(name) === -1) name = 'xp';
            if (name === 'xp') document.body.removeAttribute('data-wallpaper');
            else document.body.setAttribute('data-wallpaper', name);
            storage.set('ek:wallpaper', name);
            mark(name);
        }

        buttons.forEach((b) => b.addEventListener('click', function () {
            set(b.dataset.wp);
            Sound.play('click');
            track('wallpaper_change', { wallpaper: b.dataset.wp });
        }));

        set(storage.get('ek:wallpaper', 'xp'));

        return { set, has: (n) => names.indexOf(n) !== -1 };
    })();

    /* ---------------- BSOD, yeniden başlatma, Konami ---------------- */
    let bsodArmed = false;

    function showBsod() {
        const el = $('#bsod');
        const text = $('#bsodText');
        if (!el || !text) return;
        text.textContent = L(
            'Bir sorun algılandı ve bilgisayarınıza zarar vermemek için Windows kapatıldı.\n\n' +
            'HIRE_ERTUGRUL_KUNDAK\n\n' +
            'Bu ekranı ilk kez görüyorsanız merak etmeyin: bu bir şaka. Portfolyo gayet sağlıklı çalışıyor.\n\n' +
            'Teknik bilgi:\n\n' +
            '*** STOP: 0x000000EK (0xCAFEBABE, 0xDEADBEEF, 0x00000001, 0x00000000)\n\n' +
            'Devam etmek için herhangi bir tuşa basın veya ekrana dokunun.',
            'A problem has been detected and Windows has been shut down to prevent damage to your computer.\n\n' +
            'HIRE_ERTUGRUL_KUNDAK\n\n' +
            'If this is the first time you\'ve seen this screen, don\'t worry: it is a joke. The portfolio is running just fine.\n\n' +
            'Technical information:\n\n' +
            '*** STOP: 0x000000EK (0xCAFEBABE, 0xDEADBEEF, 0x00000001, 0x00000000)\n\n' +
            'Press any key or tap the screen to continue.'
        );
        el.classList.add('show');
        bsodArmed = false;
        setTimeout(() => { bsodArmed = true; }, 700);
        Sound.play('error');
        track('bsod');
    }

    function hideBsod() {
        const el = $('#bsod');
        if (!el || !el.classList.contains('show') || !bsodArmed) return;
        el.classList.remove('show');
        showToast(L('Sistem kurtarıldı 🙂', 'System recovered 🙂'));
        Sound.play('ding');
    }

    function initBsod() {
        const el = $('#bsod');
        if (!el) return;
        el.addEventListener('click', hideBsod);
        el.addEventListener('touchstart', hideBsod, { passive: true });
        document.addEventListener('keydown', function (e) {
            if (el.classList.contains('show')) {
                e.preventDefault();
                hideBsod();
            }
        }, true);

        const konami = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
        let pos = 0;
        document.addEventListener('keydown', function (e) {
            const tag = (e.target && e.target.tagName) || '';
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            const k = e.key.toLowerCase();
            pos = k === konami[pos] ? pos + 1 : (k === konami[0] ? 1 : 0);
            if (pos === konami.length) { pos = 0; showBsod(); }
        });

        $$('[data-action="bsod"]').forEach((item) => item.addEventListener('click', function () {
            $('#contextMenu').classList.remove('active');
            showBsod();
        }));
    }

    function initRestart() {
        const btn = $('#restartBtn');
        if (!btn) return;
        btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
        btn.addEventListener('click', function () {
            $('#startMenu').classList.remove('active');
            const screen = $('#loadingScreen');
            const text = screen && $('.loading-text', screen);
            if (text) text.textContent = L('Yeniden başlatılıyor...', 'Restarting...');
            if (screen) screen.classList.remove('hidden');
            setTimeout(() => window.location.reload(), 1300);
        });
    }

    /* ---------------- Dil ve ses düğmeleri ---------------- */
    function initToggles() {
        const soundBtn = $('#soundToggle');
        if (soundBtn) {
            soundBtn.addEventListener('click', function () {
                Sound.set(!Sound.enabled);
                showToast(Sound.enabled ? L('Ses açık', 'Sound on') : L('Ses kapalı', 'Sound off'));
            });
            Sound.refreshButton();
        }

        const langBtn = $('#langToggle');
        if (langBtn) {
            langBtn.addEventListener('click', function () {
                window.I18N.toggle();
                Sound.play('click');
                track('language_change', { lang: window.I18N.lang });
            });
        }

        const markLang = () => {
            $$('#langToggle span').forEach((s) => s.classList.toggle('on', s.dataset.lang === window.I18N.lang));
            if (langBtn) {
                langBtn.setAttribute('aria-label', L('Dil: Türkçe (İngilizceye geç)', 'Language: English (switch to Turkish)'));
            }
        };
        document.addEventListener('langchange', function () {
            markLang();
            refreshControlLabels();
            refreshTaskbarLabels();
        });
        markLang();
    }

    /* ---------------- CV indirme bağlantıları dile göre ---------------- */
    function initCvLinks() {
        const update = () => {
            const en = window.I18N && window.I18N.lang === 'en';
            $$('a[href^="ErtugrulKundak_CV"]').forEach((a) => {
                a.setAttribute('href', en ? 'ErtugrulKundak_CV_EN.pdf' : 'ErtugrulKundak_CV.pdf');
                a.setAttribute('download', en ? 'Ertugrul_Kundak_CV_EN.pdf' : 'Ertugrul_Kundak_CV.pdf');
            });
        };
        document.addEventListener('langchange', update);
        update();
    }

    /* ---------------- İletişim formu ---------------- */
    function initContactForm() {
        const form = $('#contactForm');
        if (!form) return;
        const note = $('#contactNote');
        const submit = $('button[type="submit"]', form);

        function say(text, kind) {
            note.textContent = text;
            note.className = 'form-note' + (kind ? ' ' + kind : '');
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const data = new FormData(form);
            const name = String(data.get('name') || '').trim();
            const email = String(data.get('email') || '').trim();
            const message = String(data.get('message') || '').trim();

            if (data.get('website')) return; // honeypot: botlar doldurur

            if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                say(L('Lütfen adınızı, geçerli bir e-posta adresini ve mesajınızı girin.', 'Please enter your name, a valid email address and your message.'), 'err');
                return;
            }

            track('contact_submit');

            if (FORM_ENDPOINT) {
                submit.disabled = true;
                say(L('Gönderiliyor...', 'Sending...'));
                fetch(FORM_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify({ name, email, message })
                }).then((res) => {
                    if (!res.ok) throw new Error('bad status');
                    form.reset();
                    say(L('Mesajınız iletildi, teşekkürler!', 'Your message was sent, thank you!'), 'ok');
                }).catch(() => {
                    say(L('Gönderilemedi. Lütfen doğrudan e-posta ile ulaşın: ', 'Could not send. Please email me directly: ') + CONTACT_EMAIL, 'err');
                }).then(() => { submit.disabled = false; });
                return;
            }

            const subject = L('Portfolyo mesajı: ', 'Portfolio message: ') + name;
            const body = message + '\n\n— ' + name + ' (' + email + ')';
            window.location.href = 'mailto:' + CONTACT_EMAIL +
                '?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(body);
            say(L('E-posta uygulamanız açılıyor. Açılmazsa şu adrese yazabilirsiniz: ', 'Opening your email app. If it does not open, write to: ') + CONTACT_EMAIL, 'ok');
        });
    }

    /* ---------------- Analitik kancaları (betik yoksa etkisiz) ---------------- */
    function initAnalytics() {
        document.addEventListener('click', function (e) {
            const a = e.target.closest && e.target.closest('a');
            if (!a) return;
            if (a.hasAttribute('download')) track('cv_download');
            else if (a.classList.contains('project-link')) track('project_link', { href: a.getAttribute('href') });
            else if (/github\.com|linkedin\.com/.test(a.href || '')) track('social_click', { href: a.getAttribute('href') });
        });
    }

    /* ---------------- Başlangıç ---------------- */
    hookWindows();

    document.addEventListener('DOMContentLoaded', function () {
        initWindowAccessibility();
        initBsod();
        initRestart();
        initToggles();
        initContactForm();
        initCvLinks();
        initAnalytics();
    });

    // ?open=terminal gibi bağlantılar için yeni pencere adları
    document.addEventListener('DOMContentLoaded', function () {
        const requested = new URLSearchParams(window.location.search).get('open');
        if (!requested) return;
        const id = WINDOW_TARGETS[requested.toLowerCase()];
        if (id && ['terminal-window', 'minesweeper-window', 'notes-window', 'wallpaper-window'].indexOf(id) !== -1) {
            setTimeout(() => openWindow(id), 2800);
        }
    });
})();
