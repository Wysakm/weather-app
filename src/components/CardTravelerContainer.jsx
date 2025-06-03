import React, { useState, useEffect } from "react";
import "./styles/CardTouristContainer.css";
import CardTourist from "./CardTourist";

const CardTravelerContainer = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/places'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }
        const data = await response.json();
        setPlaces(data);
      } catch (err) {
        setError(err.message);
        // Fallback data if API fails
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  if (loading) {
    return <div className="card-tourist-container">Loading...</div>;
  }

  if (error) {
    console.error('Error fetching places:', error);
  }
  return (
    <div className="card-tourist-container">
          {places.length > 0 ? (
            places.map((item, index) => (
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
              {places.length === 0
                ? `No tourist attractions found for place`
                : "No tourist attractions available"}
            </div>
          )}
        </div>
  );
}
export default CardTravelerContainer;