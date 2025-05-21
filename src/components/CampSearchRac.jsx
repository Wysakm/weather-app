import React from "react";
import { useTranslation } from 'react-i18next';
import "./styles/CampSearchRec.css";
import TabProvinces from "./TabProvinces";
import Weather from "./Weather";


const p = {
    "names": { "th": "กระบี่", "en": "Krabi" },
    "lat": 8.0863,
    "lon": 98.9063
  }
const CampSearchRac = () => {
  const { t } = useTranslation(); // ✅ เหลือแค่ t พอ

  return (
    <div className="campRec-container">
      <div className="campSearchRac-header">
        <h1>{t('CampStay.CampHeader')}</h1>
      </div>
      <TabProvinces />
      <Weather option={{ province: p }} />

    </div>
  );
}
export default CampSearchRac;