// Add this provider data at the top of your JavaScript file
const serviceProviders = {
    "গুলশান": [
        {
            id: 1,
            name: "আব্দুল করিম",
            service: "ইলেকট্রিশিয়ান",
            rating: 4.8,
            experience: "৫ বছর",
            price: "৳৫০০-৳১০০০",
            available: true,
            image: "provider1.jpg",
            description: "প্রফেশনাল ইলেকট্রিশিয়ান, সব ধরনের ইলেকট্রিক্যাল সমস্যার সমাধান"
        },
        {
            id: 2,
            name: "রহিম মিয়া",
            service: "প্লাম্বার",
            rating: 4.5,
            experience: "৩ বছর",
            price: "৳৪০০-৳৮০০",
            available: true,
            image: "provider2.jpg",
            description: "সব ধরনের পাইপ লাইন ও স্যানিটারি সমস্যার সমাধান"
        }
    ],
    "ধানমন্ডি": [
        {
            id: 3,
            name: "জামাল উদ্দিন",
            service: "এসি সার্ভিস",
            rating: 4.9,
            experience: "৭ বছর",
            price: "৳৮০০-৳১৫০০",
            available: true,
            image: "provider3.jpg",
            description: "এসি ইনস্টলেশন, রিপেয়ার ও রেগুলার মেইনটেনেন্স"
        }
    ],
    // Add more providers for other areas...
    "বনানী": [
        {
            id: 4,
            name: "সোহেল রানা",
            service: "কাঠমিস্ত্রি",
            rating: 4.7,
            experience: "৪ বছর",
            price: "৳৬০০-৳১২০০",
            available: true,
            image: "provider4.jpg",
            description: "ফার্নিচার মেরামত ও কাস্টম কাজ"
        }
    ]
};

// Update the viewProviders function
function viewProviders(areaName) {
    // Hide the service areas container
    document.getElementById('areas-container').style.display = 'none';
    
    // Create and show providers container
    const providersContainer = document.createElement('div');
    providersContainer.id = 'providers-container';
    providersContainer.className = 'providers-container';
    
    // Create back button
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> সার্ভিস এলাকায় ফিরে যান';
    backButton.onclick = function() {
        document.getElementById('areas-container').style.display = 'grid';
        providersContainer.remove();
    };
    
    providersContainer.appendChild(backButton);
    
    // Add title
    const title = document.createElement('h2');
    title.className = 'providers-title';
    title.innerHTML = `<i class="fas fa-users"></i> ${areaName} এলাকার প্রোভাইডার`;
    providersContainer.appendChild(title);
    
    // Get providers for this area
    const providers = serviceProviders[areaName] || [];
    
    if (providers.length === 0) {
        const noProviders = document.createElement('div');
        noProviders.className = 'no-providers';
        noProviders.innerHTML = `
            <i class="fas fa-user-slash"></i>
            <h3>এই এলাকায় কোনো প্রোভাইডার পাওয়া যায়নি</h3>
            <p>অনুগ্রহ করে অন্য এলাকা চেক করুন</p>
        `;
        providersContainer.appendChild(noProviders);
    } else {
        const providersGrid = document.createElement('div');
        providersGrid.className = 'providers-grid';
        
        providers.forEach(provider => {
            const providerCard = document.createElement('div');
            providerCard.className = 'provider-card';
            providerCard.innerHTML = `
                <div class="provider-header">
                    <div class="provider-image">
                        <img src="../Resources/images/${provider.image}" alt="${provider.name}">
                    </div>
                    <div class="provider-info">
                        <h3>${provider.name}</h3>
                        <span class="provider-service">${provider.service}</span>
                        <div class="provider-rating">
                            <i class="fas fa-star"></i>
                            <span>${provider.rating}</span>
                            <span class="provider-experience">${provider.experience} অভিজ্ঞতা</span>
                        </div>
                    </div>
                </div>
                <div class="provider-body">
                    <p>${provider.description}</p>
                    <div class="provider-price">
                        <i class="fas fa-tag"></i>
                        <span>${provider.price}</span>
                    </div>
                    <div class="provider-availability ${provider.available ? 'available' : 'busy'}">
                        <i class="fas fa-circle"></i>
                        <span>${provider.available ? 'এখনই উপলব্ধ' : 'ব্যস্ত'}</span>
                    </div>
                </div>
                <div class="provider-actions">
                    <button class="action-btn primary" onclick="bookProvider('${areaName}', ${provider.id})">
                        <i class="fas fa-calendar-check"></i> বুক করুন
                    </button>
                    <button class="action-btn secondary" onclick="viewProviderDetails(${provider.id})">
                        <i class="fas fa-info-circle"></i> বিস্তারিত
                    </button>
                </div>
            `;
            providersGrid.appendChild(providerCard);
        });
        
        providersContainer.appendChild(providersGrid);
    }
    
    // Add the providers container to the page
    document.querySelector('.service-area-container').appendChild(providersContainer);
}

// Add these new functions
function bookProvider(areaName, providerId) {
    const provider = serviceProviders[areaName].find(p => p.id === providerId);
    showNotification(`${provider.name} এর সাথে সেবা বুকিং শুরু হচ্ছে...`, 'info');
    
    // Simulate booking process
    setTimeout(() => {
        showNotification(`${provider.name} এর সাথে বুকিং কনফার্ম করতে অনুগ্রহ করে যোগাযোগ করুন`, 'success');
    }, 1500);
}

function viewProviderDetails(providerId) {
    // Find the provider in all areas
    let provider = null;
    for (const area in serviceProviders) {
        provider = serviceProviders[area].find(p => p.id === providerId);
        if (provider) break;
    }
    
    if (!provider) return;
    
    // Create modal for provider details
    const modal = document.createElement('div');
    modal.className = 'provider-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-header">
                <div class="provider-image">
                    <img src="../Resources/images/${provider.image}" alt="${provider.name}">
                </div>
                <div class="provider-info">
                    <h2>${provider.name}</h2>
                    <span class="provider-service">${provider.service}</span>
                    <div class="provider-rating">
                        <i class="fas fa-star"></i>
                        <span>${provider.rating}</span>
                        <span class="provider-experience">${provider.experience} অভিজ্ঞতা</span>
                    </div>
                </div>
            </div>
            <div class="modal-body">
                <h3><i class="fas fa-info-circle"></i> সম্পর্কে</h3>
                <p>${provider.description}</p>
                
                <h3><i class="fas fa-tools"></i> সেবাসমূহ</h3>
                <ul class="service-list">
                    <li><i class="fas fa-check"></i> বাসা-বাড়ির ইলেকট্রিক্যাল সমস্যা সমাধান</li>
                    <li><i class="fas fa-check"></i> নতুন ওয়্যারিং ইনস্টলেশন</li>
                    <li><i class="fas fa-check"></i> ইলেকট্রিক্যাল ডিভাইস রিপেয়ার</li>
                </ul>
                
                <div class="provider-stats">
                    <div class="stat-item">
                        <i class="fas fa-calendar-check"></i>
                        <span>১৫০+ বুকিং সম্পন্ন</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-user-check"></i>
                        <span>৯৫% সন্তুষ্টি হার</span>
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="action-btn primary" onclick="bookProvider('${Object.keys(serviceProviders).find(area => serviceProviders[area].some(p => p.id === providerId))}', ${providerId})">
                    <i class="fas fa-calendar-check"></i> এখনই বুক করুন
                </button>
                <button class="action-btn secondary" onclick="showNotification('প্রোভাইডারকে কল করা হচ্ছে...', 'info')">
                    <i class="fas fa-phone"></i> কল করুন
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Make the new functions available globally
window.viewProviders = viewProviders;
window.bookProvider = bookProvider;
window.viewProviderDetails = viewProviderDetails;








// Service Area JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    setupHomeNavigation();
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
    
    // Add loaded class after a short delay to trigger animations
    setTimeout(() => {
        document.getElementById('areas-container').classList.add('loaded');
    }, 100);
}

// Display areas based on current filters
function displayAreas(areas) {
    const container = document.getElementById('areas-container');
    container.className = `service-areas-grid ${currentView}-view`;
    
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
        `<span class="service-tag"><i class="fas fa-${getServiceIcon(service)}"></i> ${serviceTranslations[service]}</span>`
    ).join('');

    const emergencyBadge = area.emergencyService ? 
        `<span class="emergency-badge"><i class="fas fa-exclamation-triangle"></i> জরুরি</span>` : '';
    
    const availabilityText = area.availability === '24h' ? '২৪/৭ উপলব্ধ' : 'নিয়মিত সময়';
    const availabilityIcon = area.availability === '24h' ? 'fa-clock' : 'fa-calendar-alt';

    return `
        <div class="area-card" data-area-id="${area.id}">
            <div class="area-header">
                <h3 class="area-name"><i class="fas fa-map-marker-alt"></i> ${area.name}</h3>
                ${emergencyBadge}
            </div>
            <div class="area-body">
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
                        <i class="fas ${availabilityIcon}"></i>
                        <span>${availabilityText}</span>
                    </div>
                </div>
                
                <h4 class="services-title"><i class="fas fa-tools"></i> উপলব্ধ সেবা:</h4>
                <div class="services-grid">
                    ${servicesHtml}
                </div>
            </div>
            <div class="area-actions">
                <button class="action-btn primary" onclick="bookService('${area.name}')">
                    <i class="fas fa-calendar-plus"></i> সেবা বুক করুন
                </button>
                <button class="action-btn secondary" onclick="viewProviders('${area.name}')">
                    <i class="fas fa-users"></i> প্রোভাইডার দেখুন
                </button>
            </div>
        </div>
    `;
}

// Helper function to get icons for services
function getServiceIcon(service) {
    const icons = {
        electrician: 'bolt',
        plumber: 'faucet',
        ac: 'snowflake',
        carpenter: 'hammer',
        painting: 'paint-roller',
        repair: 'tools'
    };
    return icons[service] || 'toolbox';
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

    // Open support modal
    if (helpBtn && supportModal) {
        helpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            supportModal.style.display = 'flex';
            document.body.classList.add('modal-open');
        });
    }

    // Close support modal
    if (closeModalBtn && supportModal) {
        closeModalBtn.addEventListener('click', function() {
            supportModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        });
    }

    // Close modal when clicking outside
    if (supportModal) {
        supportModal.addEventListener('click', function(e) {
            if (e.target === supportModal) {
                supportModal.style.display = 'none';
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
        <button class="notification-close" onclick="this.parentElement.remove()">
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

// Ensure Home Link Always Works (same as dashboard)
function setupHomeNavigation() {
    const homeLink = document.getElementById('home-link');
    if (homeLink) {
        // Add multiple event handlers to ensure reliability
        homeLink.addEventListener('click', function(e) {
            console.log('🏠 Home link clicked from Service Area page');
            
            // Always prevent default and force navigation to dashboard
            e.preventDefault();
            
            console.log('🔄 Navigating to dashboard from Service Area page');
            
            // Use multiple fallback methods
            const dashboardUrl = window.location.href.includes('localhost') 
                ? 'http://localhost:8080/Dashboard/dash.html'
                : '/Dashboard/dash.html';
            
            window.location.href = dashboardUrl;
        });
        
        // Add backup handler for double-click
        homeLink.addEventListener('dblclick', function(e) {
            e.preventDefault();
            console.log('🏠 Home link double-clicked from Service Area - forcing navigation');
            const dashboardUrl = window.location.href.includes('localhost') 
                ? 'http://localhost:8080/Dashboard/dash.html'
                : '/Dashboard/dash.html';
            window.location.href = dashboardUrl;
        });
        
        console.log('✅ Service Area Home navigation handler added');
    } else {
        console.warn('⚠️ Home link not found in Service Area page');
    }
    
    // Add keyboard shortcut for home navigation (Ctrl+Home or Alt+H)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey && e.key === 'Home') || (e.altKey && e.key.toLowerCase() === 'h')) {
            e.preventDefault();
            console.log('⌨️ Home keyboard shortcut pressed from Service Area');
            const dashboardUrl = window.location.href.includes('localhost') 
                ? 'http://localhost:8080/Dashboard/dash.html'
                : '/Dashboard/dash.html';
            window.location.href = dashboardUrl;
        }
    });
}

// Make functions available globally
window.bookService = bookService;
window.viewProviders = viewProviders;
window.showNotification = showNotification;