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
  type LibraryStatus,
  type MediaType,
} from "@/lib/library";
import { useAuth } from "./AuthProvider";
import AuthModal from "./AuthModal";

type Props = {
  movieId: number;
  mediaType: MediaType;
};

export default function LibraryButtons({ movieId, mediaType }: Props) {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<LibraryStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [bounceSave, setBounceSave] = useState(false);
  const [bounceWatch, setBounceWatch] = useState(false);

  useEffect(() => {
    if (!user) {
      setStatus(null);
      return;
    }
    getEntry(movieId, mediaType).then((entry) =>
      setStatus(entry?.status ?? null),
    );
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

  if (loading) return null;

  const isSaved = status === "saved";
  const isWatched = status === "watched";

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => toggle("saved")}
          disabled={busy}
          className={`btn ${isSaved ? "btn-primary" : ""} ${bounceSave ? "btn-bounce" : ""} disabled:opacity-50`}
        >
          <FontAwesomeIcon icon={faBookmark} />
          {isSaved ? "Saved" : "Save"}
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
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
