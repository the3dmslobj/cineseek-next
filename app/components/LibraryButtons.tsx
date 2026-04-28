"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import {
  addToLibrary,
  getEntry,
  removeFromLibrary,
  setNote,
  type LibraryStatus,
  type MediaType,
} from "@/lib/library";
import { useAuth } from "./AuthProvider";
import AuthModal from "./AuthModal";

type Props = {
  movieId: number;
  mediaType: MediaType;
};

const NOTE_MAX = 1000;
type SaveState = "idle" | "saving" | "saved" | "error";

export default function LibraryButtons({ movieId, mediaType }: Props) {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<LibraryStatus | null>(null);
  const [note, setNoteText] = useState<string>("");
  const [savedNote, setSavedNote] = useState<string>("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [busy, setBusy] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [bounceSave, setBounceSave] = useState(false);
  const [bounceWatch, setBounceWatch] = useState(false);

  useEffect(() => {
    if (!user) {
      setStatus(null);
      setNoteText("");
      setSavedNote("");
      return;
    }
    getEntry(movieId, mediaType).then((entry) => {
      setStatus(entry?.status ?? null);
      const n = entry?.note ?? "";
      setNoteText(n);
      setSavedNote(n);
    });
  }, [user, movieId, mediaType]);

  const toggle = async (target: LibraryStatus) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setBusy(true);
    if (target === "saved") setBounceSave(true);
    else setBounceWatch(true);
    setTimeout(() => {
      setBounceSave(false);
      setBounceWatch(false);
    }, 350);
    try {
      if (status === target) {
        await removeFromLibrary(movieId, mediaType);
        setStatus(null);
      } else {
        await addToLibrary(movieId, mediaType, target);
        setStatus(target);
      }
    } finally {
      setBusy(false);
    }
  };

  const saveNote = async () => {
    if (!user) return;
    setSaveState("saving");
    try {
      await setNote(movieId, mediaType, note);
      setSavedNote(note.trim());
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1800);
    } catch {
      setSaveState("error");
    }
  };

  if (loading) return null;

  const isSaved = status === "saved";
  const isWatched = status === "watched";
  const noteDirty = note.trim() !== savedNote.trim();

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => toggle("saved")}
          disabled={busy}
          className={`btn ${isSaved ? "btn-primary" : ""} ${bounceSave ? "btn-bounce" : ""} disabled:opacity-50`}
        >
          <FontAwesomeIcon icon={faBookmark} />
          {isSaved ? "In watchlist" : "Watchlist"}
        </button>
        <button
          onClick={() => toggle("watched")}
          disabled={busy}
          className={`btn ${isWatched ? "btn-primary" : ""} ${bounceWatch ? "btn-bounce" : ""} disabled:opacity-50`}
        >
          <FontAwesomeIcon icon={isWatched ? faEye : faEyeSlash} />
          {isWatched ? "Watched" : "Mark watched"}
        </button>
      </div>

      {isWatched && user && (
        <div
          className="frame p-4 mb-8"
          style={{ background: "var(--panel)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="cap">// note</span>
            <span className="cap" style={{ color: "var(--ink-3)" }}>
              {note.length}/{NOTE_MAX}
            </span>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNoteText(e.target.value.slice(0, NOTE_MAX))}
            placeholder="What did you think? Stays private."
            rows={4}
            className="field"
            style={{ resize: "vertical", minHeight: 96 }}
          />
          <div className="flex items-center justify-end gap-3 mt-3">
            {saveState === "saved" && (
              <span className="cap" style={{ color: "var(--accent)" }}>
                ✓ saved
              </span>
            )}
            {saveState === "error" && (
              <span className="cap" style={{ color: "var(--accent)" }}>
                ! couldn&apos;t save
              </span>
            )}
            <button
              onClick={saveNote}
              disabled={!noteDirty || saveState === "saving"}
              className="btn btn-primary disabled:opacity-50"
            >
              {saveState === "saving" ? "Saving…" : "Save note"}
            </button>
          </div>
        </div>
      )}

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
