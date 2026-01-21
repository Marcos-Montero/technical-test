import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { UserRole } from "../../../types";
import { FilterBadges } from "./filter-badges";

describe("FilterBadges", () => {
  const defaultActiveFilters: UserRole[] = ["admin", "editor"];

  it("renders filter by legend", () => {
    render(
      <FilterBadges
        activeFilters={defaultActiveFilters}
        onFilterChange={vi.fn()}
        allActive={false}
      />,
    );
    expect(screen.getByText(/filter by/i)).toBeInTheDocument();
  });

  it("does not render a legend element (uses inline label)", () => {
    const { container } = render(
      <FilterBadges
        activeFilters={defaultActiveFilters}
        onFilterChange={vi.fn()}
        allActive={false}
      />,
    );
    expect(container.querySelector("legend")).toBeNull();
    expect(screen.getByText(/filter by/i)).toBeInTheDocument();
  });

  it("renders all role badges", () => {
    render(
      <FilterBadges
        activeFilters={defaultActiveFilters}
        onFilterChange={vi.fn()}
        allActive={false}
      />,
    );
    expect(screen.getByText("ADMIN")).toBeInTheDocument();
    expect(screen.getByText("EDITOR")).toBeInTheDocument();
    expect(screen.getByText("VIEWER")).toBeInTheDocument();
    expect(screen.getByText("GUEST")).toBeInTheDocument();
    expect(screen.getByText("OWNER")).toBeInTheDocument();
    expect(screen.getByText("INACTIVE")).toBeInTheDocument();
  });

  it("calls onFilterChange when a badge is clicked", async () => {
    const onFilterChange = vi.fn();
    const user = userEvent.setup();
    render(
      <FilterBadges
        activeFilters={defaultActiveFilters}
        onFilterChange={onFilterChange}
        allActive={false}
      />,
    );
    await user.click(screen.getByRole("button", { name: /filter by viewer/i }));
    expect(onFilterChange).toHaveBeenCalledWith("viewer");
  });

  it("shows active filters with aria-pressed true", () => {
    render(<FilterBadges activeFilters={["admin"]} onFilterChange={vi.fn()} allActive={false} />);
    expect(screen.getByRole("button", { name: /filter by admin/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows inactive filters with aria-pressed false", () => {
    render(<FilterBadges activeFilters={["admin"]} onFilterChange={vi.fn()} allActive={false} />);
    expect(screen.getByRole("button", { name: /filter by editor/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("has proper group role for accessibility", () => {
    render(
      <FilterBadges
        activeFilters={defaultActiveFilters}
        onFilterChange={vi.fn()}
        allActive={false}
      />,
    );
    expect(screen.getByRole("group")).toHaveAttribute("aria-label", "Filter users by role");
  });

  it("applies active styles only when allActive is false", () => {
    const { rerender } = render(
      <FilterBadges activeFilters={["admin"]} onFilterChange={vi.fn()} allActive={true} />,
    );
    const adminButton = screen.getByRole("button", { name: /filter by admin/i });
    expect(adminButton.className).not.toContain("active");

    rerender(<FilterBadges activeFilters={["admin"]} onFilterChange={vi.fn()} allActive={false} />);
    expect(adminButton.className).toContain("active");
  });

  it("renders when isCollapsed is true", () => {
    render(
      <FilterBadges
        activeFilters={defaultActiveFilters}
        onFilterChange={vi.fn()}
        allActive={false}
        isCollapsed={true}
      />,
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
  });
});
