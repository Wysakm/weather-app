import React from 'react';
import SearchCampStay from '../components/SearchCampStay';
import CampSearchRec from '../components/CampSearchRac';
import { Outlet, useParams } from 'react-router-dom';
import CampBox from '../components/CampBox';
import StayBox from '../components/StayBox';


function CampStay() {
  const { id } = useParams();

  if (!id) {
    return (
      <>
        <SearchCampStay />
        <CampSearchRec />
        <CampBox />
        <StayBox />
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
