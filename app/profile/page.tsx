"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Avatar from "@/app/components/Avatar";
import LibraryGrid from "@/app/components/LibraryGrid";
import { useAuth } from "@/app/components/AuthProvider";
import { listLibrary } from "@/lib/library";

type Tab = "saved" | "watched";

function emailToName(email: string | undefined) {
  if (!email) return "user";
  return email.split("@")[0];
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("saved");
  const [savedCount, setSavedCount] = useState(0);
  const [watchedCount, setWatchedCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    listLibrary("saved").then((rows) => setSavedCount(rows.length));
    listLibrary("watched").then((rows) => setWatchedCount(rows.length));
  }, [user]);

  if (loading || !user) {
    return (
      <>
        <Navbar />
        <div className="cap text-center mt-20">// loading...</div>
      </>
    );
  }

  const username = emailToName(user.email);
  const since = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <>
      <Navbar />

      <section className="max-w-400 mx-auto px-5 md:px-8 py-12 md:py-16">
        <div
          className="border-b pb-8 mb-10 grid md:grid-cols-12 gap-6 items-end"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="md:col-span-2">
            <Avatar name={username} size={120} />
          </div>
          <div className="md:col-span-7">
            <div className="cap mb-2">
              USER · MEMBER SINCE {since.toUpperCase()}
            </div>
            <h1 className="display text-[clamp(40px,7vw,108px)] break-words">
              {username}
            </h1>
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
                <div className="cap mb-1">Watchlist</div>
                <div className="display text-3xl text-accent">{savedCount}</div>
              </div>
              <div className="p-3">
                <div className="cap mb-1">Watched</div>
                <div className="display text-3xl text-accent">
                  {watchedCount}
                </div>
              </div>
            </div>
            <button
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
              className="btn"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              Sign out
            </button>
          </div>
        </div>

        <div
          className="flex gap-0 mb-8 border-b"
          style={{ borderColor: "var(--line)" }}
        >
          {(
            [
              ["saved", "Watchlist", savedCount],
              ["watched", "Watched", watchedCount],
            ] as const
          ).map(([key, label, n]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="px-5 py-3 cap"
              style={{
                color: tab === key ? "var(--ink)" : "var(--ink-3)",
                borderBottom:
                  tab === key
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                marginBottom: "-1px",
              }}
            >
              {label} [{String(n).padStart(2, "0")}]
            </button>
          ))}
        </div>

        {tab === "saved" ? (
          <LibraryGrid
            status="saved"
            emptyText="Tap the bookmark on any film or series to add it to your watchlist."
            emptyHeading="Watchlist is empty."
          />
        ) : (
          <LibraryGrid
            status="watched"
            emptyText="Tap the eye icon on anything you've watched to log it."
            emptyHeading="No screenings logged."
          />
        )}

        <div
          className="mt-10 pt-6 border-t flex justify-between items-center"
          style={{ borderColor: "var(--line)" }}
        >
          <span className="cap">{user.email}</span>
          <Link href="/" className="cap ulink">
            ← Back home
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
