import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import { cn } from "../../../utils/cn";
import styles from "./button.module.css";

export const Button = forwardRef<
  HTMLButtonElement,
  {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
  } & ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, disabled, ...rest }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(styles.button, disabled && styles.disabled, className)}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
