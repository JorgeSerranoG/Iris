import AppShell from "~/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

function UnderConstructionIllustration() {
  return (
    <svg
      viewBox="0 0 900 420"
      className="w-full max-w-140 opacity-90"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="860" height="380" rx="24" fill="url(#g)" />
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

export default function CustomersRoute() {
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-300 px-6 py-8">
        <Card className="bg-card/30 border-border/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">Customers</CardTitle>
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
      </main>
    </AppShell>
  );
}
