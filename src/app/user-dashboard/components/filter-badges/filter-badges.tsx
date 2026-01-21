import { Badge } from "../../../../components/atoms/badge";
import { cn } from "../../../../utils/cn";
import type { UserRole } from "../../../types";
import styles from "./filter-badges.module.css";

const ROLES: UserRole[] = ["admin", "editor", "viewer", "guest", "owner", "inactive"];

export const FilterBadges = ({
  activeFilters,
  onFilterChange,
  allActive,
  isCollapsed = false,
}: {
  activeFilters: UserRole[];
  onFilterChange: (role: UserRole) => void;
  allActive: boolean;
  isCollapsed?: boolean;
}) => {
  const isActive = (role: UserRole) => activeFilters.includes(role);

  return (
    <div className={cn(styles.wrapper, isCollapsed && styles.collapsed)}>
      <fieldset className={styles.container}>
        <legend className={styles.legend}>Filter by:</legend>
        {ROLES.map((role) => (
          <button
            key={role}
            type="button"
            className={cn(
              styles.filterButton,
              !allActive && isActive(role) && styles.active,
              !allActive && !isActive(role) && styles.inactive,
            )}
            onClick={() => onFilterChange(role)}
            aria-pressed={isActive(role)}
            aria-label={`Filter by ${role} role`}
          >
            <Badge
              variant={role}
              className={cn(styles.badge, isCollapsed && styles.collapsedBadge)}
            >
              {role.toUpperCase()}
            </Badge>
          </button>
        ))}
      </fieldset>
    </div>
  );
};
