import * as React from "react";
import { Link } from "react-router";

import AppShell from "~/components/layout/app-shell";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const ACCENT_1 = "#8FE4F2";
const ACCENT_2 = "#93CBD9";
const ACCENT_3 = "#71ADDE";

const primaryGradientStyle: React.CSSProperties = {
  background: `linear-gradient(90deg, ${ACCENT_1}, ${ACCENT_3})`,
  boxShadow: `0 0 0 1px rgba(255,255,255,0.10), 0 18px 70px rgba(0,0,0,0.55)`,
};

function GlowBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-40 left-1/2 h-130 w-205 -translate-x-1/2 rounded-full blur-3xl opacity-25"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${ACCENT_1} 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute top-10 -left-40 h-130 w-130 rounded-full blur-3xl opacity-18"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${ACCENT_3} 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute -bottom-48 -right-48 h-620 w-620 rounded-full blur-3xl opacity-16"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${ACCENT_2} 0%, transparent 60%)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(circle at 50% 30%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 30%, black 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

function TopNav() {
  return (
    <header className="relative z-10 mx-auto w-full max-w-300 px-6 pt-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">

            <img
              src="/brand/talos-logo.png"
              alt="Talos"
              className="h-11 w-11 shrink-0 object-contain"
              draggable={false}
            />


          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">TALOS</div>
            <div className="text-xs text-muted-foreground">
              Connect · Observe · Act
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            href="#how"
          >
            How it works
          </a>
          <a
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            href="#security"
          >
            Security
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden md:inline-flex">
            Sign in
          </Button>
          <Button
            className="text-slate-950 hover:opacity-95 border border-white/10"
            style={primaryGradientStyle}
          >
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}

function HeroPreview() {
  return (
    <Card className="bg-card/25 border-border/60 backdrop-blur relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-0.5 opacity-80"
        style={{
          background: `linear-gradient(90deg, transparent, ${ACCENT_1}, ${ACCENT_3}, transparent)`,
        }}
      />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base">Device overview</CardTitle>
            <div className="text-sm text-muted-foreground">
              Real-time telemetry snapshot
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: "#34d399" }}
            />
            <span className="text-sm font-medium text-emerald-400">
              Connected
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* mini chart */}
        <div className="rounded-xl border border-border/60 bg-linear-to-b from-foreground/5 to-transparent p-4">
          <div className="h-24 w-full">
            <svg viewBox="0 0 520 120" className="h-full w-full">
              <defs>
                <linearGradient id="talosFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={ACCENT_1} stopOpacity="0.25" />
                  <stop offset="1" stopColor={ACCENT_1} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,70 C40,55 70,90 110,72 C150,54 160,60 200,62 C240,64 260,40 300,52 C340,64 360,72 400,68 C440,64 460,78 520,56 L520,120 L0,120 Z"
                fill="url(#talosFill)"
              />
              <path
                d="M0,70 C40,55 70,90 110,72 C150,54 160,60 200,62 C240,64 260,40 300,52 C340,64 360,72 400,68 C440,64 460,78 520,56"
                fill="none"
                stroke="white"
                strokeOpacity="0.9"
                strokeWidth="2.2"
              />
            </svg>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Temp</span>
            <span className="text-foreground/80">Latest: 21.75 °C</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Max", value: "22.81 °C" },
            { label: "Min", value: "21.75 °C" },
            { label: "Avg", value: "22.43 °C" },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-border/60 bg-card/20 p-3"
            >
              <div className="text-xs text-muted-foreground">{m.label}</div>
              <div className="mt-1 text-sm font-semibold tracking-tight">
                {m.value}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border/60 bg-card/20 p-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">Automations</div>
            <div className="text-xs text-foreground/80">Active: 3</div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: ACCENT_1 }}
            />
            <span className="text-xs text-foreground/80">
              Alert if temp &gt; 30 °C
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: ACCENT_3 }}
            />
            <span className="text-xs text-foreground/80">
              Notify on disconnect
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCard(props: {
  title: string;
  desc: string;
  tone?: "a1" | "a2" | "a3";
}) {
  const tone = props.tone ?? "a1";
  const color = tone === "a1" ? ACCENT_1 : tone === "a2" ? ACCENT_2 : ACCENT_3;

  return (
    <Card className="bg-card/25 border-border/60 backdrop-blur relative overflow-hidden">
      <div
        className="absolute -top-28 -right-28 h-56 w-56 rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 60%)`,
        }}
      />
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: color }}
          />
          <CardTitle className="text-base">{props.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {props.desc}
        </p>
      </CardContent>
    </Card>
  );
}

export default function Index() {
  return (
    <AppShell>
      <div className="relative">
        <GlowBg />
        <TopNav />

        <main className="relative z-10 mx-auto w-full max-w-300 px-6 pb-18 pt-10">
          <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: ACCENT_1 }}
                />
                <span>Unified IoT operations platform</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
                  TALOS
                </h1>
                <div
                  className="text-lg md:text-xl font-medium tracking-wide"
                  style={{
                    background: `linear-gradient(90deg, ${ACCENT_1}, ${ACCENT_3})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Connect · Observe · Act
                </div>
                <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
                  One calm, powerful control room for every device. Stream
                  telemetry, detect anomalies, and trigger actions in real
                  time.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  className="text-slate-950 hover:opacity-95 border border-white/10"
                  style={primaryGradientStyle}
                >
                  Get started
                </Button>
                <Button variant="ghost" className="border border-white/10">
                  View demo
                </Button>
              </div>

              <div className="pt-2">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                  <span className="text-foreground/70">Built for:</span>
                  <span>LiDAR</span>
                  <span>UWB</span>
                  <span>Industrial sensors</span>
                  <span>Actuators</span>
                  <span>Gateways</span>
                </div>
              </div>
            </div>

            <HeroPreview />
          </section>

          <div className="my-12">
            <Separator className="bg-border/40" />
          </div>

          {/* FEATURES */}
          <section id="features" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Minimal UI. Maximum control.
              </h2>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Talos keeps the interface calm and consistent across device
                types, while exposing the power you need when it matters.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                tone="a1"
                title="Connect anything"
                desc="Unified onboarding for heterogeneous fleets. One layout, one mental model."
              />
              <FeatureCard
                tone="a3"
                title="Observe in real time"
                desc="Streams, charts, logs and health indicators tuned for instant comprehension."
              />
              <FeatureCard
                tone="a2"
                title="Act with rules"
                desc="Turn thresholds into actions: alerts, workflows, and automations."
              />
              <FeatureCard
                tone="a1"
                title="Operator-grade"
                desc="Built for reliability: predictable UI, clear states, fast scanning."
              />
            </div>
          </section>

          <div className="my-12">
            <Separator className="bg-border/40" />
          </div>

          {/* HOW */}
          <section id="how" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Connect · Observe · Act
              </h2>
              <p className="text-sm text-muted-foreground max-w-2xl">
                A simple loop that scales from a single device to thousands.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Connect",
                  desc: "Bring devices online through a clean, repeatable onboarding process.",
                  tone: ACCENT_1,
                },
                {
                  step: "02",
                  title: "Observe",
                  desc: "Telemetry, events and health states presented in a unified dashboard.",
                  tone: ACCENT_3,
                },
                {
                  step: "03",
                  title: "Act",
                  desc: "Automate responses with thresholds, alerts and workflows that operators trust.",
                  tone: ACCENT_2,
                },
              ].map((s) => (
                <Card
                  key={s.step}
                  className="bg-card/25 border-border/60 backdrop-blur relative overflow-hidden"
                >
                  <div
                    className="absolute -top-24 -left-24 h-56 w-56 rounded-full blur-3xl opacity-18"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${s.tone} 0%, transparent 60%)`,
                    }}
                  />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Step {s.step}
                      </div>
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: s.tone }}
                      />
                    </div>
                    <CardTitle className="text-base">{s.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {s.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <div className="my-12">
            <Separator className="bg-border/40" />
          </div>

          {/* SECURITY */}
          <section
            id="security"
            className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start"
          >
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">
                Calm by design. Secure by default.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Talos is built to feel trustworthy: clear connection states,
                predictable layouts, and “operator-first” decisions everywhere.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Clear online/offline states",
                  "Consistent device dashboards",
                  "Event logs you can audit",
                  "Threshold-based alerts",
                ].map((t) => (
                  <div
                    key={t}
                    className="rounded-xl border border-border/60 bg-card/20 p-3 text-sm text-foreground/85"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-card/25 border-border/60 backdrop-blur relative overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-0.5 opacity-80"
                style={{
                  background: `linear-gradient(90deg, transparent, ${ACCENT_3}, ${ACCENT_1}, transparent)`,
                }}
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ready when you are</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Launch your first tenant in minutes.
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-border/60 bg-card/20 p-3">
                  <div className="text-xs text-muted-foreground">
                    Starter pack
                  </div>
                  <div className="mt-1 text-sm text-foreground/85">
                    Dashboard + stream + logs + thresholds
                  </div>
                </div>

                <Button
                  className="w-full text-slate-950 hover:opacity-95 border border-white/10"
                  style={primaryGradientStyle}
                >
                  Create workspace
                </Button>
                <Button
                  variant="ghost"
                  className="w-full border border-white/10"
                >
                  Talk to us
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* FOOTER */}
          <footer className="mt-14 pb-6 text-xs text-muted-foreground">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-foreground/70">Talos</span>
                <span>·</span>
                <span>Connect · Observe · Act</span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  className="hover:text-foreground transition-colors"
                  href="#features"
                >
                  Features
                </a>
                <a
                  className="hover:text-foreground transition-colors"
                  href="#how"
                >
                  How
                </a>
                <a
                  className="hover:text-foreground transition-colors"
                  href="#security"
                >
                  Security
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </AppShell>
  );
}
