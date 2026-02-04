import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import ExperienceForm from "@/components/builder-screen/forms/experience-form";
import { useSyncResume } from "@/hooks/use-sync-resume";

// Mock dependencies
const mockDispatch = vi.fn();
vi.mock("@/stores/store", () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock("@/hooks/use-sync-resume");

const mockSync = vi.fn().mockResolvedValue(true);
const initialExperience = [
  {
    id: "1",
    company: "Tech Corp",
    position: "Senior Developer",
    description: "<p>Worked on cool stuff</p>",
    startDate: "2020-01-01",
    endDate: "2024-01-01",
    resumeId: "123",
  },
];

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock("@shared/ui/components/date-picker", () => ({
  DatePicker: ({ date, setDate, placeholder }: any) => (
    <input
      data-testid="date-picker"
      value={date ? new Date(date).toISOString().split("T")[0] : ""}
      onChange={(e) => setDate(new Date(e.target.value))}
      placeholder={placeholder}
    />
  ),
}));

vi.mock("@/components/builder-screen/editor", () => ({
  default: ({ value, onChange }: any) => (
    <textarea
      data-testid="mock-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// Mock dnd-kit components
vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: any) => <div>{children}</div>,
  useSensor: vi.fn(),
  useSensors: vi.fn(),
  PointerSensor: vi.fn(),
  KeyboardSensor: vi.fn(),
  closestCenter: vi.fn(),
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: any) => <div>{children}</div>,
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
  verticalListSortingStrategy: {},
  arrayMove: vi.fn(),
  sortableKeyboardCoordinates: vi.fn(),
}));

describe("ExperienceForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    vi.mocked(useSyncResume).mockReturnValue({
      sync: mockSync,
      isSyncing: false,
      resume: {
        id: "123",
        workExperiences: initialExperience,
      },
    });
  });

  it("renders correctly with initial data", () => {
    render(<ExperienceForm />);

    expect(screen.getByDisplayValue("Tech Corp")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Senior Developer")).toBeInTheDocument();
    expect(screen.getByTestId("mock-editor")).toHaveValue(
      "<p>Worked on cool stuff</p>",
    );
  });

  it("updates experience fields", async () => {
    render(<ExperienceForm />);
    const user = userEvent.setup();

    const companyInput = screen.getByDisplayValue("Tech Corp");
    await user.clear(companyInput);
    await user.type(companyInput, "New Corp");

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("adds a new experience item", async () => {
    render(<ExperienceForm />);
    const user = userEvent.setup();

    const addButton = screen.getByText("Add Experience");
    await user.click(addButton);

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("validates required fields before submitting", async () => {
    // Override mock for this test
    vi.mocked(useSyncResume).mockReturnValue({
      sync: mockSync,
      isSyncing: false,
      resume: {
        id: "123",
        workExperiences: [
          {
            id: "1",
            company: "",
            position: "",
            description: "",
            startDate: "",
            endDate: null,
            resumeId: "123",
          },
        ],
      },
    });

    render(<ExperienceForm onNext={vi.fn()} />);
    const user = userEvent.setup();

    const nextButton = screen.getByText("Next");
    await user.click(nextButton);

    expect(mockSync).not.toHaveBeenCalled();
    expect(screen.getByText("Company name is required")).toBeInTheDocument();
    expect(screen.getByText("Job title is required")).toBeInTheDocument();
  });

  it("submits successfully when data is valid", async () => {
    const onNextMock = vi.fn();
    render(<ExperienceForm onNext={onNextMock} />);
    const user = userEvent.setup();

    const nextButton = screen.getByText("Next");
    await user.click(nextButton);

    await waitFor(() => {
      expect(mockSync).toHaveBeenCalled();
      expect(onNextMock).toHaveBeenCalled();
    });
  });
});
