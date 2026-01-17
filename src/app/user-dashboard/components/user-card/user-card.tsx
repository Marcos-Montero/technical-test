import { Badge } from "../../../../components/atoms/badge";
import { Button } from "../../../../components/atoms/button";
import type { User } from "../../../types";
import styles from "./user-card.module.css";

export const UserCard = ({
  user,
  onViewDetails,
}: {
  user: User;
  onViewDetails: (user: User) => void;
}) => {
  const fullName = `${user.name} ${user.surname}`;

  return (
    <article className={styles.card} aria-label={`User card for ${fullName}`}>
      <div className={styles.header}>
        <Badge variant={user.userRole} className={styles.badge}>
          {user.userRole.toUpperCase()}
        </Badge>
        <h3 className={styles.name}>{fullName}</h3>
        <p className={styles.role}>{user.role}</p>
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Team:</p>
          <p className={styles.sectionValue}>{user.team}</p>
        </div>
      </div>
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Contact information:</p>
        <a href={`mailto:${user.email}`} className={styles.email}>
          {user.email}
        </a>
      </div>
      <Button
        className={styles.viewButton}
        onClick={() => onViewDetails(user)}
        aria-label={`View details for ${fullName}`}
      >
        View details
      </Button>
    </article>
  );
};
