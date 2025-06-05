import React, { useState, useEffect } from "react";
import "./styles/CardStayContainer.css";
import CardTourist from "./CardTourist";
import { postsAPI } from "../api/posts";

const CardStayContainer = ({ selectedProvince }) => {
  const [stayData, setStayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStayData = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;
        if (selectedProvince && selectedProvince.province_id) {
          // Use province filter API for stay places
          response = await postsAPI.getByProvinceId(selectedProvince.province_id, 'stay');
        } else {
          // Get all posts if no province selected
          response = { data: { posts: [] } }; // Fallback to empty array if no province selected
        }
        
        const data = response.data.posts || response.data;
        setStayData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStayData();
  }, [selectedProvince]);

  // Since we're using server-side filtering, limit to 3 items for display
  const filteredData = stayData.slice(0, 3);

  if (loading) {
    return <div className="loading">Loading accommodations...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  return (
    <div className="CardStay-container">
      {filteredData.length > 0 ? (
        filteredData.map((item, index) => (
          <CardTourist
            key={index}
            id={item.id_post}
            province={item.place.province.name}
            name={item.title}
            imgUrl={item.image}
          />
        ))
      ) : (
        <div className="no-data">
          {selectedProvince
            ? `No accommodations found for ${selectedProvince.province_name || selectedProvince}`
            : "No accommodations available"}
        </div>
      )}
    </div>
  );
}
export default CardStayContainer;