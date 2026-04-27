import { useEffect, useRef, useState } from "react";

type UseCarouselOptions = {
  itemCount: number;
  intervalMs: number;
  enabled?: boolean;
};

export function useCarousel({ itemCount, intervalMs, enabled = true }: UseCarouselOptions) {
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (!enabled || itemCount <= 1) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setIndex((i) => (i + 1) % itemCount);
    }, intervalMs);
    return () => clearInterval(id);
  }, [itemCount, intervalMs, enabled]);

  const next = () => setIndex((i) => (i + 1) % itemCount);
  const prev = () => setIndex((i) => (i - 1 + itemCount) % itemCount);

  return { index, next, prev, pausedRef };
}
