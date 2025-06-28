document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.createElement('div');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.header-left').prepend(mobileMenuBtn);
    
    mobileMenuBtn.addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });

    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-menu li');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the link target
            const target = this.querySelector('a').getAttribute('href').substring(1);
            
            // Load content based on selection
            loadContent(target);
            
            // Close sidebar on mobile after selection
            if (window.innerWidth < 992) {
                document.querySelector('.sidebar').classList.remove('active');
            }
        });
    });

    // Content loader function
    function loadContent(page) {
        const mainContent = document.querySelector('.main-content');
        const headerTitle = document.querySelector('.header-left h2');
        
        // Hide all sections first
        const sections = document.querySelectorAll('.dashboard-content > div');
        sections.forEach(section => {
            section.style.display = 'none';
        });

        switch(page) {
            case 'dashboard':
                headerTitle.textContent = 'ড্যাশবোর্ড';
                showDashboard();
                break;
                
            case 'profile':
                headerTitle.textContent = 'প্রোফাইল';
                showProfile();
                break;
                
            case 'appointment':
                headerTitle.textContent = 'অ্যাপয়েন্টমেন্ট';
                showAppointments();
                break;
                
            case 'message':
                headerTitle.textContent = 'মেসেজ';
                showMessages();
                break;
                
            case 'settings':
                headerTitle.textContent = 'সেটিংস';
                showSettings();
                break;
                
            case 'logout':
                handleLogout();
                break;
                
            default:
                headerTitle.textContent = 'ড্যাশবোর্ড';
                showDashboard();
        }
    }

    // Dashboard content
    function showDashboard() {
        const dashboardContent = document.querySelector('.dashboard-content');
        dashboardContent.innerHTML = `
            <!-- Stats Cards -->
            <div class="stats-cards">
                <div class="card">
                    <div class="card-icon bg-blue">
                        <i class="fas fa-phone"></i>
                    </div>
                    <div class="card-info">
                        <h3>কল রিকুয়েস্ট</h3>
                        <p>১৫</p>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-icon bg-green">
                        <i class="fas fa-comment"></i>
                    </div>
                    <div class="card-info">
                        <h3>মেসেজ</h3>
                        <p>২৩</p>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-icon bg-orange">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="card-info">
                        <h3>রেটিং</h3>
                        <p>৪.৮/৫</p>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-icon bg-purple">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="card-info">
                        <h3>সার্ভিস এরিয়া</h3>
                        <p>৫ টি</p>
                    </div>
                </div>
            </div>
            
            <!-- Main Sections -->
            <div class="main-sections">
                <!-- Notifications Section -->
                <div class="section">
                    <div class="section-header">
                        <h3><i class="fas fa-bell"></i> নোটিফিকেশন</h3>
                        <a href="#" class="see-all">সব দেখুন</a>
                    </div>
                    <div class="notification-list">
                        <div class="notification-item">
                            <div class="notification-icon">
                                <i class="fas fa-comment"></i>
                            </div>
                            <div class="notification-content">
                                <p>রহিম আপনাকে একটি মেসেজ পাঠিয়েছেন</p>
                                <span class="time">১০ মিনিট আগে</span>
                            </div>
                        </div>
                        
                        <div class="notification-item">
                            <div class="notification-icon">
                                <i class="fas fa-phone"></i>
                            </div>
                            <div class="notification-content">
                                <p>করিম আপনাকে কল করেছেন</p>
                                <span class="time">৩০ মিনিট আগে</span>
                            </div>
                        </div>
                        
                        <div class="notification-item">
                            <div class="notification-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="notification-content">
                                <p>আপনি একজন নতুন কাস্টমার থেকে ৫ স্টার রেটিং পেয়েছেন</p>
                                <span class="time">২ ঘন্টা আগে</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Service Areas Section -->
                <div class="section">
                    <div class="section-header">
                        <h3><i class="fas fa-map-marked-alt"></i> সার্ভিস এরিয়া</h3>
                    </div>
                    <div class="service-areas">
                        <div class="area-tag">ঢাকা</div>
                        <div class="area-tag">নারায়ণগঞ্জ</div>
                        <div class="area-tag">গাজীপুর</div>
                        <div class="area-tag">সাভার</div>
                        <div class="area-tag">কেরাণীগঞ্জ</div>
                    </div>
                </div>
            </div>
            
            <!-- Reviews Section -->
            <div class="section full-width">
                <div class="section-header">
                    <h3><i class="fas fa-comment-dots"></i> ব্যবহারকারীদের রিভিউ</h3>
                    <a href="#" class="see-all">সব দেখুন</a>
                </div>
                <div class="reviews">
                    <div class="review-item">
                        <div class="reviewer">
                            <img src="/ShebaXpert/Resources/images/man2.png" alt="ব্যবহারকারী">
                            <div class="reviewer-info">
                                <h4>আব্দুল্লাহ আল মামুন</h4>
                                <div class="rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star-half-alt"></i>
                                    <span>৪.৫</span>
                                </div>
                            </div>
                        </div>
                        <div class="review-text">
                            <p>খুব ভালো সার্ভিস পেয়েছি। সময়মতো কাজ শেষ করেছেন এবং দামও যুক্তিসঙ্গত। পরবর্তীতেও আপনার সেবা নিবো ইনশাআল্লাহ।</p>
                        </div>
                        <div class="review-date">
                            ১০ দিন আগে
                        </div>
                    </div>
                    
                    <div class="review-item">
                        <div class="reviewer">
                            <img src="/ShebaXpert/Resources/images/woman1.jpeg" alt="ব্যবহারকারী">
                            <div class="reviewer-info">
                                <h4>ফারহানা ইয়াসমিন</h4>
                                <div class="rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <span>৫.০</span>
                                </div>
                            </div>
                        </div>
                        <div class="review-text">
                            <p>অসাধারণ কাজ! আমি খুবই সন্তুষ্ট। আপনার কাজের মান এবং আচরণ দুটোই প্রশংসনীয়। সবাইকে আপনার সেবা নেওয়ার পরামর্শ দিবো।</p>
                        </div>
                        <div class="review-date">
                            ৩ দিন আগে
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize dashboard functionality
        initDashboard();
    }

    // Profile content
    function showProfile() {
        const dashboardContent = document.querySelector('.dashboard-content');
        dashboardContent.innerHTML = `
            <div class="profile-section">
                <div class="profile-header">
                    <div class="profile-image">
                        <img src="profile.jpg" alt="প্রোফাইল ছবি">
                        <button class="edit-btn"><i class="fas fa-camera"></i> ছবি পরিবর্তন</button>
                    </div>
                    <div class="profile-info">
                        <h2>আপনার নাম</h2>
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half-alt"></i>
                            <span>৪.৭ (১২৩ রিভিউ)</span>
                        </div>
                        <p class="expert-type">ইলেকট্রিশিয়ান</p>
                    </div>
                </div>
                
                <div class="profile-details">
                    <div class="detail-card">
                        <h3><i class="fas fa-user"></i> ব্যক্তিগত তথ্য</h3>
                        <div class="detail-item">
                            <span class="detail-label">নাম:</span>
                            <span class="detail-value">আপনার নাম</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">ইমেইল:</span>
                            <span class="detail-value">yourname@example.com</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">ফোন:</span>
                            <span class="detail-value">০১৭১২৩৪৫৬৭৮</span>
                        </div>
                        <button class="edit-btn"><i class="fas fa-edit"></i> সম্পাদনা</button>
                    </div>
                    
                    <div class="detail-card">
                        <h3><i class="fas fa-briefcase"></i> পেশাগত তথ্য</h3>
                        <div class="detail-item">
                            <span class="detail-label">পেশা:</span>
                            <span class="detail-value">ইলেকট্রিশিয়ান</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">অভিজ্ঞতা:</span>
                            <span class="detail-value">৫ বছর</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">সার্ভিস এরিয়া:</span>
                            <span class="detail-value">ঢাকা, নারায়ণগঞ্জ, গাজীপুর</span>
                        </div>
                        <button class="edit-btn"><i class="fas fa-edit"></i> সম্পাদনা</button>
                    </div>
                    
                    <div class="detail-card full-width">
                        <h3><i class="fas fa-info-circle"></i> সম্পর্কে</h3>
                        <p>আমি একজন দক্ষ ও প্রশিক্ষিত ইলেকট্রিশিয়ান। ৫ বছরের বেশি অভিজ্ঞতা রয়েছে ঘরোয়া ও বাণিজ্যিক ইলেকট্রিক্যাল কাজে। সৎ ও বিশ্বস্তভাবে কাজ করাই আমার নীতি।</p>
                        <button class="edit-btn"><i class="fas fa-edit"></i> সম্পাদনা</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Appointments content
   function showAppointments() {
    const dashboardContent = document.querySelector('.dashboard-content');
    dashboardContent.innerHTML = `
        <div class="appointments-section">
            <div class="section-header">
                <h2><i class="fas fa-calendar-alt"></i> অ্যাপয়েন্টমেন্ট ব্যবস্থাপনা</h2>
                <div class="header-actions">
                    <div class="filter-container">
                        <select id="appointment-filter" class="filter-select">
                            <option value="all">সব অ্যাপয়েন্টমেন্ট</option>
                            <option value="today">আজকের</option>
                            <option value="upcoming">আসন্ন</option>
                            <option value="completed">সম্পন্ন</option>
                            <option value="cancelled">বাতিল</option>
                        </select>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <button class="btn primary-btn"><i class="fas fa-plus"></i> নতুন অ্যাপয়েন্টমেন্ট</button>
                </div>
            </div>
            
            <div class="appointments-container">
                <div class="appointments-summary">
                    <div class="summary-card">
                        <div class="summary-icon pending">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="summary-info">
                            <h3>মোট অ্যাপয়েন্টমেন্ট</h3>
                            <p>২৫</p>
                        </div>
                    </div>
                    
                    <div class="summary-card">
                        <div class="summary-icon confirmed">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="summary-info">
                            <h3>নিশ্চিতকৃত</h3>
                            <p>১৮</p>
                        </div>
                    </div>
                    
                    <div class="summary-card">
                        <div class="summary-icon completed">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <div class="summary-info">
                            <h3>সম্পন্ন</h3>
                            <p>১৫</p>
                        </div>
                    </div>
                    
                    <div class="summary-card">
                        <div class="summary-icon cancelled">
                            <i class="fas fa-times-circle"></i>
                        </div>
                        <div class="summary-info">
                            <h3>বাতিল</h3>
                            <p>২</p>
                        </div>
                    </div>
                </div>
                
                <div class="appointments-list">
                    <div class="list-header">
                        <div class="header-item">ক্লায়েন্ট</div>
                        <div class="header-item">সেবা</div>
                        <div class="header-item">তারিখ ও সময়</div>
                        <div class="header-item">অবস্থা</div>
                        <div class="header-item">অ্যাকশন</div>
                    </div>
                    
                    <div class="appointment-item confirmed">
                        <div class="client-info">
                            <img src="/ShebaXpert/Resources/images/man1.png" alt="ক্লায়েন্ট">
                            <div>
                                <h4>আব্দুল্লাহ আল মামুন</h4>
                                <p><i class="fas fa-map-marker-alt"></i> মিরপুর, ঢাকা</p>
                            </div>
                        </div>
                        <div class="service-info">
                            <i class="fas fa-bolt"></i>
                            <span>ইলেকট্রিক্যাল মেরামত</span>
                        </div>
                        <div class="time-info">
                            <div class="date">আগামীকাল, ১০:০০ AM</div>
                            <div class="duration"><i class="fas fa-clock"></i> ২ ঘন্টা</div>
                        </div>
                        <div class="status-badge confirmed">
                            <i class="fas fa-check-circle"></i>
                            <span>নিশ্চিতকৃত</span>
                        </div>
                        <div class="action-buttons">
                            <button class="btn action-btn view-btn" title="বিস্তারিত দেখুন"><i class="fas fa-eye"></i></button>
                            <button class="btn action-btn chat-btn" title="চ্যাট করুন"><i class="fas fa-comment"></i></button>
                            <button class="btn action-btn reschedule-btn" title="সময় পরিবর্তন"><i class="fas fa-calendar-alt"></i></button>
                            <button class="btn action-btn cancel-btn" title="বাতিল করুন"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    
                    <div class="appointment-item pending">
                        <div class="client-info">
                            <img src="/ShebaXpert/Resources/images/woman1.jpeg" alt="ক্লায়েন্ট">
                            <div>
                                <h4>ফারহানা ইয়াসমিন</h4>
                                <p><i class="fas fa-map-marker-alt"></i> উত্তরা, ঢাকা</p>
                            </div>
                        </div>
                        <div class="service-info">
                            <i class="fas fa-lightbulb"></i>
                            <span>লাইট ফিক্সিং</span>
                        </div>
                        <div class="time-info">
                            <div class="date">১৫ই জুন, ২:০০ PM</div>
                            <div class="duration"><i class="fas fa-clock"></i> ১ ঘন্টা</div>
                        </div>
                        <div class="status-badge pending">
                            <i class="fas fa-clock"></i>
                            <span>পেন্ডিং</span>
                        </div>
                        <div class="action-buttons">
                            <button class="btn action-btn confirm-btn" title="নিশ্চিত করুন"><i class="fas fa-check"></i></button>
                            <button class="btn action-btn reschedule-btn" title="সময় পরিবর্তন"><i class="fas fa-calendar-alt"></i></button>
                            <button class="btn action-btn cancel-btn" title="বাতিল করুন"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    
                    <div class="appointment-item completed">
                        <div class="client-info">
                            <img src="/ShebaXpert/Resources/images/man2.png" alt="ক্লায়েন্ট">
                            <div>
                                <h4>রহিম উদ্দিন</h4>
                                <p><i class="fas fa-map-marker-alt"></i> ধানমন্ডি, ঢাকা</p>
                            </div>
                        </div>
                        <div class="service-info">
                            <i class="fas fa-fan"></i>
                            <span>ফ্যান ইনস্টলেশন</span>
                        </div>
                        <div class="time-info">
                            <div class="date">১০ই জুন, ১১:০০ AM</div>
                            <div class="duration"><i class="fas fa-clock"></i> ১.৫ ঘন্টা</div>
                        </div>
                        <div class="status-badge completed">
                            <i class="fas fa-check-circle"></i>
                            <span>সম্পন্ন</span>
                        </div>
                        <div class="action-buttons">
                            <button class="btn action-btn review-btn" title="রিভিউ দেখুন"><i class="fas fa-star"></i></button>
                            <button class="btn action-btn invoice-btn" title="ইনভয়েস"><i class="fas fa-file-invoice"></i></button>
                            <button class="btn action-btn repeat-btn" title="পুনরায় বুক করুন"><i class="fas fa-redo"></i></button>
                        </div>
                    </div>
                    
                    <div class="appointment-item cancelled">
                        <div class="client-info">
                            <img src="/ShebaXpert/Resources/images/man3.jpg" alt="ক্লায়েন্ট">
                            <div>
                                <h4>করিম উদ্দিন</h4>
                                <p><i class="fas fa-map-marker-alt"></i> মোহাম্মদপুর, ঢাকা</p>
                            </div>
                        </div>
                        <div class="service-info">
                            <i class="fas fa-plug"></i>
                            <span>সকেট ইনস্টলেশন</span>
                        </div>
                        <div class="time-info">
                            <div class="date">৫ই জুন, ৩:০০ PM</div>
                            <div class="duration"><i class="fas fa-clock"></i> ২ ঘন্টা</div>
                        </div>
                        <div class="status-badge cancelled">
                            <i class="fas fa-times-circle"></i>
                            <span>বাতিল</span>
                        </div>
                        <div class="action-buttons">
                            <button class="btn action-btn reschedule-btn" title="পুনরায় বুক করুন"><i class="fas fa-calendar-alt"></i></button>
                            <button class="btn action-btn delete-btn" title="ডিলিট করুন"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
                
                <div class="pagination">
                    <button class="btn pagination-btn disabled"><i class="fas fa-chevron-left"></i></button>
                    <button class="btn pagination-btn active">1</button>
                    <button class="btn pagination-btn">2</button>
                    <button class="btn pagination-btn">3</button>
                    <button class="btn pagination-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
    `;
}

    // Messages content
   function showMessages() {
    const dashboardContent = document.querySelector('.dashboard-content');
    dashboardContent.innerHTML = `
        <div class="messages-section">
            <div class="section-header">
                <h2><i class="fas fa-comments"></i> মেসেজ</h2>
                <div class="search-container">
                    <input type="text" placeholder="মেসেজ খুঁজুন...">
                    <i class="fas fa-search"></i>
                </div>
            </div>
            
            <div class="messages-container">
                <div class="conversation-list">
                    <div class="conversation-header">
                        <h3>কনভারসেশন</h3>
                        <button class="btn new-chat-btn"><i class="fas fa-plus"></i> নতুন চ্যাট</button>
                    </div>
                    
                    <div class="conversation-search">
                        <input type="text" placeholder="কন্টাক্ট খুঁজুন...">
                        <i class="fas fa-search"></i>
                    </div>
                    
                    <div class="conversation-items">
                        <div class="conversation-item active">
                            <div class="user-avatar">
                                <img src="/ShebaXpert/Resources/images/man3.jpg" alt="ব্যবহারকারী">
                                <span class="online-status"></span>
                            </div>
                            <div class="conversation-info">
                                <div class="user-info">
                                    <h4>আব্দুল্লাহ আল মামুন</h4>
                                    <span class="time">১০:৩০ AM</span>
                                </div>
                                <p class="last-message">আপনি কি আগামীকাল আসবেন?</p>
                                <span class="unread-count">২</span>
                            </div>
                        </div>
                        
                        <div class="conversation-item">
                            <div class="user-avatar">
                                <img src="/ShebaXpert/Resources/images/woman1.jpeg" alt="ব্যবহারকারী">
                                <span class="online-status"></span>
                            </div>
                            <div class="conversation-info">
                                <div class="user-info">
                                    <h4>ফারহানা ইয়াসমিন</h4>
                                    <span class="time">গতকাল</span>
                                </div>
                                <p class="last-message">ধন্যবাদ আপনার সাহায্যের জন্য</p>
                            </div>
                        </div>
                        
                        <div class="conversation-item unread">
                            <div class="user-avatar">
                                <img src="/ShebaXpert/Resources/images/man2.png" alt="ব্যবহারকারী">
                                <span class="online-status online"></span>
                            </div>
                            <div class="conversation-info">
                                <div class="user-info">
                                    <h4>রহিম উদ্দিন</h4>
                                    <span class="time">২ দিন আগে</span>
                                </div>
                                <p class="last-message">আমার ইলেকট্রিক্যাল সমস্যা আছে</p>
                                <span class="unread-count">৫</span>
                            </div>
                        </div>
                        
                        <div class="conversation-item">
                            <div class="user-avatar">
                                <img src="/ShebaXpert/Resources/images/man4.jpeg" alt="ব্যবহারকারী">
                                <span class="online-status"></span>
                            </div>
                            <div class="conversation-info">
                                <div class="user-info">
                                    <h4>করিম উদ্দিন</h4>
                                    <span class="time">৩ দিন আগে</span>
                                </div>
                                <p class="last-message">আমি আপনার সেবা নিতে চাই</p>
                            </div>
                        </div>
                        
                        <div class="conversation-item">
                            <div class="user-avatar">
                                <img src="/ShebaXpert/Resources/images/woman2.png" alt="ব্যবহারকারী">
                                <span class="online-status online"></span>
                            </div>
                            <div class="conversation-info">
                                <div class="user-info">
                                    <h4>সুমাইয়া আক্তার</h4>
                                    <span class="time">১ সপ্তাহ আগে</span>
                                </div>
                                <p class="last-message">আপনার ফোন নম্বরটি দিতে পারবেন?</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="message-view">
                    <div class="message-header">
                        <div class="recipient-info">
                            <div class="user-avatar">
                                <img src="/ShebaXpert/Resources/images/man3.jpg" alt="ব্যবহারকারী">
                                <span class="online-status"></span>
                            </div>
                            <div>
                                <h4>আব্দুল্লাহ আল মামুন</h4>
                                <p class="last-seen">সর্বশেষ দেখা: আজ ১০:১৫ AM</p>
                            </div>
                        </div>
                        <div class="message-actions">
                            <button class="btn action-btn" title="ফোন করুন"><i class="fas fa-phone"></i></button>
                            <button class="btn action-btn" title="ভিডিও কল"><i class="fas fa-video"></i></button>
                            <button class="btn action-btn" title="অ্যাপয়েন্টমেন্ট বুক করুন"><i class="fas fa-calendar-alt"></i></button>
                            <button class="btn action-btn" title="আরো"><i class="fas fa-ellipsis-v"></i></button>
                        </div>
                    </div>
                    
                    <div class="message-history">
                        <div class="date-divider">
                            <span>আজ</span>
                        </div>
                        
                        <div class="message received">
                            <div class="message-content">
                                <p>আসসালামু আলাইকুম, আপনি কি আগামীকাল আসবেন?</p>
                                <span class="time">১০:৩০ AM</span>
                            </div>
                        </div>
                        
                        <div class="message sent">
                            <div class="message-content">
                                <p>ওয়ালাইকুম আসসালাম, হ্যাঁ আমি আসতে পারবো ইনশাআল্লাহ</p>
                                <span class="time">১০:৩২ AM</span>
                                <span class="status"><i class="fas fa-check-double"></i></span>
                            </div>
                        </div>
                        
                        <div class="message received">
                            <div class="message-content">
                                <p>ভালো, কখন আসবেন?</p>
                                <span class="time">১০:৩৩ AM</span>
                            </div>
                        </div>
                        
                        <div class="message sent">
                            <div class="message-content">
                                <p>আমি সকাল ১০টায় আসবো। ঠিকানা এবং ফোন নম্বরটি আবার দিবেন?</p>
                                <span class="time">১০:৩৫ AM</span>
                                <span class="status"><i class="fas fa-check-double"></i></span>
                            </div>
                        </div>
                        
                        <div class="message received">
                            <div class="message-content">
                                <p>মিরপুর ১০, রোড ৮, বাড়ি ১২। ফোন: ০১৭১২৩৪৫৬৭৮</p>
                                <span class="time">১০:৩৬ AM</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="message-input-container">
                        <div class="input-actions">
                            <button class="btn action-btn" title="অ্যাটাচমেন্ট"><i class="fas fa-paperclip"></i></button>
                            <button class="btn action-btn" title="ইমোজি"><i class="far fa-smile"></i></button>
                        </div>
                        <input type="text" placeholder="এখানে মেসেজ লিখুন...">
                        <button class="btn send-btn" title="পাঠান"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

    // Settings content
    function showSettings() {
        const dashboardContent = document.querySelector('.dashboard-content');
        dashboardContent.innerHTML = `
            <div class="settings-section">
                <div class="settings-tabs">
                    <div class="tab active" data-tab="account">অ্যাকাউন্ট সেটিংস</div>
                    <div class="tab" data-tab="notification">নোটিফিকেশন</div>
                    <div class="tab" data-tab="privacy">প্রাইভেসি</div>
                </div>
                
                <div class="settings-content">
                    <div class="tab-content active" id="account">
                        <form class="settings-form">
                            <div class="form-group">
                                <label for="name">নাম</label>
                                <input type="text" id="name" value="আপনার নাম">
                            </div>
                            
                            <div class="form-group">
                                <label for="email">ইমেইল</label>
                                <input type="email" id="email" value="yourname@example.com">
                            </div>
                            
                            <div class="form-group">
                                <label for="phone">ফোন নম্বর</label>
                                <input type="tel" id="phone" value="০১৭১২৩৪৫৬৭৮">
                            </div>
                            
                            <div class="form-group">
                                <label for="profession">পেশা</label>
                                <select id="profession">
                                    <option value="electrician">ইলেকট্রিশিয়ান</option>
                                    <option value="plumber">প্লাম্বার</option>
                                    <option value="ac">এসি টেকনিশিয়ান</option>
                                    <option value="cleaner">ক্লিনার</option>
                                </select>
                            </div>
                            
                            <button type="submit" class="save-btn">সেভ করুন</button>
                        </form>
                    </div>
                    
                    <div class="tab-content" id="notification">
                        <h3>নোটিফিকেশন সেটিংস</h3>
                        <div class="notification-settings">
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>মেসেজ নোটিফিকেশন</h4>
                                    <p>যখন নতুন মেসেজ পাবেন তখন নোটিফিকেশন পাবেন</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" checked>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>কল রিকুয়েস্ট নোটিফিকেশন</h4>
                                    <p>যখন কেউ কল রিকুয়েস্ট করবে তখন নোটিফিকেশন পাবেন</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" checked>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>রিভিউ নোটিফিকেশন</h4>
                                    <p>যখন কেউ রিভিউ দিবে তখন নোটিফিকেশন পাবেন</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" checked>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="privacy">
                        <h3>প্রাইভেসি সেটিংস</h3>
                        <div class="privacy-settings">
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>প্রোফাইল দৃশ্যমানতা</h4>
                                    <p>আপনার প্রোফাইল সবাই দেখতে পারবে কিনা</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" checked>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>ফোন নম্বর দেখান</h4>
                                    <p>আপনার ফোন নম্বর কাস্টমাররা দেখতে পারবে কিনা</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox">
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>ঠিকানা দেখান</h4>
                                    <p>আপনার ঠিকানা কাস্টমাররা দেখতে পারবে কিনা</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox">
                                    <span class="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize tab switching
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const tabId = this.getAttribute('data-tab');
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // Logout handler
    function handleLogout() {
        if (confirm('আপনি কি নিশ্চিতভাবে লগ আউট করতে চান?')) {
            // In a real app, you would redirect to logout URL
            alert('আপনি সফলভাবে লগ আউট হয়েছেন।');
            // window.location.href = 'logout.php';
        }
    }

    // Initialize dashboard functionality
    function initDashboard() {
        // Notification dropdown
        const notification = document.querySelector('.notification');
        if (notification) {
            const notificationDropdown = document.createElement('div');
            notificationDropdown.className = 'notification-dropdown';
            
            const notifications = [
                {
                    icon: 'comment',
                    text: 'নতুন মেসেজ পেয়েছেন',
                    time: '৫ মিনিট আগে'
                },
                {
                    icon: 'phone',
                    text: 'মিসড কল: ০১৭১২৩৪৫৬৭৮',
                    time: '১ ঘন্টা আগে'
                },
                {
                    icon: 'star',
                    text: 'আপনার প্রোফাইলটি ১০০ বার দেখা হয়েছে',
                    time: '৩ ঘন্টা আগে'
                }
            ];
            
            notifications.forEach(notif => {
                const item = document.createElement('div');
                item.className = 'dropdown-item';
                item.innerHTML = `
                    <div class="dropdown-icon">
                        <i class="fas fa-${notif.icon}"></i>
                    </div>
                    <div class="dropdown-content">
                        <p>${notif.text}</p>
                        <span class="dropdown-time">${notif.time}</span>
                    </div>
                `;
                notificationDropdown.appendChild(item);
            });
            
            const seeAll = document.createElement('a');
            seeAll.className = 'dropdown-see-all';
            seeAll.href = '#';
            seeAll.textContent = 'সব নোটিফিকেশন দেখুন';
            notificationDropdown.appendChild(seeAll);
            
            notification.appendChild(notificationDropdown);
            
            notification.addEventListener('click', function(e) {
                e.stopPropagation();
                notificationDropdown.classList.toggle('show');
            });
        }
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function() {
            const dropdowns = document.querySelectorAll('.notification-dropdown, .profile-dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        });
        
        // User profile dropdown
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            const profileDropdown = document.createElement('div');
            profileDropdown.className = 'profile-dropdown';
            
            const profileItems = [
                {icon: 'user', text: 'প্রোফাইল'},
                {icon: 'cog', text: 'সেটিংস'},
                {icon: 'sign-out-alt', text: 'লগ আউট'}
            ];
            
            profileItems.forEach(item => {
                const link = document.createElement('a');
                link.href = '#';
                link.innerHTML = `<i class="fas fa-${item.icon}"></i> ${item.text}`;
                profileDropdown.appendChild(link);
            });
            
            userProfile.appendChild(profileDropdown);
            
            userProfile.addEventListener('click', function(e) {
                e.stopPropagation();
                profileDropdown.classList.toggle('show');
            });
        }
        
        // Simulate data updates
        setInterval(() => {
            const callCount = document.querySelector('.card:nth-child(1) p');
            const messageCount = document.querySelector('.card:nth-child(2) p');
            
            if (callCount && messageCount) {
                const newCallCount = Math.max(0, parseInt(callCount.textContent) + Math.floor(Math.random() * 3) - 1);
                const newMessageCount = Math.max(0, parseInt(messageCount.textContent) + Math.floor(Math.random() * 3) - 1);
                
                callCount.textContent = newCallCount;
                messageCount.textContent = newMessageCount;
                
                // Update notification badge
                const badge = document.querySelector('.badge');
                if (badge) {
                    const totalNotifications = newCallCount + newMessageCount;
                    badge.textContent = totalNotifications > 99 ? '99+' : totalNotifications;
                }
            }
        }, 5000);
    }

    // Initialize with dashboard view
    loadContent('dashboard');
});