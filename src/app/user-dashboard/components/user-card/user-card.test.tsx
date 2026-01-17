import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { User } from "../../types";
import { UserCard } from "./user-card";

const mockUser: User = {
  id: "1",
  name: "John",
  surname: "Doe",
  role: "Software Engineer",
  team: "Platform",
  email: "john.doe@example.com",
  userRole: "admin",
  details: "Lorem ipsum dolor sit amet",
};

describe("UserCard", () => {
  it("renders user name", () => {
    render(<UserCard user={mockUser} onViewDetails={vi.fn()} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders user role badge", () => {
    render(<UserCard user={mockUser} onViewDetails={vi.fn()} />);
    expect(screen.getByText("ADMIN")).toBeInTheDocument();
  });

  it("renders user job role", () => {
    render(<UserCard user={mockUser} onViewDetails={vi.fn()} />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders user team", () => {
    render(<UserCard user={mockUser} onViewDetails={vi.fn()} />);
    expect(screen.getByText("Platform")).toBeInTheDocument();
  });

  it("renders user email as link", () => {
    render(<UserCard user={mockUser} onViewDetails={vi.fn()} />);
    const emailLink = screen.getByRole("link", {
      name: /john.doe@example.com/i,
    });
    expect(emailLink).toHaveAttribute("href", "mailto:john.doe@example.com");
  });

  it("calls onViewDetails when View details button is clicked", async () => {
    const onViewDetails = vi.fn();
    const user = userEvent.setup();
    render(<UserCard user={mockUser} onViewDetails={onViewDetails} />);
    await user.click(screen.getByRole("button", { name: /view details/i }));
    expect(onViewDetails).toHaveBeenCalledWith(mockUser);
  });

  it("has proper accessibility attributes", () => {
    render(<UserCard user={mockUser} onViewDetails={vi.fn()} />);
    expect(screen.getByRole("article")).toHaveAttribute("aria-label", "User card for John Doe");
  });

  it("renders different badge variants correctly", () => {
    const guestUser: User = { ...mockUser, userRole: "guest" };
    render(<UserCard user={guestUser} onViewDetails={vi.fn()} />);
    expect(screen.getByText("GUEST")).toBeInTheDocument();
  });
});
