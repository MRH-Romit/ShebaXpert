document.addEventListener('DOMContentLoaded', function() {
    // Toggle mobile menu
    const mobileMenuBtn = document.createElement('div');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.header-left').prepend(mobileMenuBtn);
    
    mobileMenuBtn.addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });
    
    // Notification dropdown
    const notification = document.querySelector('.notification');
    const notificationDropdown = document.createElement('div');
    notificationDropdown.className = 'notification-dropdown';
    
    // Sample notification items
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
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        notificationDropdown.classList.remove('show');
    });
    
    // User profile dropdown
    const userProfile = document.querySelector('.user-profile');
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
    
    // Active nav item
    const navItems = document.querySelectorAll('.nav-menu li');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add some animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate__animated', 'animate__fadeInUp');
    });
    
    // Add animation to notification items
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('animate__animated', 'animate__fadeIn');
    });
});

// Add some sample data updates
setInterval(() => {
    const callCount = document.querySelector('.card:nth-child(1) p');
    const messageCount = document.querySelector('.card:nth-child(2) p');
    
    // Randomly update counts for demo purposes
    const newCallCount = Math.max(0, parseInt(callCount.textContent) + Math.floor(Math.random() * 3) - 1);
    const newMessageCount = Math.max(0, parseInt(messageCount.textContent) + Math.floor(Math.random() * 3) - 1);
    
    callCount.textContent = newCallCount;
    messageCount.textContent = newMessageCount;
    
    // Update notification badge
    const badge = document.querySelector('.badge');
    const totalNotifications = newCallCount + newMessageCount;
    badge.textContent = totalNotifications > 99 ? '99+' : totalNotifications;
}, 5000);