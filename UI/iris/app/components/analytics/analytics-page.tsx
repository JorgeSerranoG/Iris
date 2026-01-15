// app/components/analytics/analytics-page.tsx
import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  GripVertical,
  LayoutDashboard,
  Plus,
  Settings2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Search,
  MapPinned,
  Activity,
  BadgeDollarSign,
  Zap,
  Users,
  ListChecks,
} from "lucide-react";

import AppShell from "~/components/layout/app-shell";
import { cn } from "~/lib/utils";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type WidgetSize = "sm" | "md" | "lg" | "xl";

type WidgetType =
  | "kpi-energy"
  | "kpi-costs"
  | "kpi-users"
  | "chart-energy-bars"
  | "chart-costs-donut"
  | "chart-current-area"
  | "chart-voltage-lines"
  | "table-alerts"
  | "map-sites";

type WidgetDef = {
  type: WidgetType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultSize: WidgetSize;
  group: "KPIs" | "Charts" | "Ops";
};

type WidgetInstance = {
  id: string;
  type: WidgetType;
  size: WidgetSize;
};

type DashboardConfig = {
  id: string;
  name: string;
  widgets: WidgetInstance[];
};

const WIDGET_LIBRARY: WidgetDef[] = [
  {
    type: "kpi-energy",
    title: "Energy (today)",
    description: "Total kWh + sparkline",
    icon: Zap,
    defaultSize: "sm",
    group: "KPIs",
  },
  {
    type: "kpi-costs",
    title: "Costs (cycle)",
    description: "Spend + delta",
    icon: BadgeDollarSign,
    defaultSize: "sm",
    group: "KPIs",
  },
  {
    type: "kpi-users",
    title: "Active users",
    description: "WAU + trend",
    icon: Users,
    defaultSize: "sm",
    group: "KPIs",
  },
  {
    type: "chart-energy-bars",
    title: "Energy consumption",
    description: "Stacked bars (24h mock)",
    icon: Activity,
    defaultSize: "lg",
    group: "Charts",
  },
  {
    type: "chart-costs-donut",
    title: "Costs breakdown",
    description: "Donut + legend",
    icon: BadgeDollarSign,
    defaultSize: "md",
    group: "Charts",
  },
  {
    type: "chart-current-area",
    title: "Current (A)",
    description: "Stacked area (realtime mock)",
    icon: Activity,
    defaultSize: "lg",
    group: "Charts",
  },
  {
    type: "chart-voltage-lines",
    title: "Voltage (V)",
    description: "Multi-line (realtime mock)",
    icon: Activity,
    defaultSize: "lg",
    group: "Charts",
  },
  {
    type: "table-alerts",
    title: "Recent alerts",
    description: "Ops table mock",
    icon: ListChecks,
    defaultSize: "md",
    group: "Ops",
  },
  {
    type: "map-sites",
    title: "Sites map",
    description: "GIS-like overview (mock)",
    icon: MapPinned,
    defaultSize: "xl",
    group: "Ops",
  },
];

function uid(prefix = "w") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function sizeToGrid(size: WidgetSize) {
  // 12-column grid
  switch (size) {
    case "sm":
      return "col-span-12 md:col-span-4";
    case "md":
      return "col-span-12 md:col-span-6";
    case "lg":
      return "col-span-12 md:col-span-8";
    case "xl":
      return "col-span-12";
    default:
      return "col-span-12 md:col-span-6";
  }
}

const DEFAULT_DASHBOARDS: DashboardConfig[] = [
  {
    id: "dash_exec",
    name: "Executive overview",
    widgets: [
      { id: uid(), type: "kpi-energy", size: "sm" },
      { id: uid(), type: "kpi-costs", size: "sm" },
      { id: uid(), type: "kpi-users", size: "sm" },
      { id: uid(), type: "chart-energy-bars", size: "lg" },
      { id: uid(), type: "chart-costs-donut", size: "md" },
      { id: uid(), type: "table-alerts", size: "md" },
    ],
  },
  {
    id: "dash_ops",
    name: "Ops / GIS board",
    widgets: [
      { id: uid(), type: "map-sites", size: "xl" },
      { id: uid(), type: "chart-current-area", size: "lg" },
      { id: uid(), type: "chart-voltage-lines", size: "lg" },
      { id: uid(), type: "table-alerts", size: "md" },
    ],
  },
];

export function AnalyticsPage() {
  const [dashboards, setDashboards] = React.useState<DashboardConfig[]>(DEFAULT_DASHBOARDS);
  const [activeDashboardId, setActiveDashboardId] = React.useState<string>(DEFAULT_DASHBOARDS[0]?.id ?? "");
  const [widgetQuery, setWidgetQuery] = React.useState("");
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);

  const activeDashboard = React.useMemo(() => {
    return dashboards.find((d) => d.id === activeDashboardId) ?? dashboards[0];
  }, [dashboards, activeDashboardId]);

  const updateActiveDashboard = React.useCallback(
    (updater: (d: DashboardConfig) => DashboardConfig) => {
      setDashboards((prev) =>
        prev.map((d) => (d.id === activeDashboardId ? updater(d) : d)),
      );
    },
    [activeDashboardId],
  );

  const addWidget = React.useCallback(
    (type: WidgetType) => {
      const def = WIDGET_LIBRARY.find((w) => w.type === type);
      updateActiveDashboard((d) => ({
        ...d,
        widgets: [
          ...d.widgets,
          {
            id: uid(),
            type,
            size: def?.defaultSize ?? "md",
          },
        ],
      }));
    },
    [updateActiveDashboard],
  );

  const removeWidget = React.useCallback(
    (id: string) => {
      updateActiveDashboard((d) => ({
        ...d,
        widgets: d.widgets.filter((w) => w.id !== id),
      }));
    },
    [updateActiveDashboard],
  );

  const setWidgetSize = React.useCallback(
    (id: string, size: WidgetSize) => {
      updateActiveDashboard((d) => ({
        ...d,
        widgets: d.widgets.map((w) => (w.id === id ? { ...w, size } : w)),
      }));
    },
    [updateActiveDashboard],
  );

  const moveWidget = React.useCallback(
    (id: string, dir: -1 | 1) => {
      updateActiveDashboard((d) => {
        const idx = d.widgets.findIndex((w) => w.id === id);
        if (idx < 0) return d;
        const next = idx + dir;
        if (next < 0 || next >= d.widgets.length) return d;
        const copy = [...d.widgets];
        const [item] = copy.splice(idx, 1);
        copy.splice(next, 0, item);
        return { ...d, widgets: copy };
      });
    },
    [updateActiveDashboard],
  );

  // Native drag & drop reorder (mock-friendly, no deps)
  const onDragStart = (id: string) => setDraggingId(id);
  const onDragEnter = (id: string) => {
    if (!draggingId || draggingId === id) return;
    setDragOverId(id);
  };
  const onDragEnd = () => {
    if (!draggingId || !dragOverId || draggingId === dragOverId) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }
    updateActiveDashboard((d) => {
      const from = d.widgets.findIndex((w) => w.id === draggingId);
      const to = d.widgets.findIndex((w) => w.id === dragOverId);
      if (from < 0 || to < 0) return d;
      const copy = [...d.widgets];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return { ...d, widgets: copy };
    });
    setDraggingId(null);
    setDragOverId(null);
  };

  const filteredLibrary = React.useMemo(() => {
    const q = widgetQuery.trim().toLowerCase();
    if (!q) return WIDGET_LIBRARY;
    return WIDGET_LIBRARY.filter((w) => {
      return (
        w.title.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.group.toLowerCase().includes(q)
      );
    });
  }, [widgetQuery]);

  const groupedLibrary = React.useMemo(() => {
    const groups: Record<string, WidgetDef[]> = {};
    for (const w of filteredLibrary) {
      groups[w.group] = groups[w.group] ?? [];
      groups[w.group].push(w);
    }
    return groups;
  }, [filteredLibrary]);

  return (
    <AppShell>
      <div className="flex flex-col gap-4 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
              <h1 className="truncate text-xl font-semibold tracking-tight">
                Analytics
              </h1>
              <Badge variant="secondary" className="ml-1">
                mock
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Panel configurable por el cliente con widgets reordenables (tipo “GIS board”).
            </p>
          </div>

          {/* REQUIRED: top-right sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" className="gap-2">
                <Settings2 className="h-4 w-4" />
                Customize
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[420px] sm:w-[480px]">
              <SheetHeader>
                <SheetTitle>Dashboard builder</SheetTitle>
                <SheetDescription>
                  Elige qué dashboard ver y añade widgets al grid.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                {/* Dashboard picker */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    Dashboard
                  </div>
                  <Select value={activeDashboardId} onValueChange={setActiveDashboardId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dashboard" />
                    </SelectTrigger>
                    <SelectContent>
                      {dashboards.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Search */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    Add widgets
                  </div>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={widgetQuery}
                      onChange={(e) => setWidgetQuery(e.target.value)}
                      placeholder="Search widgets…"
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Library */}
                <ScrollArea className="h-[60vh] pr-2">
                  <div className="space-y-6">
                    {Object.entries(groupedLibrary).map(([group, items]) => (
                      <div key={group} className="space-y-2">
                        <div className="text-sm font-semibold">{group}</div>

                        <div className="space-y-2">
                          {items.map((w) => {
                            const Icon = w.icon;
                            const already = activeDashboard?.widgets.some((x) => x.type === w.type);
                            return (
                              <Card key={w.type} className="border-muted/60">
                                <CardContent className="flex items-start justify-between gap-3 p-3">
                                  <div className="flex min-w-0 items-start gap-3">
                                    <div className="mt-0.5 rounded-md border bg-muted/40 p-2">
                                      <Icon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <div className="truncate text-sm font-medium">
                                          {w.title}
                                        </div>
                                        {already ? (
                                          <Badge variant="outline" className="h-5 px-2 text-[11px]">
                                            on board
                                          </Badge>
                                        ) : null}
                                      </div>
                                      <div className="mt-0.5 text-xs text-muted-foreground">
                                        {w.description}
                                      </div>
                                    </div>
                                  </div>

                                  <Button
                                    size="sm"
                                    className="shrink-0 gap-2"
                                    onClick={() => addWidget(w.type)}
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add
                                  </Button>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="text-xs text-muted-foreground">
                  Tip: puedes reordenar widgets arrastrando (drag) o con ↑ ↓.
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active dashboard title */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold">{activeDashboard?.name}</div>
            <div className="text-sm text-muted-foreground">
              {activeDashboard?.widgets.length ?? 0} widgets
            </div>
          </div>
        </div>

        {/* Board */}
        <div
          className={cn(
            "rounded-2xl border bg-card/40 p-4",
            // subtle “GIS grid” vibe
            "bg-[linear-gradient(to_right,hsl(var(--border)/.10)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.10)_1px,transparent_1px)]",
            "bg-[size:48px_48px]",
          )}
        >
          <div className="grid grid-cols-12 gap-4">
            {activeDashboard?.widgets.map((w) => (
              <div
                key={w.id}
                className={cn(sizeToGrid(w.size))}
                draggable
                onDragStart={() => onDragStart(w.id)}
                onDragEnter={() => onDragEnter(w.id)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={onDragEnd}
              >
                <WidgetCard
                  widget={w}
                  isDragging={draggingId === w.id}
                  isDragOver={dragOverId === w.id}
                  onRemove={() => removeWidget(w.id)}
                  onMoveUp={() => moveWidget(w.id, -1)}
                  onMoveDown={() => moveWidget(w.id, 1)}
                  onSizeChange={(size) => setWidgetSize(w.id, size)}
                />
              </div>
            ))}

            {/* Empty state */}
            {activeDashboard?.widgets.length === 0 ? (
              <div className="col-span-12">
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                    <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
                    <div className="text-sm font-medium">No widgets yet</div>
                    <div className="max-w-sm text-xs text-muted-foreground">
                      Abre <span className="font-medium">Customize</span> y añade widgets al dashboard.
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function WidgetCard(props: {
  widget: WidgetInstance;
  isDragging: boolean;
  isDragOver: boolean;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSizeChange: (s: WidgetSize) => void;
}) {
  const def = React.useMemo(
    () => WIDGET_LIBRARY.find((d) => d.type === props.widget.type),
    [props.widget.type],
  );

  return (
    <Card
      className={cn(
        "h-full overflow-hidden transition",
        props.isDragging && "ring-2 ring-primary/50",
        props.isDragOver && "ring-2 ring-primary/30",
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="min-w-0">
          <CardTitle className="truncate text-sm">{def?.title ?? props.widget.type}</CardTitle>
          <CardDescription className="truncate text-xs">
            {def?.description ?? "Widget"}
          </CardDescription>
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden md:flex">
            <Button variant="ghost" size="icon" className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          <Button variant="ghost" size="icon" onClick={props.onMoveUp} title="Move up">
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={props.onMoveDown} title="Move down">
            <ChevronDown className="h-4 w-4" />
          </Button>

          <Select value={props.widget.size} onValueChange={(v) => props.onSizeChange(v as WidgetSize)}>
            <SelectTrigger className="h-8 w-[92px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">sm</SelectItem>
              <SelectItem value="md">md</SelectItem>
              <SelectItem value="lg">lg</SelectItem>
              <SelectItem value="xl">xl</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" onClick={props.onRemove} title="Remove">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <WidgetBody widget={props.widget} />
      </CardContent>
    </Card>
  );
}

function WidgetBody(props: { widget: WidgetInstance }) {
  switch (props.widget.type) {
    case "kpi-energy":
      return <KpiCard icon={Zap} label="Energy today" value="1.62 kWh" delta="+4.2%" />;
    case "kpi-costs":
      return <KpiCard icon={BadgeDollarSign} label="Costs (cycle)" value="€293.50" delta="-1.4%" negative />;
    case "kpi-users":
      return <KpiCard icon={Users} label="Weekly active" value="21.7%" delta="+2.9%" />;

    case "chart-energy-bars":
      return <EnergyBarsWidget />;
    case "chart-costs-donut":
      return <CostsDonutWidget />;
    case "chart-current-area":
      return <CurrentAreaWidget />;
    case "chart-voltage-lines":
      return <VoltageLinesWidget />;
    case "table-alerts":
      return <AlertsTableWidget />;
    case "map-sites":
      return <SitesMapWidget />;
    default:
      return <div className="text-sm text-muted-foreground">Unknown widget</div>;
  }
}

/* ---------------------------
   MOCK WIDGETS (charts + UI)
---------------------------- */

function KpiCard(props: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
  negative?: boolean;
}) {
  const Icon = props.icon;
  const data = React.useMemo(() => mockSpark(24), []);
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className="h-4 w-4" />
          <span className="truncate">{props.label}</span>
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight">{props.value}</div>
        <div
          className={cn(
            "mt-1 inline-flex items-center rounded-md border px-2 py-0.5 text-[11px]",
            props.negative ? "border-destructive/30 text-destructive" : "border-emerald-500/30 text-emerald-500",
          )}
        >
          {props.delta}
        </div>
      </div>

      <div className="h-16 w-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="kpiFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke="hsl(var(--primary))"
              fill="url(#kpiFill)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function EnergyBarsWidget() {
  const data = React.useMemo(() => mockEnergyBars(48), []);
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 8 }}>
          <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.35} vertical={false} />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            interval={5}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={34}
          />
          <RechartsTooltip content={<DarkTooltip />} />
          <Bar dataKey="a" stackId="x" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
          <Bar dataKey="b" stackId="x" fill="hsl(var(--primary) / 0.65)" radius={[2, 2, 0, 0]} />
          <Bar dataKey="c" stackId="x" fill="hsl(var(--primary) / 0.45)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CostsDonutWidget() {
  const data = React.useMemo(
    () => [
      { name: "Base tier", value: 200 },
      { name: "On-demand", value: 61 },
      { name: "Caching", value: 32.5 },
    ],
    [],
  );

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_160px]">
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <RechartsTooltip content={<DarkTooltip />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              stroke="hsl(var(--background))"
              strokeWidth={2}
            >
              {/* simple palette derived from primary */}
              {data.map((_, i) => (
                <React.Fragment key={i}>
                  {/* Recharts expects <Cell>, but to avoid extra import we use the default color per segment via CSS variables is not possible here.
                      If quieres colores distintos, dime qué tokens tenéis para charts y lo ajusto a vuestro sistema. */}
                </React.Fragment>
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <LegendRow label="Base tier" value="€200.00" />
        <LegendRow label="On-demand" value="€61.00" />
        <LegendRow label="Caching" value="€32.50" />
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-semibold">€293.50</span>
        </div>
      </div>

      {/* NOTE: Pie segments are same color by default; if you already have a chart palette system (e.g. --chart-1..5),
          te lo dejo listo al momento para que quede exactamente como vuestros charts. */}
    </div>
  );
}

function LegendRow(props: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{props.label}</span>
      <span className="font-medium">{props.value}</span>
    </div>
  );
}

function CurrentAreaWidget() {
  const data = React.useMemo(() => mockStacked(60), []);
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 8 }}>
          <defs>
            <linearGradient id="areaA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.35} vertical={false} />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            interval={7}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={34}
          />
          <RechartsTooltip content={<DarkTooltip />} />
          <Area type="monotone" dataKey="a" stackId="1" stroke="hsl(var(--primary))" fill="url(#areaA)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="b" stackId="1" stroke="hsl(var(--primary) / 0.65)" fill="hsl(var(--primary) / 0.12)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="c" stackId="1" stroke="hsl(var(--primary) / 0.45)" fill="hsl(var(--primary) / 0.08)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function VoltageLinesWidget() {
  const data = React.useMemo(() => mockLines(60), []);
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 8 }}>
          <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.35} vertical={false} />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            interval={7}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={34}
            domain={[228, 238]}
          />
          <RechartsTooltip content={<DarkTooltip />} />
          <Line type="monotone" dataKey="a" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="b" stroke="hsl(var(--primary) / 0.65)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="c" stroke="hsl(var(--primary) / 0.45)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function AlertsTableWidget() {
  const rows = React.useMemo(
    () => [
      { ts: "12:26:51", sev: "info", msg: "Device A reported telemetry spike" },
      { ts: "12:27:10", sev: "warn", msg: "Smart Meter B: voltage drift detected" },
      { ts: "12:27:34", sev: "crit", msg: "Smart Meter C: current over threshold" },
      { ts: "12:27:55", sev: "info", msg: "Rule evaluation completed (OK)" },
      { ts: "12:28:12", sev: "warn", msg: "Packet loss above baseline (2.1%)" },
    ],
    [],
  );

  const badgeFor = (sev: string) => {
    if (sev === "crit") return <Badge className="bg-destructive text-destructive-foreground">crit</Badge>;
    if (sev === "warn") return <Badge variant="secondary">warn</Badge>;
    return <Badge variant="outline">info</Badge>;
  };

  return (
    <div className="space-y-2">
      <div className="rounded-lg border">
        <div className="grid grid-cols-[88px_90px_1fr] gap-0 border-b bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          <div>Time</div>
          <div>Severity</div>
          <div>Message</div>
        </div>
        <div className="divide-y">
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-[88px_90px_1fr] items-center gap-0 px-3 py-2">
              <div className="text-xs text-muted-foreground">{r.ts}</div>
              <div>{badgeFor(r.sev)}</div>
              <div className="truncate text-sm">{r.msg}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Mock: aquí luego enchufaremos logs/alerts reales del backend.
      </div>
    </div>
  );
}

function SitesMapWidget() {
  // Pure mock “GIS board” look (no map deps).
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-xl border bg-muted/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.18),transparent_45%),radial-gradient(circle_at_80%_70%,hsl(var(--primary)/0.10),transparent_55%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,hsl(var(--border)/.25)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.25)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg border bg-background/60 px-3 py-2 backdrop-blur">
        <MapPinned className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm font-medium">Sites overview</div>
        <Badge variant="secondary" className="ml-2">mock</Badge>
      </div>

      {/* markers */}
      <Marker x="18%" y="62%" label="Plant A" />
      <Marker x="46%" y="38%" label="Plant B" />
      <Marker x="72%" y="58%" label="Warehouse" />
      <Marker x="62%" y="22%" label="Office" />

      {/* bottom info */}
      <div className="absolute bottom-4 left-4 right-4 grid gap-3 md:grid-cols-3">
        <MiniStat label="Sites online" value="12/12" />
        <MiniStat label="Open incidents" value="3" />
        <MiniStat label="Avg latency" value="128 ms" />
      </div>
    </div>
  );
}

function Marker(props: { x: string; y: string; label: string }) {
  return (
    <div className="absolute" style={{ left: props.x, top: props.y }}>
      <div className="group relative">
        <div className="h-3 w-3 rounded-full bg-primary shadow" />
        <div className="absolute -inset-3 rounded-full bg-primary/20 blur-sm" />
        <div className="pointer-events-none absolute left-1/2 top-4 hidden -translate-x-1/2 whitespace-nowrap rounded-md border bg-background/70 px-2 py-1 text-xs backdrop-blur group-hover:block">
          {props.label}
        </div>
      </div>
    </div>
  );
}

function MiniStat(props: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background/60 p-3 backdrop-blur">
      <div className="text-xs text-muted-foreground">{props.label}</div>
      <div className="mt-1 text-lg font-semibold">{props.value}</div>
    </div>
  );
}

/* ---------------------------
   Tooltip (darker popover)
---------------------------- */

function DarkTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-popover/90 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <div className="mb-1 font-medium text-foreground">{label}</div>
      <div className="space-y-0.5 text-muted-foreground">
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4">
            <span className="truncate">{p.name ?? p.dataKey}</span>
            <span className="font-medium text-foreground">{formatNumber(p.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatNumber(v: unknown) {
  if (typeof v !== "number") return String(v);
  return v.toFixed(2);
}

/* ---------------------------
   Mock data generators
---------------------------- */

function mockSpark(n: number) {
  let v = 50;
  return Array.from({ length: n }).map((_, i) => {
    v += (Math.random() - 0.45) * 6;
    v = Math.max(20, Math.min(85, v));
    return { t: i, v };
  });
}

function mockEnergyBars(n: number) {
  // stacked kWh bars
  const start = 0;
  return Array.from({ length: n }).map((_, i) => {
    const t = (start + i) % 24;
    const base = 0.012 + Math.random() * 0.012;
    return {
      t: `${String(t).padStart(2, "0")}:00`,
      a: +(base * (0.6 + Math.random() * 0.4)).toFixed(3),
      b: +(base * (0.5 + Math.random() * 0.6)).toFixed(3),
      c: +(base * (0.7 + Math.random() * 0.8)).toFixed(3),
    };
  });
}

function mockStacked(n: number) {
  // stacked amp-like
  let a = 3.2, b = 10.8, c = 7.1;
  return Array.from({ length: n }).map((_, i) => {
    a += (Math.random() - 0.5) * 0.25;
    b += (Math.random() - 0.5) * 0.35;
    c += (Math.random() - 0.5) * 0.3;

    a = clamp(a, 2.3, 4.6);
    b = clamp(b, 8.6, 12.6);
    c = clamp(c, 5.6, 9.1);

    return {
      t: `12:${String(26 + Math.floor(i / 6)).padStart(2, "0")}:${String((i * 10) % 60).padStart(2, "0")}`,
      a: +a.toFixed(2),
      b: +b.toFixed(2),
      c: +c.toFixed(2),
    };
  });
}

function mockLines(n: number) {
  let a = 232.2, b = 233.1, c = 233.4;
  return Array.from({ length: n }).map((_, i) => {
    a += (Math.random() - 0.45) * 0.4;
    b += (Math.random() - 0.45) * 0.35;
    c += (Math.random() - 0.45) * 0.38;

    a = clamp(a, 230.0, 236.0);
    b = clamp(b, 231.0, 237.0);
    c = clamp(c, 231.5, 237.5);

    return {
      t: `12:${String(26 + Math.floor(i / 6)).padStart(2, "0")}:${String((i * 10) % 60).padStart(2, "0")}`,
      a: +a.toFixed(2),
      b: +b.toFixed(2),
      c: +c.toFixed(2),
    };
  });
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
