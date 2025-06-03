import React from 'react';
import SearchCampStay from '../components/SearchCampStay';
import { Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Weather from '../components/Weather';
import TabProvinces from '../components/TabProvinces';
import RecommendedStay from "../components/RecommendedStay";
import RecommendedCamp from '../components/RecommendedCamp';


function CampStay() {
  const { id } = useParams();
  const { t } = useTranslation();

  if (!id) {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>
          <SearchCampStay />
          <h1 style={{ margin: '2rem' }}>{t('CampStay.CampHeader')}</h1>
          <TabProvinces />
        </div>
        <Weather />
        <RecommendedCamp />
        <RecommendedStay />



      </>
    );
  } else {
    return (
      <div>
        <Outlet />
      </div>
    );
  }
}

export default CampStay;
