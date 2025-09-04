// Business Detail page JavaScript functionality

let currentBusiness = null;

document.addEventListener('DOMContentLoaded', function() {
    loadBusinessDetail();
    setupReviewForm();
});

function loadBusinessDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const businessId = urlParams.get('id');

    if (!businessId) {
        window.location.href = 'index.html';
        return;
    }

    currentBusiness = getBusinessById(businessId);
    if (!currentBusiness) {
        window.location.href = 'index.html';
        return;
    }

    // Update page elements
    updateBusinessInfo();
    updateContactInfo();
    loadBusinessHours();
    loadBusinessServices();
    loadReviews();
    loadSimilarBusinesses();
    updateBreadcrumb();
}

function updateBusinessInfo() {
    document.getElementById('businessName').textContent = currentBusiness.name;
    document.getElementById('businessCategory').textContent = currentBusiness.category;
    document.getElementById('businessDescription').textContent = currentBusiness.description;
    document.getElementById('businessRating').innerHTML = generateStars(currentBusiness.rating);
    document.getElementById('reviewCount').textContent = `${currentBusiness.reviewCount} reviews`;
    
    // Update page title
    document.title = `${currentBusiness.name} - Nepal Business Directory`;
}

function updateContactInfo() {
    // Phone
    const phoneElement = document.getElementById('businessPhone');
    phoneElement.textContent = currentBusiness.phone;
    phoneElement.href = `tel:${currentBusiness.phone}`;

    // Email
    const emailContainer = document.getElementById('businessEmailContainer');
    if (currentBusiness.email) {
        const emailElement = document.getElementById('businessEmail');
        emailElement.textContent = currentBusiness.email;
        emailElement.href = `mailto:${currentBusiness.email}`;
        emailContainer.style.display = 'flex';
    } else {
        emailContainer.style.display = 'none';
    }

    // Website
    const websiteContainer = document.getElementById('businessWebsiteContainer');
    if (currentBusiness.website) {
        const websiteElement = document.getElementById('businessWebsite');
        websiteElement.textContent = 'Visit Website';
        websiteElement.href = currentBusiness.website;
        websiteContainer.style.display = 'flex';
    } else {
        websiteContainer.style.display = 'none';
    }

    // Address
    document.getElementById('businessAddress').textContent = currentBusiness.address;
}

function loadBusinessHours() {
    const hoursContainer = document.getElementById('businessHours');
    
    if (currentBusiness.hours.open === '24/7') {
        hoursContainer.innerHTML = '<div class="text-success fw-semibold">Open 24/7</div>';
        return;
    }

    const hoursText = `${currentBusiness.hours.open} - ${currentBusiness.hours.close}`;
    const daysText = currentBusiness.hours.days.length === 7 ? 
        'Every day' : 
        currentBusiness.hours.days.join(', ');

    hoursContainer.innerHTML = `
        <div class="fw-semibold text-success">${hoursText}</div>
        <div class="text-muted small">${daysText}</div>
    `;
}

function loadBusinessServices() {
    const servicesContainer = document.getElementById('businessServices');
    
    if (currentBusiness.services && currentBusiness.services.length > 0) {
        servicesContainer.innerHTML = currentBusiness.services.map(service => 
            `<span class="badge bg-light text-dark me-2 mb-2">${service}</span>`
        ).join('');
    } else {
        servicesContainer.innerHTML = '<div class="text-muted">No services listed</div>';
    }
}

function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    const businessReviews = getReviewsByBusinessId(currentBusiness.id);
    
    if (businessReviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-comments text-muted" style="font-size: 3rem;"></i>
                <h5 class="mt-3 text-muted">No reviews yet</h5>
                <p class="text-muted">Be the first to review this business!</p>
            </div>
        `;
        return;
    }

    reviewsList.innerHTML = businessReviews.map(review => `
        <div class="review-item border-bottom pb-3 mb-3">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h6 class="fw-bold mb-1">${review.name}</h6>
                    <div class="rating">
                        ${generateStars(review.rating)}
                    </div>
                </div>
                <small class="text-muted">${new Date(review.date).toLocaleDateString()}</small>
            </div>
            <p class="mb-0">${review.comment}</p>
        </div>
    `).join('');
}

function loadSimilarBusinesses() {
    const similarContainer = document.getElementById('similarBusinesses');
    const similarBusinesses = businesses
        .filter(business => 
            business.categoryId === currentBusiness.categoryId && 
            business.id !== currentBusiness.id
        )
        .slice(0, 3);

    if (similarBusinesses.length === 0) {
        similarContainer.innerHTML = '<div class="text-muted">No similar businesses found</div>';
        return;
    }

    similarContainer.innerHTML = similarBusinesses.map(business => `
        <div class="similar-business mb-3">
            <a href="business-detail.html?id=${business.id}" class="text-decoration-none">
                <div class="d-flex">
                    <img src="${business.image}" alt="${business.name}" 
                         class="rounded me-3" style="width: 60px; height: 60px; object-fit: cover;">
                    <div class="flex-grow-1">
                        <h6 class="fw-bold mb-1">${business.name}</h6>
                        <div class="rating small mb-1">
                            ${generateStars(business.rating)}
                        </div>
                        <small class="text-muted">${business.area}, ${business.city}</small>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

function updateBreadcrumb() {
    const categoryLink = document.getElementById('categoryLink');
    const businessBreadcrumb = document.getElementById('businessBreadcrumb');
    
    categoryLink.textContent = currentBusiness.category;
    categoryLink.href = `category.html?id=${currentBusiness.categoryId}`;
    businessBreadcrumb.textContent = currentBusiness.name;
}

function setupReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    
    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submitReview();
    });

    // Setup star rating interaction
    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    ratingInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateStarDisplay(this.value);
        });
    });
}

function updateStarDisplay(rating) {
    const labels = document.querySelectorAll('.rating-input label');
    labels.forEach((label, index) => {
        const starValue = 5 - index;
        if (starValue <= rating) {
            label.style.color = '#F59E0B';
        } else {
            label.style.color = '#ddd';
        }
    });
}

function submitReview() {
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const name = document.getElementById('reviewerName').value.trim();
    const comment = document.getElementById('reviewText').value.trim();

    if (!rating) {
        alert('Please select a rating');
        return;
    }

    if (!name) {
        alert('Please enter your name');
        return;
    }

    if (!comment) {
        alert('Please write a review');
        return;
    }

    // Create new review
    const newReview = {
        businessId: currentBusiness.id,
        name: name,
        rating: parseInt(rating),
        comment: comment,
        date: new Date().toISOString().split('T')[0]
    };

    // Save review
    const existingReviews = getFromLocalStorage('reviews') || [];
    existingReviews.push(newReview);
    saveToLocalStorage('reviews', existingReviews);

    // Update business rating
    updateBusinessRating(newReview.rating);

    // Reload reviews
    loadReviews();

    // Reset form
    document.getElementById('reviewForm').reset();
    document.querySelectorAll('.rating-input label').forEach(label => {
        label.style.color = '#ddd';
    });

    // Show success message
    showToast('Review submitted successfully!', 'success');
}

function updateBusinessRating(newRating) {
    const existingBusinesses = getFromLocalStorage('businesses') || [];
    const businessIndex = existingBusinesses.findIndex(b => b.id === currentBusiness.id);
    
    if (businessIndex !== -1) {
        const business = existingBusinesses[businessIndex];
        const totalRating = (business.rating * business.reviewCount) + newRating;
        business.reviewCount++;
        business.rating = Math.round((totalRating / business.reviewCount) * 10) / 10;
        
        // Update current business object
        currentBusiness.rating = business.rating;
        currentBusiness.reviewCount = business.reviewCount;
        
        // Save updated businesses
        saveToLocalStorage('businesses', existingBusinesses);
        
        // Update display
        document.getElementById('businessRating').innerHTML = generateStars(business.rating);
        document.getElementById('reviewCount').textContent = `${business.reviewCount} reviews`;
    }
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'primary'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-check-circle me-2"></i>${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    // Add to page
    document.body.appendChild(toast);

    // Show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    // Remove from DOM after hiding
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// Share functionality
function shareBusiness(platform) {
    const url = window.location.href;
    const title = `${currentBusiness.name} - Nepal Business Directory`;
    
    let shareUrl = '';
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
        case 'copy':
            navigator.clipboard.writeText(url).then(() => {
                showToast('Link copied to clipboard!', 'success');
            });
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}