'use strict';
/* ================================================
   SEACET Nexus — Content Slider
   ================================================ */
const Slider = (() => {
  const instances = [];

  class SliderInstance {
    constructor(container, options = {}) {
      this.container = container;
      this.slides = container.querySelectorAll('.slide');
      this.currentIndex = 0;
      this.autoPlay = options.autoPlay !== false;
      this.interval = options.interval || 5000;
      this.timer = null;
      if (this.slides.length > 0) this.init();
    }

    init() {
      this.slides.forEach((s, i) => { s.style.display = i === 0 ? 'block' : 'none'; s.style.opacity = i === 0 ? '1' : '0'; });
      const nav = this.container.querySelector('.slider-nav');
      if (nav) {
        nav.querySelector('.prev')?.addEventListener('click', () => this.prev());
        nav.querySelector('.next')?.addEventListener('click', () => this.next());
      }
      /* Dots */
      const dotsContainer = this.container.querySelector('.slider-dots');
      if (dotsContainer) {
        this.slides.forEach((_, i) => {
          const dot = document.createElement('span');
          dot.className = `slider-dot${i === 0 ? ' active' : ''}`;
          dot.addEventListener('click', () => this.goTo(i));
          dotsContainer.appendChild(dot);
        });
      }
      if (this.autoPlay) this.startAutoPlay();
      this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
      this.container.addEventListener('mouseleave', () => { if (this.autoPlay) this.startAutoPlay(); });
      /* Touch */
      let startX = 0;
      this.container.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
      this.container.addEventListener('touchend', (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { diff > 0 ? this.next() : this.prev(); }
      });
    }

    goTo(index) {
      if (index === this.currentIndex) return;
      const current = this.slides[this.currentIndex];
      const next = this.slides[index];
      current.style.opacity = '0';
      setTimeout(() => { current.style.display = 'none'; next.style.display = 'block'; setTimeout(() => { next.style.opacity = '1'; }, 20); }, 300);
      this.currentIndex = index;
      this.updateDots();
    }

    next() { this.goTo((this.currentIndex + 1) % this.slides.length); }
    prev() { this.goTo((this.currentIndex - 1 + this.slides.length) % this.slides.length); }
    startAutoPlay() { this.stopAutoPlay(); this.timer = setInterval(() => this.next(), this.interval); }
    stopAutoPlay() { if (this.timer) { clearInterval(this.timer); this.timer = null; } }

    updateDots() {
      const dots = this.container.querySelectorAll('.slider-dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === this.currentIndex));
    }
  }

  const init = () => {
    document.querySelectorAll('.slider-container').forEach(el => {
      instances.push(new SliderInstance(el));
    });
  };

  return { init, SliderInstance };
})();
