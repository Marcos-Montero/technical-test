import { type RefObject, useCallback, useState } from "react";

export const useScrollFades = (elementRef: RefObject<HTMLElement | null>) => {
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const checkScrollPosition = useCallback(() => {
    const element = elementRef.current;
    if (!element) return { scrollTop: 0, scrollHeight: 0, clientHeight: 0 };

    const { scrollTop, scrollHeight, clientHeight } = element;
    setShowTopFade(scrollTop > 0);
    setShowBottomFade(scrollTop + clientHeight < scrollHeight - 1);

    return { scrollTop, scrollHeight, clientHeight };
  }, [elementRef]);

  return { showTopFade, showBottomFade, checkScrollPosition };
};
