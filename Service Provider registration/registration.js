// Service Provider Registration JavaScript
const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('serviceProviderForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
        setupFormValidation();
        setupFileHandlers();
        updateProgress(); // Initial progress calculation
    }
});

function setupFormValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidation);
        input.addEventListener('input', updateProgress);
    });
    
    // Password confirmation validation
    const passwordField = document.querySelector('input[name="password"]');
    const confirmPasswordField = document.querySelector('input[name="confirmPassword"]');
    
    if (passwordField && confirmPasswordField) {
        confirmPasswordField.addEventListener('input', function() {
            if (this.value && passwordField.value !== this.value) {
                this.classList.add('invalid');
                this.classList.remove('valid');
            } else if (this.value && passwordField.value === this.value) {
                this.classList.add('valid');
                this.classList.remove('invalid');
            }
        });
    }
}

function setupFileHandlers() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const label = this.parentElement.querySelector('label');
                if (label) {
                    label.style.color = '#28a745';
                    label.innerHTML = `${label.textContent.split(':')[0]}: ✓ ${file.name}`;
                }
            }
        });
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        return false;
    }
    
    // Phone validation
    if (field.name === 'phone' && value) {
        if (!/^[0-9]{11}$/.test(value)) {
            field.classList.add('invalid');
            field.classList.remove('valid');
            return false;
        }
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            field.classList.add('invalid');
            field.classList.remove('valid');
            return false;
        }
    }
    
    // Password validation
    if (field.name === 'password' && value) {
        if (value.length < 8) {
            field.classList.add('invalid');
            field.classList.remove('valid');
            return false;
        }
    }
    
    field.classList.add('valid');
    field.classList.remove('invalid');
    return true;
}

function clearValidation(e) {
    const field = e.target;
    field.classList.remove('invalid', 'valid');
}

function updateProgress() {
    const formFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    const filledFields = Array.from(formFields).filter(field => {
        if (field.type === 'file') {
            return field.files && field.files.length > 0;
        }
        return field.value.trim() !== '';
    });
    
    const progress = (filledFields.length / formFields.length) * 100;
    const progressBar = document.getElementById('progressBar');
    
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    console.log('Form submission started');
    
    const formData = new FormData(e.target);
    
    // Validate password match
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    console.log('Password validation:', password === confirmPassword);
    
    if (password !== confirmPassword) {
        showMessage('পাসওয়ার্ড মিলছে না', 'error');
        return;
    }

    // Validate required fields
    const requiredFields = ['fullName', 'phone', 'location', 'serviceCategory', 'gender', 'workDescription', 'password'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    
    console.log('Missing fields:', missingFields);
    
    if (missingFields.length > 0) {
        showMessage('সকল প্রয়োজনীয় তথ্য পূরণ করুন', 'error');
        return;
    }

    // Validate phone number (11 digits for Bangladesh)
    const phone = formData.get('phone');
    console.log('Phone validation:', phone, /^[0-9]{11}$/.test(phone));
    
    if (!/^[0-9]{11}$/.test(phone)) {
        showMessage('সঠিক ফোন নম্বর দিন (১১ সংখ্যার)', 'error');
        return;
    }

    // Validate files
    const nidDocument = formData.get('nidDocument');
    const photo = formData.get('photo');
    
    console.log('File validation:', {
        nidDocument: nidDocument ? nidDocument.name : 'missing',
        photo: photo ? photo.name : 'missing'
    });
    
    if (!nidDocument || nidDocument.size === 0) {
        showMessage('জাতীয় পরিচয়পত্র/জন্ম সনদ আপলোড করুন', 'error');
        return;
    }

    if (!photo || photo.size === 0) {
        showMessage('ছবি আপলোড করুন', 'error');
        return;
    }

    try {        
        console.log('Starting API call...');
        
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> নিবন্ধন করা হচ্ছে...';
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
            password: formData.get('password'),
            role: 'service_provider' // Ensure role is set
        };

        console.log('Sending data:', serviceProviderData);

        // Send registration data
        const response = await fetch(`${API_BASE_URL}/auth/register-service-provider`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceProviderData)
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response data:', result);

        if (response.ok) {
            // If user creation successful, upload files
            if (result.user && result.user.id) {
                console.log('User created, uploading files...');
                await uploadFiles(result.user.id, nidDocument, photo);
            }
            
            showMessage('সফলভাবে নিবন্ধন সম্পন্ন হয়েছে! আপনি এখন লগইন করতে পারেন।', 'success');
            
            // Redirect to login page after 3 seconds with service provider parameter
            setTimeout(() => {
                window.location.href = '../Login/LogIn.html?from=service-provider';
            }, 3000);
        } else {
            console.error('Registration failed:', result);
            showMessage(result.message || 'নিবন্ধনে সমস্যা হয়েছে', 'error');
        }

    } catch (error) {
        console.error('Registration error:', error);
        showMessage('সার্ভার সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', 'error');    } finally {
        // Reset button state
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> নিবন্ধন সম্পন্ন করুন';
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