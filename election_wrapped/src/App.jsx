import { CREATIVE_OPTIONS } from "./data/options";
import { PostCreative } from "./components/PostCreative";

export default function App() {
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

      <main className="relative z-10 mx-auto w-full max-w-[96rem] px-3 py-10 sm:px-5 lg:px-6" dir="rtl">
        <header className="text-center">
          <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-6xl sm:leading-tight">
            בחירות 2026 WRAPPED
          </h1>
        </header>

        <section className="mt-10 sm:mt-12">
          <h2 className="sr-only">שלוש אופציות קריאייטיב</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-4 lg:gap-5">
            {CREATIVE_OPTIONS.map((option) => (
              <article
                key={option.id}
                className="flex flex-col rounded-xl bg-white p-2 shadow-sm ring-1 ring-black/[0.06] sm:p-3"
              >
                <div className="mb-2 px-1 sm:mb-3">
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                    אופציה {option.id}
                  </span>
                </div>

                <div className="aspect-[2/3] w-full min-h-[28rem] overflow-hidden rounded-2xl sm:min-h-[32rem] lg:min-h-[36rem]">
                  <PostCreative variant={option.variant} compact />
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
