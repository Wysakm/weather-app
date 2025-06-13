import React from 'react';
import SearchCampStay from '../components/SearchCampStay';
import { Outlet, useParams } from 'react-router-dom';
import Weather from '../components/Weather';
import RecommendedStay from "../components/RecommendedStay";
import RecommendedCamp from '../components/RecommendedCamp';


function CampStay() {
  const { id } = useParams();

  if (!id) {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <SearchCampStay />
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
