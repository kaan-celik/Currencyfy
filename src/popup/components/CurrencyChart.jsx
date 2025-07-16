import React, { useEffect, useRef } from 'react';
import { Chart, LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Currencies } from '../constants';

Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip, Legend);

function randomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
}


export default function CurrencyChart({ data, currency }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx || !data.rates) return;

    const dates = Object.keys(data.rates)

    const datasets = Currencies.map(currency => {
    const currencyData = dates.map(date => {return 1 / data.rates[date][currency]});

    return {
      label: currency,
      data: currencyData,
      borderColor: randomColor(),
      fill: false
    };
  });

    const chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: datasets
      },
      options: {
        responsive: true,
        legend: {
        position: 'top',
        },
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });

    return () => chartInstance.destroy();
  }, [data, currency]);

  return (
    <div className="chart-container">
      <canvas ref={chartRef} width={320} height={200}></canvas>
    </div>
  );
}
