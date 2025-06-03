import React, { useState, useEffect } from "react";
import "./styles/CardTouristContainer.css";
import CardTourist from "./CardTourist";
import { postsAPI } from "../api/posts";

const CardTouristContainer = ({ selectedProvince }) => {
  const [touristData, setTouristData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTouristData = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;
        if (selectedProvince && selectedProvince.province_id) {
          // Use province filter API
          response = await postsAPI.getByProvinceId(selectedProvince.province_id);
        } else {
          // Get all posts if no province selected
          response = await postsAPI.getAll();
        }
        const data = response.data.posts || response.data
        // console.log(' response:', { data, selectedProvince });
        debugger

        setTouristData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTouristData();
  }, [selectedProvince]);

  // Since we're using server-side filtering, limit to 3 items for display
  const filteredData = touristData.slice(0, 3);

  if (loading) {
    return <div className="loading">Loading tourist attractions...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="card-tourist-container">
      {filteredData.length > 0 ? (
        filteredData.map((item, index) => (
          <CardTourist
            key={index}
            province={item.place.province.name}
            name={item.title}
            imgUrl={item.image}
          />
        ))
      ) : (
        <div className="no-data">
          {selectedProvince
            ? `No tourist attractions found for ${selectedProvince}`
            : "No tourist attractions available"}
        </div>
      )}
    </div>
  );
};

export default CardTouristContainer;