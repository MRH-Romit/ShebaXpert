// ShebaXpert Authentication System
const API_BASE_URL = 'http://localhost:5000/api';

// Global variables
let selectedRole = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check URL parameters for signup mode
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'signup') {
        document.getElementById('container').classList.add('right-panel-active');
    }

    // Initialize event listeners
    initializeEventListeners();
});

function initializeEventListeners() {
    // Sign Up Form Handler (User Registration)
    const userSignUpForm = document.getElementById('user-signup-form');
    if (userSignUpForm) {
        userSignUpForm.addEventListener('submit', handleUserSignUp);
    }

    // Sign In Form Handler
    const signInForm = document.getElementById('signin-form');
    if (signInForm) {
        signInForm.addEventListener('submit', handleSignIn);
    }    // Initialize role toggle switch
    initializeRoleToggle();

    // Panel switching
    document.getElementById('signUp').addEventListener('click', () => {
        // Redirect to role selection page instead of showing inline form
        window.location.href = 'role-selection.html';
    });

    document.getElementById('signIn').addEventListener('click', () => {
        document.getElementById('container').classList.remove("right-panel-active");
    });
}

// Role Selection Functions
function selectRole(role) {
    selectedRole = role;
    
    if (role === 'user') {
        showUserSignUpForm();
    } else if (role === 'provider') {
        // Redirect to service provider registration page
        window.location.href = '../Service Provider registration/registration.html';
    }
}

function showRoleSelection() {
    document.getElementById('role-selection').style.display = 'flex';
    document.getElementById('user-signup-form').style.display = 'none';
}

function showUserSignUpForm() {
    document.getElementById('role-selection').style.display = 'none';
    document.getElementById('user-signup-form').style.display = 'block';
}

function goBackToRoleSelection() {
    showRoleSelection();
    selectedRole = null;
}

// User Sign Up Handler
async function handleUserSignUp(e) {
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

// Sign In Handler
async function handleSignIn(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const roleToggle = document.getElementById('roleToggle');
    const selectedRole = roleToggle.checked ? 'service_provider' : 'user';
    
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        role: selectedRole
    };

    // Validation
    if (!loginData.email || !loginData.password) {
        showMessage('Email and password are required', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect based on user role
            setTimeout(() => {
                if (data.user.role === 'service_provider') {
                    window.location.href = '../Dashboard/dash.html'; // Service provider dashboard
                } else {
                    window.location.href = '../Dashboard/dash.html'; // User dashboard
                }
            }, 1500);
        } else {
            showMessage(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Network error. Please try again.', 'error');
    }
}

// Initialize role toggle switch
function initializeRoleToggle() {
    const roleToggle = document.getElementById('roleToggle');
    if (roleToggle) {
        // Set default state (unchecked = user, checked = service_provider)
        roleToggle.checked = false;
        
        // Add change event listener for debugging/feedback
        roleToggle.addEventListener('change', function() {
            const selectedRole = this.checked ? 'service_provider' : 'user';
            console.log('Role switched to:', selectedRole);
        });
    }
}

// Utility Functions
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    if (type === 'success') {
        messageDiv.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (type === 'error') {
        messageDiv.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
    } else {
        messageDiv.style.background = 'linear-gradient(135deg, #2196F3, #0b7dda)';
    }
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);