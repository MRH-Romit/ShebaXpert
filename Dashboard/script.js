console.log('🚀 ShebaXpert Dashboard Script Loaded - Version 2025-06-02');

// Debug initialization sequence
console.log('=== SCRIPT INITIALIZATION START ===');
console.log('Document ready state:', document.readyState);
console.log('Current URL:', window.location.href);

// Initialize the map with default zoom controls and no attribution control
var map = L.map('mapid', {
    center: [23.8103, 90.4125], 
    zoom: 15,  
    maxZoom: 21,
    minZoom: 5,
    zoomControl: true,  // Enable default zoom controls
    attributionControl: false  // Remove attribution control (white button)
});

// Add OpenStreetMap tiles without attribution
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 22  
}).addTo(map);

// Enhanced service providers with more realistic data
const serviceProviders = [
    // Electricians
    { name: "রহিম ইলেকট্রিক সার্ভিস", lat: 23.8113, lng: 90.4125, category: "electrician", icon: "bolt", rating: 4.8, experience: "৫ বছর", phone: "01712345678" },
    { name: "করিম ইলেকট্রিশিয়ান", lat: 23.7956, lng: 90.4074, category: "electrician", icon: "bolt", rating: 4.6, experience: "৮ বছর", phone: "01812345679" },
    { name: "বিদ্যুৎ সার্ভিস সেন্টার", lat: 23.8208, lng: 90.4193, category: "electrician", icon: "bolt", rating: 4.9, experience: "১০ বছর", phone: "01912345680" },
    
    // Plumbers
    { name: "আলী প্লাম্বিং সার্ভিস", lat: 23.8093, lng: 90.4135, category: "plumber", icon: "faucet", rating: 4.7, experience: "৬ বছর", phone: "01712345681" },
    { name: "হাসান ওয়াটার ওয়ার্কস", lat: 23.7889, lng: 90.4017, category: "plumber", icon: "faucet", rating: 4.5, experience: "৭ বছর", phone: "01812345682" },
    { name: "ঢাকা প্লাম্বিং", lat: 23.8156, lng: 90.4284, category: "plumber", icon: "faucet", rating: 4.8, experience: "১২ বছর", phone: "01912345683" },
    
    // AC Services
    { name: "কুল এয়ার সার্ভিস", lat: 23.8103, lng: 90.4115, category: "ac", icon: "wind", rating: 4.9, experience: "৯ বছর", phone: "01712345684" },
    { name: "ঢাকা এসি রিপেয়ার", lat: 23.7845, lng: 90.4098, category: "ac", icon: "wind", rating: 4.6, experience: "৫ বছর", phone: "01812345685" },
    { name: "এয়ার কন্ডিশন এক্সপার্ট", lat: 23.8234, lng: 90.4167, category: "ac", icon: "wind", rating: 4.8, experience: "১১ বছর", phone: "01912345686" },
    
    // Carpenters
    { name: "কাঠমিস্ত্রি সার্ভিস", lat: 23.8123, lng: 90.4145, category: "carpenter", icon: "hammer", rating: 4.7, experience: "৮ বছর", phone: "01712345687" },
    { name: "ফার্নিচার মেকার", lat: 23.7923, lng: 90.4056, category: "carpenter", icon: "hammer", rating: 4.5, experience: "৬ বছর", phone: "01812345688" },
    { name: "উড ওয়ার্ক এক্সপার্ট", lat: 23.8189, lng: 90.4223, category: "carpenter", icon: "hammer", rating: 4.9, experience: "১৫ বছর", phone: "01912345689" },
    
    // Painting Services
    { name: "রঙ মিস্ত্রি সার্ভিস", lat: 23.8083, lng: 90.4155, category: "painting", icon: "paint-roller", rating: 4.6, experience: "৭ বছর", phone: "01712345690" },
    { name: "ওয়াল পেইন্টিং", lat: 23.7867, lng: 90.4089, category: "painting", icon: "paint-roller", rating: 4.8, experience: "৯ বছর", phone: "01812345691" },
    { name: "হোম ডেকোরেটর", lat: 23.8167, lng: 90.4201, category: "painting", icon: "paint-roller", rating: 4.7, experience: "১০ বছর", phone: "01912345692" },
    
    // General Repair
    { name: "হোম রিপেয়ার সার্ভিস", lat: 23.8133, lng: 90.4105, category: "repair", icon: "tools", rating: 4.8, experience: "১২ বছর", phone: "01712345693" },
    { name: "ঘর মেরামত সার্ভিস", lat: 23.7934, lng: 90.4078, category: "repair", icon: "tools", rating: 4.5, experience: "৬ বছর", phone: "01812345694" },
    { name: "মেইনটেইন্যান্স এক্সপার্ট", lat: 23.8201, lng: 90.4178, category: "repair", icon: "tools", rating: 4.9, experience: "১৪ বছর", phone: "01912345695" }
];

// Create custom icons
function createCustomIcon(iconName) {
    return L.divIcon({
        html: `<div class="custom-marker"><i class="fas fa-${iconName}"></i></div>`,
        iconSize: [40, 40],
        className: 'custom-marker-container'
    });
}

// Global variables
let userLocation = [23.8103, 90.4125]; // Default: Dhaka center
let userMarker = null;
let serviceMarkers = [];
let currentCategory = 'electrician'; // Default

// Helper: get providers by category, near user
function getNearbyProviders(category, center, radiusKm = 3) {
    // For demo, just filter by category and randomize near user
    return serviceProviders.filter(p => p.category === category).map(p => {
        // Randomize location within radius
        const angle = Math.random() * 2 * Math.PI;
        const dist = Math.random() * radiusKm / 111; // ~1 deg = 111km
        return {
            ...p,
            lat: center[0] + Math.cos(angle) * dist,
            lng: center[1] + Math.sin(angle) * dist
        };
    });
}


function clearServiceMarkers() {
    serviceMarkers.forEach(m => map.removeLayer(m));
    serviceMarkers = [];
}

function showServiceMarkers(category) {
    clearServiceMarkers();
    const providers = getNearbyProviders(category, userLocation);
    providers.forEach(provider => {
        const marker = L.marker([provider.lat, provider.lng], {
            icon: createCustomIcon(provider.icon)
        }).addTo(map)
            .bindPopup(`
                <div class="service-popup">
                    <h3>${provider.name}</h3>
                    <div class="popup-info">
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <span>${provider.rating}</span>
                        </div>
                        <div class="experience">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${provider.experience} অভিজ্ঞতা</span>
                        </div>
                        <div class="phone">
                            <i class="fas fa-phone"></i>
                            <span>${provider.phone}</span>
                        </div>
                    </div>
                    <button class="contact-btn" onclick="contactProvider('${provider.phone}')">
                        <i class="fas fa-phone-alt"></i> যোগাযোগ করুন
                    </button>
                </div>
            `);
        serviceMarkers.push(marker);
    });
}

// Basic user location setter
function setUserLocation(lat, lng) {
    userLocation = [lat, lng];
    map.setView(userLocation, 16);
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    userMarker = L.marker(userLocation, {
        icon: createCustomIcon('map-marker-alt')
    }).addTo(map).bindPopup('আপনার অবস্থান').openPopup();
}

// Enhanced user location setter with pulsing animation
function setUserLocationWithPulse(lat, lng) {
    userLocation = [lat, lng];
    map.setView(userLocation, 16);
    
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    
    // Create pulsing user marker
    userMarker = L.marker(userLocation, {
        icon: L.divIcon({
            html: `<div class="user-location-marker">
                     <div class="pulse"></div>
                     <div class="user-dot"></div>
                   </div>`,
            iconSize: [20, 20],
            className: 'user-location-container'
        })
    }).addTo(map).bindPopup('আপনার বর্তমান অবস্থান').openPopup();
}

// Toast notification for location feedback
function showLocationToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `location-toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Contact provider function
function contactProvider(phone) {
    if (confirm(`${phone} নম্বরে কল করতে চান?`)) {
        window.open(`tel:${phone}`, '_self');
    }
}

// Initialize location button functionality
function initializeLocationButton() {
    console.log('🎯 Initializing location button...');
    const locationBtn = document.getElementById('show-my-location');
    console.log('📍 Location button found:', locationBtn);
    
    if (locationBtn) {
        console.log('✅ Adding click listener to location button');
        // Add a visual indicator that the button is ready
        locationBtn.style.border = '2px solid #00C6FF';
        locationBtn.style.boxShadow = '0 0 10px rgba(0, 198, 255, 0.3)';
        
        locationBtn.addEventListener('click', function() {
            console.log('Location button clicked!');
            // Add loading state
            locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>অবস্থান খোঁজা হচ্ছে...</span>';
            locationBtn.disabled = true;
              
            if (navigator.geolocation) {
                console.log('Geolocation supported, getting position...');
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        console.log('Position received:', position);
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        console.log('Lat:', lat, 'Lng:', lng);
                          
                        // Set user location with pulsing marker
                        setUserLocationWithPulse(lat, lng);
                        showServiceMarkers(currentCategory);
                        
                        // Reset button
                        locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i><span>আমার অবস্থান</span>';
                        locationBtn.disabled = false;
                        
                        // Show success message
                        showLocationToast('আপনার অবস্থান সফলভাবে পাওয়া গেছে!', 'success');
                    },
                    function(error) {
                        console.log('Geolocation error:', error);
                        let errorMessage = 'অবস্থান পেতে সমস্যা হয়েছে।';
                        
                        switch(error.code) {
                            case error.PERMISSION_DENIED:
                                errorMessage = 'অবস্থানের অনুমতি দিন।';
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMessage = 'অবস্থান তথ্য পাওয়া যাচ্ছে না।';
                                break;
                            case error.TIMEOUT:
                                errorMessage = 'সময় শেষ। আবার চেষ্টা করুন।';
                                break;
                        }
                        
                        // Reset button
                        locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i><span>আমার অবস্থান</span>';
                        locationBtn.disabled = false;
                        
                        showLocationToast(errorMessage, 'error');
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 60000
                    }
                );
            } else {
                locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i><span>আমার অবস্থান</span>';
                locationBtn.disabled = false;
                showLocationToast('আপনার ব্রাউজার geolocation সাপোর্ট করে না।', 'error');
            }
        });
    }
}

// Category selection functionality
function initializeCategorySelection() {
    console.log('Initializing category selection...');
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            categoryItems.forEach(cat => cat.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update current category and show markers
            const categoryText = this.querySelector('span').textContent;
            console.log('Category selected:', categoryText);
            
            // Map Bengali category names to internal categories
            const categoryMap = {
                'ইলেকট্রিশিয়ান': 'electrician',
                'প্লাম্বার': 'plumber',
                'এসি সার্ভিস': 'ac',
                'গৃহস্থালি মেরামত': 'repair',
                'পেইন্টিং': 'painting',
                'কার্পেন্টার': 'carpenter'
            };
            
            currentCategory = categoryMap[categoryText] || 'electrician';
            showServiceMarkers(currentCategory);
        });
    });
}

// Search location functionality
function initializeSearch() {
    const searchBtn = document.querySelector('.search-button');
    if (searchBtn) {
        searchBtn.addEventListener('click', async () => {
            const placeInput = document.querySelector('.input-field');
            let placeName = placeInput.value.trim();
            if (placeName === "") {
                alert("অনুগ্রহ করে একটি স্থান নাম লিখুন!");
                return;
            }
            let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&countrycodes=bd`;
            try {
                let response = await fetch(url);
                let data = await response.json();
                if (data.length > 0) {
                    let lat = parseFloat(data[0].lat);
                    let lon = parseFloat(data[0].lon);
                    setUserLocation(lat, lon);
                    showServiceMarkers(currentCategory);
                } else {
                    alert("কোনো ফলাফল পাওয়া যায়নি!");
                }
            } catch (error) {
                console.error("Error fetching location:", error);
                alert("অনুসন্ধান করতে সমস্যা হচ্ছে!");
            }
        });
    }
}

// Profile dropdown functionality
function initializeProfileDropdown() {
    const profileBtn = document.querySelector('.profile-btn');
    const dropdown = document.querySelector('.dropdown-content');
    if (!profileBtn || !dropdown) return;
    
    let timeoutId;
    
    // Click handler
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown();
    });
    
    // Hover handlers with delay
    profileBtn.addEventListener('mouseenter', function() {
        clearTimeout(timeoutId);
        dropdown.style.display = 'block';
        setTimeout(() => {
            dropdown.style.opacity = '1';
            dropdown.style.transform = 'translateY(0)';
        }, 10);
    });
    
    profileBtn.addEventListener('mouseleave', function() {
        startHideTimer();
    });
    
    dropdown.addEventListener('mouseenter', function() {
        clearTimeout(timeoutId);
    });
    
    dropdown.addEventListener('mouseleave', function() {
        startHideTimer();
    });
    
    function startHideTimer() {
        timeoutId = setTimeout(() => {
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (dropdown.style.opacity === '0') {
                    dropdown.style.display = 'none';
                }
            }, 300);
        }, 300);
    }
    
    function toggleDropdown() {
        const isVisible = dropdown.style.display === 'block' && 
                          dropdown.style.opacity === '1';
        
        if (isVisible) {
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 300);
        } else {
            dropdown.style.display = 'block';
            setTimeout(() => {
                dropdown.style.opacity = '1';
                dropdown.style.transform = 'translateY(0)';
            }, 10);
        }
    }
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target) && e.target !== profileBtn) {
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 300);
        }
    });
}

// Authentication functions (merged from auth.js)
function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (!token || !user) {
        // For demo purposes, we'll allow access without authentication
        // Uncomment the line below to enable authentication
        // window.location.href = '../Login/LogIn.html';
        console.log('No authentication found, allowing demo access');
        return;
    }
    // Optional: Verify token with backend
    // verifyToken(token); // Uncomment if backend is ready
}

// Optionally verify token with backend (disabled by default)
async function verifyToken(token) {
    try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '../Login/LogIn.html';
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        // Network error: keep user logged in for now
    }
}

function loadUserInfo() {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        const userName = document.querySelector('.user-name');
        const userEmail = document.querySelector('.user-email');
        if (userName) userName.textContent = `${userData.firstName} ${userData.lastName}`;
        if (userEmail) userEmail.textContent = userData.email;
    } else {
        // Set default demo user info
        const userName = document.querySelector('.user-name');
        const userEmail = document.querySelector('.user-email');
        if (userName) userName.textContent = 'Demo User';
        if (userEmail) userEmail.textContent = 'demo@shebaexpert.com';
    }
}

function setupLogout() {
    // Find the logout button by Bengali text
    const logoutBtn = Array.from(document.querySelectorAll('.dropdown-item')).find(
        btn => btn.textContent.includes('লগআউট')
    );
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '../Landing Page/LandingPage.html';
}

// Support System Implementation
console.log('🎯 Initializing Support System...');

// Support System State
let supportSystemInitialized = false;
let chatMessages = [];
let supportAnalytics = {
    modalOpened: 0,
    emergencyCalls: 0,
    chatMessages: 0,
    faqViews: 0
};

// Initialize Support System
function initializeSupportSystem() {
    if (supportSystemInitialized) return;
    
    console.log('📋 Setting up support system events...');
    
    // Support Modal Controls
    const helpBtn = document.getElementById('help-btn');
    const supportModal = document.getElementById('support-modal');
    const closeSupportModal = document.getElementById('close-support-modal');
    
    // Help button click handler
    if (helpBtn) {
        helpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSupportModal();
        });
    }
    
    // Close modal handlers
    if (closeSupportModal) {
        closeSupportModal.addEventListener('click', hideSupportModal);
    }
    
    if (supportModal) {
        supportModal.addEventListener('click', (e) => {
            if (e.target === supportModal) {
                hideSupportModal();
            }
        });
    }
    
    // Quick Support Options
    setupQuickSupportOptions();
    
    // FAQ System
    setupFAQSystem();
    
    // Report System
    setupReportSystem();
    
    // Chat Widget
    setupChatWidget();
    
    // Keyboard Shortcuts
    setupKeyboardShortcuts();
    
    // Create floating support button
    createFloatingSupportButton();
    
    // Load analytics from storage
    loadSupportAnalytics();
    
    supportSystemInitialized = true;
    console.log('✅ Support system initialized successfully');
}

// Show Support Modal
function showSupportModal() {
    const modal = document.getElementById('support-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        trackSupportUsage('modal_opened');
        
        // Show notification
        showNotification('সহায়তা কেন্দ্র খোলা হয়েছে', 'success');
    }
}

// Hide Support Modal
function hideSupportModal() {
    const modal = document.getElementById('support-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Also hide chat widget if open
        hideChatWidget();
    }
}

// Enhanced Emergency Call with Location
function makeEmergencyCall(number) {
    trackSupportUsage('emergency_call');
    
    // Get user location if available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Create emergency call with location
                makeEmergencyCallWithLocation(number, lat, lng);
            },
            () => {
                // Fallback to simple call
                makeSimpleEmergencyCall(number);
            }
        );
    } else {
        makeSimpleEmergencyCall(number);
    }
}

// Emergency call with location data
function makeEmergencyCallWithLocation(number, lat, lng) {
    const locationText = `আমার অবস্থান: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    
    // Try to make the call
    const callUrl = `tel:${number}`;
    window.open(callUrl, '_self');
    
    // Show notification with location
    showSupportNotification(
        `জরুরি কল করা হচ্ছে ${number} নম্বরে। ${locationText}`,
        'success'
    );
    
    // Store emergency call details
    const emergencyData = {
        number: number,
        location: { lat, lng },
        timestamp: new Date().toISOString(),
        type: 'emergency_call_with_location'
    };
    
    localStorage.setItem('last_emergency_call', JSON.stringify(emergencyData));
}

// Simple emergency call fallback
function makeSimpleEmergencyCall(number) {
    const callUrl = `tel:${number}`;
    window.open(callUrl, '_self');
    
    showSupportNotification(
        `জরুরি কল করা হচ্ছে ${number} নম্বরে...`,
        'success'
    );
    
    // Store simple emergency call
    const emergencyData = {
        number: number,
        timestamp: new Date().toISOString(),
        type: 'emergency_call_simple'
    };
    
    localStorage.setItem('last_emergency_call', JSON.stringify(emergencyData));
}

// Add floating support button for quick access
function addFloatingSupportButton() {
    // Check if already exists
    if (document.getElementById('floating-support-btn')) return;
    
    const floatingBtn = document.createElement('button');
    floatingBtn.id = 'floating-support-btn';
    floatingBtn.className = 'floating-support-btn';
    floatingBtn.innerHTML = '<i class="fas fa-headset"></i>';
    floatingBtn.title = 'সহায়তা (Ctrl+H)';
    
    floatingBtn.addEventListener('click', showSupportModal);
    
    document.body.appendChild(floatingBtn);
}

// Add notification system for support
function showSupportNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `support-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="close-notification" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Enhanced emergency call with location sharing
function makeEmergencyCallWithLocationOld(number) {
    const confirmation = confirm(`${number} নম্বরে জরুরি কল করতে চান?\n\nআপনার অবস্থান তথ্য শেয়ার করা হবে।`);
    
    if (confirmation) {
        // Try to get current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Store location for emergency services
                    localStorage.setItem('emergency_location', JSON.stringify({
                        lat: lat,
                        lng: lng,
                        timestamp: new Date().toISOString()
                    }));
                    
                    // Make the call
                    window.open(`tel:${number}`, '_self');
                    
                    // Show notification with location info
                    showSupportNotification(
                        `জরুরি কল করা হচ্ছে ${number} নম্বরে। আপনার অবস্থান: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                        'success'
                    );
                },
                function(error) {
                    // Still make the call even if location fails
                    window.open(`tel:${number}`, '_self');
                    showSupportNotification(`${number} নম্বরে কল করা হচ্ছে...`, 'success');
                }
            );
        } else {
            // Geolocation not supported, just make the call
            window.open(`tel:${number}`, '_self');
            showSupportNotification(`${number} নম্বরে কল করা হচ্ছে...`, 'success');
        }
    }
}

// Support system analytics
function trackSupportUsage(action, details = {}) {
    const supportAnalytics = JSON.parse(localStorage.getItem('support_analytics') || '[]');
    
    supportAnalytics.push({
        action: action,
        details: details,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    });
    
    // Keep only last 100 entries
    if (supportAnalytics.length > 100) {
        supportAnalytics.splice(0, supportAnalytics.length - 100);
    }
    
    localStorage.setItem('support_analytics', JSON.stringify(supportAnalytics));
}

// Enhanced support system initialization
function initializeSupportSystem() {
    console.log('🆘 Initializing enhanced support system...');
    
    // Add floating support button
    addFloatingSupportButton();
    
    // Help button click handler
    const helpBtn = document.getElementById('help-btn');
    const supportModal = document.getElementById('support-modal');
    const closeSupportModal = document.getElementById('close-support-modal');
    
    if (helpBtn && supportModal) {
        helpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showSupportModal();
            trackSupportUsage('modal_opened', { source: 'navbar' });
        });
    }
    
    if (closeSupportModal) {
        closeSupportModal.addEventListener('click', hideSupportModal);
    }
    
    // Close modal when clicking outside
    if (supportModal) {
        supportModal.addEventListener('click', function(e) {
            if (e.target === supportModal) {
                hideSupportModal();
            }
        });
    }
    
    // Initialize all components
    initializeFAQ();
    initializeSupportOptions();
    initializeChatWidget();
    initializeReportButtons();
    initializeEmergencyButtons();
    
    // Show welcome message if first visit
    if (!localStorage.getItem('support_tour_shown')) {
        setTimeout(() => {
            showSupportNotification(
                'নতুন সহায়তা সিস্টেম! সাহায্যের জন্য উপরের "সহায়তা" বাটনে ক্লিক করুন বা Ctrl+H চাপুন।',
                'info'
            );
            localStorage.setItem('support_tour_shown', 'true');
        }, 2000);
    }
    
    console.log('✅ Enhanced support system initialized');
}

// Initialize emergency buttons with enhanced functionality
function initializeEmergencyButtons() {
    const emergencyButtons = document.querySelectorAll('.emergency-btn');
    
    emergencyButtons.forEach(button => {
        const originalOnclick = button.getAttribute('onclick');
        if (originalOnclick) {
            // Extract phone number from onclick
            const phoneMatch = originalOnclick.match(/'([^']+)'/);
            if (phoneMatch) {
                const phoneNumber = phoneMatch[1];
                
                // Replace with enhanced function
                button.removeAttribute('onclick');
                button.addEventListener('click', function() {
                    makeEmergencyCallWithLocation(phoneNumber);
                    trackSupportUsage('emergency_call', { number: phoneNumber });
                });
            }
        }
    });
}

// Add emergency quick access (Ctrl/Cmd + E)
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        if (confirm('জরুরি সহায়তা প্রয়োজন? 999 নম্বরে কল করতে চান?')) {
            makeEmergencyCall('999');
        }
    }
});

// Add custom marker styles to the page
const style = document.createElement('style');
style.textContent = `
.custom-marker-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.custom-marker {
    background: linear-gradient(135deg, #004AAD, #00C6FF);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 18px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translate(-50%, -50%);
}

.user-location-container {
    background: transparent !important;
    border: none !important;
}

.user-location-marker {
    position: relative;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(0, 204, 255, 0.5);
    animation: pulse-animation 2s infinite;
}

.user-dot {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #00C6FF;
    box-shadow: 0 0 0 rgba(0, 198, 255, 0.7), 0 0 10px rgba(0, 198, 255, 0.7);
}

@keyframes pulse-animation {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.7;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
`;

// Append styles to head
document.head.appendChild(style);

// Initialize everything when DOM is ready
function initializeAll() {
    console.log('🚀 Initializing all functionality...');
    checkAuthentication();
    loadUserInfo();
    setupLogout();
    setupHomeNavigation();
    initializeLocationButton();
    initializeCategorySelection();
    initializeSearch();
    initializeProfileDropdown();
    initializeSupportSystem();
    initializeFAQ();
    initializeSupportOptions();
    initializeChatWidget();
    initializeReportButtons();
    initializeEmergencyButtons();
    initializeProviderModal();
    // Add support system initialization
    console.log('✅ All initialization complete - Dashboard ready!');
}

function initializeProviderModal() {
    console.log('👥 Initializing provider modal...');

    const providerBtn = document.getElementById('provider-btn');
    const providerModal = document.getElementById('provider-modal');
    const closeProviderModal = document.getElementById('close-provider-modal');

    // Debug logging
    console.log('Provider button found:', providerBtn);
    console.log('Provider modal found:', providerModal);
    console.log('Close button found:', closeProviderModal);

    if (providerBtn && providerModal) {
        providerBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Provider button clicked - showing modal');
            providerModal.style.display = 'block';
            providerModal.classList.add('show');
        });
    } else {
        console.warn('⚠️ Provider button or modal not found!');
    }

    if (closeProviderModal) {
        closeProviderModal.addEventListener('click', function () {
            console.log('Closing provider modal');
            providerModal.style.display = 'none';
            providerModal.classList.remove('show');
        });
    }

    // Close if click outside
    if (providerModal) {
        providerModal.addEventListener('click', function (e) {
            if (e.target === providerModal) {
                console.log('Clicking outside modal - closing');
                providerModal.style.display = 'none';
                providerModal.classList.remove('show');
            }
        });
    }

    // Also handle all links to provider-list.html to show modal instead
    document.querySelectorAll('a[href*="provider-list.html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Provider list link clicked - showing modal instead');
            if (providerModal) {
                providerModal.style.display = 'block';
                providerModal.classList.add('show');
            }
        });
    });

    console.log('✅ Provider modal initialized');
}

// Ensure Home Link Always Works
function setupHomeNavigation() {
    const homeLink = document.getElementById('home-link');
    if (homeLink) {
        // Add multiple event handlers to ensure reliability
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🏠 Home navigation clicked');
            const dashboardUrl = window.location.href.includes('localhost') 
                ? 'http://localhost:8080/Dashboard/dash.html'
                : '/Dashboard/dash.html';
            window.location.href = dashboardUrl;
        });
        
        console.log('✅ Home navigation handler added');
    } else {
        console.warn('⚠️ Home link not found');
    }
    
    // Add keyboard shortcut for home navigation (Ctrl+Home or Alt+H)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey && e.key === 'Home') || (e.altKey && e.key.toLowerCase() === 'h')) {
            e.preventDefault();
            console.log('⌨️ Home keyboard shortcut pressed');
            const dashboardUrl = window.location.href.includes('localhost') 
                ? 'http://localhost:8080/Dashboard/dash.html'
                : '/Dashboard/dash.html';
            window.location.href = dashboardUrl;
        }
    });
}

// Robust initialization
function safeInit() {
    initializeAll();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit);
} else {
    safeInit();
}
window.addEventListener('load', safeInit);

// Always use pulsing marker for user location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
        setUserLocationWithPulse(pos.coords.latitude, pos.coords.longitude);
        showServiceMarkers(currentCategory);
    }, function() {
        setUserLocationWithPulse(userLocation[0], userLocation[1]);
        showServiceMarkers(currentCategory);
    });
} else {
    setUserLocationWithPulse(userLocation[0], userLocation[1]);
    showServiceMarkers(currentCategory);
}