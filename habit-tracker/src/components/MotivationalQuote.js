import React, { useState, useEffect } from 'react';

const quotes = [
  "The best way to predict the future is to create it.",
  "The secret of getting ahead is getting started.",
  "Well begun is half done.",
  "The journey of a thousand miles begins with a single step.",
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The harder I work, the luckier I get.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future belongs to those who believe in the beauty of their dreams.",
];

const MotivationalQuote = () => {
  const [currentQuote, setCurrentQuote] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className="card text-center bg-light text-dark mb-4 shadow-sm">
      <div className="card-body">
        <p className="card-text fs-5 fst-italic">"{currentQuote}"</p>
      </div>
    </div>
  );
};

export default MotivationalQuote;
