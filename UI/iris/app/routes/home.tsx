import * as React from "react";
import { Link } from "react-router";
import AppShell from "~/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

function Tile(props: { title: string; desc: string; to: string }) {
  return (
    <Link to={props.to} className="block">
      <Card className="bg-card/30 border-border/60 backdrop-blur hover:bg-card/40 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl">{props.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {props.desc}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function HomeLandingRoute() {
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-300 px-6 py-8">
        <h1 className="text-3xl font-semibold tracking-tight">Home</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Landing page.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Tile
            title="Overview"
            desc="Productos"
            to="/overview"
          />
          <Tile
            title="Customers"
            desc="Sección en desarrollo."
            to="/customers"
          />
          <Tile
            title="Products"
            desc="Sección en desarrollo."
            to="/products"
          />
          <Tile
            title="Settings"
            desc="Sección en desarrollo."
            to="/settings"
          />
        </div>
      </main>
    </AppShell>
  );
}
