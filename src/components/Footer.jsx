// Footer.js
import React from 'react';
import './styles/Footer.css';
const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-text">
        <p>&copy; 2025 Breathe-Away. All rights reserved.</p>
        <div>
          <p><a href="/terms">Terms of Service</a> | <a href="/privacy">Privacy Policy</a> </p>
          <p>Cradits : Information sourced from <a href="https://open-meteo.com/">open-meteo.com</a>,
            <a href="https://aqicn.org/"> aqicn.org </a>
            and <a href="https://developers.google.com/maps/documentation/places/web-service/legacy/search?hl=th">Google Places</a>  </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
