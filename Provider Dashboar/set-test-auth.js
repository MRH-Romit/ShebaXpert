// Copy and paste this in your browser console before accessing pro-dash.html

// Set test user data
const testUser = {
    firstName: "টেস্ট",
    lastName: "ইউজার", 
    email: "test@shebaxpert.com",
    role: "service_provider"
};

const testToken = "test-auth-token-12345";

// Store in localStorage
localStorage.setItem('user', JSON.stringify(testUser));
localStorage.setItem('authToken', testToken);

console.log('Test authentication data set. You can now access pro-dash.html');

// To remove the test data later:
// localStorage.removeItem('user');
// localStorage.removeItem('authToken');
