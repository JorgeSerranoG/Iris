import * as React from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Cog } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { WINDOW_OPTIONS } from "~/config/dashboard";

const ACCENT_1 = "#8FE4F2";
const ACCENT_3 = "#71ADDE";

type ChartPoint = { x: number; t: number };

export function TemperatureChartCard(props: {
  chartData: ChartPoint[];
  domainX: [number, number];
  streamStatus: string;
  latestTemp: string;
  onChangeWindowMs: (ms: number) => void;
}) {
  const { chartData, domainX, streamStatus, latestTemp, onChangeWindowMs } = props;

  return (
    <Card className="bg-card/30 border-border/60 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base">Traffic Overview</CardTitle>
            <div className="text-sm text-muted-foreground">
              Live temperature (temp_c)
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Stream: <span className="text-foreground/80">{streamStatus}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Latest: <span className="text-foreground/80">{latestTemp}</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Cog className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {WINDOW_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt.ms}
                    onClick={() => onChangeWindowMs(opt.ms)}
                  >
                    Last {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80 w-full rounded-xl border border-border/60 bg-linear-to-b from-foreground/5 to-transparent p-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="talosStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={ACCENT_1} />
                  <stop offset="100%" stopColor={ACCENT_3} />
                </linearGradient>

                <linearGradient id="talosFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT_1} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={ACCENT_3} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" opacity={0.25} />


              <XAxis
                dataKey="x"
                type="number"
                scale="time"
                domain={domainX}
                allowDataOverflow
                padding={{ left: 0, right: 0 }}
                tick={false}
                tickLine={false}
                axisLine={false}
              />

              <YAxis domain={["auto", "auto"]} opacity={0.8} />

              <RechartsTooltip
                labelFormatter={(v) => new Date(v as number).toLocaleTimeString()}
                formatter={(value) => [`${value} °C`, "temp_c"]}
                contentStyle={{
                  background: "rgba(0,0,0,0.88)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  color: "hsl(var(--popover-foreground))",
                  boxShadow: "0 14px 40px rgba(0,0,0,0.55)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
                labelStyle={{
                  color: "hsl(var(--popover-foreground))",
                  fontSize: 12,
                  marginBottom: 6,
                }}
                itemStyle={{
                  color: "hsl(var(--popover-foreground))",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="t"
                stroke="none"
                fill="url(#talosFill)"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />

              <Line
                type="monotone"
                dataKey="t"
                stroke="#ffffff"
                strokeOpacity={0.95}
                strokeWidth={2}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
                animationDuration={250}
                animationEasing="linear"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}