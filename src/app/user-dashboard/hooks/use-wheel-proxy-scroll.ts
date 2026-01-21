import { type RefObject, useEffect, useRef } from "react";

type UseWheelProxyScrollOptions = {
  enabled: boolean;
  onScrollUpdate: () => void;
};

export const useWheelProxyScroll = (
  containerRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  { enabled, onScrollUpdate }: UseWheelProxyScrollOptions,
) => {
  const pendingWheelDeltaRef = useRef(0);
  const wheelRafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const target = targetRef.current;
    if (!container || !target || !enabled) return;

    const handleWheel = (e: WheelEvent) => {
      if (!targetRef.current) return;

      const eventTarget = e.target as HTMLElement | null;
      const isTypingTarget =
        eventTarget?.closest("input, textarea, [contenteditable='true'], select, option") !== null;
      if (isTypingTarget) return;

      e.preventDefault();

      pendingWheelDeltaRef.current += e.deltaY;

      if (wheelRafRef.current !== null) return;
      wheelRafRef.current = window.requestAnimationFrame(() => {
        const el = targetRef.current;
        if (!el) return;

        const delta = pendingWheelDeltaRef.current;
        pendingWheelDeltaRef.current = 0;

        const maxScrollTop = el.scrollHeight - el.clientHeight;
        el.scrollTop = Math.max(0, Math.min(el.scrollTop + delta, maxScrollTop));
        onScrollUpdate();

        if (wheelRafRef.current !== null) {
          window.cancelAnimationFrame(wheelRafRef.current);
          wheelRafRef.current = null;
        }
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (wheelRafRef.current !== null) {
        window.cancelAnimationFrame(wheelRafRef.current);
        wheelRafRef.current = null;
      }
      pendingWheelDeltaRef.current = 0;
    };
  }, [containerRef, targetRef, enabled, onScrollUpdate]);
};
