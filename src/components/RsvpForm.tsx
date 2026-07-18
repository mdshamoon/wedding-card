import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { useLang } from "../i18n";

type Status = "idle" | "saving" | "done" | "error";

const field =
  "w-full rounded-lg border border-line bg-[image:var(--box-bg)] px-3 py-2.5 text-ink placeholder:text-muted2 focus:outline-none focus:ring-1 focus:ring-accent";

export function RsvpForm() {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError(t.errName);
    if (attending === null) return setError(t.errAttend);
    if (!supabase) return setError(t.errConfig);

    setStatus("saving");
    const { error: dbError } = await supabase.from("rsvps").insert({
      name: name.trim(),
      attending,
      guests: attending ? guests : 0,
      message: message.trim() || null,
    });
    if (dbError) {
      setStatus("error");
      setError(t.errGeneric);
      return;
    }
    setStatus("done");
  };

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-line bg-[image:var(--box-bg)] px-5 py-8 text-center"
      >
        <p className="font-script text-3xl text-accent2">{t.thankYou}</p>
        <p className="mt-2 text-muted">{attending ? t.thanksAccept : t.thanksDecline}</p>
      </motion.div>
    );
  }

  const toggle = (val: boolean) =>
    `flex-1 rounded-lg border px-3 py-2.5 text-sm tracking-wide transition-colors ${
      attending === val
        ? "border-accent bg-[image:var(--box-bg)] text-accent"
        : "border-line text-muted2"
    }`;

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 text-left">
      <input
        className={field}
        placeholder={t.namePh}
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
      />

      <div className="flex gap-2">
        <button type="button" className={toggle(true)} onClick={() => setAttending(true)}>
          {t.accept}
        </button>
        <button type="button" className={toggle(false)} onClick={() => setAttending(false)}>
          {t.decline}
        </button>
      </div>

      {attending && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted">{t.guestsLabel}</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Fewer guests"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-2xl leading-none text-accent active:scale-95 disabled:opacity-40"
              disabled={guests <= 1}
            >
              −
            </button>
            <span className="w-8 text-center font-display text-xl tabular-nums text-ink">{guests}</span>
            <button
              type="button"
              aria-label="More guests"
              onClick={() => setGuests((g) => Math.min(20, g + 1))}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-2xl leading-none text-accent active:scale-95 disabled:opacity-40"
              disabled={guests >= 20}
            >
              +
            </button>
          </div>
        </div>
      )}

      <textarea
        className={`${field} min-h-[80px] resize-y`}
        placeholder={t.notePh}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "saving"}
        className="mt-1 rounded-full bg-[image:var(--accent-gradient)] px-6 py-2.5 font-display text-sm tracking-[0.14em] text-[#3a2a12] shadow-[var(--card-shadow)] transition-transform active:scale-95 disabled:opacity-60"
      >
        {status === "saving" ? t.sending : t.send}
      </button>
    </form>
  );
}
