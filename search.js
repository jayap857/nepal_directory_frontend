// Search page JavaScript functionality

let currentPage = 1;
const itemsPerPage = 6;
let allResults = [];
let filteredResults = [];

document.addEventListener('DOMContentLoaded', function() {
    setupSearchForm();
    loadInitialResults();
    setupFilters();
});

function setupSearchForm() {
    // Populate category dropdown
    const categorySelect = document.getElementById('searchCategory');
    categorySelect.innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchKeyword = urlParams.get('q');
    const searchCategory = urlParams.get('category');
    const searchLocation = urlParams.get('location');

    // Set form values from URL
    if (searchKeyword) {
        document.getElementById('searchKeyword').value = searchKeyword;
    }
    if (searchCategory) {
        document.getElementById('searchCategory').value = searchCategory;
    }
    if (searchLocation) {
        document.getElementById('searchLocation').value = searchLocation;
    }

    // Setup search functionality
    document.getElementById('searchKeyword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performAdvancedSearch();
        }
    });
}

function loadInitialResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('q') || '';
    const categoryId = urlParams.get('category') || '';
    const location = urlParams.get('location') || '';

    allResults = searchBusinesses(keyword, categoryId, location);
    filteredResults = [...allResults];
    displayResults();
    updateResultCount();
}

function performAdvancedSearch() {
    const keyword = document.getElementById('searchKeyword').value.trim();
    const categoryId = document.getElementById('searchCategory').value;
    const location = document.getElementById('searchLocation').value.trim();

    // Update URL with search parameters
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (categoryId) params.set('category', categoryId);
    if (location) params.set('location', location);

    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);

    // Perform search
    allResults = searchBusinesses(keyword, categoryId, location);
    filteredResults = [...allResults];
    currentPage = 1;
    displayResults();
    updateResultCount();
}

function setupFilters() {
    // Rating filters
    document.querySelectorAll('input[type="checkbox"][id^="rating"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // City filters
    document.querySelectorAll('input[type="checkbox"][value]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const ratingFilters = [];
    const cityFilters = [];

    // Get selected rating filters
    if (document.getElementById('rating5').checked) ratingFilters.push(5);
    if (document.getElementById('rating4').checked) ratingFilters.push(4);
    if (document.getElementById('rating3').checked) ratingFilters.push(3);

    // Get selected city filters
    document.querySelectorAll('input[type="checkbox"][value]:checked').forEach(checkbox => {
        cityFilters.push(checkbox.value);
    });

    // Apply filters
    filteredResults = allResults.filter(business => {
        const ratingMatch = ratingFilters.length === 0 || 
            ratingFilters.some(minRating => business.rating >= minRating);
        
        const cityMatch = cityFilters.length === 0 || 
            cityFilters.includes(business.city);

        return ratingMatch && cityMatch;
    });

    currentPage = 1;
    displayResults();
    updateResultCount();
}

function clearFilters() {
    // Clear all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    filteredResults = [...allResults];
    currentPage = 1;
    displayResults();
    updateResultCount();
}

function sortResults(sortBy) {
    switch (sortBy) {
        case 'rating':
            filteredResults.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            filteredResults.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'relevance':
        default:
            // Keep original order for relevance
            break;
    }

    currentPage = 1;
    displayResults();
}

function displayResults() {
    const resultsContainer = document.getElementById('searchResults');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageResults = filteredResults.slice(startIndex, endIndex);

    if (pageResults.length === 0) {
        resultsContainer.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-search text-muted" style="font-size: 4rem;"></i>
                    <h4 class="mt-3 text-muted">No businesses found</h4>
                    <p class="text-muted">Try adjusting your search criteria or filters</p>
                </div>
            </div>
        `;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    resultsContainer.innerHTML = pageResults.map(business => `
        <div class="col-lg-6 mb-4">
            <div class="card business-card h-100">
                <div class="row g-0 h-100">
                    <div class="col-md-4">
                        <img src="${business.image}" class="img-fluid rounded-start h-100" alt="${business.name}" style="object-fit: cover;">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body d-flex flex-column h-100">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title fw-bold mb-0">${business.name}</h5>
                                <span class="badge bg-primary">${business.category}</span>
                            </div>
                            <div class="rating mb-2">
                                ${generateStars(business.rating)}
                                <span class="text-muted ms-2">(${business.reviewCount})</span>
                            </div>
                            <p class="card-text flex-grow-1">${business.description.substring(0, 120)}...</p>
                            <div class="business-info mt-auto">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-map-marker-alt text-primary me-2"></i>
                                    <small class="text-muted">${business.area}, ${business.city}</small>
                                </div>
                                <div class="d-flex align-items-center mb-3">
                                    <i class="fas fa-clock text-primary me-2"></i>
                                    <small class="text-muted">${formatBusinessHours(business.hours)}</small>
                                </div>
                                <a href="business-detail.html?id=${business.id}" class="btn btn-outline-primary w-100">
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    generatePagination();
    
    // Add animation
    setTimeout(() => {
        resultsContainer.querySelectorAll('.business-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in-up');
            }, index * 100);
        });
    }, 50);
}

function updateResultCount() {
    const resultCountElement = document.getElementById('resultCount');
    const total = filteredResults.length;
    
    if (total === 0) {
        resultCountElement.textContent = 'No results found';
    } else if (total === 1) {
        resultCountElement.textContent = '1 business found';
    } else {
        resultCountElement.textContent = `${total} businesses found`;
    }
}

function generatePagination() {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHtml = '';

    // Previous button
    paginationHtml += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="goToPage(${currentPage - 1})">Previous</a>
        </li>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHtml += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHtml += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }

    // Next button
    paginationHtml += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="goToPage(${currentPage + 1})">Next</a>
        </li>
    `;

    paginationContainer.innerHTML = paginationHtml;
}

function goToPage(page) {
    if (page < 1 || page > Math.ceil(filteredResults.length / itemsPerPage)) {
        return;
    }
    
    currentPage = page;
    displayResults();
    
    // Scroll to top of results
    document.getElementById('searchResults').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Global search function for header search
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const keyword = searchInput.value.trim();
    
    if (keyword) {
        window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
    }
}