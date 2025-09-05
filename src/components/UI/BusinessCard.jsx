import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Star, Verified } from 'lucide-react';
import StarRating from './StarRating';

const BusinessCard = ({ business, className = '' }) => {
  const formatHours = (hours) => {
    if (hours.open === '24/7') return 'Open 24/7';
    return `${hours.open} - ${hours.close}`;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${className}`}>
      <div className="relative">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {business.featured && (
          <div className="absolute top-4 left-4 bg-nepal-gold text-white px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </div>
        )}
        {business.verified && (
          <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
            <Verified className="h-4 w-4" />
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-nepal-blue font-semibold text-sm">{business.category}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-nepal-blue transition-colors duration-200">
            <Link to={`/business/${business.id}`}>
              {business.name}
            </Link>
          </h3>
          <div className="text-right">
            <StarRating rating={business.rating} size="small" />
            <p className="text-gray-500 text-sm mt-1">({business.reviewCount} reviews)</p>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {business.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="h-4 w-4 mr-2 text-nepal-red" />
            <span>{business.area}, {business.city}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Phone className="h-4 w-4 mr-2 text-nepal-blue" />
            <span>{business.phone}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-2 text-nepal-green" />
            <span>{formatHours(business.hours)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {business.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
              >
                {amenity}
              </span>
            ))}
            {business.amenities.length > 3 && (
              <span className="text-gray-400 text-xs">+{business.amenities.length - 3} more</span>
            )}
          </div>
          <Link
            to={`/business/${business.id}`}
            className="bg-nepal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-semibold"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;