import { type RefObject, useCallback, useState } from "react";

const SCROLL_COLLAPSE_DISTANCE = 150;

type HeaderScrubRefs = {
  containerRef: RefObject<HTMLElement | null>;
  titleLinkRef: RefObject<HTMLAnchorElement | null>;
  searchSectionRef: RefObject<HTMLElement | null>;
};

export const useHeaderScrub = (
  refs: HeaderScrubRefs,
  { isMobile, hasSearched }: { isMobile: boolean; hasSearched: boolean },
) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { containerRef, titleLinkRef, searchSectionRef } = refs;

  const resetHeaderScrub = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--scroll-progress", "0");
    }
    if (titleLinkRef.current) {
      titleLinkRef.current.style.transform = "";
      titleLinkRef.current.style.transformOrigin = "";
    }
    if (searchSectionRef.current) {
      searchSectionRef.current.style.transform = "";
      searchSectionRef.current.style.transformOrigin = "";
    }
    setScrollProgress(0);
  }, [containerRef, titleLinkRef, searchSectionRef]);

  const applyHeaderScrub = useCallback(
    (progress: number) => {
      if (isMobile || !hasSearched) return;

      const container = containerRef.current;
      const titleLink = titleLinkRef.current;
      const searchSection = searchSectionRef.current;
      if (!container || !titleLink || !searchSection) return;

      titleLink.style.transform = "";
      searchSection.style.transform = "";

      if (progress <= 0) return;

      const containerRect = container.getBoundingClientRect();
      const titleRect = titleLink.getBoundingClientRect();
      const searchRect = searchSection.getBoundingClientRect();

      const paddingX = 24;
      const paddingY = 16;

      const titleExpandedFontSize = Number.parseFloat(
        window.getComputedStyle(titleLink).getPropertyValue("font-size") || "48",
      );
      const titleCollapsedFontSize =
        window.innerWidth >= 1280 ? 32 : window.innerWidth >= 1024 ? 28 : 24;
      const titleScaleTarget = Math.min(titleCollapsedFontSize / titleExpandedFontSize, 1);

      const searchScaleTarget = 40 / Math.max(searchRect.height, 1);

      const titleTargetX = containerRect.left + paddingX;
      const titleTargetY = containerRect.top + paddingY;

      const titleDx = (titleTargetX - titleRect.left) * progress;
      const titleDy = (titleTargetY - titleRect.top) * progress;
      const titleScale = 1 - (1 - titleScaleTarget) * progress;

      const searchTargetTop = containerRect.top + paddingY;
      const searchTargetRight = containerRect.right - paddingX;
      const searchScale = 1 - (1 - Math.min(searchScaleTarget, 1)) * progress;
      const searchTargetLeft = searchTargetRight - searchRect.width * searchScale;

      const searchDx = (searchTargetLeft - searchRect.left) * progress;
      const searchDy = (searchTargetTop - searchRect.top) * progress;

      titleLink.style.transformOrigin = "left top";
      searchSection.style.transformOrigin = "left top";

      titleLink.style.transform = `translate3d(${titleDx}px, ${titleDy}px, 0) scale(${titleScale})`;
      searchSection.style.transform = `translate3d(${searchDx}px, ${searchDy}px, 0) scale(${searchScale})`;
    },
    [hasSearched, isMobile, containerRef, titleLinkRef, searchSectionRef],
  );

  const updateScrollProgress = useCallback(
    (scrollTop: number) => {
      if (isMobile || !hasSearched) return;

      const progress = Math.min(scrollTop / SCROLL_COLLAPSE_DISTANCE, 1);
      setScrollProgress(progress);

      if (containerRef.current) {
        containerRef.current.style.setProperty("--scroll-progress", String(progress));
      }

      applyHeaderScrub(progress);
    },
    [isMobile, hasSearched, applyHeaderScrub, containerRef],
  );

  return { scrollProgress, resetHeaderScrub, updateScrollProgress };
};
