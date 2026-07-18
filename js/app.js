'use strict';
/* ================================================
   SEACET Nexus — Main Application Controller
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {
  /* ---- Loading Screen (Robo Companion) ---- */
  if (typeof RoboCompanion !== 'undefined') {
    RoboCompanion.init();
  } else {
    const loader = document.getElementById('loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 1200);
  }

  /* ---- Greeting ---- */
  const greetingEl = document.getElementById('greeting');
  if (greetingEl) {
    const h = new Date().getHours();
    const greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
    greetingEl.textContent = greeting;
    const roboSpeech = document.getElementById('roboSpeech');
    if (roboSpeech) {
      const short = h < 12 ? 'Good morning!' : h < 17 ? 'Good afternoon!' : 'Good evening!';
      roboSpeech.innerHTML = `${short} I'm <strong>Nexus</strong> — your campus AI buddy! 🤖`;
    }
  }

  /* ---- Live Clock ---- */
  const clockEl = document.getElementById('liveClock');
  const dateEl = document.getElementById('todayDate');
  const updateClock = () => {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
  };
  updateClock();
  setInterval(updateClock, 1000);

  /* ---- Mobile Navigation ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  /* ---- Sticky Nav Shadow ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ---- Back to Top ---- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Search Modal ---- */
  const searchModal = document.getElementById('searchModal');
  const searchToggle = document.getElementById('searchToggle');
  const searchInput = document.getElementById('globalSearch');

  const openSearch = () => {
    if (searchModal) { searchModal.classList.add('active'); if (searchInput) searchInput.focus(); }
  };
  const closeSearch = () => {
    if (searchModal) { searchModal.classList.remove('active'); if (searchInput) searchInput.value = ''; }
  };

  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchModal) {
    searchModal.addEventListener('click', (e) => { if (e.target === searchModal) closeSearch(); });
  }

  /* Ctrl+K shortcut */
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape') { closeSearch(); closeNotifPanel(); closeAllModals(); }
  });

  /* ---- Notification Panel ---- */
  const notifPanel = document.getElementById('notifPanel');
  const notifToggle = document.getElementById('notifToggle');

  const closeNotifPanel = () => { if (notifPanel) notifPanel.classList.remove('active'); };

  if (notifToggle && notifPanel) {
    notifToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      notifPanel.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!notifPanel.contains(e.target) && !notifToggle.contains(e.target)) closeNotifPanel();
    });
  }

  /* Clear notifications */
  const clearNotifs = document.getElementById('clearNotifs');
  if (clearNotifs) {
    clearNotifs.addEventListener('click', () => {
      const list = document.getElementById('notifList');
      if (list) list.innerHTML = '<div class="empty-state" style="padding:32px"><p>No notifications</p></div>';
      if (typeof NotificationManager !== 'undefined') NotificationManager.clearAll();
    });
  }

  /* Dismiss individual notifications */
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('notif-dismiss')) {
      const item = e.target.closest('.notif-item');
      if (item) { item.style.opacity = '0'; item.style.transform = 'translateX(20px)'; setTimeout(() => item.remove(), 300); }
    }
  });

  /* ---- Theme Toggle ---- */
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      if (typeof ThemeManager !== 'undefined') ThemeManager.toggleTheme();
    });
  }

  /* ---- Close Modals ---- */
  const closeAllModals = () => {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  };

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeAllModals();
    if (e.target.classList.contains('modal-close')) closeAllModals();
  });

  /* ---- Accordion ---- */
  document.addEventListener('click', (e) => {
    const header = e.target.closest('.accordion-header');
    if (header) {
      const item = header.closest('.accordion-item');
      if (item) item.classList.toggle('active');
    }
  });

  /* ---- Filter Buttons ---- */
  document.querySelectorAll('.filter-row').forEach(row => {
    row.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      row.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ---- Favorite Buttons ---- */
  document.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.fav-btn');
    if (!favBtn) return;
    const type = favBtn.dataset.favType;
    const id = favBtn.dataset.favId;
    if (type && id && typeof StorageManager !== 'undefined') {
      const isFav = StorageManager.toggleFavorite(type, id);
      favBtn.classList.toggle('active', isFav);
      const svg = favBtn.querySelector('svg');
      if (svg) svg.setAttribute('fill', isFav ? 'var(--error)' : 'none');
      if (typeof NotificationManager !== 'undefined') {
        NotificationManager.showToast(isFav ? 'Added to favorites ❤️' : 'Removed from favorites', isFav ? 'success' : 'info');
      }
    }
  });

  /* ---- Join Club Buttons ---- */
  document.addEventListener('click', (e) => {
    const joinBtn = e.target.closest('.join-btn');
    if (!joinBtn) return;
    const clubId = joinBtn.dataset.clubId;
    if (!clubId || typeof StorageManager === 'undefined') return;
    const joined = StorageManager.get('joined_clubs') || [];
    const idx = joined.indexOf(clubId);
    if (idx >= 0) {
      joined.splice(idx, 1);
      joinBtn.textContent = 'Join Club';
      joinBtn.classList.remove('joined');
      NotificationManager.showToast('Left the club', 'info');
    } else {
      joined.push(clubId);
      joinBtn.textContent = 'Joined ✓';
      joinBtn.classList.add('joined');
      NotificationManager.showToast('Joined the club! 🎉', 'success');
    }
    StorageManager.set('joined_clubs', joined);
  });

  /* ---- Initialize Modules ---- */
  if (typeof DemoData !== 'undefined') DemoData.init();
  if (typeof SearchEngine !== 'undefined') SearchEngine.init();
  if (typeof NotificationManager !== 'undefined') NotificationManager.init();
  if (typeof WeatherWidget !== 'undefined') WeatherWidget.init();
  if (typeof QuotesManager !== 'undefined') QuotesManager.init();
  if (typeof CounterAnimation !== 'undefined') CounterAnimation.init();
  if (typeof Slider !== 'undefined') Slider.init();
  if (typeof AnimationUtils !== 'undefined') AnimationUtils.init();
  if (typeof SpatialUI !== 'undefined') SpatialUI.init();
  if (typeof Planner !== 'undefined') Planner.init();

  /* ---- Hero countdown widget ---- */
  const heroCountdown = document.getElementById('heroCountdown');
  if (heroCountdown) {
    const target = new Date('2026-07-20T09:00:00');
    const tick = () => {
      const diff = target - new Date();
      if (diff <= 0) { heroCountdown.textContent = 'Happening now!'; return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      heroCountdown.textContent = `${d}d ${h}h ${m}m until drive`;
    };
    tick();
    setInterval(tick, 60000);
  }

  /* ---- Active Nav Link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    const linkPage = href.split('/').pop();
    link.classList.toggle('active', linkPage === currentPage);
  });

  /* ---- Initialize Favorites State ---- */
  if (typeof StorageManager !== 'undefined') {
    document.querySelectorAll('.fav-btn[data-fav-type][data-fav-id]').forEach(btn => {
      const isFav = StorageManager.isFavorite(btn.dataset.favType, btn.dataset.favId);
      if (isFav) {
        btn.classList.add('active');
        const svg = btn.querySelector('svg');
        if (svg) svg.setAttribute('fill', 'var(--error)');
      }
    });

    /* Initialize join button states */
    const joinedClubs = StorageManager.get('joined_clubs') || [];
    document.querySelectorAll('.join-btn[data-club-id]').forEach(btn => {
      if (joinedClubs.includes(btn.dataset.clubId)) {
        btn.textContent = 'Joined ✓';
        btn.classList.add('joined');
      }
    });
  }

  /* ---- Smooth Scroll for Anchor Links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.dataset.modal) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  console.log('%c🎓 SEACET Nexus — Smart Student Portal', 'font-size:20px;font-weight:bold;color:#1a73e8;');
  console.log('%cBuilt with ❤️ using HTML, CSS & JavaScript', 'color:#5f6368;');
});
