// Sample data for Nepal Business Directory

const categories = [
    {
        id: 1,
        name: 'Restaurants',
        icon: 'fas fa-utensils',
        description: 'Local restaurants and dining',
        count: 45,
        color: '#DC2626'
    },
    {
        id: 2,
        name: 'Hotels',
        icon: 'fas fa-bed',
        description: 'Accommodation and lodging',
        count: 32,
        color: '#1E40AF'
    },
    {
        id: 3,
        name: 'Shopping',
        icon: 'fas fa-shopping-bag',
        description: 'Retail stores and markets',
        count: 78,
        color: '#059669'
    },
    {
        id: 4,
        name: 'Services',
        icon: 'fas fa-cogs',
        description: 'Professional services',
        count: 56,
        color: '#7C3AED'
    },
    {
        id: 5,
        name: 'Healthcare',
        icon: 'fas fa-heartbeat',
        description: 'Hospitals and clinics',
        count: 23,
        color: '#DC2626'
    },
    {
        id: 6,
        name: 'Education',
        icon: 'fas fa-graduation-cap',
        description: 'Schools and institutes',
        count: 34,
        color: '#1E40AF'
    },
    {
        id: 7,
        name: 'Technology',
        icon: 'fas fa-laptop',
        description: 'IT services and shops',
        count: 29,
        color: '#059669'
    },
    {
        id: 8,
        name: 'Transportation',
        icon: 'fas fa-car',
        description: 'Transport services',
        count: 18,
        color: '#F59E0B'
    }
];

const businesses = [
    {
        id: 1,
        name: 'Mountain View Restaurant',
        category: 'Restaurants',
        categoryId: 1,
        description: 'Authentic Nepali cuisine with stunning mountain views. Family-owned restaurant serving traditional dal bhat, momos, and more.',
        phone: '+977-1-4445566',
        email: 'info@mountainviewrestaurant.com',
        website: 'https://mountainviewrestaurant.com',
        address: 'Thamel, Kathmandu',
        city: 'Kathmandu',
        area: 'Thamel',
        rating: 4.5,
        reviewCount: 127,
        featured: true,
        hours: {
            open: '09:00',
            close: '22:00',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        services: ['Dine-in', 'Takeaway', 'Home Delivery', 'Catering'],
        image: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg'
    },
    {
        id: 2,
        name: 'Himalayan Tech Solutions',
        category: 'Technology',
        categoryId: 7,
        description: 'Leading IT services provider in Nepal. Web development, mobile apps, and digital marketing solutions.',
        phone: '+977-1-4556677',
        email: 'contact@himalayantechsolutions.com',
        website: 'https://himalayantechsolutions.com',
        address: 'Putalisadak, Kathmandu',
        city: 'Kathmandu',
        area: 'Putalisadak',
        rating: 4.8,
        reviewCount: 89,
        featured: true,
        hours: {
            open: '09:00',
            close: '18:00',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },
        services: ['Web Development', 'Mobile Apps', 'Digital Marketing', 'IT Consulting'],
        image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'
    },
    {
        id: 3,
        name: 'Everest Base Camp Trek',
        category: 'Services',
        categoryId: 4,
        description: 'Professional trekking and adventure tours. Experienced guides for Everest, Annapurna, and other mountain adventures.',
        phone: '+977-1-4667788',
        email: 'info@everestbasecamptrek.com',
        website: 'https://everestbasecamptrek.com',
        address: 'Thamel, Kathmandu',
        city: 'Kathmandu',
        area: 'Thamel',
        rating: 4.9,
        reviewCount: 156,
        featured: true,
        hours: {
            open: '08:00',
            close: '20:00',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        services: ['Everest Trek', 'Annapurna Trek', 'Mountain Climbing', 'Adventure Tours'],
        image: 'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg'
    },
    {
        id: 4,
        name: 'Lakeside Lodge',
        category: 'Hotels',
        categoryId: 2,
        description: 'Cozy lakeside accommodation in Pokhara with beautiful mountain views. Perfect for trekkers and families.',
        phone: '+977-61-445566',
        email: 'reservations@lakesidelodge.com',
        website: 'https://lakesidelodge.com',
        address: 'Lakeside, Pokhara',
        city: 'Pokhara',
        area: 'Lakeside',
        rating: 4.3,
        reviewCount: 94,
        featured: false,
        hours: {
            open: '24/7',
            close: '24/7',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        services: ['Accommodation', 'Restaurant', 'Tour Booking', 'Airport Transfer'],
        image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg'
    },
    {
        id: 5,
        name: 'Kathmandu Medical Center',
        category: 'Healthcare',
        categoryId: 5,
        description: 'Modern healthcare facility with experienced doctors and state-of-the-art equipment.',
        phone: '+977-1-4778899',
        email: 'info@kathmandumedical.com',
        website: 'https://kathmandumedical.com',
        address: 'Maharajgunj, Kathmandu',
        city: 'Kathmandu',
        area: 'Maharajgunj',
        rating: 4.7,
        reviewCount: 203,
        featured: true,
        hours: {
            open: '24/7',
            close: '24/7',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        services: ['Emergency Care', 'General Medicine', 'Surgery', 'Diagnostics'],
        image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg'
    },
    {
        id: 6,
        name: 'Sherpa Mall',
        category: 'Shopping',
        categoryId: 3,
        description: 'Premium shopping destination with international and local brands, food court, and entertainment.',
        phone: '+977-1-4889900',
        email: 'info@sherpamall.com',
        website: 'https://sherpamall.com',
        address: 'Durbar Marg, Kathmandu',
        city: 'Kathmandu',
        area: 'Durbar Marg',
        rating: 4.2,
        reviewCount: 178,
        featured: false,
        hours: {
            open: '10:00',
            close: '21:00',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        services: ['Shopping', 'Food Court', 'Cinema', 'Parking'],
        image: 'https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg'
    },
    {
        id: 7,
        name: 'Nepal International School',
        category: 'Education',
        categoryId: 6,
        description: 'Premier international school offering world-class education with modern facilities.',
        phone: '+977-1-4990011',
        email: 'admissions@nepalinternational.edu',
        website: 'https://nepalinternational.edu',
        address: 'Lalitpur, Kathmandu Valley',
        city: 'Kathmandu',
        area: 'Lalitpur',
        rating: 4.6,
        reviewCount: 67,
        featured: false,
        hours: {
            open: '07:00',
            close: '16:00',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },
        services: ['Primary Education', 'Secondary Education', 'Sports', 'Arts'],
        image: 'https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg'
    },
    {
        id: 8,
        name: 'Pokhara Taxi Service',
        category: 'Transportation',
        categoryId: 8,
        description: 'Reliable taxi and transport service in Pokhara. Airport transfers, local sightseeing, and long-distance trips.',
        phone: '+977-61-556677',
        email: 'booking@pokharataxiservice.com',
        address: 'Airport Road, Pokhara',
        city: 'Pokhara',
        area: 'Airport Road',
        rating: 4.1,
        reviewCount: 134,
        featured: false,
        hours: {
            open: '24/7',
            close: '24/7',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        services: ['Airport Transfer', 'City Tours', 'Long Distance', 'Hourly Booking'],
        image: 'https://images.pexels.com/photos/1319839/pexels-photo-1319839.jpeg'
    }
];

const reviews = [
    {
        businessId: 1,
        name: 'Raj Kumar',
        rating: 5,
        comment: 'Excellent food and service! The dal bhat was authentic and delicious.',
        date: '2024-01-15'
    },
    {
        businessId: 1,
        name: 'Sarah Johnson',
        rating: 4,
        comment: 'Great atmosphere and friendly staff. The momos were amazing!',
        date: '2024-01-10'
    },
    {
        businessId: 2,
        name: 'Arjun Thapa',
        rating: 5,
        comment: 'Professional team and excellent service. They delivered our website on time.',
        date: '2024-01-12'
    },
    {
        businessId: 3,
        name: 'Mike Peterson',
        rating: 5,
        comment: 'Best trekking experience ever! Guides were knowledgeable and safety-conscious.',
        date: '2024-01-08'
    },
    {
        businessId: 4,
        name: 'Priya Sharma',
        rating: 4,
        comment: 'Clean rooms with beautiful lake view. Staff was very helpful.',
        date: '2024-01-14'
    }
];

// Utility functions
function getBusinessById(id) {
    return businesses.find(business => business.id === parseInt(id));
}

function getBusinessesByCategory(categoryId) {
    return businesses.filter(business => business.categoryId === parseInt(categoryId));
}

function getCategoryById(id) {
    return categories.find(category => category.id === parseInt(id));
}

function searchBusinesses(keyword, categoryId, location) {
    return businesses.filter(business => {
        const matchesKeyword = !keyword || 
            business.name.toLowerCase().includes(keyword.toLowerCase()) ||
            business.description.toLowerCase().includes(keyword.toLowerCase()) ||
            business.services.some(service => service.toLowerCase().includes(keyword.toLowerCase()));
        
        const matchesCategory = !categoryId || business.categoryId === parseInt(categoryId);
        
        const matchesLocation = !location ||
            business.city.toLowerCase().includes(location.toLowerCase()) ||
            business.area.toLowerCase().includes(location.toLowerCase()) ||
            business.address.toLowerCase().includes(location.toLowerCase());
        
        return matchesKeyword && matchesCategory && matchesLocation;
    });
}

function getReviewsByBusinessId(businessId) {
    return reviews.filter(review => review.businessId === parseInt(businessId));
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

function formatBusinessHours(hours) {
    if (hours.open === '24/7') {
        return '24/7';
    }
    return `${hours.open} - ${hours.close}`;
}

// Local storage functions
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

// Initialize sample data in localStorage if not exists
function initializeData() {
    if (!getFromLocalStorage('businesses')) {
        saveToLocalStorage('businesses', businesses);
    }
    if (!getFromLocalStorage('categories')) {
        saveToLocalStorage('categories', categories);
    }
    if (!getFromLocalStorage('reviews')) {
        saveToLocalStorage('reviews', reviews);
    }
}

// Call initialize data when script loads
initializeData();