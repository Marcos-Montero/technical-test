import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Typography } from "./index";

describe("Typography", () => {
  it("renders children correctly", () => {
    render(<Typography size="M">Hello World</Typography>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders size L with p element by default", () => {
    render(<Typography size="L">Large text</Typography>);
    const element = screen.getByText("Large text");
    expect(element.tagName).toBe("P");
  });

  it("renders size M with p element by default", () => {
    render(<Typography size="M">Medium text</Typography>);
    const element = screen.getByText("Medium text");
    expect(element.tagName).toBe("P");
  });

  it("renders size S with p element by default", () => {
    render(<Typography size="S">Small text</Typography>);
    const element = screen.getByText("Small text");
    expect(element.tagName).toBe("P");
  });

  it("applies bold style when bold prop is true", () => {
    render(
      <Typography size="M" bold>
        Bold text
      </Typography>,
    );
    const element = screen.getByText("Bold text");
    expect(element.className).toContain("bold");
  });

  it("applies italic style when italic prop is true", () => {
    render(
      <Typography size="M" italic>
        Italic text
      </Typography>,
    );
    const element = screen.getByText("Italic text");
    expect(element.className).toContain("italic");
  });

  it("applies both bold and italic styles when both props are true", () => {
    render(
      <Typography size="M" bold italic>
        Bold italic text
      </Typography>,
    );
    const element = screen.getByText("Bold italic text");
    expect(element.className).toContain("bold");
    expect(element.className).toContain("italic");
  });

  it("does not apply bold style when bold prop is false or omitted", () => {
    render(<Typography size="M">Regular text</Typography>);
    const element = screen.getByText("Regular text");
    expect(element.className).not.toContain("bold");
  });

  it("does not apply italic style when italic prop is false or omitted", () => {
    render(<Typography size="M">Regular text</Typography>);
    const element = screen.getByText("Regular text");
    expect(element.className).not.toContain("italic");
  });

  it("allows overriding the element with as prop", () => {
    render(
      <Typography size="L" as="h1">
        Custom heading
      </Typography>,
    );
    const element = screen.getByRole("heading", { level: 1 });
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("Custom heading");
  });

  it("allows rendering as span for inline text", () => {
    render(
      <Typography size="S" as="span">
        Inline text
      </Typography>,
    );
    const element = screen.getByText("Inline text");
    expect(element.tagName).toBe("SPAN");
  });

  it("allows rendering as label for form labels", () => {
    render(
      <Typography size="M" as="label">
        Form label
      </Typography>,
    );
    const element = screen.getByText("Form label");
    expect(element.tagName).toBe("LABEL");
  });

  it("applies custom className alongside default styles", () => {
    render(
      <Typography size="L" className="custom-class">
        Custom styled
      </Typography>,
    );
    const element = screen.getByText("Custom styled");
    expect(element).toHaveClass("custom-class");
  });

  it("passes through additional HTML attributes", () => {
    render(
      <Typography size="M" data-testid="custom-typography" id="my-text">
        With attributes
      </Typography>,
    );
    const element = screen.getByTestId("custom-typography");
    expect(element).toHaveAttribute("id", "my-text");
  });

  it("supports aria attributes for accessibility", () => {
    render(
      <Typography size="L" aria-label="Section title" role="heading">
        Accessible title
      </Typography>,
    );
    const element = screen.getByLabelText("Section title");
    expect(element).toBeInTheDocument();
  });
});
