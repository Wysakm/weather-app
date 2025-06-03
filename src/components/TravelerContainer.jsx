import React from "react";
import { useTranslation } from "react-i18next";
import "./styles/TravelerContainer.css";
import CardTravelerContainer from "./CardTravelerContainer";

const TravelerContainer = ({ id_place, id_post }) => {
  const { t } = useTranslation();

  return (
    <div className="travelerExprience-container">
      <h2>{t("Travel.Traveler")}</h2>

      <CardTravelerContainer id_place={id_place} id_post={id_post} />
    </div>


  );
};

export default TravelerContainer;