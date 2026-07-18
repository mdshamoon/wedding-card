// Hand-drawn gold SVG ornaments — no external images, so nothing can break.

type SvgProps = React.SVGProps<SVGSVGElement>;

const goldDefs = (id: string) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="var(--accent2)" />
      <stop offset="48%" stopColor="var(--accent)" />
      <stop offset="100%" stopColor="var(--accent2)" />
    </linearGradient>
  </defs>
);

/** Ornate corner flourish. Rotate via CSS for the four corners. */
export function CornerFlourish(props: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden {...props}>
      {goldDefs("corner-gold")}
      <g stroke="url(#corner-gold)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M8 8 C 8 46, 30 68, 70 70" />
        <path d="M8 8 C 46 8, 68 30, 70 70" opacity="0.9" />
        <path d="M8 8 C 8 30, 20 44, 44 46" opacity="0.7" />
        <path d="M8 8 C 30 8, 44 20, 46 44" opacity="0.7" />
        <path d="M70 70 c 10 0 18 -4 22 -14 c 2 -6 -2 -14 -9 -13 c -6 1 -8 8 -3 12 c 5 4 13 2 15 -5" />
        <path d="M46 45 c 8 -1 14 -7 14 -16 c 0 -6 -6 -10 -11 -7 c -4 3 -3 9 2 10" opacity="0.85" />
        <circle cx="8" cy="8" r="3" fill="url(#corner-gold)" stroke="none" />
        <circle cx="70" cy="70" r="2.2" fill="url(#corner-gold)" stroke="none" />
      </g>
    </svg>
  );
}

/** Slim divider with a central motif — used between sections. */
export function Divider({ width = 220, ...props }: SvgProps & { width?: number }) {
  return (
    <svg viewBox="0 0 240 24" width={width} height={(width * 24) / 240} fill="none" aria-hidden {...props}>
      {goldDefs("div-gold")}
      <g stroke="url(#div-gold)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M8 12 H96" />
        <path d="M232 12 H144" />
        <path d="M96 12 c 8 -8 16 -8 24 0 c 8 8 16 8 24 0" fill="none" />
        <circle cx="120" cy="12" r="3.4" fill="url(#div-gold)" stroke="none" />
        <circle cx="8" cy="12" r="2" fill="url(#div-gold)" stroke="none" />
        <circle cx="232" cy="12" r="2" fill="url(#div-gold)" stroke="none" />
        <path d="M120 4 l 2.2 4 h -4.4 z" fill="url(#div-gold)" stroke="none" />
        <path d="M120 20 l 2.2 -4 h -4.4 z" fill="url(#div-gold)" stroke="none" />
      </g>
    </svg>
  );
}

/** Monogram medallion — the initials S & A inside a crescent-and-ring seal. */
export function Monogram({ size = 96, ...props }: SvgProps & { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" aria-hidden {...props}>
      {goldDefs("mono-gold")}
      <circle cx="50" cy="50" r="46" stroke="url(#mono-gold)" strokeWidth="1.4" />
      <circle cx="50" cy="50" r="40" stroke="url(#mono-gold)" strokeWidth="0.8" opacity="0.6" />
      {/* crescent */}
      <path
        d="M64 22 a 32 32 0 1 0 0 56 a 26 26 0 1 1 0 -56 z"
        fill="url(#mono-gold)"
        opacity="0.14"
      />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontFamily="Great Vibes, cursive"
        fontSize="34"
        fill="url(#mono-gold)"
      >
        S&amp;A
      </text>
    </svg>
  );
}

/** Seamless ogee-damask pattern fill — tints with the active theme's gold. */
export function PatternBg({
  id = "ogee",
  opacity = 0.12,
  className,
}: {
  id?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <svg className={className} width="100%" height="100%" aria-hidden style={{ opacity }}>
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="var(--accent)" strokeWidth="1.1">
            {/* ogee lattice */}
            <path d="M0 28 C 14 28 14 0 28 0 C 42 0 42 28 56 28" />
            <path d="M0 28 C 14 28 14 56 28 56 C 42 56 42 28 56 28" />
            {/* little four-petal flowers at the nodes */}
            <g strokeWidth="0.9">
              <path d="M28 22 q 3 3 0 6 q -3 -3 0 -6 M25 25 q 3 3 6 0 q -3 -3 -6 0" transform="translate(0,3)" />
            </g>
          </g>
          <circle cx="28" cy="28" r="1.7" fill="var(--accent)" />
          <circle cx="0" cy="28" r="1.2" fill="var(--accent)" />
          <circle cx="56" cy="28" r="1.2" fill="var(--accent)" />
          <circle cx="28" cy="0" r="1.2" fill="var(--accent)" />
          <circle cx="28" cy="56" r="1.2" fill="var(--accent)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Botanical sprig used on the closed card cover. */
export function Sprig({ size = 70, ...props }: SvgProps & { size?: number }) {
  return (
    <svg viewBox="0 0 80 120" width={size} height={(size * 120) / 80} fill="none" aria-hidden {...props}>
      {goldDefs("sprig-gold")}
      <g stroke="url(#sprig-gold)" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d="M40 118 C 40 80, 40 50, 40 8" />
        <path d="M40 92 C 24 86, 16 74, 16 58 C 30 60, 40 74, 40 92" fill="url(#sprig-gold)" fillOpacity="0.12" />
        <path d="M40 78 C 56 72, 64 60, 64 44 C 50 46, 40 60, 40 78" fill="url(#sprig-gold)" fillOpacity="0.12" />
        <path d="M40 58 C 26 54, 20 44, 20 30 C 32 32, 40 44, 40 58" fill="url(#sprig-gold)" fillOpacity="0.12" />
        <path d="M40 44 C 54 40, 60 30, 60 18 C 48 20, 40 30, 40 44" fill="url(#sprig-gold)" fillOpacity="0.12" />
        <circle cx="40" cy="8" r="3.4" fill="url(#sprig-gold)" stroke="none" />
      </g>
    </svg>
  );
}
