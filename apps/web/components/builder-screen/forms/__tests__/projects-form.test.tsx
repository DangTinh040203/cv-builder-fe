import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import ProjectsForm from "@/components/builder-screen/forms/projects-form";
import { useSyncResume } from "@/hooks/use-sync-resume";

// Mock dependencies
const mockDispatch = vi.fn();
vi.mock("@/stores/store", () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock("@/hooks/use-sync-resume");

const mockSync = vi.fn().mockResolvedValue(true);
const initialProjects = [
  {
    id: "1",
    title: "My Project",
    subTitle: "React & Node",
    details: "<p>Project details</p>",
    resumeId: "123",
  },
];

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
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

describe("ProjectsForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    vi.mocked(useSyncResume).mockReturnValue({
      sync: mockSync,
      isSyncing: false,
      resume: {
        id: "123",
        projects: initialProjects,
      },
    });
  });

  it("renders correctly with initial data", () => {
    render(<ProjectsForm />);

    expect(screen.getByDisplayValue("My Project")).toBeInTheDocument();
    expect(screen.getByDisplayValue("React & Node")).toBeInTheDocument();
    expect(screen.getByTestId("mock-editor")).toHaveValue(
      "<p>Project details</p>",
    );
  });

  it("updates project fields", async () => {
    render(<ProjectsForm />);
    const user = userEvent.setup();

    const titleInput = screen.getByDisplayValue("My Project");
    await user.clear(titleInput);
    await user.type(titleInput, "New Project");

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("adds a new project item", async () => {
    render(<ProjectsForm />);
    const user = userEvent.setup();

    const addButton = screen.getByText("Add Project");
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
        projects: [
          { id: "1", title: "", subTitle: "", details: "", resumeId: "123" },
        ],
      },
    });

    render(<ProjectsForm onNext={vi.fn()} />);
    const user = userEvent.setup();

    const nextButton = screen.getByText("Next");
    await user.click(nextButton);

    expect(mockSync).not.toHaveBeenCalled();
    expect(screen.getByText("Project name is required")).toBeInTheDocument();
  });

  it("submits successfully when data is valid", async () => {
    const onNextMock = vi.fn();
    render(<ProjectsForm onNext={onNextMock} />);
    const user = userEvent.setup();

    const nextButton = screen.getByText("Next");
    await user.click(nextButton);

    await waitFor(() => {
      expect(mockSync).toHaveBeenCalled();
      expect(onNextMock).toHaveBeenCalled();
    });
  });
});
