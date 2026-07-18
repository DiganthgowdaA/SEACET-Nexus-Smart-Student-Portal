'use strict';
/* ================================================
   SEACET Nexus — Spatial UI Interactions
   ================================================ */
const SpatialUI = (() => {
  const CANTEEN_MENU = [
    { name: 'Masala Dosa', price: '₹45', tag: 'Breakfast', emoji: '🥞' },
    { name: 'Veg Meals', price: '₹60', tag: 'Lunch', emoji: '🍛' },
    { name: 'Chicken Biryani', price: '₹90', tag: 'Special', emoji: '🍗' },
    { name: 'Veg Fried Rice', price: '₹55', tag: 'Quick', emoji: '🍚' },
    { name: 'Samosa (2 pcs)', price: '₹20', tag: 'Snack', emoji: '🥟' },
    { name: 'Fresh Juice', price: '₹35', tag: 'Drinks', emoji: '🧃' },
    { name: 'Tea / Coffee', price: '₹15', tag: 'Drinks', emoji: '☕' },
    { name: 'Paneer Roll', price: '₹50', tag: 'Quick', emoji: '🌯' },
  ];

  const SCHOLARSHIPS = [
    { name: 'Post Matric Scholarship', provider: 'Govt. of Karnataka', amount: 'Full tuition', eligibility: 'SC/ST students with family income < ₹2.5L', deadline: 'Aug 30, 2026' },
    { name: 'SEACET Merit Scholarship', provider: 'SEA Group', amount: '₹25,000/yr', eligibility: 'CGPA ≥ 8.5, no backlogs', deadline: 'Sep 15, 2026' },
    { name: 'AICTE Pragati', provider: 'AICTE', amount: '₹50,000/yr', eligibility: 'Girl students in 1st year engineering', deadline: 'Oct 1, 2026' },
    { name: 'VTU Research Fellowship', provider: 'VTU Belagavi', amount: '₹5,000/mo', eligibility: 'M.Tech research scholars', deadline: 'Jul 31, 2026' },
  ];

  const initCursorGlow = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let glow = document.querySelector('.cursor-glow');
    if (!glow) {
      glow = document.createElement('div');
      glow.className = 'cursor-glow';
      glow.setAttribute('aria-hidden', 'true');
      document.body.appendChild(glow);
    }
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
  };

  const initTiltCards = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.spatial-card, .feature-card, .quick-card, .placement-card, .note-card, .club-card').forEach(card => {
      if (!card.querySelector('.card-shine')) {
        const shine = document.createElement('div');
        shine.className = 'card-shine';
        card.appendChild(shine);
      }
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -6;
        const rotateY = ((x - cx) / cx) * 6;
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  };

  const initRipple = () => {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn, .quick-card, .filter-btn');
      if (!btn || window.matchMedia('(pointer: coarse)').matches) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;`;
      btn.classList.add('ripple');
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  };

  const initQuickCardColors = () => {
    document.querySelectorAll('.quick-card[data-color]').forEach(card => {
      card.style.setProperty('--accent-color', card.dataset.color);
    });
  };

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  };

  const closeModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  };

  const renderCanteenModal = () => {
    const body = document.getElementById('canteenBody');
    if (!body) return;
    body.innerHTML = `
      <p style="color:var(--text-secondary);margin-bottom:var(--space-4);font-size:var(--font-size-sm)">🕐 Open 8:00 AM – 6:00 PM • Main Block Ground Floor</p>
      <div class="demo-panel-grid">
        ${CANTEEN_MENU.map(item => `
          <div class="demo-menu-item glass-soft pop-in">
            <div style="font-size:1.75rem;margin-bottom:var(--space-2)">${item.emoji}</div>
            <strong style="font-size:var(--font-size-sm)">${item.name}</strong>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:var(--space-2)">
              <span class="price">${item.price}</span>
              <span class="badge badge-info">${item.tag}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  };

  const renderScholarshipsModal = () => {
    const body = document.getElementById('scholarshipsBody');
    if (!body) return;
    body.innerHTML = `
      <p style="color:var(--text-secondary);margin-bottom:var(--space-4);font-size:var(--font-size-sm)">Apply through the college scholarship cell. Demo applications are saved locally.</p>
      <div style="display:flex;flex-direction:column;gap:var(--space-4)">
        ${SCHOLARSHIPS.map((s, i) => `
          <div class="demo-scholarship-item glass-soft pop-in" style="animation-delay:${i * 0.08}s">
            <div class="flex-between" style="margin-bottom:var(--space-2)">
              <strong>${s.name}</strong>
              <span class="badge badge-success">${s.amount}</span>
            </div>
            <p style="font-size:var(--font-size-xs);color:var(--text-tertiary);margin-bottom:var(--space-1)">${s.provider}</p>
            <p style="font-size:var(--font-size-sm);color:var(--text-secondary);line-height:1.5">${s.eligibility}</p>
            <p style="font-size:var(--font-size-xs);color:var(--text-tertiary);margin-top:var(--space-2)">Deadline: ${s.deadline}</p>
            <button class="btn btn-sm btn-primary apply-btn demo-apply-btn" data-scholarship="${s.name}">Apply Now</button>
          </div>
        `).join('')}
      </div>
    `;
    body.querySelectorAll('.demo-apply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const applied = StorageManager.get('scholarship_applications') || [];
        const name = btn.dataset.scholarship;
        if (!applied.includes(name)) {
          applied.push(name);
          StorageManager.set('scholarship_applications', applied);
          btn.textContent = 'Applied ✓';
          btn.disabled = true;
          btn.classList.add('btn-success');
          if (typeof AnimationUtils !== 'undefined') AnimationUtils.confetti(30);
          NotificationManager.showToast(`Applied for ${name}! 🎉`, 'success');
        }
      });
    });
    const applied = StorageManager.get('scholarship_applications') || [];
    body.querySelectorAll('.demo-apply-btn').forEach(btn => {
      if (applied.includes(btn.dataset.scholarship)) {
        btn.textContent = 'Applied ✓';
        btn.disabled = true;
        btn.classList.add('btn-success');
      }
    });
  };

  const initHomeModals = () => {
    document.querySelectorAll('[data-modal="canteen"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        renderCanteenModal();
        openModal('canteenModal');
      });
    });
    document.querySelectorAll('[data-modal="scholarships"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        renderScholarshipsModal();
        openModal('scholarshipsModal');
      });
    });
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
    });
  };

  const initPageEnhancements = () => {
    document.querySelectorAll('.navbar.glass:not(.spatial-nav)').forEach(nav => nav.classList.add('spatial-nav'));
    document.querySelectorAll('.footer:not(.spatial-footer)').forEach(f => f.classList.add('spatial-footer'));
    document.querySelectorAll('.page-hero:not(.page-hero-spatial)').forEach(h => h.classList.add('page-hero-spatial'));

    const cardSelectors = '.placement-card, .note-card, .club-card, .faculty-card, .event-card, .internship-card, .task-item, .stat-card, .roadmap-card, .accordion-item, .profile-header, .profile-section, .settings-card, .mini-calendar, .sidebar-card';
    document.querySelectorAll(cardSelectors).forEach(el => {
      el.classList.add('spatial-card');
      if (!el.classList.contains('glass') && !el.classList.contains('glass-soft') && !el.classList.contains('glass-strong')) {
        el.classList.add('glass-soft');
      }
    });

    document.querySelectorAll('.modal:not(.glass-strong)').forEach(m => m.classList.add('glass-strong'));
  };

  const initNoticeInteractions = () => {
    document.querySelectorAll('.notice-item').forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        item.classList.add('pop-in');
        const title = item.querySelector('h4')?.textContent || 'Notice';
        if (typeof NotificationManager !== 'undefined') {
          NotificationManager.showToast(`📢 ${title}`, 'info');
        }
      });
    });
  };

  const initSpatialCanvas = () => {
    if (document.querySelector('.spatial-canvas')) return;
    const canvas = document.createElement('div');
    canvas.className = 'spatial-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const grid = document.createElement('div');
    grid.className = 'spatial-grid';
    grid.setAttribute('aria-hidden', 'true');
    document.body.prepend(grid);
    document.body.prepend(canvas);
  };

  const init = () => {
    initSpatialCanvas();
    initPageEnhancements();
    initCursorGlow();
    initTiltCards();
    initRipple();
    initQuickCardColors();
    initHomeModals();
    initNoticeInteractions();
    document.body.classList.add('spatial-ready');
  };

  return { init, openModal, closeModal, renderCanteenModal, renderScholarshipsModal };
})();
