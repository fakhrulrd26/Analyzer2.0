import React, { useState, useContext } from 'react';
import StarRating from '../../components/star-rating';
import { AuthContext } from '../../context/authContext';
import axiosInstance from '../../api/axiosInstance';

const FeedbackForm = ({ setStep }) => {
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState('');
  const [selectedChoice, setSelectedChoice] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleChoiceChange = (e) => {
    setSelectedChoice(e.target.value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // siapkan payload untuk dikirim ke Backend
    const payloadFeedback = {
      content: feedback,
      isHelping: selectedChoice && selectedChoice.includes('Ya,'),
      rate: rating
    };

    // validasi payload apakah sudah diisi semua atau belum
    if (
      Object.keys(payloadFeedback).some((field) =>
        [0, ''].includes(payloadFeedback[field])
      ) ||
      feedback.length < 10
    ) {
      alert('Harap isi semua feedback form untuk melanjukan');
      setIsSubmitting(false);
    } else {
      // apabila sudah divalidasi tinggal kirim payload ke endpoint feedback yang ada di BE
      try {
        await axiosInstance.post(
          `${process.env.REACT_APP_API_URL}/api/v1/feedbacks`,
          payloadFeedback
        );
        localStorage.setItem('is_review_app', JSON.stringify({ value: 1 }));
        setStep(2);
      } catch (error) {
        alert(error.response.message || 'Gagal mengirim Feedback');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="my-form mx-auto">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={user.username}
            disabled
          />
        </div>

        <div className="form-group mt-3">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={user.email}
            disabled
          />
        </div>

        <div className="form-group mt-3">
          <label htmlFor="feedback">Feedback:</label>
          <textarea
            id="feedback"
            className="form-control"
            value={feedback}
            onChange={handleFeedbackChange}
          ></textarea>
          <p className="text-end">{feedback.length} / 150</p>
        </div>

        <div className="mt-3">
          <label>Apakah Website ini membantu?</label>
          <div>
            <input
              type="radio"
              id="choice1"
              value="Ya, aplikasi file analyzer ini sangat membantu"
              checked={
                selectedChoice ===
                'Ya, aplikasi file analyzer ini sangat membantu'
              }
              onChange={handleChoiceChange}
            />
            <label htmlFor="choice1">
              Ya, aplikasi file analyzer ini sangat membantu
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="choice2"
              value="Tidak, aplikasi file analyzer ini tidak membantu mengatasi masalah saya"
              checked={
                selectedChoice ===
                'Tidak, aplikasi file analyzer ini tidak membantu mengatasi masalah saya'
              }
              onChange={handleChoiceChange}
            />
            <label htmlFor="choice2">
              Tidak, aplikasi file analyzer ini tidak membantu mengatasi masalah
              saya
            </label>
          </div>
          {/* Add more choices as needed */}
        </div>

        <div className="form-group mt-3">
          <label htmlFor="rating">Rating Website:</label>
          <StarRating rating={rating} onRatingChange={handleRatingChange} />
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="btn btn-primary mt-3 w-100"
        >
          Send Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
