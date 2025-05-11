// MapPage.js

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import MapComponent from "./MapComponent";
import CategoryButtons from "./CategoryButtons";
import FacilityCardList from "./FacilityCardList";

const MapPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null); // 클릭된 시설 ID
  const [isCardListVisible, setIsCardListVisible] = useState(true); // 카드 보이기 여부
  const cardRefs = useRef({});

  // 전체 시설 API에서 불러오기
  useEffect(() => {
    axios
      .get("http://localhost:8000/places")
      .then((res) => {
        // id 앞에 prefix 붙여서 마커 & 카드 스크롤에 사용할 고유 ID 구성
        const updated = res.data.map((f) => ({
          ...f,
          id: `${f.type === "병원" ? "hospital" : "shelter"}_${f.id}`,
        }));
        setFacilities(updated); // ✅ 상태에 반영
      })
      .catch((err) => {
        console.error("전체 시설 데이터를 불러오지 못했어요", err);
      });
  }, []);

  // 마커 클릭 시: 선택 시설 ID 설정 + 카드 다시 보이게 + 스크롤 이동
  const handleMarkerClick = (facility) => {
    setSelectedFacilityId(facility.id);
    setIsCardListVisible(true);

    setTimeout(() => {
      cardRefs.current[facility.id]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* 지도 영역 */}
      <div style={{ flex: 1 }}>
        <CategoryButtons />
        <MapComponent facilities={facilities} onMarkerClick={handleMarkerClick} />
      </div>

      {/* 상세정보 카드 리스트 영역 */}
      <FacilityCardList
        facilities={facilities}
        selectedFacilityId={selectedFacilityId}
        onCloseCard={() => setSelectedFacilityId(null)}
        cardRefs={cardRefs}
        isVisible={isCardListVisible}
        setIsVisible={setIsCardListVisible}
      />
    </div>
  );
};

export default MapPage;
