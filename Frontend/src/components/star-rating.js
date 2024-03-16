import React from "react";
import "../css/component/star-rating.css"; // Import your custom CSS file for styling

const StarRating = ({ rating, onRatingChange }) => {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);

  const handleStarClick = (selectedRating) => {
    onRatingChange(selectedRating);
  };

  return (
    <div className="star-rating">
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? "filled" : ""}`}
          onClick={() => handleStarClick(star)}
        ></span>
      ))}
    </div>
  );
};

export default StarRating;
