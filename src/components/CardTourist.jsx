import React from "react";
import "./styles/CardTourist.css"
import { Link } from "react-router-dom";

const CardTourist = ({ id, province, name, imgUrl }) => {

  return (

    <div className="card-tourist">
      <div className="card-tourist-image">
        <img src={imgUrl || "./image/camp.webp"} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px 16px 0 0' }} />
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