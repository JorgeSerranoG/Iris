import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { LogItem } from "~/hooks/use-log-buffer";

export function LogsCard(props: { logs: LogItem[] }) {
  const { logs } = props;

  return (
    <Card className="bg-card/30 border-border/60 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Logs</CardTitle>
        <div className="text-sm text-muted-foreground">
          Actividad reciente del dispositivo
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-55 overflow-auto logs-scroll rounded-xl border border-border/60 bg-card/20 p-3">
          <div className="space-y-2 text-[16px] leading-snug">
            {logs.length === 0 ? (
              <div className="text-muted-foreground">Sin eventos.</div>
            ) : (
              logs
                .slice()
                .reverse()
                .map((l, idx) => {
                  const hhmm = new Date(l.ts).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <div
                      key={`${l.ts}-${idx}`}
                      className="flex gap-2 text-foreground/90"
                    >
                      <span className="tabular-nums text-muted-foreground">
                        {hhmm}:
                      </span>
                      <span className="wrap-break-word">{l.msg}</span>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
