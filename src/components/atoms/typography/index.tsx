import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../utils/cn";
import styles from "./typography.module.css";

export const Typography = ({
  size,
  bold,
  italic,
  children,
  as,
  className = "",
  ...rest
}: {
  size: "S" | "M" | "L" | "Title";
  bold?: boolean;
  italic?: boolean;
  children: ReactNode;
  as?: ElementType;
  className?: string;
} & HTMLAttributes<HTMLElement>) => {
  const Component = as || (size === "Title" ? "h1" : "p");
  return (
    <Component
      className={cn(
        styles.typography,
        styles[`size${size}`],
        bold && styles.bold,
        italic && styles.italic,
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};
export default Typography;
