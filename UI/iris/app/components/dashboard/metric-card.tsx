import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cx } from "~/lib/cx";

export function MetricCard(props: {
  title: string;
  value: string;
  delta: string;
  deltaHint?: string;
  danger?: boolean;
}) {
  return (
    <Card
      className={cx(
        "bg-card/40 border-border/60 backdrop-blur",
        props.danger ? "border-red-500/60 bg-red-500/10" : ""
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {props.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-3xl font-semibold tracking-tight">
          {props.value}
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="text-foreground/80">{props.delta}</span>{" "}
          {props.deltaHint ?? "vs last week"}
        </div>
      </CardContent>
    </Card>
  );
}
