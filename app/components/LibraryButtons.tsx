"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faEye } from "@fortawesome/free-solid-svg-icons";
import {
  addToLibrary,
  getEntry,
  removeFromLibrary,
  type LibraryStatus,
  type MediaType,
} from "@/lib/library";
import { useAuth } from "./AuthProvider";

type Props = {
  movieId: number;
  mediaType: MediaType;
};

export default function LibraryButtons({ movieId, mediaType }: Props) {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<LibraryStatus | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) {
      setStatus(null);
      return;
    }
    getEntry(movieId, mediaType).then((entry) => setStatus(entry?.status ?? null));
  }, [user, movieId, mediaType]);

  const toggle = async (target: LibraryStatus) => {
    if (!user) {
      alert("Sign in to save movies.");
      return;
    }
    setBusy(true);
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

  return (
    <div className="flex gap-2 my-3">
      <Button
        active={status === "saved"}
        disabled={busy}
        onClick={() => toggle("saved")}
        icon={faBookmark}
        label={status === "saved" ? "Saved" : "Save"}
      />
      <Button
        active={status === "watched"}
        disabled={busy}
        onClick={() => toggle("watched")}
        icon={faEye}
        label={status === "watched" ? "Watched" : "Mark watched"}
      />
    </div>
  );
}

function Button({
  active,
  disabled,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  icon: typeof faBookmark;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={
        "h-8 px-3 rounded text-md font-bold flex items-center gap-2 transition disabled:opacity-50 " +
        (active
          ? "bg-color4 text-color1"
          : "bg-color1 text-color4 hover:bg-color3")
      }
    >
      <FontAwesomeIcon icon={icon} />
      {label}
    </button>
  );
}
