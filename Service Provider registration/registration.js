// Service Provider Registration JavaScript
const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('serviceProviderForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
});

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Validate password match
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
        showMessage('পাসওয়ার্ড মিলছে না', 'error');
        return;
    }

    // Validate required fields
    const requiredFields = ['fullName', 'phone', 'location', 'serviceCategory', 'gender', 'workDescription', 'password'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    
    if (missingFields.length > 0) {
        showMessage('সকল প্রয়োজনীয় তথ্য পূরণ করুন', 'error');
        return;
    }

    // Validate phone number (11 digits for Bangladesh)
    const phone = formData.get('phone');
    if (!/^[0-9]{11}$/.test(phone)) {
        showMessage('সঠিক ফোন নম্বর দিন (১১ সংখ্যার)', 'error');
        return;
    }

    // Validate files
    const nidDocument = formData.get('nidDocument');
    const photo = formData.get('photo');
    
    if (!nidDocument || nidDocument.size === 0) {
        showMessage('জাতীয় পরিচয়পত্র/জন্ম সনদ আপলোড করুন', 'error');
        return;
    }

    if (!photo || photo.size === 0) {
        showMessage('ছবি আপলোড করুন', 'error');
        return;
    }

    try {
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'নিবন্ধন করা হচ্ছে...';
        submitBtn.disabled = true;

        // Convert FormData to regular object for JSON (except files)
        const serviceProviderData = {
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            email: formData.get('email') || null,
            location: formData.get('location'),
            serviceCategory: formData.get('serviceCategory'),
            gender: formData.get('gender'),
            workDescription: formData.get('workDescription'),
            password: formData.get('password')
        };

        // Send registration data
        const response = await fetch(`${API_BASE_URL}/auth/register-service-provider`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceProviderData)
        });

        const result = await response.json();

        if (response.ok) {
            // If user creation successful, upload files
            if (result.user && result.user.id) {
                await uploadFiles(result.user.id, nidDocument, photo);
            }
            
            showMessage('সফলভাবে নিবন্ধন সম্পন্ন হয়েছে! আপনি এখন লগইন করতে পারেন।', 'success');
            
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                window.location.href = '../Login/LogIn.html';
            }, 3000);
        } else {
            showMessage(result.message || 'নিবন্ধনে সমস্যা হয়েছে', 'error');
        }

    } catch (error) {
        console.error('Registration error:', error);
        showMessage('সার্ভার সংযোগে সমস্যা হয়েছে', 'error');
    } finally {
        // Reset button state
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.textContent = 'নিবন্ধন সম্পন্ন করুন';
        submitBtn.disabled = false;
    }
}

async function uploadFiles(userId, nidDocument, photo) {
    try {
        const fileFormData = new FormData();
        fileFormData.append('userId', userId);
        fileFormData.append('nidDocument', nidDocument);
        fileFormData.append('photo', photo);

        const response = await fetch(`${API_BASE_URL}/auth/upload-service-provider-files`, {
            method: 'POST',
            body: fileFormData
        });

        if (!response.ok) {
            console.error('File upload failed');
        }
    } catch (error) {
        console.error('File upload error:', error);
    }
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
        word-wrap: break-word;
    `;

    if (type === 'success') {
        messageDiv.style.background = 'linear-gradient(to right, #4CAF50, #45a049)';
    } else if (type === 'error') {
        messageDiv.style.background = 'linear-gradient(to right, #f44336, #da190b)';
    } else {
        messageDiv.style.background = 'linear-gradient(to right, #2196F3, #0b7dda)';
    }

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(messageDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 5000);
}