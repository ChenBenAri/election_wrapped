import { useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Share2 } from "lucide-react";

const STORY_SEGMENTS = 4;
const STORY_FILLED = 2;

/** ארבעת רקעי אופציה ב׳ (קבצים ב־public) */
const OPTION_B_BACKGROUNDS = [
  { id: "b-periwinkle", src: "/option-b-bg-1.png" },
  { id: "b-mustard", src: "/option-b-bg-2.png" },
  { id: "b-lime", src: "/option-b-bg-3.png" },
  { id: "b-red", src: "/option-b-bg-4.png" },
];

/** שקופית 1 — כותרת עליונה + 3 נושאים */
const FIRST_SLIDE_IDENTITY_LINE = "תעודת הזהות הפוליטית שלי";
const FIRST_SLIDE_IDENTITY_PARTS = {
  title: "תעודת הזהות",
  subtitle: "הפוליטית שלי",
};
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

const FIRST_SLIDE_IDENTITY_THEMES = {
  neon: {
    frame:
      "rounded-2xl border border-[#94fbab]/30 bg-black/35 px-4 py-2.5 shadow-[0_0_28px_rgba(148,251,171,0.18),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm sm:px-5 sm:py-3",
    title:
      "bg-gradient-to-l from-[#94fbab] via-[#6ee7b7] to-[#5eead4] bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(148,251,171,0.45)]",
    subtitle: "text-[#c8ffe0]/90",
    divider: "bg-gradient-to-r from-transparent via-[#94fbab]/55 to-transparent",
    dot: "bg-[#94fbab]/70 shadow-[0_0_8px_rgba(148,251,171,0.6)]",
  },
  profile: {
    frame:
      "rounded-[1.35rem] border border-white/25 bg-white/12 px-4 py-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-md sm:px-5 sm:py-3",
    title: "text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]",
    subtitle: "text-[#8fd4ff]",
    divider: "bg-gradient-to-r from-transparent via-white/45 to-transparent",
    dot: "bg-white/75 shadow-[0_0_6px_rgba(255,255,255,0.45)]",
  },
  light: {
    frame:
      "rounded-2xl border border-[#1877f2]/18 bg-white/92 px-4 py-2.5 shadow-[0_10px_28px_rgba(24,119,242,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] sm:px-5 sm:py-3",
    title: "text-[#1877f2]",
    subtitle: "text-slate-500",
    divider: "bg-gradient-to-r from-transparent via-[#1877f2]/35 to-transparent",
    dot: "bg-[#1877f2]/55",
  },
};

function FirstSlideIdentityLine({ theme, compact }) {
  const styles = FIRST_SLIDE_IDENTITY_THEMES[theme];
  if (!styles) return null;

  const titleSize = compact
    ? "text-[1.3125rem] leading-none sm:text-[1.5rem]"
    : "text-[1.4375rem] leading-none sm:text-[1.625rem]";
  const subtitleSize = compact
    ? "text-[0.6875rem] leading-none tracking-[0.14em] sm:text-[0.75rem]"
    : "text-[0.75rem] leading-none tracking-[0.16em] sm:text-[0.8125rem]";

  return (
    <div className="relative z-20 flex w-full shrink-0 justify-center px-2 pb-0.5 pt-12 sm:px-3 sm:pb-1 sm:pt-14">
      <div
        className={`flex max-w-[min(100%,22rem)] flex-col items-center gap-1.5 sm:gap-2 ${styles.frame}`}
        aria-label={FIRST_SLIDE_IDENTITY_LINE}
      >
        <div className="flex w-full items-center justify-center gap-2 sm:gap-2.5">
          <span className={`h-px w-6 shrink-0 sm:w-8 ${styles.divider}`} aria-hidden />
          <span className={`font-black tracking-[-0.022em] ${titleSize} ${styles.title}`}>
            {FIRST_SLIDE_IDENTITY_PARTS.title}
          </span>
          <span className={`h-px w-6 shrink-0 sm:w-8 ${styles.divider}`} aria-hidden />
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`h-1 w-1 shrink-0 rounded-full ${styles.dot}`} aria-hidden />
          <span className={`font-bold uppercase ${subtitleSize} ${styles.subtitle}`}>
            {FIRST_SLIDE_IDENTITY_PARTS.subtitle}
          </span>
          <span className={`h-1 w-1 shrink-0 rounded-full ${styles.dot}`} aria-hidden />
        </div>
      </div>
    </div>
  );
}

function getTopicsHeadlineClass(theme, compact) {
  const layout = compact
    ? "w-full px-0.5 text-center font-black leading-none tracking-[-0.035em] whitespace-nowrap"
    : "max-w-none text-center font-black leading-[1.12] tracking-[-0.026em] whitespace-nowrap";
  const size = compact ? "text-[1.125rem] sm:text-[1.3rem]" : "text-[1.5rem] sm:text-[1.75rem]";

  const emphasis = {
    neon: "text-white drop-shadow-[0_0_20px_rgba(148,251,171,0.45)]",
    profile: "text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]",
    light: "text-[#0f4c9a] drop-shadow-[0_1px_0_rgba(255,255,255,0.85)]",
  };

  return `${layout} ${size} ${emphasis[theme]} -mt-1`;
}

function getListLineClass(compact, theme, enlarged = false) {
  const color = theme === "profile" ? "text-white/95" : theme === "neon" ? "text-white" : "text-slate-900";
  const weight = theme === "profile" ? "font-black" : "font-bold";
  const flex = theme === "profile" ? "" : "min-w-0 flex-1";
  const size = enlarged
    ? compact
      ? "text-[1.125rem] sm:text-[1.3125rem]"
      : "text-[1.25rem] sm:text-[1.4375rem]"
    : compact
      ? "text-[0.8125rem] sm:text-[0.9375rem]"
      : "text-sm sm:text-base";

  return `${flex} text-right leading-none tracking-[-0.04em] whitespace-nowrap ${size} ${weight} ${color}`;
}

function getContentSlideHeadlineClass(theme, compact) {
  const layout = "text-balance text-center font-black leading-[1.1] tracking-[-0.022em]";
  const size = compact ? "text-[1.3125rem] sm:text-[1.5rem]" : "text-[1.5rem] sm:text-[1.8125rem]";
  const maxW = compact ? "max-w-[20rem]" : "max-w-[22rem]";

  const emphasis = {
    neon: "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]",
    profile: "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]",
    light: "text-slate-900",
  };

  return `${maxW} ${layout} ${size} ${emphasis[theme]}`;
}

function getSlideNumClass(theme, compact, enlarged = false) {
  if (theme === "profile") {
    return enlarged
      ? compact
        ? "shrink-0 text-[2.75rem] font-black tabular-nums leading-none tracking-[-0.06em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-[3.125rem]"
        : "shrink-0 text-[3.125rem] font-black tabular-nums leading-none tracking-[-0.06em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] sm:text-[3.5rem]"
      : compact
        ? "shrink-0 text-[2.125rem] font-black tabular-nums leading-none tracking-[-0.06em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-[2.375rem]"
        : "shrink-0 text-[2.5rem] font-black tabular-nums leading-none tracking-[-0.06em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-[2.75rem]";
  }

  const gradient =
    theme === "neon"
      ? "bg-gradient-to-b from-pink-300 to-white bg-clip-text text-transparent"
      : "bg-gradient-to-b from-blue-700 via-blue-600 to-slate-400 bg-clip-text text-transparent sm:from-blue-800 sm:via-blue-600 sm:to-sky-400";

  return enlarged
    ? compact
      ? `shrink-0 ${gradient} text-[2.5rem] font-black tabular-nums leading-none sm:text-[3rem]`
      : `shrink-0 ${gradient} text-[3rem] font-black tabular-nums leading-none sm:text-[3.5rem]`
    : compact
      ? `shrink-0 ${gradient} text-[1.9rem] font-black tabular-nums leading-none sm:text-[2.3rem]`
      : `shrink-0 ${gradient} text-[2.3rem] font-black tabular-nums leading-none sm:text-[2.75rem]`;
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
      <div className={`relative w-full ${compact ? "h-11" : "h-12"}`} dir="ltr">
        <span
          className={`pointer-events-none absolute bottom-[calc(50%+12px)] -translate-x-1/2 whitespace-nowrap text-[0.9375rem] font-black leading-none sm:text-[1.0625rem] ${t.label}`}
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
  const headlineClass = getContentSlideHeadlineClass(theme === "spotify" ? "profile" : theme, compact);

  const inner = (
    <div className="pointer-events-none flex w-full flex-col items-center justify-center gap-2.5 px-2 sm:gap-3">
      <h2 className={headlineClass}>{POLITICAL_MAP_HEADLINE}</h2>
      <ul className={`mt-1 w-full space-y-3.5 sm:mt-1.5 sm:space-y-4 ${compact ? "max-w-[19rem]" : "max-w-[21rem]"}`}>
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

const SHARE_BTN_POSITION = "absolute bottom-1 left-1 z-40 sm:bottom-1.5 sm:left-1.5";

const BRAND_MARK_STYLES = {
  neon: {
    wrap: "rounded-2xl ring-1 ring-white/15 shadow-[0_4px_24px_rgba(255,43,214,0.14)] backdrop-blur-md",
    wrapBg:
      "bg-gradient-to-br from-[#3d1a5c]/90 via-[#0a0318]/92 to-[#1a3d2e]/88",
    wrapAccentA: "left-0 top-0 h-full w-[55%] bg-gradient-to-r from-[#94fbab]/18 to-transparent",
    wrapAccentB: "bottom-0 right-0 h-8 w-8 rounded-full bg-[#ff2bd6]/25 blur-lg",
    monogramOuter: "rounded-full bg-gradient-to-br from-[#94fbab] to-[#ff2bd6] p-px",
    monogramInner: "grid h-7 w-7 place-items-center rounded-full bg-[#0a0318] sm:h-8 sm:w-8",
    year: "text-[0.6875rem] font-black tabular-nums leading-none text-white sm:text-xs",
    hebrew: "text-[0.6875rem] font-bold leading-none tracking-tight text-white sm:text-xs",
    chip: "rounded-full bg-white/10 px-1.5 py-0.5 text-[0.4375rem] font-bold uppercase tracking-[0.24em] text-[#94fbab] sm:text-[0.5rem]",
  },
  profile: {
    wrap: "rounded-2xl ring-1 ring-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md",
    wrapBg: "bg-gradient-to-br from-black/85 via-zinc-900/75 to-black/88",
    wrapAccentA: "inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_55%)]",
    wrapAccentB: "bottom-0 right-0 h-10 w-10 bg-gradient-to-tl from-white/10 to-transparent",
    monogramOuter: "",
    monogramInner:
      "grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-white/10 sm:h-8 sm:w-8",
    year: "text-[0.6875rem] font-black tabular-nums leading-none text-white drop-shadow-md sm:text-xs",
    hebrew:
      "text-[0.6875rem] font-bold leading-none tracking-tight text-white drop-shadow-md sm:text-xs",
    chip: "rounded-full bg-white/20 px-1.5 py-0.5 text-[0.4375rem] font-bold uppercase tracking-[0.24em] text-white sm:text-[0.5rem]",
  },
  duo: {
    wrap: "rounded-2xl ring-1 ring-sky-200/90 shadow-[0_4px_16px_rgba(73,174,249,0.15)] backdrop-blur-sm",
    wrapBg: "bg-gradient-to-br from-white/95 via-sky-50/90 to-[#dbeafe]/85",
    wrapAccentA: "left-0 top-0 h-full w-[50%] bg-gradient-to-r from-[#49AEF9]/12 to-transparent",
    wrapAccentB: "right-1 top-1 h-6 w-10 rounded-full bg-white/70 blur-sm",
    monogramOuter: "",
    monogramInner:
      "grid h-7 w-7 place-items-center rounded-full border-2 border-[#49AEF9] bg-white sm:h-8 sm:w-8",
    year: "text-[0.6875rem] font-black tabular-nums leading-none text-slate-800 sm:text-xs",
    hebrew: "text-[0.6875rem] font-bold leading-none tracking-tight text-slate-800 sm:text-xs",
    chip: "rounded-full bg-[#49AEF9]/15 px-1.5 py-0.5 text-[0.4375rem] font-bold uppercase tracking-[0.24em] text-[#1877f2] sm:text-[0.5rem]",
  },
};

/** לוגו — monogram עגול + wordmark מודרני */
function CreativeBrandMark({ theme }) {
  const s = BRAND_MARK_STYLES[theme];

  const monogram = s.monogramOuter ? (
    <span className={s.monogramOuter}>
      <span className={s.monogramInner}>
        <span className={s.year}>26</span>
      </span>
    </span>
  ) : (
    <span className={s.monogramInner}>
      <span className={s.year}>26</span>
    </span>
  );

  return (
    <div
      className={`pointer-events-none relative inline-flex shrink-0 overflow-hidden ${s.wrap}`}
      dir="ltr"
      aria-hidden
    >
      <span className={`absolute inset-0 ${s.wrapBg}`} />
      <span className={`absolute ${s.wrapAccentA}`} />
      <span className={`absolute ${s.wrapAccentB}`} />
      <span className="relative z-[1] inline-flex items-center gap-2 px-2 py-1.5">
        {monogram}
        <span className="flex flex-col items-center gap-0.5 leading-none">
          <span className={`text-center ${s.hebrew}`}>בחירות</span>
          <span className={s.chip}>wrapped</span>
        </span>
      </span>
    </div>
  );
}

/** שורת עליונה — לוגו בשמאל, ברים לידו */
function CreativeTopHeader({ theme, children }) {
  return (
    <div className="relative z-20 flex shrink-0 items-center gap-2 px-0.5 pt-1" dir="ltr">
      <CreativeBrandMark theme={theme} />
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
    </div>
  );
}

/** כפתור שיתוף */
function CreativeShareButton({ theme, className = "" }) {
  return (
    <button
      type="button"
      onClick={() => void handleCreativeShare()}
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition active:scale-95 ${SHARE_BTN_THEMES[theme]} ${className}`}
      aria-label="שתף"
    >
      <Share2 className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
}

const AI_DISCLAIMER = "התאמה זו בוצעה באמצעות AI";
const USER_DISCLAIMER = "אני משתמש מספר 8 שלוקח אחריות על הבחירות";

const FOOTER_DISCLAIMER_THEMES = {
  neon: { text: "text-white/55", wrap: "" },
  profile: {
    text: "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]",
    wrap: "",
  },
  duo: { text: "text-slate-600/85", wrap: "" },
};

/** שורת תחתית — הצהרות במרכז (כפתור שיתוף ממוקם בנפרד בפינה) */
function CreativeBottomFooter({ theme }) {
  const { text, wrap } = FOOTER_DISCLAIMER_THEMES[theme];
  const textClass = `pointer-events-none text-center text-sm font-semibold leading-snug sm:text-base ${text}`;

  return (
    <div className="relative z-30 mb-2 w-full shrink-0 px-2 pb-0.5 pt-0.5 sm:mb-2.5">
      <div className={`space-y-0.5 ${wrap} ${textClass}`}>
        <p>{AI_DISCLAIMER}</p>
        <p>{USER_DISCLAIMER}</p>
      </div>
    </div>
  );
}

/** אזורי לחיצה בצדי המסך — שמאל: הבא, ימין: קודם (סטורי RTL) */
function StoryTapZones({ onTouchStart, onTouchEnd, onPagerClick }) {
  return (
    <div
      data-story-pager
      className="absolute inset-0 z-[25] touch-manipulation"
      dir="ltr"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={onPagerClick}
      aria-hidden
    />
  );
}

function useSlidePager(total) {
  const [[index, direction], setSlide] = useState([0, 0]);
  const touchStart = useRef(null);
  const suppressClick = useRef(false);

  const goNext = useCallback(() => {
    setSlide(([i]) => (i < total - 1 ? [i + 1, 1] : [i, 1]));
  }, [total]);

  const goPrev = useCallback(() => {
    setSlide(([i]) => (i > 0 ? [i - 1, -1] : [i, -1]));
  }, []);

  const navigateFromX = useCallback(
    (clientX, element) => {
      const el = element.closest("[data-story-pager]") ?? element;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0) return;
      const ratio = (clientX - rect.left) / rect.width;
      if (ratio < 0.5) goNext();
      else goPrev();
    },
    [goNext, goPrev],
  );

  const onTouchStart = (e) => {
    const t = e.changedTouches[0];
    if (!t) return;
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
      suppressClick.current = true;
      if (dx < 0) goNext();
      else goPrev();
      return;
    }
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      suppressClick.current = true;
      navigateFromX(t.clientX, e.currentTarget);
    }
  };

  const onPagerClick = (e) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    navigateFromX(e.clientX, e.currentTarget);
  };

  return { index, direction, goNext, goPrev, onTouchStart, onTouchEnd, onPagerClick };
}

/** סרגל עליון (אופציה א׳) — מקטעים לפי שקופית (LTR, כמו אופציה ב׳) */
function ValuesWrappedTopBar({ compact, index, total }) {
  const h = compact ? "h-[3px] sm:h-1" : "h-1 sm:h-[5px]";
  const gap = compact ? "gap-1" : "gap-1.5";

  return (
    <div className="flex min-w-0 flex-1" dir="ltr">
      <div className={`flex min-w-0 flex-1 ${gap}`} dir="rtl" aria-hidden>
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
    ? "relative px-3 py-5 sm:px-4 sm:py-6"
    : "relative px-4 py-6 sm:px-5 sm:py-8";

  const isTopicsSlide = slideIndex === 0;
  const numClass = getSlideNumClass("profile", compact, !isTopicsSlide);

  return (
    <div className="pointer-events-none mx-auto w-full max-w-[min(100%,26rem)] select-none sm:max-w-[28rem]">
      <article className={`${articleClass} ${isTopicsSlide ? "flex w-full flex-col items-center" : ""}`}>
        <p
          className={
            isTopicsSlide
              ? "relative z-[1] flex w-full justify-end px-2 pe-4 sm:px-3 sm:pe-5"
              : "relative z-[1] flex justify-center pe-2 ps-3 sm:pe-3 sm:ps-4"
          }
        >
          <span
            className={
              isTopicsSlide
                ? `${getTopicsHeadlineClass("profile", compact).replace("text-center", "text-right")} block max-w-full`
                : getContentSlideHeadlineClass("profile", compact)
            }
          >
            {headline}
          </span>
        </p>

        <ul
          dir="rtl"
          className={
            compact
              ? `relative z-[1] mt-4 list-none space-y-3.5 sm:mt-5 sm:space-y-4 ${
                  isTopicsSlide
                    ? "translate-x-[-0.375rem] ps-2 pe-4 sm:translate-x-[-0.5rem] sm:ps-3 sm:pe-5"
                    : "ps-3 pe-2 sm:ps-4 sm:pe-3"
                }`
              : `relative z-[1] mt-5 list-none space-y-4 sm:mt-6 sm:space-y-5 ${
                  isTopicsSlide
                    ? "translate-x-[-0.375rem] ps-3 pe-5 sm:translate-x-[-0.5rem] sm:ps-4 sm:pe-6"
                    : "ps-4 pe-3 sm:ps-5 sm:pe-4"
                }`
          }
        >
          {lines.map((line, i) => (
            <li key={line} className="flex w-full justify-start">
              <div className="flex min-w-0 max-w-full items-baseline gap-2.5 sm:gap-3">
                <span className={numClass}>{i + 1}</span>
                <span className={getListLineClass(compact, "profile", !isTopicsSlide)}>{line}</span>
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
      className={`relative z-20 flex min-w-0 flex-1 ${compact ? "gap-1" : "gap-2"}`}
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

/** סרגל “סטורי” — מקטעי התקדמות (אופציה 2 — מפה) */
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
        : `h-1.5 rounded-full bg-sky-200/55 ${stretchW}`;
    }
    return filled
      ? `h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.35)] ${stretchW}`
      : `h-1.5 rounded-full border border-dashed border-white/40 bg-white/15 ${stretchW}`;
  };

  return (
    <div className="flex min-w-0 flex-1 gap-1.5" dir="rtl">
      {Array.from({ length: segmentCount }).map((_, i) => (
        <span key={i} className={segmentClass(isFilled(i))} aria-hidden />
      ))}
    </div>
  );
}

/** מחלקות לשקופית אופציה א׳ — רפרנס כהה־ניאון */
function getValuesNeonSlideStyles(compact) {
  return {
    pillClass: compact
      ? "flex w-full min-w-0 items-center gap-3 px-1 py-1 sm:px-1.5 sm:py-1.5"
      : "flex w-full min-w-0 items-center gap-3.5 px-1.5 py-1.5 sm:px-2 sm:py-2",
  };
}

/** תוכן שקופית אופציה א׳ — סקירת ערכים (רפרנס) */
function ValuesNeonSlidePanel({ compact, pillClass, slideIndex }) {
  if (slideIndex === 2) {
    return <PoliticalMapSlidePanel theme="neon" compact={compact} />;
  }

  const { headline, lines } = getSlideCopy(slideIndex);
  const isTopicsSlide = slideIndex === 0;
  const numClass = getSlideNumClass("neon", compact, !isTopicsSlide);

  return (
    <div className="pointer-events-none flex w-full flex-col items-center justify-center gap-1.5 px-2 sm:gap-2">
      <h2
        className={
          isTopicsSlide ? getTopicsHeadlineClass("neon", compact) : getContentSlideHeadlineClass("neon", compact)
        }
      >
        {headline}
      </h2>

      <ul
        className={`w-full space-y-2 sm:space-y-2.5 ${
          isTopicsSlide
            ? "mt-2 max-w-[18.5rem] sm:mt-2.5 sm:max-w-[20.5rem]"
            : "mt-3 max-w-[20rem] sm:mt-3.5 sm:max-w-[22rem]"
        }`}
      >
        {lines.map((line, idx) => (
          <li key={line} className="flex justify-center">
            <div className={pillClass}>
              <span className={numClass}>{idx + 1}</span>
              <p className={getListLineClass(compact, "neon", !isTopicsSlide)}>{line}</p>
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
    pillClass: compact
      ? "flex w-full min-w-0 items-center gap-3 px-1 py-1 sm:px-1.5 sm:py-1.5"
      : "flex w-full min-w-0 items-center gap-3.5 px-1.5 py-1.5 sm:px-2 sm:py-2",
  };
}

/** תוכן שקופית בודדת — כותרת, תת־כותרת ורשימה (אופציות א׳ ו־ג׳) */
function ValuesSlidePanel({ compact, pillClass, slideIndex }) {
  if (slideIndex === 2) {
    return <PoliticalMapSlidePanel theme="light" compact={compact} />;
  }

  const { headline, lines } = getSlideCopy(slideIndex);
  const isTopicsSlide = slideIndex === 0;
  const numClass = getSlideNumClass("light", compact, !isTopicsSlide);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-1.5 px-2 sm:gap-2">
      <h2
        className={
          isTopicsSlide ? getTopicsHeadlineClass("light", compact) : getContentSlideHeadlineClass("light", compact)
        }
      >
        {headline}
      </h2>

      <ul
        className={`w-full space-y-2 sm:space-y-2.5 ${
          isTopicsSlide
            ? "mt-2 max-w-[18.5rem] sm:mt-2.5 sm:max-w-[20.5rem]"
            : "mt-3 max-w-[20rem] sm:mt-3.5 sm:max-w-[22rem]"
        }`}
      >
        {lines.map((line, idx) => (
          <li key={line} className="flex justify-center">
            <div className={pillClass}>
              <span className={numClass}>{idx + 1}</span>
              <p className={getListLineClass(compact, "light", !isTopicsSlide)}>{line}</p>
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
  const { index, direction, onTouchStart, onTouchEnd, onPagerClick } = useSlidePager(total);
  const grainOpacity = compact ? 0.52 : 0.58;

  const { pillClass } = getValuesNeonSlideStyles(compact);

  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.35rem] bg-[#0a0318] p-3 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.07)] sm:p-4"
      dir="rtl"
      aria-label={`קריאייטיב א׳ — שקופית ${index + 1} מתוך ${total}`}
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

      <CreativeTopHeader theme="neon">
        <ValuesWrappedTopBar compact={compact} index={index} total={total} />
      </CreativeTopHeader>

      {index === 0 && (
        <FirstSlideIdentityLine theme="neon" compact={compact} />
      )}

      <div className="relative z-[15] flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden py-1 sm:py-2">
        <StoryTapZones onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onPagerClick={onPagerClick} />
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={rtlSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={rtlSlideTransition}
            className="pointer-events-none flex w-full flex-col items-center justify-center"
          >
            <ValuesNeonSlidePanel compact={compact} pillClass={pillClass} slideIndex={index} />
          </motion.div>
        </AnimatePresence>
      </div>

      <CreativeShareButton theme="neon" className={SHARE_BTN_POSITION} />
      <CreativeBottomFooter theme="neon" />
    </div>
  );
}

/** כרטיס ב׳ — ארבעה רקעים + סרגל ברים + ניווט */
function ProfileCreative({ compact }) {
  const total = OPTION_B_BACKGROUNDS.length;
  const { index, direction, onTouchStart, onTouchEnd, onPagerClick } = useSlidePager(total);

  const src = OPTION_B_BACKGROUNDS[index].src;

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden rounded-[1.35rem] bg-[#141414] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] sm:gap-2.5 sm:p-4"
      dir="rtl"
      aria-label="קריאייטיב ב׳ — ארבעה רקעים עם דפדוף"
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

      <CreativeTopHeader theme="profile">
        <WrappedProgress index={index} total={total} compact={compact} />
      </CreativeTopHeader>

      {index === 0 && (
        <FirstSlideIdentityLine theme="profile" compact={compact} />
      )}

      <div className="relative z-[15] flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-2 py-1 sm:px-4 sm:py-2">
        <StoryTapZones onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onPagerClick={onPagerClick} />
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={rtlSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={rtlSlideTransition}
            className="pointer-events-none flex w-full flex-col items-center justify-center"
          >
            <WrappedSpotifyTopicArticle compact={compact} slideIndex={index} />
          </motion.div>
        </AnimatePresence>
      </div>

      <CreativeShareButton theme="profile" className={SHARE_BTN_POSITION} />
      <CreativeBottomFooter theme="profile" />
    </div>
  );
}

/** כרטיס ג׳ — רקע Year in Review + דפדוף 1–4 (כמו א׳/ב׳) */
function MapCreative({ compact }) {
  const total = MAP_SLIDE_COUNT;
  const { index, direction, onTouchStart, onTouchEnd, onPagerClick } = useSlidePager(total);

  const { pillClass } = getWrappedTopicSlideStyles(compact);

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden rounded-[1.35rem] p-3 shadow-[0_0_0_1px_rgba(125,211,252,0.35)] sm:gap-2.5 sm:p-4"
      dir="rtl"
      aria-label={`קריאייטיב ג׳ — שקופית ${index + 1} מתוך ${total}`}
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

      <CreativeTopHeader theme="duo">
        <StoryProgressBar theme="duo" compact={compact} index={index} total={total} />
      </CreativeTopHeader>

      {index === 0 && (
        <FirstSlideIdentityLine theme="light" compact={compact} />
      )}

      <div className="relative z-[15] flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden py-1 sm:py-2">
        <StoryTapZones onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onPagerClick={onPagerClick} />
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            variants={rtlSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={rtlSlideTransition}
            className="pointer-events-none flex w-full flex-col items-center justify-center"
          >
            <ValuesSlidePanel compact={compact} pillClass={pillClass} slideIndex={index} />
          </motion.div>
        </AnimatePresence>
      </div>

      <CreativeShareButton theme="duo" className={SHARE_BTN_POSITION} />
      <CreativeBottomFooter theme="duo" />
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
