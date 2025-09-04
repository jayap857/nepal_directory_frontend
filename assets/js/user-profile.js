// User Profile page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    loadUserReviews();
    setupEditProfile();
});

function loadUserProfile() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
        return;
    }

    // Update profile information
    document.querySelector('h2.fw-bold').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.querySelector('.text-muted').innerHTML = `<i class="fas fa-envelope me-2"></i>${currentUser.email}`;
}

function loadUserReviews() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const container = document.getElementById('userReviewsContainer');
    const storedReviews = getFromLocalStorage('reviews') || [];
    const storedBusinesses = getFromLocalStorage('businesses') || businesses;
    
    // Filter reviews by current user (in a real app, you'd have user IDs)
    const userReviews = storedReviews.filter(review => 
        review.name === `${currentUser.firstName} ${currentUser.lastName}`
    );

    if (userReviews.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <i class="fas fa-comments text-muted" style="font-size: 3rem;"></i>
                <h5 class="mt-3 text-muted">No reviews yet</h5>
                <p class="text-muted">Start reviewing businesses to help others!</p>
                <a href="user-business-review.html" class="btn btn-primary">
                    <i class="fas fa-star me-2"></i>Write Your First Review
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = userReviews.map(review => {
        const business = storedBusinesses.find(b => b.id === review.businessId);
        const businessName = business ? business.name : 'Unknown Business';
        const businessCategory = business ? business.category : 'Unknown';

        return `
            <div class="col-md-6">
                <div class="card shadow-sm p-3 h-100">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h6 class="fw-bold mb-0">
                                <a href="business-detail.html?id=${review.businessId}" class="text-decoration-none">
                                    ${businessName}
                                </a>
                            </h6>
                            <small class="text-muted">${businessCategory}</small>
                        </div>
                        <span class="text-warning">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
                    </div>
                    <p class="text-muted mb-2">${review.comment}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${formatDate(review.date)}</small>
                        <div>
                            <button class="btn btn-sm btn-outline-primary me-2" onclick="editReview(${review.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteReview(${review.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setupEditProfile() {
    document.getElementById('editProfileBtn').addEventListener('click', function() {
        showToast('Profile editing functionality coming soon!', 'info');
    });
}

function editReview(reviewId) {
    showToast('Review editing functionality coming soon!', 'info');
}

function deleteReview(reviewId) {
    if (confirm('Are you sure you want to delete this review?')) {
        const existingReviews = getFromLocalStorage('reviews') || [];
        const updatedReviews = existingReviews.filter(review => review.id !== reviewId);
        saveToLocalStorage('reviews', updatedReviews);
        
        showToast('Review deleted successfully!', 'success');
        loadUserReviews();
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
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