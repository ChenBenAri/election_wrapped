/** לוח בחירות משותף — מוצג אחרי בחירת אופציה; נתונים מגיעים מ־Vercel KV כשמוגדר בפרויקט */

function formatTime(ts) {
  if (!Number.isFinite(ts)) return "—";
  try {
    return new Date(ts).toLocaleString("he-IL", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}

export function VotesLeaderboard({ votes, loading, configured, fetchError }) {
  return (
    <div className="mt-10 rounded-2xl border border-white/10 bg-black/25 p-4 sm:p-6">
      <h3 className="text-center text-xl font-black text-white sm:text-2xl">בחירות המשתתפים</h3>
      <p className="mt-2 text-center text-sm text-slate-400">
        רשימה משותפת לכל מי שנכנס לאתר (כשמחובר Redis בפרויקט Vercel).
      </p>

      {!configured && (
        <p className="mt-4 rounded-xl bg-amber-500/10 px-4 py-3 text-center text-sm font-semibold text-amber-200 ring-1 ring-amber-400/30">
          אחסון משותף לא מחובר או לא זמין בסביבה זו. בפריסת Vercel הוסיפו אינטגרציית{" "}
          <span className="whitespace-nowrap">Redis (Upstash)</span> מה־Marketplace והגדירו את משתני
          הסביבה <span className="font-mono text-xs">UPSTASH_REDIS_REST_URL</span> ו־
          <span className="font-mono text-xs">UPSTASH_REDIS_REST_TOKEN</span>. בפיתוח מקומי אפשר להריץ{" "}
          <span className="font-mono text-xs">vercel dev</span> עם אותם משתנים.
        </p>
      )}

      {fetchError && (
        <p className="mt-3 text-center text-sm font-bold text-rose-300">שגיאה בטעינת הרשימה</p>
      )}

      {loading && <p className="mt-4 text-center text-sm text-slate-400">טוען…</p>}

      {configured && !loading && votes.length === 0 && (
        <p className="mt-4 text-center text-sm text-slate-400">עדיין אין רשומות — הבחירה הראשונה תופיע כאן.</p>
      )}

      {votes.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl ring-1 ring-white/10">
          <table className="w-full min-w-[320px] border-collapse text-right text-sm">
            <thead>
              <tr className="bg-white/5 text-xs font-black uppercase tracking-wide text-slate-300 sm:text-sm">
                <th className="px-3 py-3 sm:px-4">שם</th>
                <th className="px-3 py-3 sm:px-4">אופציה</th>
                <th className="px-3 py-3 sm:px-4 whitespace-nowrap">זמן</th>
              </tr>
            </thead>
            <tbody>
              {votes.map((row) => (
                <tr
                  key={row.id ?? `${row.ts}-${row.displayName}-${row.optionId}`}
                  className="border-t border-white/10 odd:bg-white/[0.02] hover:bg-white/[0.05]"
                >
                  <td className="px-3 py-3 font-bold text-white sm:px-4">{row.displayName}</td>
                  <td className="px-3 py-3 text-cyan-200 sm:px-4">{row.optionName}</td>
                  <td className="px-3 py-3 text-slate-400 sm:px-4 whitespace-nowrap">{formatTime(row.ts)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
