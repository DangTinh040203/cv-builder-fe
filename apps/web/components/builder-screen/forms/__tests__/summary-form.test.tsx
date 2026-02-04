import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import SummaryForm from "@/components/builder-screen/forms/summary-form";

// Mock dependencies
vi.mock("@/stores/store", () => ({
  useAppDispatch: () => vi.fn(),
}));

vi.mock("@/hooks/use-sync-resume", () => ({
  useSyncResume: () => ({
    sync: vi.fn().mockResolvedValue(true),
    isSyncing: false,
    resume: {
      overview: "<p>Test summary</p>",
    },
  }),
}));

vi.mock("@/components/builder-screen/editor", () => ({
  default: ({ value, onChange, placeholder }: any) => (
    <textarea
      data-testid="mock-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("SummaryForm", () => {
  it("renders correctly with initial data", () => {
    render(<SummaryForm />);
    expect(screen.getAllByText("Professional Summary").length).toBeGreaterThan(
      0,
    );
    expect(screen.getByTestId("mock-editor")).toHaveValue(
      "<p>Test summary</p>",
    );
  });

  it("updates value when editor changes", () => {
    const { getByTestId } = render(<SummaryForm />);
    const editor = getByTestId("mock-editor");

    fireEvent.change(editor, { target: { value: "New summary content" } });

    expect(editor).toHaveValue("New summary content");
  });

  it("calls sync when next button is clicked", async () => {
    const onNextMock = vi.fn();
    render(<SummaryForm onNext={onNextMock} onBack={vi.fn()} />);

    // Find the Next button (assuming it's rendered by BuilderNavigation)
    // Note: You might need to adjust this selector based on actual BuilderNavigation implementation
    // For now, looking for "Next" text or button
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(onNextMock).toHaveBeenCalled();
    });
  });
});
