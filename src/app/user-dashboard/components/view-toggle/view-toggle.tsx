import { CardsIcon } from "./icons/cards-icon";
import { CheckIcon } from "./icons/check-icon";
import { ListIcon } from "./icons/list-icon";
import styles from "./view-toggle.module.css";

type ViewType = "list" | "cards";

export const ViewToggle = ({
  view,
  onViewChange,
}: {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}) => {
  const isListActive = view === "list";
  const isCardsActive = view === "cards";

  return (
    <fieldset className={styles.toggle} aria-label="Toggle view mode">
      <legend className={styles.srOnly}>View mode</legend>
      <button
        type="button"
        className={`${styles.toggleButton} ${styles.leftButton} ${isListActive ? styles.active : ""}`}
        onClick={() => onViewChange("list")}
        aria-pressed={isListActive}
        aria-label="List view"
      >
        {isListActive && <CheckIcon isActive />}
        <ListIcon isActive={isListActive} />
      </button>
      <button
        type="button"
        className={`${styles.toggleButton} ${styles.rightButton} ${isCardsActive ? styles.active : ""}`}
        onClick={() => onViewChange("cards")}
        aria-pressed={isCardsActive}
        aria-label="Cards view"
      >
        {isCardsActive && <CheckIcon isActive />}
        <CardsIcon isActive={isCardsActive} />
      </button>
    </fieldset>
  );
};
