/**
 * שלוש אופציות הקריאייטיב לבדיקת העדפה (1/2/3).
 * סדר תצוגה: 1=פרופיל (לשעבר B), 2=מפה (לשעבר C), 3=ערכים (לשעבר A).
 */
export const CREATIVE_OPTIONS = [
  { id: "1", name: "התאמה לפרופיל", variant: "profile" },
  { id: "2", name: "מפת הבחירות האישית", variant: "map" },
  { id: "3", name: "סקירת ערכים", variant: "values" },
];

export function resolveDisplayName(rawName) {
  const t = rawName.trim();
  return t.length > 0 ? t : "השם שלך";
}
