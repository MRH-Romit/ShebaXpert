// Enhanced Landing Page JavaScript with Animations and Interactions

// Function to show sign up form when navigating to login page
function showSignUp() {
    // Add a URL parameter to indicate sign up should be shown
    window.location.href = "../Login/LogIn.html?mode=signup";
}

// Function to handle login navigation (optional - for consistency)  
function showLogin() {
    window.location.href = "../Login/LogIn.html?mode=login";
}

// Loading screen functionality
document.addEventListener('DOMContentLoaded', function() {
    const loading = document.getElementById('loading');
    
    // Hide loading screen after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loading.classList.add('fade-out');
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }, 500);
    });
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('mobile-active');
            this.classList.toggle('active');
        });
    }
});

// Animated counter for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            
            // Add animate class for reveal animations
            if (element.classList.contains('reveal-animation')) {
                const delay = element.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    element.classList.add('animate');
                }, delay * 1000);
            }
            
            // Add animate class for other elements
            if (element.classList.contains('stat-item') || 
                element.classList.contains('service-card') ||
                element.classList.contains('testimonial-card') ||
                element.classList.contains('step') ||
                element.classList.contains('cta-option')) {
                const delay = element.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    element.classList.add('animate');
                }, delay * 1000);
            }
            
            // Trigger counter animation for stats section
            if (element.classList.contains('stats') && !element.classList.contains('counted')) {
                element.classList.add('counted');
                setTimeout(animateCounters, 500);
            }
            
            // Stop observing once animated
            observer.unobserve(element);
        }
    });
}, observerOptions);

// Observe all elements that need animation
document.addEventListener('DOMContentLoaded', function() {
    // Observe reveal animations
    document.querySelectorAll('.reveal-animation, .stat-item, .service-card, .testimonial-card, .step, .cta-option, .stats').forEach(el => {
        observer.observe(el);
    });
});

// Newsletter subscription
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Show success message (you can implement actual subscription logic here)
                const button = this.querySelector('button');
                const originalHTML = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.background = '#10B981';
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.background = '';
                    this.querySelector('input[type="email"]').value = '';
                }, 2000);
                
                // Here you would typically send the email to your backend
                console.log('Newsletter subscription for:', email);
            }
        });
    }
});

// Enhanced hover effects for service cards
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const parallaxSpeed = 0.5;
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

// Dynamic typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add entrance animations to hero content
document.addEventListener('DOMContentLoaded', function() {
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 1000);
    }
});

// Enhanced button click effects
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
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
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
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
