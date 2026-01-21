import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import Typography from "../../components/atoms/typography";
import { cn } from "../../utils/cn";
import mockUsers from "../mock-users.json";
import type { User, UserRole } from "../types";
import { FilterBadges } from "./components/filter-badges/filter-badges";
import { SearchInput } from "./components/search-input/search-input";
import { UserCard } from "./components/user-card/user-card";
import { UserCardSkeleton } from "./components/user-card-skeleton/user-card-skeleton";
import { UserModal } from "./components/user-modal/user-modal";
import { UsersTable } from "./components/users-table/users-table";
import { ViewToggle } from "./components/view-toggle/view-toggle";
import styles from "./user-dashboard.module.css";

type ViewType = "list" | "cards";

const ALL_ROLES: UserRole[] = ["admin", "editor", "viewer", "guest", "owner", "inactive"];

const SKELETON_COUNT = 8;
const SKELETON_KEYS = Array.from({ length: SKELETON_COUNT }, (_, i) => `skeleton-${i}`);

const MOBILE_BREAKPOINT = 768;
const SCROLL_COLLAPSE_DISTANCE = 150;

export const UserDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilters, setActiveFilters] = useState<UserRole[]>(ALL_ROLES);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const [view, setView] = useState<ViewType>("cards");
  const [isMobile, setIsMobile] = useState(false);
  const [desktopView, setDesktopView] = useState<ViewType>("cards");
  const [scrollProgress, setScrollProgress] = useState(0);
  const resultsListRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const titleLinkRef = useRef<HTMLAnchorElement>(null);
  const searchSectionRef = useRef<HTMLElement>(null);
  const pendingWheelDeltaRef = useRef(0);
  const wheelRafRef = useRef<number | null>(null);

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
  }, []);

  const fetchUsers = useCallback((query: string): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredUsers = (mockUsers as User[]).filter((user) => {
          const fullName = `${user.name} ${user.surname}`.toLowerCase();
          return fullName.includes(query.toLowerCase());
        });
        resolve(filteredUsers);
      }, 1000);
    });
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      if (resultsListRef.current) {
        resultsListRef.current.scrollTop = 0;
      }
      resetHeaderScrub();

      setIsLoading(true);
      setHasSearched(true);
      const results = await fetchUsers(query);
      setUsers(results);
      setIsLoading(false);
    },
    [fetchUsers, resetHeaderScrub],
  );

  const handleFilterChange = useCallback((role: UserRole) => {
    setActiveFilters((prev) => {
      const allActive = prev.length === ALL_ROLES.length;

      if (allActive) {
        return [role];
      }

      const isActive = prev.includes(role);

      if (isActive) {
        const newFilters = prev.filter((r) => r !== role);
        return newFilters.length === 0 ? ALL_ROLES : newFilters;
      }

      return [...prev, role];
    });
  }, []);

  const handleViewDetails = useCallback((user: User) => {
    setSelectedUser(user);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedUser(null);
  }, []);

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
    [hasSearched, isMobile],
  );

  const checkScrollPosition = useCallback(() => {
    const element = resultsListRef.current;
    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    setShowTopFade(scrollTop > 0);
    setShowBottomFade(scrollTop + clientHeight < scrollHeight - 1);

    if (!isMobile && hasSearched) {
      const progress = Math.min(scrollTop / SCROLL_COLLAPSE_DISTANCE, 1);
      setScrollProgress(progress);

      if (containerRef.current) {
        containerRef.current.style.setProperty("--scroll-progress", String(progress));
      }

      applyHeaderScrub(progress);
    }
  }, [isMobile, hasSearched, applyHeaderScrub]);

  const handleScroll = useCallback(() => {
    checkScrollPosition();
  }, [checkScrollPosition]);

  useEffect(() => {
    const container = containerRef.current;
    const results = resultsListRef.current;
    if (!container || !results) return;

    if (!hasSearched || isMobile || selectedUser) return;

    const handleWheel = (e: WheelEvent) => {
      if (!resultsListRef.current) return;

      const target = e.target as HTMLElement | null;
      const isTypingTarget =
        target?.closest("input, textarea, [contenteditable='true'], select, option") !== null;
      if (isTypingTarget) return;

      e.preventDefault();

      pendingWheelDeltaRef.current += e.deltaY;

      if (wheelRafRef.current !== null) return;
      wheelRafRef.current = window.requestAnimationFrame(() => {
        const el = resultsListRef.current;
        if (!el) return;

        const delta = pendingWheelDeltaRef.current;
        pendingWheelDeltaRef.current = 0;

        const maxScrollTop = el.scrollHeight - el.clientHeight;
        el.scrollTop = Math.max(0, Math.min(el.scrollTop + delta, maxScrollTop));
        checkScrollPosition();

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
  }, [checkScrollPosition, hasSearched, isMobile, selectedUser]);

  const filteredUsers = users.filter((user) => activeFilters.includes(user.userRole));

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);

      if (mobile) {
        setView("cards");
        resetHeaderScrub();
      } else {
        setView(desktopView);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [desktopView, resetHeaderScrub]);

  useEffect(() => {
    if (isMobile || !hasSearched) {
      resetHeaderScrub();
    }
  }, [hasSearched, isMobile, resetHeaderScrub]);

  const handleViewChange = useCallback(
    (newView: ViewType) => {
      if (!isMobile) {
        setDesktopView(newView);
        setView(newView);
      }
    },
    [isMobile],
  );

  useEffect(() => {
    if (hasSearched) {
      setTimeout(() => {
        checkScrollPosition();
      }, 100);
    }
  }, [hasSearched, checkScrollPosition]);

  const canCollapse = hasSearched && !isMobile;
  const isFullyCollapsed = canCollapse && scrollProgress >= 1;

  return (
    <main
      ref={containerRef}
      className={cn(styles.container, canCollapse && styles.collapsible)}
      style={{ "--scroll-progress": scrollProgress } as CSSProperties}
    >
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      <div className={styles.header}>
        <a ref={titleLinkRef} href="/" className={styles.titleLink}>
          <Typography size="Title" as="h1" bold className={styles.title}>
            <span className={styles.titleAccent}>User</span> Dashboard
          </Typography>
        </a>
        <section
          ref={searchSectionRef}
          id="main-content"
          className={styles.searchSection}
          aria-label="Search users"
        >
          <SearchInput onSearch={handleSearch} isLoading={isLoading} isCollapsed={isFullyCollapsed} />
        </section>
      </div>
      <div className={cn(styles.resultsArea, hasSearched && styles.visible)}>
        <section className={styles.filterSection} aria-label="Filter options">
          <FilterBadges
            allActive={activeFilters.length === ALL_ROLES.length}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            isCollapsed={isFullyCollapsed}
          />
        </section>
        <div className={styles.viewControls}>
          <Typography size="S" as="span" role="status" aria-live="polite" aria-atomic="true">
            {!isLoading && `Found ${filteredUsers.length} users`}
          </Typography>
          {!isMobile && <ViewToggle view={view} onViewChange={handleViewChange} />}
        </div>
        <section
          ref={resultsListRef}
          className={cn(
            styles.resultsList,
            showTopFade && styles.showTopFade,
            showBottomFade && styles.showBottomFade,
          )}
          onScroll={handleScroll}
          aria-label="Search results"
        >
          {isLoading && view === "cards" && (
            <div className={styles.cardsGrid}>
              {SKELETON_KEYS.map((key) => (
                <UserCardSkeleton key={key} />
              ))}
            </div>
          )}

          {isLoading && view === "list" && (
            <UsersTable users={[]} isLoading={true} onViewDetails={handleViewDetails} />
          )}

          {!isLoading && filteredUsers.length === 0 && (
            <Typography size="S" as="p" italic>
              No users found matching your criteria.
            </Typography>
          )}

          {!isLoading && filteredUsers.length > 0 && view === "cards" && (
            <div className={styles.cardsGrid}>
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} onViewDetails={handleViewDetails} />
              ))}
            </div>
          )}

          {!isLoading && filteredUsers.length > 0 && view === "list" && (
            <UsersTable users={filteredUsers} isLoading={false} onViewDetails={handleViewDetails} />
          )}
        </section>
      </div>
      {selectedUser && <UserModal user={selectedUser} onClose={handleCloseModal} />}
    </main>
  );
};
