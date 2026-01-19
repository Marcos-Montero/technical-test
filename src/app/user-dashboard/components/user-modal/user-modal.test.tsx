import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { User } from "../../../types";
import { UserModal } from "./user-modal";

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

describe("UserModal", () => {
  it("renders user name", () => {
    render(<UserModal user={mockUser} onClose={vi.fn()} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders user role badge", () => {
    render(<UserModal user={mockUser} onClose={vi.fn()} />);
    expect(screen.getByText("ADMIN")).toBeInTheDocument();
  });

  it("renders user job role", () => {
    render(<UserModal user={mockUser} onClose={vi.fn()} />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders user team", () => {
    render(<UserModal user={mockUser} onClose={vi.fn()} />);
    expect(screen.getByText("Platform")).toBeInTheDocument();
  });

  it("renders user email as link", () => {
    render(<UserModal user={mockUser} onClose={vi.fn()} />);
    const emailLink = screen.getByRole("link", {
      name: /john.doe@example.com/i,
    });
    expect(emailLink).toHaveAttribute("href", "mailto:john.doe@example.com");
  });

  it("renders user details", () => {
    render(<UserModal user={mockUser} onClose={vi.fn()} />);
    expect(screen.getByText("Lorem ipsum dolor sit amet")).toBeInTheDocument();
  });

  it("calls onClose when Close button is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<UserModal user={mockUser} onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when Escape key is pressed", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<UserModal user={mockUser} onClose={onClose} />);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when clicking on the overlay", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<UserModal user={mockUser} onClose={onClose} />);
    const dialog = screen.getByRole("dialog");
    await user.click(dialog);
    expect(onClose).toHaveBeenCalled();
  });

  it("has proper dialog role and aria attributes", () => {
    render(<UserModal user={mockUser} onClose={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
  });

  it("focuses the close button on mount", () => {
    render(<UserModal user={mockUser} onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: /close/i })).toHaveFocus();
  });

  it("traps focus - Tab from last element focuses first element", async () => {
    const user = userEvent.setup();
    render(<UserModal user={mockUser} onClose={vi.fn()} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    const emailLink = screen.getByRole("link", { name: /john.doe@example.com/i });

    closeButton.focus();
    await user.tab();

    expect(emailLink).toHaveFocus();

    await user.tab();

    expect(closeButton).toHaveFocus();
  });

  it("traps focus - Shift+Tab from first element focuses last element", async () => {
    const user = userEvent.setup();
    render(<UserModal user={mockUser} onClose={vi.fn()} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    const emailLink = screen.getByRole("link", { name: /john.doe@example.com/i });

    emailLink.focus();
    await user.tab({ shift: true });

    expect(closeButton).toHaveFocus();
  });

  it("restores focus to previously focused element on unmount", () => {
    const previousButton = document.createElement("button");
    previousButton.textContent = "Previous";
    document.body.appendChild(previousButton);
    previousButton.focus();

    const { unmount } = render(<UserModal user={mockUser} onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: /close/i })).toHaveFocus();

    unmount();

    expect(previousButton).toHaveFocus();

    document.body.removeChild(previousButton);
  });
});
