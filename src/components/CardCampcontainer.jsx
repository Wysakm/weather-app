import React, { useState, useEffect } from "react";
import "./styles/CardCampContainer.css";
import CardTourist from "./CardTourist";
import { postsAPI } from "../api/posts";

const CardCampContainer = ({ selectedProvince }) => {
  const [campData, setCampData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampData = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;
        if (selectedProvince && selectedProvince.province_id) {
          // Use province filter API for camp places
          response = await postsAPI.getByProvinceId(selectedProvince.province_id, 'camp');
        } else {
          // Get all posts if no province selected
          response = { data: { posts: [] } }; // Fallback to empty array if no province selected
        }
        
        const data = response.data.posts || response.data || [];
        setCampData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampData();
  }, [selectedProvince]);

  // Since we're using server-side filtering, limit to 3 items for display
  const filteredData = campData.slice(0, 3);

  if (loading) {
    return <div className="loading">Loading camping sites...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  return (
    <div className="CardCamp-container">
      {filteredData.length > 0 ? (
        filteredData.map((item, index) => (
          <CardTourist
            key={index}
            id={item.id_post}
            province={item.place.province.name}
            name={item.title}
            imgUrl={item.image}
            type="camp"
          />
        ))
      ) : (
        <div className="no-data">
          {selectedProvince
            ? `No camping sites found for ${selectedProvince.province_name || selectedProvince}`
            : "No camping sites available"}
        </div>
      )}
    </div>
  );
}
export default CardCampContainer;