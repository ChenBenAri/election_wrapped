/**
 * שלוש אופציות הקריאייטיב לבדיקת העדפה (A/B/C).
 * כל אופציה מקושרת ל־variant שמייצג את עיצוב הכרטיס ב־PostCreative (תוכן סטטי, ללא שם משתמש).
 */
export const CREATIVE_OPTIONS = [
  { id: "A", name: "סקירת ערכים", variant: "values" },
  { id: "B", name: "התאמה לפרופיל", variant: "profile" },
  { id: "C", name: "מפת הבחירות האישית", variant: "map" },
];

export function resolveDisplayName(rawName) {
  const t = rawName.trim();
  return t.length > 0 ? t : "השם שלך";
}
