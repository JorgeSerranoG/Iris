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
import { Cog, Pencil } from "lucide-react";
import { useParams } from "react-router";

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

type TelemetryPoint = { x: number; t: number };
type LogItem = { ts: number; msg: string };

const WINDOW_OPTIONS = [
  { label: "30 s", ms: 30_000 },
  { label: "1 min", ms: 60_000 },
  { label: "2 min", ms: 120_000 },
  { label: "5 min", ms: 300_000 },
  { label: "10 min", ms: 600_000 },
] as const;

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function MetricCard(props: {
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
        props.danger && "border-red-500/60 bg-red-500/10"
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

function ProgressRow(props: { label: string; value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (props.value / props.max) * 100));
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3">
      <div className="space-y-1">
        <div className="text-sm text-foreground/90">{props.label}</div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
          <div
            className="h-full rounded-full bg-foreground/80"
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

      <rect
        x="20"
        y="20"
        width="860"
        height="380"
        rx="24"
        fill="url(#g_uc_dash)"
      />
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
        <CardTitle className="text-2xl">
          {props.title ?? "En desarrollo"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 py-10">
        <div className="space-y-2 text-center">
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
  const { deviceId } = useParams<{ deviceId: string }>();

  // -----------------------
  // Logs
  // -----------------------
  const [logs, setLogs] = React.useState<LogItem[]>(() => [
    { ts: Date.now(), msg: "Dashboard iniciado" },
  ]);

  const pushLog = React.useCallback((msg: string) => {
    setLogs((prev) => {
      const next = [...prev, { ts: Date.now(), msg }];
      return next.slice(Math.max(0, next.length - 80));
    });
  }, []);

  // -----------------------
  // Device name editing
  // -----------------------
  const initialName = React.useMemo(
    () => (deviceId ? deviceId : "Dispositivo"),
    [deviceId]
  );

  const [deviceName, setDeviceName] = React.useState(initialName);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [draftName, setDraftName] = React.useState(initialName);

  React.useEffect(() => {
    setDeviceName(initialName);
    setDraftName(initialName);
    setIsEditingName(false);
  }, [initialName]);

  const commitName = React.useCallback(() => {
    const next = draftName.trim() || "Dispositivo";
    setDeviceName(next);
    setDraftName(next);
    setIsEditingName(false);
  }, [draftName]);

  const cancelName = React.useCallback(() => {
    setDraftName(deviceName);
    setIsEditingName(false);
  }, [deviceName]);

  // -----------------------
  // Telemetry stream
  // -----------------------
  const [points, setPoints] = React.useState<TelemetryPoint[]>([]);
  const [windowMs, setWindowMs] = React.useState<number>(120_000);

  const [streamStatus, setStreamStatus] = React.useState<
    "connecting" | "connected" | "error" | "closed"
  >("connecting");

  const [lastTelemetryAt, setLastTelemetryAt] = React.useState<number | null>(
    null
  );

  // For chart domain progression even if new points are sparse.
  const [viewNow, setViewNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const id = window.setInterval(() => setViewNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, []);

  React.useEffect(() => {
    setStreamStatus("connecting");

    // If your backend supports device scoping, consider:
    // const es = new EventSource(`/api/telemetry/stream?deviceId=${encodeURIComponent(deviceId ?? "")}`);
    const es = new EventSource("/api/telemetry/stream");

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

            // Hard retention to avoid unbounded memory (10 minutes).
            const cutoff = Math.max(Date.now(), x) - 10 * 60_000;
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
  }, []);

  const isTelemetryFresh =
    lastTelemetryAt != null && Date.now() - lastTelemetryAt <= 5_000;
  const isDeviceConnected = streamStatus === "connected" && isTelemetryFresh;

  // -----------------------
  // Derived device info (mock + computed)
  // -----------------------
  const batteryPct = React.useMemo(() => {
    const s = String(deviceId ?? "device");
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return 35 + (h % 66);
  }, [deviceId]);

  const connectionQuality = React.useMemo(() => {
    if (isDeviceConnected) return { label: "Good", pct: 86 };
    if (streamStatus === "connected") return { label: "Poor", pct: 32 };
    if (streamStatus === "connecting") return { label: "—", pct: 0 };
    return { label: "Offline", pct: 0 };
  }, [isDeviceConnected, streamStatus]);

  const lastUplink = React.useMemo(() => {
    if (lastTelemetryAt == null) return "—";
    return new Date(lastTelemetryAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, [lastTelemetryAt]);

  const packetsWindow = points.length;

  const packets24h = React.useMemo(() => {
    if (!points.length) return 0;
    // Rough "rate" projection from current window density (kept as mock-ish metric).
    const pts = points.length;
    const approx = Math.round(pts * 12 * 24);
    return Math.max(pts, approx);
  }, [points.length]);

  // -----------------------
  // Chart domain + visible window
  // -----------------------
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

  // -----------------------
  // Event logs (connection + records + thresholds)
  // -----------------------
  const prevConnectedRef = React.useRef(false);
  const prevMaxRef = React.useRef<number | null>(null);
  const prevMinRef = React.useRef<number | null>(null);
  const prevMaxDangerRef = React.useRef(false);
  const prevMinDangerRef = React.useRef(false);

  React.useEffect(() => {
    if (prevConnectedRef.current !== isDeviceConnected) {
      pushLog(
        isDeviceConnected ? "Dispositivo conectado" : "Dispositivo desconectado"
      );
      prevConnectedRef.current = isDeviceConnected;
    }

    if (
      maxTempNum != null &&
      (prevMaxRef.current == null || maxTempNum > prevMaxRef.current)
    ) {
      pushLog(`Nueva temperatura máxima registrada: ${maxTempNum.toFixed(2)} °C`);
      prevMaxRef.current = maxTempNum;
    }

    if (
      minTempNum != null &&
      (prevMinRef.current == null || minTempNum < prevMinRef.current)
    ) {
      pushLog(`Nueva temperatura mínima registrada: ${minTempNum.toFixed(2)} °C`);
      prevMinRef.current = minTempNum;
    }

    if (prevMaxDangerRef.current !== maxDanger) {
      pushLog(
        maxDanger
          ? "Se ha superado la temperatura máxima establecida"
          : "Temperatura máxima vuelve a rango normal"
      );
      prevMaxDangerRef.current = maxDanger;
    }

    if (prevMinDangerRef.current !== minDanger) {
      pushLog(
        minDanger
          ? "Temperatura por debajo de la mínima establecida"
          : "Temperatura mínima vuelve a rango normal"
      );
      prevMinDangerRef.current = minDanger;
    }
  }, [isDeviceConnected, maxTempNum, minTempNum, maxDanger, minDanger, pushLog]);

  const maxTemp = maxTempNum == null ? "—" : `${maxTempNum.toFixed(2)} °C`;
  const minTemp = minTempNum == null ? "—" : `${minTempNum.toFixed(2)} °C`;
  const avgTemp =
    tempMetrics.avg == null ? "—" : `${tempMetrics.avg.toFixed(2)} °C`;

  const chartData = React.useMemo(() => {
    if (visiblePoints.length === 0) return [];
    const first = visiblePoints[0];
    // prepend a point so the area fills nicely from the domain start
    if (first.x > domainStart) return [{ x: domainStart, t: first.t }, ...visiblePoints];
    return visiblePoints;
  }, [visiblePoints, domainStart]);

  const latestTemp =
    visiblePoints.length > 0
      ? `${visiblePoints[visiblePoints.length - 1].t.toFixed(2)} °C`
      : "—";

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-300 px-6 py-8">
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <Input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitName();
                      if (e.key === "Escape") cancelName();
                    }}
                    onBlur={commitName}
                    className="h-10 w-90 max-w-full bg-card/30 border-border/60 text-xl font-semibold"
                    autoFocus
                  />
                ) : (
                  <>
                    <h1 className="truncate text-4xl font-semibold tracking-tight">
                      {deviceName}
                    </h1>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="rounded-md p-1 text-muted-foreground/70 transition-colors hover:bg-card/30 hover:text-muted-foreground"
                      aria-label="Editar nombre del dispositivo"
                      title="Editar nombre"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span
                className={cx(
                  "h-2.5 w-2.5 rounded-full",
                  isDeviceConnected ? "bg-emerald-500" : "bg-red-500"
                )}
              />
              <span
                className={cx(
                  "text-sm font-medium",
                  isDeviceConnected ? "text-emerald-400" : "text-red-400"
                )}
              >
                {isDeviceConnected ? "Conectado" : "Desconectado"}
              </span>
            </div>
          </div>

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
                        <CardTitle className="text-base">
                          Traffic Overview
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          Live temperature (temp_c)
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            Stream:{" "}
                            <span className="text-foreground/80">
                              {streamStatus}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Latest:{" "}
                            <span className="text-foreground/80">
                              {latestTemp}
                            </span>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
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
                        <AreaChart
                          data={chartData}
                          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="tempFill"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#ffffff"
                                stopOpacity={0.12}
                              />
                              <stop
                                offset="100%"
                                stopColor="#ffffff"
                                stopOpacity={0}
                              />
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
                  <MetricCard
                    title="Average temperature"
                    value={avgTemp}
                    delta="-4.5º"
                  />
                  <MetricCard
                    title="Connected devices"
                    value="3m 24s"
                    delta="-2"
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <Card className="bg-card/30 border-border/60 backdrop-blur">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Device info</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        Estado y telemetría del dispositivo
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <ProgressRow
                        label="Connection quality"
                        value={connectionQuality.pct}
                        max={100}
                      />
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
                          <div className="text-sm text-foreground/90">
                            Last uplink
                          </div>
                          <div className="text-sm tabular-nums text-foreground/80">
                            {lastUplink}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm text-foreground/90">
                            Packets (24h)
                          </div>
                          <div className="text-sm tabular-nums text-foreground/80">
                            {packets24h.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-border/50" />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm text-foreground/90">
                            Packets (window)
                          </div>
                          <div className="text-sm tabular-nums text-foreground/80">
                            {packetsWindow.toLocaleString()}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm text-foreground/90">Stream</div>
                          <div className="text-sm text-foreground/80">
                            {streamStatus}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

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
                            <div className="text-muted-foreground">
                              Sin eventos.
                            </div>
                          ) : (
                            logs
                              .slice()
                              .reverse()
                              .map((l, idx) => {
                                const hhmm = new Date(l.ts).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                );
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
