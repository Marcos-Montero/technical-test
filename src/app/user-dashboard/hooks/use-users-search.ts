import { useCallback, useRef, useState } from "react";
import mockUsers from "../../mock-users.json";
import type { User } from "../../types";

export const useUsersSearch = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchUsers = useCallback((query: string, signal: AbortSignal): Promise<User[]> => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (signal.aborted) {
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }
        const filteredUsers = (mockUsers as User[]).filter((user) => {
          const fullName = `${user.name} ${user.surname}`.toLowerCase();
          return fullName.includes(query.toLowerCase());
        });
        resolve(filteredUsers);
      }, 1000);

      signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject(new DOMException("Aborted", "AbortError"));
      });
    });
  }, []);

  const search = useCallback(
    async (query: string, onSearchStart?: () => void) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      onSearchStart?.();
      setIsLoading(true);
      setHasSearched(true);

      try {
        const results = await fetchUsers(query, abortController.signal);
        if (!abortController.signal.aborted) {
          setUsers(results);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        throw error;
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [fetchUsers],
  );

  return { users, isLoading, hasSearched, search };
};
