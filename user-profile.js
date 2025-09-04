// Sample user reviews (this can be replaced with real data)
let userReviews = [
  {
    business: "Everest Cafe",
    rating: 5,
    comment: "Amazing coffee and cozy atmosphere!",
    images: []
  },
  {
    business: "Kathmandu Hotel",
    rating: 4,
    comment: "Comfortable rooms, good service.",
    images: []
  }
];

// Function to render user reviews
function renderUserReviews() {
  const container = document.getElementById("userReviewsContainer");
  container.innerHTML = "";

  userReviews.forEach(r => {
    const col = document.createElement("div");
    col.className = "col-md-6";

    let imagesHTML = "";
    if (r.images && r.images.length > 0) {
      imagesHTML = `<div class="mt-2">`;
      r.images.forEach(src => {
        imagesHTML += `<img src="${src}" class="img-fluid rounded me-2 mb-2" style="max-width: 100px;">`;
      });
      imagesHTML += `</div>`;
    }

    col.innerHTML = `
      <div class="card shadow-sm p-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="fw-bold mb-0">${r.business}</h6>
          <span class="text-warning">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
        </div>
        <p class="text-muted mb-0">${r.comment}</p>
        ${imagesHTML}
      </div>
    `;
    container.appendChild(col);
  });
}

// Initial rendering
renderUserReviews();

// Optional: Edit profile button click handler
document.getElementById("editProfileBtn").addEventListener("click", () => {
  alert("Edit profile functionality coming soon!");
});
