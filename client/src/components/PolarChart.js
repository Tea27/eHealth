import React from "react";
import { PolarArea } from "react-chartjs-2";
import { Chart, Legend } from "chart.js";
import {
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Title,
  Tooltip
);

const PolarAreaChart = ({ chartData }) => {
  if (!chartData) {
    return <div>Loading...</div>;
  }
  const labels = chartData.map((dataItem) => dataItem._id);
  const dataValues = chartData.map((dataItem) => dataItem.count);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Diseases Dataset",
        data: dataValues,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(255, 205, 86)",
          "rgb(201, 203, 207)",
          "rgb(54, 162, 235)",
          "rgb(165, 105, 189)",
          "rgb(31, 97, 141)",
          "rgb(46, 64, 83",
        ],
      },
    ],
  };

  const options = {
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Diseases reported through year",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className='chart-container'>
      <PolarArea data={data} options={options} />
    </div>
  );
};

export default PolarAreaChart;
