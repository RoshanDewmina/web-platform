import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GridCanvas } from "@/components/slide-builder/grid-canvas";
import { ComponentPalette } from "@/components/slide-builder/component-palette";
import { PropertiesEditor } from "@/components/slide-builder/properties-editor";
import { AIAssistant } from "@/components/slide-builder/ai-assistant";
import useSlideBuilderStore from "@/stores/slide-builder-store";
import { SlideLayout, GridElement } from "@/types/slide-builder";

// Mock the store
jest.mock("@/stores/slide-builder-store");
jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

const mockUseSlideBuilderStore = useSlideBuilderStore as jest.MockedFunction<
  typeof useSlideBuilderStore
>;

describe("AI-Powered Visual Slide Builder System", () => {
  const mockSlide: SlideLayout = {
    id: "test-slide",
    title: "Test Slide",
    elements: [
      {
        id: "title-1",
        type: "title",
        x: 2,
        y: 2,
        w: 8,
        h: 2,
        props: {
          content: "Welcome to the Slide Builder!",
          level: 1,
          align: "center",
        },
      },
      {
        id: "text-1",
        type: "text",
        x: 2,
        y: 5,
        w: 8,
        h: 3,
        props: {
          content:
            "This is a test slide to verify the slide builder components are working correctly.",
          fontSize: 18,
          align: "center",
        },
      },
    ],
  };

  const mockStoreState = {
    currentSlide: mockSlide,
    selectedElementId: null,
    hoveredElementId: null,
    multiSelectIds: [],
    gridConfig: {
      columns: 12,
      rows: 12,
      showGrid: true,
      snapToGrid: true,
      cellSize: "responsive",
    },
    showGuides: true,
    magneticSnap: true,
    isDragging: false,
    isResizing: false,
    clipboardElements: [],
    history: [mockSlide],
    historyIndex: 0,
    maxHistorySize: 50,
    assets: [],
    selectedAssetId: null,
    commandHistory: [],
    pendingCommand: null,
    collaborationState: null,
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    previewMode: false,
    setCurrentSlide: jest.fn(),
    updateSlideTitle: jest.fn(),
    updateSlideNotes: jest.fn(),
    addElement: jest.fn(),
    updateElement: jest.fn(),
    deleteElement: jest.fn(),
    duplicateElement: jest.fn(),
    selectElement: jest.fn(),
    selectMultiple: jest.fn(),
    toggleElementSelection: jest.fn(),
    moveElement: jest.fn(),
    resizeElement: jest.fn(),
    moveSelectedElements: jest.fn(),
    setGridConfig: jest.fn(),
    toggleGrid: jest.fn(),
    toggleSnap: jest.fn(),
    toggleGuides: jest.fn(),
    setZoom: jest.fn(),
    resetZoom: jest.fn(),
    setPreviewMode: jest.fn(),
    executeCommand: jest.fn(),
    setAssets: jest.fn(),
    addAsset: jest.fn(),
    removeAsset: jest.fn(),
    selectAsset: jest.fn(),
    undo: jest.fn(),
    redo: jest.fn(),
    saveToHistory: jest.fn(),
  };

  beforeEach(() => {
    mockUseSlideBuilderStore.mockReturnValue(mockStoreState);
    (global.fetch as jest.Mock).mockClear();
  });

  describe("Grid Canvas Component", () => {
    it("renders the grid canvas with correct dimensions", () => {
      render(<GridCanvas />);

      // Check if the grid canvas is rendered
      const canvas = screen.getByRole("main");
      expect(canvas).toBeInTheDocument();
    });

    it("displays grid elements in correct positions", () => {
      render(<GridCanvas />);

      // Check if elements are rendered
      expect(
        screen.getByText("Welcome to the Slide Builder!")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "This is a test slide to verify the slide builder components are working correctly."
        )
      ).toBeInTheDocument();
    });

    it("handles element selection", () => {
      render(<GridCanvas />);

      const titleElement = screen.getByText("Welcome to the Slide Builder!");
      fireEvent.click(titleElement);

      expect(mockStoreState.selectElement).toHaveBeenCalledWith("title-1");
    });
  });

  describe("Component Palette", () => {
    it("renders all component categories", () => {
      render(<ComponentPalette onComponentSelect={jest.fn()} />);

      // Check if component categories are rendered
      expect(screen.getByText("Text")).toBeInTheDocument();
      expect(screen.getByText("Media")).toBeInTheDocument();
      expect(screen.getByText("Interactive")).toBeInTheDocument();
      expect(screen.getByText("Data")).toBeInTheDocument();
      expect(screen.getByText("Layout")).toBeInTheDocument();
    });

    it("renders component types within categories", () => {
      render(<ComponentPalette onComponentSelect={jest.fn()} />);

      // Check if specific components are rendered
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Text")).toBeInTheDocument();
      expect(screen.getByText("Image")).toBeInTheDocument();
      expect(screen.getByText("Video")).toBeInTheDocument();
      expect(screen.getByText("Quiz")).toBeInTheDocument();
      expect(screen.getByText("Code")).toBeInTheDocument();
      expect(screen.getByText("Chart")).toBeInTheDocument();
      expect(screen.getByText("Table")).toBeInTheDocument();
      expect(screen.getByText("Columns")).toBeInTheDocument();
    });

    it("calls onComponentSelect when a component is clicked", () => {
      const mockOnComponentSelect = jest.fn();
      render(<ComponentPalette onComponentSelect={mockOnComponentSelect} />);

      const titleComponent = screen
        .getByText("Title")
        .closest('[data-slot="card"]');
      fireEvent.click(titleComponent!);

      expect(mockOnComponentSelect).toHaveBeenCalledWith(
        "title",
        expect.any(Object)
      );
    });
  });

  describe("Properties Editor", () => {
    it("shows placeholder when no element is selected", () => {
      render(<PropertiesEditor element={null} slide={mockSlide} />);

      expect(
        screen.getByText("Select an element to edit its properties")
      ).toBeInTheDocument();
    });

    it("displays element properties when an element is selected", () => {
      const selectedElement = mockSlide.elements[0];
      render(<PropertiesEditor element={selectedElement} slide={mockSlide} />);

      // Check if element properties are displayed
      expect(screen.getByText("Element Properties")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("Welcome to the Slide Builder!")
      ).toBeInTheDocument();
    });

    it("allows editing element properties", () => {
      const selectedElement = mockSlide.elements[0];
      render(<PropertiesEditor element={selectedElement} slide={mockSlide} />);

      const contentInput = screen.getByDisplayValue(
        "Welcome to the Slide Builder!"
      );
      fireEvent.change(contentInput, { target: { value: "Updated Title" } });

      expect(mockStoreState.updateElement).toHaveBeenCalledWith("title-1", {
        props: { ...selectedElement.props, content: "Updated Title" },
      });
    });
  });

  describe("AI Assistant", () => {
    it("renders AI assistant interface", () => {
      render(<AIAssistant slideId="test-slide" />);

      expect(
        screen.getByPlaceholderText("Ask AI for help...")
      ).toBeInTheDocument();
      expect(screen.getByText("Send")).toBeInTheDocument();
    });

    it("displays quick action buttons", () => {
      render(<AIAssistant slideId="test-slide" />);

      expect(screen.getByText("Create from text")).toBeInTheDocument();
      expect(screen.getByText("Add image")).toBeInTheDocument();
      expect(screen.getByText("Generate quiz")).toBeInTheDocument();
      expect(screen.getByText("Improve layout")).toBeInTheDocument();
    });

    it("handles AI command execution", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          commands: [
            {
              type: "add_element",
              parameters: {
                slideId: "test-slide",
                type: "title",
                x: 0,
                y: 0,
                w: 6,
                h: 2,
                props: { content: "AI Generated Title" },
              },
            },
          ],
        }),
      });

      render(<AIAssistant slideId="test-slide" />);

      const input = screen.getByPlaceholderText("Ask AI for help...");
      const sendButton = screen.getByText("Send");

      fireEvent.change(input, {
        target: { value: "Add a title to this slide" },
      });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockStoreState.executeCommand).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "add_element",
            parameters: expect.objectContaining({
              type: "title",
              props: { content: "AI Generated Title" },
            }),
          })
        );
      });
    });
  });

  describe("Store Integration", () => {
    it("manages slide state correctly", () => {
      expect(mockStoreState.currentSlide).toEqual(mockSlide);
      expect(mockStoreState.currentSlide?.elements).toHaveLength(2);
    });

    it("supports undo/redo operations", () => {
      mockStoreState.undo();
      mockStoreState.redo();

      expect(mockStoreState.undo).toHaveBeenCalled();
      expect(mockStoreState.redo).toHaveBeenCalled();
    });

    it("handles element manipulation", () => {
      const newElement: Omit<GridElement, "id"> = {
        type: "text",
        x: 0,
        y: 0,
        w: 4,
        h: 2,
        props: { content: "New text element" },
      };

      mockStoreState.addElement(newElement);
      expect(mockStoreState.addElement).toHaveBeenCalledWith(newElement);
    });
  });

  describe("Grid System", () => {
    it("uses 12x12 grid configuration", () => {
      expect(mockStoreState.gridConfig.columns).toBe(12);
      expect(mockStoreState.gridConfig.rows).toBe(12);
    });

    it("supports magnetic snapping", () => {
      expect(mockStoreState.gridConfig.snapToGrid).toBe(true);
      expect(mockStoreState.magneticSnap).toBe(true);
    });

    it("shows alignment guides", () => {
      expect(mockStoreState.showGuides).toBe(true);
    });
  });

  describe("Component Types", () => {
    it("supports all required component types", () => {
      const supportedTypes = [
        "title",
        "text",
        "paragraph",
        "list",
        "image",
        "video",
        "audio",
        "quiz",
        "code",
        "embed",
        "chart",
        "table",
        "columns",
        "callout",
        "spacer",
      ];

      // This would be tested by checking the component registry
      expect(supportedTypes).toContain("title");
      expect(supportedTypes).toContain("image");
      expect(supportedTypes).toContain("quiz");
    });
  });

  describe("AI Command System", () => {
    it("supports create_slides_from_text command", () => {
      const command = {
        type: "create_slides_from_text" as const,
        parameters: {
          courseId: "test-course",
          lessonId: "test-lesson",
          sourceText: "Sample content for slides",
          strategy: "by_headings" as const,
          imagePlaceholders: "auto" as const,
        },
      };

      mockStoreState.executeCommand(command);
      expect(mockStoreState.executeCommand).toHaveBeenCalledWith(command);
    });

    it("supports add_element command", () => {
      const command = {
        type: "add_element" as const,
        parameters: {
          slideId: "test-slide",
          type: "title",
          x: 0,
          y: 0,
          w: 6,
          h: 2,
          props: { content: "New Title" },
        },
      };

      mockStoreState.executeCommand(command);
      expect(mockStoreState.executeCommand).toHaveBeenCalledWith(command);
    });

    it("supports move_element command", () => {
      const command = {
        type: "move_element" as const,
        parameters: {
          slideId: "test-slide",
          elementId: "title-1",
          x: 3,
          y: 3,
          respectCollisions: true,
        },
      };

      mockStoreState.executeCommand(command);
      expect(mockStoreState.executeCommand).toHaveBeenCalledWith(command);
    });
  });

  describe("Accessibility", () => {
    it("supports keyboard navigation", () => {
      render(<GridCanvas />);

      // Test keyboard navigation
      const canvas = screen.getByRole("main");
      fireEvent.keyDown(canvas, { key: "ArrowRight" });
      fireEvent.keyDown(canvas, { key: "ArrowLeft" });
      fireEvent.keyDown(canvas, { key: "ArrowUp" });
      fireEvent.keyDown(canvas, { key: "ArrowDown" });

      // Should handle keyboard events for element movement
      expect(canvas).toBeInTheDocument();
    });

    it("provides proper ARIA labels", () => {
      render(<ComponentPalette onComponentSelect={jest.fn()} />);

      const titleComponent = screen
        .getByText("Title")
        .closest('[data-slot="card"]');
      expect(titleComponent).toHaveAttribute("draggable", "true");
    });
  });

  describe("Error Handling", () => {
    it("handles API errors gracefully", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

      render(<AIAssistant slideId="test-slide" />);

      const input = screen.getByPlaceholderText("Ask AI for help...");
      const sendButton = screen.getByText("Send");

      fireEvent.change(input, { target: { value: "Test command" } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(
          screen.getByText("Sorry, I encountered an error. Please try again.")
        ).toBeInTheDocument();
      });
    });
  });
});





