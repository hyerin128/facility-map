import React from "react";
import DetailCard from "./DetailCard";

const FacilityCardList = ({
  facilities,              // 시설 데이터
  selectedFacilityId,      // 클릭된 시설 ID
  onCloseCard,             // 카드 하이라이트 해제 함수
  cardRefs,                // 카드 DOM 참조 저장소
  isVisible,               // 카드 리스트 열림 여부
  setIsVisible,            // 열림 여부 설정 함수
}) => {
  // 카드 리스트가 닫힌 상태
  if (!isVisible) {
    return (
      <div
        style={{
          width: "30px",
          height: "100vh",
          backgroundColor: "#f8f8f8",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 열기 버튼 */}
        <button
          onClick={() => setIsVisible(true)}
          style={{
            fontSize: "18px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
          aria-label="카드 리스트 열기"
        >
          {`<`}
        </button>
      </div>
    );
  }

  // 카드 리스트가 열려 있는 상태
  return (
    <div
      style={{
        width: "25%",
        padding: "1rem",
        backgroundColor: "#f8f8f8",
        height: "90vh",
        overflowY: "auto",
        position: "relative",
      }}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={() => setIsVisible(false)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "transparent",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
        }}
        aria-label="카드 리스트 닫기"
      >
        X
      </button>

      {/* 시설별 카드 출력 */}
      {facilities.map((facility) => (
        <div
          key={facility.id}
          ref={(el) => (cardRefs.current[facility.id] = el)}
        >
          <DetailCard
            facility={facility}
            isSelected={facility.id === selectedFacilityId}
            onClose={onCloseCard}
          />
        </div>
      ))}
    </div>
  );
};

export default FacilityCardList;