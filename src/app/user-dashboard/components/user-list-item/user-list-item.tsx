import { Badge } from "../../../../components/atoms/badge";
import { Button } from "../../../../components/atoms/button";
import type { User } from "../../../types";
import styles from "./user-list-item.module.css";

export const UserListItem = ({
  user,
  onViewDetails,
}: {
  user: User;
  onViewDetails: (user: User) => void;
}) => {
  const fullName = `${user.name} ${user.surname}`;

  return (
    <tr className={styles.tableRow}>
      <th scope="row" className={styles.nameCell}>
        <span className={styles.name}>{fullName}</span>
      </th>
      <td className={styles.roleCell}>
        <Badge variant={user.userRole} className={styles.badge}>
          {user.userRole.toUpperCase()}
        </Badge>
      </td>
      <td className={styles.titleCell}>
        <span className={styles.role}>{user.role}</span>
      </td>
      <td className={styles.teamCell}>
        <span className={styles.team}>{user.team}</span>
      </td>
      <td className={styles.actionCell}>
        <Button
          className={styles.viewButton}
          onClick={() => onViewDetails(user)}
          aria-label={`View details for ${fullName}`}
        >
          …
        </Button>
      </td>
    </tr>
  );
};
