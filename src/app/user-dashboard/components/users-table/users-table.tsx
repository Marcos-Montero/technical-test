import type { User } from "../../types";
import { UserListItem } from "../user-list-item/user-list-item";
import { UserListSkeleton } from "../user-list-skeleton/user-list-skeleton";
import styles from "./users-table.module.css";

const SKELETON_COUNT = 4;
const SKELETON_KEYS = Array.from({ length: SKELETON_COUNT }, (_, i) => `skeleton-${i}`);

export const UsersTable = ({
  users,
  isLoading,
  onViewDetails,
}: {
  users: User[];
  isLoading: boolean;
  onViewDetails: (user: User) => void;
}) => {
  return (
    <table className={styles.usersTable}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Title</th>
          <th>Team</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {isLoading
          ? SKELETON_KEYS.map((key) => <UserListSkeleton key={key} />)
          : users.map((user) => (
              <UserListItem key={user.id} user={user} onViewDetails={onViewDetails} />
            ))}
      </tbody>
    </table>
  );
};
