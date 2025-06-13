import React from "react";
import '../styles-pages/places.css';
import PlacesTable from "../../components/admin/PlacesTable";

const Places = () => {
  return (
    <div className="placeManage-container">
      <PlacesTable />
    </div>
  );
}
export default Places;