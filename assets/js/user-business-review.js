// User Business Review page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    populateBusinessSelect();
    setupReviewForm();
    loadUserReviews();
});

function populateBusinessSelect() {
    const businessSelect = document.getElementById('businessSelect');
    const storedBusinesses = getFromLocalStorage('businesses') || businesses;
    
    businessSelect.innerHTML = '<option value="">Select a business to review</option>' +
        storedBusinesses.map(business => 
            `<option value="${business.id}">${business.name} - ${business.category}</option>`
        ).join('');
}

function setupReviewForm() {
    const form = document.getElementById('userReviewForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        submitUserReview();
    });
}

function submitUserReview() {
    const name = document.querySelector('input[placeholder="Enter your name"]').value.trim();
    const businessId = document.getElementById('businessSelect').value;
    const rating = document.getElementById('ratingSelect').value;
    const comment = document.getElementById('reviewText').value.trim();
    const imageFiles = document.getElementById('reviewImages').files;

    // Validation
    if (!name) {
        showToast('Please enter your name', 'warning');
        return;
    }

    if (!businessId) {
        showToast('Please select a business', 'warning');
        return;
    }

    if (!rating) {
        showToast('Please select a rating', 'warning');
        return;
    }

    if (!comment) {
        showToast('Please write a review', 'warning');
        return;
    }

    // Create new review
    const newReview = {
        id: Date.now(),
        businessId: parseInt(businessId),
        name: name,
        rating: parseInt(rating),
        comment: comment,
        date: new Date().toISOString().split('T')[0],
        images: [] // In a real app, you'd handle image uploads
    };

    // Save review
    const existingReviews = getFromLocalStorage('reviews') || [];
    existingReviews.push(newReview);
    saveToLocalStorage('reviews', existingReviews);

    // Update business rating
    updateBusinessRating(parseInt(businessId), parseInt(rating));

    // Show success message
    showToast('Review submitted successfully!', 'success');

    // Reset form
    document.getElementById('userReviewForm').reset();

    // Reload reviews display
    loadUserReviews();
}

function updateBusinessRating(businessId, newRating) {
    const existingBusinesses = getFromLocalStorage('businesses') || businesses;
    const businessIndex = existingBusinesses.findIndex(b => b.id === businessId);
    
    if (businessIndex !== -1) {
        const business = existingBusinesses[businessIndex];
        const totalRating = (business.rating * business.reviewCount) + newRating;
        business.reviewCount++;
        business.rating = Math.round((totalRating / business.reviewCount) * 10) / 10;
        
        // Save updated businesses
        saveToLocalStorage('businesses', existingBusinesses);
    }
}

function loadUserReviews() {
    const container = document.getElementById('reviewsContainer');
    const storedReviews = getFromLocalStorage('reviews') || [];
    const storedBusinesses = getFromLocalStorage('businesses') || businesses;
    
    // Get recent reviews (last 6)
    const recentReviews = storedReviews
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);

    if (recentReviews.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <i class="fas fa-comments text-muted" style="font-size: 3rem;"></i>
                <h5 class="mt-3 text-muted">No reviews yet</h5>
                <p class="text-muted">Be the first to submit a review!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = recentReviews.map(review => {
        const business = storedBusinesses.find(b => b.id === review.businessId);
        const businessName = business ? business.name : 'Unknown Business';
        const businessCategory = business ? business.category : 'Unknown';

        return `
            <div class="col-md-6">
                <div class="card shadow-sm p-3 h-100">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h6 class="fw-bold mb-0">${businessName}</h6>
                            <small class="text-muted">${businessCategory}</small>
                        </div>
                        <span class="text-warning">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
                    </div>
                    <p class="text-muted mb-2"><strong>${review.name}:</strong> ${review.comment}</p>
                    <small class="text-muted">${formatDate(review.date)}</small>
                </div>
            </div>
        `;
    }).join('');
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