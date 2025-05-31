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