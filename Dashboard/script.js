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

// Category selection
const categoryItems = document.querySelectorAll('.category-item');
categoryItems.forEach(item => {
    item.addEventListener('click', () => {
        categoryItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        // Here you would filter the map markers by category
    });
});

// Search Location by Name
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
            
            // Move the map to the searched location
            map.setView([lat, lon], 16);
            
            // Add marker at the searched location
            L.marker([lat, lon], {
                icon: createCustomIcon('map-marker-alt')
            }).addTo(map)
                .bindPopup(`📍 <b>${placeName}</b>`)
                .openPopup();
            
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
    
    // Toggle dropdown on click
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isDisplayed = dropdown.style.display === 'block';
        dropdown.style.display = isDisplayed ? 'none' : 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdown.style.display = 'none';
    });
    
    // Prevent dropdown from closing when clicking inside it
    dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
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