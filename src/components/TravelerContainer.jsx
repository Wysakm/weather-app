import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./styles/TravelerContainer.css";
import CardTravelerContainer from "./CardTravelerContainer";
import { postsAPI } from "../api/posts";

const TravelerContainer = ({ id_place, id_post }) => {
  const { t } = useTranslation();
  const [hasPosts, setHasPosts] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPosts = async () => {
      try {
        setLoading(true);
        const data = (await postsAPI.getAll(id_place)).data.filter(
          (post) => post.id_post !== id_post
        );

        setHasPosts(data.length > 0);
      } catch (err) {
        setHasPosts(false);
      } finally {
        setLoading(false);
      }
    };

    if (id_place) {
      checkPosts();
    }
  }, [id_place, id_post]);

  // Don't render the container if no posts or still loading
  if (loading || !hasPosts) {
    return null;
  }

  return (
    <div className="travelerExprience-container">
      <h2>{t("Travel.Traveler")}</h2>
      <CardTravelerContainer id_place={id_place} id_post={id_post} />
    </div>
  );
};

export default TravelerContainer;