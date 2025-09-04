// Reviews page JavaScript functionality

let currentPage = 1;
const itemsPerPage = 6;
let allReviews = [];
let filteredReviews = [];
let currentSort = 'newest';

document.addEventListener('DOMContentLoaded', function() {
    loadAllReviews();
    setupFilters();
    populateCategoryFilter();
});

function loadAllReviews() {
    // Get reviews from localStorage
    const storedReviews = getFromLocalStorage('reviews') || [];
    const storedBusinesses = getFromLocalStorage('businesses') || businesses;
    
    // Combine reviews with business information
    allReviews = storedReviews.map(review => {
        const business = storedBusinesses.find(b => b.id === review.businessId);
        return {
            ...review,
            businessName: business ? business.name : 'Unknown Business',
            businessCategory: business ? business.category : 'Unknown',
            businessImage: business ? business.image : 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg'
        };
    });

    filteredReviews = [...allReviews];
    sortReviews(currentSort);
    displayReviews();
    updateReviewsCount();
}

function setupFilters() {
    // Rating filters
    document.querySelectorAll('input[type="checkbox"][id^="filterRating"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyReviewFilters);
    });

    // Category and date filters
    document.getElementById('filterCategory').addEventListener('change', applyReviewFilters);
    document.getElementById('filterDate').addEventListener('change', applyReviewFilters);
}

function populateCategoryFilter() {
    const categorySelect = document.getElementById('filterCategory');
    categorySelect.innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
}

function applyReviewFilters() {
    const ratingFilters = [];
    const selectedCategory = document.getElementById('filterCategory').value;
    const selectedDateRange = document.getElementById('filterDate').value;

    // Get selected rating filters
    [5, 4, 3, 2, 1].forEach(rating => {
        if (document.getElementById(`filterRating${rating}`).checked) {
            ratingFilters.push(rating);
        }
    });

    // Apply filters
    filteredReviews = allReviews.filter(review => {
        // Rating filter
        const ratingMatch = ratingFilters.length === 0 || ratingFilters.includes(review.rating);
        
        // Category filter
        const categoryMatch = !selectedCategory || review.businessCategory === selectedCategory;
        
        // Date filter
        const dateMatch = !selectedDateRange || isWithinDateRange(review.date, selectedDateRange);

        return ratingMatch && categoryMatch && dateMatch;
    });

    currentPage = 1;
    sortReviews(currentSort);
    displayReviews();
    updateReviewsCount();
}

function clearReviewFilters() {
    // Clear all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset dropdowns
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterDate').value = '';

    filteredReviews = [...allReviews];
    currentPage = 1;
    sortReviews(currentSort);
    displayReviews();
    updateReviewsCount();
}

function sortReviews(sortBy) {
    currentSort = sortBy;
    
    switch (sortBy) {
        case 'newest':
            filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            filteredReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'highest':
            filteredReviews.sort((a, b) => b.rating - a.rating);
            break;
        case 'lowest':
            filteredReviews.sort((a, b) => a.rating - b.rating);
            break;
    }

    currentPage = 1;
    displayReviews();
}

function displayReviews() {
    const reviewsGrid = document.getElementById('reviewsGrid');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageReviews = filteredReviews.slice(startIndex, endIndex);

    if (pageReviews.length === 0) {
        reviewsGrid.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-comments text-muted" style="font-size: 4rem;"></i>
                    <h4 class="mt-3 text-muted">No reviews found</h4>
                    <p class="text-muted">Try adjusting your filters or be the first to write a review!</p>
                    <a href="search.html" class="btn btn-primary">
                        <i class="fas fa-search me-2"></i>Find Businesses to Review
                    </a>
                </div>
            </div>
        `;
        document.getElementById('reviewsPagination').innerHTML = '';
        return;
    }

    reviewsGrid.innerHTML = pageReviews.map(review => `
        <div class="col-lg-6 mb-4">
            <div class="card review-card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="d-flex align-items-center">
                            <img src="${review.businessImage}" alt="${review.businessName}" 
                                 class="rounded-circle me-3" style="width: 50px; height: 50px; object-fit: cover;">
                            <div>
                                <h6 class="fw-bold mb-1">
                                    <a href="business-detail.html?id=${review.businessId}" class="text-decoration-none">
                                        ${review.businessName}
                                    </a>
                                </h6>
                                <span class="badge bg-primary small">${review.businessCategory}</span>
                            </div>
                        </div>
                        <small class="text-muted">${formatDate(review.date)}</small>
                    </div>

                    <div class="reviewer-info mb-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <div class="reviewer-avatar me-2">
                                    <i class="fas fa-user"></i>
                                </div>
                                <span class="fw-semibold">${review.name}</span>
                            </div>
                            <div class="rating">
                                ${generateStars(review.rating)}
                            </div>
                        </div>
                    </div>

                    <p class="card-text">${review.comment}</p>

                    <div class="review-actions mt-auto">
                        <button class="btn btn-outline-primary btn-sm me-2" onclick="showReviewDetail(${review.businessId}, '${review.date}')">
                            <i class="fas fa-eye me-1"></i>View Details
                        </button>
                        <button class="btn btn-outline-secondary btn-sm" onclick="likeReview(${review.businessId}, '${review.date}')">
                            <i class="fas fa-thumbs-up me-1"></i>Helpful
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    generateReviewsPagination();

    // Add animation
    setTimeout(() => {
        reviewsGrid.querySelectorAll('.review-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in-up');
            }, index * 100);
        });
    }, 50);
}

function updateReviewsCount() {
    const reviewsCount = document.getElementById('reviewsCount');
    const total = filteredReviews.length;
    
    if (total === 0) {
        reviewsCount.textContent = 'No reviews found';
    } else if (total === 1) {
        reviewsCount.textContent = '1 review';
    } else {
        reviewsCount.textContent = `${total} reviews`;
    }
}

function generateReviewsPagination() {
    const paginationContainer = document.getElementById('reviewsPagination');
    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHtml = '';

    // Previous button
    paginationHtml += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="goToReviewsPage(${currentPage - 1})">Previous</a>
        </li>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHtml += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="goToReviewsPage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHtml += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }

    // Next button
    paginationHtml += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="goToReviewsPage(${currentPage + 1})">Next</a>
        </li>
    `;

    paginationContainer.innerHTML = paginationHtml;
}

function goToReviewsPage(page) {
    if (page < 1 || page > Math.ceil(filteredReviews.length / itemsPerPage)) {
        return;
    }
    
    currentPage = page;
    displayReviews();
    
    // Scroll to top of results
    document.getElementById('reviewsGrid').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function showReviewDetail(businessId, reviewDate) {
    const review = filteredReviews.find(r => r.businessId === businessId && r.date === reviewDate);
    if (!review) return;

    const modalContent = document.getElementById('reviewDetailContent');
    modalContent.innerHTML = `
        <div class="review-detail">
            <div class="d-flex align-items-center mb-4">
                <img src="${review.businessImage}" alt="${review.businessName}" 
                     class="rounded-circle me-3" style="width: 60px; height: 60px; object-fit: cover;">
                <div>
                    <h5 class="fw-bold mb-1">
                        <a href="business-detail.html?id=${review.businessId}" class="text-decoration-none">
                            ${review.businessName}
                        </a>
                    </h5>
                    <span class="badge bg-primary">${review.businessCategory}</span>
                </div>
            </div>

            <div class="reviewer-section mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="d-flex align-items-center">
                        <div class="reviewer-avatar me-3">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <h6 class="fw-bold mb-0">${review.name}</h6>
                            <small class="text-muted">Reviewed on ${formatDate(review.date)}</small>
                        </div>
                    </div>
                    <div class="rating">
                        ${generateStars(review.rating)}
                    </div>
                </div>
            </div>

            <div class="review-content">
                <h6 class="fw-semibold mb-2">Review</h6>
                <p class="mb-0">${review.comment}</p>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('reviewDetailModal'));
    modal.show();
}

function likeReview(businessId, reviewDate) {
    if (!isLoggedIn()) {
        showToast('Please login to like reviews', 'warning');
        return;
    }

    // In a real app, this would update the database
    showToast('Thank you for your feedback!', 'success');
}

function reportReview() {
    if (!isLoggedIn()) {
        showToast('Please login to report reviews', 'warning');
        return;
    }

    // In a real app, this would submit a report
    showToast('Review reported. We will investigate this matter.', 'info');
    bootstrap.Modal.getInstance(document.getElementById('reviewDetailModal')).hide();
}

function isWithinDateRange(reviewDate, range) {
    const reviewDateTime = new Date(reviewDate);
    const now = new Date();
    
    switch (range) {
        case 'week':
            return (now - reviewDateTime) <= (7 * 24 * 60 * 60 * 1000);
        case 'month':
            return (now - reviewDateTime) <= (30 * 24 * 60 * 60 * 1000);
        case '3months':
            return (now - reviewDateTime) <= (90 * 24 * 60 * 60 * 1000);
        case 'year':
            return (now - reviewDateTime) <= (365 * 24 * 60 * 60 * 1000);
        default:
            return true;
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