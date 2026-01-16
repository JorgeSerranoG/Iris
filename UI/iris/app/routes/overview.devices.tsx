import * as React from "react";
import { Link, useParams } from "react-router";
import { Bell, Bookmark, Plus } from "lucide-react";

import AppShell from "~/components/layout/app-shell";
import { Card, CardContent } from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type DeviceMock = {
  id: string;
  name: string;
  connected: boolean;
  signalLevel: 0 | 1 | 2 | 3 | 4;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  alarm?: { name: string };
  favoriteDefault?: boolean;
  navigatesToDashboard?: boolean;
};

function SignalBars(props: { level: number }) {
  const level = Math.max(0, Math.min(4, props.level));
  const bars = [1, 2, 3, 4];

  return (
    <div className="flex items-end gap-0.5" aria-label={`Señal ${level}/4`}>
      {bars.map((b) => {
        const active = b <= level;
        const h = 4 + b * 3; // 7, 10, 13, 16
        return (
          <div
            key={b}
            className={[
              "w-1 rounded-sm",
              active ? "bg-foreground/70" : "bg-foreground/20",
            ].join(" ")}
            style={{ height: `${h}px` }}
          />
        );
      })}
    </div>
  );
}

function StatusText(props: { connected: boolean }) {
  const { connected } = props;
  return (
    <span
      className={[
        "text-[15px] font-medium",
        connected ? "text-emerald-300" : "text-red-300",
      ].join(" ")}
    >
      {connected ? "Conectado" : "Desconectado"}
    </span>
  );
}

function IconButton(props: React.PropsWithChildren<{
  ariaLabel: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}>) {
  return (
    <button
      type="button"
      aria-label={props.ariaLabel}
      onClick={props.onClick}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-lg",
        "hover:bg-foreground/5 active:bg-foreground/10 transition-colors",
      ].join(" ")}
    >
      {props.children}
    </button>
  );
}

function DeviceCard(props: {
  productId: string;
  device: DeviceMock;
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
  const { productId, device, favorite, onToggleFavorite } = props;

  const Wrapper: React.ElementType = device.navigatesToDashboard ? Link : "div";
  const wrapperProps = device.navigatesToDashboard
    ? { to: `/overview/${productId}/${device.id}` }
    : {};

  const alarmActive = Boolean(device.alarm);

  return (
    <Card
      className={[
        // Para cambiar la proporción de las tarjetas cambiar "aspect-square" por "aspect-[4/3]" o "aspect-[16/10]"
        "aspect-square h-auto w-full",
        "rounded-xl border border-border/60 bg-card/30 backdrop-blur",
        device.navigatesToDashboard
          ? "hover:bg-card/40 transition-colors cursor-pointer"
          : "cursor-default",
      ].join(" ")}
    >
      <Wrapper {...(wrapperProps as any)} className="block h-full">
        <CardContent className="p-4 h-full flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold">
                {device.name}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusText connected={device.connected} />
              <SignalBars level={device.signalLevel} />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <div className="text-6xl font-semibold tracking-tight leading-none">
                {device.primaryMetricValue}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {device.primaryMetricLabel}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    ariaLabel={alarmActive ? "Alarma activa" : "Sin alarmas"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Bell
                      className={[
                        "h-7 w-7",
                        alarmActive ? "text-red-400" : "text-foreground/55",
                      ].join(" ")}
                      fill={alarmActive ? "currentColor" : "none"}
                    />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent>
                  {alarmActive ? device.alarm!.name : "Sin alarmas configuradas"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <IconButton
              ariaLabel={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <Bookmark
                className={[
                  "h-6 w-6",
                  favorite ? "text-foreground/80" : "text-foreground/55",
                ].join(" ")}
                fill={favorite ? "currentColor" : "none"}
              />
            </IconButton>
          </div>
        </CardContent>
      </Wrapper>
    </Card>
  );
}

function PlusCard() {
  return (
    <Card className="aspect-square h-auto w-full rounded-xl border border-dashed border-border/70 bg-card/20 backdrop-blur">
      <CardContent className="p-4 h-full flex items-center justify-center">
        <div
          className={[
            "inline-flex h-14 w-14 items-center justify-center rounded-2xl",
            "border border-border/60 bg-foreground/5",
          ].join(" ")}
          aria-label="Añadir dispositivo"
        >
          <Plus className="h-7 w-7 text-foreground/70" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function OverviewDevicesPage() {
  const params = useParams();
  const productId = String(params.productId ?? "product");

  const devices: DeviceMock[] = React.useMemo(
    () => [
      {
        id: "device-1",
        name: "Dispositivo 1",
        connected: true,
        signalLevel: 4,
        primaryMetricLabel: "Métrica principal",
        primaryMetricValue: "27.4",
        alarm: { name: "Sobretemperatura" },
        favoriteDefault: true,
        navigatesToDashboard: true, 
      },
      {
        id: "device-2",
        name: "Dispositivo 2",
        connected: true,
        signalLevel: 3,
        primaryMetricLabel: "Métrica principal",
        primaryMetricValue: "18.9",
        favoriteDefault: false,
      },
      {
        id: "device-3",
        name: "Dispositivo 3",
        connected: false,
        signalLevel: 0,
        primaryMetricLabel: "Métrica principal",
        primaryMetricValue: "—",
        favoriteDefault: false,
      },
      {
        id: "device-4",
        name: "Dispositivo 4",
        connected: true,
        signalLevel: 2,
        primaryMetricLabel: "Métrica principal",
        primaryMetricValue: "62%",
        alarm: { name: "Nivel fuera de rango" },
        favoriteDefault: false,
      },
      {
        id: "device-5",
        name: "Dispositivo 5",
        connected: true,
        signalLevel: 1,
        primaryMetricLabel: "Métrica principal",
        primaryMetricValue: "0.12",
        favoriteDefault: false,
      },
    ],
    []
  );

  const [favorites, setFavorites] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(devices.map((d) => [d.id, Boolean(d.favoriteDefault)]))
  );

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-370 px-6 py-8 flex flex-col flex-1 min-h-0">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Dispositivos</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Producto:{" "}
            <span className="text-foreground/80 font-medium">{productId}</span>
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <div className="grid w-full gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {devices.map((d) => (
              <DeviceCard
                key={d.id}
                productId={productId}
                device={d}
                favorite={Boolean(favorites[d.id])}
                onToggleFavorite={() =>
                  setFavorites((prev) => ({ ...prev, [d.id]: !prev[d.id] }))
                }
              />
            ))}

            <PlusCard />
          </div>
        </div>
      </main>
    </AppShell>
  );
}