export default function Loading() {
  return (
    <section className="max-w-400 mx-auto px-5 md:px-8 py-12 md:py-16 route-fade animate-pulse">
      <div
        className="border-b pb-6 mb-8"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="cap mb-3">// query</div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div
            className="frame h-16 md:h-20 w-1/2"
            style={{ background: "var(--panel)" }}
          />
          <span className="cap">[··· RESULTS]</span>
        </div>
      </div>
      <div className="flex gap-2 mb-8">
        <div
          className="frame h-7 w-20"
          style={{ background: "var(--panel)" }}
        />
        <div
          className="frame h-7 w-20"
          style={{ background: "var(--panel)" }}
        />
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
