import { useState, useRef } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface TouchPosition {
  x: number;
  y: number;
}

export function useSwipe(handlers: SwipeHandlers) {
  const [startTouch, setStartTouch] = useState<TouchPosition | null>(null);
  const timeRef = useRef<number>(0);

  const minSwipeDistance = 50; // Minimum distance for a swipe
  const maxSwipeTime = 500; // Maximum time for a swipe (ms)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartTouch({ x: touch.clientX, y: touch.clientY });
    timeRef.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startTouch) return;

    const touch = e.changedTouches[0];
    const endTouch = { x: touch.clientX, y: touch.clientY };
    const timeDiff = Date.now() - timeRef.current;

    // Check if swipe was fast enough
    if (timeDiff > maxSwipeTime) {
      setStartTouch(null);
      return;
    }

    const diffX = startTouch.x - endTouch.x;
    const diffY = startTouch.y - endTouch.y;

    // Determine swipe direction based on the larger difference
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          // Swipe left
          handlers.onSwipeLeft?.();
        } else {
          // Swipe right
          handlers.onSwipeRight?.();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(diffY) > minSwipeDistance) {
        if (diffY > 0) {
          // Swipe up
          handlers.onSwipeUp?.();
        } else {
          // Swipe down
          handlers.onSwipeDown?.();
        }
      }
    }

    setStartTouch(null);
  };

  const handleTouchCancel = () => {
    setStartTouch(null);
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  };
}
