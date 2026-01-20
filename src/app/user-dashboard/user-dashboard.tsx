import { useCallback, useEffect, useRef, useState } from "react";
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
  const resultsListRef = useRef<HTMLElement>(null);

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
      setIsLoading(true);
      setHasSearched(true);
      const results = await fetchUsers(query);
      setUsers(results);
      setIsLoading(false);
    },
    [fetchUsers],
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

  const checkScrollPosition = useCallback(() => {
    const element = resultsListRef.current;
    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    setShowTopFade(scrollTop > 0);
    setShowBottomFade(scrollTop + clientHeight < scrollHeight - 1);
  }, []);

  const handleScroll = useCallback(() => {
    checkScrollPosition();
  }, [checkScrollPosition]);

  const filteredUsers = users.filter((user) => activeFilters.includes(user.userRole));

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);

      if (mobile) {
        setView("cards");
      } else {
        setView(desktopView);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [desktopView]);

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

  return (
    <main className={styles.container}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      <a href="/" className={styles.titleLink}>
        <Typography size="Title" as="h1" bold className={styles.title}>
          <span className={styles.titleAccent}>User</span> Dashboard
        </Typography>
      </a>
      <section id="main-content" className={styles.searchSection} aria-label="Search users">
        <SearchInput onSearch={handleSearch} isLoading={isLoading} />
      </section>
      <div className={cn(styles.resultsArea, hasSearched && styles.visible)}>
        <section className={styles.filterSection} aria-label="Filter options">
          <FilterBadges
            allActive={activeFilters.length === ALL_ROLES.length}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
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
