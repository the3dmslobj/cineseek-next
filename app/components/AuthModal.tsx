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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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

  const headerLabel = mode === "login" ? "AUTH/SIGNIN.MOD" : "AUTH/REGISTER.MOD";
  const heading = mode === "login" ? "Sign in." : "Create account.";

  return (
    <>
      <div className="modal-bg" onClick={onClose} />
      <div className="modal" role="dialog" ref={ref}>
        <div className="modal-hd">
          <span>{headerLabel}</span>
          <button
            onClick={onClose}
            aria-label="close"
            className="hover:text-[color:var(--accent)]"
            style={{ color: "var(--ink-3)" }}
          >
            [X]
          </button>
        </div>
        <div className="modal-bd">
          <div className="cap mb-2">// status</div>
          <h3 className="display text-3xl mb-3">{heading}</h3>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--ink-2)" }}
          >
            {mode === "login"
              ? "Welcome back. Sign in with your email."
              : "An email and a password. That's all."}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="cap block mb-2">Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
                autoFocus
              />
            </div>
            <div>
              <label className="cap block mb-2">Password</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="≥ 6 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
              />
            </div>
            {error && (
              <div
                className="text-[12px] font-mono"
                style={{ color: "#ff5252" }}
              >
                // ERR: {error}
              </div>
            )}
            <button
              type="submit"
              disabled={busy}
              className="btn btn-primary w-full justify-center disabled:opacity-50"
            >
              {busy ? "..." : mode === "login" ? "Authenticate →" : "Register →"}
            </button>
          </form>
          <div
            className="border-t mt-6 pt-4 text-[12px]"
            style={{ borderColor: "var(--line)", color: "var(--ink-2)" }}
          >
            {mode === "login" ? "New here? " : "Already a member? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError(null);
              }}
              className="ulink"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
