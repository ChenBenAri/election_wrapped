/**
 * API לרשימת בחירות משותפת (אופציונלי).
 * דורש Redis מבוסס Upstash (למשל אינטגרציית Redis מ־Vercel Marketplace):
 * UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 * ללא משתנים אלה — מחזיר votes ריק ו־configured: false (האתר ממשיך לעבוד).
 */
import { Redis } from "@upstash/redis";

const VOTES_KEY = "election_wrapped:votes";
const MAX_ENTRIES = 500;

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const redis = getRedis();

  if (!redis) {
    if (req.method === "GET") {
      return res.status(200).json({ ok: true, configured: false, votes: [] });
    }
    if (req.method === "POST") {
      return res.status(200).json({ ok: false, configured: false });
    }
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    if (req.method === "GET") {
      const raw = await redis.lrange(VOTES_KEY, 0, MAX_ENTRIES - 1);
      const votes = [];
      for (const row of raw || []) {
        if (typeof row === "string") {
          try {
            votes.push(JSON.parse(row));
          } catch {
            /* skip corrupt row */
          }
        }
      }
      return res.status(200).json({ ok: true, configured: true, votes });
    }

    if (req.method === "POST") {
      const body =
        typeof req.body === "string"
          ? safeJsonParse(req.body)
          : req.body && typeof req.body === "object"
            ? req.body
            : {};

      const displayName = String(body.displayName ?? "")
        .trim()
        .slice(0, 80);
      const optionId = String(body.optionId ?? "")
        .trim()
        .slice(0, 8);
      const optionName = String(body.optionName ?? "")
        .trim()
        .slice(0, 120);

      if (!displayName || !optionId || !optionName) {
        return res.status(400).json({ ok: false, error: "missing_fields" });
      }

      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        displayName,
        optionId,
        optionName,
        ts: Date.now(),
      };

      await redis.lpush(VOTES_KEY, JSON.stringify(entry));
      await redis.ltrim(VOTES_KEY, 0, MAX_ENTRIES - 1);

      return res.status(200).json({ ok: true, configured: true });
    }
  } catch {
    return res.status(500).json({ ok: false, error: "server_error" });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ ok: false, error: "method_not_allowed" });
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text || "{}");
  } catch {
    return {};
  }
}
