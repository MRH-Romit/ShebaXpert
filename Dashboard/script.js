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

// Add sample service providers with custom icons
const serviceProviders = [
    { name: "ইলেকট্রিশিয়ান", lat: 23.8113, lng: 90.4125, category: "electrician", icon: "bolt" },
    { name: "প্লাম্বার", lat: 23.8093, lng: 90.4135, category: "plumber", icon: "faucet" },
    { name: "এসি সার্ভিস", lat: 23.8103, lng: 90.4115, category: "ac", icon: "wind" },
    { name: "কার্পেন্টার", lat: 23.8123, lng: 90.4145, category: "carpenter", icon: "people-carry" },
    { name: "পেইন্টিং সার্ভিস", lat: 23.8083, lng: 90.4155, category: "painting", icon: "paint-roller" },
    { name: "গৃহস্থালি মেরামত", lat: 23.8133, lng: 90.4105, category: "repair", icon: "hammer" }
];

// Create custom icons
function createCustomIcon(iconName) {
    return L.divIcon({
        html: `<div class="custom-marker"><i class="fas fa-${iconName}"></i></div>`,
        iconSize: [40, 40],
        className: 'custom-marker-container'
    });
}

// Add markers to map with custom icons
serviceProviders.forEach(provider => {
    const marker = L.marker([provider.lat, provider.lng], {
        icon: createCustomIcon(provider.icon)
    }).addTo(map)
        .bindPopup(`<b>${provider.name}</b><br>${provider.category}`);
});

// --- Geolocation and dynamic service marker logic ---
let userLocation = [23.8103, 90.4125]; // Default: Dhaka center
let userMarker = null;
let serviceMarkers = [];

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

// Try to get real user location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
        setUserLocation(pos.coords.latitude, pos.coords.longitude);
        showServiceMarkers(currentCategory);
    }, function() {
        // Permission denied or error, use default
        setUserLocation(userLocation[0], userLocation[1]);
        showServiceMarkers(currentCategory);
    });
} else {
    setUserLocation(userLocation[0], userLocation[1]);
    showServiceMarkers(currentCategory);
}

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

let currentCategory = 'electrician'; // Default

function showServiceMarkers(category) {
    clearServiceMarkers();
    const providers = getNearbyProviders(category, userLocation);
    providers.forEach(provider => {
        const marker = L.marker([provider.lat, provider.lng], {
            icon: createCustomIcon(provider.icon)
        }).addTo(map)
            .bindPopup(`<b>${provider.name}</b><br>${category}`);
        serviceMarkers.push(marker);
    });
}

// --- Category selection logic ---
const categoryItems = document.querySelectorAll('.category-item');
const categoryMap = {
    'ইলেকট্রিশিয়ান': 'electrician',
    'প্লাম্বার': 'plumber',
    'এসি সার্ভিস': 'ac',
    'কার্পেন্টার': 'carpenter',
    'পেইন্টিং': 'painting',
    'গৃহস্থালি মেরামত': 'repair'
};
categoryItems.forEach(item => {
    item.addEventListener('click', () => {
        categoryItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const label = item.innerText.trim();
        currentCategory = categoryMap[label] || 'electrician';
        showServiceMarkers(currentCategory);
    });
});

// --- Search Location by Name ---
document.querySelector('.search-button').addEventListener('click', async () => {
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
            alert("কোনো ফলাফল পাওয়া যায়নি!");
        }
    } catch (error) {
        console.error("Error fetching location:", error);
        alert("অনুসন্ধান করতে সমস্যা হচ্ছে!");
    }
});

// Profile dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const profileBtn = document.querySelector('.profile-btn');
    const dropdown = document.querySelector('.dropdown-content');
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
`;
document.head.appendChild(style);