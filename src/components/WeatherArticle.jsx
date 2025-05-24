import React from "react";
import './styles/WeatherArticle.css'

const WeatherArticle = () => {
  return (
    <div className="weatherArticle-container">
      <div className="DMY-province">
        <div className="date">
          date
        </div>
        <div className="province">
          Province
        </div>
      </div>

      <div className="temp-condition">
        <div className="image-condition">image</div>
        <div className="temperature">30 C</div>
      </div>


   
       
        <div className="condition">
          Cloudy
        </div>
      
     

       <div className="HL-box">
          H : 34 C / L : 28 C 
          </div>

            <div className="feelsLike-box">
          Feels like : 33 C 
        </div>


      <div className="etc-forecast">

        <div className="etc-left">
          <div>
            Sun rise : 05.56 น.
          </div>
          <div>
            Sun set : 18.09 น. 
          </div>
        </div>

        <div className="etc-right">
          <div>
            Rain : 80%
          </div>
          <div>
            UV Index : 6 
          </div>
        </div>
      </div>

    </div>

  );
};

export default WeatherArticle;

//