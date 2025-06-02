// Service Area JavaScript File
// Author: ShebaXpert Development Team
// Purpose: Handle service area functionality including area display, filtering, search, and support modal

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeServiceAreas();
    initializeFilters();
    initializeSearch();
    initializeViewToggle();
    initializeSupportModal();
    initializeNotifications();
});

// Sample service areas data
const serviceAreas = [
    {
        id: 1,
        name: "গুলশান",
        district: "dhaka",
        services: ["electrician", "plumber", "ac", "carpenter", "painting"],
        providers: 25,
        availability: "24h",
        emergencyService: true,
        rating: 4.8,
        totalBookings: 1250,
        description: "গুলশান এলাকায় ২৪/৭ সব ধরনের হোম সার্ভিস উপলব্ধ"
    },
    {
        id: 2,
        name: "ধানমন্ডি",
        district: "dhaka",
        services: ["electrician", "plumber", "ac", "repair"],
        providers: 18,
        availability: "regular",
        emergencyService: true,
        rating: 4.6,
        totalBookings: 950,
        description: "ধানমন্ডি এলাকায় দ্রুত ও নির্ভরযোগ্য সেবা"
    },
    {
        id: 3,
        name: "বনানী",
        district: "dhaka",
        services: ["electrician", "plumber", "ac", "carpenter", "painting", "repair"],
        providers: 30,
        availability: "24h",
        emergencyService: true,
        rating: 4.9,
        totalBookings: 1450,
        description: "বনানী এলাকায় সর্বোচ্চ মানের হোম সার্ভিস"
    },
    {
        id: 4,
        name: "উত্তরা",
        district: "dhaka",
        services: ["electrician", "plumber", "carpenter"],
        providers: 20,
        availability: "regular",
        emergencyService: false,
        rating: 4.5,
        totalBookings: 780,
        description: "উত্তরা এলাকায় নিয়মিত হোম সার্ভিস"
    },
    {
        id: 5,
        name: "মিরপুর",
        district: "dhaka",
        services: ["electrician", "plumber", "repair"],
        providers: 15,
        availability: "regular",
        emergencyService: true,
        rating: 4.3,
        totalBookings: 650,
        description: "মিরপুর এলাকায় সাশ্রয়ী হোম সার্ভিস"
    },
    {
        id: 6,
        name: "পুরান ঢাকা",
        district: "dhaka",
        services: ["electrician", "plumber", "carpenter", "repair"],
        providers: 22,
        availability: "regular",
        emergencyService: true,
        rating: 4.4,
        totalBookings: 890,
        description: "পুরান ঢাকায় ঐতিহ্যবাহী হোম সার্ভিস"
    },
    {
        id: 7,
        name: "বাড্ডা",
        district: "dhaka",
        services: ["electrician", "plumber", "ac"],
        providers: 12,
        availability: "regular",
        emergencyService: false,
        rating: 4.2,
        totalBookings: 520,
        description: "বাড্ডা এলাকায় নিয়মিত হোম সার্ভিস"
    },
    {
        id: 8,
        name: "বসুন্ধরা",
        district: "dhaka",
        services: ["electrician", "plumber", "ac", "carpenter", "painting"],
        providers: 28,
        availability: "24h",
        emergencyService: true,
        rating: 4.7,
        totalBookings: 1100,
        description: "বসুন্ধরা এলাকায় প্রিমিয়াম হোম সার্ভিস"
    }
];

// Service type translations
const serviceTranslations = {
    electrician: "ইলেকট্রিশিয়ান",
    plumber: "প্লাম্বার",
    ac: "এসি সার্ভিস",
    carpenter: "কাঠমিস্ত্রি",
    painting: "রং করা",
    repair: "সাধারণ মেরামত"
};

// Current filters
let currentFilters = {
    district: 'all',
    service: 'all',
    availability: 'all',
    search: ''
};

// Current view mode
let currentView = 'grid';

// Initialize service areas display
function initializeServiceAreas() {
    displayAreas(serviceAreas);
}

// Display areas based on current filters
function displayAreas(areas) {
    const container = document.getElementById('areas-container');
    container.className = `service-areas-${currentView}`;
    
    if (areas.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>কোন এলাকা পাওয়া যায়নি</h3>
                <p>অন্য ফিল্টার ব্যবহার করে দেখুন</p>
            </div>
        `;
        return;
    }

    container.innerHTML = areas.map(area => createAreaCard(area)).join('');
}

// Create individual area card
function createAreaCard(area) {
    const servicesHtml = area.services.map(service => 
        `<span class="service-tag">${serviceTranslations[service]}</span>`
    ).join('');

    const emergencyBadge = area.emergencyService ? 
        '<span class="emergency-badge"><i class="fas fa-exclamation-triangle"></i> জরুরি</span>' : '';

    const availabilityText = area.availability === '24h' ? '২৪/৭ উপলব্ধ' : 'নিয়মিত সময়';

    return `
        <div class="area-card" data-area-id="${area.id}">
            <div class="area-header">
                <h3><i class="fas fa-map-marker-alt"></i> ${area.name}</h3>
                ${emergencyBadge}
            </div>
            <div class="area-info">
                <p class="area-description">${area.description}</p>
                <div class="area-stats">
                    <div class="stat-item">
                        <i class="fas fa-users"></i>
                        <span>${area.providers} প্রোভাইডার</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-star"></i>
                        <span>${area.rating} রেটিং</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-clock"></i>
                        <span>${availabilityText}</span>
                    </div>
                </div>
                <div class="services-list">
                    <h4>উপলব্ধ সেবা:</h4>
                    <div class="services-tags">
                        ${servicesHtml}
                    </div>
                </div>
            </div>
            <div class="area-actions">
                <button class="book-service-btn" onclick="bookService('${area.name}')">
                    <i class="fas fa-calendar-plus"></i> সেবা বুক করুন
                </button>
                <button class="view-providers-btn" onclick="viewProviders('${area.name}')">
                    <i class="fas fa-users"></i> প্রোভাইডার দেখুন
                </button>
            </div>
        </div>
    `;
}

// Initialize filters
function initializeFilters() {
    const districtFilter = document.getElementById('district-filter');
    const serviceFilter = document.getElementById('service-filter');
    const availabilityFilter = document.getElementById('availability-filter');

    [districtFilter, serviceFilter, availabilityFilter].forEach(filter => {
        filter.addEventListener('change', handleFilterChange);
    });
}

// Handle filter changes
function handleFilterChange() {
    currentFilters.district = document.getElementById('district-filter').value;
    currentFilters.service = document.getElementById('service-filter').value;
    currentFilters.availability = document.getElementById('availability-filter').value;

    applyFilters();
}

// Apply current filters
function applyFilters() {
    let filteredAreas = serviceAreas.filter(area => {
        // District filter
        if (currentFilters.district !== 'all' && area.district !== currentFilters.district) {
            return false;
        }

        // Service filter
        if (currentFilters.service !== 'all' && !area.services.includes(currentFilters.service)) {
            return false;
        }

        // Availability filter
        if (currentFilters.availability !== 'all') {
            if (currentFilters.availability === '24h' && area.availability !== '24h') return false;
            if (currentFilters.availability === 'emergency' && !area.emergencyService) return false;
            if (currentFilters.availability === 'regular' && area.availability !== 'regular') return false;
        }

        // Search filter
        if (currentFilters.search && !area.name.toLowerCase().includes(currentFilters.search.toLowerCase())) {
            return false;
        }

        return true;
    });

    displayAreas(filteredAreas);
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('area-search');
    const searchBtn = document.querySelector('.search-btn');

    searchInput.addEventListener('input', handleSearch);
    searchBtn.addEventListener('click', handleSearch);
    
    // Handle Enter key press
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// Handle search
function handleSearch() {
    const searchTerm = document.getElementById('area-search').value.trim();
    currentFilters.search = searchTerm;
    applyFilters();
}

// Initialize view toggle
function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            viewButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current view
            currentView = this.dataset.view;
            
            // Re-display areas with new view
            applyFilters();
        });
    });
}

// Book service function
function bookService(areaName) {
    showNotification(`${areaName} এলাকায় সেবা বুকিং শুরু হচ্ছে...`, 'info');
    
    // Simulate booking process
    setTimeout(() => {
        showNotification(`${areaName} এলাকার জন্য বুকিং পেজে নিয়ে যাওয়া হচ্ছে`, 'success');
        // Here you would redirect to booking page
        // window.location.href = `../Booking/booking.html?area=${encodeURIComponent(areaName)}`;
    }, 1500);
}

// View providers function
function viewProviders(areaName) {
    showNotification(`${areaName} এলাকার প্রোভাইডারদের তালিকা লোড হচ্ছে...`, 'info');
    
    // Simulate loading providers
    setTimeout(() => {
        showNotification(`${areaName} এলাকার প্রোভাইডারদের পেজে নিয়ে যাওয়া হচ্ছে`, 'success');
        // Here you would redirect to providers page
        // window.location.href = `../Providers/providers.html?area=${encodeURIComponent(areaName)}`;
    }, 1500);
}

// Support Modal Functions
function initializeSupportModal() {
    const helpBtn = document.getElementById('help-btn');
    const supportModal = document.getElementById('support-modal');
    const closeModalBtn = document.getElementById('close-support-modal');
    const supportForm = document.getElementById('support-contact-form');

    // Ensure modal is hidden initially
    if (supportModal) {
        supportModal.style.display = 'none';
        supportModal.classList.remove('active');
    }

    // Open support modal
    if (helpBtn && supportModal) {
        helpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            supportModal.style.display = 'flex';
            supportModal.classList.add('active');
            document.body.classList.add('modal-open');
        });
    }

    // Close support modal
    if (closeModalBtn && supportModal) {
        closeModalBtn.addEventListener('click', function() {
            supportModal.style.display = 'none';
            supportModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        });
    }

    // Close modal when clicking outside
    if (supportModal) {
        supportModal.addEventListener('click', function(e) {
            if (e.target === supportModal) {
                supportModal.style.display = 'none';
                supportModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    }

    // Handle support form submission
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const issueType = document.getElementById('issue-type').value;
            const message = document.getElementById('message').value;
            
            if (!issueType || !message.trim()) {
                showNotification('সব ফিল্ড পূরণ করুন', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('আপনার বার্তা পাঠানো হচ্ছে...', 'info');
            
            setTimeout(() => {
                showNotification('আপনার বার্তা সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।', 'success');
                supportForm.reset();
                
                // Close modal after successful submission
                setTimeout(() => {
                    supportModal.style.display = 'none';
                    supportModal.classList.remove('active');
                    document.body.classList.remove('modal-open');
                }, 2000);
            }, 2000);
        });
    }

    // Handle FAQ toggle
    initializeFAQ();
}

// Initialize FAQ functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Notification System
function initializeNotifications() {
    // Create notification container if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info') {
    const container = document.querySelector('.notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

function closeNotification(button) {
    const notification = button.parentElement;
    notification.classList.add('fade-out');
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// Handle ESC key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const supportModal = document.getElementById('support-modal');
        if (supportModal && supportModal.classList.contains('active')) {
            supportModal.style.display = 'none';
            supportModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    }
});

// Smooth scrolling for anchor links
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

// Add loading animation when page loads
window.addEventListener('load', function() {
    const container = document.getElementById('areas-container');
    container.classList.add('loaded');
});

// Console log for debugging
console.log('Service Area page initialized successfully');
console.log(`Loaded ${serviceAreas.length} service areas`);
