import { useCallback, useEffect, useState } from "react";

export type Theme = "cream" | "emerald";

const STORAGE_KEY = "wc-theme";
const DEFAULT: Theme = "cream";

function readInitial(): Theme {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.dataset.theme as Theme | undefined;
    if (attr === "cream" || attr === "emerald") return attr;
  }
  return DEFAULT;
}

function apply(theme: Theme) {
  // "cream" is the default (no attribute); only set it for the alternate.
  if (theme === DEFAULT) {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore private-mode storage errors */
  }
}

/** Small hook that owns the active theme and keeps <html data-theme> in sync. */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readInitial);

  useEffect(() => {
    apply(theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggle = useCallback(
    () => setThemeState((t) => (t === "cream" ? "emerald" : "cream")),
    []
  );

  return { theme, setTheme, toggle };
}
