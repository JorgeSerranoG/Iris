// app/components/analytics/analytics-page.tsx
import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  BatteryCharging,
} from "lucide-react";

import AppShell from "~/components/layout/app-shell";
import { cn } from "~/lib/utils";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
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

/**
 * Palette-driven chart colors (theme-aware)
 * - Light mode uses chart palette tokens
 */
const SERIES_1 = "var(--chart-1)";
const SERIES_2 = "var(--chart-2)";
const SERIES_3 = "var(--chart-3)";
const SERIES_4 = "var(--chart-4)";
const SERIES_5 = "var(--chart-5)";
const ACCENT_1 = "#8FE4F2";
const ACCENT_2 = "#93CBD9";
const ACCENT_3 = "#71ADDE";

const primaryGradientStyle: React.CSSProperties = {
  background: `linear-gradient(90deg, ${ACCENT_1}, ${ACCENT_3})`,
  boxShadow: "0 0 0 1px color-mix(in oklab, var(--border) 70%, transparent), 0 18px 70px rgba(0,0,0,0.35)",
};

type WidgetSize = "sm" | "md" | "lg" | "xl";

type WidgetType =
  | "kpi-energy"
  | "kpi-costs"
  | "kpi-users"
  | "kpi-battery"
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
    type: "kpi-battery",
    title: "Battery remaining",
    description: "Gauge + ETA (mock)",
    icon: BatteryCharging,
    defaultSize: "sm",
    group: "KPIs",
  },
  {
    type: "chart-energy-bars",
    title: "Energy consumption",

    description: "Stacked bars (mock)",
    icon: Activity,
    defaultSize: "lg",
    group: "Charts",
  },
  {
    type: "chart-costs-donut",
    title: "Costs breakdown",
    description: "Donut + legend (mock)",
    icon: BadgeDollarSign,
    defaultSize: "md",
    group: "Charts",
  },
  {
    type: "chart-current-area",
    title: "Current (A)",
    description: "Stacked area (mock)",
    icon: Activity,
    defaultSize: "lg",
    group: "Charts",
  },
  {
    type: "chart-voltage-lines",
    title: "Voltage (V)",
    description: "Multi-line (mock)",
    icon: Activity,
    defaultSize: "lg",
    group: "Charts",
  },
  {
    type: "table-alerts",
    title: "Recent alerts",
    description: "Ops table (mock)",
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

/* ---------------------------
   Background (match landing)
---------------------------- */

function GlowBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-44 left-1/2 h-130 w-205 -translate-x-1/2 rounded-full blur-3xl opacity-25"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${ACCENT_1} 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute top-14 -left-44 h-130 w-130 rounded-full blur-3xl opacity-18"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${ACCENT_3} 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute -bottom-56 -right-56 h-160 w-160 rounded-full blur-3xl opacity-16"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${ACCENT_2} 0%, transparent 60%)`,
        }}
      />

      {/* subtle grid with radial mask */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--foreground) 14%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 14%, transparent) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(circle at 50% 22%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 22%, black 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

/* ---------------------------
   Page
---------------------------- */

export function AnalyticsPage() {
  const [dashboards, setDashboards] = React.useState<DashboardConfig[]>(
    DEFAULT_DASHBOARDS,
  );
  const [activeDashboardId, setActiveDashboardId] = React.useState<string>(
    DEFAULT_DASHBOARDS[0]?.id ?? "",
  );
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

  // Native drag & drop reorder (no deps)
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
      <div className="relative">
        <GlowBg />

        <div className="relative z-10 mx-auto w-full max-w-500 px-6 py-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
            </div>

            {/* REQUIRED: top-right sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className="gap-2 text-slate-950 hover:opacity-95 border border-border/60"
                  style={primaryGradientStyle}
                >
                  <Settings2 className="h-4 w-4" />
                  Customize
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-120 sm:w-140">
                <SheetHeader>
                  <SheetTitle>Dashboard builder</SheetTitle>
                  <SheetDescription>
                    Construye tu dashboard.
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-5 px-5 pb-6">
                  {/* Dashboard picker */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      Dashboard
                    </div>
                    <Select
                      value={activeDashboardId}
                      onValueChange={setActiveDashboardId}
                    >
                      <SelectTrigger className="border-border/60 bg-card/30">
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

                  <Separator className="bg-border/40" />

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
                        className="pl-9 border-border/60 bg-card/30"
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
                              const already = activeDashboard?.widgets.some(
                                (x) => x.type === w.type,
                              );

                              return (
                                <Card
                                  key={w.type}
                                  className="bg-card/25 border-border/60 backdrop-blur relative overflow-hidden"
                                >
                                  <div
                                    className="absolute inset-x-0 top-0 h-0.5 opacity-80"
                                    style={{
                                      background: `linear-gradient(90deg, transparent, ${ACCENT_1}, ${ACCENT_3}, transparent)`,
                                    }}
                                  />

                                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex min-w-0 flex-1 items-start gap-3">
                                      <div className="mt-0.5 rounded-md border border-border/60 bg-card/30 p-2">
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex min-w-0 items-center gap-2">
                                          <div className="truncate text-sm font-medium">
                                            {w.title}
                                          </div>
                                          {already ? (
                                            <Badge
                                              variant="outline"
                                              className="h-5 px-2 text-[11px] border-border/60 bg-card/30 text-foreground/80"
                                            >
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
                                      className="shrink-0 gap-2 text-slate-950 hover:opacity-95 border border-border/60 sm:self-start"
                                      style={primaryGradientStyle}
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
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-base font-semibold">
                {activeDashboard?.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {activeDashboard?.widgets.length ?? 0} widgets
              </div>
            </div>
          </div>

          {/* Board */}
          <div className="mt-4 rounded-2xl border border-border/60 bg-card/20 backdrop-blur relative overflow-hidden p-6">
            {/* top accent hairline */}
            <div
              className="absolute inset-x-0 top-0 h-0.5 opacity-80"
              style={{
                background: `linear-gradient(90deg, transparent, ${ACCENT_1}, ${ACCENT_3}, transparent)`,
              }}
            />

            {/* subtle grid overlay w/ mask */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, color-mix(in oklab, var(--foreground) 12%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 12%, transparent) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                maskImage:
                  "radial-gradient(circle at 50% 30%, black 0%, transparent 70%)",
                WebkitMaskImage:
                  "radial-gradient(circle at 50% 30%, black 0%, transparent 70%)",
              }}
            />

            <div className="relative grid grid-cols-12 gap-5">
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
                  <Card className="border-dashed bg-card/25 border-border/60 backdrop-blur relative overflow-hidden">
                    <div
                      className="absolute inset-x-0 top-0 h-0.5 opacity-80"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${ACCENT_1}, ${ACCENT_3}, transparent)`,
                      }}
                    />
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
      </div>
    </AppShell>
  );
}

/* ---------------------------
   Widget card
---------------------------- */

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
        "h-full overflow-hidden bg-card/25 border-border/60 backdrop-blur relative",
        props.isDragging && "ring-2 ring-ring/40",
        props.isDragOver && "ring-2 ring-ring/30",
      )}
    >
      {/* top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 opacity-80"
        style={{
          background: `linear-gradient(90deg, transparent, ${ACCENT_1}, ${ACCENT_3}, transparent)`,
        }}
      />

      {/* subtle corner glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${ACCENT_1} 0%, transparent 60%)`,
        }}
      />

      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="min-w-0">
          <CardTitle className="truncate text-sm">
            {def?.title ?? props.widget.type}
          </CardTitle>
          <CardDescription className="truncate text-xs">
            {def?.description ?? "Widget"}
          </CardDescription>
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden md:flex">
            <Button
              variant="ghost"
              size="icon"
              className="cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={props.onMoveUp}
            title="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={props.onMoveDown}
            title="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <Select
            value={props.widget.size}
            onValueChange={(v) => props.onSizeChange(v as WidgetSize)}
          >
            <SelectTrigger className="h-8 w-23 border-border/60 bg-card/30">
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

/* ---------------------------
   Widget router
---------------------------- */

function WidgetBody(props: { widget: WidgetInstance }) {
  switch (props.widget.type) {
    case "kpi-energy":
      return (
        <KpiCard icon={Zap} label="Energy today" value="1.62 kWh" delta="+4.2%" />
      );
    case "kpi-costs":
      return (
        <KpiCard
          icon={BadgeDollarSign}
          label="Costs (cycle)"
          value="€293.50"
          delta="-1.4%"
          negative
        />
      );
    case "kpi-users":
      return <KpiCard icon={Users} label="Weekly active" value="21.7%" delta="+2.9%" />;

    case "kpi-battery":
      return <BatteryWidget />;

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
   KPI (palette stroke + soft fill)
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
  const gid = React.useId();

  const deltaClassName = cn(
    "mt-1 inline-flex items-center rounded-md border border-border/60 bg-card/30 px-2 py-0.5 text-[11px]",
    props.negative ? "text-muted-foreground" : "text-[color:var(--chart-2)]",
  );

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className="h-4 w-4" />
          <span className="truncate">{props.label}</span>
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight">{props.value}</div>

        <div className={deltaClassName}>
          {props.delta}
        </div>
      </div>

      <div className="h-16 w-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`kpiFill_${gid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT_1} stopOpacity={0.30} />
                <stop offset="100%" stopColor={ACCENT_1} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="v"
              stroke={SERIES_1}
              strokeOpacity={0.9}
              fill={`url(#kpiFill_${gid})`}
              strokeWidth={2.2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ---------------------------
   Charts: palette series + soft shading
---------------------------- */

function EnergyBarsWidget() {
  const data = React.useMemo(() => mockEnergyBars(48), []);
  return (
    <div className="h-65 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 8 }}>
          <CartesianGrid
            stroke="var(--border)"
            strokeOpacity={1}
            vertical={false}
          />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            interval={5}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={34}
          />
          <RechartsTooltip content={<DarkTooltip />} />

          {/* White bars with opacity tiers */}
          <Bar dataKey="a" stackId="x" fill={SERIES_1} fillOpacity={0.85} radius={[2, 2, 0, 0]} />
          <Bar dataKey="b" stackId="x" fill={SERIES_2} fillOpacity={0.65} radius={[2, 2, 0, 0]} />
          <Bar dataKey="c" stackId="x" fill={SERIES_3} fillOpacity={0.55} radius={[2, 2, 0, 0]} />
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
      <div className="h-55 w-full">
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
              stroke="var(--background)"
              strokeWidth={2}
            >
              {/* White segments with opacity tiers */}
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === 0 ? SERIES_1 : i === 1 ? SERIES_2 : SERIES_3}
                  fillOpacity={0.9}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <LegendRow label="Base tier" value="€200.00" />
        <LegendRow label="On-demand" value="€61.00" />
        <LegendRow label="Caching" value="€32.50" />
        <Separator className="bg-border/40" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-semibold">€293.50</span>
        </div>

        <div className="pt-1 text-xs text-muted-foreground">
          Palette series · soft accents
        </div>
      </div>
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
  const gid = React.useId();

  return (
    <div className="h-65 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 8 }}>
          <defs>
            <linearGradient id={`areaAccent_${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT_1} stopOpacity={0.28} />
              <stop offset="100%" stopColor={ACCENT_1} stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id={`areaAccent2_${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT_3} stopOpacity={0.18} />
              <stop offset="100%" stopColor={ACCENT_3} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="var(--border)"
            strokeOpacity={1}
            vertical={false}
          />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            interval={7}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={34}
          />
          <RechartsTooltip content={<DarkTooltip />} />

          {/* All strokes WHITE, fills are blue accents */}
          <Area
            type="monotone"
            dataKey="a"
            stackId="1"
            stroke={SERIES_1}
            strokeOpacity={0.9}
            strokeWidth={2.2}
            fill={`url(#areaAccent_${gid})`}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="b"
            stackId="1"
            stroke={SERIES_2}
            strokeOpacity={0.65}
            strokeWidth={2.0}
            fill={`url(#areaAccent2_${gid})`}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="c"
            stackId="1"
            stroke={SERIES_3}
            strokeOpacity={0.45}
            strokeWidth={2.0}
            fill={ACCENT_1}
            fillOpacity={0.06}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function BatteryWidget() {
  // Mock values (luego lo conectamos a telemetry real)
  const pct = 14; // 0..100
  const eta = "2h 18m";
  const health = "Good";

  // Bars config (match mock: many thin vertical bars)
  const bars = 38;
  const filled = Math.round((pct / 100) * bars);

  // SVG sizing (keeps the exact “barcode” look)
  const W = 370;
  const H = 80;
  const padX = 12
  const padY = 12;
  const barW = 5;
  const gap = 4;
  const innerH = H - padY * 2;

  return (
    <div className="flex items-center justify-between gap-6">
      {/* LEFT: text block like your KPI style */}
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">Battery</div>

        <div className="mt-1 flex items-baseline gap-2">
          <div className="text-2xl font-semibold tracking-tight">{pct}%</div>
          <div
            className="rounded-full border px-2 py-0.5 text-[11px]"
            style={{
              borderColor: "var(--border)",
              background: "var(--card)",
              color: "var(--muted-foreground)",
            }}
          >
            {health}
          </div>
        </div>

        <div className="mt-1 text-xs text-muted-foreground">
          Estimated runtime: <span className="text-foreground/80">{eta}</span>
        </div>
      </div>

      {/* RIGHT: barcode chart area (as in mock #1) */}
      <div
        className="shrink-0 overflow-hidden rounded-lg border border-border/60"
        style={{
          width: W,
          height: H,
          background: "var(--card)",
          boxShadow: "inset 0 0 0 1px var(--border)",
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
          {/* subtle top gloss */}
          <rect
            x="0"
            y="0"
            width={W}
            height={H}
            fill="url(#batteryGloss)"
            opacity="1"
          />
          <defs>
            <linearGradient id="batteryGloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES_1} stopOpacity="0.08" />
              <stop offset="100%" stopColor={SERIES_1} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {Array.from({ length: bars }).map((_, i) => {
            const x = padX + i * (barW + gap);
            const y = padY;
            const opacity = i < filled ? 0.90 : 0.22; // filled vs remaining (like mock)

            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={barW}
                height={innerH}
                rx={1.2}
                fill={SERIES_1}
                fillOpacity={opacity}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function VoltageLinesWidget() {
  const data = React.useMemo(() => mockLines(60), []);
  return (
    <div className="h-65 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 8 }}>
          <CartesianGrid
            stroke="var(--border)"
            strokeOpacity={1}
            vertical={false}
          />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            interval={7}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={34}
            domain={[228, 238]}
          />
          <RechartsTooltip content={<DarkTooltip />} />

          {/* White lines with dash patterns for readability */}
          <Line type="monotone" dataKey="a" stroke={SERIES_1} strokeOpacity={0.95} strokeWidth={2.2} dot={false} />
          <Line type="monotone" dataKey="b" stroke={SERIES_4} strokeOpacity={0.75} strokeWidth={2.0} strokeDasharray="6 4" dot={false} />
          <Line type="monotone" dataKey="c" stroke={SERIES_3} strokeOpacity={0.6} strokeWidth={2.0} strokeDasharray="2 6" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------------------
   Ops widgets
---------------------------- */

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
    const base =
      "h-5 px-2 text-[11px] font-medium border rounded-full backdrop-blur";

    if (sev === "crit") {
      return (
        <Badge className={cn(base, "border-red-500/35 bg-red-500/18 text-red-900 dark:text-red-200")}>
          crit
        </Badge>
      );
    }

    if (sev === "warn") {
      return (
        <Badge className={cn(base, "border-amber-500/35 bg-amber-500/18 text-amber-900 dark:text-amber-200")}>
          warn
        </Badge>
      );
    }

    // info (blue accent: #8FE4F2 / #71ADDE)
    return (
      <Badge
        className={cn(
          base,
          "border-[rgba(113,173,222,0.40)] bg-[rgba(113,173,222,0.18)] text-[rgba(22,96,140,0.90)] dark:text-[rgba(143,228,242,0.95)]",
        )}
      >
        info
      </Badge>
    );
  };

  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-border/60 bg-card/30 overflow-hidden">
        <div className="grid grid-cols-[88px_90px_1fr] gap-0 border-b border-border/60 bg-card/30 px-3 py-2 text-xs text-muted-foreground">
          <div>Time</div>
          <div>Severity</div>
          <div>Message</div>
        </div>
        <div className="divide-y divide-border/60">
          {rows.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-[88px_90px_1fr] items-center gap-0 px-3 py-2"
            >
              <div className="text-xs text-muted-foreground">{r.ts}</div>
              <div>{badgeFor(r.sev)}</div>
              <div className="truncate text-sm text-foreground/85">{r.msg}</div>
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
  return (
    <div className="relative h-90 w-full overflow-hidden rounded-xl border border-border/60 bg-card/20">
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(circle at 30% 20%, ${ACCENT_1}33, transparent 45%),` +
            `radial-gradient(circle at 80% 70%, ${ACCENT_3}22, transparent 55%)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--foreground) 12%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 12%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-border/60 bg-card/30 px-3 py-2 backdrop-blur">
        <MapPinned className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm font-medium">Sites overview</div>
        <Badge
          variant="secondary"
          className="ml-2 border border-border/60 bg-card/30 text-foreground/80"
        >
          mock
        </Badge>
      </div>

      {/* markers */}
      <Marker x="18%" y="62%" label="Plant A" tone={ACCENT_1} />
      <Marker x="46%" y="38%" label="Plant B" tone={ACCENT_3} />
      <Marker x="72%" y="58%" label="Warehouse" tone={ACCENT_2} />
      <Marker x="62%" y="22%" label="Office" tone={SERIES_5} />

      {/* bottom info */}
      <div className="absolute bottom-4 left-4 right-4 grid gap-3 md:grid-cols-3">
        <MiniStat label="Sites online" value="12/12" />
        <MiniStat label="Open incidents" value="3" />
        <MiniStat label="Avg latency" value="128 ms" />
      </div>
    </div>
  );
}

function Marker(props: { x: string; y: string; label: string; tone: string }) {
  return (
    <div className="absolute" style={{ left: props.x, top: props.y }}>
      <div className="group relative">
        <div
          className="h-3 w-3 rounded-full shadow"
          style={{ background: props.tone }}
        />
        <div
          className="absolute -inset-3 rounded-full blur-sm opacity-60"
          style={{ background: `${props.tone}33` }}
        />
        <div className="pointer-events-none absolute left-1/2 top-4 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border/60 bg-popover/80 px-2 py-1 text-xs text-popover-foreground backdrop-blur group-hover:block">
          {props.label}
        </div>
      </div>
    </div>
  );
}

function MiniStat(props: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/30 p-3 backdrop-blur">
      <div className="text-xs text-muted-foreground">{props.label}</div>
      <div className="mt-1 text-lg font-semibold">{props.value}</div>
    </div>
  );
}

/* ---------------------------
   Tooltip (dark, readable)
---------------------------- */

function DarkTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border/60 bg-popover/90 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <div className="mb-1 font-medium text-popover-foreground">{label}</div>
      <div className="space-y-0.5 text-muted-foreground">
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4">
            <span className="truncate">{p.name ?? p.dataKey}</span>
            <span className="font-medium text-popover-foreground">{formatNumber(p.value)}</span>
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
  let a = 3.2,
    b = 10.8,
    c = 7.1;
  return Array.from({ length: n }).map((_, i) => {
    a += (Math.random() - 0.5) * 0.25;
    b += (Math.random() - 0.5) * 0.35;
    c += (Math.random() - 0.5) * 0.3;

    a = clamp(a, 2.3, 4.6);
    b = clamp(b, 8.6, 12.6);
    c = clamp(c, 5.6, 9.1);

    return {
      t: `12:${String(26 + Math.floor(i / 6)).padStart(2, "0")}:${String(
        (i * 10) % 60,
      ).padStart(2, "0")}`,
      a: +a.toFixed(2),
      b: +b.toFixed(2),
      c: +c.toFixed(2),
    };
  });
}

function mockLines(n: number) {
  let a = 232.2,
    b = 233.1,
    c = 233.4;
  return Array.from({ length: n }).map((_, i) => {
    a += (Math.random() - 0.45) * 0.4;
    b += (Math.random() - 0.45) * 0.35;
    c += (Math.random() - 0.45) * 0.38;

    a = clamp(a, 230.0, 236.0);
    b = clamp(b, 231.0, 237.0);
    c = clamp(c, 231.5, 237.5);

    return {
      t: `12:${String(26 + Math.floor(i / 6)).padStart(2, "0")}:${String(
        (i * 10) % 60,
      ).padStart(2, "0")}`,
      a: +a.toFixed(2),
      b: +b.toFixed(2),
      c: +c.toFixed(2),
    };
  });
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
