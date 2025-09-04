// Category page JavaScript functionality

let currentPage = 1;
const itemsPerPage = 6;
let categoryBusinesses = [];
let currentCategory = null;

document.addEventListener('DOMContentLoaded', function() {
    loadCategoryData();
});

function loadCategoryData() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');

    if (!categoryId) {
        window.location.href = 'categories.html';
        return;
    }

    currentCategory = getCategoryById(categoryId);
    if (!currentCategory) {
        window.location.href = 'categories.html';
        return;
    }

    // Update page elements
    document.getElementById('categoryBreadcrumb').textContent = currentCategory.name;
    document.getElementById('categoryTitle').textContent = currentCategory.name;
    document.getElementById('categoryDescription').textContent = currentCategory.description;
    document.getElementById('categoryIcon').innerHTML = `<i class="${currentCategory.icon}"></i>`;

    // Load businesses in this category
    categoryBusinesses = getBusinessesByCategory(categoryId);
    displayCategoryResults();
    updateBusinessCount();
}

function displayCategoryResults() {
    const resultsContainer = document.getElementById('categoryResults');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageResults = categoryBusinesses.slice(startIndex, endIndex);

    if (pageResults.length === 0) {
        resultsContainer.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-store text-muted" style="font-size: 4rem;"></i>
                    <h4 class="mt-3 text-muted">No businesses found</h4>
                    <p class="text-muted">Be the first to add a business in this category!</p>
                    <a href="add-business.html" class="btn btn-primary">
                        <i class="fas fa-plus me-2"></i>Add Business
                    </a>
                </div>
            </div>
        `;
        document.getElementById('categoryPagination').innerHTML = '';
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
                            <h5 class="card-title fw-bold mb-2">${business.name}</h5>
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
                                <div class="d-flex gap-2">
                                    <a href="business-detail.html?id=${business.id}" class="btn btn-primary flex-grow-1">
                                        View Details
                                    </a>
                                    <button class="btn btn-outline-primary" onclick="callBusiness('${business.phone}')">
                                        <i class="fas fa-phone"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    generateCategoryPagination();

    // Add animation
    setTimeout(() => {
        resultsContainer.querySelectorAll('.business-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in-up');
            }, index * 100);
        });
    }, 50);
}

function updateBusinessCount() {
    const businessCount = document.getElementById('businessCount');
    const total = categoryBusinesses.length;
    
    if (total === 0) {
        businessCount.textContent = 'No businesses in this category';
    } else if (total === 1) {
        businessCount.textContent = '1 business';
    } else {
        businessCount.textContent = `${total} businesses`;
    }
}

function generateCategoryPagination() {
    const paginationContainer = document.getElementById('categoryPagination');
    const totalPages = Math.ceil(categoryBusinesses.length / itemsPerPage);

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHtml = '';

    // Previous button
    paginationHtml += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="goToCategoryPage(${currentPage - 1})">Previous</a>
        </li>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHtml += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="goToCategoryPage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHtml += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }

    // Next button
    paginationHtml += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="goToCategoryPage(${currentPage + 1})">Next</a>
        </li>
    `;

    paginationContainer.innerHTML = paginationHtml;
}

function goToCategoryPage(page) {
    if (page < 1 || page > Math.ceil(categoryBusinesses.length / itemsPerPage)) {
        return;
    }
    
    currentPage = page;
    displayCategoryResults();
    
    // Scroll to top of results
    document.getElementById('categoryResults').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function sortCategoryResults(sortBy) {
    switch (sortBy) {
        case 'rating':
            categoryBusinesses.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            categoryBusinesses.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
            categoryBusinesses.sort((a, b) => b.id - a.id);
            break;
    }

    currentPage = 1;
    displayCategoryResults();
}

function callBusiness(phone) {
    window.location.href = `tel:${phone}`;
}