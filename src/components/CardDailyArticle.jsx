import React from 'react';
import './styles/cardDailyArticle.css';

const CardDailyArticle = () => {
  return (
    <div className="cardDaily-article">
      <div className='daily'>
        25/5
      </div>

      <div className='temperature-max-min'>
        <div className='maximum'>
          H:25°C /
        </div>
        <div className='minimum'>
          L:15°C
        </div>

      </div>

         <div className='icon-daily'> 
          🌤️
        </div>
        <div className='rain'>
          Rain : 80% 
        </div>
    </div>
  );
};

export default CardDailyArticle;