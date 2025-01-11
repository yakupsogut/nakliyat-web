"use client";

import { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabase";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyStats {
  teklifler: number[];
  mesajlar: number[];
}

export default function MonthlyStatsChart() {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    teklifler: [],
    mesajlar: []
  });

  useEffect(() => {
    fetchMonthlyStats();
  }, []);

  const fetchMonthlyStats = async () => {
    try {
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date;
      }).reverse();

      const monthlyTeklifler = await Promise.all(
        last6Months.map(async (date) => {
          const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
          const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

          const { count } = await supabase
            .from('teklifler')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfMonth.toISOString())
            .lte('created_at', endOfMonth.toISOString());

          return count || 0;
        })
      );

      const monthlyMesajlar = await Promise.all(
        last6Months.map(async (date) => {
          const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
          const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

          const { count } = await supabase
            .from('iletisim_mesajlari')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfMonth.toISOString())
            .lte('created_at', endOfMonth.toISOString());

          return count || 0;
        })
      );

      setMonthlyStats({
        teklifler: monthlyTeklifler,
        mesajlar: monthlyMesajlar
      });
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9CA3AF'
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#9CA3AF'
        }
      },
      y: {
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#9CA3AF'
        }
      }
    }
  };

  const chartData = {
    labels: Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - 5 + i);
      return date.toLocaleString('tr-TR', { month: 'short' });
    }),
    datasets: [
      {
        label: 'Teklifler',
        data: monthlyStats.teklifler,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Mesajlar',
        data: monthlyStats.mesajlar,
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="rounded-lg bg-gray-800 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-white">Aylık İstatistikler</h2>
        <ChartBarIcon className="h-6 w-6 text-gray-400" />
      </div>
      <div className="mt-6 h-[300px]">
        <Bar options={chartOptions} data={chartData} />
      </div>
    </div>
  );
} 