// Authentication JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    updateAuthNavigation();
    
    // Setup forms based on current page
    if (document.getElementById('registerForm')) {
        setupRegisterForm();
    }
    if (document.getElementById('loginForm')) {
        setupLoginForm();
    }
    if (document.getElementById('forgotPasswordForm')) {
        setupForgotPasswordForm();
    }
});

function updateAuthNavigation() {
    const authNav = document.getElementById('authNav');
    const currentUser = getCurrentUser();
    
    if (!authNav) return;
    
    if (currentUser) {
        authNav.innerHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user me-1"></i>${currentUser.firstName} ${currentUser.lastName}
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="profile.html"><i class="fas fa-user me-2"></i>Profile</a></li>
                    <li><a class="dropdown-item" href="my-reviews.html"><i class="fas fa-star me-2"></i>My Reviews</a></li>
                    ${currentUser.userType === 'business_owner' ? '<li><a class="dropdown-item" href="my-businesses.html"><i class="fas fa-store me-2"></i>My Businesses</a></li>' : ''}
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                </ul>
            </li>
        `;
    } else {
        authNav.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="login.html">Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="register.html">Register</a>
            </li>
        `;
    }
}

function setupRegisterForm() {
    const form = document.getElementById('registerForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        if (validateRegisterForm() && form.checkValidity()) {
            registerUser();
        } else {
            form.classList.add('was-validated');
        }
    });

    // Real-time validation
    document.getElementById('confirmPassword').addEventListener('input', validatePasswordMatch);
    document.getElementById('password').addEventListener('input', validatePasswordMatch);
    document.getElementById('email').addEventListener('blur', checkEmailExists);
}

function setupLoginForm() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            loginUser();
        } else {
            form.classList.add('was-validated');
        }
    });
}

function setupForgotPasswordForm() {
    const form = document.getElementById('forgotPasswordForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        resetPassword();
    });
}

function validateRegisterForm() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        document.getElementById('confirmPassword').setCustomValidity('Passwords do not match');
        return false;
    } else {
        document.getElementById('confirmPassword').setCustomValidity('');
    }
    
    return true;
}

function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (confirmPassword && password !== confirmPassword) {
        document.getElementById('confirmPassword').setCustomValidity('Passwords do not match');
    } else {
        document.getElementById('confirmPassword').setCustomValidity('');
    }
}

function checkEmailExists() {
    const email = document.getElementById('email').value.trim();
    const users = getFromLocalStorage('users') || [];
    
    if (users.find(user => user.email === email)) {
        document.getElementById('email').setCustomValidity('Email already exists');
        showToast('Email already registered. Please use a different email or sign in.', 'warning');
    } else {
        document.getElementById('email').setCustomValidity('');
    }
}

function registerUser() {
    const formData = {
        id: Date.now(),
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        password: document.getElementById('password').value,
        userType: document.getElementById('userType').value,
        createdAt: new Date().toISOString(),
        isActive: true
    };

    // Get existing users
    const users = getFromLocalStorage('users') || [];
    
    // Check if email already exists
    if (users.find(user => user.email === formData.email)) {
        showToast('Email already registered. Please use a different email.', 'error');
        return;
    }

    // Add new user
    users.push(formData);
    
    if (saveToLocalStorage('users', users)) {
        showSuccessModal();
    } else {
        showToast('Registration failed. Please try again.', 'error');
    }
}

function loginUser() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const users = getFromLocalStorage('users') || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        if (!user.isActive) {
            showToast('Account is deactivated. Please contact support.', 'error');
            return;
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        saveToLocalStorage('users', users);

        // Set current user session
        const sessionData = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userType: user.userType,
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };

        if (rememberMe) {
            saveToLocalStorage('currentUser', sessionData);
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
        }

        showToast('Login successful! Welcome back.', 'success');
        
        // Redirect after short delay
        setTimeout(() => {
            const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
            window.location.href = redirectUrl;
        }, 1500);
    } else {
        showToast('Invalid email or password. Please try again.', 'error');
        document.getElementById('loginForm').classList.add('was-validated');
    }
}

function resetPassword() {
    const email = document.getElementById('resetEmail').value.trim();
    const users = getFromLocalStorage('users') || [];
    const user = users.find(u => u.email === email);

    if (user) {
        // In a real app, this would send an email
        showToast('Password reset link sent to your email!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal')).hide();
    } else {
        showToast('Email not found. Please check your email address.', 'error');
    }
}

function socialLogin(provider) {
    // Simulate social login
    showToast(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not available in demo mode.`, 'info');
}

function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    showToast('Logged out successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function getCurrentUser() {
    // Check localStorage first (remember me), then sessionStorage
    let userData = getFromLocalStorage('currentUser');
    if (!userData) {
        try {
            userData = JSON.parse(sessionStorage.getItem('currentUser'));
        } catch (error) {
            return null;
        }
    }
    
    return userData;
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function requireAuth() {
    if (!isLoggedIn()) {
        const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `login.html?redirect=${currentUrl}`;
        return false;
    }
    return true;
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(inputId + 'Toggle');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
    }
}

function showSuccessModal() {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-white border-0`;
    toast.setAttribute('role', 'alert');
    
    // Set background color based on type
    const bgClass = {
        'success': 'bg-success',
        'error': 'bg-danger',
        'warning': 'bg-warning',
        'info': 'bg-primary'
    }[type] || 'bg-primary';
    
    toast.classList.add(bgClass);
    
    // Set icon based on type
    const icon = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    }[type] || 'fa-info-circle';

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas ${icon} me-2"></i>${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    // Add to container
    toastContainer.appendChild(toast);

    // Show toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: type === 'error' ? 5000 : 3000
    });
    bsToast.show();

    // Remove from DOM after hiding
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// Initialize auth state on page load
function initializeAuth() {
    updateAuthNavigation();
}

// Call initialize auth
initializeAuth();