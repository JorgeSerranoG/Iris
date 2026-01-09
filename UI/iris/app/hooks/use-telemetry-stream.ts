import * as React from "react";

export type TelemetryPoint = { x: number; t: number };

type StreamStatus = "connecting" | "connected" | "error" | "closed";

export function useTelemetryStream(opts?: {
  url?: string;
  retentionMs?: number;
}) {
  const url = opts?.url ?? "/api/telemetry/stream";
  const retentionMs = opts?.retentionMs ?? 10 * 60_000;

  const [points, setPoints] = React.useState<TelemetryPoint[]>([]);
  const [streamStatus, setStreamStatus] = React.useState<StreamStatus>(
    "connecting"
  );
  const [lastTelemetryAt, setLastTelemetryAt] = React.useState<number | null>(
    null
  );

  React.useEffect(() => {
    setStreamStatus("connecting");
    const es = new EventSource(url);

    es.onopen = () => setStreamStatus("connected");
    es.onerror = () => setStreamStatus("error");

    es.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        const ts = msg?.ts;
        const temp = msg?.metrics?.temp_c;

        if (typeof ts === "string" && typeof temp === "number") {
          setLastTelemetryAt(Date.now());
          const x = new Date(ts).getTime();

          setPoints((prev) => {
            const next = [...prev, { x, t: temp }];
            const cutoff = Math.max(Date.now(), x) - retentionMs;
            return next.filter((p) => p.x >= cutoff);
          });
        }
      } catch {
        // ignore malformed messages
      }
    };

    return () => {
      es.close();
      setStreamStatus("closed");
    };
  }, [url, retentionMs]);

  return { points, setPoints, streamStatus, lastTelemetryAt };
}
