// Add Business page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
  setupForm();
  populateCategories();
});

function setupForm() {
  const form = document.getElementById('addBusinessForm');
  
  // Add form validation
  form.addEventListener('submit', function(event) {
      event.preventDefault();
      event.stopPropagation();

      if (form.checkValidity()) {
          submitBusiness();
      } else {
          form.classList.add('was-validated');
      }
  });

  // Remove validation class on input
  form.addEventListener('input', function() {
      if (form.classList.contains('was-validated')) {
          form.classList.remove('was-validated');
      }
  });
}

function populateCategories() {
  const categorySelect = document.getElementById('businessCategory');
  categorySelect.innerHTML = '<option value="">Select Category</option>' +
      categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
}

function submitBusiness() {
  const formData = collectFormData();
  
  if (!formData) {
      return;
  }

  // Get existing businesses from localStorage
  const existingBusinesses = getFromLocalStorage('businesses') || [];
  
  // Create new business object
  const newBusiness = {
      id: Date.now(), // Simple ID generation
      name: formData.name,
      category: categories.find(cat => cat.id === parseInt(formData.categoryId)).name,
      categoryId: parseInt(formData.categoryId),
      description: formData.description,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      address: formData.address,
      city: formData.city,
      area: formData.area,
      rating: 0,
      reviewCount: 0,
      featured: false,
      hours: {
          open: formData.openTime || '09:00',
          close: formData.closeTime || '18:00',
          days: formData.operatingDays
      },
      services: formData.services ? formData.services.split(',').map(s => s.trim()) : [],
      image: getRandomBusinessImage(),
      socialMedia: {
          facebook: formData.facebook,
          instagram: formData.instagram
      }
  };

  // Add to businesses array
  existingBusinesses.push(newBusiness);
  
  // Save to localStorage
  if (saveToLocalStorage('businesses', existingBusinesses)) {
      showSuccessModal();
      resetForm();
  } else {
      alert('Error saving business. Please try again.');
  }
}

function collectFormData() {
  const operatingDays = [];
  ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
      if (document.getElementById(day).checked) {
          operatingDays.push(day.charAt(0).toUpperCase() + day.slice(1));
      }
  });

  return {
      name: document.getElementById('businessName').value.trim(),
      categoryId: document.getElementById('businessCategory').value,
      description: document.getElementById('businessDescription').value.trim(),
      phone: document.getElementById('businessPhone').value.trim(),
      email: document.getElementById('businessEmail').value.trim(),
      website: document.getElementById('businessWebsite').value.trim(),
      city: document.getElementById('businessCity').value,
      area: document.getElementById('businessArea').value.trim(),
      address: document.getElementById('businessAddress').value.trim(),
      openTime: document.getElementById('openTime').value,
      closeTime: document.getElementById('closeTime').value,
      operatingDays: operatingDays,
      services: document.getElementById('businessServices').value.trim(),
      facebook: document.getElementById('businessFacebook').value.trim(),
      instagram: document.getElementById('businessInstagram').value.trim()
  };
}

function showSuccessModal() {
  const modal = new bootstrap.Modal(document.getElementById('successModal'));
  modal.show();
  
  // Redirect to home page after modal is hidden
  document.getElementById('successModal').addEventListener('hidden.bs.modal', function() {
      window.location.href = 'index.html';
  });
}

function resetForm() {
  const form = document.getElementById('addBusinessForm');
  form.reset();
  form.classList.remove('was-validated');
}

function getRandomBusinessImage() {
  const businessImages = [
      'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',
      'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
      'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg',
      'https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg',
      'https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg',
      'https://images.pexels.com/photos/1319839/pexels-photo-1319839.jpeg'
  ];
  
  return businessImages[Math.floor(Math.random() * businessImages.length)];
}

// Form validation helpers
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[\+]?[977]?[\-\s]?[0-9]{8,10}$/;
  return phoneRegex.test(phone.replace(/[\s\-]/g, ''));
}

function validateWebsite(url) {
  try {
      new URL(url);
      return true;
  } catch {
      return false;
  }
}

// Real-time validation
document.getElementById('businessEmail').addEventListener('blur', function() {
  const email = this.value.trim();
  if (email && !validateEmail(email)) {
      this.setCustomValidity('Please enter a valid email address');
  } else {
      this.setCustomValidity('');
  }
});

document.getElementById('businessWebsite').addEventListener('blur', function() {
  const website = this.value.trim();
  if (website && !validateWebsite(website)) {
      this.setCustomValidity('Please enter a valid website URL');
  } else {
      this.setCustomValidity('');
  }
});