import * as React from "react";
import { useParams } from "react-router";

import AppShell from "~/components/layout/app-shell";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { MetricCard } from "~/components/dashboard/metric-card";
import { DeviceHeader } from "~/components/dashboard/device-header";
import { TemperatureChartCard } from "~/components/dashboard/temperature-chart-card";
import { DeviceInfoCard } from "~/components/dashboard/device-info-card";
import { LogsCard } from "~/components/dashboard/logs-card";
import { UnderConstructionCard } from "~/components/common/under-construction";

import { useLogBuffer } from "~/hooks/use-log-buffer";
import { useDeviceName } from "~/hooks/use-device-name";
import { useTelemetryStream } from "~/hooks/use-telemetry-stream";
import { useChartWindow } from "~/hooks/use-chart-window";
import { useTemperatureMetrics } from "~/hooks/use-temperature-metrics";
import { useTelemetryEventsToLogs } from "~/hooks/use-telemetry-events-to-logs";

export function DashboardPage() {
  const { deviceId } = useParams<{ deviceId: string }>();

  // Logs
  const { logs, pushLog } = useLogBuffer([{ ts: Date.now(), msg: "Dashboard iniciado" }], 80);

  // Device name
  const {
    deviceName,
    isEditingName,
    draftName,
    setDraftName,
    startEdit,
    commitName,
    cancelName,
  } = useDeviceName(deviceId);

  // Telemetry stream
  const { points, streamStatus, lastTelemetryAt } = useTelemetryStream({
    url: "/api/telemetry/stream",
    retentionMs: 10 * 60_000,
  });

  const isTelemetryFresh =
    lastTelemetryAt != null && Date.now() - lastTelemetryAt <= 5_000;
  const isDeviceConnected = streamStatus === "connected" && isTelemetryFresh;

  // Chart window
  const [windowMs, setWindowMs] = React.useState(120_000);
  const { domainX, visiblePoints, chartData, latestTemp } = useChartWindow(
    points,
    windowMs
  );

  // Metrics + thresholds
  const {
    maxTempNum,
    minTempNum,
    maxDanger,
    minDanger,
    maxTemp,
    minTemp,
    avgTemp,
  } = useTemperatureMetrics(visiblePoints, { maxHot: 30, minCold: 20 });

  // Convert telemetry events to logs
  useTelemetryEventsToLogs({
    isDeviceConnected,
    maxTempNum,
    minTempNum,
    maxDanger,
    minDanger,
    pushLog,
  });

  // Device info (mock + computed)
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

  const packets24h = React.useMemo(() => {
    if (!points.length) return 0;
    const pts = points.length;
    const approx = Math.round(pts * 12 * 24);
    return Math.max(pts, approx);
  }, [points.length]);

  const packetsWindow = points.length;

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-300 px-6 py-8">
        <div className="mb-6">
          <DeviceHeader
            deviceName={deviceName}
            isEditingName={isEditingName}
            draftName={draftName}
            onDraftNameChange={setDraftName}
            onStartEdit={startEdit}
            onCommit={commitName}
            onCancel={cancelName}
            isDeviceConnected={isDeviceConnected}
          />

          <div className="mt-4">
            <Tabs defaultValue="overview">
              <TabsList className="bg-card/30 border border-border/60">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <TemperatureChartCard
                  chartData={chartData}
                  domainX={domainX}
                  streamStatus={streamStatus}
                  latestTemp={latestTemp}
                  onChangeWindowMs={setWindowMs}
                />

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
                  <DeviceInfoCard
                    connectionQuality={connectionQuality}
                    batteryPct={batteryPct}
                    lastUplink={lastUplink}
                    packets24h={packets24h}
                    packetsWindow={packetsWindow}
                    streamStatus={streamStatus}
                  />

                  <LogsCard logs={logs} />
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
