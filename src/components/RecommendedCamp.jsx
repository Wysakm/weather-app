import React, { useState } from "react"; 
import { useTranslation } from "react-i18next"; 
import "./styles/RecommendedCamp.css";
import TabProvinces from "./TabProvinces";
import CardCampContainer from "./CardCampcontainer"; // Assuming this is the correct path
 
const RecommendedCamp = () => {
  const { t } = useTranslation();
  const [selectedProvince, setSelectedProvince] = useState("");

  return (
    <div className="camp-container">
      <div className="camp-head">
      <h1>
        {t("Recommend.Camp")}
      </h1>
      </div>
       <div className="camp-box">
        <TabProvinces onProvinceSelect={setSelectedProvince} />
        <CardCampContainer selectedProvince={selectedProvince} />
      </div>
    

    </div>
  );
}

export default RecommendedCamp;