import { useId } from "react";
import { resolveDisplayName } from "../data/options";

function NeonBlob({ className }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full blur-3xl opacity-70 ${className}`}
      aria-hidden
    />
  );
}

function Sparkle({ className }) {
  return (
    <span
      className={`pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[#94fbab] shadow-[0_0_12px_#94fbab] ${className}`}
      aria-hidden
    />
  );
}

/** כרטיס אופציה א׳ — אסתטיקת ניאון/Wrapped בהשראת סקר ערכים */
function ValuesCreative({ name, compact }) {
  const display = resolveDisplayName(name);
  const title = compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl";
  const sub = compact ? "text-base sm:text-lg" : "text-lg sm:text-xl";
  const list = compact ? "text-sm sm:text-base" : "text-base sm:text-lg";
  const num = compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl";

  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.35rem] bg-[#0c0518] p-4 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)] sm:p-5"
      dir="rtl"
    >
      <div className="grain-overlay absolute inset-0" aria-hidden />
      <NeonBlob className="-left-10 -top-24 h-48 w-48 bg-gradient-to-br from-[#94fbab] to-[#ff2bd6]" />
      <NeonBlob className="-bottom-28 -right-16 h-56 w-56 bg-gradient-to-tl from-[#ff2bd6] to-[#94fbab]" />
      <div
        className="pointer-events-none absolute -right-8 top-1/3 h-40 w-40 rotate-12 rounded-[3rem] border-[10px] border-transparent bg-gradient-to-l from-[#94fbab]/40 to-[#ff2bd6]/25 opacity-80"
        style={{ maskImage: "radial-gradient(circle at 30% 30%, black 55%, transparent 70%)" }}
        aria-hidden
      />
      <Sparkle className="left-[12%] top-[18%]" />
      <Sparkle className="right-[18%] top-[26%] h-2 w-2 bg-[#ff2bd6] shadow-[0_0_12px_#ff2bd6]" />
      <Sparkle className="bottom-[22%] left-[20%]" />

      <div className="relative z-10 flex justify-center gap-1 px-1 pt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i < 2 ? "bg-gradient-to-l from-[#94fbab] to-[#ff2bd6]" : "bg-white/15"}`}
          />
        ))}
      </div>

      <div className="relative z-10 mt-4 flex flex-1 flex-col items-center text-center">
        <h3 className={`max-w-[95%] font-black leading-tight ${title}`}>
          סקירת שנת הערכים של {display}
        </h3>
        <p
          className={`mt-3 bg-gradient-to-l from-[#94fbab] to-[#6cfbc7] bg-clip-text font-black text-transparent drop-shadow-[0_0_18px_rgba(148,251,171,0.35)] ${sub}`}
        >
          ערכים מובילים
        </p>

        <ul className={`mt-5 w-full max-w-[100%] space-y-3 text-right ${list}`}>
          {[
            "שוק חופשי ומינימום התערבות",
            "תחבורה ציבורית בשבת",
            "מנהיגות כריזמטית",
          ].map((line, idx) => (
            <li
              key={line}
              className="flex items-start gap-3 rounded-2xl bg-black/25 px-3 py-2.5 ring-1 ring-white/10 backdrop-blur-sm"
            >
              <span
                className={`shrink-0 bg-gradient-to-br from-[#94fbab] to-[#ff2bd6] bg-clip-text font-black leading-none text-transparent drop-shadow-[0_0_12px_rgba(255,43,214,0.35)] [text-shadow:0_0_1px_rgba(255,255,255,0.15)] ${num}`}
              >
                {idx + 1}
              </span>
              <span className="font-bold leading-snug">{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="pointer-events-none absolute bottom-4 left-4 h-10 w-10 rotate-12 rounded-md bg-gradient-to-br from-[#94fbab] to-[#ff2bd6] opacity-90 shadow-[0_12px_40px_rgba(255,43,214,0.35)]"
        aria-hidden
      />
    </div>
  );
}

function BallotIcon({ className }) {
  const gid = useId().replace(/:/g, "");
  const grad = `bb-${gid}`;
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={grad} x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect x="14" y="18" width="36" height="38" rx="4" fill={`url(#${grad})`} />
      <rect x="18" y="10" width="28" height="12" rx="3" fill="#e0f2fe" />
      <path d="M22 26h20v22H22z" fill="#fff" />
      <path
        d="M28 38l4 4 8-10"
        stroke="#1d4ed8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** כרטיס אופציה ב׳ — שפה רשמית/בחירות בהשראת התאמה לפרופיל */
function ProfileCreative({ name, compact }) {
  const display = resolveDisplayName(name);
  const h1 = compact ? "text-sm sm:text-base" : "text-base sm:text-lg";
  const h2w = compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl";
  const h2b = compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl";
  const card = compact ? "text-sm sm:text-base" : "text-base sm:text-lg";

  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.35rem] bg-gradient-to-b from-[#042c7a] via-[#063a9e] to-[#02143d] p-4 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)] sm:p-5"
      dir="rtl"
    >
      <div className="pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full bg-sky-400/15 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-blue-300/10 blur-3xl" aria-hidden />

      <header className="relative z-10 flex items-start justify-between gap-2">
        <BallotIcon className="h-12 w-12 shrink-0 drop-shadow-lg sm:h-14 sm:w-14" />
        <div className="flex-1 text-center">
          <p className={`font-black tracking-tight ${h1}`}>בחירות 2026 WRAPPED</p>
        </div>
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-br-2xl bg-white shadow-md ring-2 ring-blue-700 sm:h-14 sm:w-14"
          aria-hidden
        >
          <svg viewBox="0 0 32 32" className="h-9 w-9 text-blue-700">
            <path fill="currentColor" d="M16 4l2.2 6.8H25l-5.5 4 2.1 6.7L16 17.4l-5.6 4.1 2.1-6.7L7 10.8h6.8z" />
          </svg>
        </div>
      </header>

      <div className="relative z-10 mt-5 flex flex-1 flex-col items-stretch gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-xl ring-4 ring-sky-300/40 sm:h-[4.5rem] sm:w-[4.5rem]">
            <svg viewBox="0 0 24 24" className="h-9 w-9 text-blue-800" aria-hidden>
              <path
                fill="currentColor"
                d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0H5z"
              />
            </svg>
            <span className="absolute -bottom-0.5 -left-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-sky-400 text-[10px] font-black text-blue-950 ring-2 ring-white sm:h-7 sm:w-7">
              ✓
            </span>
          </div>
          <div className="min-w-0 flex-1 text-right">
            <p className={`font-black leading-tight text-white ${h2w}`}>התאמה חכמה</p>
            <p className={`mt-1 font-black leading-snug text-sky-200 ${h2b}`}>
              לפרופיל הפוליטי של {display}:
            </p>
          </div>
        </div>

        <div
          className={`relative flex-1 rounded-2xl bg-white p-4 text-blue-950 shadow-[0_20px_50px_rgba(0,0,0,0.25)] ring-1 ring-black/5 ${card}`}
        >
          <div className="absolute left-3 top-3 flex items-center gap-2 text-xs font-bold text-blue-700">
            <span>1 / 3</span>
          </div>
          <div className="absolute right-3 top-3 rounded-md bg-blue-700 px-2 py-1 text-xs font-black text-white">
            01
          </div>
          <div className="absolute left-2 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2">
            <span className="h-16 w-1 rounded-full bg-blue-200" />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-white shadow-md">
              <span className="text-sm" aria-hidden>
                ›
              </span>
            </span>
          </div>
          <p className="mx-auto max-w-[92%] pt-8 text-center font-black leading-snug">
            את/ה אזרח/ית שמעדיף/ה גישה כלכלית ימנית של שוק חופשי ומינימום התערבות מצד המדינה.
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniBar({ label, value, widthPct }) {
  return (
    <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-200 sm:text-sm">
        <span>{label}</span>
        <span className="text-cyan-300">{value}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/40">
        <div
          className="h-full rounded-full bg-gradient-to-l from-cyan-300 via-sky-400 to-blue-600 shadow-[0_0_16px_rgba(34,211,238,0.45)]"
          style={{ width: `${widthPct}%` }}
        />
      </div>
    </div>
  );
}

/** כרטיס אופציה ג׳ — לוח אנליטיקה אישי / מפת בחירות */
function MapCreative({ name, compact }) {
  const display = resolveDisplayName(name);
  const rid = useId().replace(/:/g, "");
  const ringGrad = `map-ring-${rid}`;
  const t = compact ? "text-sm sm:text-base" : "text-base sm:text-lg";
  const eng = compact ? "text-xs sm:text-sm" : "text-sm sm:text-base";

  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.35rem] bg-gradient-to-b from-[#020617] via-[#041226] to-black p-4 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)] sm:p-5"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden>
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to left, rgba(56,189,248,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.08) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>
      <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" aria-hidden />

      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="rounded-2xl bg-white/5 px-3 py-2 text-[10px] font-bold text-cyan-200 ring-1 ring-cyan-400/25 sm:text-xs">
          מפה אישית
        </div>
        <div className="text-left text-[10px] text-slate-400 sm:text-xs">2026</div>
      </div>

      <div className="relative z-10 mt-4 text-center">
        <h3 className={`font-black ${t}`}>מפת הבחירות של {display}</h3>
        <p className={`mt-2 font-semibold tracking-wide text-cyan-200 ${eng}`}>
          Election 2026 Personal Map
        </p>
      </div>

      <div className="relative z-10 mt-4 grid flex-1 grid-cols-1 gap-2.5">
        <MiniBar label="ציר כלכלי" value="שוק חופשי" widthPct={82} />
        <MiniBar label="ציר אזרחי" value="ליברלי" widthPct={68} />
        <MiniBar label="ציר מנהיגות" value="פרגמטי" widthPct={74} />
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
          <BallotIcon className="h-10 w-10" />
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-300 sm:text-xs">סטטוס הצבעה</p>
            <p className="text-xs font-black text-white sm:text-sm">מוכן לשיתוף</p>
          </div>
        </div>

        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id={ringGrad} x1="0" y1="0" x2="120" y2="120">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="44" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="44"
              stroke={`url(#${ringGrad})`}
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 44 * 0.87} ${2 * Math.PI * 44}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-slate-300">התאמה כללית</span>
            <span className="text-2xl font-black text-cyan-200 sm:text-3xl">87%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * רכיב הוויזואל של כרטיסי הפוסט (תוכן סטטי לתצוגה ובחירת העדפה).
 * @param {"values"|"profile"|"map"} variant
 */
export function PostCreative({ variant, name, compact = true }) {
  switch (variant) {
    case "values":
      return <ValuesCreative name={name} compact={compact} />;
    case "profile":
      return <ProfileCreative name={name} compact={compact} />;
    case "map":
      return <MapCreative name={name} compact={compact} />;
    default:
      return null;
  }
}
