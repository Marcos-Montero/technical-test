import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { User } from "../../types";
import { UsersTable } from "./users-table";

const mockUsers: User[] = [
  {
    id: "1",
    name: "John",
    surname: "Doe",
    role: "Software Engineer",
    team: "Platform",
    email: "john.doe@example.com",
    userRole: "admin",
    details: "Lorem ipsum dolor sit amet",
  },
  {
    id: "2",
    name: "Jane",
    surname: "Smith",
    role: "Product Manager",
    team: "Product",
    email: "jane.smith@example.com",
    userRole: "editor",
    details: "Consectetur adipiscing elit",
  },
];

describe("UsersTable", () => {
  it("renders table headers", () => {
    render(<UsersTable users={[]} isLoading={false} onViewDetails={vi.fn()} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Team")).toBeInTheDocument();
  });

  it("renders skeleton rows when loading", () => {
    const { container } = render(
      <UsersTable users={[]} isLoading={true} onViewDetails={vi.fn()} />,
    );
    const skeletonRows = container.querySelectorAll("tbody tr");
    expect(skeletonRows.length).toBe(4);
  });

  it("renders user rows when not loading", () => {
    render(<UsersTable users={mockUsers} isLoading={false} onViewDetails={vi.fn()} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("calls onViewDetails when user row is clicked", async () => {
    const onViewDetails = vi.fn();
    render(<UsersTable users={mockUsers} isLoading={false} onViewDetails={onViewDetails} />);
    const buttons = screen.getAllByRole("button");
    await buttons[0].click();
    expect(onViewDetails).toHaveBeenCalledWith(mockUsers[0]);
  });

  it("renders empty table when no users provided", () => {
    const { container } = render(
      <UsersTable users={[]} isLoading={false} onViewDetails={vi.fn()} />,
    );
    const userRows = container.querySelectorAll("tbody tr");
    expect(userRows.length).toBe(0);
  });
});
