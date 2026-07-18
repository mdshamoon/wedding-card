import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { directionsUrl, downloadIcs, gcalUrl, type CalEvent } from "../lib/calendar";

const pill =
  "inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-[0.7rem] uppercase tracking-[0.12em] text-accent transition-colors hover:bg-[image:var(--box-bg)]";

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function CalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export function EventActions({ event, maps }: { event: CalEvent; maps: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <a className={pill} href={directionsUrl(maps)} target="_blank" rel="noopener noreferrer">
          <PinIcon /> Directions
        </a>
        <button type="button" className={pill} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          <CalIcon /> Add to Calendar
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <a
              className={pill}
              href={gcalUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              Google
            </a>
            <button
              type="button"
              className={pill}
              onClick={() => {
                downloadIcs(event);
                setOpen(false);
              }}
            >
              Apple / Other
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
