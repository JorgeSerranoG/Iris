import * as React from "react";
import { Link } from "react-router";
import AppShell from "~/components/layout/app-shell";

const GRID = 16; // 4x4
const COLS = 4;

function cellLabel(i: number) {
  const r = Math.floor(i / COLS) + 1;
  const c = (i % COLS) + 1;
  return `Producto ${r}-${c}`;
}

export default function OverviewProductsPage() {
  return (
    <AppShell>
      {/* Importante: flex-1 + min-h-0 para poder ocupar TODO el alto bajo el topbar */}
      <main className="mx-auto w-full max-w-300 px-6 py-8 flex flex-col flex-1 min-h-0">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Productos</h1>
        </div>

        {/* Grid a pantalla completa (dentro del main) */}
        <div className="flex-1 min-h-0">
          <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-4">
            {Array.from({ length: GRID }).map((_, i) => {
              const isTopLeft = i === 0;
              const to = isTopLeft ? "/overview/product-1" : "/overview";

              return (
                <Link
                  key={i}
                  to={to}
                  className={[
                    "h-full w-full rounded-xl border border-border/60 bg-card/30 backdrop-blur",
                    "flex items-center justify-center text-center",
                    "hover:bg-card/40 transition-colors",
                  ].join(" ")}
                >
                  <div>
                    <div className="text-sm font-semibold">
                      {isTopLeft ? "Producto 1" : cellLabel(i)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {isTopLeft ? "Ver dispositivos" : "Dummy"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
