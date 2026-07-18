'use strict';
/* ================================================
   SEACET Nexus — Robo Companion Loader & Hero
   ================================================ */
const RoboCompanion = (() => {
  const LOADER_ID = 'loader';
  const DEFAULT_MSG = 'Loading SEACET Nexus...';
  const DEFAULT_SUB = 'Your robo companion is getting ready';
  const MIN_SHOW_MS = 900;

  let showStart = 0;
  let hideTimer = null;

  const getBasePath = () => {
    const path = window.location.pathname;
    return path.includes('/pages/') ? '../' : '';
  };

  const getImagePath = () => `${getBasePath()}assets/images/robo-companion-transparent.png`;

  const svg = ({ size = 120, waving = true, loading = true } = {}) => {
    const cls = `robo-companion${loading ? ' robo-loading' : ''}`;
    const waveCls = waving ? ' class="robo-arm-wave"' : '';
    return `
<svg class="${cls}" width="${size}" height="${size * 1.33}" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="roboBodyGrad" x1="0" y1="0" x2="120" y2="160">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e8f0fe"/>
    </linearGradient>
    <linearGradient id="roboBlueGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8ab4f8"/>
      <stop offset="100%" stop-color="#1a73e8"/>
    </linearGradient>
    <radialGradient id="roboCoreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8ab4f8"/>
      <stop offset="100%" stop-color="#1a73e8" stop-opacity="0"/>
    </radialGradient>
    <filter id="roboGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Shadow -->
  <ellipse cx="60" cy="152" rx="28" ry="5" fill="rgba(26,115,232,0.12)"/>
  <!-- Body base -->
  <path d="M38 118 Q60 128 82 118 L78 145 Q60 152 42 145 Z" fill="url(#roboBodyGrad)" stroke="#dadce0" stroke-width="1"/>
  <!-- Torso -->
  <rect x="42" y="96" width="36" height="28" rx="10" fill="#fff" stroke="#e8eaed" stroke-width="1"/>
  <path d="M42 100 Q60 92 78 100 L78 118 Q60 126 42 118 Z" fill="url(#roboBlueGrad)" opacity="0.9"/>
  <!-- Core glow -->
  <circle cx="60" cy="110" r="14" fill="url(#roboCoreGlow)" opacity="0.5"/>
  <circle class="robo-core" cx="60" cy="110" r="6" fill="#8ab4f8" filter="url(#roboGlow)"/>
  <circle class="robo-core" cx="60" cy="110" r="3" fill="#fff" opacity="0.8"/>
  <!-- Left arm -->
  <g transform="translate(0,0)">
    <rect x="28" y="100" width="14" height="22" rx="7" fill="#fff" stroke="#e8eaed"/>
    <circle cx="35" cy="124" r="7" fill="#fff" stroke="#e8eaed"/>
  </g>
  <!-- Right arm (wave) -->
  <g${waveCls}>
    <rect x="78" y="88" width="14" height="22" rx="7" fill="#fff" stroke="#e8eaed"/>
    <circle cx="85" cy="82" r="7" fill="#fff" stroke="#e8eaed"/>
  </g>
  <!-- Head -->
  <rect x="30" y="24" width="60" height="58" rx="18" fill="#fff" stroke="#e8eaed" stroke-width="1.5"/>
  <!-- Ears -->
  <rect x="18" y="48" width="12" height="20" rx="6" fill="url(#roboBlueGrad)"/>
  <rect x="90" y="48" width="12" height="20" rx="6" fill="url(#roboBlueGrad)"/>
  <!-- Face screen -->
  <rect x="38" y="34" width="44" height="36" rx="10" fill="#0d1117"/>
  <!-- Corner brackets -->
  <path d="M42 40 H46 V44" stroke="#5f6368" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M78 40 H74 V44" stroke="#5f6368" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M42 64 H46 V60" stroke="#5f6368" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M78 64 H74 V60" stroke="#5f6368" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <!-- Scan line -->
  <rect class="robo-scan-line" x="40" y="38" width="40" height="2" rx="1" fill="rgba(138,180,248,0.4)"/>
  <!-- Eyes -->
  <ellipse class="robo-eye" cx="50" cy="52" rx="5" ry="7" fill="#8ab4f8" filter="url(#roboGlow)"/>
  <ellipse class="robo-eye" cx="70" cy="52" rx="5" ry="7" fill="#8ab4f8" filter="url(#roboGlow)"/>
  <ellipse cx="51" cy="50" rx="1.5" ry="2" fill="#fff" opacity="0.7"/>
  <ellipse cx="71" cy="50" rx="1.5" ry="2" fill="#fff" opacity="0.7"/>
</svg>`;
  };

  const loaderHTML = (msg = DEFAULT_MSG, sub = DEFAULT_SUB) => `
    <div class="loader-content">
      <div class="loader-robo-wrap">
        <div class="robo-pulse-ring"></div>
        <div class="robo-pulse-ring"></div>
        ${svg({ size: 120, waving: true, loading: true })}
      </div>
      <div class="robo-dot-loader" aria-hidden="true"><span></span><span></span><span></span></div>
      <p class="loader-text" id="loaderText">${msg}</p>
      <p class="loader-text-sub" id="loaderSubText">${sub}</p>
    </div>`;

  const heroHTML = () => {
    const img = getImagePath();
    const greeting = (() => {
      const h = new Date().getHours();
      return h < 12 ? 'Good morning!' : h < 17 ? 'Good afternoon!' : 'Good evening!';
    })();
    return `
    <div class="hero-robo-companion reveal">
      <div class="hero-robo-stage">
        <div class="hero-robo-speech glass-strong" id="roboSpeech">
          ${greeting} I'm <strong>Nexus</strong> — your campus AI buddy! 🤖
        </div>
        <div class="hero-robo-figure">
          <div class="hero-robo-glow" aria-hidden="true"></div>
          <img src="${img}" alt="Nexus Robo Companion" class="hero-robo-img" width="280" height="280" loading="eager">
        </div>
      </div>
      <div class="hero-robo-widgets">
        <div class="hero-float-card glass spatial-card spatial-float">
          <div class="float-icon">📅</div>
          <strong>Next Up</strong>
          <span id="heroNextEvent">Infosys Drive — Jul 20</span>
          <span style="font-size:var(--font-size-xs);color:var(--primary);font-weight:600;margin-top:var(--space-1)" id="heroCountdown">Loading...</span>
        </div>
        <div class="hero-float-card glass spatial-card spatial-float spatial-float-delay-1">
          <div class="float-icon">🌤️</div>
          <strong>Weather</strong>
          <span id="heroWeather">Bangalore — Loading...</span>
        </div>
        <div class="hero-float-card glass-soft spatial-card spatial-float-delay-2" style="grid-column:span 2">
          <div class="float-icon">💡</div>
          <strong>Daily Quote</strong>
          <span id="heroQuote" style="font-style:italic;line-height:1.4">Loading...</span>
        </div>
      </div>
    </div>`;
  };

  const inlineHTML = (msg = 'Loading...') => `
    <div class="robo-inline-loader">
      ${svg({ size: 80, waving: false, loading: true })}
      <p class="loader-text">${msg}</p>
      <div class="robo-dot-loader"><span></span><span></span><span></span></div>
    </div>`;

  const ensureLoader = () => {
    let loader = document.getElementById(LOADER_ID);
    if (!loader) {
      loader = document.createElement('div');
      loader.id = LOADER_ID;
      loader.className = 'loader-overlay';
      loader.setAttribute('role', 'status');
      loader.setAttribute('aria-live', 'polite');
      document.body.prepend(loader);
    }
    return loader;
  };

  const upgradeLoader = () => {
    const loader = document.getElementById(LOADER_ID);
    if (!loader || loader.dataset.roboReady) return loader;
    loader.innerHTML = loaderHTML();
    loader.dataset.roboReady = 'true';
    return loader;
  };

  const show = (msg = DEFAULT_MSG, sub = DEFAULT_SUB) => {
    clearTimeout(hideTimer);
    const loader = ensureLoader();
    loader.innerHTML = loaderHTML(msg, sub);
    loader.dataset.roboReady = 'true';
    loader.classList.remove('hidden');
    showStart = Date.now();
    return loader;
  };

  const hide = (delay = 0) => {
    const loader = document.getElementById(LOADER_ID);
    if (!loader) return;
    const elapsed = Date.now() - showStart;
    const wait = Math.max(delay, Math.max(0, MIN_SHOW_MS - elapsed));
    hideTimer = setTimeout(() => {
      loader.classList.add('hidden');
    }, wait);
  };

  const setMessage = (msg, sub) => {
    const text = document.getElementById('loaderText');
    const subText = document.getElementById('loaderSubText');
    if (text) text.textContent = msg;
    if (sub && subText) subText.textContent = sub;
  };

  const injectHero = (containerId = 'heroRoboSlot') => {
    const slot = document.getElementById(containerId);
    if (slot) slot.innerHTML = heroHTML();
  };

  const initPageTransition = () => {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel:') || link.target === '_blank') return;
      if (link.dataset.noLoader) return;
      link.addEventListener('click', (e) => {
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        show('Heading to next page...', 'Nexus is navigating for you');
      });
    });
  };

  const init = () => {
    upgradeLoader();
    injectHero();
    initPageTransition();
    showStart = Date.now();
    hide(400);
  };

  return {
    init, show, hide, setMessage, svg, heroHTML, inlineHTML,
    upgradeLoader, injectHero, getImagePath, getBasePath
  };
})();
