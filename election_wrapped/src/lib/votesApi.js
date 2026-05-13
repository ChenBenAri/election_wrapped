/** קריאות ל־/api/votes — עובד בפריסת Vercel; ב־npm run dev מקומי לרוב לא קיים API */

export async function fetchVotes() {
  const res = await fetch("/api/votes", { method: "GET", headers: { Accept: "application/json" } });
  if (!res.ok) return { ok: false, configured: false, votes: [] };
  const data = await res.json();
  return {
    ok: Boolean(data?.ok),
    configured: Boolean(data?.configured),
    votes: Array.isArray(data?.votes) ? data.votes : [],
  };
}

export async function submitVote({ displayName, optionId, optionName }) {
  const res = await fetch("/api/votes", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ displayName, optionId, optionName }),
  });
  if (!res.ok) return { ok: false };
  const data = await res.json().catch(() => ({}));
  return { ok: Boolean(data?.ok) };
}
