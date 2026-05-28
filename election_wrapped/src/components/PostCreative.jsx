import { useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FIRST_SLIDE_IDENTITY_LINE = "תעודת הזהות הפוליטית שלי";
const FIRST_SLIDE_IDENTITY_PARTS = {
  title: "תעודת הזהות",
  subtitle: "הפוליטית שלי",
};
const DEFAULT_SLIDE_HEADLINE = "מה הכי חשוב לי בבחירות הקרובות";
const TOPICS_SLIDE_HEADLINE_PARTS = {
  line1: "מה הכי חשוב לי",
  line2: "בבחירות הקרובות",
};
const DEFAULT_SLIDE_LINES = [
  "עמדה ביטחונית",
  "גוש (ימין/מרכז/שמאל)",
  "שילוב חרדים",
];

const CANDIDATES_SLIDE_HEADLINE = "מי הכי מתאים לי";
const CANDIDATES_SLIDE_LINES = ["יאיר לפיד - 85%", "יאיר גולן - 67%", "אביגדור ליברמן - 43%"];

const POLITICAL_MAP_HEADLINE = "מה הדעות שלי";
const POLITICAL_SLIDE_LINES = ["בעד פתרון מדיני", "בעד כלכלה חופשית", "בעד גיוס חרדים"];

const SLIDE_COUNT = 3;

function getSlideCopy(slideIndex) {
  if (slideIndex === 1) {
    return { headline: CANDIDATES_SLIDE_HEADLINE, lines: CANDIDATES_SLIDE_LINES };
  }
  if (slideIndex === 2) {
    return { headline: POLITICAL_MAP_HEADLINE, lines: POLITICAL_SLIDE_LINES };
  }
  return { headline: DEFAULT_SLIDE_HEADLINE, lines: DEFAULT_SLIDE_LINES };
}

const FIRST_SLIDE_IDENTITY_STYLE = {
  frame:
    "rounded-2xl border border-[#1877f2]/18 bg-white/92 px-6 py-4 shadow-[0_10px_28px_rgba(24,119,242,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] sm:px-8 sm:py-[1.125rem]",
  title: "text-[#1877f2]",
  subtitle: "text-slate-500",
  divider: "bg-gradient-to-r from-transparent via-[#1877f2]/35 to-transparent",
  dot: "bg-[#1877f2]/55",
};

function FirstSlideIdentityLine({ compact }) {
  const titleSize = compact
    ? "text-[1.6875rem] leading-none sm:text-[1.875rem]"
    : "text-[2rem] leading-none sm:text-[2.125rem]";
  const subtitleSize = compact
    ? "text-[0.875rem] leading-none tracking-[0.14em] sm:text-[0.9375rem]"
    : "text-[0.9375rem] leading-none tracking-[0.16em] sm:text-[1rem]";

  return (
    <div className="relative z-20 flex w-full shrink-0 justify-center px-2 pb-0.5 pt-16 sm:px-3 sm:pb-3 sm:pt-14">
      <div
        className={`flex max-w-[min(100%,28rem)] flex-col items-center gap-3 sm:gap-3.5 ${FIRST_SLIDE_IDENTITY_STYLE.frame}`}
        aria-label={FIRST_SLIDE_IDENTITY_LINE}
      >
        <div className="flex w-full items-center justify-center gap-3.5 sm:gap-4">
          <span className={`h-px w-9 shrink-0 sm:w-11 ${FIRST_SLIDE_IDENTITY_STYLE.divider}`} aria-hidden />
          <span className={`font-black tracking-[-0.022em] ${titleSize} ${FIRST_SLIDE_IDENTITY_STYLE.title}`}>
            {FIRST_SLIDE_IDENTITY_PARTS.title}
          </span>
          <span className={`h-px w-9 shrink-0 sm:w-11 ${FIRST_SLIDE_IDENTITY_STYLE.divider}`} aria-hidden />
        </div>

        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${FIRST_SLIDE_IDENTITY_STYLE.dot}`} aria-hidden />
          <span className={`font-bold uppercase ${subtitleSize} ${FIRST_SLIDE_IDENTITY_STYLE.subtitle}`}>
            {FIRST_SLIDE_IDENTITY_PARTS.subtitle}
          </span>
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${FIRST_SLIDE_IDENTITY_STYLE.dot}`} aria-hidden />
        </div>
      </div>
    </div>
  );
}

const HEADLINE_BLUE = "text-[#0f4c9a] drop-shadow-[0_1px_0_rgba(255,255,255,0.85)]";
const IG_GRADIENT_BADGE = "bg-gradient-to-br from-[#FCAF45] via-[#F77737] to-[#FD1D1D]";
const FLOWING_FONT = "font-flowing";
const TOPICS_FONT = "font-topics";
const TOPICS_LIST_FONT = "font-topics-list";

function getTopicsHeadlineClass(compact) {
  const layout = `mx-auto max-w-[20rem] text-center font-semibold leading-[1.16] tracking-[-0.02em] sm:max-w-[22rem] ${TOPICS_FONT}`;
  const size = compact ? "text-[1.8125rem] sm:text-[1.875rem]" : "text-[1.875rem] sm:text-[2.125rem]";

  return `${layout} ${size} ${HEADLINE_BLUE} -mt-14 sm:-mt-12`;
}

function TopicsStyleHeadline({ compact, line1, line2, nudgeDown = false }) {
  const nudge = nudgeDown ? " translate-y-4 sm:translate-y-3" : "";

  return (
    <h2 className={`${getTopicsHeadlineClass(compact)}${nudge}`}>
      <span className="block">{line1}</span>
      <span className={`block ${line2 ? "" : "invisible"}`} aria-hidden={!line2}>
        {line2 ?? "\u00A0"}
      </span>
    </h2>
  );
}

function TopicsHeadline({ compact }) {
  return (
    <TopicsStyleHeadline
      compact={compact}
      line1={TOPICS_SLIDE_HEADLINE_PARTS.line1}
      line2={TOPICS_SLIDE_HEADLINE_PARTS.line2}
    />
  );
}

function TopicsListRow({ compact, index, line }) {
  const badgeSize = compact
    ? "h-8 w-8 rounded-xl text-sm sm:h-7 sm:w-7 sm:rounded-lg sm:text-xs"
    : "h-7 w-7 rounded-lg text-xs sm:text-[0.8125rem]";

  return (
    <div
      className={`flex w-full min-w-0 items-center gap-3.5 px-0 py-2 sm:gap-4 sm:py-2.5 ${TOPICS_LIST_FONT}`}
    >
      <span
        className={`flex shrink-0 items-center justify-center font-normal tabular-nums leading-none text-white shadow-[0_4px_14px_rgba(247,119,55,0.28)] ${IG_GRADIENT_BADGE} ${badgeSize}`}
      >
        {index}
      </span>
      <p className={getListLineClass(compact)}>{line}</p>
    </div>
  );
}

function getListLineClass(compact, topicsSlide = true) {
  const size = topicsSlide
    ? compact
      ? "text-[1.4375rem] sm:text-[1.3125rem]"
      : "text-[1.3125rem] sm:text-[1.4375rem]"
    : compact
      ? "text-[0.8125rem] sm:text-[0.9375rem]"
      : "text-sm sm:text-base";

  const weight = "font-normal";
  const tracking = topicsSlide ? "tracking-[-0.01em]" : "tracking-normal";
  const leading = "leading-snug";
  const font = topicsSlide ? TOPICS_LIST_FONT : FLOWING_FONT;
  const color = topicsSlide ? "text-slate-800/90" : "text-slate-900";

  return `min-w-0 flex-1 text-right ${leading} ${tracking} whitespace-nowrap ${size} ${weight} ${color} ${font}`;
}

const rtlSlideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? -16 : 16 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? 16 : -16 }),
};

const rtlSlideTransition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] };

function CreativeTopHeader({ children }) {
  return (
    <div className="relative z-20 flex shrink-0 items-center px-2.5 pt-3 sm:px-3 sm:pt-3.5" dir="ltr">
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
    </div>
  );
}

const AI_DISCLAIMER = "התאמה זו בוצעה באמצעות AI";
const FOOTER_CTA = "גלו את שלכם";
const FOOTER_SITE_LABEL = "PoliticalID.co.il";
const FOOTER_SITE_URL = "https://PoliticalID.co.il";

function CreativeBottomFooter() {
  return (
    <div className="absolute inset-x-0 bottom-10 z-30 px-2 text-center text-sm font-semibold leading-snug text-slate-600/85 sm:bottom-6 sm:text-base">
      <div className="flex flex-col items-center gap-1">
        <p className="pointer-events-none">{AI_DISCLAIMER}</p>
        <p className="pointer-events-none">{FOOTER_CTA}</p>
        <a
          href={FOOTER_SITE_URL}
          className="inline-block text-[#1877f2] transition hover:text-[#166fe5] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {FOOTER_SITE_LABEL}
        </a>
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

const TOPICS_SLIDE_WEB_OFFSET = "-translate-y-14 sm:-translate-y-11";
const TOPICS_LAYOUT_LIST_CLASS =
  "mt-5 w-full max-w-[min(100%,24rem)] -translate-x-12 translate-y-2 space-y-2.5 sm:mt-4 sm:max-w-[26rem] sm:-translate-x-14 sm:translate-y-0 sm:space-y-3";
const CONTENT_PANEL_CLASS = `flex w-full flex-col items-center justify-center gap-1.5 px-1 sm:gap-3 sm:px-2 ${TOPICS_SLIDE_WEB_OFFSET}`;

function MapSlidePanel({ compact, slideIndex }) {
  const { headline, lines } = getSlideCopy(slideIndex);

  return (
    <div className={CONTENT_PANEL_CLASS}>
      {slideIndex === 0 ? (
        <TopicsHeadline compact={compact} />
      ) : (
        <TopicsStyleHeadline compact={compact} line1={headline} nudgeDown />
      )}

      <ul className={TOPICS_LAYOUT_LIST_CLASS}>
        {lines.map((line, idx) => (
          <li key={line} className="flex justify-center">
            <TopicsListRow compact={compact} index={idx + 1} line={line} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MapCreative({ compact }) {
  const { index, direction, onTouchStart, onTouchEnd, onPagerClick } = useSlidePager(SLIDE_COUNT);

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

      <CreativeTopHeader>
        <StoryProgressBar compact={compact} index={index} total={SLIDE_COUNT} />
      </CreativeTopHeader>

      <FirstSlideIdentityLine compact={compact} />

      <div className="relative z-[15] flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden py-1 sm:py-3">
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
            <MapSlidePanel compact={compact} slideIndex={index} />
          </motion.div>
        </AnimatePresence>
      </div>

      <CreativeBottomFooter />
    </div>
  );
}

/** רכיב הוויזואל של כרטיס הפוסט */
export function PostCreative({ compact = true }) {
  return <MapCreative compact={compact} />;
}
