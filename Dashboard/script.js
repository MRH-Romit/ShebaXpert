console.log('🚀 ShebaXpert Dashboard Script Loaded - Version 2025-06-02');

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

// Initialize everything when DOM is ready
function initializeAll() {
    console.log('🚀 Initializing all functionality...');
    checkAuthentication();
    loadUserInfo();
    setupLogout();
    initializeLocationButton();
    initializeCategorySelection();
    initializeSearch();
    initializeProfileDropdown();
    initializeSupportSystem(); // Add support system initialization
    console.log('✅ All initialization complete - Dashboard ready!');
}

// Support System Functions
function initializeSupportSystem() {
    console.log('🆘 Initializing support system...');
    
    // Help button click handler
    const helpBtn = document.getElementById('help-btn');
    const supportModal = document.getElementById('support-modal');
    const closeSupportModal = document.getElementById('close-support-modal');
    
    if (helpBtn && supportModal) {
        helpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showSupportModal();
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
    
    // Initialize FAQ functionality
    initializeFAQ();
    
    // Initialize support options
    initializeSupportOptions();
    
    // Initialize chat widget
    initializeChatWidget();
    
    // Initialize report buttons
    initializeReportButtons();
    
    console.log('✅ Support system initialized');
}

function showSupportModal() {
    const supportModal = document.getElementById('support-modal');
    if (supportModal) {
        supportModal.style.display = 'flex';
        setTimeout(() => {
            supportModal.classList.add('show');
        }, 10);
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
    }
}

function hideSupportModal() {
    const supportModal = document.getElementById('support-modal');
    if (supportModal) {
        supportModal.classList.remove('show');
        setTimeout(() => {
            supportModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Emergency call function
function makeEmergencyCall(number) {
    const confirmation = confirm(`${number} নম্বরে জরুরি কল করতে চান?\n\nএই নম্বরটি জরুরি সেবার জন্য ব্যবহার করুন।`);
    if (confirmation) {
        window.open(`tel:${number}`, '_self');
        
        // Show success message
        showLocationToast(`${number} নম্বরে কল করা হচ্ছে...`, 'success');
    }
}

// FAQ functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
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

// Support options functionality
function initializeSupportOptions() {
    // Talk with agent
    const talkWithAgentBtn = document.getElementById('talk-with-agent');
    if (talkWithAgentBtn) {
        talkWithAgentBtn.addEventListener('click', function() {
            hideSupportModal();
            setTimeout(() => {
                showChatWidget();
            }, 300);
        });
    }
    
    // Call support
    const callSupportBtn = document.getElementById('call-support');
    if (callSupportBtn) {
        callSupportBtn.addEventListener('click', function() {
            makeEmergencyCall('+8801700000000');
        });
    }
    
    // WhatsApp support
    const whatsappSupportBtn = document.getElementById('whatsapp-support');
    if (whatsappSupportBtn) {
        whatsappSupportBtn.addEventListener('click', function() {
            const message = encodeURIComponent('আস্সালামু আলাইকুম, আমার সহায়তা প্রয়োজন।');
            window.open(`https://wa.me/8801700000000?text=${message}`, '_blank');
        });
    }
    
    // Email support
    const emailSupportBtn = document.getElementById('email-support');
    if (emailSupportBtn) {
        emailSupportBtn.addEventListener('click', function() {
            const subject = encodeURIComponent('সাপোর্ট অনুরোধ - ShebaXpert');
            const body = encodeURIComponent('আস্সালামু আলাইকুম,\n\nআমার নিম্নলিখিত বিষয়ে সহায়তা প্রয়োজন:\n\n[আপনার সমস্যা এখানে লিখুন]\n\nধন্যবাদ');
            window.open(`mailto:support@shebaexpert.com?subject=${subject}&body=${body}`, '_self');
        });
    }
}

// Chat widget functionality
function initializeChatWidget() {
    const chatWidget = document.getElementById('chat-widget');
    const closeChatBtn = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendMessageBtn = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', hideChatWidget);
    }
    
    if (sendMessageBtn && chatInput) {
        sendMessageBtn.addEventListener('click', sendChatMessage);
        
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}

function showChatWidget() {
    const chatWidget = document.getElementById('chat-widget');
    if (chatWidget) {
        chatWidget.style.display = 'flex';
        setTimeout(() => {
            chatWidget.classList.add('show');
        }, 10);
        
        // Focus on input
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            setTimeout(() => {
                chatInput.focus();
            }, 300);
        }
    }
}

function hideChatWidget() {
    const chatWidget = document.getElementById('chat-widget');
    if (chatWidget) {
        chatWidget.classList.remove('show');
        setTimeout(() => {
            chatWidget.style.display = 'none';
        }, 300);
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    
    // Clear input
    chatInput.value = '';
    
    // Simulate agent response
    setTimeout(() => {
        const responses = [
            'ধন্যবাদ আপনার বার্তার জন্য। আমি আপনার সমস্যা বুঝতে পারছি।',
            'আমি আপনাকে এই বিষয়ে সাহায্য করতে পারি। একটু অপেক্ষা করুন।',
            'আপনার সমস্যার সমাধানের জন্য আমি আমাদের টিমের সাথে যোগাযোগ করছি।',
            'এই সমস্যার জন্য আমাদের একজন এক্সপার্ট টেকনিশিয়ান প্রয়োজন। আমি ব্যবস্থা করছি।',
            'আর কোনো প্রশ্ন থাকলে জানাতে পারেন। আমি এখানে আছি সাহায্যের জন্য।'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage(randomResponse, 'agent');
    }, 1000 + Math.random() * 2000);
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('bn-BD', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    messageDiv.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-time">${timeString}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Report buttons functionality
function initializeReportButtons() {
    const reportButtons = document.querySelectorAll('.report-btn');
    
    reportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reportType = this.classList.contains('service-issue') ? 'সার্ভিস সমস্যা' :
                             this.classList.contains('payment-issue') ? 'পেমেন্ট সমস্যা' :
                             this.classList.contains('provider-issue') ? 'প্রদানকারী অভিযোগ' :
                             'অ্যাপ সমস্যা';
            
            const confirmed = confirm(`${reportType} রিপোর্ট করতে চান?\n\nএই রিপোর্ট আমাদের সাপোর্ট টিমের কাছে পাঠানো হবে।`);
            
            if (confirmed) {
                // Hide support modal
                hideSupportModal();
                
                // Show success message
                showLocationToast(`${reportType} সফলভাবে রিপোর্ট করা হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।`, 'success');
                
                // Optionally open email or show chat
                setTimeout(() => {
                    const subject = encodeURIComponent(`${reportType} - ShebaXpert`);
                    const body = encodeURIComponent(`${reportType} সম্পর্কে বিস্তারিত:\n\n[সমস্যার বিবরণ লিখুন]\n\nতারিখ: ${new Date().toLocaleDateString('bn-BD')}\nসময়: ${new Date().toLocaleTimeString('bn-BD')}`);
                    window.open(`mailto:support@shebaexpert.com?subject=${subject}&body=${body}`, '_self');
                }, 2000);
            }
        });
    });
}

// Keyboard shortcuts for support
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + H to open help
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        showSupportModal();
    }
    
    // ESC to close modals
    if (e.key === 'Escape') {
        const supportModal = document.getElementById('support-modal');
        const chatWidget = document.getElementById('chat-widget');
        
        if (supportModal && supportModal.classList.contains('show')) {
            hideSupportModal();
        } else if (chatWidget && chatWidget.classList.contains('show')) {
            hideChatWidget();
        }
    }
});

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
