const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// ✅ Keep sign-up/sign-in animation as is
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// ✅ Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
    // Sign Up Form Handler
    const signUpForm = document.querySelector('.sign-up-container form');
    if (signUpForm) {
        signUpForm.addEventListener('submit', handleSignUp);
    }

    // Sign In Form Handler
    const signInForm = document.querySelector('.sign-in-container form');
    if (signInForm) {
        signInForm.addEventListener('submit', handleSignIn);
    }
});

// Handle Sign Up
async function handleSignUp(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName') || document.querySelector('input[placeholder="First Name"]').value;
    const lastName = formData.get('lastName') || document.querySelector('input[placeholder="Last Name"]').value;
    const email = formData.get('email') || document.querySelector('.sign-up-container input[type="email"]').value;
    const password = formData.get('password') || document.querySelector('.sign-up-container input[type="password"]').value;
    const phone = formData.get('phone') || document.querySelector('input[placeholder="Phone"]').value;
    
    // Basic validation
    if (!firstName || !lastName || !email || !password || !phone) {
        showMessage('All fields are required', 'error');
        return;
    }

    if (password.length < 8) {
        showMessage('Password must be at least 8 characters long', 'error');
        return;
    }

    try {
        showMessage('Creating account...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password,
                phone,
                role: 'user'
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showMessage('Account created successfully! Please check your email for verification.', 'success');
            
            // Redirect to dashboard or home page after short delay
            setTimeout(() => {
                window.location.href = '../Dashboard/dash.html';
            }, 2000);
        } else {
            showMessage(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('Network error. Please try again.', 'error');
    }
}

// Handle Sign In
async function handleSignIn(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email') || document.querySelector('.sign-in-container input[type="email"]').value;
    const password = formData.get('password') || document.querySelector('.sign-in-container input[type="password"]').value;
    
    // Basic validation
    if (!email || !password) {
        showMessage('Email and password are required', 'error');
        return;
    }

    try {
        showMessage('Signing in...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showMessage('Login successful!', 'success');
            
            // Redirect to dashboard or home page after short delay
            setTimeout(() => {
                window.location.href = '../Dashboard/dash.html';
            }, 1500);
        } else {
            showMessage(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Network error. Please try again.', 'error');
    }
}

// Show message to user
function showMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        word-wrap: break-word;
        ${type === 'success' ? 'background-color: #10b981;' : 
          type === 'error' ? 'background-color: #ef4444;' : 
          'background-color: #3b82f6;'}
    `;
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// ✅ Language Toggle
const languageToggle = document.getElementById('languageToggle');

const translations = {
    en: {
        signupTitle: "Create Account",
        signupSubtitle: "or use your email for registration",
        signupButton: "Sign Up", // Sign Up button stays in Bangla
        signinTitle: "Sign in",
        signinSubtitle: "or use your account",
        signinButton: "Sign In",
        forgotPassword: "Forgot your password?",
        welcomeBack: "Welcome Back!",        welcomeBackText: "To keep connected with us please login with your personal info",
        helloFriend: "Hello, Friend!",
        helloFriendText: "Enter your personal details and start your journey with us",
        footerText: "© 2023 ShebaXpert. All rights reserved"
    },
    bn: {
        signupTitle: "অ্যাকাউন্ট তৈরি করুন",
        signupSubtitle: "নিবন্ধনের জন্য আপনার ইমেল ব্যবহার করুন",
        signupButton: "সাইন আপ",
        signinTitle: "সাইন ইন করুন",
        signinSubtitle: "অথবা আপনার অ্যাকাউন্ট ব্যবহার করুন",
        signinButton: "সাইন ইন",
        forgotPassword: "আপনার পাসওয়ার্ড ভুলে গেছেন?",
        welcomeBack: "ফিরে আসার জন্য স্বাগতম!",
        welcomeBackText: "সংযুক্ত থাকতে দয়া করে আপনার ব্যক্তিগত তথ্য দিয়ে লগইন করুন",        helloFriend: "হ্যালো, বন্ধু!",
        helloFriendText: "আপনার ব্যক্তিগত বিবরণ লিখুন এবং আমাদের সাথে আপনার যাত্রা শুরু করুন",
        footerText: "© ২০২৩ সেবাXpert. সকল স্বত্ব সংরক্ষিত"
    }
};

// ✅ Ensure English is selected by default when the page loads
window.onload = function () {
    languageToggle.checked = true; // English mode is selected
    updateLanguage('en'); // Load English content
    
    // Check URL parameters to determine which form to show
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'signup') {
        // Show sign-up form
        container.classList.add("right-panel-active");
    } else {
        // Default to sign-in form
        container.classList.remove("right-panel-active");
    }
};

// ✅ Toggle language on switch change
languageToggle.addEventListener('change', () => {
    const lang = languageToggle.checked ? 'en' : 'bn'; // Corrected logic
    updateLanguage(lang);
});

// ✅ Function to update text content dynamically
function updateLanguage(lang) {
    document.getElementById('signup-title').textContent = translations[lang].signupTitle;
    document.getElementById('signup-subtitle').textContent = translations[lang].signupSubtitle;
    document.getElementById('signup-button').textContent = translations[lang].signupButton;
    document.getElementById('signin-title').textContent = translations[lang].signinTitle;
    document.getElementById('signin-subtitle').textContent = translations[lang].signinSubtitle;
    document.getElementById('signin-button').textContent = translations[lang].signinButton;
    document.getElementById('forgot-password').textContent = translations[lang].forgotPassword;
    document.getElementById('welcome-back').textContent = translations[lang].welcomeBack;
    document.getElementById('welcome-back-text').textContent = translations[lang].welcomeBackText;
    document.getElementById('hello-friend').textContent = translations[lang].helloFriend;
    document.getElementById('hello-friend-text').textContent = translations[lang].helloFriendText;
    document.getElementById('footer-text').textContent = translations[lang].footerText;
}