/* ============================================================
   RESINN CRAFTSS — Main JavaScript
   ============================================================ */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
});

// ── Active nav link on scroll ──
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

// ── Hamburger menu ──
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  document.body.classList.toggle('nav-open');
});
// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
  });
});

// ── Smooth reveal animation on scroll ──
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Observe product cards, feature cards, testimonials, steps
document.querySelectorAll(
  '.product-card, .feature-card, .testimonial-card, .contact-card, .step, .portfolio-item'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`;
  observer.observe(el);
});

// Visible class triggers animation
document.querySelectorAll(
  '.product-card, .feature-card, .testimonial-card, .contact-card, .step, .portfolio-item'
).forEach(el => {
  el.addEventListener('transitionend', () => {});
});

// Apply visible styles
const visibilityObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        visibilityObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);

document.querySelectorAll(
  '.product-card, .feature-card, .testimonial-card, .contact-card, .step, .portfolio-item'
).forEach(el => {
  visibilityObserver.observe(el);
});

// ── Custom Order Form ──
function handleCustomOrder(e) {
  e.preventDefault();
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const product = document.getElementById('custProduct').value;
  const desc = document.getElementById('custDesc').value.trim();

  if (!name || !phone) {
    showToast('Please fill in your name and WhatsApp number.', 'error');
    return;
  }

  const message = encodeURIComponent(
    `Hi Resinn Craftss! 🌸\n\nI'd like to place a custom order:\n\n👤 Name: ${name}\n📦 Product: ${product || 'Not specified'}\n📝 Details: ${desc || 'None provided'}\n\nPlease let me know the next steps!`
  );

  // Open WhatsApp with pre-filled message
  window.open(`https://wa.me/your-number?text=${message}`, '_blank');

  showToast('Opening WhatsApp... we\'ll be in touch soon! 🌸', 'success');
  e.target.reset();
}

// ── Toast notification ──
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : '!'}</span>
    <p>${message}</p>
  `;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 2rem;
    background: ${type === 'success' ? '#1ebe5d' : '#e05a6a'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 14px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: 'Jost', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    z-index: 2000;
    max-width: 320px;
    animation: slideInRight 0.35s cubic-bezier(0.4,0,0.2,1);
  `;

  // Add keyframe animation
  if (!document.getElementById('toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ── Parallax on hero image ──
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
  if (heroImg && window.scrollY < window.innerHeight) {
    heroImg.style.transform = `translateY(${window.scrollY * 0.08}px) scale(1)`;
  }
});

// ── Portfolio lightbox ──
document.querySelectorAll('.portfolio-item').forEach(item => {
  item.addEventListener('click', () => {
    const bg = item.style.backgroundImage;
    const url = bg.replace(/url\(["']?/, '').replace(/["']?\)/, '');

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.85);
      display: flex; align-items: center; justify-content: center;
      z-index: 3000; cursor: zoom-out; backdrop-filter: blur(6px);
      animation: fadeIn 0.3s ease;
    `;
    const img = document.createElement('img');
    img.src = url;
    img.style.cssText = `
      max-width: 90%; max-height: 90vh; border-radius: 18px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.5);
      animation: scaleIn 0.3s cubic-bezier(0.4,0,0.2,1);
    `;

    if (!document.getElementById('lightboxStyles')) {
      const style = document.createElement('style');
      style.id = 'lightboxStyles';
      style.textContent = `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `;
      document.head.appendChild(style);
    }

    overlay.appendChild(img);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    overlay.addEventListener('click', () => {
      overlay.remove();
      document.body.style.overflow = '';
    });
  });
});

// ── Animate hero section elements in on load ──
window.addEventListener('load', () => {
  const heroTag = document.querySelector('.hero-tag');
  const heroTitle = document.querySelector('.hero-title');
  const heroSub = document.querySelector('.hero-subtitle');
  const heroCta = document.querySelector('.hero-cta');
  const heroImageWrap = document.querySelector('.hero-image-wrap');

  [heroTag, heroTitle, heroSub, heroCta, heroImageWrap].forEach((el, i) => {
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(25px)';
      el.style.transition = `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`;
      requestAnimationFrame(() => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 100);
      });
    }
  });
});
