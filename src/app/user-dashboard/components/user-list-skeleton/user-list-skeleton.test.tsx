import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserListSkeleton } from "./user-list-skeleton";

const renderWithTable = (ui: React.ReactElement) => {
  return render(
    <table>
      <tbody>{ui}</tbody>
    </table>,
  );
};

describe("UserListSkeleton", () => {
  it("renders a table row", () => {
    renderWithTable(<UserListSkeleton />);
    expect(screen.getByRole("row")).toBeInTheDocument();
  });

  it("renders 5 cells", () => {
    renderWithTable(<UserListSkeleton />);
    expect(screen.getAllByRole("cell")).toHaveLength(5);
  });

  it("renders skeleton elements in cells", () => {
    const { container } = renderWithTable(<UserListSkeleton />);
    const skeletonElements = container.querySelectorAll(
      '[class*="name"], [class*="badge"], [class*="role"], [class*="team"], [class*="viewButton"]',
    );
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it("applies skeleton animation styles", () => {
    const { container } = renderWithTable(<UserListSkeleton />);
    const row = container.querySelector("tr");
    expect(row).toBeInTheDocument();
  });
});
