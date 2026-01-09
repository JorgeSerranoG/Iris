import * as React from "react";
import type { TelemetryPoint } from "./use-telemetry-stream";

export function useChartWindow(points: TelemetryPoint[], windowMs: number) {
  const [viewNow, setViewNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setViewNow(Date.now());
    }, 50);

    return () => window.clearInterval(id);
  }, []);

  const lastX = points.length ? points[points.length - 1].x : 0;
  const effectiveNow = Math.max(viewNow, lastX);

  const domainStart = effectiveNow - windowMs;
  const domainX: [number, number] = [domainStart, effectiveNow];

  const visiblePoints = React.useMemo(
    () => points.filter((p) => p.x >= domainStart && p.x <= effectiveNow),
    [points, domainStart, effectiveNow]
  );

  const chartData = React.useMemo(() => {
    if (visiblePoints.length === 0) return [];
    const first = visiblePoints[0];
    if (first.x > domainStart) {
      return [{ x: domainStart, t: first.t }, ...visiblePoints];
    }
    return visiblePoints;
  }, [visiblePoints, domainStart]);

  const latestTemp =
    visiblePoints.length > 0
      ? `${visiblePoints[visiblePoints.length - 1].t.toFixed(2)} °C`
      : "—";

  return {
    domainStart,
    domainX,
    visiblePoints,
    chartData,
    latestTemp,
    effectiveNow,
  };
}
