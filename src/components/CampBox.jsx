import React from "react"; 
import { useTranslation } from "react-i18next"; 
import "./styles/RecommendedCamp.css";
import CardCampBox from "./CardCampBox"; // Assuming this is the correct path
 
const CampBox = () => {
  const { t } = useTranslation();

  return (
    <div className="camp-container">
      <div className="camp-head">
      <h1>
        {t("Recommend.Camp")}
      </h1>
      </div>
       <div className="camp-box">
        <CardCampBox />
      </div>
    

    </div>
  );
}

export default CampBox;