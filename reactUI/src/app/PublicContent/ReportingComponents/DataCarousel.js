import React from "react";
import { Carousel } from "react-bootstrap";

const DataCarousel = ({data}) => {
  function renderMessage(msgLabel, msgStat, decoration, isPercentage) {
    const percent = (isPercentage) ? "%" : "";
    switch (decoration) {
      case "italics":
        return (
          <> {msgLabel}: <i>{msgStat}{percent}</i> </>
        );
      case "bold":
        return (
          <> | {msgLabel}: <b>{msgStat}{percent}</b> | </>
        );
      default:
        return (
          <> | {msgLabel}: {msgStat}{percent} | </>
        );
    }
  }

  return (
    <Carousel
      controls={true}
      indicators={false}
      interval={3000}
      pause={false}
      className="custom-carousel"
    >
      {data.map((item, idx) => (
        <Carousel.Item key={idx}>
          <div className="custom-carousel-item">
            <h2><i>{item.label}</i></h2>
            <h5>
                |
                {item.message.map((_, i) =>
                renderMessage(item.message[i], item.stat[i].toFixed(2), item.decoration[i], item.isPercentage[i])
                )}
                |
            </h5>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default DataCarousel;
