console.log('🚀 ShebaXpert Profile Script Loaded - Version 2025-06-02');

// Profile data storage (in a real app, this would come from a database)
let profileData = {
    personalInfo: {
        fullName: 'মোহাম্মদ রহিম উদ্দিন',
        nickName: 'রহিম ভাই',
        birthDate: '1985-05-15',
        gender: 'male',
        bio: 'একজন সাধারণ গৃহস্থ, বাড়ির বিভিন্ন সমস্যার জন্য দক্ষ সেবা প্রয়োজন।'
    },
    contactInfo: {
        phone: '01712345678',
        email: 'rahim@example.com',
        address: 'বাড়ি: ১২৩, রোড: ৫, ব্লক: এ, মিরপুর-১০, ঢাকা-১২১৬',
        district: 'dhaka',
        postalCode: '1216'
    },
    preferences: {
        emailNotifications: true,
        smsNotifications: true,
        locationSharing: true,
        language: 'bn'
    },    security: {
        twoFactorAuth: false,
        lastLogin: new Date().toISOString(),
        loginHistory: [
            { date: '2025-06-02T12:30:00Z', ip: '192.168.1.100', device: 'Chrome on Windows' },
            { date: '2025-06-01T15:45:00Z', ip: '192.168.1.100', device: 'Chrome on Windows' },
            { date: '2025-05-30T09:20:00Z', ip: '192.168.1.100', device: 'Firefox on Windows' }
        ]
    }
};

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile page initialized');
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize home navigation
    setupHomeNavigation();
    
    // Initialize photo upload
    initializePhotoUpload();
    
    // Initialize form handlers
    initializeFormHandlers();
    
    // Initialize preferences
    initializePreferences();
    
    // Initialize password form
    initializePasswordForm();
    
    // Load profile data
    loadProfileData();
    
    // Add data export button
    addDataExportButton();
    
    // Initialize service history filter
    initializeServiceFilter();
    
    // Add smooth scrolling for navigation
    addSmoothScrolling();
    
    // Add keyboard navigation support
    addKeyboardNavigation();
    
    // Initialize support modal
    initializeSupportModal();
});

// Navigation functionality
function initializeNavigation() {
    console.log('Initializing navigation...');
    
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.profile-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all nav links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked nav link and corresponding section
            this.classList.add('active');
            const targetSectionElement = document.getElementById(targetSection);
            if (targetSectionElement) {
                targetSectionElement.classList.add('active');
            }
            
            console.log('Switched to section:', targetSection);
        });
    });
}

// Photo upload functionality
function initializePhotoUpload() {
    console.log('Initializing photo upload...');
    
    const profilePhoto = document.querySelector('.profile-photo');
    const photoUpload = document.getElementById('photo-upload');
    const profileImage = document.getElementById('profile-image');
    
    if (profilePhoto && photoUpload) {
        profilePhoto.addEventListener('click', function() {
            photoUpload.click();
        });
        
        photoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    showMessage('অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন।', 'error');
                    return;
                }
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showMessage('ছবির আকার ৫ MB এর চেয়ে ছোট হতে হবে।', 'error');
                    return;
                }
                
                // Create preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImage.src = e.target.result;
                    showMessage('প্রোফাইল ছবি আপডেট হয়েছে।', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Form handling
function initializeFormHandlers() {
    console.log('Initializing form handlers...');
    
    // Add input validation
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Preferences initialization
function initializePreferences() {
    console.log('Initializing preferences...');
    
    const switches = document.querySelectorAll('.switch input[type="checkbox"]');
    switches.forEach(switchElement => {
        switchElement.addEventListener('change', function() {
            const settingName = this.id;
            const isEnabled = this.checked;
            
            // Update preferences data
            if (profileData.preferences.hasOwnProperty(settingName.replace('-', ''))) {
                profileData.preferences[settingName.replace('-', '')] = isEnabled;
            }
            
            console.log(`Preference ${settingName} changed to:`, isEnabled);
            
            // Show feedback
            const settingLabel = this.closest('.preference-item').querySelector('.preference-label span').textContent;
            const message = `${settingLabel} ${isEnabled ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে।`;
            showMessage(message, 'info');
            
            // Auto-save preferences
            setTimeout(() => {
                savePreferences();
            }, 500);
        });
    });
    
    // Language change handler
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            profileData.preferences.language = this.value;
            showMessage('ভাষা সেটিং আপডেট হয়েছে।', 'success');
            savePreferences();
        });
    }
}

// Password form initialization
function initializePasswordForm() {
    console.log('Initializing password form...');
    
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validate passwords
            if (!currentPassword || !newPassword || !confirmPassword) {
                showMessage('সব ফিল্ড পূরণ করুন।', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showMessage('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না।', 'error');
                return;
            }
            
            if (newPassword.length < 6) {
                showMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।', 'error');
                return;
            }
            
            // Simulate password change
            changePassword(currentPassword, newPassword);
        });
    }
}

// Edit/Save functionality
function toggleEdit(sectionId) {
    console.log('Toggling edit for section:', sectionId);
    
    const section = document.getElementById(sectionId);
    const inputs = section.querySelectorAll('input, select, textarea');
    const editBtn = section.querySelector('.edit-btn');
    const formActions = section.querySelector('.form-actions');
    
    // Enable editing
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
        input.style.background = 'white';
    });
      // Hide edit button, show save/cancel buttons
    editBtn.style.display = 'none';
    formActions.classList.remove('hidden');
    formActions.style.display = 'flex';
    
    showMessage('সম্পাদনা মোড সক্রিয় হয়েছে। পরিবর্তন করার পর সংরক্ষণ করুন।', 'info');
}

function saveSection(sectionId) {
    console.log('Saving section:', sectionId);
    
    const section = document.getElementById(sectionId);
    
    // Validate all fields in section
    const inputs = section.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField.call(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showMessage('অনুগ্রহ করে সব ত্রুটি সংশোধন করুন।', 'error');
        return;
    }
    
    // Save data
    if (sectionId === 'personal-info') {
        savePersonalInfo();
    } else if (sectionId === 'contact-info') {
        saveContactInfo();
    }
    
    // Disable editing
    inputs.forEach(input => {
        input.setAttribute('readonly', 'true');
        input.setAttribute('disabled', 'true');
        input.style.background = '#f8fafc';
    });
    
    // Show edit button, hide save/cancel buttons
    const editBtn = section.querySelector('.edit-btn');
    const formActions = section.querySelector('.form-actions');
    editBtn.style.display = 'flex';
    formActions.style.display = 'none';
    
    showMessage('তথ্য সফলভাবে সংরক্ষিত হয়েছে।', 'success');
}

function cancelEdit(sectionId) {
    console.log('Cancelling edit for section:', sectionId);
    
    const section = document.getElementById(sectionId);
    
    // Reload original data
    loadProfileData();
    
    // Disable editing
    const inputs = section.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.setAttribute('readonly', 'true');
        input.setAttribute('disabled', 'true');
        input.style.background = '#f8fafc';
        input.classList.remove('error');
    });
    
    // Show edit button, hide save/cancel buttons
    const editBtn = section.querySelector('.edit-btn');
    const formActions = section.querySelector('.form-actions');
    editBtn.style.display = 'flex';
    formActions.style.display = 'none';
    
    showMessage('পরিবর্তন বাতিল করা হয়েছে।', 'info');
}

// Data loading and saving functions
function loadProfileData() {
    console.log('Loading profile data...');
    
    // Load personal info
    document.getElementById('full-name').value = profileData.personalInfo.fullName;
    document.getElementById('nick-name').value = profileData.personalInfo.nickName;
    document.getElementById('birth-date').value = profileData.personalInfo.birthDate;
    document.getElementById('gender').value = profileData.personalInfo.gender;
    document.getElementById('bio').value = profileData.personalInfo.bio;
    
    // Load contact info
    document.getElementById('phone').value = profileData.contactInfo.phone;
    document.getElementById('email').value = profileData.contactInfo.email;
    document.getElementById('address').value = profileData.contactInfo.address;
    document.getElementById('district').value = profileData.contactInfo.district;
    document.getElementById('postal-code').value = profileData.contactInfo.postalCode;
    
    // Load preferences
    document.getElementById('email-notifications').checked = profileData.preferences.emailNotifications;
    document.getElementById('sms-notifications').checked = profileData.preferences.smsNotifications;
    document.getElementById('location-sharing').checked = profileData.preferences.locationSharing;
    document.getElementById('language').value = profileData.preferences.language;
    
    // Load security settings
    document.getElementById('two-factor-auth').checked = profileData.security.twoFactorAuth;
}

function savePersonalInfo() {
    profileData.personalInfo = {
        fullName: document.getElementById('full-name').value,
        nickName: document.getElementById('nick-name').value,
        birthDate: document.getElementById('birth-date').value,
        gender: document.getElementById('gender').value,
        bio: document.getElementById('bio').value
    };
    
    // Update user name in header
    updateHeaderUserName(profileData.personalInfo.fullName);
    
    console.log('Personal info saved:', profileData.personalInfo);
}

function saveContactInfo() {
    profileData.contactInfo = {
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        district: document.getElementById('district').value,
        postalCode: document.getElementById('postal-code').value
    };
    
    // Update email in header
    updateHeaderUserEmail(profileData.contactInfo.email);
    
    console.log('Contact info saved:', profileData.contactInfo);
}

function savePreferences() {
    console.log('Saving preferences...');
    
    // In a real app, this would send data to the server
    localStorage.setItem('shebaXpertPreferences', JSON.stringify(profileData.preferences));
    
    setTimeout(() => {
        showMessage('পছন্দসমূহ সংরক্ষিত হয়েছে।', 'success');
    }, 300);
}

function changePassword(currentPassword, newPassword) {
    console.log('Changing password...');
    
    // Simulate password change API call
    setTimeout(() => {
        // Clear form
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        showMessage('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।', 'success');
    }, 1000);
}

// Data export functionality
function exportProfileData() {
    const dataToExport = {
        exportDate: new Date().toISOString(),
        ...profileData
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `profile_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showMessage('আপনার প্রোফাইল ডেটা সফলভাবে ডাউনলোড হয়েছে।', 'success');
}

// Add export button functionality
function addDataExportButton() {
    const securitySection = document.querySelector('#security .profile-card');
    if (securitySection) {
        const exportGroup = document.createElement('div');
        exportGroup.className = 'security-group';
        exportGroup.innerHTML = `
            <h4><i class="fas fa-download"></i> ডেটা এক্সপোর্ট</h4>
            <p>আপনার সকল প্রোফাইল তথ্য JSON ফাইল হিসেবে ডাউনলোড করুন।</p>
            <button onclick="exportProfileData()" class="save-btn">
                <i class="fas fa-download"></i> প্রোফাইল ডেটা ডাউনলোড করুন
            </button>
        `;
        securitySection.appendChild(exportGroup);
    }
}

// Add smooth scrolling functionality
function addSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add keyboard navigation support
function addKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Alt + 1-5 for quick navigation to sections
        if (e.altKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const sections = ['personal-info', 'contact-info', 'service-history', 'preferences', 'security'];
            const sectionIndex = parseInt(e.key) - 1;
            
            if (sections[sectionIndex]) {
                const navLink = document.querySelector(`[data-section="${sections[sectionIndex]}"]`);
                if (navLink) {
                    navLink.click();
                }
            }
        }
        
        // Escape key to cancel editing
        if (e.key === 'Escape') {
            const activeEditButtons = document.querySelectorAll('.form-actions:not(.hidden)');
            if (activeEditButtons.length > 0) {
                const section = activeEditButtons[0].closest('.profile-section');
                if (section) {
                    const sectionId = section.id;
                    cancelEdit(sectionId);
                }
            }
        }
    });
}

// Show keyboard shortcuts help
function showKeyboardShortcuts() {
    const shortcuts = `
    কীবোর্ড শর্টকাট:
    Alt + 1: ব্যক্তিগত তথ্য
    Alt + 2: যোগাযোগের তথ্য
    Alt + 3: সার্ভিস ইতিহাস
    Alt + 4: পছন্দসমূহ
    Alt + 5: নিরাপত্তা
    Escape: সম্পাদনা বাতিল
    `;
    
    showMessage(shortcuts, 'info');
}

// Initialize service history filter
function initializeServiceFilter() {
    const filterSelect = document.getElementById('history-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', filterServiceHistory);
        console.log('Service history filter initialized');
    }
}

// Initialize filter when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const historyFilter = document.getElementById('history-filter');
    if (historyFilter) {
        historyFilter.addEventListener('change', filterServiceHistory);
    }
});

// Export functions for global access
window.toggleEdit = toggleEdit;
window.saveSection = saveSection;
window.cancelEdit = cancelEdit;
window.exportProfileData = exportProfileData;

// Support Modal Functionality
function initializeSupportModal() {
    console.log('Initializing support modal...');
    
    const helpBtn = document.getElementById('help-btn');
    const supportModal = document.getElementById('support-modal');
    const closeModalBtn = document.getElementById('close-support-modal');
    
    // Ensure modal is hidden by default
    if (supportModal) {
        supportModal.classList.remove('show');
        supportModal.style.display = 'none';
    }
    
    if (helpBtn && supportModal) {        // Open support modal
        helpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Opening support modal');
            supportModal.style.display = 'flex';
            supportModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
        
        // Close support modal
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                console.log('Closing support modal');
                supportModal.classList.remove('show');
                supportModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        // Close modal when clicking outside
        supportModal.addEventListener('click', function(e) {
            if (e.target === supportModal) {
                console.log('Closing support modal (outside click)');
                supportModal.classList.remove('show');
                supportModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Initialize FAQ toggles
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.parentElement;
                const answer = faqItem.querySelector('.faq-answer');
                const icon = this.querySelector('i.fa-chevron-down');
                
                // Toggle active state
                faqItem.classList.toggle('active');
                
                // Toggle icon rotation
                if (icon) {
                    icon.style.transform = faqItem.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            });
        });
        
        // Initialize support options
        initializeSupportOptions();
        
        // Initialize contact form
        initializeSupportContactForm();
    }
}

function initializeSupportOptions() {
    const supportOptions = document.querySelectorAll('.support-option');
    
    supportOptions.forEach(option => {
        option.addEventListener('click', function() {
            const optionId = this.id;
            
            switch(optionId) {
                case 'talk-with-agent':
                    console.log('Opening chat with agent');
                    // In a real app, this would open a chat widget
                    showNotification('চ্যাট শীঘ্রই উপলব্ধ হবে', 'info');
                    break;
                    
                case 'call-support':
                    console.log('Initiating call to support');
                    window.open('tel:+8801700000000');
                    break;
                    
                case 'whatsapp-support':
                    console.log('Opening WhatsApp');
                    window.open('https://wa.me/8801700000000?text=আসসালামু আলাইকুম, আমার সাহায্য প্রয়োজন');
                    break;
                    
                case 'email-support':
                    console.log('Opening email client');
                    window.open('mailto:support@shebaexpert.com?subject=সহায়তা প্রয়োজন');
                    break;
            }
        });
    });
}

function initializeSupportContactForm() {
    const contactForm = document.getElementById('support-contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const issueType = document.getElementById('issue-type').value;
            const message = document.getElementById('message').value;
            
            if (!issueType || !message.trim()) {
                showNotification('অনুগ্রহ করে সকল ক্ষেত্র পূরণ করুন', 'error');
                return;
            }
            
            // Simulate form submission
            console.log('Submitting support request:', { issueType, message });
            
            // Show success message
            showNotification('আপনার বার্তা পাঠানো হয়েছে। শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।', 'success');
            
            // Reset form
            contactForm.reset();
              // Close modal after a delay
            setTimeout(() => {
                const supportModal = document.getElementById('support-modal');
                if (supportModal) {
                    supportModal.classList.remove('show');
                    supportModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }, 2000);
        });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Ensure Home Link Always Works (same as dashboard)
function setupHomeNavigation() {
    const homeLink = document.getElementById('home-link');
    if (homeLink) {
        // Add multiple event handlers to ensure reliability
        homeLink.addEventListener('click', function(e) {
            console.log('🏠 Home link clicked from Profile page');
            
            // Always prevent default and force navigation to dashboard
            e.preventDefault();
            
            console.log('🔄 Navigating to dashboard from Profile page');
            
            // Use multiple fallback methods
            const dashboardUrl = window.location.href.includes('localhost') 
                ? 'http://localhost:8080/Dashboard/dash.html'
                : '/Dashboard/dash.html';
            
            window.location.href = dashboardUrl;
        });
        
        // Add backup handler for double-click
        homeLink.addEventListener('dblclick', function(e) {
            e.preventDefault();
            console.log('🏠 Home link double-clicked from Profile - forcing navigation');
            const dashboardUrl = window.location.href.includes('localhost') 
                ? 'http://localhost:8080/Dashboard/dash.html'
                : '/Dashboard/dash.html';
            window.location.href = dashboardUrl;
        });
        
        console.log('✅ Profile Home navigation handler added');
    } else {
        console.warn('⚠️ Home link not found in Profile page');
    }
    
    // Add keyboard shortcut for home navigation (Ctrl+Home or Alt+H)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey && e.key === 'Home') || (e.altKey && e.key.toLowerCase() === 'h')) {
            e.preventDefault();
            console.log('⌨️ Home keyboard shortcut pressed from Profile');
            const dashboardUrl = window.location.href.includes('localhost') 
                ? 'http://localhost:8080/Dashboard/dash.html'
                : '/Dashboard/dash.html';
            window.location.href = dashboardUrl;
        }
    });
}

setupHomeNavigation();
