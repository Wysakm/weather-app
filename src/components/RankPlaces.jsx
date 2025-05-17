import React from 'react';
import './styles/RankPlaces.css';

const RankPlaces = () => {
  return (
    <div className="Rank-container">
      {/* Place ranking cards will go here */}
      <div className="card" style={{ backgroundColor: '#f0f0f0', padding: '20px', margin: '10px' }}>
        <h2>Place 1</h2>
        <p>Details about Place 1</p>
      </div>

    </div>
  );
};

export default RankPlaces;