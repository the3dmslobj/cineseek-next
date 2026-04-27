export default function Loading() {
  return (
    <div className="route-fade">
      <section
        className="border-b"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="max-w-400 mx-auto px-5 md:px-8 py-10 md:py-14 grid md:grid-cols-12 gap-8 animate-pulse">
          <div className="md:col-span-4">
            <div
              className="frame p-3 w-full max-w-56 mx-auto md:max-w-none"
              style={{ background: "var(--panel)" }}
            >
              <div
                className="aspect-2/3 w-full frame"
                style={{ background: "var(--bg)" }}
              />
            </div>
          </div>
          <div className="md:col-span-8 flex flex-col gap-4">
            <div className="cap">// fetching entry</div>
            <div className="frame h-8 w-32" style={{ background: "var(--panel)" }} />
            <div className="frame h-16 md:h-24 w-3/4" style={{ background: "var(--panel)" }} />
            <div className="frame h-8 w-1/2" style={{ background: "var(--panel)" }} />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="frame h-7 w-16"
                  style={{ background: "var(--panel)" }}
                />
              ))}
            </div>
            <div
              className="frame h-24 max-w-2xl"
              style={{ background: "var(--panel)" }}
            />
            <div className="flex gap-2">
              <div className="frame h-10 w-24" style={{ background: "var(--panel)" }} />
              <div className="frame h-10 w-32" style={{ background: "var(--panel)" }} />
              <div className="frame h-10 w-20" style={{ background: "var(--panel)" }} />
            </div>
            <div
              className="grid grid-cols-2 md:grid-cols-4 border"
              style={{ borderColor: "var(--line)" }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`p-4 ${i > 0 ? "border-l" : ""}`}
                  style={{ borderColor: "var(--line)" }}
                >
                  <div className="cap mb-2">···</div>
                  <div className="frame h-4 w-3/4" style={{ background: "var(--panel)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-400 mx-auto px-5 md:px-8 py-16">
        <div className="flex items-baseline justify-between mb-5 pb-3 border-b" style={{ borderColor: "var(--line)" }}>
          <div className="flex items-baseline gap-4">
            <span className="cap">§ 01</span>
            <div className="frame h-8 w-24" style={{ background: "var(--panel)" }} />
          </div>
          <span className="cap">[··· ITEMS]</span>
        </div>
        <div className="flex gap-4 overflow-hidden animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="frame p-3 shrink-0"
              style={{ width: 160, background: "var(--panel)" }}
            >
              <div
                className="aspect-3/4 w-full frame"
                style={{ background: "var(--bg)" }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
