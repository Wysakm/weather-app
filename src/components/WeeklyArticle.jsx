import React from 'react';
import './styles/WeeklyArticle.css';
import CardDailyArticle from './CardDailyArticle';  

const WeeklyArticle = ({ latitude, longitude }) => {
  return (
    <div className="weekly-article">
        <CardDailyArticle />
        <CardDailyArticle />
        <CardDailyArticle />
        <CardDailyArticle />

      </div>
    
  );
};

export default WeeklyArticle;