export default function Loading() {
  return (
    <div
      className="flex flex-col"
      style={{ minHeight: "calc(100dvh - 3.5rem)" }}
    >
      <section
        className="border-b flex flex-col flex-1"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="max-w-400 mx-auto w-full px-5 md:px-8 py-10 md:py-16 flex-1 grid md:grid-cols-12 gap-6">
          <div className="md:col-span-8 flex flex-col gap-4 animate-pulse">
            <div className="cap not-animate">// fetching catalogue</div>
            <div
              className="frame h-16 md:h-24 w-3/4"
              style={{ background: "var(--panel)" }}
            />
            <div
              className="frame h-12 w-1/2"
              style={{ background: "var(--panel)" }}
            />
            <div
              className="frame h-20 max-w-md"
              style={{ background: "var(--panel)" }}
            />
            <div className="flex gap-2 mt-4">
              <div
                className="frame h-8 w-16"
                style={{ background: "var(--panel)" }}
              />
              <div
                className="frame h-8 w-16"
                style={{ background: "var(--panel)" }}
              />
              <div
                className="frame h-8 w-16"
                style={{ background: "var(--panel)" }}
              />
            </div>
            <div className="flex gap-3 mt-auto">
              <div
                className="frame h-10 w-32"
                style={{ background: "var(--panel)" }}
              />
              <div
                className="frame h-10 w-28"
                style={{ background: "var(--panel)" }}
              />
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center md:justify-end animate-pulse">
            <div
              className="frame p-3 w-full max-w-72"
              style={{ background: "var(--panel)" }}
            >
              <div
                className="aspect-2/3 w-full frame"
                style={{ background: "var(--bg)" }}
              />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div
                  className="frame h-8"
                  style={{ background: "var(--bg)" }}
                />
                <div
                  className="frame h-8"
                  style={{ background: "var(--bg)" }}
                />
                <div
                  className="frame h-8"
                  style={{ background: "var(--bg)" }}
                />
                <div
                  className="frame h-8"
                  style={{ background: "var(--bg)" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t" style={{ borderColor: "var(--line)" }}>
          <div className="max-w-400 mx-auto px-5 md:px-8 py-3 flex items-center justify-between">
            <span className="cap">// loading…</span>
            <span className="cap">AUTO-CYCLE 7s</span>
          </div>
        </div>
      </section>
    </div>
  );
}
