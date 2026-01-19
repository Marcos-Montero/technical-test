import styles from "./user-list-skeleton.module.css";

export const UserListSkeleton = () => {
  return (
    <tr className={styles.tableRow}>
      <td className={styles.nameCell}>
        <div className={styles.name} />
      </td>
      <td className={styles.roleCell}>
        <div className={styles.badge} />
      </td>
      <td className={styles.titleCell}>
        <div className={styles.role} />
      </td>
      <td className={styles.teamCell}>
        <div className={styles.team} />
      </td>
      <td className={styles.actionCell}>
        <div className={styles.viewButton} />
      </td>
    </tr>
  );
};
