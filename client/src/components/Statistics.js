import React, { useEffect, useState } from "react";
import { ArcElement, Chart, RadialLinearScale } from "chart.js";
import { TimeScale, LinearScale, CategoryScale } from "chart.js";
import LineChart from "../components/LineChart";

import PolarAreaChart from "../components/PolarChart";

Chart.register(
  TimeScale,
  LinearScale,
  CategoryScale,
  RadialLinearScale,
  ArcElement
);

const Statistic = () => {
  const [appointments, setAppointments] = useState(null);
  const [chartData, setChartData] = useState(null);

  const fetchAppointmentData = async () => {
    const response = await fetch("/api/appointment/getByMonth");
    const json = await response.json();

    if (response.ok) {
      setAppointments(json);
    }
  };

  const fetchChartData = async () => {
    const response = await fetch("/api/patientChart/getByCondition");
    const json = await response.json();
    if (response.ok) {
      setChartData(json);
    }
  };

  useEffect(() => {
    fetchAppointmentData();
    fetchChartData();
  }, []);

  return (
    <div className='statistics'>
      <div className='flex'>
        <div className='chart-container'>
          <LineChart appointmentsData={appointments} />
        </div>
        <div className='chart-container '>
          <PolarAreaChart chartData={chartData} />
        </div>
      </div>
    </div>
  );
};
export default Statistic;
