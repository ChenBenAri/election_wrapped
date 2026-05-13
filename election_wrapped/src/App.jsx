import { useCallback, useEffect, useState } from "react";
import { CREATIVE_OPTIONS, resolveDisplayName } from "./data/options";
import { PostCreative } from "./components/PostCreative";
import { SelectedPreview } from "./components/SelectedPreview";
import { fetchVotes, submitVote } from "./lib/votesApi";

/**
 * יצירת כיתוב פייסבוק ניטרלי להדבקה — ללא המלצות הצבעה, ללא שמות מפלגות/מועמדים.
 * הפורמט נשמר עקבי לבדיקת העדפה פנימית בלבד.
 */
function buildFacebookCaption(displayName, selectedOptionName) {
  return `בחירות 2026 WRAPPED

${displayName} קיבל/ה את פרופיל הבחירות האישי:
${selectedOptionName}

איזה פרופיל יצא לכם?`;
}

function optionButtonClasses(variant) {
  switch (variant) {
    case "values":
      return "bg-gradient-to-l from-[#94fbab] to-[#ff2bd6] text-slate-950 hover:brightness-110 shadow-[0_14px_40px_rgba(255,43,214,0.22)]";
    case "profile":
      return "bg-gradient-to-l from-sky-300 to-blue-600 text-blue-950 hover:brightness-110 shadow-[0_14px_40px_rgba(56,189,248,0.22)]";
    case "map":
      return "bg-gradient-to-l from-cyan-300 to-blue-700 text-slate-950 hover:brightness-110 shadow-[0_14px_40px_rgba(34,211,238,0.22)]";
    default:
      return "bg-white text-slate-950";
  }
}

/** מעטפת בחירה: מסגרת זוהרת + אנימציה עדינה כשאופציה נבחרת */
function selectionRingClasses(isSelected) {
  return isSelected
    ? "ring-2 ring-cyan-300/90 shadow-[0_0_0_1px_rgba(34,211,238,0.35),0_24px_80px_rgba(34,211,238,0.18)] scale-[1.02]"
    : "ring-1 ring-white/10 hover:ring-white/20";
}

export default function App() {
  const [name, setName] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [votes, setVotes] = useState([]);
  const [votesLoading, setVotesLoading] = useState(false);
  const [votesConfigured, setVotesConfigured] = useState(false);
  const [votesFetchError, setVotesFetchError] = useState(false);

  const selected = CREATIVE_OPTIONS.find((o) => o.id === selectedId) ?? null;

  const refreshVotes = useCallback(async () => {
    setVotesLoading(true);
    setVotesFetchError(false);
    try {
      const r = await fetchVotes();
      setVotesConfigured(r.configured);
      setVotes(r.votes);
      if (!r.ok) setVotesFetchError(true);
    } catch {
      setVotesFetchError(true);
      setVotesConfigured(false);
      setVotes([]);
    } finally {
      setVotesLoading(false);
    }
  }, []);

  /** אחרי בחירה — רענון תקופתי של לוח הבחירות המשותף (Redis בפריסה) */
  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    const run = () => {
      if (!cancelled) void refreshVotes();
    };
    const first = window.setTimeout(run, 0);
    const t = window.setInterval(run, 8000);
    return () => {
      cancelled = true;
      window.clearTimeout(first);
      window.clearInterval(t);
    };
  }, [selectedId, refreshVotes]);

  /** העתקת כיתוב ניטרלי ללוח — נכשל בשקט אם הדפדפן חוסם גישה ללוח */
  const handleCopyCaption = useCallback(async () => {
    if (!selected) return;
    const displayName = resolveDisplayName(name);
    const text = buildFacebookCaption(displayName, selected.name);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }, [name, selected]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-950 via-[#0a1020] to-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[min(100%,56rem)] -translate-x-1/2 rounded-[100%] bg-blue-600/5 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
        <header className="text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-cyan-200/90 sm:text-base">
            בדיקת קריאייטיב A/B/C לפוסט פייסבוק
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl sm:leading-tight">
            בחירות 2026 WRAPPED
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            הזינו שם, צפו בשלושה כיווני פוסט, ובחרו את הקריאייטיב שנראה הכי חזק לקמפיין.
          </p>
        </header>

        <section className="mx-auto mt-12 max-w-xl">
          <label htmlFor="user-name" className="block text-lg font-black text-slate-100">
            השם שלך
          </label>
          <input
            id="user-name"
            type="text"
            autoComplete="name"
            placeholder="לדוגמה: דנה"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-lg text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-white/[0.09] focus:shadow-[0_0_0_4px_rgba(34,211,238,0.15)]"
          />
        </section>

        <section className="mt-14">
          <h2 className="sr-only">שלוש אופציות קריאייטיב</h2>
          {/* בחירה: כל לחיצה מעדכנת selectedId; המעטפת מקבלת זוהר/הגדלה כשהאופציה נבחרה */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
            {CREATIVE_OPTIONS.map((option) => {
              const isSelected = selectedId === option.id;
              return (
                <article
                  key={option.id}
                  className={`flex flex-col rounded-3xl bg-white/[0.03] p-3 transition duration-300 sm:p-4 ${selectionRingClasses(isSelected)}`}
                >
                  <div className="mb-3 flex items-center justify-between px-1">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-slate-200">
                      אופציה {option.id}
                    </span>
                    <span className="text-sm font-black text-cyan-200">{option.name}</span>
                  </div>

                  <div className="aspect-[4/5] w-full min-h-0 overflow-hidden rounded-2xl">
                    <PostCreative variant={option.variant} name={name} compact />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (selectedId === option.id) {
                        setCopied(false);
                        return;
                      }
                      setSelectedId(option.id);
                      setCopied(false);
                      const displayName = resolveDisplayName(name);
                      void (async () => {
                        await submitVote({
                          displayName,
                          optionId: option.id,
                          optionName: option.name,
                        });
                        await refreshVotes();
                      })();
                    }}
                    className={`mt-4 w-full rounded-2xl py-4 text-center text-base font-black transition active:scale-[0.99] ${optionButtonClasses(option.variant)}`}
                  >
                    בחרתי באופציה הזאת
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {selected && (
          <SelectedPreview
            option={selected}
            name={name}
            onCopyCaption={handleCopyCaption}
            copied={copied}
            votes={votes}
            votesLoading={votesLoading}
            votesConfigured={votesConfigured}
            votesFetchError={votesFetchError}
          />
        )}

        <footer className="mt-16 pb-8 text-center text-xs leading-relaxed text-slate-500">
          בדיקת העדפה פנימית בלבד. בפריסה ל־Vercel עם Redis (Upstash) נשמרות בחירות לצורך לוח משותף
          בלבד — ללא התחברות וללא מסד משתמשים.
        </footer>
      </main>
    </div>
  );
}
