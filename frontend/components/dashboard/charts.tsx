"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CategoryPoint, ChartPoint } from "@/types/dashboard";

/** Fallback hex series (light/dark) when CSS variables are unavailable. */
const FALLBACK: Record<"light" | "dark", string[]> = {
  light: ["#3E7096", "#C56443", "#6F8854", "#C68E31", "#836687"],
  dark: ["#75A7C9", "#E38769", "#9BB379", "#E2B158", "#AD90B0"],
};

interface ChartColors {
  series: string[];
  grid: string;
  axis: string;
  tooltipBg: string;
  tooltipText: string;
}

/** Reads theme-aware colors from CSS variables at runtime. */
function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>({
    series: FALLBACK.light,
    grid: "#e4e4e7",
    axis: "#71717a",
    tooltipBg: "#ffffff",
    tooltipText: "#18181b",
  });

  useEffect(() => {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const isDark = root.classList.contains("dark");
    const read = (name: string, fallback: string) =>
      styles.getPropertyValue(name).trim() || fallback;

    setColors({
      series: Array.from({ length: 5 }, (_, index) =>
        read(`--color-viz-${index + 1}`, FALLBACK[isDark ? "dark" : "light"][index])
      ),
      grid: read("--border", "#e4e4e7"),
      axis: read("--muted-foreground", "#71717a"),
      tooltipBg: read("--popover", "#ffffff"),
      tooltipText: read("--popover-foreground", "#18181b"),
    });
  }, []);

  return colors;
}

function tooltipStyle(colors: ChartColors): React.CSSProperties {
  return {
    backgroundColor: colors.tooltipBg,
    color: colors.tooltipText,
    border: `1px solid ${colors.grid}`,
    borderRadius: 8,
    fontSize: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };
}

interface TrendChartProps {
  data: ChartPoint[];
  height?: number;
}

/** Area chart — revenue / progress over time. */
export function TrendAreaChart({ data, height = 260 }: TrendChartProps) {
  const colors = useChartColors();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.series[0]} stopOpacity={0.28} />
            <stop offset="100%" stopColor={colors.series[0]} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: colors.axis, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: colors.axis, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) =>
            value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)
          }
        />
        <Tooltip
          contentStyle={tooltipStyle(colors)}
          formatter={(value) => [Number(value ?? 0).toLocaleString(), "Value"]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={colors.series[0]}
          strokeWidth={2}
          fill="url(#trendFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Line chart — weekly attendance / progress. */
export function TrendLineChart({ data, height = 240 }: TrendChartProps) {
  const colors = useChartColors();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: colors.axis, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: colors.axis, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => `${value}%`}
        />
        <Tooltip
          contentStyle={tooltipStyle(colors)}
          formatter={(value) => [`${Number(value ?? 0)}%`, "Rate"]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={colors.series[1]}
          strokeWidth={2}
          dot={{ r: 3, fill: colors.series[1] }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface CategoryChartProps {
  data: CategoryPoint[];
  height?: number;
  /** Stacked/vertical bars by default; pass "horizontal" for ranking lists. */
  layout?: "vertical" | "horizontal";
}

/** Bar chart — enrolment by programme, grade distribution. */
export function CategoryBarChart({
  data,
  height = 260,
  layout = "vertical",
}: CategoryChartProps) {
  const colors = useChartColors();
  const horizontal = layout === "horizontal";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={layout}
        margin={{ top: 8, right: 8, left: horizontal ? 8 : -18, bottom: 0 }}
      >
        <CartesianGrid
          stroke={colors.grid}
          strokeDasharray="3 3"
          vertical={horizontal}
          horizontal={!horizontal}
        />
        <XAxis
          type={horizontal ? "number" : "category"}
          dataKey={horizontal ? undefined : "label"}
          tick={{ fill: colors.axis, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type={horizontal ? "category" : "number"}
          dataKey={horizontal ? "label" : undefined}
          width={horizontal ? 96 : undefined}
          tick={{ fill: colors.axis, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: colors.grid, opacity: 0.4 }}
          contentStyle={tooltipStyle(colors)}
          formatter={(value) => [Number(value ?? 0).toLocaleString(), "Count"]}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={horizontal ? 18 : 26}>
          {data.map((entry, index) => (
            <Cell
              key={entry.label}
              fill={colors.series[index % colors.series.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
