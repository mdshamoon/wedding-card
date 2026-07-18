import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

type Status = "idle" | "saving" | "done" | "error";

const field =
  "w-full rounded-lg border border-line bg-[image:var(--box-bg)] px-3 py-2.5 text-ink placeholder:text-muted2 focus:outline-none focus:ring-1 focus:ring-accent";

export function RsvpForm() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Please enter your name.");
    if (attending === null) return setError("Please let us know if you can make it.");
    if (!supabase) return setError("RSVP isn't configured yet — please check back soon.");

    setStatus("saving");
    const { error: dbError } = await supabase.from("rsvps").insert({
      name: name.trim(),
      attending,
      guests: attending ? guests : 0,
      message: message.trim() || null,
    });
    if (dbError) {
      setStatus("error");
      setError("Something went wrong. Please try again.");
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
        <p className="font-script text-3xl text-accent2">Thank you!</p>
        <p className="mt-2 text-muted">
          {attending
            ? "We can't wait to celebrate with you, in shaa Allah."
            : "You'll be dearly missed — thank you for letting us know."}
        </p>
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
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
      />

      <div className="flex gap-2">
        <button type="button" className={toggle(true)} onClick={() => setAttending(true)}>
          Joyfully accept
        </button>
        <button type="button" className={toggle(false)} onClick={() => setAttending(false)}>
          Regretfully decline
        </button>
      </div>

      {attending && (
        <label className="flex items-center justify-between gap-3 text-muted">
          <span className="text-sm">Number of guests (incl. you)</span>
          <input
            type="number"
            min={1}
            max={20}
            className={`${field} w-20 text-center`}
            value={guests}
            onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
      )}

      <textarea
        className={`${field} min-h-[80px] resize-y`}
        placeholder="A note or wishes for the couple (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "saving"}
        className="mt-1 rounded-full bg-[image:var(--accent-gradient)] px-6 py-2.5 font-display text-sm tracking-[0.14em] text-[#3a2a12] shadow-[var(--card-shadow)] transition-transform active:scale-95 disabled:opacity-60"
      >
        {status === "saving" ? "Sending…" : "Send RSVP"}
      </button>
    </form>
  );
}
