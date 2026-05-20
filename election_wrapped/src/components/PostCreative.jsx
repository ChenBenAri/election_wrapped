import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";

const STORY_SEGMENTS = 4;
const STORY_FILLED = 2;

/** ארבעת רקעי אופציה ב׳ (קבצים ב־public) */
const OPTION_B_BACKGROUNDS = [
  { id: "b-periwinkle", src: "/option-b-bg-1.png" },
  { id: "b-mustard", src: "/option-b-bg-2.png" },
  { id: "b-lime", src: "/option-b-bg-3.png" },
  { id: "b-red", src: "/option-b-bg-4.png" },
];

/** שקופית 1 (ובשאר השקופיות מלבד 2) */
const DEFAULT_SLIDE_HEADLINE = "3 הנושאים שחשובים לך בבחירות הקרובות:";
const DEFAULT_SLIDE_LINES = [
  "שוק חופשי ומינימום התערבות ממשלתית",
  "שאיפה להסדר מדיני ארוך טווח",
  "איכות מערכת החינוך",
];

/** שקופית 2 — התאמה למועמדים (כל האופציות) */
const CANDIDATES_SLIDE_HEADLINE = "התאמה למועמד באחוזים:";
const CANDIDATES_SLIDE_LINES = ["יאיר לפיד 85%", "יאיר גולן 67%", "אביגדור ליברמן 43%"];

/** שקופית 4 — קואליציה טבעית (כל האופציות) */
const COALITION_SLIDE_HEADLINE = "מי הקואלציה הטבעית שלך:";
const COALITION_SLIDE_LINES = ["מרכז", "שמאל", "ערבים"];

/** שקופית 3 — מפה פוליטית (כל האופציות) */
const POLITICAL_MAP_HEADLINE = "המפה הפוליטית שלך:";

const POLITICAL_MAP_AXES = [
  { id: "general", label: "קפיטליסט", dotSide: "right" },
  { id: "political", label: "שמאלני", dotSide: "left", dotLeft: "24%" },
  { id: "social", label: "ליברלי", dotSide: "left" },
];

const POLITICAL_MAP_DOT_LEFT = { right: "82%", left: "12%" };

function getSlideCopy(slideIndex) {
  if (slideIndex === 1) {
    return { headline: CANDIDATES_SLIDE_HEADLINE, lines: CANDIDATES_SLIDE_LINES };
  }
  if (slideIndex === 3) {
    return { headline: COALITION_SLIDE_HEADLINE, lines: COALITION_SLIDE_LINES };
  }
  return { headline: DEFAULT_SLIDE_HEADLINE, lines: DEFAULT_SLIDE_LINES };
}

const POLITICAL_MAP_THEMES = {
  neon: {
    headline: "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]",
    axis: "bg-gradient-to-r from-white/15 via-white/35 to-white/15",
    tick: "bg-white/25",
    dot: "border-[#ff2bd6] bg-[#ff2bd6] shadow-[0_0_12px_rgba(255,43,214,0.65)]",
    label: "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]",
    rowBg: "",
  },
  light: {
    headline: "text-slate-900",
    axis: "bg-gradient-to-r from-slate-200 via-slate-400 to-slate-200",
    tick: "bg-slate-300",
    dot: "border-blue-600 bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.35)]",
    label: "text-slate-900",
    rowBg: "",
  },
  spotify: {
    headline: "text-neutral-950",
    axis: "bg-gradient-to-r from-neutral-300 via-neutral-500 to-neutral-300",
    tick: "bg-neutral-400",
    dot: "border-neutral-900 bg-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.35)]",
    label: "text-neutral-950",
    rowBg: "",
  },
  /** אופציה 1 (פרופיל) — מפה פוליטית עם טקסט לבן על רקע כהה */
  profile: {
    headline: "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]",
    axis: "bg-gradient-to-r from-white/20 via-white/45 to-white/20",
    tick: "bg-white/35",
    dot: "border-white bg-white shadow-[0_0_12px_rgba(255,255,255,0.55)]",
    label: "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]",
    rowBg: "",
  },
};

/** ציר אופקי עם נקודה ותווית מעליה */
function PoliticalAxisRow({ label, dotSide, dotLeft: dotLeftOverride, theme, compact }) {
  const t = POLITICAL_MAP_THEMES[theme];
  const dotLeft = dotLeftOverride ?? POLITICAL_MAP_DOT_LEFT[dotSide];

  return (
    <li className="w-full">
      <div className={`relative w-full ${compact ? "h-9" : "h-10"}`} dir="ltr">
        <span
          className={`pointer-events-none absolute bottom-[calc(50%+10px)] -translate-x-1/2 whitespace-nowrap text-[0.68rem] font-black leading-none sm:text-xs ${t.label}`}
          style={{ left: dotLeft }}
        >
          {label}
        </span>
        <span className={`absolute left-0 top-1/2 h-2 w-0.5 -translate-y-1/2 rounded-full ${t.tick}`} aria-hidden />
        <span className={`absolute right-0 top-1/2 h-2 w-0.5 -translate-y-1/2 rounded-full ${t.tick}`} aria-hidden />
        <span className={`absolute left-1 right-1 top-1/2 h-[2px] -translate-y-1/2 rounded-full ${t.axis}`} aria-hidden />
        <span
          className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 sm:h-4 sm:w-4 ${t.dot}`}
          style={{ left: dotLeft }}
          aria-hidden
        />
      </div>
    </li>
  );
}

/** שקופית 3 — מפה פוליטית עם צירים מצוירים */
function PoliticalMapSlidePanel({ theme, compact }) {
  const t = POLITICAL_MAP_THEMES[theme];
  const headlineClass = compact
    ? `max-w-[19.5rem] text-balance text-center text-[0.95rem] font-black leading-[1.22] tracking-[-0.018em] sm:text-[1.05rem] ${t.headline}`
    : `max-w-[21rem] text-balance text-center text-[1.05rem] font-black leading-[1.2] tracking-[-0.018em] sm:text-[1.2rem] ${t.headline}`;

  const inner = (
    <div className="pointer-events-none flex w-full flex-col items-center justify-center gap-2 px-2 sm:gap-2.5">
      <h2 className={headlineClass}>{POLITICAL_MAP_HEADLINE}</h2>
      <ul className={`mt-1 w-full space-y-3 sm:mt-1.5 sm:space-y-3.5 ${compact ? "max-w-[17.5rem]" : "max-w-[19rem]"}`}>
        {POLITICAL_MAP_AXES.map((axis) => (
          <PoliticalAxisRow
            key={axis.id}
            label={axis.label}
            dotSide={axis.dotSide}
            dotLeft={axis.dotLeft}
            theme={theme}
            compact={compact}
          />
        ))}
      </ul>
    </div>
  );

  if (theme === "spotify" || theme === "profile") {
    const articleClass =
      theme === "profile"
        ? compact
          ? "relative overflow-hidden rounded-2xl border border-white/15 bg-black/55 px-3 py-5 shadow-[0_12px_36px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-4 sm:py-6"
          : "relative overflow-hidden rounded-[1.35rem] border border-white/18 bg-black/50 px-4 py-6 shadow-[0_16px_44px_rgba(0,0,0,0.4)] backdrop-blur-md sm:px-5 sm:py-8"
        : compact
          ? "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/88 px-3 py-5 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-[2px] sm:px-4 sm:py-6"
          : "relative overflow-hidden rounded-[1.35rem] border border-white/[0.09] bg-[#0a0a0a]/85 px-4 py-6 shadow-[0_16px_44px_rgba(0,0,0,0.48)] backdrop-blur-[2px] sm:px-5 sm:py-8";
    return (
      <div className="pointer-events-none w-full max-w-[min(100%,26rem)] select-none sm:max-w-[28rem]">
        <article className={articleClass}>{inner}</article>
      </div>
    );
  }

  return inner;
}

const VALUES_SLIDE_COUNT = 4;
const MAP_SLIDE_COUNT = 4;

/** מעבר שקופית: קדימה = נכנס משמאל, יוצא ימינה (כיוון עברית) */
const rtlSlideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? -16 : 16 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? 16 : -16 }),
};

const rtlSlideTransition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] };

const SHARE_BTN_THEMES = {
  neon: "border-white/20 bg-black/40 text-white shadow-md backdrop-blur-md hover:bg-black/55",
  profile: "border-white/20 bg-black/40 text-white shadow-md backdrop-blur-md hover:bg-black/50",
  duo: "border-sky-200/90 bg-white/85 text-sky-800 shadow-sm backdrop-blur-sm hover:bg-white",
};

async function handleCreativeShare() {
  const url = window.location.href;
  const payload = { title: "בחירות 2026 WRAPPED", text: "הפרופיל הבחירותי שלי", url };
  try {
    if (navigator.share) {
      await navigator.share(payload);
      return;
    }
    await navigator.clipboard.writeText(url);
  } catch (err) {
    if (err?.name === "AbortError") return;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
  }
}

/** כפתור שיתוף — באותה עמודה כמו ✕ למעלה, ובאותה שורה כמו חצי הניווט */
function CreativeShareButton({ theme }) {
  return (
    <button
      type="button"
      onClick={() => void handleCreativeShare()}
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition active:scale-95 ${SHARE_BTN_THEMES[theme]}`}
      aria-label="שתף"
    >
      <Share2 className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
}

const CREATIVE_NAV_BTN =
  "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 bg-black/40 text-white shadow-md backdrop-blur-md transition hover:bg-black/50 disabled:cursor-not-allowed disabled:opacity-35 sm:h-10 sm:w-10";

/** שורת תחתית — חצים במרכז, שיתוף בעמודת היציאה (ימין ב־LTR) */
function CreativeBottomBar({ theme, index, total, goNext, goPrev, counterClassName }) {
  return (
    <div className="relative z-30 flex shrink-0 items-center justify-between gap-2.5 px-0.5 pb-0.5 pt-1" dir="ltr">
      <div className="h-8 w-8 shrink-0" aria-hidden />
      <div className="flex items-center justify-center gap-2">
        <button type="button" className={CREATIVE_NAV_BTN} disabled={index === total - 1} onClick={goNext} aria-label="שקופית הבאה">
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <span
          className={`min-w-[3.25rem] text-center text-[11px] font-semibold tabular-nums sm:text-xs ${counterClassName}`}
        >
          {index + 1} / {total}
        </span>
        <button type="button" className={CREATIVE_NAV_BTN} disabled={index === 0} onClick={goPrev} aria-label="שקופית קודמת">
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <CreativeShareButton theme={theme} />
    </div>
  );
}

function useSlidePager(total) {
  const [[index, direction], setSlide] = useState([0, 0]);
  const touchStartX = useRef(null);

  const goNext = () => {
    setSlide(([i]) => (i < total - 1 ? [i + 1, 1] : [i, 1]));
  };
  const goPrev = () => {
    setSlide(([i]) => (i > 0 ? [i - 1, -1] : [i, -1]));
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? start) - start;
    if (dx < -48) goNext();
    else if (dx > 48) goPrev();
  };

  return { index, direction, goNext, goPrev, onTouchStart, onTouchEnd };
}

/** סרגל עליון (אופציה א׳) — מקטעים לפי שקופית (LTR, כמו אופציה ב׳) */
function ValuesWrappedTopBar({ compact, index, total }) {
  const h = compact ? "h-[3px] sm:h-1" : "h-1 sm:h-[5px]";
  const gap = compact ? "gap-1" : "gap-1.5";

  return (
    <div className="relative z-20 flex shrink-0 items-center justify-between gap-2.5 px-0.5 pt-1" dir="ltr">
      <div className={`flex min-w-0 flex-1 justify-center ${gap}`} dir="rtl" aria-hidden>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              i <= index
                ? `${h} flex-1 rounded-full bg-gradient-to-r from-[#00ff99] to-[#ff00ff] shadow-[0_0_14px_rgba(0,255,153,0.35),0_0_18px_rgba(255,0,255,0.25)]`
                : `${h} flex-1 rounded-full bg-zinc-800/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-black/40`
            }
          />
        ))}
      </div>
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/50 text-[15px] font-light leading-none text-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm"
        aria-hidden
      >
        ✕
      </span>
    </div>
  );
}

/** טקסט נושאים בסגנון Spotify Wrapped — לאופציה ב׳ */
function WrappedSpotifyTopicArticle({ compact, slideIndex }) {
  if (slideIndex === 2) {
    return <PoliticalMapSlidePanel theme="profile" compact={compact} />;
  }

  const { headline, lines } = getSlideCopy(slideIndex);
  const articleClass = compact
    ? "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/88 px-3 py-5 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-[2px] sm:px-4 sm:py-6"
    : "relative overflow-hidden rounded-[1.35rem] border border-white/[0.09] bg-[#0a0a0a]/85 px-4 py-6 shadow-[0_16px_44px_rgba(0,0,0,0.48)] backdrop-blur-[2px] sm:px-5 sm:py-8";

  const stripClass =
    "pointer-events-none absolute bottom-10 right-1 top-14 w-[3px] rounded-full bg-gradient-to-b from-white/20 via-indigo-200/35 to-white/10 sm:right-2";

  const numClass = compact
    ? "shrink-0 text-3xl font-black tabular-nums leading-none tracking-[-0.06em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-[2rem]"
    : "shrink-0 text-4xl font-black tabular-nums leading-none tracking-[-0.06em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-[2.35rem]";

  return (
    <div className="pointer-events-none w-full max-w-[min(100%,26rem)] select-none sm:max-w-[28rem]">
      <article className={articleClass}>
        <div className={stripClass} aria-hidden />

        <p className="relative z-[1] flex justify-center pe-2 ps-3 sm:pe-3 sm:ps-4">
          <span
            className={
              compact
                ? "inline-block max-w-full rounded-[1px] bg-[#ececec] px-2 py-[0.35rem] text-center text-sm font-black leading-[1.12] tracking-[-0.055em] text-neutral-950 sm:px-2.5 sm:py-1.5 sm:text-base"
                : "inline-block max-w-full rounded-[2px] bg-[#ebebeb] px-2.5 py-1.5 text-center text-base font-black leading-[1.08] tracking-[-0.055em] text-neutral-950 sm:px-3 sm:py-2 sm:text-lg"
            }
          >
            {headline}
          </span>
        </p>

        <ul
          dir="rtl"
          className={
            compact
              ? "relative z-[1] mt-4 list-none space-y-3.5 ps-3 pe-2 sm:mt-5 sm:space-y-4 sm:ps-4 sm:pe-3"
              : "relative z-[1] mt-5 list-none space-y-4 ps-4 pe-3 sm:mt-6 sm:space-y-5 sm:ps-5 sm:pe-4"
          }
        >
          {lines.map((line, i) => (
            <li key={line} className="flex w-full justify-start">
              <div className="flex max-w-full items-baseline gap-2.5 sm:gap-3">
                <span className={numClass}>{i + 1}</span>
                <span
                  className={
                    compact
                      ? "max-w-[min(100%,16.5rem)] rounded-[1px] bg-[#ececec] px-1.5 py-[0.2rem] text-right text-xs font-black leading-snug tracking-[-0.05em] text-neutral-950 sm:max-w-[18.5rem] sm:px-2 sm:py-1 sm:text-sm sm:leading-normal"
                      : "max-w-[min(100%,19.5rem)] rounded-[2px] bg-[#ebebeb] px-2 py-1 text-right text-sm font-black leading-snug tracking-[-0.05em] text-neutral-950 sm:max-w-[21rem] sm:px-2.5 sm:py-1.5 sm:text-base sm:leading-normal"
                  }
                >
                  {line}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

/** סרגל ארבעת הברים — מילוי לבן על מסלול עדין (מעל פאנל כהה קבוע) */
function WrappedProgress({ index, total, compact }) {
  return (
    <div
      className={`relative z-20 flex shrink-0 ${compact ? "gap-1" : "gap-2"}`}
      dir="rtl"
      aria-hidden
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 overflow-hidden rounded-full bg-white/18 ${compact ? "h-0.5" : "h-1"}`}
        >
          <motion.div
            className="h-full rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
            initial={false}
            animate={{
              width: i <= index ? "100%" : "0%",
            }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      ))}
    </div>
  );
}

/** ניצוץ קטן (כוכב) בסגנון Year in Review */
function DuoSparkle({ className }) {
  return (
    <svg className={`pointer-events-none text-white/90 ${className}`} viewBox="0 0 14 14" fill="currentColor" aria-hidden>
      <path d="M7 0l1.1 4.9L14 7l-5.9 2.1L7 14l-1.1-4.9L0 7l5.9-2.1L7 0z" />
    </svg>
  );
}

/** סרגל “סטורי” — מספר חלונות + מיקום נוכחי (מקטעים + ✕), בסגנון לפי theme */
function StoryProgressBar({ theme, compact, index, total }) {
  const segmentCount = total ?? STORY_SEGMENTS;
  const isFilled = (i) => (index != null && total != null ? i <= index : i < STORY_FILLED);
  const stretchW = compact ? "min-w-[1.5rem] flex-1 sm:min-w-[1.75rem]" : "w-8 sm:w-10";

  const segmentClass = (filled) => {
    if (theme === "neon") {
      const w = "w-8 sm:w-10";
      return filled
        ? `h-1 rounded-full bg-gradient-to-l from-[#94fbab] to-[#ff2bd6] shadow-[0_0_14px_rgba(148,251,171,0.45)] ${w}`
        : `h-1 rounded-full border border-dashed border-white/25 bg-white/5 ${w}`;
    }
    if (theme === "duo") {
      return filled
        ? `h-1.5 rounded-full bg-[#49AEF9] shadow-[0_1px_6px_rgba(73,174,249,0.55)] ${stretchW}`
        : `h-1.5 rounded-full border border-dashed border-sky-300/75 bg-white/65 ${stretchW}`;
    }
    return filled
      ? `h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.35)] ${stretchW}`
      : `h-1.5 rounded-full border border-dashed border-white/40 bg-white/15 ${stretchW}`;
  };

  const closeClass =
    theme === "neon"
      ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/30 text-sm font-light text-white/80 shadow-inner"
      : theme === "duo"
        ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-200/90 bg-white/85 text-sm font-light text-sky-800 shadow-sm backdrop-blur-sm"
        : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/35 bg-black/45 text-sm font-light text-white shadow-md backdrop-blur-md";

  return (
    <div className="relative z-10 flex items-center justify-between gap-2 px-0.5 pt-0.5" dir="ltr">
      <div className="flex min-w-0 flex-1 justify-center gap-1.5" dir="rtl">
        {Array.from({ length: segmentCount }).map((_, i) => (
          <span key={i} className={segmentClass(isFilled(i))} aria-hidden />
        ))}
      </div>
      <span className={closeClass} aria-hidden>
        ✕
      </span>
    </div>
  );
}

function NeonBlob({ className }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full blur-3xl opacity-75 ${className}`}
      aria-hidden
    />
  );
}

/** נקודות זוהרות ירוק / ורוד (אופציה א׳) */
function ValuesNeonDot({ className, tone, soft = false }) {
  const size = soft ? "h-2 w-2 sm:h-2.5 sm:w-2.5" : "h-1.5 w-1.5";

  const glow =
    tone === "green"
      ? soft
        ? "bg-[radial-gradient(circle_at_35%_30%,rgba(167,243,208,0.75)_0%,rgba(52,211,153,0.5)_45%,rgba(20,83,45,0.35)_100%)] shadow-[0_0_6px_2px_rgba(110,231,183,0.2),0_0_14px_4px_rgba(16,185,129,0.08)] ring-1 ring-emerald-200/15"
        : "bg-[#39ff14] shadow-[0_0_10px_3px_rgba(57,255,20,0.55),0_0_22px_6px_rgba(57,255,20,0.15)]"
      : "bg-[#ff2bd6] shadow-[0_0_10px_3px_rgba(255,43,214,0.5),0_0_22px_6px_rgba(255,0,255,0.12)]";

  return <div className={`pointer-events-none absolute rounded-full ${size} ${glow} ${className}`} aria-hidden />;
}

/** מחלקות לשקופית אופציה א׳ — רפרנס כהה־ניאון */
function getValuesNeonSlideStyles(compact) {
  return {
    numClass: compact
      ? "shrink-0 bg-gradient-to-b from-pink-300 to-white bg-clip-text text-[1.65rem] font-black tabular-nums leading-none text-transparent sm:text-[2rem]"
      : "shrink-0 bg-gradient-to-b from-pink-300 to-white bg-clip-text text-[2rem] font-black tabular-nums leading-none text-transparent sm:text-[2.4rem]",
    pillClass: compact
      ? "flex w-full items-center gap-3 rounded-full border border-white/12 bg-black/50 px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md sm:px-4 sm:py-3"
      : "flex w-full items-center gap-3.5 rounded-full border border-white/14 bg-black/45 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-md sm:px-5 sm:py-3.5",
  };
}

/** תוכן שקופית אופציה א׳ — סקירת ערכים (רפרנס) */
function ValuesNeonSlidePanel({ compact, numClass, pillClass, slideIndex }) {
  if (slideIndex === 2) {
    return <PoliticalMapSlidePanel theme="neon" compact={compact} />;
  }

  const { headline, lines } = getSlideCopy(slideIndex);

  return (
    <div className="pointer-events-none flex w-full flex-col items-center justify-center gap-1.5 px-2 sm:gap-2">
      <h2
        className={
          compact
            ? "max-w-[19.5rem] text-balance text-center text-[0.95rem] font-black leading-[1.22] tracking-[-0.018em] text-white sm:text-[1.05rem]"
            : "max-w-[21rem] text-balance text-center text-[1.05rem] font-black leading-[1.2] tracking-[-0.018em] text-white sm:text-[1.2rem]"
        }
      >
        {headline}
      </h2>

      <ul className="mt-2 w-full max-w-[18.5rem] space-y-2 sm:mt-2.5 sm:max-w-[20.5rem] sm:space-y-2.5">
        {lines.map((line, idx) => (
          <li key={line} className="flex justify-center">
            <div className={pillClass}>
              <span className={numClass}>{idx + 1}</span>
              <p className="min-w-0 flex-1 text-right text-[0.8125rem] font-bold leading-snug tracking-[-0.01em] text-white sm:text-[0.9375rem]">
                {line}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** מחלקות לכותרת + רשימת נושאים (אופציות א׳ ו־ג׳) */
function getWrappedTopicSlideStyles(compact) {
  return {
    numClass: compact
      ? "shrink-0 bg-gradient-to-b from-blue-700 via-blue-600 to-slate-400 bg-clip-text text-[1.65rem] font-black tabular-nums leading-none text-transparent sm:text-[2rem]"
      : "shrink-0 bg-gradient-to-b from-blue-800 via-blue-600 to-sky-400 bg-clip-text text-[2rem] font-black tabular-nums leading-none text-transparent sm:text-[2.4rem]",
    pillClass: compact
      ? "flex w-full items-center gap-3 rounded-full border border-slate-200/70 bg-white/45 px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-md sm:px-4 sm:py-3"
      : "flex w-full items-center gap-3.5 rounded-full border border-slate-200/80 bg-white/50 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md sm:px-5 sm:py-3.5",
  };
}

/** תוכן שקופית בודדת — כותרת, תת־כותרת ורשימה (אופציות א׳ ו־ג׳) */
function ValuesSlidePanel({ compact, numClass, pillClass, slideIndex }) {
  if (slideIndex === 2) {
    return <PoliticalMapSlidePanel theme="light" compact={compact} />;
  }

  const { headline, lines } = getSlideCopy(slideIndex);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-1.5 px-2 sm:gap-2">
      <h2
        className={
          compact
            ? "max-w-[19.5rem] text-balance text-center text-[0.95rem] font-black leading-[1.22] tracking-[-0.018em] text-slate-900 sm:text-[1.05rem]"
            : "max-w-[21rem] text-balance text-center text-[1.05rem] font-black leading-[1.2] tracking-[-0.018em] text-slate-900 sm:text-[1.2rem]"
        }
      >
        {headline}
      </h2>

      <ul className="mt-2 w-full max-w-[18.5rem] space-y-2 sm:mt-2.5 sm:max-w-[20.5rem] sm:space-y-2.5">
        {lines.map((line, idx) => (
          <li key={line} className="flex justify-center">
            <div className={pillClass}>
              <span className={numClass}>{idx + 1}</span>
              <p className="min-w-0 flex-1 text-right text-[0.8125rem] font-bold leading-snug tracking-[-0.01em] text-slate-900 sm:text-[0.9375rem]">
                {line}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** כרטיס א׳ — רפרנס כהה־ניאון + דפדוף 1–4 */
function ValuesCreative({ compact }) {
  const total = VALUES_SLIDE_COUNT;
  const { index, direction, goNext, goPrev, onTouchStart, onTouchEnd } = useSlidePager(total);
  const grainOpacity = compact ? 0.52 : 0.58;

  const { numClass, pillClass } = getValuesNeonSlideStyles(compact);

  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.35rem] bg-[#0a0318] p-3 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.07)] sm:p-4"
      dir="rtl"
      aria-label={`קריאייטיב א׳ — שקופית ${index + 1} מתוך ${total}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#1f0a2e_0%,#0d0514_42%,#020005_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#2a1038]/55 via-transparent to-black/80"
        aria-hidden
      />
      <div className="grain-overlay absolute inset-0" style={{ opacity: grainOpacity }} aria-hidden />

      <div
        className="pointer-events-none absolute -right-[18%] top-[18%] h-[min(78%,26rem)] w-[min(72%,14rem)] rounded-full bg-gradient-to-bl from-[#00ff99]/25 via-[#7c3aed]/22 to-[#ff00ff]/12 blur-3xl"
        aria-hidden
      />
      <NeonBlob className="-left-24 top-0 h-48 w-48 bg-[#6d28d9]/25 blur-[48px]" />

      <ValuesNeonDot className="left-[12%] top-[13%]" tone="green" soft />
      <ValuesNeonDot className="right-[8%] top-[32%]" tone="pink" />
      <ValuesNeonDot className="left-[22%] bottom-[26%]" tone="pink" />
      <ValuesNeonDot className="right-[20%] top-[48%] h-1 w-1" tone="green" />

      <div
        className="pointer-events-none absolute bottom-5 left-5 h-9 w-9 rotate-[-8deg] rounded-xl bg-gradient-to-br from-[#00ff99] to-[#ff00ff] opacity-95 shadow-[0_12px_40px_rgba(255,0,255,0.28),0_0_24px_rgba(0,255,153,0.2)]"
        aria-hidden
      />

      <ValuesWrappedTopBar compact={compact} index={index} total={total} />

      <div className="relative z-[15] flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden py-1 sm:py-2">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={rtlSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={rtlSlideTransition}
            className="flex w-full flex-col items-center justify-center"
          >
            <ValuesNeonSlidePanel compact={compact} numClass={numClass} pillClass={pillClass} slideIndex={index} />
          </motion.div>
        </AnimatePresence>
      </div>

      <CreativeBottomBar
        theme="neon"
        index={index}
        total={total}
        goNext={goNext}
        goPrev={goPrev}
        counterClassName="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
      />
    </div>
  );
}

/** כרטיס ב׳ — ארבעה רקעים + סרגל ברים + ניווט */
function ProfileCreative({ compact }) {
  const total = OPTION_B_BACKGROUNDS.length;
  const { index, direction, goNext, goPrev, onTouchStart, onTouchEnd } = useSlidePager(total);

  const src = OPTION_B_BACKGROUNDS[index].src;

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden rounded-[1.35rem] bg-[#141414] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] sm:gap-2.5 sm:p-4"
      dir="rtl"
      aria-label="קריאייטיב ב׳ — ארבעה רקעים עם דפדוף"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.35rem] bg-[#141414]">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={rtlSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            aria-hidden
            className="absolute inset-0 transform-gpu bg-[length:auto] bg-[position:center] bg-no-repeat"
            style={{
              backgroundColor: "#141414",
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
            }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
      </div>

      <div className="relative z-20">
        <WrappedProgress index={index} total={total} compact={compact} />
      </div>

      <div className="relative z-[15] flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-2 py-1 sm:px-4 sm:py-2">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={rtlSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={rtlSlideTransition}
            className="flex w-full flex-col items-center justify-center"
          >
            <WrappedSpotifyTopicArticle compact={compact} slideIndex={index} />
          </motion.div>
        </AnimatePresence>
      </div>

      <CreativeBottomBar
        theme="profile"
        index={index}
        total={total}
        goNext={goNext}
        goPrev={goPrev}
        counterClassName="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
      />
    </div>
  );
}

/** כרטיס ג׳ — רקע Year in Review + דפדוף 1–4 (כמו א׳/ב׳) */
function MapCreative({ compact }) {
  const total = MAP_SLIDE_COUNT;
  const { index, direction, goNext, goPrev, onTouchStart, onTouchEnd } = useSlidePager(total);

  const { numClass, pillClass } = getWrappedTopicSlideStyles(compact);

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden rounded-[1.35rem] p-3 shadow-[0_0_0_1px_rgba(125,211,252,0.35)] sm:gap-2.5 sm:p-4"
      dir="rtl"
      aria-label={`קריאייטיב ג׳ — שקופית ${index + 1} מתוך ${total}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.35rem]"
        style={{
          background: "linear-gradient(180deg, #c4e5ff 0%, #d9efff 32%, #ecf6ff 68%, #f7fcff 100%)",
        }}
        aria-hidden
      >
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={rtlSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-sky-100/30"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -left-20 top-6 h-44 w-56 rounded-full bg-white/50 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-24 top-16 h-52 w-60 rounded-full bg-white/40 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-28 left-[18%] h-48 w-[70%] max-w-md rounded-full bg-white/35 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute right-[8%] top-[42%] h-32 w-40 rounded-full bg-sky-100/50 blur-2xl"
              aria-hidden
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <DuoSparkle className="absolute left-[10%] top-[20%] z-[5] h-2.5 w-2.5 opacity-95 sm:h-3 sm:w-3" />
      <DuoSparkle className="absolute right-[14%] top-[26%] z-[5] h-2 w-2 opacity-80 sm:right-[12%]" />
      <DuoSparkle className="absolute left-[18%] top-[55%] z-[5] h-2 w-2 opacity-75" />
      <DuoSparkle className="absolute right-[22%] top-[48%] z-[5] h-2.5 w-2.5 opacity-90" />
      <DuoSparkle className="absolute left-[28%] bottom-[30%] z-[5] h-2 w-2 opacity-70 sm:bottom-[28%]" />
      <DuoSparkle className="absolute right-[30%] bottom-[22%] z-[5] h-2.5 w-2.5 opacity-85" />

      <div className="relative z-20">
        <StoryProgressBar theme="duo" compact={compact} index={index} total={total} />
      </div>

      <div className="relative z-[15] pointer-events-none flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden py-1 sm:py-2">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={rtlSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={rtlSlideTransition}
            className="flex w-full flex-col items-center justify-center"
          >
            <ValuesSlidePanel compact={compact} numClass={numClass} pillClass={pillClass} slideIndex={index} />
          </motion.div>
        </AnimatePresence>
      </div>

      <CreativeBottomBar
        theme="duo"
        index={index}
        total={total}
        goNext={goNext}
        goPrev={goPrev}
        counterClassName="text-slate-800"
      />
    </div>
  );
}

/**
 * רכיב הוויזואל של כרטיסי הפוסט (תוכן סטטי לתצוגה ובחירת העדפה).
 * @param {"values"|"profile"|"map"} variant
 */
export function PostCreative({ variant, compact = true }) {
  switch (variant) {
    case "values":
      return <ValuesCreative compact={compact} />;
    case "profile":
      return <ProfileCreative compact={compact} />;
    case "map":
      return <MapCreative compact={compact} />;
    default:
      return null;
  }
}
