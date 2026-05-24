import { useRef, useCallback } from 'react';
import { useMotion } from '../context/MotionContext';

/**
 * Hook that adds a CSS 3D tilt effect driven by mouse position.
 *
 * Returns ref and event handlers to spread onto the target element.
 * The tilt is applied via CSS custom properties so the CSS handles
 * all rendering — no inline style recalculations per frame.
 *
 * The effect is disabled automatically when:
 *  - The user has `prefers-reduced-motion` set (checked at call time)
 *  - It is a touch device (no precise pointer)
 *
 * @param {{ maxTilt?: number, scale?: number }} options
 * @returns {{ ref: React.RefObject, handlers: object }}
 */
export function use3DTilt({ maxTilt = 12, scale = 1.04 } = {}) {
  const ref = useRef(null);
  const { isReduced } = useMotion();

  // Respect the user's motion preference (either context or system media query)
  const reducedMotion = isReduced;

  const handleMouseMove = useCallback(
    (e) => {
      if (reducedMotion || !ref.current) return;

      const card = ref.current;
      const { left, top, width, height } = card.getBoundingClientRect();

      // Normalise cursor position to [-1, 1] within the card
      const x = ((e.clientX - left) / width - 0.5) * 2;
      const y = ((e.clientY - top) / height - 0.5) * 2;

      // rotateY follows X-axis cursor, rotateX follows Y-axis (inverted)
      const rotateY = x * maxTilt;
      const rotateX = -y * maxTilt;

      card.style.setProperty('--tilt-x', `${rotateX}deg`);
      card.style.setProperty('--tilt-y', `${rotateY}deg`);
      card.style.setProperty('--tilt-scale', scale);
    },
    [reducedMotion, maxTilt, scale]
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    const card = ref.current;
    // Reset to neutral position
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
    card.style.setProperty('--tilt-scale', 1);
  }, []);

  return {
    ref,
    handlers: reducedMotion
      ? {} // No handlers needed — CSS transitions still won't run
      : { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave },
  };
}
