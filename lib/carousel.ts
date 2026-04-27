type CarouselOptions = {
  track: HTMLElement;
  cardCount: number;
  cardWidth: number;
  slideMilliSec: number;
};

export type CarouselControls = {
  cleanup: () => void;
  nextSlide: () => void;
  prevSlide: () => void;
};

export function setupCarousel({
  track,
  cardCount,
  cardWidth,
  slideMilliSec,
}: CarouselOptions): CarouselControls | undefined {
  if (!track) return;

  const originalCards = Array.from(track.children);
  const visibleCards = cardCount;
  let currentIndex = visibleCards;
  let isTransitioning = false;

  originalCards.slice(-visibleCards).forEach((card) => {
    track.insertBefore(card.cloneNode(true), track.firstChild);
  });
  originalCards.slice(0, visibleCards).forEach((card) => {
    track.appendChild(card.cloneNode(true));
  });

  const totalCards = track.children.length;

  track.style.transition = "none";
  track.style.transform = `translateX(-${cardWidth * currentIndex}px)`;

  function moveToIndex(newIndex: number) {
    if (isTransitioning) return;
    isTransitioning = true;

    track.style.transition = "transform 0.5s ease";
    track.style.transform = `translateX(-${cardWidth * newIndex}px)`;
    currentIndex = newIndex;

    const onTransitionEnd = () => {
      isTransitioning = false;
      if (currentIndex <= 0) {
        track.style.transition = "none";
        currentIndex = originalCards.length;
        track.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
      } else if (currentIndex >= totalCards - visibleCards) {
        track.style.transition = "none";
        currentIndex = visibleCards;
        track.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
      }
    };
    track.addEventListener("transitionend", onTransitionEnd, { once: true });
  }

  const intervalId = setInterval(() => moveToIndex(currentIndex + 1), slideMilliSec);

  return {
    cleanup: () => clearInterval(intervalId),
    nextSlide: () => moveToIndex(currentIndex + 1),
    prevSlide: () => moveToIndex(currentIndex - 1),
  };
}
