import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import categoriesData from '../data/categories.json';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setCategories(categoriesData);
    setFilteredCategories(categoriesData);
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-nepal-blue to-nepal-red py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Business Categories
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse businesses by category and find exactly what you're looking for
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-nepal-gold focus:outline-none text-lg"
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <p className="text-gray-600">
                  Showing {filteredCategories.length} of {categories.length} categories
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCategories.map((category, index) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div 
                      className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl group-hover:scale-110 transition-transform duration-300"
                      style={{ background: `linear-gradient(135deg, ${category.color}, #1E40AF)` }}
                    >
                      <i className={`fas fa-${category.icon}`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-nepal-blue transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-3 text-sm">{category.description}</p>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-nepal-blue font-semibold">{category.count}</span>
                      <span className="text-gray-500 text-sm">businesses</span>
                    </div>
                    {category.featured && (
                      <div className="mt-3">
                        <span className="bg-nepal-gold text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Popular
                        </span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Categories;