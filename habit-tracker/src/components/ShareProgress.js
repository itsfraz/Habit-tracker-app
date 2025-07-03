
import React from 'react';

const ShareProgress = ({ habits, level }) => {
  const generateShareMessage = () => {
    const totalHabits = habits.length;
    const completedHabits = habits.filter(habit => habit.history.length > 0).length;
    const message = `I've completed ${completedHabits} out of ${totalHabits} habits and reached Level ${level} in my Habit Tracker! #HabitTracker #Productivity`;
    return message;
  };

  const handleShare = () => {
    const message = generateShareMessage();
    navigator.clipboard.writeText(message).then(() => {
      alert('Progress copied to clipboard! You can now paste it on social media.');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="card shadow-sm mt-4 p-3 text-center">
      <h5 className="card-title">Share Your Progress!</h5>
      <p className="card-text">Let your friends know about your achievements.</p>
      <button className="btn btn-primary btn-lg" onClick={handleShare}>
        <i className="bi bi-share-fill me-2"></i> Share My Progress
      </button>
    </div>
  );
};

export default ShareProgress;
