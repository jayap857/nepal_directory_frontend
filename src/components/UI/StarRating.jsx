import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, maxRating = 5, size = 'medium', showNumber = true, interactive = false, onRatingChange }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-6 w-6'
  };

  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= rating;
          
          return (
            <Star
              key={index}
              className={`${sizeClasses[size]} ${
                isFilled ? 'text-nepal-gold fill-current' : 'text-gray-300'
              } ${interactive ? 'cursor-pointer hover:text-nepal-gold' : ''}`}
              onClick={() => handleStarClick(starRating)}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="text-gray-600 text-sm font-medium ml-2">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;