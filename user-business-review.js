// List of businesses (can be dynamic or fetched from a data file)
const businesses = ["Everest Cafe", "Kathmandu Hotel", "Himalayan Shop", "Tech Solutions Nepal"];

// Populate business select dropdown
const businessSelect = document.getElementById("businessSelect");
businesses.forEach(b => {
  const option = document.createElement("option");
  option.value = b;
  option.textContent = b;
  businessSelect.appendChild(option);
});

// Array to store reviews
let reviews = [];

// Render reviews
function renderReviews() {
  const container = document.getElementById("reviewsContainer");
  container.innerHTML = "";
  
  reviews.forEach(r => {
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
        <p class="text-muted mb-0"><strong>${r.name}:</strong> ${r.comment}</p>
        ${imagesHTML}
      </div>
    `;
    container.appendChild(col);
  });
}

// Handle form submission
document.getElementById("userReviewForm").addEventListener("submit", function(e){
  e.preventDefault();
  
  const name = this.querySelector("input").value;
  const business = this.querySelector("#businessSelect").value;
  const rating = parseInt(this.querySelector("#ratingSelect").value);
  const comment = this.querySelector("#reviewText").value;
  const files = Array.from(this.querySelector("#reviewImages").files);

  // Convert images to object URLs for preview
  const images = files.map(f => URL.createObjectURL(f));

  reviews.unshift({ name, business, rating, comment, images });
  renderReviews();
  this.reset();
  alert("Thank you for submitting your review!");
});
