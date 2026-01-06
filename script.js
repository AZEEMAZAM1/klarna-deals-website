// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// CTA Button handler
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        const dealsSection = document.querySelector('#deals');
        if (dealsSection) {
            dealsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Klarna button handlers
const klarnaButtons = document.querySelectorAll('.klarna-btn');
klarnaButtons.forEach(button => {
    button.addEventListener('click', function() {
        const dealCard = this.closest('.deal-card');
        const productName = dealCard.querySelector('h3').textContent;
        const price = dealCard.querySelector('.price').textContent;
        
        // Simulate Klarna checkout (in real app, this would integrate with Klarna API)
        alert(`Opening Klarna checkout for ${productName}\nPrice: ${price}\n\nThis is a demo. In production, this would redirect to Klarna payment gateway.`);
    });
});

// Category card interaction
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('click', function() {
        const category = this.textContent.trim();
        alert(`Browsing ${category} deals...\n\nThis is a demo. In production, this would filter deals by category.`);
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe deal cards for animation
const dealCards = document.querySelectorAll('.deal-card');
dealCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Mobile responsiveness check
function checkMobileView() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        console.log('Mobile view active - App-ready design');
    }
}

window.addEventListener('resize', checkMobileView);
checkMobileView();

console.log('Klarna Deals website loaded successfully!');
console.log('This codebase is ready to be converted to a mobile app using React Native or Capacitor.');


// ========= PROFESSIONAL ENHANCEMENTS =========

// Advanced Countdown Timer with Auto-Reset
function initAdvancedCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    function updateCountdown() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diff = tomorrow - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownEl.textContent = `Ends in: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.deal-card, .review-card, .category-card');
    
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialize
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
    });
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
}

// Dynamic User Counter (Simulated)
function initUserCounter() {
    const userCount = document.querySelector('.users-icon strong');
    if (!userCount) return;
    
    setInterval(() => {
        const currentCount = parseInt(userCount.textContent.replace(/,/g, ''));
        const change = Math.floor(Math.random() * 10) - 5; // Random change
        const newCount = Math.max(2500, currentCount + change);
        userCount.textContent = newCount.toLocaleString();
    }, 3000);
}

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} success-message`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : '#ff4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Enhanced Email Form with Validation
function enhanceEmailForm() {
    const emailForm = document.getElementById('emailForm');
    if (!emailForm) return;
    
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = emailForm.querySelector('.email-input');
        const email = emailInput.value.trim();
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate API call
        emailInput.disabled = true;
        showToast('Thank you! Your discount code is: KLARNA10', 'success');
        
        setTimeout(() => {
            emailInput.value = '';
            emailInput.disabled = false;
        }, 2000);
    });
}

// Product Quick View Modal
function initQuickView() {
    const dealCards = document.querySelectorAll('.deal-card');
    
    dealCards.forEach(card => {
        const img = card.querySelector('img');
        if (!img) return;
        
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            const modal = createQuickViewModal(card);
            document.body.appendChild(modal);
        });
    });
}

function createQuickViewModal(card) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        animation: slideInFromBottom 0.5s ease-out;
    `;
    
    const title = card.querySelector('h3').textContent;
    const price = card.querySelector('.price').textContent;
    const installment = card.querySelector('.installment').textContent;
    
    content.innerHTML = `
        <h2 style="margin-bottom: 20px;">${title}</h2>
        <p style="font-size: 28px; color: #FFB6C1; font-weight: bold;">${price}</p>
        <p style="color: #666; margin: 10px 0;">${installment}</p>
        <button onclick="this.closest('div[style*=\"fixed\"]').remove()" style="
            background: #FFB6C1;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 20px;
            font-size: 16px;
        ">Close</button>
    `;
    
    modal.appendChild(content);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    return modal;
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Add to Cart Animation
function initAddToCartAnimation() {
    const klarnaButtons = document.querySelectorAll('.klarna-btn');
    
    klarnaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create flying icon animation
            const icon = document.createElement('div');
            icon.textContent = '🛍️';
            icon.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                font-size: 30px;
                pointer-events: none;
                z-index: 9999;
                animation: flyToCart 1s ease-out forwards;
            `;
            
            document.body.appendChild(icon);
            setTimeout(() => icon.remove(), 1000);
            
            showToast('Added to cart! Proceeding to Klarna checkout...', 'success');
        });
    });
}

// Parallax Effect for Hero
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
}

// Initialize all enhancements on page load
document.addEventListener('DOMContentLoaded', () => {
    initAdvancedCountdown();
    initScrollReveal();
    initUserCounter();
    enhanceEmailForm();
    initQuickView();
    initLazyLoading();
    initAddToCartAnimation();
    initParallax();
    
    console.log('✨ Klarna Deals Website - Professional Enhancements Loaded!');
});

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes flyToCart {
        0% {
            transform: scale(1) translate(0, 0);
            opacity: 1;
        }
        100% {
            transform: scale(0.3) translate(-100vw, -100vh);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========= END OF ENHANCEMENTS =========
