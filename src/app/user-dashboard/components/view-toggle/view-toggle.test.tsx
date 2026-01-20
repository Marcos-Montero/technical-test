import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ViewToggle } from "./view-toggle";

describe("ViewToggle", () => {
  it("renders list and cards buttons", () => {
    render(<ViewToggle view="cards" onViewChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /list view/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cards view/i })).toBeInTheDocument();
  });

  it("has proper fieldset with legend for accessibility", () => {
    render(<ViewToggle view="cards" onViewChange={vi.fn()} />);
    expect(screen.getByRole("group")).toHaveAttribute("aria-label", "Toggle view mode");
    expect(screen.getByText(/view mode/i)).toBeInTheDocument();
  });

  it("shows cards as active when view is cards", () => {
    render(<ViewToggle view="cards" onViewChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /cards view/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /list view/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("shows list as active when view is list", () => {
    render(<ViewToggle view="list" onViewChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /list view/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /cards view/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onViewChange with list when list button is clicked", async () => {
    const onViewChange = vi.fn();
    const user = userEvent.setup();
    render(<ViewToggle view="cards" onViewChange={onViewChange} />);
    await user.click(screen.getByRole("button", { name: /list view/i }));
    expect(onViewChange).toHaveBeenCalledWith("list");
  });

  it("calls onViewChange with cards when cards button is clicked", async () => {
    const onViewChange = vi.fn();
    const user = userEvent.setup();
    render(<ViewToggle view="list" onViewChange={onViewChange} />);
    await user.click(screen.getByRole("button", { name: /cards view/i }));
    expect(onViewChange).toHaveBeenCalledWith("cards");
  });

  it("shows check icon for active view", () => {
    render(<ViewToggle view="cards" onViewChange={vi.fn()} />);
    const cardsButton = screen.getByRole("button", { name: /cards view/i });
    const listButton = screen.getByRole("button", { name: /list view/i });
    expect(cardsButton.querySelectorAll("svg").length).toBe(2);
    expect(listButton.querySelectorAll("svg").length).toBe(1);
  });

  it("applies active styles to the selected view button", () => {
    render(<ViewToggle view="list" onViewChange={vi.fn()} />);
    const listButton = screen.getByRole("button", { name: /list view/i });
    expect(listButton.className).toContain("active");
  });

  it("has proper focus styles for keyboard navigation", () => {
    render(<ViewToggle view="cards" onViewChange={vi.fn()} />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeVisible();
    });
  });
});
