import { type KeyboardEvent, useEffect, useRef } from "react";
import { Badge } from "../../../../components/atoms/badge";
import { Button } from "../../../../components/atoms/button";
import type { User } from "../../types";
import styles from "./user-modal.module.css";

export const UserModal = ({ user, onClose }: { user: User; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const fullName = `${user.name} ${user.surname}`;

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    return () => {
      previouslyFocusedElement?.focus();
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Tab") {
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={handleKeyDown}
    >
      <div className={styles.modal} ref={modalRef}>
        <Badge variant={user.userRole} className={styles.badge}>
          {user.userRole.toUpperCase()}
        </Badge>
        <h2 id="modal-title" className={styles.name}>
          {fullName}
        </h2>
        <p className={styles.role}>{user.role}</p>
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Team:</p>
          <p className={styles.sectionValue}>{user.team}</p>
        </div>
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Contact information:</p>
          <a href={`mailto:${user.email}`} className={styles.email}>
            {user.email}
          </a>
        </div>
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Other details:</p>
          <p className={styles.details}>{user.details}</p>
        </div>
        <div className={styles.footer}>
          <Button
            ref={closeButtonRef}
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
