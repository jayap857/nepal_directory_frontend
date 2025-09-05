import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Building2, Star } from 'lucide-react';
import SearchBar from '../components/UI/SearchBar';
import BusinessCard from '../components/UI/BusinessCard';
import categoriesData from '../data/categories.json';
import businessesData from '../data/businesses.json';

const Home = () => {
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);

  useEffect(() => {
    // Load featured businesses
    const featured = businessesData.filter(business => business.featured).slice(0, 3);
    setFeaturedBusinesses(featured);

    // Load popular categories
    const popular = categoriesData.filter(category => category.featured).slice(0, 4);
    setPopularCategories(popular);
  }, []);

  const stats = [
    { icon: Building2, label: 'Registered Businesses', value: '5,000+', color: 'text-nepal-blue' },
    { icon: Users, label: 'Active Users', value: '15,000+', color: 'text-nepal-green' },
    { icon: Star, label: 'Customer Reviews', value: '8,000+', color: 'text-nepal-gold' },
    { icon: TrendingUp, label: 'Categories', value: '120+', color: 'text-nepal-red' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-nepal-blue via-nepal-red to-nepal-gold min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3889694/pexels-photo-3889694.jpeg')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Discover Local Businesses
              <span className="block text-nepal-gold">in Nepal</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Connect with trusted local businesses and services across Nepal. From restaurants to tech services, find everything you need.
            </p>
            <SearchBar className="mb-8" />
            <div className="flex flex-wrap justify-center gap-4 text-white/80">
              <span>Popular searches:</span>
              <Link to="/search?q=restaurants" className="hover:text-nepal-gold transition-colors">Restaurants</Link>
              <Link to="/search?q=hotels" className="hover:text-nepal-gold transition-colors">Hotels</Link>
              <Link to="/search?q=IT services" className="hover:text-nepal-gold transition-colors">IT Services</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore businesses by category and find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {popularCategories.map((category, index) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `linear-gradient(135deg, ${category.color}, #1E40AF)` }}
                >
                  <i className={`fas fa-${category.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-nepal-blue transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-3">{category.description}</p>
                <div className="text-nepal-blue font-semibold">{category.count} businesses</div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/categories"
              className="inline-flex items-center space-x-2 bg-nepal-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
            >
              <span>View All Categories</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover top-rated local businesses recommended by our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredBusinesses.map((business, index) => (
              <BusinessCard
                key={business.id}
                business={business}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/search"
              className="inline-flex items-center space-x-2 bg-nepal-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold"
            >
              <span>Explore All Businesses</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-nepal-blue to-nepal-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of local businesses already listed on Nepal Directory and connect with customers in your area.
            </p>
            <Link
              to="/add-business"
              className="inline-flex items-center space-x-2 bg-nepal-gold text-white px-8 py-4 rounded-lg hover:bg-yellow-500 transition-colors duration-200 font-semibold text-lg"
            >
              <Building2 className="h-6 w-6" />
              <span>List Your Business</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;