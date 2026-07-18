import { useEffect, useRef, useState } from "react";

/**
 * Loops background music. Playback starts on `start` (the "tap to open"
 * gesture) so it satisfies browser autoplay-with-sound policies.
 * mp3 first for Safari/iOS, webm as a fallback.
 */
export function BackgroundMusic({ start }: { start: boolean }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const a = ref.current;
    if (!start || !a || started) return;
    a.volume = 0.55;
    a.play()
      .then(() => setStarted(true))
      .catch(() => {
        /* blocked — the toggle can start it manually */
      });
  }, [start, started]);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) {
      a.play().catch(() => {});
      a.muted = false;
      setMuted(false);
      setStarted(true);
      return;
    }
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  return (
    <>
      <audio ref={ref} loop preload="auto">
        <source src={`${import.meta.env.BASE_URL}music.mp3`} type="audio/mpeg" />
        <source src={`${import.meta.env.BASE_URL}music.webm`} type="audio/webm" />
      </audio>

      {started && (
        <button
          type="button"
          onClick={toggle}
          aria-label={muted ? "Unmute music" : "Mute music"}
          className="fixed left-3 top-3 z-[60] grid h-9 w-9 place-items-center rounded-full border border-line bg-[image:var(--card-bg)] text-accent shadow-[var(--card-shadow)] backdrop-blur-sm"
        >
          {muted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
