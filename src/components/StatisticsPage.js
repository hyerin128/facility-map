import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryButtons from "./CategoryButtons";
import StatisticsChart from "./StatisticsChart";


const StatisticsPage = () => {
  const [createdStats, setCreatedStats] = useState([]);
  const [operatingStats, setOperatingStats] = useState([]);
  const [capacityStats, setCapacityStats] = useState([]);
  const [statusStats, setStatusStats] = useState([]);

  useEffect(() => {
    // 병원 데이터 받아와서 통계 계산
    axios
      .get("http://localhost:8000/places?category=병원")
      .then((res) => {
        const hospitals = res.data;

        // 병원 설립 연도별 통계
        const yearMap = {};
        hospitals.forEach((h) => {
          const year = h.built_year;
          if (year) {
            yearMap[year] = (yearMap[year] || 0) + 1;
          }
        });
        const stats = Object.entries(yearMap)
          .map(([year, count]) => ({ year: Number(year), count }))
          .sort((a, b) => a.year - b.year);
        setCreatedStats(stats);

        // 병원 누적 운영 수
        const cumulativeMap = {};
        hospitals
          .filter((h) => h.status === "운영 중" && h.built_year)
          .forEach((h) => {
            const year = h.built_year;
            cumulativeMap[year] = (cumulativeMap[year] || 0) + 1;
          });
        const sortedYears = Object.keys(cumulativeMap)
          .map(Number)
          .sort((a, b) => a - b);
        let cumulative = 0;
        const cumulativeStats = sortedYears.map((year) => {
          cumulative += cumulativeMap[year];
          return { year, count: cumulative };
        });
        setOperatingStats(cumulativeStats);
      })
      .catch((err) => {
        console.error("병원 통계 데이터 불러오기 실패", err);
      });

    // 대피소 데이터 받아와서 통계 계산
    axios
      .get("http://localhost:8000/places?category=대피소")
      .then((res) => {
        const shelters = res.data;

        // 수용 인원 구간별 통계
        const capacityGroups = {
          "0–999": 0,
          "1000–2999": 0,
          "3000–5999": 0,
          "6000+": 0,
        };
        shelters.forEach((s) => {
          const cap = s.capacity;
          if (cap < 1000) capacityGroups["0–999"]++;
          else if (cap < 3000) capacityGroups["1000–2999"]++;
          else if (cap < 6000) capacityGroups["3000–5999"]++;
          else capacityGroups["6000+"]++;
        });
        const capStats = Object.entries(capacityGroups).map(
          ([range, count]) => ({ year: range, count })
        );
        setCapacityStats(capStats);

        // 운영 상태별 통계
        const statusMap = {};
        shelters.forEach((s) => {
          const status = s.status;
          statusMap[status] = (statusMap[status] || 0) + 1;
        });
        const statStats = Object.entries(statusMap).map(
          ([status, count]) => ({ year: status, count })
        );
        setStatusStats(statStats);
      })
      .catch((err) => {
        console.error("대피소 통계 데이터 불러오기 실패", err);
      });
  }, []);

  // csv 파일 다운로드 링크
  const targetUrl = "http://localhost:8000/places/download-csv";

  return (
    <div style={{ width: "100%", padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* 다운로드 버튼을 추가 */}
      <button
        onClick={() => {
          window.location.href = targetUrl;
        }}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontSize: "1rem",
          cursor: "pointer",
          alignSelf: "flex-start",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#45a049")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
      >
        csv파일 다운로드
      </button>
        
        <div style={{ flex: 1 }}>
            <CategoryButtons />
        </div>
        <h2>✔️ 병원</h2>
        <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ flex: 1 }}>
            <StatisticsChart title="연도별 병원 설립 수" data={createdStats} dataKey="count" fillColor="#A3C9A8" />
        </div>
        <div style={{ flex: 1 }}>
            <StatisticsChart title="운영 중인 병원 누적 수" data={operatingStats} dataKey="count" fillColor="#B0C4DE" />
        </div>
        </div>

        <h2>✔️ 대피소</h2>
        <div style={{ display: "flex", gap: "2rem" }}>
            <div style={{ flex: 1 }}>
                <StatisticsChart title="수용 인원 구간별 대피소 수" data={capacityStats} dataKey="count" fillColor="#F9D390" />
            </div>
            <div style={{ flex: 1 }}>
                <StatisticsChart title="운영 상태별 대피소 수" data={statusStats} dataKey="count" fillColor="#B0C4DE" type="pie" />
            </div>
        </div>
    </div>
  );
};

export default StatisticsPage;
