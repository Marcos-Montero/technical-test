import { type RefObject, useCallback, useRef, useState } from "react";

const COLLAPSE_THRESHOLD = 50;
const EXPAND_THRESHOLD = 30;

type HeaderScrubRefs = {
  containerRef: RefObject<HTMLElement | null>;
};

export const useHeaderScrub = (
  refs: HeaderScrubRefs,
  { isMobile, hasSearched }: { isMobile: boolean; hasSearched: boolean },
) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lastCollapsedRef = useRef(false);
  const { containerRef } = refs;

  const resetHeaderScrub = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--scroll-progress", "0");
    }
    setIsCollapsed(false);
    lastCollapsedRef.current = false;
  }, [containerRef]);

  const updateScrollProgress = useCallback(
    (scrollTop: number) => {
      if (isMobile || !hasSearched) return;

      const wasCollapsed = lastCollapsedRef.current;
      let shouldCollapse = wasCollapsed;

      if (wasCollapsed && scrollTop < EXPAND_THRESHOLD) {
        shouldCollapse = false;
      } else if (!wasCollapsed && scrollTop > COLLAPSE_THRESHOLD) {
        shouldCollapse = true;
      }

      if (shouldCollapse !== wasCollapsed) {
        lastCollapsedRef.current = shouldCollapse;
        setIsCollapsed(shouldCollapse);

        if (containerRef.current) {
          containerRef.current.style.setProperty("--scroll-progress", shouldCollapse ? "1" : "0");
        }
      }
    },
    [isMobile, hasSearched, containerRef],
  );

  return { scrollProgress: isCollapsed ? 1 : 0, resetHeaderScrub, updateScrollProgress };
};
