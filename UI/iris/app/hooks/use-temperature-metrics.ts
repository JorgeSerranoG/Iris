import * as React from "react";
import type { TelemetryPoint } from "./use-telemetry-stream";

export function useTemperatureMetrics(
  visiblePoints: TelemetryPoint[],
  thresholds?: { maxHot?: number; minCold?: number }
) {
  const maxHot = thresholds?.maxHot ?? 30;
  const minCold = thresholds?.minCold ?? 20;

  const tempMetrics = React.useMemo(() => {
    if (visiblePoints.length === 0) {
      return {
        max: null as number | null,
        min: null as number | null,
        avg: null as number | null,
      };
    }

    let max = -Infinity;
    let min = Infinity;
    let sum = 0;

    for (const p of visiblePoints) {
      const t = p.t;
      if (t > max) max = t;
      if (t < min) min = t;
      sum += t;
    }

    return { max, min, avg: sum / visiblePoints.length };
  }, [visiblePoints]);

  const maxTempNum = tempMetrics.max;
  const minTempNum = tempMetrics.min;

  const maxDanger = maxTempNum != null && maxTempNum > maxHot;
  const minDanger = minTempNum != null && minTempNum < minCold;

  const maxTemp = maxTempNum == null ? "—" : `${maxTempNum.toFixed(2)} °C`;
  const minTemp = minTempNum == null ? "—" : `${minTempNum.toFixed(2)} °C`;
  const avgTemp =
    tempMetrics.avg == null ? "—" : `${tempMetrics.avg.toFixed(2)} °C`;

  return {
    tempMetrics,
    maxTempNum,
    minTempNum,
    maxDanger,
    minDanger,
    maxTemp,
    minTemp,
    avgTemp,
  };
}
