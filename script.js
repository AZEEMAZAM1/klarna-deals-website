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
