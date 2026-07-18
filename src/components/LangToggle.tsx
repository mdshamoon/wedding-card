import { useLang, type Lang } from "../i18n";

const options: { id: Lang; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "ur", label: "اردو" },
];

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="fixed left-1/2 top-3 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-[image:var(--card-bg)] px-1 py-1 shadow-[var(--card-shadow)] backdrop-blur-sm">
      {options.map((o) => {
        const active = lang === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => setLang(o.id)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1 text-xs tracking-wide transition-colors ${
              active ? "bg-[image:var(--accent-gradient)] text-[#3a2a12]" : "text-muted2"
            }`}
            style={o.id === "ur" ? { fontFamily: "var(--font-urdu)" } : undefined}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
