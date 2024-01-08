import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const LineChart = ({ appointmentsData }) => {
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
    ],
    datasets: [
      {
        label: "Appointments made through year",
        data: appointmentsData?.[0]?.data,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      animations: {
        tension: {
          duration: 1000,
          easing: "linear",
          from: 1,
          to: 0,
          loop: true,
        },
      },
    },
  };

  return (
    <div className='chart-container'>
      <Line data={data} options={config.options} />
    </div>
  );
};

export default LineChart;
