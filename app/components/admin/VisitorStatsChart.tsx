"use client";

import { useEffect, useState } from 'react';
import { ChartBarIcon } from "@heroicons/react/24/outline";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface VisitorStats {
  daily: number[];
  weekly: number[];
}

// Mock veriler
const generateMockData = () => {
  const daily = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 50);
  const weekly = daily.map(value => value * 7);
  return { daily, weekly };
};

export default function VisitorStatsChart() {
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    daily: [],
    weekly: []
  });

  useEffect(() => {
    // Burada gerçek Google Analytics API çağrısı yapılacak
    const mockData = generateMockData();
    setVisitorStats(mockData);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          color: '#374151',
          drawBorder: false
        },
        ticks: {
          color: '#9CA3AF'
        }
      },
      y: {
        grid: {
          color: '#374151',
          drawBorder: false
        },
        ticks: {
          color: '#9CA3AF',
          callback: function(value: string | number) {
            if (typeof value === 'number') {
              return value.toLocaleString('tr-TR');
            }
            return value;
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    elements: {
      line: {
        tension: 0.3
      }
    }
  };

  const chartData = {
    labels: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 6 + i);
      return date.toLocaleDateString('tr-TR', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Günlük Ziyaretçi',
        data: visitorStats.daily,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      },
      {
        label: 'Haftalık Ziyaretçi',
        data: visitorStats.weekly,
        borderColor: 'rgb(244, 63, 94)',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(244, 63, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  return (
    <div className="rounded-lg bg-gray-800 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white">Site Ziyaretçileri</h2>
          <p className="mt-1 text-sm text-gray-400">Son 7 günün ziyaretçi istatistikleri</p>
        </div>
        <ChartBarIcon className="h-6 w-6 text-gray-400" />
      </div>
      <div className="mt-6 h-[300px]">
        <Line options={chartOptions} data={chartData} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-700 p-4">
          <p className="text-sm font-medium text-gray-400">Günlük Ortalama</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {Math.round(visitorStats.daily.reduce((a, b) => a + b, 0) / 7).toLocaleString('tr-TR')}
          </p>
        </div>
        <div className="rounded-lg bg-gray-700 p-4">
          <p className="text-sm font-medium text-gray-400">Haftalık Toplam</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {visitorStats.weekly[visitorStats.weekly.length - 1]?.toLocaleString('tr-TR') || '0'}
          </p>
        </div>
      </div>
    </div>
  );
} 