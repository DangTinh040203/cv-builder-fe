import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import EducationForm from "@/components/builder-screen/forms/education-form";
import { useSyncResume } from "@/hooks/use-sync-resume";

// Mock dependencies
const mockDispatch = vi.fn();
vi.mock("@/stores/store", () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock("@/hooks/use-sync-resume");

const mockSync = vi.fn().mockResolvedValue(true);
const initialEducation = [
  {
    id: "1",
    school: "Test University",
    degree: "Bachelor",
    major: "Computer Science",
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

describe("EducationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    vi.mocked(useSyncResume).mockReturnValue({
      sync: mockSync,
      isSyncing: false,
      resume: {
        id: "123",
        educations: initialEducation,
      },
    });
  });

  it("renders correctly with initial data", () => {
    render(<EducationForm />);

    expect(screen.getByDisplayValue("Test University")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bachelor")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Computer Science")).toBeInTheDocument();
  });

  it("updates education fields", async () => {
    render(<EducationForm />);
    const user = userEvent.setup();

    const schoolInput = screen.getByDisplayValue("Test University");
    await user.clear(schoolInput);
    await user.type(schoolInput, "New University");

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("adds a new education item", async () => {
    render(<EducationForm />);
    const user = userEvent.setup();

    const addButton = screen.getByText("Add Education");
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
        educations: [
          {
            id: "1",
            school: "",
            degree: "",
            major: "",
            startDate: "",
            endDate: null,
            resumeId: "123",
          },
        ],
      },
    });

    render(<EducationForm onNext={vi.fn()} />);
    const user = userEvent.setup();

    const nextButton = screen.getByText("Next");
    await user.click(nextButton);

    expect(mockSync).not.toHaveBeenCalled();
    expect(screen.getByText("School name is required")).toBeInTheDocument();
    expect(screen.getByText("Degree is required")).toBeInTheDocument();
  });

  it("submits successfully when data is valid", async () => {
    const onNextMock = vi.fn();
    render(<EducationForm onNext={onNextMock} />);
    const user = userEvent.setup();

    const nextButton = screen.getByText("Next");
    await user.click(nextButton);

    await waitFor(() => {
      expect(mockSync).toHaveBeenCalled();
      expect(onNextMock).toHaveBeenCalled();
    });
  });
});
