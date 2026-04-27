import Link from "next/link";

const SECTIONS: [string, [string, string][]][] = [
  [
    "Browse",
    [
      ["Home", "/"],
      ["Films", "/results?type=movie&query="],
      ["Series", "/results?type=tv&query="],
    ],
  ],
  [
    "Account",
    [
      ["Profile", "/profile"],
    ],
  ],
];

export default function Footer() {
  return (
    <footer
      className="border-t mt-20"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="max-w-400 mx-auto px-5 md:px-8 py-10 grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-flex items-center justify-center w-6 h-6 font-bold text-[11px]"
              style={{ background: "var(--ink)", color: "var(--bg)" }}
            >
              C
            </span>
            <span className="font-grotesk font-bold">cineseek</span>
          </div>
          <p
            className="text-[12px] max-w-xs"
            style={{ color: "var(--ink-2)" }}
          >
            // a school-project movie database powered by TMDB.
          </p>
        </div>
        {SECTIONS.map(([title, items]) => (
          <div key={title}>
            <div className="cap mb-3">{title}</div>
            <ul className="space-y-1.5 text-[12px]">
              {items.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="hover:text-[color:var(--accent)]"
                    style={{ color: "var(--ink-2)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-400 mx-auto px-5 md:px-8 py-3 flex justify-between items-center">
          <span className="cap">© 2026 CINESEEK</span>
          <span className="cap">// the3dmslobj</span>
        </div>
      </div>
    </footer>
  );
}
