import { PostCreative } from "./PostCreative";
import { VotesLeaderboard } from "./VotesLeaderboard";
/** אזור אישור לאחר בחירה — כרטיס לבן בסגנון פייסבוק */
export function SelectedPreview({
  option,
  onCopyCaption,
  copied,
  votes,
  votesLoading,
  votesConfigured,
  votesFetchError,
}) {
  return (
    <section
      className="relative mt-14 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10"
      aria-live="polite"
    >
      <div className="relative">
        <h2 className="text-center text-3xl font-black text-slate-900 sm:text-4xl">הבחירה שלך</h2>
        <p className="mt-4 text-center text-lg text-[#65676b]">
          בחרת את: <span className="font-black text-[#1877f2]">{option.name}</span>
        </p>

        <div className="mx-auto mt-8 w-full max-w-md">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border border-slate-200 shadow-md ring-1 ring-black/[0.04]">
            <PostCreative variant={option.variant} compact={false} />
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-md flex-col items-stretch gap-3">
          <button
            type="button"
            onClick={onCopyCaption}
            className="rounded-lg bg-[#1877f2] px-6 py-4 text-center text-lg font-bold text-white shadow-sm transition hover:bg-[#166fe5] active:scale-[0.99]"
          >
            העתקת טקסט הפוסט
          </button>
          {copied && (
            <p className="text-center text-sm font-bold text-emerald-700">הטקסט הועתק ללוח</p>
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
