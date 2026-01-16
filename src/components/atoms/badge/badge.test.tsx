import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./index";

describe("Badge", () => {
  it("renders children correctly", () => {
    render(<Badge variant="admin">Admin</Badge>);
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders admin variant", () => {
    render(<Badge variant="admin">Admin Badge</Badge>);
    const element = screen.getByText("Admin Badge");
    expect(element).toBeInTheDocument();
    expect(element.className).toContain("badgeAdmin");
  });

  it("renders editor variant", () => {
    render(<Badge variant="editor">Editor Badge</Badge>);
    const element = screen.getByText("Editor Badge");
    expect(element.className).toContain("badgeEditor");
  });

  it("renders viewer variant", () => {
    render(<Badge variant="viewer">Viewer Badge</Badge>);
    const element = screen.getByText("Viewer Badge");
    expect(element.className).toContain("badgeViewer");
  });

  it("renders guest variant", () => {
    render(<Badge variant="guest">Guest Badge</Badge>);
    const element = screen.getByText("Guest Badge");
    expect(element.className).toContain("badgeGuest");
  });

  it("renders owner variant", () => {
    render(<Badge variant="owner">Owner Badge</Badge>);
    const element = screen.getByText("Owner Badge");
    expect(element.className).toContain("badgeOwner");
  });

  it("renders inactive variant", () => {
    render(<Badge variant="inactive">Inactive Badge</Badge>);
    const element = screen.getByText("Inactive Badge");
    expect(element.className).toContain("badgeInactive");
  });

  it("applies custom className alongside default styles", () => {
    render(
      <Badge variant="admin" className="custom-class">
        Custom Badge
      </Badge>,
    );
    const element = screen.getByText("Custom Badge");
    expect(element).toHaveClass("custom-class");
    expect(element.className).toContain("badgeAdmin");
  });

  it("passes through additional HTML attributes", () => {
    render(
      <Badge variant="editor" data-testid="custom-badge" id="my-badge">
        With attributes
      </Badge>,
    );
    const element = screen.getByTestId("custom-badge");
    expect(element).toHaveAttribute("id", "my-badge");
  });

  it("supports aria attributes for accessibility", () => {
    render(
      <Badge variant="viewer" aria-label="Viewer role badge" role="status">
        Viewer
      </Badge>,
    );
    const element = screen.getByLabelText("Viewer role badge");
    expect(element).toBeInTheDocument();
  });

  it("renders as span element by default", () => {
    render(<Badge variant="admin">Admin</Badge>);
    const element = screen.getByText("Admin");
    expect(element.tagName).toBe("SPAN");
  });
});
