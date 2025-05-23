import React from "react";
import { useTranslation } from "react-i18next";
import "./styles/TravelerContainer.css";
import CardTravelerContainer from "./CardTravelerContainer";

const TravelerContainer = () => {
  const { t } = useTranslation();

  return (
    <div className="travelerExprience-container">
      <h2>{t("Travel.Traveler")}</h2>
    
      <CardTravelerContainer />
    </div>

    
  );
};

export default TravelerContainer;