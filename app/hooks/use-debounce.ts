import { useCallback, useRef } from 'react';

// Define more specific types for the function parameters
export function useDebounce<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  delay: number
): (...args: Args) => void {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );
}
