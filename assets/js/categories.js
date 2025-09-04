// Categories page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    loadAllCategories();
});

function loadAllCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    
    categoriesGrid.innerHTML = categories.map(category => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
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

    // Add staggered animation
    setTimeout(() => {
        categoriesGrid.querySelectorAll('.category-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in-up');
            }, index * 80);
        });
    }, 100);
}

// Search functionality
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const keyword = searchInput.value.trim();
    
    if (keyword) {
        window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
    }
}