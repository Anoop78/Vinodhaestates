/* ============================================
   VINODHA ESTATES — script.js
   No backend. All functionality client-side.
   ============================================ */

'use strict';

// ─── WISHLIST STATE ───────────────────────────────────────────────────────────
let wishlist = [];

// ─── GALLERY LIGHTBOX DATA ────────────────────────────────────────────────────
const galleryData = [
    { src: 'assets/property1.jpg', title: 'Luxury Villa — City Centre' },
    { src: 'assets/property2.jpg', title: 'Premium Plot — Expressway' },
    { src: 'assets/property3.jpg', title: 'Modern Duplex — Morar' },
    { src: 'assets/property4.jpg', title: 'Residential Apartment — Thatipur' }
];
let lbIndex = 0;

// ─── DOM READY ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initAnimatedCounters();
    initGallery();
    initLightbox();
    initWishlist();
    initContactForm();
    initSmoothScroll();
    initHeroParallax();
});

// ─── 1. SCROLL PROGRESS BAR ───────────────────────────────────────────────────
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
}

// ─── 2. NAVBAR ────────────────────────────────────────────────────────────────
function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// ─── 3. MOBILE MENU ───────────────────────────────────────────────────────────
function initMobileMenu() {
    const btn     = document.getElementById('hamburgerBtn');
    const menu    = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileOverlay');
    const close   = document.getElementById('mobileClose');
    if (!btn) return;

    const open  = () => { btn.classList.add('active'); menu.classList.add('active'); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; btn.setAttribute('aria-expanded','true'); menu.setAttribute('aria-hidden','false'); };
    const closeFn = () => { btn.classList.remove('active'); menu.classList.remove('active'); overlay.classList.remove('active'); document.body.style.overflow = ''; btn.setAttribute('aria-expanded','false'); menu.setAttribute('aria-hidden','true'); };

    btn.addEventListener('click', () => menu.classList.contains('active') ? closeFn() : open());
    close.addEventListener('click', closeFn);
    overlay.addEventListener('click', closeFn);
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeFn));
}

// ─── 4. SCROLL REVEAL ─────────────────────────────────────────────────────────
function initScrollReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                // stagger siblings
                const siblings = e.target.parentElement?.querySelectorAll('.reveal');
                let delay = 0;
                if (siblings) {
                    [...siblings].forEach((s, idx) => { if (s === e.target) delay = idx * 80; });
                }
                setTimeout(() => e.target.classList.add('visible'), delay);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ─── 5. ANIMATED COUNTERS ─────────────────────────────────────────────────────
function initAnimatedCounters() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(el => obs.observe(el));
}

function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const start    = performance.now();

    const tick = now => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
    };
    requestAnimationFrame(tick);
}

// ─── 6. GALLERY SLIDER ────────────────────────────────────────────────────────
function initGallery() {
    const track  = document.getElementById('galleryTrack');
    const dotsEl = document.getElementById('gDots');
    const prev   = document.getElementById('gPrev');
    const next   = document.getElementById('gNext');
    if (!track) return;

    const slides = track.querySelectorAll('.gallery-slide');
    const total  = slides.length;
    let current  = 0;
    let autoTimer = null;

    // Build dots
    if (dotsEl) {
        dotsEl.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const d = document.createElement('button');
            d.className = 'gnav-dot' + (i === 0 ? ' active' : '');
            d.setAttribute('aria-label', `Go to slide ${i + 1}`);
            d.addEventListener('click', () => { goTo(i); resetAuto(); });
            dotsEl.appendChild(d);
        }
    }

    function goTo(idx) {
        current = (idx + total) % total;
        const slideW = slides[0].getBoundingClientRect().width + 32; // gap 2rem ≈ 32px
        const trackRect = track.getBoundingClientRect();
        const slideRect = slides[current].getBoundingClientRect();
        const offset = slides[current].offsetLeft - (trackRect.width - slides[current].offsetWidth) / 2;
        track.scrollTo({ left: offset, behavior: 'smooth' });
        updateDots();
    }

    function updateDots() {
        dotsEl?.querySelectorAll('.gnav-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function detectCurrent() {
        const center = track.scrollLeft + track.offsetWidth / 2;
        let closest = 0, minDist = Infinity;
        slides.forEach((s, i) => {
            const sMid = s.offsetLeft + s.offsetWidth / 2;
            const dist = Math.abs(sMid - center);
            if (dist < minDist) { minDist = dist; closest = i; }
        });
        if (closest !== current) { current = closest; updateDots(); }
    }

    if (prev) prev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    if (next) next.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    track.addEventListener('scroll', detectCurrent, { passive: true });
    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);
    track.addEventListener('touchstart', stopAuto, { passive: true });
    track.addEventListener('touchend', () => setTimeout(startAuto, 3000), { passive: true });

    function startAuto()  { stopAuto(); autoTimer = setInterval(() => goTo(current + 1), 4500); }
    function stopAuto()   { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
    function resetAuto()  { stopAuto(); setTimeout(startAuto, 3000); }

    startAuto();
}

// ─── 7. LIGHTBOX ──────────────────────────────────────────────────────────────
function initLightbox() {
    const lb    = document.getElementById('lightbox');
    const img   = document.getElementById('lbImg');
    const close = document.getElementById('lbClose');
    const prev  = document.getElementById('lbPrev');
    const next  = document.getElementById('lbNext');
    const cur   = document.getElementById('lbCur');
    const total = document.getElementById('lbTotal');
    if (!lb) return;

    if (total) total.textContent = galleryData.length;

    close.addEventListener('click', closeLightbox);
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    prev.addEventListener('click', () => navLb(-1));
    next.addEventListener('click', () => navLb(1));
    document.addEventListener('keydown', e => {
        if (!lb.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navLb(-1);
        if (e.key === 'ArrowRight') navLb(1);
    });

    function navLb(dir) {
        lbIndex = (lbIndex + dir + galleryData.length) % galleryData.length;
        updateLb();
    }

    function updateLb() {
        img.src = galleryData[lbIndex].src;
        img.alt = galleryData[lbIndex].title;
        if (cur) cur.textContent = lbIndex + 1;
    }

    function closeLightbox() { lb.classList.remove('active'); document.body.style.overflow = ''; }
}

function openLightbox(idx) {
    lbIndex = idx;
    const lb  = document.getElementById('lightbox');
    const img = document.getElementById('lbImg');
    const cur = document.getElementById('lbCur');
    if (!lb) return;
    img.src = galleryData[lbIndex].src;
    img.alt = galleryData[lbIndex].title;
    if (cur) cur.textContent = lbIndex + 1;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ─── 8. WISHLIST ──────────────────────────────────────────────────────────────
function initWishlist() {
    const btn   = document.getElementById('wishlistBtn');
    const modal = document.getElementById('wishlistModal');
    const close = document.getElementById('wmClose');
    const email = document.getElementById('emailWishlistBtn');
    if (!btn) return;

    btn.addEventListener('click',  openWishlistModal);
    close.addEventListener('click', closeWishlistModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeWishlistModal(); });
    email.addEventListener('click', emailWishlist);
}

function addToWishlist(title) {
    if (wishlist.find(w => w.title === title)) { showToast('Already in wishlist!'); return; }
    wishlist.push({ title });
    const count = document.getElementById('wishlistCount');
    if (count) count.textContent = wishlist.length;
    // Update aria-label
    const btn = document.getElementById('wishlistBtn');
    if (btn) btn.setAttribute('aria-label', `View wishlist (${wishlist.length} items)`);
    showToast('Added to wishlist! ♥');
}

function removeFromWishlist(title) {
    wishlist = wishlist.filter(w => w.title !== title);
    const count = document.getElementById('wishlistCount');
    if (count) count.textContent = wishlist.length;
    renderWishlistItems();
}

function openWishlistModal()  { renderWishlistItems(); document.getElementById('wishlistModal').classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeWishlistModal() { document.getElementById('wishlistModal').classList.remove('active'); document.body.style.overflow = ''; }

function renderWishlistItems() {
    const container = document.getElementById('wishlistItems');
    if (!container) return;
    if (!wishlist.length) { container.innerHTML = '<p class="wl-empty">No properties in your wishlist yet.</p>'; return; }
    container.innerHTML = wishlist.map(item => `
        <div class="wl-item">
            <div class="wl-item-info">
                <strong>${item.title}</strong>
            </div>
            <button class="wl-remove" onclick="removeFromWishlist('${item.title.replace(/'/g, "\\'")}')" aria-label="Remove ${item.title}">&times;</button>
        </div>
    `).join('');
}

function emailWishlist() {
    if (!wishlist.length) { showToast('Wishlist is empty'); return; }
    const list = wishlist.map(w => `${w.title}`).join('\n');
    window.location.href = `mailto:hello@vinodhaestates.com?subject=${encodeURIComponent('My Vinodha Estates Wishlist')}&body=${encodeURIComponent(`Hi,\n\nFavorite properties:\n\n${list}\n\nPlease share more info.\n\nThank you!`)}`;
}

// ─── 9. CONTACT FORM → WHATSAPP ──────────────────────────────────────────────
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const d = new FormData(form);
        const interestMap = { buy: 'Buying a Property', sell: 'Selling a Property', invest: 'Investment Consultation', tour: 'Schedule a Tour' };
        const interest = interestMap[d.get('interest')] || 'General Inquiry';
        const txt = `Hi Vinodha Estates!%0A%0A*Name:* ${enc(d.get('name'))}%0A*Email:* ${enc(d.get('email'))}%0A*Phone:* ${enc(d.get('phone'))}%0A*Interest:* ${enc(interest)}%0A${d.get('message') ? `*Message:* ${enc(d.get('message'))}%0A` : ''}%0ASent from VinodhaEstates.com`;
        window.open(`https://wa.me/917974741166?text=${txt}`, '_blank');
        showToast('Redirecting to WhatsApp…');
        form.reset();
    });
}

// ─── 10. CONSULTANCY FORM ─────────────────────────────────────────────────────
function sendConsultancy() {
    const name  = val('consultName');
    const phone = val('consultPhone');
    const query = val('consultQuery');
    if (!name || !phone) { showToast('Please enter your name and phone number'); return; }
    const txt = `Hi Vinodha Estates!%0A%0A*Consultancy Enquiry*%0A*Name:* ${enc(name)}%0A*Phone:* ${enc(phone)}${query ? `%0A*Query:* ${enc(query)}` : ''}%0A%0ASent from VinodhaEstates.com`;
    window.open(`https://wa.me/917974741166?text=${txt}`, '_blank');
    showToast('Redirecting to WhatsApp…');
    ['consultName','consultPhone','consultQuery'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}

// ─── 11. CHANNEL PARTNER ENQUIRY ─────────────────────────────────────────────
function sendCpEnquiry() {
    const name = val('cpName');
    const phone = val('cpPhone');
    const city  = val('cpCity');
    const exp   = val('cpExp');
    const msg   = val('cpMsg');
    if (!name || !phone) { showToast('Please enter your name and phone number'); return; }
    const txt = `Hi Vinodha Estates!%0A%0A*Channel Partner Enquiry*%0A*Name:* ${enc(name)}%0A*Phone:* ${enc(phone)}${city ? `%0A*City:* ${enc(city)}` : ''}${exp ? `%0A*Experience:* ${enc(exp)}` : ''}${msg ? `%0A*About:* ${enc(msg)}` : ''}%0A%0ASent from VinodhaEstates.com`;
    window.open(`https://wa.me/917974741166?text=${txt}`, '_blank');
    showToast('Redirecting to WhatsApp…');
    ['cpName','cpPhone','cpCity','cpExp','cpMsg'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}

// ─── 12. SMOOTH SCROLL ────────────────────────────────────────────────────────
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });
}

// ─── 13. HERO PARALLAX ────────────────────────────────────────────────────────
function initHeroParallax() {
    const video = document.querySelector('.hero-video');
    if (!video) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY < window.innerHeight) {
                    video.style.transform = `scale(${1 + window.scrollY * 0.00025})`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function val(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
function enc(str) { return encodeURIComponent(str || ''); }

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}
// ===== TESTIMONIALS SLIDER =====
(function initTestiSlider() {
    const track  = document.getElementById('testiTrack');
    const dotsEl = document.getElementById('testiDots');
    const prev   = document.getElementById('testiPrev');
    const next   = document.getElementById('testiNext');
    if (!track) return;

    const cards = track.querySelectorAll('.testi-card');
    const total = cards.length; // 6
    let perPage = getPerPage();
    let page    = 0;
    let autoTimer = null;

    function getPerPage() {
        if (window.innerWidth <= 560) return 1;
        if (window.innerWidth <= 900) return 2;
        return 3;
    }

    function totalPages() {
        return Math.ceil(total / perPage);
    }

    function goTo(p) {
        const pages = totalPages();
        page = (p + pages) % pages; // wrap around

        // card width + gap
        const cardW = cards[0].offsetWidth;
        const gap   = 32; // 2rem = 32px
        const shift = page * perPage * (cardW + gap);

        track.style.transform = `translateX(-${shift}px)`;
        updateDots();
        updateButtons();
    }

    function buildDots() {
        if (!dotsEl) return;
        dotsEl.innerHTML = '';
        for (let i = 0; i < totalPages(); i++) {
            const d = document.createElement('button');
            d.className = 'testi-dot' + (i === 0 ? ' active' : '');
            d.setAttribute('aria-label', 'Go to page ' + (i + 1));
            d.addEventListener('click', () => { goTo(i); resetAuto(); });
            dotsEl.appendChild(d);
        }
    }

    function updateDots() {
        dotsEl?.querySelectorAll('.testi-dot').forEach((d, i) =>
            d.classList.toggle('active', i === page)
        );
    }

    function updateButtons() {
        if (prev) prev.disabled = false; // allow wrap
        if (next) next.disabled = false;
    }

    function startAuto()  { stopAuto(); autoTimer = setInterval(() => goTo(page + 1), 5000); }
    function stopAuto()   { clearInterval(autoTimer); autoTimer = null; }
    function resetAuto()  { stopAuto(); setTimeout(startAuto, 3000); }

    prev?.addEventListener('click', () => { goTo(page - 1); resetAuto(); });
    next?.addEventListener('click', () => { goTo(page + 1); resetAuto(); });

    // Pause on hover
    track.closest('.testi-slider')?.addEventListener('mouseenter', stopAuto);
    track.closest('.testi-slider')?.addEventListener('mouseleave', startAuto);

    // Rebuild on resize
    window.addEventListener('resize', () => {
        const newPer = getPerPage();
        if (newPer !== perPage) {
            perPage = newPer;
            page = 0;
            buildDots();
            goTo(0);
        }
    });

    buildDots();
    goTo(0);
    startAuto();
})();