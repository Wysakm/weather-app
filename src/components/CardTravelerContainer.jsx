import React, { useState, useEffect } from "react";
import "./styles/CardTouristContainer.css";
import CardTourist from "./CardTourist";
import { postsAPI } from "../api/posts";

const CardTravelerContainer = ({ id_place, id_post }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const data = (await postsAPI.getAll(id_place)).data
          .filter((post) => post.id_post !== id_post)
          .slice(0, 3)

        setPosts(data);
      } catch (err) {
        setError(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [id_place, id_post]);

  if (loading) {
    return <div className="card-tourist-container">Loading...</div>;
  }

  if (error) {
    console.error('Error fetching places:', error);
  }

  // Hide the component if there are no posts to display
  if (posts.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="card-tourist-container">
      {posts.length > 0 ? (
        posts.map((item, index) => (
          <CardTourist
            key={index}
            id={item.id_post}
            province={item.place.province.name}
            name={item.title}
            imgUrl={item.image}
            type={item.place?.place_types?.name || "tourist"}
          />
        ))
      ) : (
        !loading && (
          <div className="no-data">
            No tourist attractions found for place
          </div>
        )
      )}
    </div>
  );
}
export default CardTravelerContainer;