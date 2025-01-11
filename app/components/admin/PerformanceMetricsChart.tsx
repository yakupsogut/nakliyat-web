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
import { onCLS, onFID, onLCP } from 'web-vitals';

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

interface PerformanceMetrics {
  cls: number[];  // Cumulative Layout Shift
  fid: number[];  // First Input Delay
  lcp: number[];  // Largest Contentful Paint
  timestamps: string[];
}

export default function PerformanceMetricsChart() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cls: [],
    fid: [],
    lcp: [],
    timestamps: []
  });

  useEffect(() => {
    // Web Vitals metriklerini topla
    onCLS((metric) => {
      setMetrics(prev => ({
        ...prev,
        cls: [...prev.cls, metric.value],
        timestamps: [...prev.timestamps, new Date().toLocaleTimeString()]
      }));
    });

    onFID((metric) => {
      setMetrics(prev => ({
        ...prev,
        fid: [...prev.fid, metric.value]
      }));
    });

    onLCP((metric) => {
      setMetrics(prev => ({
        ...prev,
        lcp: [...prev.lcp, metric.value]
      }));
    });
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
          color: '#9CA3AF'
        },
        min: 0
      }
    }
  };

  const chartData = {
    labels: metrics.timestamps,
    datasets: [
      {
        label: 'Cumulative Layout Shift (CLS)',
        data: metrics.cls,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true
      },
      {
        label: 'First Input Delay (FID)',
        data: metrics.fid,
        borderColor: 'rgb(244, 63, 94)',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true
      },
      {
        label: 'Largest Contentful Paint (LCP)',
        data: metrics.lcp,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true
      }
    ]
  };

  const getPerformanceStatus = (metric: string, value: number) => {
    switch (metric) {
      case 'CLS':
        return value < 0.1 ? 'İyi' : value < 0.25 ? 'Geliştirilebilir' : 'Kötü';
      case 'FID':
        return value < 100 ? 'İyi' : value < 300 ? 'Geliştirilebilir' : 'Kötü';
      case 'LCP':
        return value < 2500 ? 'İyi' : value < 4000 ? 'Geliştirilebilir' : 'Kötü';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'İyi':
        return 'text-green-400';
      case 'Geliştirilebilir':
        return 'text-yellow-400';
      case 'Kötü':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="rounded-lg bg-gray-800 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white">Performans Metrikleri</h2>
          <p className="mt-1 text-sm text-gray-400">Gerçek zamanlı sayfa performans ölçümleri</p>
        </div>
        <ChartBarIcon className="h-6 w-6 text-gray-400" />
      </div>
      <div className="mt-6 h-[300px]">
        <Line options={chartOptions} data={chartData} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {[
          { name: 'CLS', value: metrics.cls[metrics.cls.length - 1] || 0 },
          { name: 'FID', value: metrics.fid[metrics.fid.length - 1] || 0 },
          { name: 'LCP', value: metrics.lcp[metrics.lcp.length - 1] || 0 }
        ].map((metric) => {
          const status = getPerformanceStatus(metric.name, metric.value);
          return (
            <div key={metric.name} className="rounded-lg bg-gray-700 p-4">
              <p className="text-sm font-medium text-gray-400">{metric.name}</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {metric.value.toFixed(2)}
              </p>
              <p className={`mt-1 text-sm font-medium ${getStatusColor(status)}`}>
                {status}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
} 