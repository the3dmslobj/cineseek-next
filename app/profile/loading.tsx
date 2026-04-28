export default function Loading() {
  return (
    <section className="max-w-400 mx-auto px-5 md:px-8 py-12 md:py-16 route-fade animate-pulse">
      <div
        className="border-b pb-8 mb-10 grid md:grid-cols-12 gap-6 items-end"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="md:col-span-2">
          <div
            className="frame"
            style={{ width: 120, height: 120, background: "var(--panel)" }}
          />
        </div>
        <div className="md:col-span-7 flex flex-col gap-3">
          <div className="cap">// fetching profile</div>
          <div
            className="frame h-16 md:h-20 w-2/3"
            style={{ background: "var(--panel)" }}
          />
        </div>
        <div className="md:col-span-3 flex flex-col gap-2">
          <div
            className="grid grid-cols-2 border"
            style={{ borderColor: "var(--line)" }}
          >
            <div
              className="p-3 border-r"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="cap mb-2">Watchlist</div>
              <div
                className="frame h-8 w-12"
                style={{ background: "var(--panel)" }}
              />
            </div>
            <div className="p-3">
              <div className="cap mb-2">Watched</div>
              <div
                className="frame h-8 w-12"
                style={{ background: "var(--panel)" }}
              />
            </div>
          </div>
          <div
            className="frame h-10"
            style={{ background: "var(--panel)" }}
          />
        </div>
      </div>

      <div
        className="flex gap-0 mb-8 border-b"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="px-5 py-3">
          <span className="cap">Watchlist [··]</span>
        </div>
        <div className="px-5 py-3">
          <span className="cap">Watched [··]</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="frame p-3"
            style={{ background: "var(--panel)" }}
          >
            <div
              className="aspect-2/3 w-full frame"
              style={{ background: "var(--bg)" }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
