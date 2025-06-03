import React, { useState } from "react"; 
import { useTranslation } from "react-i18next"; 
import "./styles/RecommendedStay.css";
import TabProvinces from "./TabProvinces";
import CardStayContainer from "./CardStayContainer"; // Assuming this is the correct path
 
const RecommendedStay = () => {
  const { t } = useTranslation();
  const [selectedProvince, setSelectedProvince] = useState("");

  return (
    <div className="stay-container">
      <div className="stay-head">
      <h1>
        {t("Recommend.Stay")}
      </h1>
      </div>
       <div className="stay-box-B">
        <TabProvinces onProvinceSelect={setSelectedProvince} />
        <CardStayContainer selectedProvince={selectedProvince} />
      </div>
    

    </div>
  );
}

export default RecommendedStay;