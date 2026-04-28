export default function Loading() {
  return (
    <section className="max-w-400 mx-auto px-5 md:px-8 py-12 md:py-16 route-fade animate-pulse">
      <div
        className="border-b pb-6 mb-8"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="cap mb-3">// watch next</div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div
            className="frame h-16 md:h-20 w-1/2"
            style={{ background: "var(--panel)" }}
          />
          <span className="cap">[··· RESULTS]</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <div
          className="frame h-7 w-20"
          style={{ background: "var(--panel)" }}
        />
        <div
          className="frame h-7 w-20"
          style={{ background: "var(--panel)" }}
        />
      </div>

      <div
        className="frame p-4 md:p-5 mb-8"
        style={{ background: "var(--panel)" }}
      >
        <div className="cap mb-2">// mood</div>
        <div className="flex flex-wrap gap-2 mb-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="frame h-7 w-20"
              style={{ background: "var(--bg)" }}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="cap mb-1">···</div>
              <div
                className="frame h-10"
                style={{ background: "var(--bg)" }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 18 }).map((_, i) => (
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
