import type { ReactNode } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { wedding } from "../config";
import { useLang } from "../i18n";
import { getGuestName } from "../lib/guest";
import { CountdownTimer } from "./CountdownTimer";
import { CornerFlourish, Divider, Monogram } from "./Ornaments";
import { EventActions } from "./EventActions";
import { RsvpForm } from "./RsvpForm";
import { ShareButton } from "./ShareButton";

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/** Fades/slides its children in as they scroll into view. */
function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={item}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export function Invitation() {
  const { lang, t } = useLang();
  const ur = lang === "ur";
  const script = ur ? "" : "font-script";
  const display = ur ? "" : "font-display";
  // Nastaliq needs extra line-height + padding so descenders aren't clipped.
  const nameCls = ur
    ? "text-[2.3rem] sm:text-5xl leading-[2.1] py-2 gold-text"
    : "font-script text-[3.1rem] sm:text-6xl leading-[1.15] gold-text";
  const guest = getGuestName();

  // Gentle parallax on the fixed corner florals as you scroll.
  const { scrollY } = useScroll();
  const yUp = useTransform(scrollY, [0, 900], [0, -50]);
  const yDown = useTransform(scrollY, [0, 900], [0, 50]);

  const eventKeys = ["nikah", "walima"] as const;

  return (
    <main className="relative flex min-h-dvh w-full justify-center px-6 pb-20 pt-16 sm:px-8">
      {/* Persistent full-screen frame + corner flourishes (with parallax) */}
      <div className="pointer-events-none fixed inset-2.5 z-0 rounded-2xl border border-line sm:inset-4" />
      <motion.div style={{ y: yUp }} className="pointer-events-none fixed left-3 top-3 z-0 sm:left-5 sm:top-5">
        <CornerFlourish className="h-14 w-14 opacity-90" />
      </motion.div>
      <motion.div style={{ y: yUp }} className="pointer-events-none fixed right-3 top-3 z-0 sm:right-5 sm:top-5">
        <CornerFlourish className="h-14 w-14 -scale-x-100 opacity-90" />
      </motion.div>
      <motion.div style={{ y: yDown }} className="pointer-events-none fixed bottom-3 left-3 z-0 sm:bottom-5 sm:left-5">
        <CornerFlourish className="h-14 w-14 -scale-y-100 opacity-90" />
      </motion.div>
      <motion.div style={{ y: yDown }} className="pointer-events-none fixed bottom-3 right-3 z-0 sm:bottom-5 sm:right-5">
        <CornerFlourish className="h-14 w-14 -scale-100 opacity-90" />
      </motion.div>

      <div
        dir={t.dir}
        className="relative z-[1] w-full max-w-[34rem] text-center"
        style={ur ? { fontFamily: "var(--font-urdu)" } : undefined}
      >
        {guest && (
          <Reveal>
            <p className={`mb-3 text-lg text-accent ${ur ? "leading-loose" : "italic"}`}>{t.dear(guest)}</p>
          </Reveal>
        )}

        <Reveal>
          <p className="mb-6 font-arabic text-2xl leading-[1.8] text-accent2" dir="rtl">
            {wedding.bismillah}
          </p>
        </Reveal>

        <Reveal>
          <p className={`text-lg text-muted ${ur ? "leading-loose" : "italic"}`}>{t.host}</p>
        </Reveal>

        <Reveal>
          <p className={`mt-1.5 text-[0.95rem] tracking-wide text-muted2 ${ur ? "leading-loose" : ""}`}>
            {t.request}
          </p>
        </Reveal>

        <Reveal className="mb-1.5 mt-6 flex flex-col items-center gap-1">
          <h1 className={nameCls}>{t.names.groom}</h1>
          <span className="font-serif text-2xl italic text-accent">&amp;</span>
          <h1 className={nameCls}>{t.names.bride}</h1>
        </Reveal>

        <Reveal className="mb-1 mt-4 flex justify-center">
          <Monogram size={88} />
        </Reveal>

        <Reveal className="my-4 flex justify-center">
          <Divider width={240} />
        </Reveal>

        <Reveal>
          <p className={`mb-4 text-base text-muted ${ur ? "leading-loose" : "italic"}`}>{t.countdownHead}</p>
        </Reveal>
        <Reveal className="mb-2">
          <CountdownTimer target={wedding.countdownTarget} />
        </Reveal>

        <Reveal className="mb-2 mt-9 flex flex-col gap-5">
          {wedding.events.map((e, i) => (
            <div
              key={e.title}
              className="rounded-xl border border-line bg-[image:var(--box-bg)] px-4 py-5"
            >
              <h2 className={`mb-2 ${display} text-lg tracking-wider gold-text`}>{t.events[eventKeys[i]]}</h2>
              <p className="text-sm uppercase tracking-[0.2em] text-muted2">{t.days[e.day] ?? e.day}</p>
              <p className={`my-0.5 ${display} text-[1.35rem] text-ink`} dir="ltr">{e.date}</p>
              <p className="mb-2 text-base text-muted" dir="ltr">{e.time}</p>
              <p className={`text-[1.05rem] text-accent2 ${ur ? "" : "italic"}`}>{e.venue}</p>
              <p className="text-sm text-muted2">{e.address}</p>
              <EventActions event={e} maps={e.maps} />
            </div>
          ))}
        </Reveal>

        <Reveal className="my-5 flex justify-center">
          <Divider width={200} />
        </Reveal>

        <Reveal className="mx-1.5">
          <blockquote>
            <p className={`text-base leading-relaxed text-muted ${ur ? "leading-loose" : "italic"}`}>
              “{t.quote}”
            </p>
            <cite className="mt-2.5 block text-sm not-italic tracking-wider text-accent" dir="ltr">
              {t.quoteSrc}
            </cite>
          </blockquote>
        </Reveal>

        <Reveal className="my-5 flex justify-center">
          <Divider width={200} />
        </Reveal>

        {/* RSVP */}
        <Reveal className="mx-auto max-w-[26rem]">
          <h2 className={`${display} text-xl tracking-[0.14em] gold-text`}>{t.rsvp}</h2>
          <p className={`mb-4 mt-1 text-sm text-muted ${ur ? "leading-loose" : "italic"}`}>{t.rsvpBy}</p>
          <RsvpForm />
        </Reveal>

        {/* Share */}
        <Reveal className="mt-8 flex justify-center">
          <ShareButton
            url={wedding.siteUrl}
            title={`${wedding.groom} & ${wedding.bride} — Wedding`}
            text={`You're invited to the wedding of ${wedding.groom} & ${wedding.bride}!`}
          />
        </Reveal>

        {/* 3D reception hall */}
        <Reveal className="mt-4 flex justify-center">
          <a
            href="#/seating"
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-display text-sm tracking-[0.14em] text-accent transition-transform active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            {t.viewHall}
          </a>
        </Reveal>

        <Reveal>
          <p className={`mt-8 ${script} text-[1.9rem] text-accent2 ${ur ? "py-1 leading-[2.1]" : ""}`}>{t.closing}</p>
        </Reveal>
      </div>
    </main>
  );
}
