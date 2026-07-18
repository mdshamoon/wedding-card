import { motion, type Variants } from "framer-motion";
import { wedding } from "../config";
import { CountdownTimer } from "./CountdownTimer";
import { CornerFlourish, Divider, Monogram } from "./Ornaments";
import { EventActions } from "./EventActions";
import { RsvpForm } from "./RsvpForm";
import { ShareButton } from "./ShareButton";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function Invitation() {
  return (
    <main className="relative flex min-h-dvh w-full justify-center px-6 pb-20 pt-14 sm:px-8">
      {/* Persistent full-screen frame + corner flourishes — the "card" edge */}
      <div className="pointer-events-none fixed inset-2.5 z-0 rounded-2xl border border-line sm:inset-4" />
      <CornerFlourish className="pointer-events-none fixed left-3 top-3 z-0 h-14 w-14 opacity-90 sm:left-5 sm:top-5" />
      <CornerFlourish className="pointer-events-none fixed right-3 top-3 z-0 h-14 w-14 -scale-x-100 opacity-90 sm:right-5 sm:top-5" />
      <CornerFlourish className="pointer-events-none fixed bottom-3 left-3 z-0 h-14 w-14 -scale-y-100 opacity-90 sm:bottom-5 sm:left-5" />
      <CornerFlourish className="pointer-events-none fixed bottom-3 right-3 z-0 h-14 w-14 -scale-100 opacity-90 sm:bottom-5 sm:right-5" />

      <motion.div
        className="relative z-[1] w-full max-w-[34rem] text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p variants={item} className="mb-6 font-arabic text-2xl leading-[1.8] text-accent2">
          {wedding.bismillah}
        </motion.p>

        <motion.p variants={item} className="text-lg italic text-muted">
          {wedding.hostLine}
        </motion.p>

        <motion.p variants={item} className="mt-1.5 text-[0.95rem] tracking-wide text-muted2">
          request the honour of your presence at the wedding of
        </motion.p>

        <motion.div variants={item} className="mb-1.5 mt-6 flex flex-col items-center gap-1">
          <h1 className="font-script text-[3.1rem] leading-tight gold-text sm:text-6xl">
            {wedding.groom}
          </h1>
          <span className="font-serif text-2xl italic text-accent">&amp;</span>
          <h1 className="font-script text-[3.1rem] leading-tight gold-text sm:text-6xl">
            {wedding.bride}
          </h1>
        </motion.div>

        <motion.div variants={item} className="mb-1 mt-4 flex justify-center">
          <Monogram size={88} />
        </motion.div>

        <motion.div variants={item} className="my-4 flex justify-center">
          <Divider width={240} />
        </motion.div>

        <motion.p variants={item} className="mb-4 text-base italic text-muted">
          Counting down to our big day
        </motion.p>
        <motion.div variants={item} className="mb-2">
          <CountdownTimer target={wedding.countdownTarget} />
        </motion.div>

        <motion.div variants={item} className="mb-2 mt-9 flex flex-col gap-5">
          {wedding.events.map((e) => (
            <div
              key={e.title}
              className="rounded-xl border border-line bg-[image:var(--box-bg)] px-4 py-5"
            >
              <h2 className="mb-2 font-display text-lg tracking-wider gold-text">{e.title}</h2>
              <p className="text-sm uppercase tracking-[0.2em] text-muted2">{e.day}</p>
              <p className="my-0.5 font-display text-[1.35rem] text-ink">{e.date}</p>
              <p className="mb-2 text-base text-muted">{e.time}</p>
              <p className="text-[1.05rem] italic text-accent2">{e.venue}</p>
              <p className="text-sm text-muted2">{e.address}</p>
              <EventActions event={e} maps={e.maps} />
            </div>
          ))}
        </motion.div>

        <motion.div variants={item} className="my-5 flex justify-center">
          <Divider width={200} />
        </motion.div>

        <motion.blockquote variants={item} className="mx-1.5">
          <p className="text-base italic leading-relaxed text-muted">“{wedding.quote.text}”</p>
          <cite className="mt-2.5 block text-sm not-italic tracking-wider text-accent">
            {wedding.quote.source}
          </cite>
        </motion.blockquote>

        <motion.div variants={item} className="my-5 flex justify-center">
          <Divider width={200} />
        </motion.div>

        {/* RSVP */}
        <motion.div variants={item} className="mx-auto max-w-[26rem]">
          <h2 className="font-display text-xl tracking-[0.14em] gold-text">RSVP</h2>
          <p className="mb-4 mt-1 text-sm italic text-muted">
            Kindly let us know by 10 March 2027
          </p>
          <RsvpForm />
        </motion.div>

        {/* Share */}
        <motion.div variants={item} className="mt-8 flex justify-center">
          <ShareButton
            url={wedding.siteUrl}
            title={`${wedding.groom} & ${wedding.bride} — Wedding`}
            text={`You're invited to the wedding of ${wedding.groom} & ${wedding.bride}!`}
          />
        </motion.div>

        <motion.p variants={item} className="mt-8 font-script text-[1.9rem] text-accent2">
          {wedding.closing}
        </motion.p>
      </motion.div>
    </main>
  );
}
