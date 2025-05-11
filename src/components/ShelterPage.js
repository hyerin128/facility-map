// ShelterPage.js

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CategoryButtons from "./CategoryButtons";
import MapComponent from "./MapComponent";
import FacilityCardList from "./FacilityCardList";

const ShelterPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [isCardListVisible, setIsCardListVisible] = useState(true);
  const cardRefs = useRef({});

  // 대피소 데이터 API에서 로드
  useEffect(() => {
    axios.get("http://localhost:8000/places", {
      params: { category: "대피소" }
    })
      .then((res) => {
        const sheltersWithType = res.data.map((s) => ({
          ...s,
          type: "대피소",
          id: `shelter${s.id}`,
        }));
        setFacilities(sheltersWithType);
      })
      .catch((err) => {
        console.error("대피소 데이터를 불러오는 데 실패했어요", err);
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

export default ShelterPage;
