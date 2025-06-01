// Initialize the map with higher zoom settings
var map = L.map('mapid', {
    center: [23.8103, 90.4125], 
    zoom: 15,  
    maxZoom: 21,
    minZoom: 5,
    zoomControl: false
});

L.control.zoom({
    position: 'bottomright' 
}).addTo(map);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
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
    console.log('Initializing location button...');
    const locationBtn = document.getElementById('show-my-location');
    console.log('Location button found:', locationBtn);
    
    if (locationBtn) {
        console.log('Adding click listener to location button');
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

// Initialize everything when DOM is ready
function initializeAll() {
    console.log('Initializing all functionality...');
    checkAuthentication();
    loadUserInfo();
    setupLogout();
    initializeLocationButton();
    initializeCategorySelection();
    initializeSearch();
    initializeProfileDropdown();
}

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
