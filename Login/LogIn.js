const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// ✅ Keep sign-up/sign-in animation as is
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

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