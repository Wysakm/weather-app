import React from "react"; 
import { useTranslation } from "react-i18next"; 
import "./styles/RecommendedCamp.css";
import CardStayBox from "./CardStayBox"; // Assuming this is the correct path
 
const StayBox = () => {
  const { t } = useTranslation();

  return (
    <div className="camp-container">
      <div className="camp-head">
      <h1>
        {t("Recommend.Stay")}
      </h1>
      </div>
       <div className="camp-box">
        <CardStayBox />
      </div>
    

    </div>
  );
}

export default StayBox;