import { useMemo } from "react";

/** Gentle drifting gold petals — pure CSS, seeded once so they don't jump on re-render. */
export function Petals({ count = 14 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: (i * 137.5) % 100, // spread across the width
        delay: (i % 7) * 1.3,
        duration: 9 + ((i * 3) % 8),
        size: 8 + ((i * 5) % 10),
        drift: (i % 2 === 0 ? 1 : -1) * (20 + (i % 4) * 12),
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute -top-[6%] rounded-[60%_10%_60%_10%] bg-[radial-gradient(circle_at_30%_30%,var(--accent2),var(--accent)_75%)] opacity-0 drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)]"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `petalFall ${p.duration}s linear ${p.delay}s infinite`,
              "--drift": `${p.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
