import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UserDashboard } from "./user-dashboard";

describe("UserDashboard", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    window.innerWidth = 1280;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the title with accent text", () => {
    render(<UserDashboard />);
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<UserDashboard />);
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
  });

  it("does not show filters before search", () => {
    render(<UserDashboard />);
    const resultsArea = screen.queryByText(/filter by/i)?.closest('[class*="resultsArea"]');
    expect(resultsArea).not.toHaveClass("visible");
  });

  it("shows skeleton cards while loading", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UserDashboard />);

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "ar");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    expect(screen.getAllByRole("status", { name: /loading user card/i })).toHaveLength(8);
  });

  it("shows results after loading completes", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UserDashboard />);

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "George");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    await waitFor(() => {
      expect(screen.getByText("George Harris")).toBeInTheDocument();
    });
  });

  it("shows filter badges after search", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UserDashboard />);

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "ar");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    await waitFor(() => {
      expect(screen.getByText(/filter by/i)).toBeInTheDocument();
    });
  });

  it("clicking a filter when all active selects only that filter", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UserDashboard />);

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "ar");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    await waitFor(() => {
      expect(screen.getByText(/filter by/i)).toBeInTheDocument();
    });

    const adminFilter = screen.getByRole("button", { name: /filter by admin/i });
    const editorFilter = screen.getByRole("button", { name: /filter by editor/i });

    await user.click(adminFilter);

    expect(adminFilter).toHaveAttribute("aria-pressed", "true");
    expect(editorFilter).toHaveAttribute("aria-pressed", "false");
  });

  it("clicking inactive filter adds it to active filters", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UserDashboard />);

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "ar");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    await waitFor(() => {
      expect(screen.getByText(/filter by/i)).toBeInTheDocument();
    });

    const adminFilter = screen.getByRole("button", { name: /filter by admin/i });
    const editorFilter = screen.getByRole("button", { name: /filter by editor/i });

    await user.click(adminFilter);
    await user.click(editorFilter);

    expect(adminFilter).toHaveAttribute("aria-pressed", "true");
    expect(editorFilter).toHaveAttribute("aria-pressed", "true");
  });

  it("clicking last active filter resets all filters to active", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UserDashboard />);

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "ar");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    await waitFor(() => {
      expect(screen.getByText(/filter by/i)).toBeInTheDocument();
    });

    const adminFilter = screen.getByRole("button", { name: /filter by admin/i });
    const editorFilter = screen.getByRole("button", { name: /filter by editor/i });

    await user.click(adminFilter);
    await user.click(adminFilter);

    expect(adminFilter).toHaveAttribute("aria-pressed", "true");
    expect(editorFilter).toHaveAttribute("aria-pressed", "true");
  });

  it("opens modal when View details is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UserDashboard />);

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "George");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    await waitFor(() => {
      expect(screen.getByText("George Harris")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /view details for george harris/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/other details/i)).toBeInTheDocument();
  });

  it("closes modal when Close button is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UserDashboard />);

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "George");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    await waitFor(() => {
      expect(screen.getByText("George Harris")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /view details for george harris/i }));

    const modal = screen.getByRole("dialog");
    const closeButton = within(modal).getByRole("button", { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("shows no results message when no users match", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UserDashboard />);

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "xyz");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument();
    });
  });

  it("has proper accessibility with live region for results", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UserDashboard />);

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "ar");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    await waitFor(() => {
      const liveRegion = screen.getByRole("status", { name: "" });
      expect(liveRegion).toHaveAttribute("aria-live", "polite");
    });
  });

  it("searches when Enter key is pressed", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<UserDashboard />);

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "Arianna{Enter}");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    await waitFor(() => {
      expect(screen.getByText("Arianna Russo")).toBeInTheDocument();
    });
  });

  it("proxies wheel scrolling on the page into the results list (desktop)", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    const rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 1;
      });
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    const { container } = render(<UserDashboard />);

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "a");
    await user.click(screen.getByRole("button", { name: /^search$/i }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    const main = container.querySelector("main");
    const results = screen.getByRole("region", { name: /search results/i }) as HTMLElement;
    expect(main).toBeTruthy();

    Object.defineProperty(results, "scrollHeight", { value: 2000, configurable: true });
    Object.defineProperty(results, "clientHeight", { value: 500, configurable: true });
    results.scrollTop = 0;

    fireEvent.wheel(main as HTMLElement, { deltaY: 120 });

    expect(results.scrollTop).toBe(120);

    rafSpy.mockRestore();
    cancelSpy.mockRestore();
  });

  it("updates scroll progress and header transforms when results scroll", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { container } = render(<UserDashboard />);

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "a");
    await user.click(screen.getByRole("button", { name: /^search$/i }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    const main = container.querySelector("main") as HTMLElement;
    const titleLink = container.querySelector('a[href="/"]') as HTMLAnchorElement;
    const results = screen.getByRole("region", { name: /search results/i }) as HTMLElement;

    results.scrollTop = 75;
    fireEvent.scroll(results);

    expect(main.style.getPropertyValue("--scroll-progress")).not.toBe("");
    expect(titleLink.style.transform).not.toBe("");
  });

  it("clears header transforms when switching to mobile", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { container } = render(<UserDashboard />);

    const input = screen.getByPlaceholderText(/search by name/i);
    await user.type(input, "a");
    await user.click(screen.getByRole("button", { name: /^search$/i }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    const main = container.querySelector("main") as HTMLElement;
    const titleLink = container.querySelector('a[href="/"]') as HTMLAnchorElement;
    const results = screen.getByRole("region", { name: /search results/i }) as HTMLElement;

    results.scrollTop = 150;
    fireEvent.scroll(results);

    expect(titleLink.style.transform).not.toBe("");

    window.innerWidth = 375;
    fireEvent(window, new Event("resize"));

    expect(titleLink.style.transform).toBe("");
    expect(main.style.getPropertyValue("--scroll-progress")).toBe("0");
  });
});
