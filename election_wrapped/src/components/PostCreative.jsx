import { useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Share2 } from "lucide-react";

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

const CANDIDATES_SLIDE_HEADLINE = "התאמה למועמד באחוזים:";
const CANDIDATES_SLIDE_LINES = ["יאיר לפיד 85%", "יאיר גולן 67%", "אביגדור ליברמן 43%"];

const COALITION_SLIDE_HEADLINE = "מי הקואלציה הטבעית שלך:";
const COALITION_SLIDE_LINES = ["מרכז", "שמאל", "ערבים"];

const POLITICAL_MAP_HEADLINE = "המפה הפוליטית שלך:";

const POLITICAL_MAP_AXES = [
  { id: "general", label: "קפיטליסט", dotSide: "right" },
  { id: "political", label: "שמאלני", dotSide: "left", dotLeft: "24%" },
  { id: "social", label: "ליברלי", dotSide: "left" },
];

const POLITICAL_MAP_DOT_LEFT = { right: "82%", left: "12%" };

const SLIDE_COUNT = 4;

function getSlideCopy(slideIndex) {
  if (slideIndex === 1) {
    return { headline: CANDIDATES_SLIDE_HEADLINE, lines: CANDIDATES_SLIDE_LINES };
  }
  if (slideIndex === 3) {
    return { headline: COALITION_SLIDE_HEADLINE, lines: COALITION_SLIDE_LINES };
  }
  return { headline: DEFAULT_SLIDE_HEADLINE, lines: DEFAULT_SLIDE_LINES };
}

const FIRST_SLIDE_IDENTITY_STYLE = {
  frame:
    "rounded-2xl border border-[#1877f2]/18 bg-white/92 px-4 py-2.5 shadow-[0_10px_28px_rgba(24,119,242,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] sm:px-5 sm:py-3",
  title: "text-[#1877f2]",
  subtitle: "text-slate-500",
  divider: "bg-gradient-to-r from-transparent via-[#1877f2]/35 to-transparent",
  dot: "bg-[#1877f2]/55",
};

function FirstSlideIdentityLine({ compact }) {
  const titleSize = compact
    ? "text-[1.3125rem] leading-none sm:text-[1.5rem]"
    : "text-[1.4375rem] leading-none sm:text-[1.625rem]";
  const subtitleSize = compact
    ? "text-[0.6875rem] leading-none tracking-[0.14em] sm:text-[0.75rem]"
    : "text-[0.75rem] leading-none tracking-[0.16em] sm:text-[0.8125rem]";

  return (
    <div className="relative z-20 flex w-full shrink-0 justify-center px-2 pb-0.5 pt-16 sm:px-3 sm:pb-1 sm:pt-[4.75rem]">
      <div
        className={`flex max-w-[min(100%,22rem)] flex-col items-center gap-1.5 sm:gap-2 ${FIRST_SLIDE_IDENTITY_STYLE.frame}`}
        aria-label={FIRST_SLIDE_IDENTITY_LINE}
      >
        <div className="flex w-full items-center justify-center gap-2 sm:gap-2.5">
          <span className={`h-px w-6 shrink-0 sm:w-8 ${FIRST_SLIDE_IDENTITY_STYLE.divider}`} aria-hidden />
          <span className={`font-black tracking-[-0.022em] ${titleSize} ${FIRST_SLIDE_IDENTITY_STYLE.title}`}>
            {FIRST_SLIDE_IDENTITY_PARTS.title}
          </span>
          <span className={`h-px w-6 shrink-0 sm:w-8 ${FIRST_SLIDE_IDENTITY_STYLE.divider}`} aria-hidden />
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`h-1 w-1 shrink-0 rounded-full ${FIRST_SLIDE_IDENTITY_STYLE.dot}`} aria-hidden />
          <span className={`font-bold uppercase ${subtitleSize} ${FIRST_SLIDE_IDENTITY_STYLE.subtitle}`}>
            {FIRST_SLIDE_IDENTITY_PARTS.subtitle}
          </span>
          <span className={`h-1 w-1 shrink-0 rounded-full ${FIRST_SLIDE_IDENTITY_STYLE.dot}`} aria-hidden />
        </div>
      </div>
    </div>
  );
}

const HEADLINE_BLUE = "text-[#0f4c9a] drop-shadow-[0_1px_0_rgba(255,255,255,0.85)]";

function getTopicsHeadlineClass(compact) {
  const layout = compact
    ? "w-full px-0.5 text-center font-black leading-none tracking-[-0.04em] whitespace-nowrap"
    : "max-w-none text-center font-black leading-[1.08] tracking-[-0.032em] whitespace-nowrap";
  const size = compact ? "text-[1.25rem] sm:text-[1.4375rem]" : "text-[1.625rem] sm:text-[1.875rem]";

  return `${layout} ${size} ${HEADLINE_BLUE} -mt-1`;
}

function getListLineClass(compact, enlarged = false, topicsSlide = false) {
  const size = enlarged
    ? compact
      ? "text-[1.125rem] sm:text-[1.3125rem]"
      : "text-[1.25rem] sm:text-[1.4375rem]"
    : topicsSlide
      ? compact
        ? "text-[0.9375rem] sm:text-[1.0625rem]"
        : "text-[1.0625rem] sm:text-[1.1875rem]"
      : compact
        ? "text-[0.8125rem] sm:text-[0.9375rem]"
        : "text-sm sm:text-base";

  return `min-w-0 flex-1 text-right leading-none tracking-[-0.045em] whitespace-nowrap ${size} font-bold text-slate-900`;
}

function getContentSlideHeadlineClass(compact) {
  const layout = "text-balance text-center font-black leading-[1.1] tracking-[-0.022em]";
  const size = compact ? "text-[1.3125rem] sm:text-[1.5rem]" : "text-[1.5rem] sm:text-[1.8125rem]";
  const maxW = compact ? "max-w-[20rem]" : "max-w-[22rem]";

  return `${maxW} ${layout} ${size} ${HEADLINE_BLUE}`;
}

function getSlideNumClass(compact, enlarged = false, topicsSlide = false) {
  const gradient =
    "bg-gradient-to-b from-blue-700 via-blue-600 to-slate-400 bg-clip-text text-transparent sm:from-blue-800 sm:via-blue-600 sm:to-sky-400";

  if (topicsSlide) {
    return compact
      ? `shrink-0 ${gradient} text-[2.125rem] font-black tabular-nums leading-none sm:text-[2.5rem]`
      : `shrink-0 ${gradient} text-[2.5rem] font-black tabular-nums leading-none sm:text-[2.875rem]`;
  }

  return enlarged
    ? compact
      ? `shrink-0 ${gradient} text-[2.5rem] font-black tabular-nums leading-none sm:text-[3rem]`
      : `shrink-0 ${gradient} text-[3rem] font-black tabular-nums leading-none sm:text-[3.5rem]`
    : compact
      ? `shrink-0 ${gradient} text-[1.9rem] font-black tabular-nums leading-none sm:text-[2.3rem]`
      : `shrink-0 ${gradient} text-[2.3rem] font-black tabular-nums leading-none sm:text-[2.75rem]`;
}

const POLITICAL_MAP_STYLE = {
  axis: "bg-gradient-to-r from-slate-200 via-slate-400 to-slate-200",
  tick: "bg-slate-300",
  dot: "border-blue-600 bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.35)]",
  label: "text-slate-900",
};

function PoliticalAxisRow({ label, dotSide, dotLeft: dotLeftOverride, compact }) {
  const dotLeft = dotLeftOverride ?? POLITICAL_MAP_DOT_LEFT[dotSide];

  return (
    <li className="w-full">
      <div className={`relative w-full ${compact ? "h-11" : "h-12"}`} dir="ltr">
        <span
          className={`pointer-events-none absolute bottom-[calc(50%+12px)] -translate-x-1/2 whitespace-nowrap text-[0.9375rem] font-black leading-none sm:text-[1.0625rem] ${POLITICAL_MAP_STYLE.label}`}
          style={{ left: dotLeft }}
        >
          {label}
        </span>
        <span className={`absolute left-0 top-1/2 h-2 w-0.5 -translate-y-1/2 rounded-full ${POLITICAL_MAP_STYLE.tick}`} aria-hidden />
        <span className={`absolute right-0 top-1/2 h-2 w-0.5 -translate-y-1/2 rounded-full ${POLITICAL_MAP_STYLE.tick}`} aria-hidden />
        <span className={`absolute left-1 right-1 top-1/2 h-[2px] -translate-y-1/2 rounded-full ${POLITICAL_MAP_STYLE.axis}`} aria-hidden />
        <span
          className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 sm:h-4 sm:w-4 ${POLITICAL_MAP_STYLE.dot}`}
          style={{ left: dotLeft }}
          aria-hidden
        />
      </div>
    </li>
  );
}

function PoliticalMapSlidePanel({ compact }) {
  return (
    <div className="pointer-events-none flex w-full flex-col items-center justify-center gap-2.5 px-2 sm:gap-3">
      <h2 className={getContentSlideHeadlineClass(compact)}>{POLITICAL_MAP_HEADLINE}</h2>
      <ul className={`mt-1 w-full space-y-3.5 sm:mt-1.5 sm:space-y-4 ${compact ? "max-w-[19rem]" : "max-w-[21rem]"}`}>
        {POLITICAL_MAP_AXES.map((axis) => (
          <PoliticalAxisRow
            key={axis.id}
            label={axis.label}
            dotSide={axis.dotSide}
            dotLeft={axis.dotLeft}
            compact={compact}
          />
        ))}
      </ul>
    </div>
  );
}

const rtlSlideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? -16 : 16 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? 16 : -16 }),
};

const rtlSlideTransition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] };

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

function CreativeTopHeader({ children }) {
  return (
    <div className="relative z-20 flex shrink-0 items-center px-2.5 pt-3 sm:px-3 sm:pt-3.5" dir="ltr">
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
    </div>
  );
}

function CreativeShareButton({ className = "" }) {
  return (
    <button
      type="button"
      onClick={() => void handleCreativeShare()}
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-sky-200/90 bg-white/85 text-sky-800 shadow-sm backdrop-blur-sm transition hover:bg-white active:scale-95 ${className}`}
      aria-label="שתף"
    >
      <Share2 className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
}

const AI_DISCLAIMER = "התאמה זו בוצעה באמצעות AI";
const USER_DISCLAIMER = "אני משתמש מספר 8 שלוקח אחריות על הבחירות";

function CreativeBottomFooter() {
  return (
    <div className="relative z-30 mb-3 w-full shrink-0 -translate-y-8 px-2 pb-0.5 pt-0.5 sm:mb-4 sm:-translate-y-8">
      <div className="pointer-events-none space-y-0.5 text-center text-sm font-semibold leading-snug text-slate-600/85 sm:text-base">
        <p>{AI_DISCLAIMER}</p>
        <p>{USER_DISCLAIMER}</p>
      </div>
    </div>
  );
}

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

  return { index, direction, onTouchStart, onTouchEnd, onPagerClick };
}

function StoryProgressBar({ compact, index, total }) {
  const stretchW = compact ? "min-w-[1.5rem] flex-1 sm:min-w-[1.75rem]" : "w-8 sm:w-10";

  return (
    <div className="flex min-w-0 flex-1 gap-1.5" dir="rtl">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={
            i <= index
              ? `h-1.5 rounded-full bg-[#49AEF9] shadow-[0_1px_6px_rgba(73,174,249,0.55)] ${stretchW}`
              : `h-1.5 rounded-full bg-sky-200/55 ${stretchW}`
          }
          aria-hidden
        />
      ))}
    </div>
  );
}

function DuoSparkle({ className }) {
  return (
    <svg className={`pointer-events-none text-white/90 ${className}`} viewBox="0 0 14 14" fill="currentColor" aria-hidden>
      <path d="M7 0l1.1 4.9L14 7l-5.9 2.1L7 14l-1.1-4.9L0 7l5.9-2.1L7 0z" />
    </svg>
  );
}

function getSlidePanelStyles(compact) {
  return {
    pillClass: compact
      ? "flex w-full min-w-0 items-center gap-3 px-1 py-1 sm:px-1.5 sm:py-1.5"
      : "flex w-full min-w-0 items-center gap-3.5 px-1.5 py-1.5 sm:px-2 sm:py-2",
  };
}

const SLIDE_PANEL_OFFSET = "-translate-y-10 sm:-translate-y-10";

function MapSlidePanel({ compact, pillClass, slideIndex }) {
  if (slideIndex === 2) {
    return (
      <div className={`flex w-full flex-col items-center ${SLIDE_PANEL_OFFSET}`}>
        <PoliticalMapSlidePanel compact={compact} />
      </div>
    );
  }

  const { headline, lines } = getSlideCopy(slideIndex);
  const isTopicsSlide = slideIndex === 0;
  const numClass = getSlideNumClass(compact, !isTopicsSlide, isTopicsSlide);

  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-1.5 px-1 sm:gap-2 sm:px-2 ${SLIDE_PANEL_OFFSET}`}
    >
      <h2 className={isTopicsSlide ? getTopicsHeadlineClass(compact) : getContentSlideHeadlineClass(compact)}>
        {headline}
      </h2>

      <ul
        className={`w-full space-y-2 sm:space-y-2.5 ${
          isTopicsSlide
            ? "mt-4 max-w-[min(100%,21.5rem)] sm:mt-4.5 sm:max-w-[23rem]"
            : "mt-3 max-w-[20rem] sm:mt-3.5 sm:max-w-[22rem]"
        }`}
      >
        {lines.map((line, idx) => (
          <li key={line} className="flex justify-center">
            <div className={pillClass}>
              <span className={numClass}>{idx + 1}</span>
              <p className={getListLineClass(compact, !isTopicsSlide, isTopicsSlide)}>{line}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MapCreative({ compact }) {
  const { index, direction, onTouchStart, onTouchEnd, onPagerClick } = useSlidePager(SLIDE_COUNT);
  const { pillClass } = getSlidePanelStyles(compact);

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden rounded-none p-0 shadow-none sm:gap-2.5 sm:rounded-[1.35rem] sm:p-4 sm:shadow-[0_0_0_1px_rgba(125,211,252,0.35)]"
      dir="rtl"
      aria-label={`קריאייטיב — שקופית ${index + 1} מתוך ${SLIDE_COUNT}`}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-none sm:rounded-[1.35rem]"
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
            <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-sky-100/30" aria-hidden />
            <div className="pointer-events-none absolute -left-20 top-6 h-44 w-56 rounded-full bg-white/50 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -right-24 top-16 h-52 w-60 rounded-full bg-white/40 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-28 left-[18%] h-48 w-[70%] max-w-md rounded-full bg-white/35 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute right-[8%] top-[42%] h-32 w-40 rounded-full bg-sky-100/50 blur-2xl" aria-hidden />
          </motion.div>
        </AnimatePresence>
      </div>

      <DuoSparkle className="absolute left-[10%] top-[20%] z-[5] h-2.5 w-2.5 opacity-95 sm:h-3 sm:w-3" />
      <DuoSparkle className="absolute right-[14%] top-[26%] z-[5] h-2 w-2 opacity-80 sm:right-[12%]" />
      <DuoSparkle className="absolute left-[18%] top-[55%] z-[5] h-2 w-2 opacity-75" />
      <DuoSparkle className="absolute right-[22%] top-[48%] z-[5] h-2.5 w-2.5 opacity-90" />
      <DuoSparkle className="absolute left-[28%] bottom-[30%] z-[5] h-2 w-2 opacity-70 sm:bottom-[28%]" />
      <DuoSparkle className="absolute right-[30%] bottom-[22%] z-[5] h-2.5 w-2.5 opacity-85" />

      <CreativeTopHeader>
        <StoryProgressBar compact={compact} index={index} total={SLIDE_COUNT} />
      </CreativeTopHeader>

      <FirstSlideIdentityLine compact={compact} />

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
            <MapSlidePanel compact={compact} pillClass={pillClass} slideIndex={index} />
          </motion.div>
        </AnimatePresence>
      </div>

      <CreativeShareButton className={SHARE_BTN_POSITION} />
      <CreativeBottomFooter />
    </div>
  );
}

/** רכיב הוויזואל של כרטיס הפוסט */
export function PostCreative({ compact = true }) {
  return <MapCreative compact={compact} />;
}
