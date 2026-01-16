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

const themeInitScript = `
(function () {
  try {
    var key = "talos-theme";
    var stored = localStorage.getItem(key);
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var mode = stored === "light" || stored === "dark" ? stored : (prefersDark ? "dark" : "light");
    var isDark = mode === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  } catch (e) {}
})();
`;

export default function App() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Links />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        {/* Fondo: versión light + versión dark */}
        <div
          className={[
            "fixed inset-0 -z-10",
            "bg-[radial-gradient(1200px_600px_at_30%_10%,hsl(220_90%_92%/0.75),transparent_60%),radial-gradient(900px_500px_at_80%_0%,hsl(210_90%_94%/0.65),transparent_55%),linear-gradient(to_bottom,hsl(0_0%_100%),hsl(210_40%_98%))]",
            "dark:bg-[radial-gradient(1200px_600px_at_30%_10%,hsl(222_80%_18%/0.35),transparent_60%),radial-gradient(900px_500px_at_80%_0%,hsl(215_90%_16%/0.25),transparent_55%),linear-gradient(to_bottom,hsl(222_47%_7%),hsl(222_47%_5%))]",
          ].join(" ")}
        />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
