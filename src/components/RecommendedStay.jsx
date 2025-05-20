import React from "react"; 
import { useTranslation } from "react-i18next"; 
import "./styles/RecommendedStay.css";
import CardStayContainer from "./CardStayContainer"; // Assuming this is the correct path
 
const RecommendedStay = () => {
  const { t } = useTranslation();

  return (
    <div className="stay-container">
      <div className="stay-head">
      <h1>
        {t("Recommend.Stay")}
      </h1>
      </div>
       <div className="stay-box">
        <CardStayContainer />
      </div>
    

    </div>
  );
}

export default RecommendedStay;