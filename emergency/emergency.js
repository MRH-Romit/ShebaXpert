// FAQ toggle functionality
function initializeFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq-item');
            item.classList.toggle('active');
        });
    });
}

// Emergency call with confirmation
function initializeEmergencyCards() {
    document.querySelectorAll('.emergency-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName !== 'A') {
                const number = this.querySelector('.emergency-number').textContent.replace(/\D/g, '');
                const service = this.querySelector('.emergency-title').textContent;
                
                if (confirm(`${service} নম্বরে কল করতে চান? ${number}`)) {
                    window.open(`tel:${number}`);
                }
            }
        });
    });
}

// Support card functionality
function initializeSupportCards() {
    document.querySelectorAll('.support-card').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.getAttribute('data-action');
            
            switch(action) {
                case 'call':
                    window.open('tel:+8801700000000');
                    break;
                case 'whatsapp':
                    window.open('https://wa.me/8801700000000', '_blank');
                    break;
                case 'email':
                    window.open('mailto:support@shebaexpert.com');
                    break;
                case 'chat':
                    alert('চ্যাট সেবা শীঘ্রই আসছে!');
                    break;
                default:
                    console.log('Unknown action:', action);
            }
        });
    });
}

// Resource item click
function initializeResourceItems() {
    document.querySelectorAll('.resource-item').forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('.resource-title').textContent;
            alert(`${title} পেজটি শীঘ্রই আসছে!`);
        });
    });
}

// Back button functionality
function initializeBackButton() {
    const backButton = document.querySelector('.back-arrow');
    if (backButton) {
        backButton.addEventListener('click', () => {
            // Check if there's a previous page in history
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // If no history, redirect to landing page
                window.location.href = '../Landing Page/LandingPage.html';
            }
        });
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFAQ();
    initializeEmergencyCards();
    initializeSupportCards();
    initializeResourceItems();
    initializeBackButton();

    console.log('Emergency page initialized successfully');
});

// Add some utility functions
function makeCall(number) {
    if (number) {
        window.open(`tel:${number}`);
    }
}

function openWhatsApp(number) {
    if (number) {
        window.open(`https://wa.me/${number}`, '_blank');
    }
}

function sendEmail(email) {
    if (email) {
        window.open(`mailto:${email}`);
    }
}
