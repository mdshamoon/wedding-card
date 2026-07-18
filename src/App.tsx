import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WeddingCard } from "./components/WeddingCard";
import { Invitation } from "./components/Invitation";
import { Petals } from "./components/Petals";
import { ThemeToggle } from "./components/ThemeToggle";
import { BackgroundMusic } from "./components/BackgroundMusic";
import { LangToggle } from "./components/LangToggle";
import { PatternBg } from "./components/Ornaments";
import { LangProvider } from "./i18n";
import { useTheme } from "./theme";

const SeatingPage = lazy(() => import("./components/SeatingPage"));

function useHashRoute() {
  const parse = () => window.location.hash.replace(/^#\/?/, "");
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => setRoute(parse());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const { theme, setTheme } = useTheme();
  const route = useHashRoute();

  if (route === "seating") {
    return (
      <LangProvider>
        <Suspense
          fallback={
            <div className="fixed inset-0 grid place-items-center bg-[#2a3149] font-display tracking-widest text-[#ffe8c0]">
              Loading…
            </div>
          }
        >
          <SeatingPage />
        </Suspense>
      </LangProvider>
    );
  }

  return (
    <LangProvider>
    <div className="relative">
      {/* full-screen paper texture behind everything */}
      <PatternBg id="page-pat" opacity={0.06} className="pointer-events-none fixed inset-0 z-0" />

      <ThemeToggle theme={theme} setTheme={setTheme} />
      <LangToggle />
      <BackgroundMusic start={opened} />

      {opened && <Petals />}

      <Invitation />

      <WeddingCard onOpened={() => setOpened(true)} />

      <AnimatePresence>
        {opened && (
          <motion.div
            className="pointer-events-none fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-xs uppercase tracking-[0.24em] text-accent2/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1], y: [0, 6, 0] }}
            transition={{ delay: 2, duration: 2, repeat: 3 }}
            aria-hidden
          >
            <span>Scroll</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </LangProvider>
  );
}
