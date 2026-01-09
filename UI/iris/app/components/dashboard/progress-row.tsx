import * as React from "react";

export function ProgressRow(props: { label: string; value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (props.value / props.max) * 100));
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3">
      <div className="space-y-1">
        <div className="text-sm text-foreground/90">{props.label}</div>
        <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden">
          <div
            className="h-full bg-foreground/80 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="text-sm tabular-nums text-foreground/80">
        {props.value}
      </div>
    </div>
  );
}
