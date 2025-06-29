// ShebaXpert Authentication System
const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', function() {
    // Check URL parameters for signup mode
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'signup') {
        document.getElementById('container').classList.add('right-panel-active');
    }

    // Sign Up Form Handler
    const signUpForm = document.querySelector('.sign-up-container form');
    if (signUpForm) {
        signUpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const userData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                password: formData.get('password'),
                phone: formData.get('phone')
            };

            // Validation
            if (!userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.phone) {
                showMessage('All fields are required', 'error');
                return;
            }
            
            if (userData.password.length < 8) {
                showMessage('Password must be at least 8 characters long', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    showMessage('Account created! Redirecting...', 'success');
                    setTimeout(() => { window.location.href = '../Dashboard/dash.html'; }, 1200);
                } else {
                    showMessage(data.message || 'Registration failed', 'error');
                }
            } catch (error) {
                showMessage('Network error. Please try again.', 'error');
            }
        });
    }

    // Sign In Form Handler
    const signInForm = document.querySelector('.sign-in-container form');
    if (signInForm) {
        signInForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const credentials = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            if (!credentials.email || !credentials.password) {
                showMessage('Email and password are required', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    showMessage('Login successful! Redirecting...', 'success');
                    setTimeout(() => { window.location.href = '../Dashboard/dash.html'; }, 1000);
                } else {
                    showMessage(data.message || 'Login failed', 'error');
                }
            } catch (error) {
                showMessage('Network error. Please try again.', 'error');
            }
        });
    }

    // Toggle between login and signup forms
    const signUpBtn = document.getElementById('signUp');
    const signInBtn = document.getElementById('signIn');
    
    if (signUpBtn) {
        signUpBtn.addEventListener('click', function() {
            document.getElementById('container').classList.add('right-panel-active');
        });
    }
    
    if (signInBtn) {
        signInBtn.addEventListener('click', function() {
            document.getElementById('container').classList.remove('right-panel-active');
        });
    }
});

function showMessage(message, type) {
    const existing = document.querySelector('.auth-message');
    if (existing) existing.remove();
    
    const div = document.createElement('div');
    div.className = `auth-message ${type}`;
    div.textContent = message;
    div.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 20px;
        background: #fff;
        border-radius: 5px;
        z-index: 9999;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        color: #222;
        font-weight: bold;
    `;
    
    if (type === 'error') {
        div.style.background = '#ffeaea';
        div.style.color = '#b00';
    }
    if (type === 'success') {
        div.style.background = '#eaffea';
        div.style.color = '#080';
    }
    
    document.body.appendChild(div);
    setTimeout(() => { div.remove(); }, 3000);
}

// Language switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const languageToggle = document.getElementById('languageToggle');
    
    // Language content object
    const languageContent = {
        en: {
            'signup-title': 'Create Account',
            'signup-subtitle': 'or use your email for registration',
            'signup-button': 'Sign Up',
            'signin-title': 'Sign in',
            'signin-subtitle': 'or use your account',
            'signin-button': 'Sign In',
            'welcome-back': 'Welcome Back!',
            'welcome-back-text': 'To keep connected with us please login with your personal info',
            'hello-friend': 'Hello, Friend!',
            'hello-friend-text': 'Enter your personal details and start your journey with us',
            'forgot-password': 'Forgot your password?',
            'footer-text': '© 2023 ShebaXpert. All rights reserved',
            'back-btn-text': 'Home Page'
        },
        bn: {
            'signup-title': 'অ্যাকাউন্ট তৈরি করুন',
            'signup-subtitle': 'অথবা রেজিস্ট্রেশনের জন্য আপনার ইমেইল ব্যবহার করুন',
            'signup-button': 'সাইন আপ',
            'signin-title': 'সাইন ইন',
            'signin-subtitle': 'অথবা আপনার অ্যাকাউন্ট ব্যবহার করুন',
            'signin-button': 'সাইন ইন',
            'welcome-back': 'স্বাগতম!',
            'welcome-back-text': 'আমাদের সাথে যুক্ত থাকতে আপনার ব্যক্তিগত তথ্য দিয়ে লগইন করুন',
            'hello-friend': 'হ্যালো বন্ধু!',
            'hello-friend-text': 'আপনার ব্যক্তিগত তথ্য দিন এবং আমাদের সাথে যাত্রা শুরু করুন',
            'forgot-password': 'পাসওয়ার্ড ভুলে গেছেন?',
            'footer-text': '© ২০২৩ শেবাXpert। সকল অধিকার সংরক্ষিত',
            'back-btn-text': 'মূল পৃষ্ঠা'
        }
    };
    
    // Placeholder translations
    const placeholderTranslations = {
        en: {
            'firstName': 'First Name',
            'lastName': 'Last Name',
            'email': 'Email',
            'phone': 'Phone Number',
            'password': 'Password'
        },
        bn: {
            'firstName': 'প্রথম নাম',
            'lastName': 'শেষ নাম',
            'email': 'ইমেইল',
            'phone': 'ফোন নম্বর',
            'password': 'পাসওয়ার্ড'
        }
    };
    
    // Initialize with current state (default is Bengali)
    let currentLanguage = languageToggle && languageToggle.checked ? 'en' : 'bn';
    
    // Apply language on page load
    applyLanguage(currentLanguage);
    
    // Language toggle event listener
    if (languageToggle) {
        languageToggle.addEventListener('change', function() {
            currentLanguage = this.checked ? 'en' : 'bn';
            applyLanguage(currentLanguage);
            
            // Store language preference
            localStorage.setItem('preferredLanguage', currentLanguage);
        });
    }
    
    // Function to apply language changes
    function applyLanguage(lang) {
        // Update text content
        Object.keys(languageContent[lang]).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (id === 'back-btn-text') {
                    // Update back button text
                    const backBtnSpan = document.querySelector('.back-btn span');
                    if (backBtnSpan) {
                        backBtnSpan.textContent = languageContent[lang][id];
                    }
                } else {
                    element.textContent = languageContent[lang][id];
                }
            }
        });
        
        // Update placeholders
        Object.keys(placeholderTranslations[lang]).forEach(name => {
            const inputs = document.querySelectorAll(`input[name="${name}"]`);
            inputs.forEach(input => {
                input.placeholder = placeholderTranslations[lang][name];
            });
        });
        
        // Update document language attribute
        document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
        
        // Update page title
        document.title = lang === 'bn' ? 'লগইন - শেবাXpert' : 'Login - ShebaXpert';
    }
    
    // Check for stored language preference
    const storedLanguage = localStorage.getItem('preferredLanguage');
    if (storedLanguage && storedLanguage !== currentLanguage) {
        if (languageToggle) {
            languageToggle.checked = storedLanguage === 'en';
            currentLanguage = storedLanguage;
            applyLanguage(currentLanguage);
        }
    }
});