/** אופציית הקריאייטיב היחידה */
export const CREATIVE_OPTIONS = [
  { id: "1", name: "מפת הבחירות האישית", variant: "map" },
];

export function resolveDisplayName(rawName) {
  const t = rawName.trim();
  return t.length > 0 ? t : "השם שלך";
}
