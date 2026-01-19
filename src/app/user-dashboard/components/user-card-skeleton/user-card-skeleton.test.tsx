import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserCardSkeleton } from "./user-card-skeleton";

describe("UserCardSkeleton", () => {
  it("renders with loading status role", () => {
    render(<UserCardSkeleton />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has aria-busy attribute set to true", () => {
    render(<UserCardSkeleton />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });

  it("has proper aria-label for accessibility", () => {
    render(<UserCardSkeleton />);
    expect(screen.getByLabelText(/loading user card/i)).toBeInTheDocument();
  });

  it("renders skeleton elements", () => {
    const { container } = render(<UserCardSkeleton />);
    const skeletonElements = container.querySelectorAll('[class*="skeleton"]');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });
});
