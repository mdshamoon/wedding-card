import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ur";

export interface Dict {
  dir: "ltr" | "rtl";
  dear: (n: string) => string;
  host: string;
  request: string;
  theWeddingOf: string;
  countdownHead: string;
  units: { days: string; hours: string; minutes: string; seconds: string };
  dayIsHere: string;
  directions: string;
  addCalendar: string;
  google: string;
  apple: string;
  rsvp: string;
  rsvpBy: string;
  namePh: string;
  accept: string;
  decline: string;
  guestsLabel: string;
  notePh: string;
  send: string;
  sending: string;
  thankYou: string;
  thanksAccept: string;
  thanksDecline: string;
  errName: string;
  errAttend: string;
  errConfig: string;
  errGeneric: string;
  share: string;
  copied: string;
  closing: string;
  quote: string;
  quoteSrc: string;
  names: { groom: string; bride: string };
  events: { nikah: string; walima: string };
  days: Record<string, string>;
}

// All translatable copy. Proper nouns (venues) and numeric dates stay as-is.
export const dict: Record<Lang, Dict> = {
  en: {
    dir: "ltr",
    dear: (n: string) => `Dear ${n},`,
    host: "Together with their beloved families",
    request: "request the honour of your presence at the wedding of",
    theWeddingOf: "The Wedding of",
    countdownHead: "Counting down to our big day",
    units: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
    dayIsHere: "The blessed day is here — Alhamdulillah!",
    directions: "Directions",
    addCalendar: "Add to Calendar",
    google: "Google",
    apple: "Apple / Other",
    rsvp: "RSVP",
    rsvpBy: "Kindly let us know by 10 March 2027",
    namePh: "Your name",
    accept: "Joyfully accept",
    decline: "Regretfully decline",
    guestsLabel: "Number of guests (incl. you)",
    notePh: "A note or wishes for the couple (optional)",
    send: "Send RSVP",
    sending: "Sending…",
    thankYou: "Thank you!",
    thanksAccept: "We can't wait to celebrate with you, in shaa Allah.",
    thanksDecline: "You'll be dearly missed — thank you for letting us know.",
    errName: "Please enter your name.",
    errAttend: "Please let us know if you can make it.",
    errConfig: "RSVP isn't configured yet — please check back soon.",
    errGeneric: "Something went wrong. Please try again.",
    share: "Share this invitation",
    copied: "Link copied!",
    closing: "Your presence is the blessing we seek",
    quote:
      "And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquillity with them, and He has put love and mercy between your hearts.",
    quoteSrc: "— Surah Ar-Rum (30:21)",
    names: { groom: "Mohd Shamoon", bride: "Alina Fatima" },
    events: { nikah: "The Nikah", walima: "The Reception (Walima)" },
    days: { Wednesday: "Wednesday", Thursday: "Thursday" },
  },
  ur: {
    dir: "rtl",
    dear: (n: string) => `محترم ${n}،`,
    host: "اپنے پیارے خاندانوں کے ہمراہ",
    request: "آپ کو اپنی شادی کی تقریب میں تشریف آوری کی پُرخلوص دعوت دیتے ہیں",
    theWeddingOf: "شادی خانہ آبادی",
    countdownHead: "ہمارے خاص دن کی اُلٹی گنتی جاری ہے",
    units: { days: "دن", hours: "گھنٹے", minutes: "منٹ", seconds: "سیکنڈ" },
    dayIsHere: "مبارک دن آ پہنچا — الحمد للہ!",
    directions: "راستہ دیکھیں",
    addCalendar: "کیلنڈر میں شامل کریں",
    google: "گوگل",
    apple: "ایپل / دیگر",
    rsvp: "شرکت کی تصدیق",
    rsvpBy: "براہِ کرم 10 مارچ 2027 تک مطلع فرمائیں",
    namePh: "آپ کا نام",
    accept: "خوشی سے قبول",
    decline: "معذرت کے ساتھ انکار",
    guestsLabel: "مہمانوں کی تعداد (بشمول آپ)",
    notePh: "جوڑے کے لیے پیغام یا دعائیں (اختیاری)",
    send: "تصدیق بھیجیں",
    sending: "بھیجا جا رہا ہے…",
    thankYou: "شکریہ!",
    thanksAccept: "ہم آپ کے ساتھ اس خوشی میں شریک ہونے کے منتظر ہیں، اِن شاء اللہ۔",
    thanksDecline: "آپ کی کمی محسوس ہوگی — مطلع کرنے کا شکریہ۔",
    errName: "براہِ کرم اپنا نام درج کریں۔",
    errAttend: "براہِ کرم بتائیں کہ آیا آپ تشریف لا سکتے ہیں۔",
    errConfig: "شرکت کی تصدیق ابھی دستیاب نہیں — جلد دوبارہ کوشش کریں۔",
    errGeneric: "کچھ خرابی ہوئی۔ دوبارہ کوشش کریں۔",
    share: "دعوت نامہ شیئر کریں",
    copied: "لنک کاپی ہو گیا!",
    closing: "آپ کی تشریف آوری ہی ہماری سب سے بڑی سعادت ہے",
    quote:
      "اور اس کی نشانیوں میں سے یہ ہے کہ اس نے تمہارے لیے تمہی میں سے جوڑے پیدا کیے تاکہ تم اُن سے سکون پاؤ، اور اُس نے تمہارے درمیان محبت اور رحمت رکھی۔",
    quoteSrc: "— سورۃ الروم (۳۰:۲۱)",
    names: { groom: "محمد شمعون", bride: "آلینہ فاطمہ" },
    events: { nikah: "نکاح", walima: "ولیمہ" },
    days: { Wednesday: "بدھ", Thursday: "جمعرات" },
  },
};

type LangCtx = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void; t: Dict };
const Ctx = createContext<LangCtx | null>(null);

const KEY = "wc-lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "en" || saved === "ur") return saved;
    } catch {
      /* ignore */
    }
    return "en";
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(() => setLangState((l) => (l === "en" ? "ur" : "en")), []);

  return <Ctx.Provider value={{ lang, setLang, toggle, t: dict[lang] }}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
