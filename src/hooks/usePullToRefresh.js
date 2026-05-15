import { useEffect, useRef, useState } from 'react';

/**
 * Hook to add a native-feeling pull-to-refresh interaction for mobile devices.
 * 
 * @param {Function} onRefresh Callback to trigger when refresh threshold is met.
 * @param {number} threshold Distance in px required to trigger a refresh (default: 80)
 * @returns {number} The current pull distance (can be used to animate a spinner)
 */
export function usePullToRefresh(onRefresh, threshold = 80) {
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isPulling = useRef(false);

  useEffect(() => {
    // Only enable on mobile/touch devices
    if (!('ontouchstart' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const handleTouchStart = (e) => {
      // Only initiate pull-to-refresh if we are at the very top of the document
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling.current) return;

      currentY.current = e.touches[0].clientY;
      const distance = currentY.current - startY.current;

      // Only track downward pulling
      if (distance > 0) {
        // Add resistance/friction to the pull
        const pullResisted = Math.min(distance * 0.4, threshold + 20);
        setPullDistance(pullResisted);
        
        // Prevent default scrolling behaviour while pulling down
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling.current) return;
      isPulling.current = false;

      setPullDistance((currentDistance) => {
        if (currentDistance >= threshold) {
          // Trigger the refresh action
          onRefresh();
        }
        return 0; // Reset distance
      });
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    // touchmove cannot be passive if we want to e.preventDefault()
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, threshold]);

  return pullDistance;
}
