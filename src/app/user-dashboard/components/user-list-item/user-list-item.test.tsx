import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { User } from "../../../types";
import { UserListItem } from "./user-list-item";

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

const renderWithTable = (ui: React.ReactElement) => {
  return render(
    <table>
      <tbody>{ui}</tbody>
    </table>,
  );
};

describe("UserListItem", () => {
  it("renders user name as row header", () => {
    renderWithTable(<UserListItem user={mockUser} onViewDetails={vi.fn()} />);
    expect(screen.getByRole("rowheader")).toHaveTextContent("John Doe");
  });

  it("renders user role badge", () => {
    renderWithTable(<UserListItem user={mockUser} onViewDetails={vi.fn()} />);
    expect(screen.getByText("ADMIN")).toBeInTheDocument();
  });

  it("renders user job role", () => {
    renderWithTable(<UserListItem user={mockUser} onViewDetails={vi.fn()} />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders user team", () => {
    renderWithTable(<UserListItem user={mockUser} onViewDetails={vi.fn()} />);
    expect(screen.getByText("Platform")).toBeInTheDocument();
  });

  it("renders view details button with proper aria-label", () => {
    renderWithTable(<UserListItem user={mockUser} onViewDetails={vi.fn()} />);
    expect(screen.getByRole("button", { name: /view details for john doe/i })).toBeInTheDocument();
  });

  it("calls onViewDetails when button is clicked", async () => {
    const onViewDetails = vi.fn();
    const user = userEvent.setup();
    renderWithTable(<UserListItem user={mockUser} onViewDetails={onViewDetails} />);
    await user.click(screen.getByRole("button"));
    expect(onViewDetails).toHaveBeenCalledWith(mockUser);
  });

  it("renders different badge variants correctly", () => {
    const guestUser: User = { ...mockUser, userRole: "guest" };
    renderWithTable(<UserListItem user={guestUser} onViewDetails={vi.fn()} />);
    expect(screen.getByText("GUEST")).toBeInTheDocument();
  });

  it("uses th element with scope row for name cell", () => {
    renderWithTable(<UserListItem user={mockUser} onViewDetails={vi.fn()} />);
    const rowHeader = screen.getByRole("rowheader");
    expect(rowHeader.tagName).toBe("TH");
    expect(rowHeader).toHaveAttribute("scope", "row");
  });
});
