import Countdown, { type CountdownRenderProps } from "react-countdown";
import { motion } from "framer-motion";

function Unit({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="min-w-[3.6rem] rounded-[0.6rem] border border-line bg-[image:var(--cd-box-bg)] px-2 py-2 shadow-[var(--cd-box-shadow)] sm:min-w-[4.4rem] sm:py-2.5">
        <span className="block text-center font-display text-[1.75rem] leading-none tabular-nums gold-text sm:text-[2.2rem]">
          {padded}
        </span>
      </div>
      <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted2 sm:text-[0.75rem]">
        {label}
      </span>
    </div>
  );
}

function Sep() {
  return <span className="pt-2 font-display text-2xl text-accent/70">:</span>;
}

const renderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
  if (completed) {
    return (
      <p className="text-center font-script text-3xl gold-text">
        The blessed day is here — Alhamdulillah!
      </p>
    );
  }
  return (
    <motion.div
      className="flex items-start justify-center gap-1.5 sm:gap-2.5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Unit value={days} label="Days" />
      <Sep />
      <Unit value={hours} label="Hours" />
      <Sep />
      <Unit value={minutes} label="Minutes" />
      <Sep />
      <Unit value={seconds} label="Seconds" />
    </motion.div>
  );
};

export function CountdownTimer({ target }: { target: string }) {
  return <Countdown date={new Date(target)} renderer={renderer} />;
}
