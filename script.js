/* ============================================
   NU LOOKS - Royal Beauty Parlor
   JavaScript Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initParticles();
    initNavigation();
    initScrollReveal();
    initCounters();
    initTestimonialsSlider();
    initMobileMenu();
    initFormValidation();
    initSmoothScroll();
});

/* ============================================
   Particle Background Animation
   ============================================ */
function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 4 + 6;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
    `;
    
    container.appendChild(particle);
}

/* ============================================
   Navigation
   ============================================ */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect for navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Set initial state
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   Scroll Reveal Animation
   ============================================ */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.delay || 0;
                
                setTimeout(() => {
                    element.classList.add('active');
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, revealOptions);
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/* ============================================
   Animated Counters
   ============================================ */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, counterOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    updateCounter();
}

/* ============================================
   Testimonials Slider
   ============================================ */
function initTestimonialsSlider() {
    const track = document.getElementById('testimonials-track');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('testimonials-dots');
    
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
    
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let totalSlides = Math.ceil(cards.length / cardsPerView);
    let autoplayInterval;
    
    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        totalSlides = Math.ceil(cards.length / cardsPerView);
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }
    
    function updateSlider() {
        const cardWidth = cards[0].offsetWidth + 32; // Including gap
        const offset = currentIndex * cardWidth * cardsPerView;
        track.style.transform = `translateX(-${offset}px)`;
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
        updateSlider();
        resetAutoplay();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
        const newCardsPerView = getCardsPerView();
        if (newCardsPerView !== cardsPerView) {
            cardsPerView = newCardsPerView;
            currentIndex = 0;
            createDots();
            updateSlider();
        }
    });
    
    // Initialize
    createDots();
    updateSlider();
    startAutoplay();
    
    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    track.addEventListener('mouseleave', startAutoplay);
}

/* ============================================
   Mobile Menu
   ============================================ */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (!toggle || !navLinks) return;
    
    toggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        toggle.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = toggle.querySelectorAll('span');
        if (toggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggle.classList.remove('active');
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

/* ============================================
   Form Validation & Submission
   ============================================ */
function initFormValidation() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.phone || !data.service || !data.date || !data.time) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Phone validation
        const phoneRegex = /^[+]?[\d\s-]{10,}$/;
        if (!phoneRegex.test(data.phone)) {
            showNotification('Please enter a valid phone number.', 'error');
            return;
        }
        
        // Success - show confirmation
        showNotification('Thank you! Your booking request has been received. We will contact you shortly to confirm your appointment.', 'success');
        form.reset();
        
        // In a real application, you would send this data to a server
        console.log('Booking data:', data);
    });
}

function showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '!'}</span>
            <p>${message}</p>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        padding: 20px;
        background: ${type === 'success' ? '#4A1942' : '#B76E79'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.5s ease forwards;
        font-family: 'Cormorant Garamond', serif;
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: flex-start;
        gap: 12px;
    `;
    
    const icon = notification.querySelector('.notification-icon');
    icon.style.cssText = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: ${type === 'success' ? '#C9A961' : 'white'};
        color: ${type === 'success' ? '#4A1942' : '#B76E79'};
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.3s;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close handlers
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.5s ease forwards';
        setTimeout(() => notification.remove(), 500);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }
    }, 5000);
}

/* ============================================
   Smooth Scroll
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   Gallery Lightbox (Optional Enhancement)
   ============================================ */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (!img) return;
            
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${img.src}" alt="${img.alt}">
                    <button class="lightbox-close">×</button>
                </div>
            `;
            
            lightbox.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 40px;
                animation: fadeIn 0.3s ease;
            `;
            
            const content = lightbox.querySelector('.lightbox-content');
            content.style.cssText = `
                position: relative;
                max-width: 90%;
                max-height: 90%;
            `;
            
            const lightboxImg = lightbox.querySelector('img');
            lightboxImg.style.cssText = `
                max-width: 100%;
                max-height: 80vh;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            `;
            
            const closeBtn = lightbox.querySelector('.lightbox-close');
            closeBtn.style.cssText = `
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: #C9A961;
                font-size: 36px;
                cursor: pointer;
            `;
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Close handlers
            const closeLightbox = () => {
                lightbox.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }, 300);
            };
            
            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
            
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    });
}

// Initialize lightbox after DOM is ready
document.addEventListener('DOMContentLoaded', initGalleryLightbox);

/* ============================================
   Parallax Effect (Subtle)
   ============================================ */
function initParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        
        // Hero parallax
        const heroBg = document.querySelector('.hero-bg-img');
        if (heroBg) {
            heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
        }
    });
}

document.addEventListener('DOMContentLoaded', initParallax);

/* ============================================
   Cursor Sparkle Effect (Premium Touch)
   ============================================ */
function initCursorSparkle() {
    let throttle = false;
    
    document.addEventListener('mousemove', function(e) {
        if (throttle) return;
        throttle = true;
        
        setTimeout(() => {
            throttle = false;
        }, 50);
        
        // Only on hero section
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const rect = hero.getBoundingClientRect();
        if (e.clientY > rect.bottom) return;
        
        const sparkle = document.createElement('div');
        sparkle.className = 'cursor-sparkle';
        sparkle.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 6px;
            height: 6px;
            background: #C9A961;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: sparkleOut 0.6s ease forwards;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 600);
    });
    
    // Add sparkle animation
    if (!document.querySelector('#sparkle-styles')) {
        const style = document.createElement('style');
        style.id = 'sparkle-styles';
        style.textContent = `
            @keyframes sparkleOut {
                0% {
                    transform: scale(1);
                    opacity: 0.8;
                }
                100% {
                    transform: scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Optional: Enable cursor sparkle (can be intensive)
// document.addEventListener('DOMContentLoaded', initCursorSparkle);
