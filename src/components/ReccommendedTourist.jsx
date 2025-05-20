import React from "react";
import { useTranslation } from "react-i18next";
import "./styles/RecommendedTourist.css";
import TabProvinces from "./TabProvinces";
import CardTouristContainer from "./CardTouristContainer";


const ReccommendedTourist = () => {
  const { t } = useTranslation();

  return (
    <div className="tourist-container">
      <h1>
        {t("Recommend.RecommendedTourist")}
      </h1>
      <div className="tourist-box">
        <TabProvinces />
        <CardTouristContainer />
      </div>
    </div>


  );
}
export default ReccommendedTourist;