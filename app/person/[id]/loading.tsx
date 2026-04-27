export default function Loading() {
  return (
    <section className="max-w-400 mx-auto px-5 md:px-8 py-12 md:py-16 route-fade">
      <div className="grid md:grid-cols-12 gap-8 animate-pulse">
        <div className="md:col-span-4">
          <div className="frame p-4" style={{ background: "var(--panel)" }}>
            <div
              className="aspect-3/4 w-full frame"
              style={{ background: "var(--bg)" }}
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="frame h-8"
                  style={{ background: "var(--bg)" }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-8 flex flex-col gap-6">
          <div className="cap">// fetching person</div>
          <div className="frame h-16 md:h-24 w-3/4" style={{ background: "var(--panel)" }} />
          <div className="space-y-2 max-w-2xl">
            <div className="frame h-3" style={{ background: "var(--panel)" }} />
            <div className="frame h-3" style={{ background: "var(--panel)" }} />
            <div className="frame h-3 w-5/6" style={{ background: "var(--panel)" }} />
            <div className="frame h-3 w-2/3" style={{ background: "var(--panel)" }} />
          </div>
        </div>
      </div>

      <div className="border-t mt-12 pt-12" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-baseline justify-between mb-5 pb-3 border-b" style={{ borderColor: "var(--line)" }}>
          <div className="flex items-baseline gap-4">
            <span className="cap">§ 01</span>
            <div className="frame h-8 w-32" style={{ background: "var(--panel)" }} />
          </div>
          <span className="cap">[··· ITEMS]</span>
        </div>
        <div className="flex gap-4 overflow-hidden animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="frame p-3 shrink-0"
              style={{ width: 180, background: "var(--panel)" }}
            >
              <div
                className="aspect-2/3 w-full frame"
                style={{ background: "var(--bg)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
