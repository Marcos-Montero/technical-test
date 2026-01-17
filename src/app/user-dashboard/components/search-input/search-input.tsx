import { type KeyboardEvent, useState } from "react";
import { Button } from "../../../../components/atoms/button";
import { cn } from "../../../../utils/cn";
import styles from "./search-input.module.css";

const validateInput = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed === "") {
    return "Search cannot be empty";
  }
  if (!/^[a-zA-Z\s]*$/.test(value)) {
    if (/\d/.test(value)) {
      return "Search cannot contain numbers";
    }
    return "Search can only contain letters and spaces";
  }
  return "";
};

export const SearchInput = ({
  onSearch,
  isLoading = false,
}: {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}) => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (error) {
      setError("");
    }
  };

  const handleClear = () => {
    setQuery("");
    setError("");
  };

  const handleSearch = () => {
    const validationError = validateInput(query);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    onSearch(query);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <label htmlFor="user-search" className={styles.label}>
        Who are you looking for?
      </label>
      <div className={styles.inputWrapper}>
        <div className={styles.inputContainer}>
          <input
            id="user-search"
            type="text"
            className={cn(styles.input, error && styles.inputError)}
            placeholder="Search by name..."
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            aria-label="Search users by name"
            aria-invalid={!!error}
            aria-describedby={error ? "search-error" : undefined}
            disabled={isLoading}
          />
          {query && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              aria-label="Clear search"
              disabled={isLoading}
            >
              ×
            </button>
          )}
        </div>
        <Button
          className={styles.button}
          onClick={handleSearch}
          aria-label="Search"
          disabled={isLoading}
        >
          Search
        </Button>
      </div>
      {error && (
        <span id="search-error" className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
