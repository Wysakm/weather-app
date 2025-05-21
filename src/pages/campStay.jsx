import React, { useEffect, useState } from 'react';
import SearchCampStay from '../components/SearchCampStay';
import CampSearchRec from '../components/CampSearchRac';
import { Outlet, useParams } from 'react-router-dom';
import CampBox from '../components/CampBox';

function CampStay() {
  const { id } = useParams();
  // const [articleType, setArticleType] = useState(null);

  // useEffect(() => {
  //   if (placesId) setArticleType('places');
  //   else if (stayId) setArticleType('stay');
  //   else if (campId) setArticleType('camp');
  //   else setArticleType('');

  // }, [id]);

  if (!id) {
    return (
      <>
        <SearchCampStay />
        <CampSearchRec />
        <CampBox />
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
