import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import Typography from "../../components/atoms/typography";
import { cn } from "../../utils/cn";
import type { User, UserRole } from "../types";
import { FilterBadges } from "./components/filter-badges/filter-badges";
import { SearchInput } from "./components/search-input/search-input";
import { UserCard } from "./components/user-card/user-card";
import { UserCardSkeleton } from "./components/user-card-skeleton/user-card-skeleton";
import { UserModal } from "./components/user-modal/user-modal";
import { UsersTable } from "./components/users-table/users-table";
import { ViewToggle } from "./components/view-toggle/view-toggle";
import {
  useHeaderScrub,
  useIsMobile,
  useScrollFades,
  useUsersSearch,
  useWheelProxyScroll,
} from "./hooks";
import styles from "./user-dashboard.module.css";

type ViewType = "list" | "cards";

const ALL_ROLES: UserRole[] = ["admin", "editor", "viewer", "guest", "owner", "inactive"];

const SKELETON_COUNT = 8;
const SKELETON_KEYS = Array.from({ length: SKELETON_COUNT }, (_, i) => `skeleton-${i}`);

export const UserDashboard = () => {
  const [activeFilters, setActiveFilters] = useState<UserRole[]>(ALL_ROLES);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewType>("cards");
  const [desktopView, setDesktopView] = useState<ViewType>("cards");

  const resultsListRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const isMobile = useIsMobile();
  const { users, isLoading, hasSearched, search } = useUsersSearch();
  const { showTopFade, showBottomFade, checkScrollPosition } = useScrollFades(resultsListRef);
  const { scrollProgress, resetHeaderScrub, updateScrollProgress } = useHeaderScrub(
    { containerRef },
    { isMobile, hasSearched },
  );

  const handleScrollUpdate = useCallback(() => {
    const { scrollTop } = checkScrollPosition();
    updateScrollProgress(scrollTop);
  }, [checkScrollPosition, updateScrollProgress]);

  useWheelProxyScroll(containerRef, resultsListRef, {
    enabled: hasSearched && !isMobile && !selectedUser,
    onScrollUpdate: handleScrollUpdate,
  });

  const handleSearch = useCallback(
    (query: string) => {
      search(query, () => {
        if (resultsListRef.current) {
          resultsListRef.current.scrollTop = 0;
        }
        resetHeaderScrub();
      });
    },
    [search, resetHeaderScrub],
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
    if (isMobile) {
      setView("cards");
      resetHeaderScrub();
    } else {
      setView(desktopView);
    }
  }, [isMobile, desktopView, resetHeaderScrub]);

  useEffect(() => {
    if (isMobile || !hasSearched) {
      resetHeaderScrub();
    }
  }, [hasSearched, isMobile, resetHeaderScrub]);

  useEffect(() => {
    if (hasSearched) {
      const timeoutId = setTimeout(() => {
        handleScrollUpdate();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [hasSearched, handleScrollUpdate]);

  const filteredUsers = users.filter((user) => activeFilters.includes(user.userRole));
  const canCollapse = hasSearched && !isMobile;
  const isFullyCollapsed = canCollapse && scrollProgress >= 1;

  return (
    <main
      ref={containerRef}
      className={cn(styles.container, canCollapse && styles.collapsible)}
      style={{ "--scroll-progress": scrollProgress } as CSSProperties}
    >
      <a href="#results-content" className={styles.skipLink}>
        Skip to main content
      </a>
      <div className={cn(styles.header, isFullyCollapsed && styles.headerCollapsed)}>
        <a href="/" className={styles.titleLink}>
          <Typography size="Title" as="h1" bold className={styles.title}>
            <span className={styles.titleAccent}>User</span> Dashboard
          </Typography>
        </a>
        <section className={styles.searchSection} aria-label="Search users">
          <SearchInput
            onSearch={handleSearch}
            isLoading={isLoading}
            isCollapsed={isFullyCollapsed}
          />
        </section>
      </div>
      <div id="results-content" className={cn(styles.resultsArea, hasSearched && styles.visible)}>
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
          onScroll={handleScrollUpdate}
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
