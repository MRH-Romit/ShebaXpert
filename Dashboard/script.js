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

// Add sample service providers
const serviceProviders = [
    { name: "ইলেকট্রিশিয়ান", lat: 23.8113, lng: 90.4125, category: "electrician" },
    { name: "প্লাম্বার", lat: 23.8093, lng: 90.4135, category: "plumber" },
    { name: "এসি সার্ভিস", lat: 23.8103, lng: 90.4115, category: "ac" },
    { name: "কার্পেন্টার", lat: 23.8123, lng: 90.4145, category: "carpenter" },
    { name: "পেইন্টিং সার্ভিস", lat: 23.8083, lng: 90.4155, category: "painting" },
    { name: "গৃহস্থালি মেরামত", lat: 23.8133, lng: 90.4105, category: "repair" }
];

// Add markers to map
serviceProviders.forEach(provider => {
    const marker = L.marker([provider.lat, provider.lng]).addTo(map)
        .bindPopup(`<b>${provider.name}</b><br>${provider.category}`);
});

// Dropdown functionality
const dropdownButton = document.querySelector('.dropdown-button');
const dropdownList = document.querySelector('.dropdown-list');
const dropdownItems = document.querySelectorAll('.dropdown-list li');
const dropdownText = dropdownButton.querySelector('span');

dropdownButton.addEventListener('click', () => {
    dropdownList.style.display = dropdownList.style.display === 'block' ? 'none' : 'block';
});

dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
        dropdownText.textContent = item.textContent;
        dropdownList.style.display = 'none';
    });
});

document.addEventListener('click', (event) => {
    if (!dropdownButton.contains(event.target) && !dropdownList.contains(event.target)) {
        dropdownList.style.display = 'none';
    }
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
            L.marker([lat, lon]).addTo(map)
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