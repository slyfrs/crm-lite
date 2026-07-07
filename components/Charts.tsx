"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Card } from "@/components/ui/Card";
import { getSourceLabel, getStatusLabel } from "@/lib/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function LeadsByStatusChart({
  data,
}: {
  data: { status: string; count: number }[];
}) {
  const chartData = {
    labels: data.map((d) => getStatusLabel(d.status)),
    datasets: [
      {
        label: "Лиды",
        data: data.map((d) => d.count),
        backgroundColor: [
          "rgba(249, 115, 22, 0.7)",
          "rgba(59, 130, 246, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card padding="md">
      <h3 className="font-semibold text-sm text-zinc-700 mb-3">Лиды по статусам</h3>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
        }}
      />
    </Card>
  );
}

export function LeadsBySourceChart({
  data,
}: {
  data: { source: string; count: number }[];
}) {
  const chartData = {
    labels: data.map((d) => getSourceLabel(d.source)),
    datasets: [
      {
        label: "Лиды",
        data: data.map((d) => d.count),
        backgroundColor: [
          "rgba(168, 85, 247, 0.7)",
          "rgba(6, 182, 212, 0.7)",
          "rgba(249, 115, 22, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(161, 161, 170, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card padding="md">
      <h3 className="font-semibold text-sm text-zinc-700 mb-3">Лиды по источникам</h3>
      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          plugins: { legend: { position: "bottom" } },
        }}
      />
    </Card>
  );
}

export function OpportunitiesByStageChart({
  data,
}: {
  data: { stage: string; count: number; totalAmount: number }[];
}) {
  const chartData = {
    labels: data.map((d) => d.stage),
    datasets: [
      {
        label: "Количество",
        data: data.map((d) => d.count),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card padding="md">
      <h3 className="font-semibold text-sm text-zinc-700 mb-3">Сделки по стадиям</h3>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
        }}
      />
    </Card>
  );
}
