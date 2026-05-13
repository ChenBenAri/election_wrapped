import { PostCreative } from "./PostCreative";
import { VotesLeaderboard } from "./VotesLeaderboard";
import { resolveDisplayName } from "../data/options";

/** אזור אישור לאחר בחירה — כולל תצוגה מוגדלת של הקריאייטיב הנבחר */
export function SelectedPreview({
  option,
  name,
  onCopyCaption,
  copied,
  votes,
  votesLoading,
  votesConfigured,
  votesFetchError,
}) {
  const displayName = resolveDisplayName(name);

  return (
    <section
      className="relative mt-14 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-10"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute -left-24 top-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative">
        <h2 className="text-center text-3xl font-black text-white sm:text-4xl">הבחירה שלך</h2>
        <p className="mt-4 text-center text-lg text-slate-200">
          בחרת את: <span className="font-black text-cyan-200">{option.name}</span>
        </p>
        <p className="mt-1 text-center text-lg text-slate-200">
          שם: <span className="font-black text-white">{displayName}</span>
        </p>

        <div className="mx-auto mt-8 w-full max-w-md">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl ring-1 ring-white/15 shadow-2xl">
            <PostCreative variant={option.variant} name={name} compact={false} />
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-md flex-col items-stretch gap-3">
          <button
            type="button"
            onClick={onCopyCaption}
            className="rounded-2xl bg-gradient-to-l from-cyan-400 to-blue-600 px-6 py-4 text-center text-lg font-black text-slate-950 shadow-[0_16px_40px_rgba(34,211,238,0.25)] transition hover:brightness-110 active:scale-[0.99]"
          >
            העתקת טקסט הפוסט
          </button>
          {copied && (
            <p className="text-center text-sm font-bold text-emerald-300">הטקסט הועתק ללוח</p>
          )}
        </div>

        <VotesLeaderboard
          votes={votes}
          loading={votesLoading}
          configured={votesConfigured}
          fetchError={votesFetchError}
        />
      </div>
    </section>
  );
}
