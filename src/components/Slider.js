import React, { useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SliderComponent = ({ onYearChange, selectedYear }) => {
  const sliderRef = useRef(null);

  const data = [
    "2000년", "2005년", "2010년", "2015년", "2020년",
    "2022년", "2024년", "2025년 1월", "2025년 2월", "2025년 3월", "2025년 4월", "2025년 5월"
  ];
  const paddedData = [...data, "", ""];

  const settings = {
    className: "center",
    centerMode: true,
    infinite: false,
    centerPadding: "40px",
    slidesToShow: 3,
    speed: 500,
    arrows: true,
    dots: true,
    dotsClass: "slick-dots custom-dots",
    initialSlide: paddedData.findIndex(item => {
      const match = item.match(/^(\d{4})년/);
      return match && parseInt(match[1], 10) === selectedYear;
    }),
    afterChange: (currentIndex) => {
      if (currentIndex < data.length) {
        const match = paddedData[currentIndex].match(/^(\d{4})년/);
        if (match) {
          onYearChange(parseInt(match[1], 10));
        }
      }
    },
    appendDots: dots => (
      <ul style={{ bottom: "-15px" }}>{dots.slice(0, data.length)}</ul>
    )
  };

  // 🌀 마우스 휠 핸들링
  useEffect(() => {
    let lastScrollTime = 0;

    const handleWheel = (e) => {
      const now = new Date().getTime();
      if (now - lastScrollTime < 800) return; // 800ms 디바운스

      if (e.deltaY > 0) {
        sliderRef.current?.slickNext();
      } else {
        sliderRef.current?.slickPrev();
      }

      lastScrollTime = now;
    };

    const container = document.querySelector(".slider-container");
    container?.addEventListener("wheel", handleWheel);

    return () => {
      container?.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const slideStyle = {
    height: "100px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    margin: "0",
    transition: "transform 0.3s ease, color 0.3s ease"
  };

  return (
    <div className="slider-container"
      style={{
        position: "absolute",
        bottom: "10px",
        left: "30px",
        width: "65%",
        fontSize: "20px",
        fontWeight: "bold",
        zIndex: 150,
        padding: "20px",
        boxSizing: "border-box",
        overflow: "visible"
      }}
    >
      <Slider ref={sliderRef} {...settings}>
        {paddedData.map((item, i) => (
          <div key={i}>
            <div className="slide-box" style={slideStyle}>
              <h3 style={{ margin: 0 }}>{item}</h3>
            </div>
          </div>
        ))}
      </Slider>

      <style>{`        
        .slick-center .slide-box {
          transform: scale(1.6);
          color: rgb(244, 92, 17);
        }

        .slick-prev, .slick-next {
          z-index: 160;
        }

        .slick-prev {
          left: -10px !important; 
        }

        .slick-next {
          right: -10px !important;
        }

        .slick-prev::before,
        .slick-next::before {
          color:  rgb(4, 6, 161) !important;
          font-size: 25px;
        }

        .slick-dots.custom-dots li button:before {
          font-size: 10px;
          color: gray;
        }

        .slick-dots.custom-dots li.slick-active button:before {
          color: rgb(230, 84, 30);
        }
      `}</style>
    </div>
  );
};

export default SliderComponent;

