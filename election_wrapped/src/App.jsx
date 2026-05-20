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

/** כפתור בחירה אחיד וניטרלי לכל האופציות */
const OPTION_CHOOSE_BUTTON_CLASS =
  "rounded-lg border border-slate-300 bg-[#e4e6eb] py-3.5 text-center text-base font-bold text-slate-800 shadow-sm transition hover:bg-[#d8dadf] active:scale-[0.99]";

/** מעטפת בחירה — הדגשה בסגנון כרטיס פייסבוק */
function selectionRingClasses(isSelected) {
  return isSelected
    ? "ring-2 ring-[#1877f2] shadow-[0_2px_12px_rgba(24,119,242,0.25)] scale-[1.02]"
    : "ring-1 ring-black/[0.06] shadow-sm hover:shadow-md";
}

export default function App() {
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
    const text = buildFacebookCaption(resolveDisplayName(""), selected.name);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }, [selected]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f0f2f5] text-slate-900">
      {/* עדין כמו פייסבוק: רקע אחיד + הפרדה קלה בין אזורים */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 120% 80% at 50% -20%, rgba(255,255,255,0.7), transparent 55%)",
        }}
        aria-hidden
      />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
        <header className="text-center">
          <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-6xl sm:leading-tight">
            בחירות 2026 WRAPPED
          </h1>
        </header>

        <section className="mt-12">
          <h2 className="sr-only">שלוש אופציות קריאייטיב</h2>
          {/* בחירה: כל לחיצה מעדכנת selectedId; המעטפת מקבלת זוהר/הגדלה כשהאופציה נבחרה */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
            {CREATIVE_OPTIONS.map((option) => {
              const isSelected = selectedId === option.id;
              return (
                <article
                  key={option.id}
                  className={`flex flex-col rounded-xl bg-white p-3 transition duration-300 sm:p-4 ${selectionRingClasses(isSelected)}`}
                >
                  <div className="mb-3 px-1">
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      אופציה {option.id}
                    </span>
                  </div>

                  <div className="aspect-[4/5] w-full min-h-0 overflow-hidden rounded-2xl">
                    <PostCreative variant={option.variant} compact />
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
                      void (async () => {
                        await submitVote({
                          displayName: resolveDisplayName(""),
                          optionId: option.id,
                          optionName: option.name,
                        });
                        await refreshVotes();
                      })();
                    }}
                    className={`mt-4 w-full ${OPTION_CHOOSE_BUTTON_CLASS}`}
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
            onCopyCaption={handleCopyCaption}
            copied={copied}
            votes={votes}
            votesLoading={votesLoading}
            votesConfigured={votesConfigured}
            votesFetchError={votesFetchError}
          />
        )}
      </main>
    </div>
  );
}
