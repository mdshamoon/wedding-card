import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CornerFlourish, Monogram, PatternBg } from "./Ornaments";

const FLAP_MS = 1500;
const SLIDE_DELAY = 1000;
const SLIDE_MS = 2000;
const TOTAL_MS = SLIDE_DELAY + SLIDE_MS + 250;
const ease = [0.62, 0, 0.25, 1] as const;
const SEAL = 116; // px

// Flap: straight sides down to 76%, then a shallow V to the point.
const TRI = "[clip-path:polygon(0_0,100%_0,100%_76%,50%_100%,0_76%)]";
// Sleeve: top edge is the matching V (meets the flap along the same line).
const SLEEVE = "[clip-path:polygon(0_10%,50%_32%,100%_10%,100%_100%,0_100%)]";

/** Gold edge tracing the flap outline (clip-path can't draw a border). */
function TriBorder() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <polygon
        points="0.7,0.7 99.3,0.7 99.3,76 50,99.3 0.7,76"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Envelope surfaces use gold tuned to the sleeve colour, not the card theme.
const envVars = { ["--accent"]: "var(--env-gold)" } as CSSProperties;

/** Cream paper photo, tinted to the sleeve colour via a multiply blend. */
function EnvPaper({ variant = "env" }: { variant?: "env" | "liner" }) {
  return (
    <>
      <div
        className="absolute inset-0 bg-repeat"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}texture-cream.jpg)`,
          backgroundSize: "240px",
        }}
      />
      <div
        className={`absolute inset-0 mix-blend-multiply ${
          variant === "liner" ? "bg-[image:var(--env-liner)]" : "bg-[image:var(--env)]"
        }`}
      />
    </>
  );
}

export function WeddingCard({ onOpened }: { onOpened: () => void }) {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = gone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gone]);

  const start = () => {
    if (open) return;
    setOpen(true);
    onOpened();
    window.setTimeout(() => setGone(true), TOTAL_MS);
  };

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-50 cursor-pointer overflow-hidden [perspective-origin:50%_16%] [perspective:1500px]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={start}
          role="button"
          tabIndex={0}
          aria-label="Tap to open the invitation"
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && start()}
        >
          {/* Bottom sleeve — plain envelope colour; slides down to reveal the card */}
          <motion.div
            className={`absolute inset-x-0 bottom-0 z-20 h-[62%] isolate overflow-hidden ${SLEEVE}`}
            style={envVars}
            initial={{ y: 0 }}
            animate={{ y: open ? "104%" : 0 }}
            transition={{ duration: SLIDE_MS / 1000, delay: open ? SLIDE_DELAY / 1000 : 0, ease }}
          >
            <EnvPaper />
            <PatternBg id="env-lower-pat" opacity={0.1} className="absolute inset-0" />
            {/* gold V edge along the sleeve's top */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <polyline
                points="0,10 50,32 100,10"
                fill="none"
                stroke="var(--env-gold)"
                strokeWidth="1.6"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <CornerFlourish className="absolute bottom-3 left-3 h-14 w-14 -scale-y-100" />
            <CornerFlourish className="absolute bottom-3 right-3 h-14 w-14 -scale-100" />
            <span
              className="absolute bottom-[13vh] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap font-serif text-[0.8rem] uppercase tracking-[0.28em]"
              style={{ color: "var(--env-ink)", textShadow: "0 1px 2px rgba(0,0,0,0.18)" }}
            >
              Mohd Shamoon &amp; Alina Fatima
            </span>
          </motion.div>

          {/* Top flap — plain envelope colour; flips up and back */}
          <motion.div
            className="absolute inset-x-0 top-0 z-30 h-[58%] origin-top [transform-style:preserve-3d] will-change-transform"
            style={envVars}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: open ? 178 : 0 }}
            transition={{ duration: FLAP_MS / 1000, ease }}
          >
            {/* front */}
            <div className={`absolute inset-0 isolate overflow-hidden [backface-visibility:hidden] ${TRI}`}>
              <EnvPaper />
              <PatternBg id="env-flap-pat" opacity={0.1} className="absolute inset-0" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_30%,rgba(0,0,0,0.18))]" />
              <TriBorder />
              <CornerFlourish className="absolute left-3 top-3 h-14 w-14" />
              <CornerFlourish className="absolute right-3 top-3 h-14 w-14 -scale-x-100" />
            </div>

            {/* underside liner */}
            <div className={`absolute inset-0 isolate overflow-hidden [backface-visibility:hidden] [transform:rotateX(180deg)] ${TRI}`}>
              <EnvPaper variant="liner" />
              <PatternBg id="env-flap-back" opacity={0.18} className="absolute inset-0" />
              <TriBorder />
            </div>

            {/* wax seal at the V point — rides up with the flap */}
            <div
              className="absolute bottom-0 left-1/2 z-40 flex -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 bg-[image:var(--seal-gold)] shadow-[0_6px_16px_rgba(0,0,0,0.4)] [backface-visibility:hidden]"
              style={{ width: SEAL, height: SEAL, borderColor: "#d4af37" }}
            >
              <div
                className="grid place-items-center"
                style={{ ["--accent"]: "#3a2a12", ["--accent2"]: "#5c4a24" } as CSSProperties}
              >
                <Monogram size={SEAL - 14} />
              </div>
            </div>
          </motion.div>

          {!open && (
            <motion.div
              className="absolute bottom-[max(2.5rem,env(safe-area-inset-bottom))] left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 font-serif text-[0.85rem] uppercase tracking-[0.24em]"
              style={{ color: "var(--env-ink)", textShadow: "0 1px 2px rgba(0,0,0,0.18)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0.45, 1, 0.45], y: 0 }}
              transition={{ opacity: { repeat: Infinity, duration: 2.2 }, y: { duration: 0.6 } }}
            >
              <span
                className="h-3 w-3 animate-tap-pulse rounded-full border-[1.5px]"
                style={{ borderColor: "var(--env-gold)" }}
              />
              Tap to open
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
