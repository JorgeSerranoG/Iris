import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { ProgressRow } from "~/components/dashboard/progress-row";

export function DeviceInfoCard(props: {
  connectionQuality: { label: string; pct: number };
  batteryPct: number;
  lastUplink: string;
  packets24h: number;
  packetsWindow: number;
  streamStatus: string;
}) {
  const { connectionQuality, batteryPct, lastUplink, packets24h, packetsWindow, streamStatus } = props;

  return (
    <Card className="bg-card/30 border-border/60 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Device info</CardTitle>
        <div className="text-sm text-muted-foreground">
          Estado y telemetría del dispositivo
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ProgressRow label="Connection quality" value={connectionQuality.pct} max={100} />
        <div className="text-xs text-muted-foreground -mt-2">
          {connectionQuality.label}
        </div>

        <Separator className="bg-border/50" />

        <ProgressRow label="Battery" value={batteryPct} max={100} />
        <div className="text-xs text-muted-foreground -mt-2">
          {batteryPct}% (mock)
        </div>

        <Separator className="bg-border/50" />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-foreground/90">Last uplink</div>
            <div className="text-sm tabular-nums text-foreground/80">
              {lastUplink}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-foreground/90">Packets (24h)</div>
            <div className="text-sm tabular-nums text-foreground/80">
              {packets24h.toLocaleString()}
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-foreground/90">Packets (window)</div>
            <div className="text-sm tabular-nums text-foreground/80">
              {packetsWindow.toLocaleString()}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-foreground/90">Stream</div>
            <div className="text-sm text-foreground/80">{streamStatus}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
