import { cn } from "../../../../utils/cn";
import styles from "./user-card-skeleton.module.css";

export const UserCardSkeleton = () => {
  return (
    <output className={styles.card} aria-label="Loading user card" aria-busy="true">
      <div className={cn(styles.skeleton, styles.badge)} />
      <div className={cn(styles.skeleton, styles.name)} />
      <div className={cn(styles.skeleton, styles.role)} />
      <div className={cn(styles.skeleton, styles.label)} />
      <div className={cn(styles.skeleton, styles.value)} />
      <div className={cn(styles.skeleton, styles.label)} />
      <div className={cn(styles.skeleton, styles.emailValue)} />
      <div className={cn(styles.skeleton, styles.button)} />
    </output>
  );
};
