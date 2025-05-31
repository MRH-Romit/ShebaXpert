// Dashboard Authentication Check
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupLogout();
    loadUserInfo();
});

function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        // Redirect to login if not authenticated
        window.location.href = '../Login/LogIn.html';
        return;
    }
    
    // Optional: Verify token with backend
    verifyToken(token);
}

async function verifyToken(token) {
    try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            // Token is invalid, redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '../Login/LogIn.html';
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        // Network error, but keep user logged in for now
    }
}

function loadUserInfo() {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        
        // Update user info in dropdown
        const userName = document.querySelector('.user-name');
        const userEmail = document.querySelector('.user-email');
        
        if (userName) {
            userName.textContent = `${userData.firstName} ${userData.lastName}`;
        }
        if (userEmail) {
            userEmail.textContent = userData.email;
        }
    }
}

function setupLogout() {
    const logoutBtn = document.querySelector('.dropdown-item[href="#"]:last-child');
    if (logoutBtn && logoutBtn.textContent.includes('লগআউট')) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

function logout() {
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to landing page
    window.location.href = '../Landing Page/LandingPage.html';
}