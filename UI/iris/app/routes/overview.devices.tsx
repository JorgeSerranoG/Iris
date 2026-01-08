import * as React from "react";
import { Link, useParams } from "react-router";
import AppShell from "~/components/layout/app-shell";

const ROWS = 4;
const COLS = 4;

function posKey(r: number, c: number) {
  return `${r}-${c}`; // 1-indexed
}

function DeviceCellLabel(r: number, c: number) {
  return `Dispositivo ${r}-${c}`;
}

function PlusCard() {
  return (
    <div
      className={[
        "h-full w-full rounded-xl border border-dashed border-border/70 bg-card/20 backdrop-blur",
        "flex items-center justify-center",
      ].join(" ")}
      aria-label="Añadir"
    >
      <div className="text-6xl font-semibold text-foreground/70 select-none">
        +
      </div>
    </div>
  );
}

export default function OverviewDevicesPage() {
  const { productId } = useParams();

  const visibleDeviceCells = new Set<string>([
    // fila 1 completa
    posKey(1, 1),
    posKey(1, 2),
    posKey(1, 3),
    posKey(1, 4),
    // fila 2: solo 2-1
    posKey(2, 1),
  ]);

  const plusCell = posKey(2, 2);

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-300 px-6 py-8 flex flex-col flex-1 min-h-0">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Dispositivos</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Producto:{" "}
            <span className="text-foreground/80 font-medium">{productId}</span>{" "}
            — Mock (grid flexible): algunos dispositivos visibles, resto vacío, y una tarjeta “+”.
          </p>
        </div>

        <div className="flex-1 min-h-0">
          <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-4">
            {Array.from({ length: ROWS }).map((_, r0) => {
              const r = r0 + 1;
              return Array.from({ length: COLS }).map((__, c0) => {
                const c = c0 + 1;
                const key = posKey(r, c);

                if (key === plusCell) {
                  return <PlusCard key={key} />;
                }

                if (!visibleDeviceCells.has(key)) {
                  return <div key={key} className="h-full w-full" />;
                }

                const isTopLeft = key === "1-1";
                const to = isTopLeft
                  ? `/overview/${productId}/device-1`
                  : `/overview/${productId}`;

                return (
                  <Link
                    key={key}
                    to={to}
                    className={[
                      "h-full w-full rounded-xl border border-border/60 bg-card/30 backdrop-blur",
                      "flex items-center justify-center text-center",
                      "hover:bg-card/40 transition-colors",
                    ].join(" ")}
                  >
                    <div>
                      <div className="text-sm font-semibold">
                        {isTopLeft ? "Dispositivo 1" : DeviceCellLabel(r, c)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {isTopLeft ? "Abrir dashboard" : "Dummy"}
                      </div>
                    </div>
                  </Link>
                );
              });
            })}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
