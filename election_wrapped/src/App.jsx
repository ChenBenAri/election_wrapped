import { PostCreative } from "./components/PostCreative";

export default function App() {
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#f0f2f5] text-slate-900 sm:static sm:min-h-screen sm:overflow-visible">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 120% 80% at 50% -20%, rgba(255,255,255,0.7), transparent 55%)",
        }}
        aria-hidden
      />

      <main className="relative z-10 mx-auto flex h-full w-full max-w-lg min-h-0 flex-col sm:h-auto sm:px-5 sm:py-10" dir="rtl">
        <section className="flex h-full min-h-0 flex-1 flex-col sm:flex-none">
          <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden sm:rounded-xl sm:bg-white sm:p-3 sm:shadow-sm sm:ring-1 sm:ring-black/[0.06]">
            <div className="h-full min-h-0 overflow-hidden sm:aspect-[2/3] sm:min-h-[32rem] sm:rounded-2xl sm:flex-none">
              <PostCreative compact />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
