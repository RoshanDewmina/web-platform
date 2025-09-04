import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { 
  GridElement, 
  SlideLayout, 
  GridConfig, 
  DEFAULT_GRID,
  checkCollision,
  findFreePosition,
  AICommand,
  Asset,
  LayoutTemplate,
  CollaborationState
} from '@/types/slide-builder';

interface SlideBuilderState {
  // Current slide and elements
  currentSlide: SlideLayout | null;
  selectedElementId: string | null;
  hoveredElementId: string | null;
  multiSelectIds: string[];
  
  // Grid configuration
  gridConfig: GridConfig;
  showGuides: boolean;
  magneticSnap: boolean;
  
  // Editing state
  isDragging: boolean;
  isResizing: boolean;
  clipboardElements: GridElement[];
  
  // History for undo/redo
  history: SlideLayout[];
  historyIndex: number;
  maxHistorySize: number;
  
  // Assets
  assets: Asset[];
  selectedAssetId: string | null;
  
  // AI Commands
  commandHistory: AICommand[];
  pendingCommand: AICommand | null;
  
  // Collaboration
  collaborationState: CollaborationState | null;
  
  // View settings
  zoom: number;
  panOffset: { x: number; y: number };
  previewMode: boolean;
  
  // Actions - Slide Management
  setCurrentSlide: (slide: SlideLayout) => void;
  updateSlideTitle: (title: string) => void;
  updateSlideNotes: (notes: string) => void;
  
  // Actions - Element Management
  addElement: (element: Omit<GridElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<GridElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  selectMultiple: (ids: string[]) => void;
  toggleElementSelection: (id: string) => void;
  
  // Actions - Element Movement
  moveElement: (id: string, x: number, y: number, checkForCollisions?: boolean) => void;
  resizeElement: (id: string, w: number, h: number) => void;
  moveSelectedElements: (deltaX: number, deltaY: number) => void;
  
  // Actions - Grid Operations
  setGridConfig: (config: Partial<GridConfig>) => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
  toggleGuides: () => void;
  
  // Actions - Clipboard
  copyElements: (ids?: string[]) => void;
  cutElements: (ids?: string[]) => void;
  pasteElements: (position?: { x: number; y: number }) => void;
  
  // Actions - History
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  clearHistory: () => void;
  
  // Actions - Layout Templates
  applyTemplate: (template: LayoutTemplate) => void;
  saveAsTemplate: (name: string, description: string) => LayoutTemplate;
  
  // Actions - Z-Index Management
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  
  // Actions - Alignment
  alignElements: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  distributeElements: (direction: 'horizontal' | 'vertical') => void;
  
  // Actions - View
  setZoom: (zoom: number) => void;
  resetZoom: () => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  setPreviewMode: (enabled: boolean) => void;
  
  // Actions - AI Commands
  executeCommand: (command: Omit<AICommand, 'id' | 'timestamp' | 'status' | 'result'>) => Promise<void>;
  
  // Actions - Assets
  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => void;
  removeAsset: (id: string) => void;
  selectAsset: (id: string | null) => void;
}

const useSlideBuilderStore = create<SlideBuilderState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      currentSlide: null,
      selectedElementId: null,
      hoveredElementId: null,
      multiSelectIds: [],
      gridConfig: DEFAULT_GRID,
      showGuides: true,
      magneticSnap: true,
      isDragging: false,
      isResizing: false,
      clipboardElements: [],
      history: [],
      historyIndex: -1,
      maxHistorySize: 50,
      assets: [],
      selectedAssetId: null,
      commandHistory: [],
      pendingCommand: null,
      collaborationState: null,
      zoom: 1,
      panOffset: { x: 0, y: 0 },
      previewMode: false,
      
      // Slide Management
      setCurrentSlide: (slide) => set({ currentSlide: slide }),
      
      updateSlideTitle: (title) => set((state) => ({
        currentSlide: state.currentSlide ? { ...state.currentSlide, title } : null
      })),
      
      updateSlideNotes: (notes) => set((state) => ({
        currentSlide: state.currentSlide ? { ...state.currentSlide, notes } : null
      })),
      
      // Element Management
      addElement: (element) => {
        const state = get();
        if (!state.currentSlide) return;
        
        const newElement: GridElement = {
          ...element,
          id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          zIndex: state.currentSlide.elements.length,
        };
        
        // Check for collisions and find free position if needed
        const collision = checkCollision(newElement, state.currentSlide.elements);
        if (collision.hasCollision && collision.suggestedPosition) {
          newElement.x = collision.suggestedPosition.x;
          newElement.y = collision.suggestedPosition.y;
        }
        
        set((state) => ({
          currentSlide: state.currentSlide ? {
            ...state.currentSlide,
            elements: [...state.currentSlide.elements, newElement]
          } : null,
          selectedElementId: newElement.id
        }));
        
        get().saveToHistory();
      },
      
      updateElement: (id, updates) => {
        set((state) => ({
          currentSlide: state.currentSlide ? {
            ...state.currentSlide,
            elements: state.currentSlide.elements.map(el =>
              el.id === id ? { ...el, ...updates } : el
            )
          } : null
        }));
        get().saveToHistory();
      },
      
      deleteElement: (id) => {
        set((state) => ({
          currentSlide: state.currentSlide ? {
            ...state.currentSlide,
            elements: state.currentSlide.elements.filter(el => el.id !== id)
          } : null,
          selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
          multiSelectIds: state.multiSelectIds.filter(elId => elId !== id)
        }));
        get().saveToHistory();
      },
      
      duplicateElement: (id) => {
        const state = get();
        if (!state.currentSlide) return;
        
        const element = state.currentSlide.elements.find(el => el.id === id);
        if (!element) return;
        
        const newElement: GridElement = {
          ...element,
          id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          x: Math.min(element.x + 1, 12 - element.w),
          y: Math.min(element.y + 1, 12 - element.h),
        };
        
        // Find free position for duplicated element
        const freePos = findFreePosition(newElement, state.currentSlide.elements);
        if (freePos) {
          newElement.x = freePos.x;
          newElement.y = freePos.y;
        }
        
        set((state) => ({
          currentSlide: state.currentSlide ? {
            ...state.currentSlide,
            elements: [...state.currentSlide.elements, newElement]
          } : null,
          selectedElementId: newElement.id
        }));
        
        get().saveToHistory();
      },
      
      selectElement: (id) => set({ selectedElementId: id, multiSelectIds: [] }),
      
      selectMultiple: (ids) => set({ multiSelectIds: ids, selectedElementId: null }),
      
      toggleElementSelection: (id) => set((state) => ({
        multiSelectIds: state.multiSelectIds.includes(id)
          ? state.multiSelectIds.filter(elId => elId !== id)
          : [...state.multiSelectIds, id],
        selectedElementId: null
      })),
      
      // Element Movement
      moveElement: (id, x, y, checkForCollisions = true) => {
        const state = get();
        if (!state.currentSlide) return;
        
        const element = state.currentSlide.elements.find(el => el.id === id);
        if (!element) return;
        
        let newX = Math.max(0, Math.min(x, 12 - element.w));
        let newY = Math.max(0, Math.min(y, 12 - element.h));
        
        if (checkForCollisions) {
          const testElement = { ...element, x: newX, y: newY };
          const collision = checkCollision(testElement, state.currentSlide.elements, id);
          
          if (collision.hasCollision && collision.suggestedPosition) {
            newX = collision.suggestedPosition.x;
            newY = collision.suggestedPosition.y;
          }
        }
        
        set((state) => ({
          currentSlide: state.currentSlide ? {
            ...state.currentSlide,
            elements: state.currentSlide.elements.map(el =>
              el.id === id ? { ...el, x: newX, y: newY } : el
            )
          } : null
        }));
      },
      
      resizeElement: (id, w, h) => {
        const state = get();
        if (!state.currentSlide) return;
        
        const element = state.currentSlide.elements.find(el => el.id === id);
        if (!element) return;
        
        const newW = Math.max(1, Math.min(w, 12 - element.x));
        const newH = Math.max(1, Math.min(h, 12 - element.y));
        
        set((state) => ({
          currentSlide: state.currentSlide ? {
            ...state.currentSlide,
            elements: state.currentSlide.elements.map(el =>
              el.id === id ? { ...el, w: newW, h: newH } : el
            )
          } : null
        }));
      },
      
      moveSelectedElements: (deltaX, deltaY) => {
        const state = get();
        const selectedIds = state.multiSelectIds.length > 0 
          ? state.multiSelectIds 
          : state.selectedElementId ? [state.selectedElementId] : [];
        
        selectedIds.forEach(id => {
          const element = state.currentSlide?.elements.find(el => el.id === id);
          if (element) {
            get().moveElement(id, element.x + deltaX, element.y + deltaY, false);
          }
        });
        
        get().saveToHistory();
      },
      
      // Grid Operations
      setGridConfig: (config) => set((state) => ({
        gridConfig: { ...state.gridConfig, ...config }
      })),
      
      toggleGrid: () => set((state) => ({
        gridConfig: { ...state.gridConfig, showGrid: !state.gridConfig.showGrid }
      })),
      
      toggleSnap: () => set((state) => ({
        gridConfig: { ...state.gridConfig, snapToGrid: !state.gridConfig.snapToGrid }
      })),
      
      toggleGuides: () => set((state) => ({ showGuides: !state.showGuides })),
      
      // Clipboard Operations
      copyElements: (ids) => {
        const state = get();
        if (!state.currentSlide) return;
        
        const targetIds = ids || state.multiSelectIds.length > 0 
          ? state.multiSelectIds 
          : state.selectedElementId ? [state.selectedElementId] : [];
        
        const elements = state.currentSlide.elements.filter(el => targetIds.includes(el.id));
        set({ clipboardElements: elements });
      },
      
      cutElements: (ids) => {
        get().copyElements(ids);
        const targetIds = ids || get().multiSelectIds.length > 0 
          ? get().multiSelectIds 
          : get().selectedElementId ? [get().selectedElementId] : [];
        
        targetIds.forEach(id => id && get().deleteElement(id));
      },
      
      pasteElements: (position) => {
        const state = get();
        if (!state.currentSlide || state.clipboardElements.length === 0) return;
        
        const offsetX = position?.x || 1;
        const offsetY = position?.y || 1;
        
        state.clipboardElements.forEach(element => {
          const newElement = {
            ...element,
            x: Math.min(element.x + offsetX, 12 - element.w),
            y: Math.min(element.y + offsetY, 12 - element.h),
          };
          get().addElement(newElement);
        });
      },
      
      // History Management
      saveToHistory: () => {
        const state = get();
        if (!state.currentSlide) return;
        
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(state.currentSlide)));
        
        if (newHistory.length > state.maxHistorySize) {
          newHistory.shift();
        }
        
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1
        });
      },
      
      undo: () => {
        const state = get();
        if (state.historyIndex > 0) {
          const previousSlide = state.history[state.historyIndex - 1];
          set({
            currentSlide: previousSlide,
            historyIndex: state.historyIndex - 1
          });
        }
      },
      
      redo: () => {
        const state = get();
        if (state.historyIndex < state.history.length - 1) {
          const nextSlide = state.history[state.historyIndex + 1];
          set({
            currentSlide: nextSlide,
            historyIndex: state.historyIndex + 1
          });
        }
      },
      
      clearHistory: () => set({ history: [], historyIndex: -1 }),
      
      // Template Operations
      applyTemplate: (template) => {
        const state = get();
        if (!state.currentSlide) return;
        
        const elements: GridElement[] = template.elements.map((el, index) => ({
          ...el,
          id: `element-${Date.now()}-${index}`,
          props: template.defaultProps?.[el.type] || {},
        }));
        
        set((state) => ({
          currentSlide: state.currentSlide ? {
            ...state.currentSlide,
            elements
          } : null
        }));
        
        get().saveToHistory();
      },
      
      saveAsTemplate: (name, description) => {
        const state = get();
        if (!state.currentSlide) return {} as LayoutTemplate;
        
        return {
          id: `template-${Date.now()}`,
          name,
          description,
          category: 'custom',
          elements: state.currentSlide.elements.map(({ id, props, ...rest }) => rest),
          defaultProps: {},
        };
      },
      
      // Z-Index Management
      bringToFront: (id) => {
        const state = get();
        if (!state.currentSlide) return;
        
        const maxZ = Math.max(...state.currentSlide.elements.map(el => el.zIndex || 0));
        get().updateElement(id, { zIndex: maxZ + 1 });
      },
      
      sendToBack: (id) => {
        const state = get();
        if (!state.currentSlide) return;
        
        const minZ = Math.min(...state.currentSlide.elements.map(el => el.zIndex || 0));
        get().updateElement(id, { zIndex: minZ - 1 });
      },
      
      bringForward: (id) => {
        const state = get();
        if (!state.currentSlide) return;
        
        const element = state.currentSlide.elements.find(el => el.id === id);
        if (element) {
          get().updateElement(id, { zIndex: (element.zIndex || 0) + 1 });
        }
      },
      
      sendBackward: (id) => {
        const state = get();
        if (!state.currentSlide) return;
        
        const element = state.currentSlide.elements.find(el => el.id === id);
        if (element) {
          get().updateElement(id, { zIndex: (element.zIndex || 0) - 1 });
        }
      },
      
      // Alignment Operations
      alignElements: (alignment) => {
        const state = get();
        if (!state.currentSlide) return;
        
        const selectedIds = state.multiSelectIds.length > 0 
          ? state.multiSelectIds 
          : state.selectedElementId ? [state.selectedElementId] : [];
        
        if (selectedIds.length === 0) return;
        
        const selectedElements = state.currentSlide.elements.filter(el => selectedIds.includes(el.id));
        
        switch (alignment) {
          case 'left':
            const minX = Math.min(...selectedElements.map(el => el.x));
            selectedElements.forEach(el => get().moveElement(el.id, minX, el.y));
            break;
          case 'right':
            const maxRight = Math.max(...selectedElements.map(el => el.x + el.w));
            selectedElements.forEach(el => get().moveElement(el.id, maxRight - el.w, el.y));
            break;
          case 'center':
            const avgX = selectedElements.reduce((sum, el) => sum + el.x + el.w / 2, 0) / selectedElements.length;
            selectedElements.forEach(el => get().moveElement(el.id, Math.round(avgX - el.w / 2), el.y));
            break;
          case 'top':
            const minY = Math.min(...selectedElements.map(el => el.y));
            selectedElements.forEach(el => get().moveElement(el.id, el.x, minY));
            break;
          case 'bottom':
            const maxBottom = Math.max(...selectedElements.map(el => el.y + el.h));
            selectedElements.forEach(el => get().moveElement(el.id, el.x, maxBottom - el.h));
            break;
          case 'middle':
            const avgY = selectedElements.reduce((sum, el) => sum + el.y + el.h / 2, 0) / selectedElements.length;
            selectedElements.forEach(el => get().moveElement(el.id, el.x, Math.round(avgY - el.h / 2)));
            break;
        }
        
        get().saveToHistory();
      },
      
      distributeElements: (direction) => {
        const state = get();
        if (!state.currentSlide || state.multiSelectIds.length < 3) return;
        
        const selectedElements = state.currentSlide.elements
          .filter(el => state.multiSelectIds.includes(el.id))
          .sort((a, b) => direction === 'horizontal' ? a.x - b.x : a.y - b.y);
        
        if (direction === 'horizontal') {
          const totalWidth = selectedElements.reduce((sum, el) => sum + el.w, 0);
          const totalSpace = 12 - totalWidth;
          const gap = totalSpace / (selectedElements.length + 1);
          
          let currentX = gap;
          selectedElements.forEach(el => {
            get().moveElement(el.id, currentX, el.y);
            currentX += el.w + gap;
          });
        } else {
          const totalHeight = selectedElements.reduce((sum, el) => sum + el.h, 0);
          const totalSpace = 12 - totalHeight;
          const gap = totalSpace / (selectedElements.length + 1);
          
          let currentY = gap;
          selectedElements.forEach(el => {
            get().moveElement(el.id, el.x, currentY);
            currentY += el.h + gap;
          });
        }
        
        get().saveToHistory();
      },
      
      // View Operations
      setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(zoom, 5)) }),
      resetZoom: () => set({ zoom: 1, panOffset: { x: 0, y: 0 } }),
      setPanOffset: (offset) => set({ panOffset: offset }),
      setPreviewMode: (enabled) => set({ previewMode: enabled }),
      
      // AI Command Execution
      executeCommand: async (command) => {
        const fullCommand: AICommand = {
          ...command,
          id: `cmd-${Date.now()}`,
          timestamp: new Date(),
          status: 'pending'
        };
        
        set({ pendingCommand: fullCommand });
        
        try {
          // Here we would call the actual AI command API
          const response = await fetch('/api/ai/slide-commands', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fullCommand)
          });
          
          const result = await response.json();
          
          set((state) => ({
            pendingCommand: null,
            commandHistory: [...state.commandHistory, { ...fullCommand, status: 'completed', result }]
          }));
        } catch (error) {
          set((state) => ({
            pendingCommand: null,
            commandHistory: [...state.commandHistory, { 
              ...fullCommand, 
              status: 'failed', 
              error: error instanceof Error ? error.message : 'Unknown error' 
            }]
          }));
        }
      },
      
      // Asset Management
      setAssets: (assets) => set({ assets }),
      addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
      removeAsset: (id) => set((state) => ({ 
        assets: state.assets.filter(a => a.id !== id),
        selectedAssetId: state.selectedAssetId === id ? null : state.selectedAssetId
      })),
      selectAsset: (id) => set({ selectedAssetId: id }),
    }))
  )
);

export default useSlideBuilderStore;
