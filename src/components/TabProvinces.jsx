import React, { useState, useEffect } from "react";
import "./styles/TabProvinces.css";
import { getWeatherRankings } from "../api/weather";

const TabProvinces = ({ onProvinceSelect, selectedIndex = 0 }) => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const response = await getWeatherRankings();
        // Get top 5 provinces from the rankings data
        const provincesData = response.data?.rankings?.slice(0, 5) || [];
        setProvinces(provincesData);
        
        // Call parent callback with first province if available
        if (provincesData.length > 0 && onProvinceSelect) {
          onProvinceSelect(provincesData[selectedIndex] || provincesData[0], selectedIndex);
        }
      } catch (err) {
        console.error('Error fetching provinces:', err);
        setError('Failed to load provinces');
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, [onProvinceSelect, selectedIndex]);

  const handleProvinceClick = (province, index) => {
    setActiveIndex(index);
    if (onProvinceSelect) {
      onProvinceSelect(province, index);
    }
  };

  if (loading) {
    return (
      <div className="tab-province">
        <div className="tab-box">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-province">
        <div className="tab-box">Error loading data</div>
      </div>
    );
  }

  return (
    <div className="tab-province">
      {provinces.map((province, index) => (
        <div 
          key={index} 
          className={`tab-box ${activeIndex === index ? 'active' : ''}`}
          onClick={() => handleProvinceClick(province, index)}
          style={{ cursor: 'pointer' }}
        >
          {province.province_name}
        </div>
      ))}
    </div>
  );
}
export default TabProvinces;