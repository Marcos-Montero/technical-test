import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./index";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Click me</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button onClick={onClick} disabled>
        Click me
      </Button>,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies disabled attribute when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("forwards ref to button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Click me</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("passes through additional HTML attributes", () => {
    render(
      <Button data-testid="custom-button" type="submit">
        Submit
      </Button>,
    );
    const button = screen.getByTestId("custom-button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("supports aria attributes for accessibility", () => {
    render(
      <Button aria-label="Custom action" aria-describedby="description">
        Action
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Custom action");
    expect(button).toHaveAttribute("aria-describedby", "description");
  });

  it("renders as button element by default", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button").tagName).toBe("BUTTON");
  });

  it("applies disabled styles when disabled", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button").className).toContain("disabled");
  });
});
