import { Badge } from "../../../../components/atoms/badge";
import { cn } from "../../../../utils/cn";
import type { UserRole } from "../../../types";
import styles from "./filter-badges.module.css";

const ROLES: UserRole[] = ["admin", "editor", "viewer", "guest", "owner", "inactive"];

export const FilterBadges = ({
  activeFilters,
  onFilterChange,
  allActive,
}: {
  activeFilters: UserRole[];
  onFilterChange: (role: UserRole) => void;
  allActive: boolean;
}) => {
  const isActive = (role: UserRole) => activeFilters.includes(role);

  return (
    <fieldset className={styles.container} aria-label="Filter users by role">
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
          <Badge variant={role} className={styles.badge}>
            {role.toUpperCase()}
          </Badge>
        </button>
      ))}
    </fieldset>
  );
};
