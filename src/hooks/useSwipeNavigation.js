import { useRef, useCallback } from 'react';

/**
 * Detects horizontal swipe gestures on a target element and fires
 * onSwipeLeft / onSwipeRight callbacks.
 *
 * - Minimum swipe distance (threshold): 50px to avoid false positives
 * - Maximum vertical drift: 80px so diagonal scrolls aren't captured
 * - Automatically disabled when prefers-reduced-motion is set
 *
 * Returns a ref to spread onto the target element, plus touch handlers.
 *
 * @param {{ onSwipeLeft?: Function, onSwipeRight?: Function, threshold?: number }} opts
 * @returns {{ ref: React.RefObject, handlers: object }}
 */
export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
} = {}) {
  const touchStart = useRef(null);

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;
      touchStart.current = null;

      // Ignore if the vertical movement is too large (user is scrolling)
      if (Math.abs(dy) > 80) return;
      // Ignore if the horizontal movement is below threshold
      if (Math.abs(dx) < threshold) return;

      if (dx < 0 && onSwipeLeft) {
        onSwipeLeft();   // swiped left → next Pokémon
      } else if (dx > 0 && onSwipeRight) {
        onSwipeRight();  // swiped right → previous Pokémon
      }
    },
    [onSwipeLeft, onSwipeRight, threshold]
  );

  // If reduced motion is on, skip all gesture handling
  if (reducedMotion) {
    return { handlers: {} };
  }

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
  };
}
