import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchInput } from "./search-input";

describe("SearchInput", () => {
  it("renders the search input with label", () => {
    render(<SearchInput onSearch={vi.fn()} />);
    expect(screen.getByLabelText(/search users by name/i)).toBeInTheDocument();
    expect(screen.getByText(/who are you looking for/i)).toBeInTheDocument();
  });

  it("renders the search button", () => {
    render(<SearchInput onSearch={vi.fn()} />);
    expect(screen.getByRole("button", { name: /^search$/i })).toBeInTheDocument();
  });

  it("updates input value when typing", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={vi.fn()} />);
    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "John");
    expect(input).toHaveValue("John");
  });

  it("calls onSearch when search button is clicked", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchInput onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "John");
    await user.click(screen.getByRole("button", { name: /^search$/i }));
    expect(onSearch).toHaveBeenCalledWith("John");
  });

  it("calls onSearch when Enter key is pressed", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchInput onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "Jane{Enter}");
    expect(onSearch).toHaveBeenCalledWith("Jane");
  });

  it("disables input and button when isLoading is true", () => {
    render(<SearchInput onSearch={vi.fn()} isLoading={true} />);
    expect(screen.getByPlaceholderText(/search by name/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /^search$/i })).toBeDisabled();
  });

  it("has proper accessibility attributes", () => {
    render(<SearchInput onSearch={vi.fn()} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "user-search");
    expect(screen.getByLabelText(/search users by name/i)).toBeInTheDocument();
  });

  it("shows clear button when input has value", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={vi.fn()} />);
    const input = screen.getByPlaceholderText(/search by name/i);
    expect(screen.queryByRole("button", { name: /clear search/i })).not.toBeInTheDocument();
    await user.type(input, "John");
    expect(screen.getByRole("button", { name: /clear search/i })).toBeInTheDocument();
  });

  it("clears input when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={vi.fn()} />);
    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "John");
    await user.click(screen.getByRole("button", { name: /clear search/i }));
    expect(input).toHaveValue("");
  });

  it("shows error message for empty search", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={vi.fn()} />);
    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "   ");
    await user.click(screen.getByRole("button", { name: /^search$/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/search cannot be empty/i);
  });

  it("shows error message for invalid characters", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={vi.fn()} />);
    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "John123");
    await user.click(screen.getByRole("button", { name: /^search$/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/cannot contain numbers/i);
  });
});
