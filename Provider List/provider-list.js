class ProviderListManager {
    constructor() {
        this.providers = [];
        this.filteredProviders = [];
        this.currentPage = 1;
        this.providersPerPage = 9;
        this.selectedProvider = null;
        
        this.init();
    }

    init() {
        this.loadProviders();
        this.setupEventListeners();
    }

    // Load providers from API
    async loadProviders() {
        try {
            this.showLoading();
            
            const response = await fetch('/api/providers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch providers');
            }

            const data = await response.json();
            
            if (data.success) {
                this.providers = data.data.providers;
                this.filteredProviders = [...this.providers];
                this.renderProviders();
                this.renderPagination();
            } else {
                throw new Error(data.message || 'Failed to load providers');
            }
        } catch (error) {
            console.error('Error loading providers:', error);
            // Fallback to sample data if API fails
            this.loadSampleData();
        } finally {
            this.hideLoading();
        }
    }

    // Sample data fallback - replace with actual API calls
    loadSampleData() {
        // Mock data
        this.providers = [
            {
                id: 1,
                name: "মোহাম্মদ করিম",
                category: "ইলেকট্রিশিয়ান",
                location: "ঢাকা",
                rating: 4.8,
                reviewCount: 125,
                description: "১০ বছরের অভিজ্ঞতা সহ দক্ষ ইলেকট্রিশিয়ান। বাড়ি এবং অফিসের সব ধরনের ইলেকট্রিক্যাল কাজ করি।",
                phone: "01711234567",
                email: "karim.electrician@gmail.com",
                photo: "../Resources/images/man1.png",
                isOnline: true,
                completedJobs: 243,
                experience: "১০ বছর",
                priceRange: "৫০০-১৫০০ টাকা",
                workingHours: "সকাল ৮টা - রাত ৮টা",
                specialties: ["ঘরের ওয়্যারিং", "ফ্যান ইন্সটলেশন", "এসি ইনস্টলেশন", "ইলেকট্রিক মিটার"]
            },
            {
                id: 2,
                name: "রহিমা খাতুন",
                category: "পরিচ্ছন্নতাকারী",
                location: "ঢাকা",
                rating: 4.9,
                reviewCount: 89,
                description: "পেশাদার পরিচ্ছন্নতাকারী। বাড়ি, অফিস এবং দোকানের সম্পূর্ণ পরিচ্ছন্নতার কাজ করি।",
                phone: "01812345678",
                email: "rahima.cleaning@gmail.com",
                photo: "../Resources/images/woman1.jpeg",
                isOnline: false,
                completedJobs: 167,
                experience: "৫ বছর",
                priceRange: "৩০০-১০০০ টাকা",
                workingHours: "সকাল ৯টা - সন্ধ্যা ৬টা",
                specialties: ["বাড়ি পরিচ্ছন্নতা", "অফিস ক্লিনিং", "কার্পেট ওয়াশ", "বাথরুম ক্লিনিং"]
            },
            {
                id: 3,
                name: "আবুল হাসান",
                category: "প্লাম্বার",
                location: "চট্টগ্রাম",
                rating: 4.7,
                reviewCount: 156,
                description: "পাইপ লাইন, ওয়াটার ট্যাংক এবং বাথরুমের সব ধরনের প্লাম্বিং কাজে বিশেষজ্ঞ।",
                phone: "01913456789",
                email: "abul.plumber@gmail.com",
                photo: "../Resources/images/man2.png",
                isOnline: true,
                completedJobs: 198,
                experience: "৮ বছর",
                priceRange: "৪০০-১২০০ টাকা",
                workingHours: "২৪ ঘন্টা (জরুরি সেবা)",
                specialties: ["পাইপ মেরামত", "ওয়াটার ট্যাংক", "টয়লেট মেরামত", "ড্রেনেজ"]
            },
            {
                id: 4,
                name: "ফাতেমা বেগম",
                category: "কাঠমিস্ত্রি",
                location: "সিলেট",
                rating: 4.6,
                reviewCount: 78,
                description: "আসবাবপত্র তৈরি এবং মেরামতে দক্ষ। কাঠের সব ধরনের কাজ করি।",
                phone: "01714567890",
                email: "fatema.carpenter@gmail.com",
                photo: "../Resources/images/woman2.png",
                isOnline: true,
                completedJobs: 134,
                experience: "৬ বছর",
                priceRange: "৮০০-২৫০০ টাকা",
                workingHours: "সকাল ৮টা - সন্ধ্যা ৬টা",
                specialties: ["আসবাব মেরামত", "দরজা-জানালা", "কিচেন ক্যাবিনেট", "বুকশেল্ফ"]
            },
            {
                id: 5,
                name: "নাসির উদ্দিন",
                category: "রঙমিস্ত্রি",
                location: "রাজশাহী",
                rating: 4.5,
                reviewCount: 92,
                description: "ঘর এবং বিল্ডিং এর ভিতর ও বাহিরের রং করার কাজে অভিজ্ঞ।",
                phone: "01815678901",
                email: "nasir.painter@gmail.com",
                photo: "../Resources/images/man3.jpg",
                isOnline: false,
                completedJobs: 176,
                experience: "১২ বছর",
                priceRange: "৬০০-২০০০ টাকা",
                workingHours: "সকাল ৭টা - সন্ধ্যা ৭টা",
                specialties: ["দেয়াল পেইন্টিং", "সিলিং পেইন্ট", "গেট পেইন্ট", "ওয়াটারপ্রুফিং"]
            },
            {
                id: 6,
                name: "সালমা আক্তার",
                category: "এসি মেরামত",
                location: "খুলনা",
                rating: 4.8,
                reviewCount: 67,
                description: "এয়ার কন্ডিশনার ইনস্টলেশন, মেরামত এবং সার্ভিসিং এ বিশেষজ্ঞ।",
                phone: "01916789012",
                email: "salma.ac@gmail.com",
                photo: "../Resources/images/user.jpg",
                isOnline: true,
                completedJobs: 89,
                experience: "৪ বছর",
                priceRange: "১০০০-৩০০০ টাকা",
                workingHours: "সকাল ৯টা - রাত ৯টা",
                specialties: ["এসি ইনস্টলেশন", "এসি সার্ভিসিং", "গ্যাস রিফিল", "কম্প্রেসার মেরামত"]
            },
            {
                id: 7,
                name: "জাহাঙ্গীর আলম",
                category: "মেকানিক",
                location: "বরিশাল",
                rating: 4.4,
                reviewCount: 103,
                description: "গাড়ি এবং মোটরসাইকেলের সব ধরনের মেকানিক্যাল সমস্যার সমাধান করি।",
                phone: "01717890123",
                email: "jahangir.mechanic@gmail.com",
                photo: "../Resources/images/man4.jpeg",
                isOnline: true,
                completedJobs: 287,
                experience: "১৫ বছর",
                priceRange: "৭০০-২৫০০ টাকা",
                workingHours: "২৪ ঘন্টা (জরুরি সেবা)",
                specialties: ["ইঞ্জিন মেরামত", "ব্রেক সার্ভিস", "অয়েল চেঞ্জ", "ব্যাটারি সার্ভিস"]
            },
            {
                id: 8,
                name: "রাশেদা খাতুন",
                category: "মালী",
                location: "ঢাকা",
                rating: 4.7,
                reviewCount: 45,
                description: "বাগান পরিচর্যা এবং ল্যান্ডস্কেপিং এ অভিজ্ঞ। গাছপালার যত্ন নিই।",
                phone: "01818901234",
                email: "rasheda.gardener@gmail.com",
                photo: "../Resources/images/user.jpg",
                isOnline: false,
                completedJobs: 78,
                experience: "৭ বছর",
                priceRange: "৪০০-১৫০০ টাকা",
                workingHours: "সকাল ৬টা - সন্ধ্যা ৬টা",
                specialties: ["বাগান পরিচর্যা", "গাছ লাগানো", "লন তৈরি", "ফুলের বাগান"]
            }
        ];

        this.filteredProviders = [...this.providers];
        this.renderProviders();
        this.renderPagination();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.filterProviders();
        });

        // Filter functionality
        const categoryFilter = document.getElementById('categoryFilter');
        const locationFilter = document.getElementById('locationFilter');
        const ratingFilter = document.getElementById('ratingFilter');
        
        categoryFilter.addEventListener('change', () => this.filterProviders());
        locationFilter.addEventListener('change', () => this.filterProviders());
        ratingFilter.addEventListener('change', () => this.filterProviders());

        // Clear filter
        const clearBtn = document.getElementById('clearFilter');
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            categoryFilter.value = '';
            locationFilter.value = '';
            ratingFilter.value = '';
            this.filterProviders();
        });

        // Pagination
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderProviders();
                this.renderPagination();
            }
        });

        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredProviders.length / this.providersPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderProviders();
                this.renderPagination();
            }
        });

        // Modal functionality
        const closeModal = document.getElementById('closeModal');
        const closeMessageModal = document.getElementById('closeMessageModal');
        const modal = document.getElementById('providerModal');
        const messageModal = document.getElementById('messageModal');

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        closeMessageModal.addEventListener('click', () => {
            messageModal.style.display = 'none';
        });

        // Message form
        const sendMessageBtn = document.getElementById('sendMessage');
        const cancelMessageBtn = document.getElementById('cancelMessage');

        sendMessageBtn.addEventListener('click', () => this.sendMessage());
        cancelMessageBtn.addEventListener('click', () => {
            messageModal.style.display = 'none';
        });

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
            if (e.target === messageModal) {
                messageModal.style.display = 'none';
            }
        });
    }

    filterProviders() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;
        const location = document.getElementById('locationFilter').value;
        const rating = document.getElementById('ratingFilter').value;

        this.filteredProviders = this.providers.filter(provider => {
            const matchesSearch = provider.name.toLowerCase().includes(searchTerm) ||
                                provider.description.toLowerCase().includes(searchTerm) ||
                                provider.category.toLowerCase().includes(searchTerm);
            
            const matchesCategory = !category || provider.category === category;
            const matchesLocation = !location || provider.location === location;
            const matchesRating = !rating || provider.rating >= parseFloat(rating);

            return matchesSearch && matchesCategory && matchesLocation && matchesRating;
        });

        this.currentPage = 1;
        this.renderProviders();
        this.renderPagination();
    }

    renderProviders() {
        const grid = document.getElementById('providersGrid');
        const startIndex = (this.currentPage - 1) * this.providersPerPage;
        const endIndex = startIndex + this.providersPerPage;
        const providersToShow = this.filteredProviders.slice(startIndex, endIndex);

        if (providersToShow.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                    <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                    <h3 style="color: #666;">কোন সেবা প্রোভাইডার পাওয়া যায়নি</h3>
                    <p style="color: #999;">অনুসন্ধান বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = providersToShow.map(provider => `
            <div class="provider-card">
                <div class="provider-header">
                    <img src="${provider.photo}" alt="${provider.name}" class="provider-avatar">
                    <div class="provider-info">
                        <h3>${provider.name}</h3>
                        <div class="provider-category">${provider.category}</div>
                        <div class="provider-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${provider.location}
                        </div>
                    </div>
                </div>
                
                <div class="provider-content">
                    <div class="provider-details">
                        <div class="provider-description">
                            ${provider.description}
                        </div>
                        
                        <div class="provider-meta">
                            <div class="provider-rating">
                                <div class="stars">
                                    ${this.generateStars(provider.rating)}
                                </div>
                                <span class="rating-text">${provider.rating} (${provider.reviewCount} রিভিউ)</span>
                            </div>
                            
                            <div class="provider-status">
                                <div class="status-indicator ${provider.isOnline ? 'online' : 'offline'}"></div>
                                <span class="status-text ${provider.isOnline ? 'online' : 'offline'}">
                                    ${provider.isOnline ? 'অনলাইন' : 'অফলাইন'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="provider-actions">
                        <button class="action-btn message-btn" onclick="providerManager.openMessageModal(${provider.id})">
                            <i class="fas fa-comment"></i> মেসেজ
                        </button>
                        <button class="action-btn call-btn" onclick="providerManager.callProvider('${provider.phone}')">
                            <i class="fas fa-phone"></i> কল
                        </button>
                        <button class="action-btn view-btn" onclick="providerManager.viewProvider(${provider.id})">
                            <i class="fas fa-eye"></i> বিস্তারিত
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<i class="fas fa-star star filled"></i>';
            } else if (i === fullStars && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt star filled"></i>';
            } else {
                stars += '<i class="fas fa-star star"></i>';
            }
        }

        return stars;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProviders.length / this.providersPerPage);
        const pageNumbers = document.getElementById('pageNumbers');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;

        let paginationHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                            onclick="providerManager.goToPage(${i})">${i}</button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<span>...</span>';
            }
        }

        pageNumbers.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderProviders();
        this.renderPagination();
    }

    viewProvider(providerId) {
        const provider = this.providers.find(p => p.id === providerId);
        if (!provider) return;

        this.selectedProvider = provider;
        const modal = document.getElementById('providerModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <div class="provider-detail">
                <div class="detail-header">
                    <img src="${provider.photo}" alt="${provider.name}" class="detail-avatar">
                    <div class="detail-info">
                        <h2>${provider.name}</h2>
                        <div class="detail-category">${provider.category}</div>
                        <div class="detail-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${provider.location}
                        </div>
                        <div class="detail-rating">
                            <div class="stars">
                                ${this.generateStars(provider.rating)}
                            </div>
                            <span>${provider.rating} (${provider.reviewCount} রিভিউ)</span>
                        </div>
                    </div>
                </div>

                <div class="detail-stats">
                    <div class="stat-card">
                        <div class="stat-number">${provider.completedJobs}</div>
                        <div class="stat-label">সম্পন্ন কাজ</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${provider.experience}</div>
                        <div class="stat-label">অভিজ্ঞতা</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${provider.priceRange}</div>
                        <div class="stat-label">মূল্য পরিসীমা</div>
                    </div>
                </div>

                <div class="detail-section">
                    <h3>বিবরণ</h3>
                    <p>${provider.description}</p>
                </div>

                <div class="detail-section">
                    <h3>বিশেষত্ব</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${provider.specialties.map(specialty => 
                            `<span style="background: var(--secondary-color); color: white; padding: 5px 10px; border-radius: 15px; font-size: 14px;">${specialty}</span>`
                        ).join('')}
                    </div>
                </div>

                <div class="detail-section">
                    <h3>যোগাযোগের তথ্য</h3>
                    <div class="contact-info">
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>${provider.phone}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>${provider.email}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-clock"></i>
                            <span>${provider.workingHours}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-circle ${provider.isOnline ? 'online' : 'offline'}"></i>
                            <span>${provider.isOnline ? 'এখন অনলাইন' : 'বর্তমানে অফলাইন'}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="action-btn message-btn" onclick="providerManager.openMessageModal(${provider.id})">
                        <i class="fas fa-comment"></i> মেসেজ পাঠান
                    </button>
                    <button class="action-btn call-btn" onclick="providerManager.callProvider('${provider.phone}')">
                        <i class="fas fa-phone"></i> এখনই কল করুন
                    </button>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    openMessageModal(providerId) {
        const provider = this.providers.find(p => p.id === providerId);
        if (!provider) return;

        this.selectedProvider = provider;
        const messageModal = document.getElementById('messageModal');
        const modalTitle = messageModal.querySelector('.modal-header h3');
        
        modalTitle.textContent = `${provider.name} এর কাছে মেসেজ পাঠান`;
        
        // Clear previous message
        document.getElementById('messageSubject').value = '';
        document.getElementById('messageText').value = '';
        
        messageModal.style.display = 'block';
    }

    sendMessage() {
        const subject = document.getElementById('messageSubject').value.trim();
        const message = document.getElementById('messageText').value.trim();

        if (!subject || !message) {
            alert('অনুগ্রহ করে বিষয় এবং মেসেজ লিখুন।');
            return;
        }

        // Show loading
        this.showLoading();

        // Send message via API
        this.sendMessageToProvider(this.selectedProvider.id, subject, message);
    }

    async sendMessageToProvider(providerId, subject, message) {
        try {
            const response = await fetch(`/api/providers/${providerId}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subject,
                    message,
                    senderUserId: 1 // Replace with actual logged-in user ID
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.hideLoading();
                alert(`${this.selectedProvider.name} এর কাছে আপনার মেসেজ পাঠানো হয়েছে।`);
                document.getElementById('messageModal').style.display = 'none';
                
                // Clear form
                document.getElementById('messageSubject').value = '';
                document.getElementById('messageText').value = '';
            } else {
                throw new Error(data.message || 'মেসেজ পাঠাতে সমস্যা হয়েছে');
            }
        } catch (error) {
            this.hideLoading();
            console.error('Error sending message:', error);
            alert('মেসেজ পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        }
    }

    callProvider(phone) {
        if (confirm(`${phone} নম্বরে কল করতে চান?`)) {
            // In a real app, this would initiate a call
            window.open(`tel:${phone}`);
        }
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }
}

// Initialize the provider list manager when the page loads
let providerManager;
document.addEventListener('DOMContentLoaded', () => {
    providerManager = new ProviderListManager();
});

// Service worker registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
