'use strict';
/* ================================================
   SEACET Nexus — Animation Utilities
   ================================================ */
const AnimationUtils = (() => {
  /* Scroll Reveal with Intersection Observer */
  const initScrollReveal = () => {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');
    if (!reveals.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => observer.observe(el));
  };

  /* Typing Effect */
  const typeText = (element, text, speed = 50) => {
    let i = 0;
    element.textContent = '';
    const type = () => {
      if (i < text.length) { element.textContent += text.charAt(i); i++; setTimeout(type, speed); }
    };
    type();
  };

  /* Progress Bar Animation */
  const animateProgressBars = () => {
    const bars = document.querySelectorAll('.progress-fill[data-width]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(bar => observer.observe(bar));
  };

  /* Stagger children animation */
  const staggerAnimation = (container, delay = 100) => {
    const children = container.children;
    Array.from(children).forEach((child, i) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
      setTimeout(() => {
        child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, i * delay);
    });
  };

  /* Parallax effect for hero */
  const initParallax = () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll < window.innerHeight) {
        hero.style.transform = `translateY(${scroll * 0.3}px)`;
        hero.style.opacity = 1 - scroll / (window.innerHeight * 0.8);
      }
    }, { passive: true });
  };

  /* Confetti */
  const confetti = (count = 50) => {
    const colors = ['#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left: ${Math.random() * 100}vw;
        top: -10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        animation: confettiFall ${Math.random() * 2 + 2}s ease-in forwards;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 4000);
    }
  };

  const init = () => {
    initScrollReveal();
    animateProgressBars();
    initParallax();
  };

  return { init, typeText, staggerAnimation, confetti, animateProgressBars };
})();

/* Add confetti keyframe dynamically */
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
@keyframes confettiFall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}`;
document.head.appendChild(confettiStyle);
