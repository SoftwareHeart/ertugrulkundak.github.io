#!/usr/bin/env node
/*
 * CV PDF üretici.
 *
 * Sitedeki CV bölümünü (index.html > #cv-window) cv-print.css ile A4 olarak
 * yazdırır; böylece CV'nin tek kaynağı index.html olur. PDF'i elle güncellemek
 * gerekmez:
 *
 *   node scripts/build-cv.mjs            # TR + EN
 *   node scripts/build-cv.mjs --lang tr  # yalnızca Türkçe
 *   node scripts/build-cv.mjs --lang en  # yalnızca İngilizce
 *
 * Gereken: Node 18+ ve Chrome / Chromium / Edge. Yol otomatik bulunur;
 * bulunamazsa CHROME_PATH ortam değişkenini ayarlayın.
 *
 * Çıktılar:  ErtugrulKundak_CV.pdf  (TR)   ErtugrulKundak_CV_EN.pdf  (EN)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const TARGETS = {
    tr: { out: 'ErtugrulKundak_CV.pdf', lang: 'tr' },
    en: { out: 'ErtugrulKundak_CV_EN.pdf', lang: 'en' }
};

function findBrowser() {
    const candidates = [
        process.env.CHROME_PATH,
        'C:/Program Files/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
        'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
    ].filter(Boolean);
    const found = candidates.find((p) => existsSync(p));
    if (!found) {
        throw new Error('Chrome/Chromium/Edge bulunamadı. CHROME_PATH ortam değişkenini tarayıcının yoluna ayarlayın.');
    }
    return found;
}

function extractCv(html) {
    const startTag = '<div class="window-content cv-content">';
    const start = html.indexOf(startTag);
    const end = html.indexOf('<div class="cv-download-section">');
    if (start === -1 || end === -1 || end < start) {
        throw new Error('index.html içinde CV bölümü bulunamadı (cv-content / cv-download-section).');
    }
    return html.slice(start + startTag.length, end);
}

function buildPage(cvHtml, lang) {
    const titleTr = 'Ertuğrul Kundak - Özgeçmiş';
    const titleEn = 'Ertuğrul Kundak - Resume';
    // İngilizce çıktı, sitedeki dil değiştiricinin aynı sözlüğünü kullanır (i18n.js).
    const switchLang = lang === 'en'
        ? `<script src="i18n.js"></script><script>document.addEventListener('DOMContentLoaded', function () { I18N.set('en'); document.title = ${JSON.stringify(titleEn)}; });</script>`
        : '';
    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${lang === 'en' ? titleEn : titleTr}</title>
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="cv-print.css">
</head>
<body class="cv-print">
<div class="window-content cv-content">${cvHtml}</div>
${switchLang}
</body>
</html>`;
}

function printToPdf(browser, pageFile, outFile) {
    const profile = mkdtempSync(join(tmpdir(), 'cv-build-'));
    const args = [
        '--headless=new',
        '--disable-gpu',
        '--no-pdf-header-footer',
        '--virtual-time-budget=4000',
        `--user-data-dir=${profile}`,
        `--print-to-pdf=${outFile}`,
        pathToFileURL(pageFile).href
    ];
    // CI (Linux, root olmayan kullanıcı) ve bazı kurulumlarda gerekir
    if (process.env.CI || process.env.CHROME_NO_SANDBOX) args.unshift('--no-sandbox');
    try {
        execFileSync(browser, args, { stdio: ['ignore', 'ignore', 'pipe'], timeout: 90_000 });
    } finally {
        rmSync(profile, { recursive: true, force: true });
    }
}

function main() {
    const argIdx = process.argv.indexOf('--lang');
    const wanted = argIdx !== -1 ? process.argv[argIdx + 1] : 'all';
    const langs = wanted === 'all' ? Object.keys(TARGETS) : [wanted];
    for (const l of langs) {
        if (!TARGETS[l]) throw new Error(`Bilinmeyen dil: ${l} (tr | en | all)`);
    }

    const browser = findBrowser();
    const cvHtml = extractCv(readFileSync(join(root, 'index.html'), 'utf8'));

    for (const l of langs) {
        const { out, lang } = TARGETS[l];
        const pageFile = join(root, `.cv-build-${lang}.html`);
        const outFile = join(root, out);
        writeFileSync(pageFile, buildPage(cvHtml, lang), 'utf8');
        try {
            printToPdf(browser, pageFile, outFile);
        } finally {
            rmSync(pageFile, { force: true });
        }
        if (!existsSync(outFile) || statSync(outFile).size < 5_000) {
            throw new Error(`${out} üretilemedi veya boş.`);
        }
        console.log(`✔ ${out}  (${Math.round(statSync(outFile).size / 1024)} KB)`);
    }
}

try {
    main();
} catch (err) {
    console.error('✖ ' + err.message);
    process.exit(1);
}
