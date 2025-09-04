// Homepage JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    loadPopularCategories();
    loadFeaturedBusinesses();
    setupSearchFunctionality();
});

function loadPopularCategories() {
    const categoriesContainer = document.getElementById('popularCategories');
    const topCategories = categories.slice(0, 4);
    
    categoriesContainer.innerHTML = topCategories.map(category => `
        <div class="col-lg-3 col-md-6 mb-4">
            <a href="category.html?id=${category.id}" class="category-card card h-100 text-decoration-none">
                <div class="card-body">
                    <div class="category-icon mb-3" style="background: linear-gradient(135deg, ${category.color}, #1E40AF);">
                        <i class="${category.icon}"></i>
                    </div>
                    <h5 class="card-title fw-bold">${category.name}</h5>
                    <p class="card-text text-muted">${category.description}</p>
                    <div class="text-primary fw-semibold">${category.count} businesses</div>
                </div>
            </a>
        </div>
    `).join('');

    // Add animation
    setTimeout(() => {
        categoriesContainer.querySelectorAll('.category-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in-up');
            }, index * 100);
        });
    }, 100);
}

function loadFeaturedBusinesses() {
    const businessesContainer = document.getElementById('featuredBusinesses');
    const featuredBusinesses = businesses.filter(business => business.featured).slice(0, 3);
    
    businessesContainer.innerHTML = featuredBusinesses.map(business => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card business-card h-100">
                <img src="${business.image}" class="card-img-top" alt="${business.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title fw-bold mb-0">${business.name}</h5>
                        <span class="badge bg-primary">${business.category}</span>
                    </div>
                    <div class="rating mb-2">
                        ${generateStars(business.rating)}
                        <span class="text-muted ms-2">(${business.reviewCount})</span>
                    </div>
                    <p class="card-text flex-grow-1">${business.description.substring(0, 100)}...</p>
                    <div class="business-info mt-auto">
                        <div class="d-flex align-items-center mb-2">
                            <i class="fas fa-map-marker-alt text-primary me-2"></i>
                            <small class="text-muted">${business.area}, ${business.city}</small>
                        </div>
                        <div class="d-flex align-items-center mb-3">
                            <i class="fas fa-phone text-primary me-2"></i>
                            <small class="text-muted">${business.phone}</small>
                        </div>
                        <a href="business-detail.html?id=${business.id}" class="btn btn-outline-primary w-100">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add animation
    setTimeout(() => {
        businessesContainer.querySelectorAll('.business-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in-up');
            }, index * 150);
        });
    }, 200);
}

function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const keyword = searchInput.value.trim();
    
    if (keyword) {
        window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
    } else {
        window.location.href = 'search.html';
    }
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});