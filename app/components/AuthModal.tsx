"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";

type Mode = "login" | "signup";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const fn = mode === "login" ? signIn : signUp;
    const { error } = await fn(email, password);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    onClose();
  };

  return (
    <div
      ref={ref}
      className="absolute top-14 right-0 w-72 bg-color1 z-20 rounded-lg p-4 shadow-lg"
    >
      <div className="text-color4 font-bold text-lg mb-3">
        {mode === "login" ? "Log in" : "Sign up"}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 px-3 rounded bg-color5 text-color4 placeholder-color3 border border-color3 focus:outline-none focus:border-color2"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password (6+ chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-10 px-3 rounded bg-color5 text-color4 placeholder-color3 border border-color3 focus:outline-none focus:border-color2"
        />
        {error && <div className="text-sm text-red-400">{error}</div>}
        <button
          type="submit"
          disabled={busy}
          className="h-10 rounded bg-color4 text-color1 font-bold mt-1 disabled:opacity-50"
        >
          {busy ? "..." : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setError(null);
        }}
        className="text-sm text-color2 hover:text-color4 mt-3 w-full text-center"
      >
        {mode === "login"
          ? "Need an account? Sign up"
          : "Already have one? Log in"}
      </button>
    </div>
  );
}
