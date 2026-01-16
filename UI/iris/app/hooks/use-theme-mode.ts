import * as React from "react";

type ThemeMode = "light" | "dark";
const STORAGE_KEY = "talos-theme";

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  const isDark = mode === "dark";
  root.classList.toggle("dark", isDark);
  root.style.colorScheme = isDark ? "dark" : "light";
}

export function useThemeMode() {
  const [mounted, setMounted] = React.useState(false);
  const [mode, setMode] = React.useState<ThemeMode>("dark");

  React.useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === "light" || stored === "dark") {
      setMode(stored);
      applyTheme(stored);
      return;
    }

    const prefersDark =
      window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
    const initial: ThemeMode = prefersDark ? "dark" : "light";
    setMode(initial);
    applyTheme(initial);
  }, []);

  const toggle = React.useCallback(() => {
    setMode((prev) => {
      const next: ThemeMode = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
      return next;
    });
  }, []);

  return { mounted, mode, toggle };
}
