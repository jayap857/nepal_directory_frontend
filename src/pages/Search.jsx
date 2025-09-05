import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, MapPin, Star } from 'lucide-react';
import SearchBar from '../components/UI/SearchBar';
import BusinessCard from '../components/UI/BusinessCard';
import businessesData from '../data/businesses.json';
import categoriesData from '../data/categories.json';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [categories] = useState(categoriesData);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    rating: '',
    priceRange: '',
    amenities: []
  });

  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    setBusinesses(businessesData);
    
    // Apply initial search from URL params
    const query = searchParams.get('q') || '';
    const location = searchParams.get('location') || '';
    const category = searchParams.get('category') || '';
    
    let filtered = businessesData;
    
    if (query) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(query.toLowerCase()) ||
        business.description.toLowerCase().includes(query.toLowerCase()) ||
        business.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (location) {
      filtered = filtered.filter(business =>
        business.city.toLowerCase().includes(location.toLowerCase()) ||
        business.area.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (category) {
      filtered = filtered.filter(business =>
        business.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    setFilteredBusinesses(filtered);
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [filters, sortBy, businesses]);

  const applyFilters = () => {
    let filtered = [...businesses];

    // Apply search from URL
    const query = searchParams.get('q') || '';
    const location = searchParams.get('location') || '';
    
    if (query) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(query.toLowerCase()) ||
        business.description.toLowerCase().includes(query.toLowerCase()) ||
        business.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (location) {
      filtered = filtered.filter(business =>
        business.city.toLowerCase().includes(location.toLowerCase()) ||
        business.area.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Apply additional filters
    if (filters.category) {
      filtered = filtered.filter(business => business.category === filters.category);
    }

    if (filters.city) {
      filtered = filtered.filter(business => business.city === filters.city);
    }

    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(business => business.rating >= minRating);
    }

    if (filters.priceRange) {
      filtered = filtered.filter(business => business.priceRange === filters.priceRange);
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter(business =>
        filters.amenities.every(amenity => business.amenities.includes(amenity))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredBusinesses(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'amenities') {
      setFilters(prev => ({
        ...prev,
        amenities: prev.amenities.includes(value)
          ? prev.amenities.filter(a => a !== value)
          : [...prev.amenities, value]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      city: '',
      rating: '',
      priceRange: '',
      amenities: []
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, startIndex + itemsPerPage);

  const cities = [...new Set(businessesData.map(b => b.city))];
  const allAmenities = [...new Set(businessesData.flatMap(b => b.amenities))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <section className="bg-white shadow-sm py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar size="medium" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-nepal-blue hover:text-nepal-red transition-colors text-sm font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                <div className="space-y-2">
                  {['$', '$$', '$$$'].map(price => (
                    <label key={price} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={price}
                        checked={filters.priceRange === price}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        className="mr-2 text-nepal-blue focus:ring-nepal-blue"
                      />
                      <span className="text-sm">{price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {allAmenities.slice(0, 8).map(amenity => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => handleFilterChange('amenities', amenity)}
                        className="mr-2 text-nepal-blue focus:ring-nepal-blue"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Results</h2>
                <p className="text-gray-600">
                  {filteredBusinesses.length} businesses found
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {paginatedBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No businesses found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
                <button
                  onClick={clearFilters}
                  className="bg-nepal-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {paginatedBusinesses.map((business, index) => (
                    <BusinessCard
                      key={business.id}
                      business={business}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg ${
                              currentPage === page
                                ? 'bg-nepal-blue text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2">...</span>;
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;