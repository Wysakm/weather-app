import React from "react";
import "./styles/CardTourist.css"

const CardTourist = ({ province, name, imgUrl }) => {
  return (

    <div className="card-tourist">
      <div className="card-tourist-image">
        <img src={imgUrl} alt={name} />
      </div>

      <div className="card-tourist-header">
        <h3>{name}</h3>
      </div>
      <div className="card-more-info">
        <div className="card-more-info-I">{province}</div>
        <div className="card-more-info-II" >More Info</div>
      </div>

    </div>
   


  );
}
export default CardTourist;