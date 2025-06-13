import React from "react";
import "./styles/CardTourist.css"
import { Link } from "react-router-dom";
import { getImageWithFallback, handleImageError } from "../utils/imageUtils";

const CardTourist = ({ id, province, name, imgUrl, type }) => {
  const imageSrc = getImageWithFallback(imgUrl, type);

  return (

    <div className="card-tourist" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 12px 40px rgba(0, 0, 0, 0.15)' }}>
      <div className="card-tourist-image">
        <img 
          src={imageSrc} 
          alt={name} 
          onError={(e) => handleImageError(e, type)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px 16px 0 0' }} 
        />
      </div>

      <div className="card-tourist-header">
        <h3>{name}</h3>
      </div>
      <div className="card-more-info">
        <div className="card-more-info-I">{province}</div>
        <Link to={`/article/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card-more-info-II" >More Info</div>
        </Link>
      </div>
    </div>
  );
}
export default CardTourist;