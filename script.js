// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMobile = document.getElementById('navMobile');

menuToggle.addEventListener('click', () => {
    navMobile.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close mobile menu when clicking a link
const navLinksMobile = document.querySelectorAll('.nav-link-mobile');
navLinksMobile.forEach(link => {
    link.addEventListener('click', () => {
        navMobile.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Smooth scroll function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Update active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Hero animated dots
function createHeroDots() {
    const heroDots = document.getElementById('heroDots');
    if (!heroDots) return;
    
    const dotCount = 20;
    
    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'hero-dot';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        dot.style.left = `${x}%`;
        dot.style.top = `${y}%`;
        
        // Random animation delay
        dot.style.animationDelay = `${Math.random() * 2}s`;
        
        heroDots.appendChild(dot);
    }
}

createHeroDots();

// Animate stats counter
function animateValue(element, start, end, duration, suffix = '') {
    const startTimestamp = performance.now();
    const isDecimal = end.toString().includes('.');
    
    const step = (timestamp) => {
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = progress * (end - start) + start;
        
        if (isDecimal) {
            element.textContent = current.toFixed(1) + suffix;
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            
            // Animate stat cards
            if (entry.target.classList.contains('stat-card')) {
                const valueElement = entry.target.querySelector('.stat-value');
                const targetValue = parseFloat(valueElement.getAttribute('data-value'));
                
                if (valueElement && !valueElement.classList.contains('animated')) {
                    valueElement.classList.add('animated');
                    
                    let suffix = '';
                    const originalText = valueElement.textContent;
                    
                    // Determine suffix
                    if (originalText.includes('°C')) {
                        suffix = '°C';
                    } else if (originalText.includes('ppm')) {
                        suffix = 'ppm';
                    } else if (originalText.includes('mm')) {
                        suffix = 'mm';
                    } else if (originalText.includes('%')) {
                        suffix = '%';
                    }
                    
                    animateValue(valueElement, 0, targetValue, 1500, suffix);
                }
            }
        }
    });
}, observerOptions);

// Observe all animated elements
const animatedElements = document.querySelectorAll('[data-animate]');
animatedElements.forEach(el => observer.observe(el));

// Observe stat cards separately for counter animation
const statCards = document.querySelectorAll('.stat-card');
statCards.forEach(card => observer.observe(card));

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Add scroll indicator animation
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const impactSection = document.getElementById('impact');
        if (impactSection) {
            impactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Header background on scroll
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.8)';
        header.style.boxShadow = 'none';
    }
});

// Card hover effects with tilt
document.querySelectorAll('.impact-card, .solution-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Add smooth reveal animation for sections
window.addEventListener('load', () => {
    // Initial animation for hero
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroActions = document.querySelector('.hero-actions');
    
    if (heroTitle) {
        setTimeout(() => heroTitle.style.opacity = '1', 100);
    }
    if (heroSubtitle) {
        setTimeout(() => heroSubtitle.style.opacity = '1', 300);
    }
    if (heroActions) {
        setTimeout(() => heroActions.style.opacity = '1', 500);
    }
});

// Add animation to elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-animate]:not(.animated)');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
        
        if (isVisible) {
            element.classList.add('animated');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Button ripple effect
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Form validation (if forms are added)
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log('Form submitted');
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu on Escape
        if (navMobile.classList.contains('active')) {
            navMobile.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

// Preload critical images
const preloadImages = [
    'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4'
];

preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
});

// Add loading state
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Use debounced scroll handler for better performance
const debouncedScrollHandler = debounce(() => {
    animateOnScroll();
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

console.log('Climate Awareness Website - Vanilla JavaScript Version Loaded');
