import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WeddingCard } from "./components/WeddingCard";
import { Invitation } from "./components/Invitation";
import { Petals } from "./components/Petals";
import { ThemeToggle } from "./components/ThemeToggle";
import { PatternBg } from "./components/Ornaments";
import { useTheme } from "./theme";

export default function App() {
  const [opened, setOpened] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative">
      {/* full-screen paper texture behind everything */}
      <PatternBg id="page-pat" opacity={0.06} className="pointer-events-none fixed inset-0 z-0" />

      <ThemeToggle theme={theme} setTheme={setTheme} />

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
  );
}
