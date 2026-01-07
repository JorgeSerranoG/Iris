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

import AppShell from "~/components/layout/app-shell";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type TelemetryPoint = {
  x: number;
  t: number;
};

const WINDOW_OPTIONS = [
  { label: "30 s", ms: 30_000 },
  { label: "1 min", ms: 60_000 },
  { label: "2 min", ms: 120_000 },
  { label: "5 min", ms: 300_000 },
  { label: "10 min", ms: 600_000 },
];

function MetricCard(props: {
  title: string;
  value: string;
  delta: string;
  deltaHint?: string;
  danger?: boolean;
}) {
  return (
    <Card
      className={[
        "bg-card/40 border-border/60 backdrop-blur",
        props.danger ? "border-red-500/60 bg-red-500/10" : "",
      ].join(" ")}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {props.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-3xl font-semibold tracking-tight">{props.value}</div>
        <div className="text-xs text-muted-foreground">
          <span className="text-foreground/80">{props.delta}</span>{" "}
          {props.deltaHint ?? "vs last week"}
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressRow(props: { label: string; value: number; max: number }) {
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
      <div className="text-sm tabular-nums text-foreground/80">{props.value}</div>
    </div>
  );
}

function UnderConstructionIllustration() {
  return (
    <svg
      viewBox="0 0 900 420"
      className="w-full max-w-140 opacity-90"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="g_uc_dash" x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      <rect x="20" y="20" width="860" height="380" rx="24" fill="url(#g_uc_dash)" />
      <rect
        x="70"
        y="80"
        width="360"
        height="24"
        rx="12"
        fill="currentColor"
        opacity="0.25"
      />
      <rect
        x="70"
        y="130"
        width="520"
        height="16"
        rx="8"
        fill="currentColor"
        opacity="0.16"
      />
      <rect
        x="70"
        y="160"
        width="480"
        height="16"
        rx="8"
        fill="currentColor"
        opacity="0.12"
      />

      <rect
        x="70"
        y="220"
        width="760"
        height="120"
        rx="18"
        fill="currentColor"
        opacity="0.08"
      />
      <rect
        x="110"
        y="255"
        width="260"
        height="18"
        rx="9"
        fill="currentColor"
        opacity="0.18"
      />
      <rect
        x="110"
        y="285"
        width="360"
        height="14"
        rx="7"
        fill="currentColor"
        opacity="0.12"
      />
      <circle cx="770" cy="280" r="46" fill="currentColor" opacity="0.12" />
      <path
        d="M760 270h20M770 260v40"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UnderConstructionCard(props: { title?: string }) {
  return (
    <Card className="bg-card/30 border-border/60 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl">{props.title ?? "En desarrollo"}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 py-10">
        <div className="text-center space-y-2">
          <div className="text-lg font-medium">En desarrollo</div>
          <div className="text-sm text-muted-foreground">
            Esta sección estará disponible próximamente.
          </div>
        </div>
        <UnderConstructionIllustration />
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const [points, setPoints] = React.useState<TelemetryPoint[]>([]);
  const [windowMs, setWindowMs] = React.useState(120_000);

  const [viewNow, setViewNow] = React.useState(() => Date.now());

  const [streamStatus, setStreamStatus] = React.useState<
    "connecting" | "connected" | "error" | "closed"
  >("connecting");

  const pointsRef = React.useRef<TelemetryPoint[]>([]);
  React.useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setViewNow(Date.now());
    }, 50);

    return () => window.clearInterval(id);
  }, []);

  React.useEffect(() => {
    setStreamStatus("connecting");
    const es = new EventSource("/api/telemetry/stream");

    es.onopen = () => setStreamStatus("connected");
    es.onerror = () => setStreamStatus("error");

    es.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        const ts = msg?.ts;
        const temp = msg?.metrics?.temp_c;

        if (typeof ts === "string" && typeof temp === "number") {
          const x = new Date(ts).getTime();

          setPoints((prev) => {
            const next = [...prev, { x, t: temp }];

            const cutoff = Math.max(Date.now(), x) - 10 * 60_000;
            return next.filter((p) => p.x >= cutoff);
          });
        }
      } catch {

      }
    };

    return () => {
      es.close();
      setStreamStatus("closed");
    };
  }, []);

  const lastX = points.length ? points[points.length - 1].x : 0;
  const effectiveNow = Math.max(viewNow, lastX);

  const domainStart = effectiveNow - windowMs;
  const domainX: [number, number] = [domainStart, effectiveNow];

  const visiblePoints = React.useMemo(
    () => points.filter((p) => p.x >= domainStart && p.x <= effectiveNow),
    [points, domainStart, effectiveNow]
  );

  const tempMetrics = React.useMemo(() => {
    if (visiblePoints.length === 0) {
      return { max: null as number | null, min: null as number | null, avg: null as number | null };
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

  const maxDanger = maxTempNum != null && maxTempNum > 30;
  const minDanger = minTempNum != null && minTempNum < 20;

  const maxTemp = maxTempNum == null ? "—" : `${maxTempNum.toFixed(2)} °C`;
  const minTemp = minTempNum == null ? "—" : `${minTempNum.toFixed(2)} °C`;
  const avgTemp = tempMetrics.avg == null ? "—" : `${tempMetrics.avg.toFixed(2)} °C`;

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

  return (
    <AppShell>
      {/* Page */}
      <main className="mx-auto w-full max-w-300 px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>

          <div className="mt-4">
            <Tabs defaultValue="overview">
              <TabsList className="bg-card/30 border border-border/60">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
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
                            Stream:{" "}
                            <span className="text-foreground/80">{streamStatus}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Latest:{" "}
                            <span className="text-foreground/80">{latestTemp}</span>
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
                                onClick={() => setWindowMs(opt.ms)}
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
                            <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.12} />
                              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
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
                            labelFormatter={(v) =>
                              new Date(v as number).toLocaleTimeString()
                            }
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
                            fill="url(#tempFill)"
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

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <MetricCard
                    title="Max temperature"
                    value={maxTemp}
                    delta="+12.4%"
                    danger={maxDanger}
                  />
                  <MetricCard
                    title="Min temperature"
                    value={minTemp}
                    delta="+5.8%"
                    danger={minDanger}
                  />
                  <MetricCard title="Average temperature" value={avgTemp} delta="-4.5º" />
                  <MetricCard title="Connected devices" value="3m 24s" delta="-2" />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <Card className="bg-card/30 border-border/60 backdrop-blur">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Referrers</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        Top sources driving traffic
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ProgressRow label="Direct" value={512} max={600} />
                      <ProgressRow label="Product Hunt" value={238} max={600} />
                      <ProgressRow label="Twitter" value={174} max={600} />
                      <ProgressRow label="Blog" value={104} max={600} />
                    </CardContent>
                  </Card>

                  <Card className="bg-card/30 border-border/60 backdrop-blur">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Devices</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        How users access your app
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Desktop</span>
                          <span className="text-muted-foreground">74%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden">
                          <div
                            className="h-full bg-foreground/80 rounded-full"
                            style={{ width: "74%" }}
                          />
                        </div>
                      </div>

                      <Separator className="bg-border/50" />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Mobile</span>
                          <span className="text-muted-foreground">22%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden">
                          <div
                            className="h-full bg-foreground/80 rounded-full"
                            style={{ width: "22%" }}
                          />
                        </div>
                      </div>

                      <Separator className="bg-border/50" />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Tablet</span>
                          <span className="text-muted-foreground">4%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden">
                          <div
                            className="h-full bg-foreground/80 rounded-full"
                            style={{ width: "4%" }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <UnderConstructionCard title="Analytics" />
              </TabsContent>

              <TabsContent value="reports" className="mt-6">
                <UnderConstructionCard title="Reports" />
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <UnderConstructionCard title="Notifications" />
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

export default DashboardPage;
