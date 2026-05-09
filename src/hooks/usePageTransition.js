import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook that wraps navigation with the browser's View Transitions API.
 * Falls back to a normal navigation if the API is not supported.
 *
 * Usage:
 *   const navigate = usePageTransition();
 *   navigate('/pokemon/1');
 */
export function usePageTransition() {
  const navigate = useNavigate();

  const transitionNavigate = useCallback(
    (to, options) => {
      // Progressive enhancement: only use View Transitions if supported
      if (!document.startViewTransition) {
        navigate(to, options);
        return;
      }

      document.startViewTransition(() => {
        navigate(to, options);
      });
    },
    [navigate]
  );

  return transitionNavigate;
}
