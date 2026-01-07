import type { LinksFunction } from "react-router";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./app.css";

export const links: LinksFunction = () => [];

export default function App() {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_30%_10%,hsl(222_80%_18%/0.35),transparent_60%),radial-gradient(900px_500px_at_80%_0%,hsl(215_90%_16%/0.25),transparent_55%),linear-gradient(to_bottom,hsl(222_47%_7%),hsl(222_47%_5%))]" />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
