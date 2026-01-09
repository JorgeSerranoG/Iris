import * as React from "react";

export type LogItem = { ts: number; msg: string };

export function useLogBuffer(initial?: LogItem[], maxItems: number = 80) {
  const [logs, setLogs] = React.useState<LogItem[]>(
    () => initial ?? [{ ts: Date.now(), msg: "Dashboard iniciado" }]
  );

  const pushLog = React.useCallback(
    (msg: string) => {
      setLogs((prev) => {
        const next = [...prev, { ts: Date.now(), msg }];
        return next.slice(Math.max(0, next.length - maxItems));
      });
    },
    [maxItems]
  );

  return { logs, pushLog, setLogs };
}
