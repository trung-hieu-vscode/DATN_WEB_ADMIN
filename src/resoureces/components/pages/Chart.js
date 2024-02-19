import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import revenueData from '../data/revenueData.json';
import sourceData from '../data/sourceData.json';
import "../css/Chart.css";

const Chart = () => {
  return (
    <div>
      <div className="title-container">
        <h1 className="">Thống kê</h1>
      </div>
    <div className="chart-container">

      <div className="chart-section">
        <Line
          data={{
            labels: revenueData.map((data) => data.label),
            datasets: [
              {
                label: "Doanh thu",
                data: revenueData.map((data) => data.revenue),
                backgroundColor: "#064FF0",
                borderColor: "#064FF0",
              },
              {
                label: "Chi phí",
                data: revenueData.map((data) => data.cost),
                backgroundColor: "#FF3030",
                borderColor: "#FF3030",
              },
            ],
          }}
          options={{
            elements: {
              line: {
                tension: 0.5,
              },
            },
            plugins: {
              title: {
                display: true,
                text: "Danh thu và chi phí",
              },
            },
          }}
        />
      </div>

      <div className="chart-section">
        <Doughnut
          data={{
            labels: sourceData.map((data) => data.label),
            datasets: [
              {
                label: "Count",
                data: sourceData.map((data) => data.value),
                backgroundColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
                borderColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Số lượng",
              },
            },
          }}
        />
      </div>
    </div>
    </div>
  );
};

export default Chart;
