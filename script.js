/* ==========================================================================
   GOMILA — Premium Shoe E-Commerce Website
   JavaScript: script.js
   All interactivity: cart, modals, carousel, forms, counters, animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== LOADING SCREEN ==========
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1800);
    });
    // Fallback: hide loader after 3s even if images haven't loaded
    setTimeout(() => loader.classList.add('hidden'), 3000);


    // ========== NAVBAR — Scroll Shadow & Active Link ==========
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const backToTop = document.getElementById('back-to-top');

    function onScroll() {
        const scrollY = window.scrollY;

        // Navbar shadow
        navbar.classList.toggle('scrolled', scrollY > 50);

        // Back to top visibility
        backToTop.classList.toggle('visible', scrollY > 600);

        // Active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', onScroll);
    onScroll();

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // ========== MOBILE HAMBURGER MENU ==========
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
        });
    });


    // ========== SMOOTH SCROLL for all anchor links ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 10;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    // ========== SCROLL REVEAL ANIMATIONS ==========
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObserver.observe(el));


    // ========== SHOPPING CART ==========
    let cartCount = 0;
    const cartCountEl = document.getElementById('cart-count');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

    function updateCartBadge() {
        cartCountEl.textContent = cartCount;
        cartCountEl.classList.toggle('show', cartCount > 0);
        // Pulse animation
        cartCountEl.style.animation = 'none';
        void cartCountEl.offsetHeight; // reflow
        cartCountEl.style.animation = 'pulse 0.3s ease';
    }

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            const name = card?.dataset.name || 'Product';
            cartCount++;
            updateCartBadge();
            showToast(`${name} added to cart!`, 'success');

            // Button feedback animation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = '', 200);
        });
    });


    // ========== TOAST NOTIFICATIONS ==========
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const iconSvg = type === 'success'
            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

        toast.innerHTML = `
            <div class="toast-icon">${iconSvg}</div>
            <span class="toast-text">${message}</span>
            <span class="toast-close">&times;</span>
        `;

        toastContainer.appendChild(toast);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));

        // Auto remove
        setTimeout(() => removeToast(toast), 4000);
    }

    function removeToast(toast) {
        if (toast.parentNode) {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }
    }


    // ========== QUICK VIEW MODAL ==========
    const modal = document.getElementById('quick-view-modal');
    const modalClose = document.getElementById('modal-close');
    const modalImg = document.getElementById('modal-img');
    const modalName = document.getElementById('modal-name');
    const modalStars = document.getElementById('modal-stars');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    const modalOldPrice = document.getElementById('modal-old-price');
    const modalBadge = document.getElementById('modal-badge');
    const modalAddCart = document.getElementById('modal-add-cart');

    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            if (!card) return;

            const { name, desc, price, img, badge, rating } = card.dataset;
            const oldPrice = card.dataset.oldPrice;

            modalImg.src = img;
            modalImg.alt = name;
            modalName.textContent = name;
            modalDesc.textContent = desc;
            modalPrice.textContent = price;
            modalOldPrice.textContent = oldPrice || '';
            modalBadge.textContent = badge || '';

            // Build stars
            const ratingNum = parseInt(rating) || 5;
            modalStars.textContent = '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);

            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    // Modal Add to Cart
    let currentModalName = '';
    modalAddCart.addEventListener('click', () => {
        const name = modalName.textContent;
        cartCount++;
        updateCartBadge();
        showToast(`${name} added to cart!`, 'success');
        closeModal();
    });

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Size button toggle in modal
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });


    // ========== REVIEW CAROUSEL ==========
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    const cards = track.querySelectorAll('.review-card');
    let currentSlide = 0;
    let slidesPerView = 3;
    let totalSlides = 0;
    let autoPlayInterval = null;

    function calcSlidesPerView() {
        const w = window.innerWidth;
        if (w <= 768) return 1;
        if (w <= 992) return 2;
        return 3;
    }

    function setupCarousel() {
        slidesPerView = calcSlidesPerView();
        totalSlides = Math.max(1, cards.length - slidesPerView + 1);
        if (currentSlide >= totalSlides) currentSlide = totalSlides - 1;

        // Build dots
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `carousel-dot${i === currentSlide ? ' active' : ''}`;
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        goToSlide(currentSlide);
    }

    function goToSlide(index) {
        currentSlide = index;
        const cardWidth = cards[0].offsetWidth + 24; // 24px gap
        track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

        // Update dots
        document.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide <= 0 ? totalSlides - 1 : currentSlide - 1);
        resetAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide >= totalSlides - 1 ? 0 : currentSlide + 1);
        resetAutoPlay();
    });

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            goToSlide(currentSlide >= totalSlides - 1 ? 0 : currentSlide + 1);
        }, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    window.addEventListener('resize', setupCarousel);
    setupCarousel();
    startAutoPlay();


    // ========== ANIMATED COUNTERS ==========
    const counters = document.querySelectorAll('.counter-number');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const countersRow = document.querySelector('.counters-row');
    if (countersRow) counterObserver.observe(countersRow);

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000; // ms
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out quad
                const eased = 1 - (1 - progress) * (1 - progress);
                const current = Math.floor(eased * target);

                // Format with K+ for large numbers
                if (target >= 1000) {
                    counter.textContent = (current / 1000).toFixed(current >= target ? 0 : 1) + 'K+';
                } else {
                    counter.textContent = current + '+';
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    // Final value
                    if (target >= 1000) {
                        counter.textContent = Math.floor(target / 1000) + 'K+';
                    } else {
                        counter.textContent = target + '+';
                    }
                }
            }

            requestAnimationFrame(update);
        });
    }


    // ========== FORM VALIDATION ==========

    /**
     * Generic form validator
     * @param {HTMLFormElement} form
     * @param {Object} rules - { fieldId: { required, type, minLength, pattern, message } }
     * @returns {boolean}
     */
    function validateForm(form, rules) {
        let isValid = true;

        for (const [fieldId, rule] of Object.entries(rules)) {
            const field = document.getElementById(fieldId);
            if (!field) continue;

            const errorEl = field.parentElement.querySelector('.error-msg');
            const value = field.value.trim();
            let error = '';

            if (rule.required && !value) {
                error = rule.message || 'This field is required';
            } else if (value && rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = 'Please enter a valid email address';
            } else if (value && rule.type === 'phone' && !/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{6,}$/.test(value)) {
                error = 'Please enter a valid phone number';
            } else if (value && rule.minLength && value.length < rule.minLength) {
                error = `Must be at least ${rule.minLength} characters`;
            }

            if (error) {
                isValid = false;
                field.classList.add('invalid');
                if (errorEl) errorEl.textContent = error;
            } else {
                field.classList.remove('invalid');
                if (errorEl) errorEl.textContent = '';
            }
        }

        return isValid;
    }

    // Clear validation on input
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
        field.addEventListener('input', () => {
            field.classList.remove('invalid');
            const errorEl = field.parentElement.querySelector('.error-msg');
            if (errorEl) errorEl.textContent = '';
        });
    });


    // ---- ORDER FORM ----
    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const valid = validateForm(orderForm, {
            'order-name':    { required: true, message: 'Full name is required' },
            'order-email':   { required: true, type: 'email' },
            'order-phone':   { required: true, type: 'phone' },
            'order-product': { required: true, message: 'Please select a product' },
            'order-size':    { required: true, message: 'Please select a size' },
            'order-qty':     { required: true, message: 'Quantity is required' },
            'order-address': { required: true, minLength: 10, message: 'Delivery address is required' },
        });

        if (valid) {
            showToast('🎉 Order placed successfully! We\'ll send you a confirmation email shortly.', 'success');
            orderForm.reset();
        } else {
            showToast('Please fix the errors in the form.', 'error');
        }
    });


    // ---- COMPLAINT FORM ----
    const complaintForm = document.getElementById('complaint-form');
    complaintForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const valid = validateForm(complaintForm, {
            'comp-name':     { required: true, message: 'Your name is required' },
            'comp-email':    { required: true, type: 'email' },
            'comp-order':    { required: true, message: 'Order number is required' },
            'comp-category': { required: true, message: 'Please select a category' },
            'comp-message':  { required: true, minLength: 20, message: 'Please describe your issue (min 20 characters)' },
        });

        if (valid) {
            showToast('Complaint submitted successfully! Our team will review it within 24 hours.', 'success');
            complaintForm.reset();
        } else {
            showToast('Please fix the errors in the form.', 'error');
        }
    });


    // ---- CONTACT FORM ----
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const valid = validateForm(contactForm, {
            'contact-name':    { required: true, message: 'Name is required' },
            'contact-email':   { required: true, type: 'email' },
            'contact-subject': { required: true, message: 'Subject is required' },
            'contact-message': { required: true, minLength: 10, message: 'Message is required (min 10 characters)' },
        });

        if (valid) {
            showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        } else {
            showToast('Please fix the errors in the form.', 'error');
        }
    });


    // ---- NEWSLETTER FORM ----
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('newsletter-email');
        const email = emailInput.value.trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        showToast('🎉 You\'re subscribed! Welcome to the GOMILA family.', 'success');
        emailInput.value = '';
    });

});
