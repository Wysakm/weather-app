import React from "react";
import "./styles/CardStayContainer.css";
import CardTourist from "./CardTourist";

const CardStayContainer = () => {
  const _c = [
    {
      province: "Hà Nội",
      name: "Hồ Gươm",
      imgUrl: "https://example.com/image1.jpg",
    },
    {
      province: "Hà Giang",
      name: "Cao Nguyên Đá Đồng Văn",
      imgUrl: "https://example.com/image2.jpg",
    },
    {
      province: "Đà Nẵng",
      name: "Bà Nà Hills",
      imgUrl: "https://example.com/image3.jpg",
    }
  ];
  return (
    <div className="CardStay-container">
      {_c.map((item, index) => (
        <CardTourist key={index}
          province={item.province}
          name={item.name}
          imgUrl={item.imgUrl}
        />
      ))}
    </div>
  );
}
export default CardStayContainer;