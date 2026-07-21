import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { CornerFlourish, Monogram, PatternBg } from "./Ornaments";

const CHARGE_MS = 1200; // light traces around the seal
const SURGE_MS = 650; // light runs out along the V edges
const FLAP_MS = 1400;
const SLIDE_DELAY = 450;
const SLIDE_MS = 1700;
const OPEN_TOTAL = SLIDE_DELAY + SLIDE_MS + 250;
const ease = [0.62, 0, 0.25, 1] as const;
const SEAL = 116; // px
const RING = SEAL + 20;

// Flap: straight sides down to 76%, then a shallow V to the point.
const TRI = "[clip-path:polygon(0_0,100%_0,100%_76%,50%_100%,0_76%)]";
// Sleeve: top edge is the matching V (meets the flap along the same line).
const SLEEVE = "[clip-path:polygon(0_10%,50%_32%,100%_10%,100%_100%,0_100%)]";

const EDGE_GLOW = "drop-shadow(0 0 3px rgba(255,238,190,0.95))";
const LIGHT = "#f4d98a";

/** Gold edge tracing the flap outline; glows when the light is active. */
function TriBorder({ glow }: { glow?: boolean }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      style={{ filter: glow ? EDGE_GLOW : "none", transition: "filter 0.5s ease" }}
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

/** A ray of light that draws itself around the seal, led by a glowing head. */
function SealRing({ drawn, fade }: { drawn: boolean; fade: boolean }) {
  const C = 2 * Math.PI * 47;
  const draw: Transition = { duration: CHARGE_MS / 1000, ease: "linear" };
  return (
    <motion.div
      className="pointer-events-none absolute bottom-0 left-1/2 z-40 -translate-x-1/2 translate-y-1/2 [backface-visibility:hidden]"
      style={{ width: RING, height: RING }}
      initial={{ opacity: 0 }}
      animate={{ opacity: fade ? 0 : drawn ? 1 : 0 }}
      transition={{ duration: fade ? 0.5 : 0.25 }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full" style={{ filter: "drop-shadow(0 0 3px rgba(255,236,180,0.95))" }}>
        <motion.circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke={LIGHT}
          strokeWidth="2.6"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: drawn ? 0 : C }}
          transition={draw}
        />
      </svg>
      <motion.div
        className="absolute inset-0"
        initial={{ rotate: 0 }}
        animate={{ rotate: drawn ? 360 : 0 }}
        transition={draw}
      >
        <span
          className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "#fff8e3",
            boxShadow: "0 0 8px 3px rgba(255,242,200,0.95), 0 0 18px 7px rgba(255,214,130,0.65)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/** Light running from the seal (V point) outward along both V edges. */
function VEdgeLight({ run, show }: { run: boolean; show: boolean }) {
  const t: Transition = { duration: SURGE_MS / 1000, ease: "easeOut" };
  const line = {
    stroke: LIGHT,
    strokeWidth: 2.6,
    strokeLinecap: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
    fill: "none",
  };
  const head =
    "pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full";
  const headStyle: CSSProperties = {
    background: "#fff8e3",
    boxShadow: "0 0 8px 3px rgba(255,242,200,0.95), 0 0 16px 6px rgba(255,214,130,0.6)",
  };
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[38]"
      style={{ opacity: show ? 1 : 0, transition: "opacity 0.35s ease" }}
    >
      {/* beams grow from the V point (50,100) out to each corner (0/100, 76) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
        style={{ filter: "drop-shadow(0 0 3px rgba(255,236,180,0.95))" }}
      >
        <motion.line x1="50" y1="100" {...line} initial={{ x2: 50, y2: 100 }} animate={{ x2: run ? 0 : 50, y2: run ? 76 : 100 }} transition={t} />
        <motion.line x1="50" y1="100" {...line} initial={{ x2: 50, y2: 100 }} animate={{ x2: run ? 100 : 50, y2: run ? 76 : 100 }} transition={t} />
      </svg>
      {/* round glowing heads travelling the full edge */}
      <motion.span className={head} style={headStyle} initial={{ left: "50%", top: "100%" }} animate={{ left: run ? "0%" : "50%", top: run ? "76%" : "100%" }} transition={t} />
      <motion.span className={head} style={headStyle} initial={{ left: "50%", top: "100%" }} animate={{ left: run ? "100%" : "50%", top: run ? "76%" : "100%" }} transition={t} />
    </div>
  );
}

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

type Phase = "closed" | "charging" | "surge" | "opening";

export function WeddingCard({ onOpened }: { onOpened: () => void }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [gone, setGone] = useState(false);

  const charging = phase === "charging";
  const surge = phase === "surge";
  const opening = phase === "opening";
  const lit = phase !== "closed";

  useEffect(() => {
    document.body.style.overflow = gone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gone]);

  const start = () => {
    if (phase !== "closed") return;
    setPhase("charging");
    onOpened(); // keep the user gesture so audio can start
    window.setTimeout(() => setPhase("surge"), CHARGE_MS);
    window.setTimeout(() => setPhase("opening"), CHARGE_MS + SURGE_MS);
    window.setTimeout(() => setGone(true), CHARGE_MS + SURGE_MS + OPEN_TOTAL);
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
            animate={{ y: opening ? "104%" : 0 }}
            transition={{ duration: SLIDE_MS / 1000, delay: opening ? SLIDE_DELAY / 1000 : 0, ease }}
          >
            <EnvPaper />
            <PatternBg id="env-lower-pat" opacity={0.1} className="absolute inset-0" />
            {/* gold V edge along the sleeve's top — glows when lit */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
              style={{ filter: lit ? EDGE_GLOW : "none", transition: "filter 0.5s ease" }}
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
            animate={{ rotateX: opening ? 178 : 0 }}
            transition={{ duration: FLAP_MS / 1000, ease }}
          >
            {/* front */}
            <div className={`absolute inset-0 isolate overflow-hidden [backface-visibility:hidden] ${TRI}`}>
              <EnvPaper />
              <PatternBg id="env-flap-pat" opacity={0.1} className="absolute inset-0" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_30%,rgba(0,0,0,0.18))]" />
              <TriBorder glow={lit} />
              <CornerFlourish className="absolute left-3 top-3 h-14 w-14" />
              <CornerFlourish className="absolute right-3 top-3 h-14 w-14 -scale-x-100" />
            </div>

            {/* underside liner */}
            <div className={`absolute inset-0 isolate overflow-hidden [backface-visibility:hidden] [transform:rotateX(180deg)] ${TRI}`}>
              <EnvPaper variant="liner" />
              <PatternBg id="env-flap-back" opacity={0.18} className="absolute inset-0" />
              <TriBorder />
            </div>

            {/* soft glow behind the seal while the light charges */}
            <motion.div
              className="pointer-events-none absolute bottom-0 left-1/2 z-[39] -translate-x-1/2 translate-y-1/2 rounded-full [backface-visibility:hidden]"
              style={{
                width: SEAL * 2.2,
                height: SEAL * 2.2,
                background: "radial-gradient(circle, rgba(255,238,190,0.55) 0%, transparent 62%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: charging || surge ? 0.9 : 0 }}
              transition={{ duration: charging ? CHARGE_MS / 1000 : 0.4, ease: "easeIn" }}
            />

            {/* wax seal at the V point — rides up with the flap */}
            <div
              className="absolute bottom-0 left-1/2 z-40 flex -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 bg-[image:var(--seal-gold)] shadow-[0_6px_16px_rgba(0,0,0,0.4)] [backface-visibility:hidden]"
              style={{ width: SEAL, height: SEAL, borderColor: "var(--seal-edge)" }}
            >
              <div
                className="grid place-items-center"
                style={{ ["--accent"]: "var(--seal-ink)", ["--accent2"]: "var(--seal-ink2)" } as CSSProperties}
              >
                <Monogram size={SEAL - 14} />
              </div>
            </div>

            {/* 1) light draws around the seal, then 2) runs out along the V edges */}
            <SealRing drawn={lit} fade={opening} />
            <VEdgeLight run={surge || opening} show={surge || opening} />
          </motion.div>

          {phase === "closed" && (
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
