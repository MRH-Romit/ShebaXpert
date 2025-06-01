// Dashboard Authentication Check
// Only run after DOM is ready

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupLogout();
    loadUserInfo();
});

function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (!token || !user) {
        window.location.href = '../Login/LogIn.html';
        return;
    }
    // Optional: Verify token with backend
    // verifyToken(token); // Uncomment if backend is ready
}

// Optionally verify token with backend (disabled by default)
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
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '../Login/LogIn.html';
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        // Network error: keep user logged in for now
    }
}

function loadUserInfo() {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        const userName = document.querySelector('.user-name');
        const userEmail = document.querySelector('.user-email');
        if (userName) userName.textContent = `${userData.firstName} ${userData.lastName}`;
        if (userEmail) userEmail.textContent = userData.email;
    }
}

function setupLogout() {
    // Find the logout button by Bengali text
    const logoutBtn = Array.from(document.querySelectorAll('.dropdown-item')).find(
        btn => btn.textContent.includes('লগআউট')
    );
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '../Landing Page/LandingPage.html';
}