
export enum ToolType {
  PEN = 'PEN',
  HIGHLIGHTER = 'HIGHLIGHTER',
  ERASER = 'ERASER',
  SHAPE = 'SHAPE',
  LASSO = 'LASSO',
  TEXT = 'TEXT',
  SELECT = 'SELECT',
  IMAGE = 'IMAGE',
  STICKY_NOTE = 'STICKY_NOTE'
}

export type AppMode = 'HANDWRITING' | 'TEXT' | 'SELECT' | 'IMAGE';
export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'line';
export type ToolbarDockPosition = 'floating' | 'top' | 'left' | 'right';
export type StrokeStyle = 'solid' | 'dashed' | 'dotted';
export type StrokeCap = 'round' | 'butt' | 'square';
export type PenType = 'fountain' | 'ball' | 'brush';
export type ScrollDirection = 'vertical' | 'horizontal' | 'none';
export type ViewMode = 'single' | 'continuous';

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface Stroke {
  id: string;
  type: 'stroke';
  points: Point[];
  color: string;
  width: number;
  tool: ToolType;
  isSimulatedPressure?: boolean; // For smooth ink effect
  shapeType?: ShapeType; // For Shape tool
  isFilled?: boolean; // For Shape tool
  strokeStyle?: StrokeStyle;
  strokeCap?: StrokeCap;
  penType?: PenType;
  strokeStability?: number; // 0 to 1
}

export interface TextElement {
  id: string;
  type: 'text';
  x: number;
  y: number;
  content: string;
  fontSize: number;
  color: string;
  width?: number; // For wrapping
}

export interface StickyNoteElement {
  id: string;
  type: 'sticky-note';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  color: string; // Background color
  fontSize: number;
}

export type CanvasElement = Stroke | TextElement | StickyNoteElement;

export type PageTemplate = 
  // Essentials
  'blank' | 'dotted' | 'ruled-narrow' | 'ruled-wide' | 'squared' | 
  // Writing
  'cornell' | 'legal' | 'single-column' | 'single-column-mix' | 'two-column' | 'three-column' |
  // Planner
  'accounting' | 'monthly-b' | 'monthly-c' | 'todos' | 'weekly-a' | 'weekly-i' |
  // Music
  'guitar-score' | 'guitar-tab' | 'music-paper' |
  // Black & White (Patterns)
  'circle-dots' | 'geometric' | 'letters' | 'line-waves' | 'isometric' | 'hexagonal' | 'line-waves-black' | 'black' |
  // AI Templates
  'meeting';

export interface Page {
  id: string;
  elements: CanvasElement[];
  template: PageTemplate;
  transcription?: string; // OCR text content
}

export type NotebookType = 'notebook' | 'whiteboard' | 'doc';

export interface Notebook {
  id: string;
  title: string;
  type: NotebookType;
  coverColor: string;
  paperColor?: string; // Background color of the pages
  orientation: 'portrait' | 'landscape';
  pages: Page[];
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  avatarColor: string;
  isActive: boolean;
}

export interface AIState {
  isOpen: boolean;
  isLoading: boolean;
  response: string | null;
  mode: 'chat' | 'summarize' | 'elaborate';
}

export interface CanvasHandle {
    getSnapshot: () => string | null;
}