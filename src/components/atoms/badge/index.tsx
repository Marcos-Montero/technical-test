import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../utils/cn";
import styles from "./badge.module.css";

type BadgeVariant = "admin" | "editor" | "viewer" | "guest" | "owner" | "inactive";

export const Badge = ({
  variant,
  children,
  className = "",
  ...rest
}: {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLSpanElement>) => {
  const variantClass = `badge${variant.charAt(0).toUpperCase()}${variant.slice(1)}`;

  return (
    <span className={cn(styles.badge, styles[variantClass], className)} {...rest}>
      {children}
    </span>
  );
};
