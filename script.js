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
  window.open(`https://wa.me/919831220021?text=${message}`, '_blank');

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
  // ── Firebase Configuration ──
const firebaseConfig = {
  apiKey: "AIzaSyAMG5t4q0XW48ErMuRxZAbEqQewETzryVw",
  authDomain: "resincraftss-b7a2e.firebaseapp.com",
  projectId: "resincraftss-b7a2e",
  storageBucket: "resincraftss-b7a2e.firebasestorage.app",
  messagingSenderId: "128573889928",
  appId: "1:128573889928:web:ba0545f981f562c7c16e3d"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const DEFAULT_PRODUCTS = [];

async function renderMainProducts() {
  const grid = document.getElementById('mainProductsGrid');
  if (!grid) return;

  grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--accent);">Bringing the collection to life...</p>';

  try {
    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
    let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // If no products in DB yet, show defaults
    if (products.length === 0) {
      products = DEFAULT_PRODUCTS;
    }

    grid.innerHTML = '';

    products.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.id = `product-${p.id}`;
      
      const tagHtml = p.tag ? `<span class="product-tag ${p.tag.toLowerCase()}">${p.tag}</span>` : '';
      const stockTagHtml = p.isOutOfStock ? `<span class="product-tag out-of-stock">Out of Stock</span>` : '';
      const whatsappLink = `https://wa.me/919831220021?text=${encodeURIComponent(`Hi! I'd like to order: ${p.name} 🌸`)}`;

      card.innerHTML = `
        <div class="product-img-wrap">
          <img src="${p.image}" alt="${p.name}" class="product-img" onerror="this.src='hero.png'" />
          <div class="product-overlay">
            ${p.isOutOfStock ? '<span class="btn-order disabled">Out of Stock</span>' : `<a href="${whatsappLink}" target="_blank" class="btn-order">Order Now</a>`}
          </div>
          ${tagHtml}
          ${stockTagHtml}
        </div>
        <div class="product-info">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-footer">
            <span class="product-price">Starting ₹${p.price}</span>
            ${p.isOutOfStock ? '<span class="btn-sm disabled">Out of Stock</span>' : `<a href="${whatsappLink}" target="_blank" class="btn-sm">Order →</a>`}
          </div>
        </div>
      `;
      grid.appendChild(card);

      // Animation trigger
      card.style.opacity = '0';
      card.style.transform = 'translateY(28px)';
      card.style.transition = `opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`;
      
      if (typeof visibilityObserver !== 'undefined') {
        visibilityObserver.observe(card);
      }
    });
  } catch (error) {
    console.error("Error loading products from Firebase:", error);
    // Fallback to defaults on error
    grid.innerHTML = '';
    DEFAULT_PRODUCTS.forEach(p => {/* rendering logic for defaults */});
  }
}

window.addEventListener('DOMContentLoaded', renderMainProducts);
// ── Policy Modals ──
const POLICIES = {
  shipping: {
    title: 'Shipping Policy',
    text: 'We aim to process and ship all orders as quickly as possible. Orders are usually dispatched within 5-7 business days. Delivery time may vary depending on your location. Once your order is shipped, tracking details will be shared with you. We are not responsible for delays caused by courier services or unforeseen circumstances.'
  },
  returns: {
    title: 'Returns & Refunds',
    text: 'Since most products are handmade/customized, returns or exchanges are not accepted unless the product arrives damaged or incorrect. Please contact us within 24 hours of receiving your order along with clear pictures for assistance as well as proper video of unboxing.'
  },
  faq: {
    title: 'Frequently Asked Questions',
    text: 'For any questions regarding orders, customization, payments, or delivery, feel free to contact us anytime. We are always happy to help and make your shopping experience smooth and easy.'
  },
  privacy: {
    title: 'Privacy Policy',
    text: 'Your personal information such as name, contact details, and address is kept safe and confidential. We only use your information for order processing and communication purposes and never share it with third parties without permission'
  }
};

window.openPolicy = function(key) {
  const modal = document.getElementById('policyModal');
  const textDiv = document.getElementById('policyText');
  const policy = POLICIES[key];
  if (modal && textDiv && policy) {
    textDiv.innerHTML = `<h2>${policy.title}</h2><p>${policy.text}</p>`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closePolicy = function() {
  const modal = document.getElementById('policyModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Close on background click
document.getElementById('policyModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'policyModal') window.closePolicy();
});
