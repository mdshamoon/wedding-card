import type { Theme } from "../theme";

const swatches: { id: Theme; label: string; ring: string; dot: string }[] = [
  {
    id: "cream",
    label: "Ivory & Gold theme",
    ring: "ring-[#b8912b]",
    dot: "bg-[radial-gradient(circle_at_30%_30%,#fffdf7,#efe2c6_70%,#d9b85a)]",
  },
  {
    id: "emerald",
    label: "Emerald & Gold theme",
    ring: "ring-[#d4af37]",
    dot: "bg-[radial-gradient(circle_at_30%_30%,#1c6a4d,#0f3d2e_70%,#0a2e21)]",
  },
];

export function ThemeToggle({
  theme,
  setTheme,
}: {
  theme: Theme;
  setTheme: (t: Theme) => void;
}) {
  return (
    <div className="fixed right-3 top-3 z-[60] flex items-center gap-1.5 rounded-full border border-line bg-[image:var(--card-bg)] px-2 py-1.5 shadow-[var(--card-shadow)] backdrop-blur-sm">
      {swatches.map((s) => {
        const active = theme === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => setTheme(s.id)}
            aria-label={s.label}
            aria-pressed={active}
            title={s.label}
            className={`h-6 w-6 rounded-full border border-line transition-transform duration-200 ${s.dot} ${
              active ? `scale-110 ring-2 ring-offset-1 ring-offset-transparent ${s.ring}` : "opacity-70 hover:opacity-100"
            }`}
          />
        );
      })}
    </div>
  );
}
