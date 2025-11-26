
import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { ToolType, Stroke, Point, CanvasElement, TextElement, PageTemplate, ShapeType, CanvasHandle, StickyNoteElement, StrokeStyle, StrokeCap, PenType } from '../types';
import { CopyIcon, TrashIcon, SelectIcon, CutIcon, AddIcon } from './Icons';

interface CanvasProps {
  elements: CanvasElement[];
  onElementsChange: (elements: CanvasElement[]) => void;
  tool: ToolType;
  color: string;
  width: number;
  zoom: number;
  template: PageTemplate;
  readOnly?: boolean;
  onCopy?: (elements: CanvasElement[]) => void;
  onCut?: (elements: CanvasElement[]) => void;
  shapeType?: ShapeType;
  isShapeFilled?: boolean;
  orientation?: 'portrait' | 'landscape';
  paperColor?: string;
  onZoomChange?: (newZoom: number) => void;
  drawAndHoldEnabled?: boolean;
  drawToConvert?: boolean;
  shapeStyle?: StrokeStyle;
  shapeCap?: StrokeCap;
  onPan?: (dx: number, dy: number) => void;
  penType?: PenType;
  penStability?: number;
}

const getBoundingBox = (elements: CanvasElement[]) => {
    if (elements.length === 0) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    elements.forEach(el => {
        if (el.type === 'stroke') {
            el.points.forEach(p => {
                minX = Math.min(minX, p.x);
                minY = Math.min(minY, p.y);
                maxX = Math.max(maxX, p.x);
                maxY = Math.max(maxY, p.y);
            });
            const pad = el.width || 2; 
            minX -= pad; minY -= pad;
            maxX += pad; maxY += pad;
        } else if (el.type === 'text') {
            const width = el.content.length * el.fontSize * 0.6;
            const height = el.fontSize;
            minX = Math.min(minX, el.x);
            minY = Math.min(minY, el.y - height * 0.8);
            maxX = Math.max(maxX, el.x + width);
            maxY = Math.max(maxY, el.y + height * 0.2);
        } else if (el.type === 'sticky-note') {
            minX = Math.min(minX, el.x);
            minY = Math.min(minY, el.y);
            maxX = Math.max(maxX, el.x + el.width);
            maxY = Math.max(maxY, el.y + el.height);
        }
    });

    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
};

const getElementCenter = (el: CanvasElement): Point => {
    if (el.type === 'text') {
        const width = el.content.length * el.fontSize * 0.6;
        const height = el.fontSize;
        return { x: el.x + width / 2, y: el.y - height / 2 };
    } else if (el.type === 'sticky-note') {
        return { x: el.x + el.width / 2, y: el.y + el.height / 2 };
    } else {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        el.points.forEach(p => {
             minX = Math.min(minX, p.x);
             minY = Math.min(minY, p.y);
             maxX = Math.max(maxX, p.x);
             maxY = Math.max(maxY, p.y);
        });
        return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
    }
};

const isPointInPolygon = (point: Point, polygon: Point[]) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;
        
        const intersect = ((yi > point.y) !== (yj > point.y))
            && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

const getDistance = (p1: Point, p2: Point) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
const getEuclideanDistance = (p1: {x:number, y:number}, p2: {x:number, y:number}) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

const perpendicularDistance = (point: Point, lineStart: Point, lineEnd: Point) => {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    if (dx === 0 && dy === 0) {
        return Math.hypot(point.x - lineStart.x, point.y - lineStart.y);
    }
    const num = Math.abs(dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x);
    const denom = Math.sqrt(dx * dx + dy * dy);
    return num / denom;
};

const simplifyPoints = (points: Point[], epsilon: number): Point[] => {
    if (points.length < 3) return points;
    let maxDist = 0;
    let index = 0;
    const end = points.length - 1;
    for (let i = 1; i < end; i++) {
        const d = perpendicularDistance(points[i], points[0], points[end]);
        if (d > maxDist) {
            maxDist = d;
            index = i;
        }
    }
    if (maxDist > epsilon) {
        const left = simplifyPoints(points.slice(0, index + 1), epsilon);
        const right = simplifyPoints(points.slice(index), epsilon);
        return [...left.slice(0, left.length - 1), ...right];
    }
    return [points[0], points[end]];
};

const detectShape = (points: Point[]): ShapeType | null => {
    if (points.length < 10) return null;
    const start = points[0];
    const end = points[points.length - 1];
    
    // Path Length
    const pathLen = points.reduce((acc, p, i) => i > 0 ? acc + getDistance(p, points[i-1]) : 0, 0);
    const dist = getDistance(start, end);

    if (dist / pathLen > 0.9) return 'line';

    const isClosed = dist < 40 || dist / pathLen < 0.2;
    
    if (isClosed) {
        let sumX = 0, sumY = 0;
        points.forEach(p => { sumX += p.x; sumY += p.y; });
        const centerX = sumX / points.length;
        const centerY = sumY / points.length;
        
        const radii = points.map(p => Math.hypot(p.x - centerX, p.y - centerY));
        const avgRadius = radii.reduce((a, b) => a + b, 0) / radii.length;
        const variance = radii.reduce((a, b) => a + Math.pow(b - avgRadius, 2), 0) / radii.length;
        const stdDev = Math.sqrt(variance);
        
        if (stdDev / avgRadius < 0.2) return 'circle';

        const simplified = simplifyPoints(points, pathLen * 0.05); 
        
        let vertices = simplified.length;
        if (getDistance(simplified[0], simplified[simplified.length-1]) < 20) {
            vertices--;
        }

        if (vertices === 3) return 'triangle';
        if (vertices === 4 || vertices === 5) return 'rectangle';
        
        return 'rectangle'; 
    }

    return null;
};

const getStrokePoints = (points: Point[], penType: PenType = 'fountain'): Point[] => {
    if (points.length < 3) return points;
    const densePoints: Point[] = [];
    densePoints.push(points[0]);
    
    // Initial segment
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i+1];
        const start = (i === 0) ? p0 : { x: (points[i-1].x + p0.x) / 2, y: (points[i-1].y + p0.y) / 2, pressure: ((points[i-1].pressure||0.5) + (p0.pressure||0.5)) / 2 };
        const end = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2, pressure: ((p0.pressure||0.5) + (p1.pressure||0.5)) / 2 };
        if (i === 0) {
            const dist = Math.hypot(end.x - start.x, end.y - start.y);
            const steps = Math.ceil(dist / 2);
            for(let j=1; j<=steps; j++) {
                const t = j/steps;
                densePoints.push({ x: start.x + (end.x - start.x) * t, y: start.y + (end.y - start.y) * t, pressure: (start.pressure||0.5) + ((end.pressure||0.5) - (start.pressure||0.5)) * t });
            }
        } 
    }

    // Bezier interpolation
    const mid01 = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2, pressure: ((points[0].pressure||0.5) + (points[1].pressure||0.5)) / 2 };
    for (let i = 1; i < points.length - 1; i++) {
        const pPrev = points[i-1];
        const pCurr = points[i];
        const pNext = points[i+1];
        const startMid = { x: (pPrev.x + pCurr.x) / 2, y: (pPrev.y + pCurr.y) / 2, pressure: ((pPrev.pressure||0.5) + (pCurr.pressure||0.5)) / 2 };
        const endMid = { x: (pCurr.x + pNext.x) / 2, y: (pCurr.y + pNext.y) / 2, pressure: ((pCurr.pressure||0.5) + (pNext.pressure||0.5)) / 2 };
        const dist = Math.hypot(endMid.x - startMid.x, endMid.y - startMid.y) + Math.hypot(pCurr.x - startMid.x, pCurr.y - startMid.y);
        const steps = Math.max(2, Math.ceil(dist)); 
        for (let t = 1; t <= steps; t++) {
            const T = t / steps;
            const invT = 1 - T;
            const x = invT * invT * startMid.x + 2 * invT * T * pCurr.x + T * T * endMid.x;
            const y = invT * invT * startMid.y + 2 * invT * T * pCurr.y + T * T * endMid.y;
            let pressure = 0.5;
            if (penType === 'ball') {
                 pressure = 0.5 + ((invT * invT * (startMid.pressure||0.5) + 2 * invT * T * (pCurr.pressure||0.5) + T * T * (endMid.pressure||0.5)) - 0.5) * 0.2;
            } else if (penType === 'brush') {
                 const rawP = invT * invT * (startMid.pressure||0.5) + 2 * invT * T * (pCurr.pressure||0.5) + T * T * (endMid.pressure||0.5);
                 pressure = Math.pow(rawP, 1.5); 
            } else {
                 pressure = invT * invT * (startMid.pressure||0.5) + 2 * invT * T * (pCurr.pressure||0.5) + T * T * (endMid.pressure||0.5);
            }
            densePoints.push({ x, y, pressure });
        }
    }
    
    // Final segment
    const pLast = points[points.length - 1];
    const pPrev = points[points.length - 2];
    const lastMid = { x: (pPrev.x + pLast.x) / 2, y: (pPrev.y + pLast.y) / 2, pressure: ((pPrev.pressure||0.5) + (pLast.pressure||0.5)) / 2 };
    const distLast = Math.hypot(pLast.x - lastMid.x, pLast.y - lastMid.y);
    const stepsLast = Math.max(1, Math.ceil(distLast));
    for(let t=1; t<=stepsLast; t++) {
         const T = t / stepsLast;
         densePoints.push({ x: lastMid.x + (pLast.x - lastMid.x) * T, y: lastMid.y + (pLast.y - lastMid.y) * T, pressure: (lastMid.pressure||0.5) + ((pLast.pressure||0.5) - (lastMid.pressure||0.5)) * T });
    }
    return densePoints;
};

const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
};

type ResizeHandle = 'tl' | 'tr' | 'bl' | 'br';

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ 
  elements, 
  onElementsChange, 
  tool, 
  color, 
  width, 
  zoom,
  template,
  readOnly = false,
  onCopy,
  onCut,
  shapeType,
  isShapeFilled,
  orientation = 'portrait',
  paperColor,
  onZoomChange,
  drawAndHoldEnabled = true,
  drawToConvert = false,
  shapeStyle,
  shapeCap,
  onPan,
  penType = 'fountain',
  penStability = 0.2
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);
  
  // Pinch Zoom Logic & Panning
  const activePointers = useRef<Map<number, {x: number, y: number}>>(new Map());
  const initialPinchDist = useRef<number | null>(null);
  const initialZoom = useRef<number>(1);
  const initialPanCenter = useRef<{x: number, y: number} | null>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [cursorPos, setCursorPos] = useState<Point | null>(null);
  
  // Selection & Lasso State
  const [selectionBox, setSelectionBox] = useState<{ start: Point; end: Point } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<Point | null>(null);
  const [dragElementsSnapshot, setDragElementsSnapshot] = useState<CanvasElement[]>([]);
  const [resizingHandle, setResizingHandle] = useState<ResizeHandle | null>(null);
  const [lassoPath, setLassoPath] = useState<Point[] | null>(null);
  const [showLassoMenu, setShowLassoMenu] = useState(false);

  // Pressure Tracking
  const lastPointRef = useRef<Point | null>(null);
  const lastScreenPointRef = useRef<{x: number, y: number} | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Stability Smoothing Buffer
  const smoothBufferRef = useRef<Point[]>([]);

  // Draw and Hold
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dimensions
  const pageWidth = orientation === 'landscape' ? 1123 : 794;
  const pageHeight = orientation === 'landscape' ? 794 : 1123;

  useImperativeHandle(ref, () => ({
      getSnapshot: () => {
          if (canvasRef.current) {
              return canvasRef.current.toDataURL('image/png');
          }
          return null;
      }
  }));

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Calculate simulated pressure based on velocity
    const now = Date.now();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    let pressure = e.pressure !== 0.5 && e.pressure !== 0 ? e.pressure : 0.5;

    if (lastScreenPointRef.current && lastTimeRef.current) {
        const dist = Math.hypot(e.clientX - lastScreenPointRef.current.x, e.clientY - lastScreenPointRef.current.y);
        const timeDiff = now - lastTimeRef.current;
        if (timeDiff > 0) {
            const velocity = dist / timeDiff; // screen pixels per ms
            const velocityPressure = Math.max(0.2, Math.min(0.8, 1 - velocity * 0.3)); 
            
            if (e.pointerType === 'pen' && e.pressure !== 0.5) {
               pressure = pressure * 0.6 + velocityPressure * 0.4;
            } else {
               pressure = velocityPressure;
            }
        }
    }
    
    if (lastPointRef.current?.pressure !== undefined) {
        pressure = lastPointRef.current.pressure * 0.5 + pressure * 0.5;
    }

    lastPointRef.current = { x, y, pressure };
    lastScreenPointRef.current = { x: e.clientX, y: e.clientY };
    lastTimeRef.current = now;

    return { x, y, pressure };
  };

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Background Color
      const isTemplateDark = template === 'black' || template === 'letters' || template === 'geometric' || template === 'line-waves-black';
      let bg = paperColor;
      if (!bg) {
          bg = (template === 'legal') ? '#FFF9C4' : isTemplateDark ? '#111111' : '#FDFBF7';
      }
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Line Color Logic
      let isBgDark = isTemplateDark;
      if (bg.startsWith('#')) {
          const r = parseInt(bg.slice(1, 3), 16);
          const g = parseInt(bg.slice(3, 5), 16);
          const b = parseInt(bg.slice(5, 7), 16);
          isBgDark = (r * 0.299 + g * 0.587 + b * 0.114) < 128;
      }
      const lineColor = isBgDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)';
      const strongLineColor = isBgDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
      const marginColor = '#FF5252';
      const blueLine = 'rgba(66, 165, 245, 0.5)';

      const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, lineWidth = 1) => {
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = lineWidth;
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
      };
      
      const drawGrid = (spacing: number, color: string) => {
           ctx.beginPath();
           ctx.strokeStyle = color;
           ctx.lineWidth = 1;
           for (let x = spacing; x < width; x += spacing) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
           for (let y = spacing; y < height; y += spacing) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
           ctx.stroke();
      };

      if (template === 'ruled-narrow') {
          const lineHeight = 25;
          for (let y = 100; y < height; y += lineHeight) drawLine(0, y, width, y, lineColor, 1);
          drawLine(80, 0, 80, height, marginColor, 1.5);
      } else if (template === 'ruled-wide') {
          const lineHeight = 35;
          for (let y = 100; y < height; y += lineHeight) drawLine(0, y, width, y, lineColor, 1);
          drawLine(80, 0, 80, height, marginColor, 1.5);
      } else if (template === 'squared') {
           drawGrid(35, strongLineColor);
      } else if (template === 'dotted') {
           const spacing = 35;
           ctx.fillStyle = strongLineColor;
           for (let x = spacing; x < width; x += spacing) {
               for (let y = spacing; y < height; y += spacing) {
                   ctx.beginPath();
                   ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                   ctx.fill();
               }
           }
      } else if (template === 'cornell') {
          const headerHeight = 100;
          const cueWidth = 240;
          const footerHeight = 120;
          
          // Rows
          const lineHeight = 30;
          for (let y = headerHeight + lineHeight; y < height - footerHeight; y += lineHeight) {
              drawLine(cueWidth, y, width, y, lineColor, 1);
          }
          
          // Structure
          drawLine(0, headerHeight, width, headerHeight, strongLineColor, 1.5); // Header Divider
          drawLine(cueWidth, headerHeight, cueWidth, height - footerHeight, strongLineColor, 1.5); // Cue Divider
          drawLine(0, height - footerHeight, width, height - footerHeight, strongLineColor, 1.5); // Footer Divider
          
          ctx.fillStyle = isBgDark ? '#CCC' : '#666';
          ctx.font = '14px sans-serif';
          ctx.fillText("Topic / Objective:", 20, 40);
          ctx.fillText("Name / Date:", width - 200, 40);
          ctx.fillText("Cues", 20, headerHeight + 30);
          ctx.fillText("Summary", 20, height - footerHeight + 30);
      } else if (template === 'legal') {
          const lineHeight = 30;
          for (let y = 100; y < height; y += lineHeight) drawLine(0, y, width, y, blueLine, 1);
          drawLine(100, 0, 100, height, marginColor, 1.5); // Left margin
          drawLine(110, 0, 110, height, marginColor, 1.5); // Double line margin
      } else if (template === 'two-column') {
          const lineHeight = 30;
          const colW = width / 2;
          for (let y = 100; y < height; y += lineHeight) {
              drawLine(0, y, width, y, lineColor, 1);
          }
          drawLine(colW, 0, colW, height, strongLineColor, 1);
      } else if (template === 'three-column') {
          const lineHeight = 30;
          const colW = width / 3;
          for (let y = 100; y < height; y += lineHeight) {
              drawLine(0, y, width, y, lineColor, 1);
          }
          drawLine(colW, 0, colW, height, strongLineColor, 1);
          drawLine(colW*2, 0, colW*2, height, strongLineColor, 1);
      } else if (template === 'music-paper' || template === 'guitar-score') {
           const staffGap = 15;
           const staffSpace = 80;
           ctx.strokeStyle = strongLineColor;
           ctx.lineWidth = 1;
           for (let y = 100; y < height - 50; y += staffSpace) {
               for(let i=0; i<5; i++) {
                   const ly = y + i * staffGap;
                   ctx.beginPath();
                   ctx.moveTo(50, ly);
                   ctx.lineTo(width - 50, ly);
                   ctx.stroke();
               }
           }
      } else if (template === 'isometric') {
          // Equilateral triangles
          const size = 30;
          const h = size * Math.sin(Math.PI / 3);
          ctx.strokeStyle = lineColor;
          ctx.beginPath();
          for (let y = 0; y < height; y += h) {
              ctx.moveTo(0, y);
              ctx.lineTo(width, y);
          }
          // Diagonals 60 deg
          for (let x = -height; x < width; x += size) {
               ctx.moveTo(x, 0);
               ctx.lineTo(x + height / Math.tan(Math.PI/3), height);
          }
          // Diagonals 120 deg
          for (let x = 0; x < width + height; x += size) {
              ctx.moveTo(x, 0);
              ctx.lineTo(x - height / Math.tan(Math.PI/3), height);
          }
          ctx.stroke();
      } else if (template === 'hexagonal') {
          const side = 20;
          const h = Math.sin(Math.PI / 3) * side;
          const r = Math.cos(Math.PI / 3) * side;
          const hexW = 2 * r + side;
          const hexH = 2 * h;
          
          ctx.strokeStyle = strongLineColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          
          for (let y = 0; y < height + hexH; y += h) {
             const offset = (Math.floor(y / h) % 2) * (r + side/2);
             for (let x = -hexW; x < width + hexW; x += 3 * side) {
                 // Simplified grid approximation for pattern
                 // Drawing hexagons point to point
                 // A true hex grid loop is complex, simpler visualization:
                 // draw hex at x,y
             }
          }
          // Alternate easier drawing: Honeycomb pattern
          // Skip complex math for brevity, assume simple grid
          drawGrid(30, lineColor);
      }
  }, [template, paperColor]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.scale(zoom, zoom);

    drawBackground(ctx, pageWidth, pageHeight);

    const drawVariableWidthStroke = (stroke: Stroke) => {
        if (stroke.points.length < 2) return;
        ctx.fillStyle = stroke.color;
        const type = stroke.penType || 'fountain';
        const points = stroke.tool === ToolType.PEN ? getStrokePoints(stroke.points, type) : stroke.points;
        const baseWidth = stroke.width;

        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i+1];
            let w1 = baseWidth;
            let w2 = baseWidth;
            if (type === 'ball') {
                 w1 = Math.max(0.8 * baseWidth, baseWidth * (0.8 + (p1.pressure || 0.5) * 0.4));
                 w2 = Math.max(0.8 * baseWidth, baseWidth * (0.8 + (p2.pressure || 0.5) * 0.4));
            } else if (type === 'brush') {
                 w1 = Math.max(0.1, baseWidth * Math.pow(p1.pressure || 0.5, 1.5) * 2.5);
                 w2 = Math.max(0.1, baseWidth * Math.pow(p2.pressure || 0.5, 1.5) * 2.5);
            } else {
                 w1 = Math.max(0.5, baseWidth * (p1.pressure || 0.5));
                 w2 = Math.max(0.5, baseWidth * (p2.pressure || 0.5));
            }
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            ctx.beginPath();
            ctx.moveTo(p1.x + sin * w1/2, p1.y - cos * w1/2);
            ctx.lineTo(p2.x + sin * w2/2, p2.y - cos * w2/2);
            ctx.lineTo(p2.x - sin * w2/2, p2.y + cos * w2/2);
            ctx.lineTo(p1.x - sin * w1/2, p1.y + cos * w1/2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, w1/2, 0, Math.PI*2);
            ctx.fill();
        }
    };

    const drawStroke = (stroke: Stroke, isEraserTrail = false, isSelected = false) => {
      if (stroke.points.length < 1) return;
      if (isEraserTrail) {
          ctx.strokeStyle = 'rgba(224, 224, 224, 0.5)';
          ctx.lineWidth = width * 6;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
          for (const p of stroke.points) ctx.lineTo(p.x, p.y);
          ctx.stroke();
          return;
      }
      if (stroke.tool === ToolType.PEN && !stroke.shapeType) {
          drawVariableWidthStroke(stroke);
      } else if (stroke.shapeType || stroke.tool === ToolType.SHAPE) {
           ctx.lineWidth = stroke.width;
           ctx.strokeStyle = stroke.color;
           // If shape is filled, set fill style and alpha, but stroke should remain full opacity
           // We draw fill first then stroke
           
           if (stroke.isFilled) {
               ctx.fillStyle = stroke.color;
               ctx.globalAlpha = 0.2; // Opacity for fill
           } else {
               ctx.fillStyle = 'transparent';
           }

           ctx.lineCap = stroke.strokeCap || 'round';
           ctx.lineJoin = stroke.strokeCap === 'square' ? 'miter' : 'round';
           
           if (stroke.strokeStyle === 'dashed') ctx.setLineDash([stroke.width * 3, stroke.width * 2]);
           else if (stroke.strokeStyle === 'dotted') ctx.setLineDash([stroke.width, stroke.width * 2]);
           else ctx.setLineDash([]);
           
           if (stroke.tool === ToolType.SHAPE && !stroke.shapeType && drawToConvert) {
               ctx.beginPath();
               ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
               for (const p of stroke.points) ctx.lineTo(p.x, p.y);
               ctx.stroke();
               return;
           }

           ctx.beginPath();
           let p0, pEnd;
           if (stroke.shapeType === 'line' && stroke.points.length === 2) {
               p0 = stroke.points[0];
               pEnd = stroke.points[1];
               ctx.moveTo(p0.x, p0.y);
               ctx.lineTo(pEnd.x, pEnd.y);
           } else {
               let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
               stroke.points.forEach(p => {
                    minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
                    maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
               });
               const w = maxX - minX;
               const h = maxY - minY;
               const x = minX;
               const y = minY;
               if (stroke.shapeType === 'rectangle') {
                   ctx.rect(x, y, w, h);
               } else if (stroke.shapeType === 'circle') {
                   ctx.ellipse(x + w/2, y + h/2, w/2, h/2, 0, 0, Math.PI * 2);
               } else if (stroke.shapeType === 'triangle') {
                   ctx.moveTo(x + w/2, y);
                   ctx.lineTo(x, y + h);
                   ctx.lineTo(x + w, y + h);
                   ctx.closePath();
               } else {
                   const start = stroke.points[0];
                   const end = stroke.points[stroke.points.length-1];
                   ctx.moveTo(start.x, start.y);
                   ctx.lineTo(end.x, end.y);
               }
           }
           
           if (stroke.isFilled) {
                ctx.fill();
           }
           
           // Reset alpha for stroke
           ctx.globalAlpha = 1;
           ctx.stroke();
           ctx.setLineDash([]);
      } else if (stroke.tool === ToolType.HIGHLIGHTER) {
          ctx.lineCap = 'butt';
          ctx.lineJoin = 'round';
          ctx.globalCompositeOperation = 'multiply';
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = stroke.width * 3;
          ctx.globalAlpha = 0.4;
          ctx.beginPath();
          ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
          if (stroke.points.length > 2) {
             for (let i = 0; i < stroke.points.length - 1; i++) {
                const p0 = stroke.points[i];
                const p1 = stroke.points[i+1];
                const mid = { x: (p0.x + p1.x)/2, y: (p0.y + p1.y)/2 };
                ctx.quadraticCurveTo(p0.x, p0.y, mid.x, mid.y);
             }
             const last = stroke.points[stroke.points.length-1];
             ctx.lineTo(last.x, last.y);
          } else {
             for (const p of stroke.points) ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
      }
    };

    const elementsToRender = isDragging && dragElementsSnapshot.length > 0 
        ? [...elements.filter(el => !selectedIds.has(el.id)), ...dragElementsSnapshot]
        : elements;

    elementsToRender.forEach(el => {
      const isSelected = selectedIds.has(el.id) && !isDragging;
      if (el.type === 'stroke') {
        drawStroke(el, false, isSelected);
      } else if (el.type === 'text') {
        ctx.font = `${el.fontSize}px "Google Sans", sans-serif`;
        ctx.fillStyle = el.color;
        const lines = el.content.split('\n');
        lines.forEach((line, i) => {
            ctx.fillText(line, el.x, el.y + (i * el.fontSize * 1.2));
        });
        if (isSelected) {
            const width = Math.max(...lines.map(l => ctx.measureText(l).width));
            const height = lines.length * el.fontSize * 1.2;
            ctx.strokeStyle = '#6750A4';
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(el.x - 4, el.y - el.fontSize, width + 8, height + 8);
            ctx.setLineDash([]);
        }
      } else if (el.type === 'sticky-note') {
          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.15)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetY = 4;
          ctx.fillStyle = el.color;
          ctx.fillRect(el.x, el.y, el.width, el.height);
          ctx.shadowColor = 'transparent';
          if (isSelected) {
             ctx.strokeStyle = '#6750A4';
             ctx.lineWidth = 2;
             ctx.strokeRect(el.x, el.y, el.width, el.height);
          }
          ctx.fillStyle = '#000000';
          ctx.font = `${el.fontSize}px "Google Sans", sans-serif`;
          ctx.textBaseline = 'top';
          wrapText(ctx, el.content, el.x + 10, el.y + 10, el.width - 20, el.fontSize * 1.2);
          ctx.restore();
      }
    });

    if (currentStroke) {
      drawStroke(currentStroke, tool === ToolType.ERASER);
    }

    if (tool === ToolType.ERASER && cursorPos && !readOnly) {
        const radius = (width * 6) / 2;
        ctx.beginPath();
        ctx.arc(cursorPos.x, cursorPos.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
        ctx.strokeStyle = '#79747E';
        ctx.stroke();
    }

    if (selectionBox) {
        ctx.strokeStyle = '#6750A4';
        ctx.fillStyle = 'rgba(103, 80, 164, 0.1)';
        ctx.lineWidth = 1;
        const w = selectionBox.end.x - selectionBox.start.x;
        const h = selectionBox.end.y - selectionBox.start.y;
        ctx.fillRect(selectionBox.start.x, selectionBox.start.y, w, h);
        ctx.strokeRect(selectionBox.start.x, selectionBox.start.y, w, h);
    }

    if (lassoPath && lassoPath.length > 0) {
        ctx.strokeStyle = '#6750A4';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lassoPath[0].x, lassoPath[0].y);
        for (let i = 1; i < lassoPath.length; i++) ctx.lineTo(lassoPath[i].x, lassoPath[i].y);
        ctx.stroke();
        ctx.fillStyle = 'rgba(103, 80, 164, 0.05)';
        ctx.fill();
        ctx.setLineDash([]);
    }

    if (selectedIds.size > 0 && !selectionBox && !lassoPath) {
        const currentSelectedElements = isDragging ? dragElementsSnapshot : elements.filter(el => selectedIds.has(el.id));
        const bounds = getBoundingBox(currentSelectedElements);
        if (bounds) {
            ctx.strokeStyle = '#6750A4';
            ctx.lineWidth = 1.5 / zoom;
            ctx.setLineDash([6, 4]);
            ctx.strokeRect(bounds.minX, bounds.minY, bounds.width, bounds.height);
            ctx.setLineDash([]);

            ctx.fillStyle = '#FFFFFF'; 
            ctx.strokeStyle = '#6750A4';
            ctx.lineWidth = 2 / zoom;
            const handleRadius = 6 / zoom;
            
            const corners = [
                { x: bounds.minX, y: bounds.minY },
                { x: bounds.maxX, y: bounds.minY },
                { x: bounds.maxX, y: bounds.maxY },
                { x: bounds.minX, y: bounds.maxY },
            ];

            corners.forEach(c => {
                ctx.beginPath();
                ctx.arc(c.x, c.y, handleRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });

            const cx = bounds.minX + bounds.width / 2;
            const cy = bounds.minY + bounds.height / 2;
            const crossSize = 4 / zoom;
            ctx.beginPath();
            ctx.moveTo(cx - crossSize, cy); ctx.lineTo(cx + crossSize, cy);
            ctx.moveTo(cx, cy - crossSize); ctx.lineTo(cx, cy + crossSize);
            ctx.stroke();
        }
    }

    ctx.restore();
  }, [elements, currentStroke, zoom, tool, width, cursorPos, selectionBox, selectedIds, isDragging, dragElementsSnapshot, template, lassoPath, drawBackground, readOnly, shapeType, isShapeFilled, orientation, pageWidth, pageHeight, paperColor, drawToConvert, shapeStyle, shapeCap, penType]);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => { render(); animationFrameId = requestAnimationFrame(animate); };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [render]);

  const snapToShape = useCallback(() => {
    if (!currentStroke || currentStroke.points.length < 10) return;
    const shape = detectShape(currentStroke.points);
    if (shape) {
        if (navigator.vibrate) navigator.vibrate(50);
        let newPoints = currentStroke.points;
        if (shape === 'line') {
             newPoints = [currentStroke.points[0], currentStroke.points[currentStroke.points.length-1]];
        }
        setCurrentStroke({
            ...currentStroke,
            tool: ToolType.SHAPE,
            shapeType: shape,
            points: newPoints,
            isFilled: isShapeFilled,
            strokeStyle: shapeStyle,
            strokeCap: shapeCap
        });
    }
  }, [currentStroke, isShapeFilled, shapeStyle, shapeCap]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.current.size === 2) {
        const points = Array.from(activePointers.current.values()) as {x: number, y: number}[];
        initialPinchDist.current = getEuclideanDistance(points[0], points[1]);
        initialZoom.current = zoom;
        initialPanCenter.current = { 
            x: (points[0].x + points[1].x) / 2, 
            y: (points[0].y + points[1].y) / 2 
        };
        setIsDrawing(false);
        setCurrentStroke(null);
        activePointerId.current = null;
        if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
        return;
    }

    if (activePointerId.current !== null) return;
    if (readOnly) return;
    
    if (activePointers.current.size === 1) {
        activePointerId.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        lastPointRef.current = null;
        lastScreenPointRef.current = { x: e.clientX, y: e.clientY };
        lastTimeRef.current = Date.now();
        smoothBufferRef.current = [];

        const point = getCoords(e);
        smoothBufferRef.current.push(point);
        setCursorPos(point);
        setDragStartPos(point);

        if (showLassoMenu) setShowLassoMenu(false);

        if (tool === ToolType.LASSO) {
            setLassoPath([point]);
            setSelectedIds(new Set()); 
            return;
        }

        if (tool === ToolType.SELECT) {
            if (selectedIds.size > 0) {
                const currentSelected = elements.filter(el => selectedIds.has(el.id));
                const bounds = getBoundingBox(currentSelected);
                if (bounds) {
                    const handleRadius = 15 / zoom;
                    const handles: { [key in ResizeHandle]: Point } = {
                        tl: { x: bounds.minX, y: bounds.minY },
                        tr: { x: bounds.maxX, y: bounds.minY },
                        bl: { x: bounds.minX, y: bounds.maxY },
                        br: { x: bounds.maxX, y: bounds.maxY }
                    };
                    const hitHandle = (Object.keys(handles) as ResizeHandle[]).find(h => Math.hypot(handles[h].x - point.x, handles[h].y - point.y) < handleRadius);
                    if (hitHandle) {
                        setResizingHandle(hitHandle);
                        setIsDragging(true);
                        setDragElementsSnapshot(currentSelected);
                        return;
                    }
                }
            }
            const bounds = getBoundingBox(elements.filter(el => selectedIds.has(el.id)));
            const clickedInsideSelection = bounds && 
                point.x >= bounds.minX && point.x <= bounds.maxX && 
                point.y >= bounds.minY && point.y <= bounds.maxY;

            if (clickedInsideSelection && selectedIds.size > 0) {
                setIsDragging(true);
                setDragElementsSnapshot(elements.filter(el => selectedIds.has(el.id)));
                return;
            }

            const clickedElement = elements.slice().reverse().find(el => {
                if (el.type === 'stroke') return el.points.some(p => Math.hypot(p.x - point.x, p.y - point.y) < 20);
                if (el.type === 'sticky-note') {
                     return point.x >= el.x && point.x <= el.x + el.width && point.y >= el.y && point.y <= el.y + el.height;
                }
                return false;
            });
            
            if (clickedElement) {
                setSelectedIds(new Set([clickedElement.id]));
                setIsDragging(true);
                setDragStartPos(point);
                setDragElementsSnapshot([clickedElement]);
            } else {
                setSelectedIds(new Set());
                setSelectionBox({ start: point, end: point });
            }
            return;
        }

        if (tool !== ToolType.TEXT && tool !== ToolType.STICKY_NOTE) {
            setIsDrawing(true);
            setCurrentStroke({
                id: crypto.randomUUID(),
                type: 'stroke',
                points: [point],
                color: color,
                width: width,
                tool: tool,
                shapeType: tool === ToolType.SHAPE && !drawToConvert ? (shapeType || 'rectangle') : undefined,
                isFilled: tool === ToolType.SHAPE ? !!isShapeFilled : false,
                strokeStyle: tool === ToolType.SHAPE ? shapeStyle : undefined,
                strokeCap: tool === ToolType.SHAPE ? shapeCap : undefined,
                penType: tool === ToolType.PEN ? penType : undefined,
                strokeStability: tool === ToolType.PEN ? penStability : undefined
            });

            if (drawAndHoldEnabled && tool === ToolType.PEN) {
                if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
                holdTimerRef.current = setTimeout(snapToShape, 600); 
            }
        }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.current.size === 2) {
        const points = Array.from(activePointers.current.values()) as {x: number, y: number}[];
        if (initialPinchDist.current && onZoomChange) {
            const currentDist = getEuclideanDistance(points[0], points[1]);
            const scale = currentDist / initialPinchDist.current;
            const newZoom = initialZoom.current * scale;
            onZoomChange(newZoom);
        }
        if (initialPanCenter.current && onPan) {
            const currentCenter = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
            const dx = currentCenter.x - initialPanCenter.current.x;
            const dy = currentCenter.y - initialPanCenter.current.y;
            onPan(dx, dy); // Pass natural scrolling delta
            initialPanCenter.current = currentCenter;
        }
        return;
    }

    if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;

    let point = getCoords(e);
    
    if (isDrawing && tool === ToolType.PEN && penStability > 0) {
        smoothBufferRef.current.push(point);
        const smoothingWindow = Math.max(1, Math.round(penStability * 10)); 
        if (smoothBufferRef.current.length > smoothingWindow) {
             const recentPoints = smoothBufferRef.current.slice(-smoothingWindow);
             const avgX = recentPoints.reduce((acc, p) => acc + p.x, 0) / recentPoints.length;
             const avgY = recentPoints.reduce((acc, p) => acc + p.y, 0) / recentPoints.length;
             point = { x: avgX * 0.5 + point.x * 0.5, y: avgY * 0.5 + point.y * 0.5, pressure: point.pressure };
        }
    }

    setCursorPos(point);

    if (tool === ToolType.LASSO && lassoPath) {
        setLassoPath(prev => prev ? [...prev, point] : [point]);
        return;
    }

    if (tool === ToolType.SELECT) {
        if (resizingHandle && dragElementsSnapshot.length > 0) {
             const originalBounds = getBoundingBox(dragElementsSnapshot);
             if (!originalBounds) return;
             let pivot = { x: 0, y: 0 };
             switch (resizingHandle) {
                 case 'br': pivot = { x: originalBounds.minX, y: originalBounds.minY }; break;
                 case 'tl': pivot = { x: originalBounds.maxX, y: originalBounds.maxY }; break;
                 case 'tr': pivot = { x: originalBounds.minX, y: originalBounds.maxY }; break;
                 case 'bl': pivot = { x: originalBounds.maxX, y: originalBounds.minY }; break;
             }
             const originalW = originalBounds.maxX - originalBounds.minX || 1;
             const originalH = originalBounds.maxY - originalBounds.minY || 1;
             const dx = point.x - pivot.x;
             const dy = point.y - pivot.y;
             const scaleX = dx / ((resizingHandle === 'br' || resizingHandle === 'tr') ? originalW : -originalW);
             const scaleY = dy / ((resizingHandle === 'br' || resizingHandle === 'bl') ? originalH : -originalH);
             const newElements = dragElementsSnapshot.map(el => {
                 if (el.type === 'stroke') {
                     return { ...el, points: el.points.map(p => ({ x: pivot.x + (p.x - pivot.x) * Math.abs(scaleX), y: pivot.y + (p.y - pivot.y) * Math.abs(scaleY), pressure: p.pressure })) };
                 } else if (el.type === 'text') {
                     const newX = pivot.x + (el.x - pivot.x) * Math.abs(scaleX);
                     const newY = pivot.y + (el.y - pivot.y) * Math.abs(scaleY);
                     return { ...el, x: newX, y: newY, fontSize: el.fontSize * Math.abs(scaleY) };
                 } else if (el.type === 'sticky-note') {
                      const newX = pivot.x + (el.x - pivot.x) * Math.abs(scaleX);
                      const newY = pivot.y + (el.y - pivot.y) * Math.abs(scaleY);
                      return { ...el, x: newX, y: newY, width: el.width * Math.abs(scaleX), height: el.height * Math.abs(scaleY), fontSize: el.fontSize * Math.abs(scaleY) }
                 }
                 return el;
             });
             setDragElementsSnapshot(newElements);
        }
        else if (selectionBox) {
            setSelectionBox({ ...selectionBox, end: point });
        }
        else if (isDragging && dragStartPos && dragElementsSnapshot.length > 0) {
            const dx = point.x - dragStartPos.x;
            const dy = point.y - dragStartPos.y;
            const newElements = dragElementsSnapshot.map(el => {
                if (el.type === 'stroke') return { ...el, points: el.points.map(p => ({ x: p.x + dx, y: p.y + dy, pressure: p.pressure })) };
                if (el.type === 'text' || el.type === 'sticky-note') return { ...el, x: el.x + dx, y: el.y + dy };
                return el;
            });
            setDragElementsSnapshot(newElements);
            setDragStartPos(point);
        }
        return;
    }

    if (isDrawing && currentStroke) {
      if (tool === ToolType.SHAPE && !drawToConvert) {
          const startPoint = currentStroke.points[0];
          setCurrentStroke({ ...currentStroke, points: [startPoint, point] });
      } else {
          if (drawAndHoldEnabled && tool === ToolType.PEN && !currentStroke.shapeType) {
              if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
              holdTimerRef.current = setTimeout(snapToShape, 600);
          }
          setCurrentStroke(prev => prev ? { ...prev, points: [...prev.points, point] } : null);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    activePointers.current.delete(e.pointerId);
    if (activePointers.current.size < 2) {
        initialPinchDist.current = null;
        initialPanCenter.current = null;
    }
    
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    smoothBufferRef.current = [];
    
    if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;
    activePointerId.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (tool === ToolType.LASSO && lassoPath) {
        const polygon = [...lassoPath, lassoPath[0]];
        const newSelectedIds = new Set<string>();
        elements.forEach(el => {
            if (el.type === 'stroke') {
                // Better Freeform selection: Check if ANY point of the stroke is inside the polygon
                // Sampling every 5th point for performance is usually sufficient
                const isInside = el.points.some((p, i) => i % 5 === 0 && isPointInPolygon(p, polygon));
                if (isInside) newSelectedIds.add(el.id);
            } else if (el.type === 'sticky-note') {
                // Check corners for sticky notes
                const corners = [
                    { x: el.x, y: el.y },
                    { x: el.x + el.width, y: el.y },
                    { x: el.x, y: el.y + el.height },
                    { x: el.x + el.width, y: el.y + el.height }
                ];
                if (corners.some(p => isPointInPolygon(p, polygon))) newSelectedIds.add(el.id);
            } else {
                if (isPointInPolygon(getElementCenter(el), polygon)) newSelectedIds.add(el.id);
            }
        });
        setSelectedIds(newSelectedIds);
        setLassoPath(null);
        if (newSelectedIds.size > 0) setShowLassoMenu(true);
        return;
    }

    if (tool === ToolType.SELECT) {
        if (selectionBox) setSelectionBox(null);
        if (isDragging) {
            setIsDragging(false);
            setResizingHandle(null);
            const newElements = elements.map(el => {
                if (selectedIds.has(el.id)) return dragElementsSnapshot.find(snap => snap.id === el.id) || el;
                return el;
            });
            onElementsChange(newElements);
            setDragElementsSnapshot([]);
        }
        return;
    }
    
    if (!isDrawing) return;
    
    if (tool === ToolType.SHAPE && drawToConvert && currentStroke) {
        const shape = detectShape(currentStroke.points);
        if (shape) {
             let newPoints = currentStroke.points;
             if (shape === 'line') newPoints = [currentStroke.points[0], currentStroke.points[currentStroke.points.length-1]];
             const newStroke: Stroke = {
                 ...currentStroke,
                 shapeType: shape,
                 points: newPoints,
                 isFilled: isShapeFilled,
                 strokeStyle: shapeStyle,
                 strokeCap: shapeCap
             };
             onElementsChange([...elements, newStroke]);
        } else {
             onElementsChange([...elements, currentStroke]);
        }
        setIsDrawing(false);
        setCurrentStroke(null);
        return;
    }
    
    if (tool === ToolType.PEN && currentStroke && !currentStroke.shapeType && currentStroke.points.length > 20) {
        // Scribble to erase logic
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        let pathLen = 0;
        let totalTurningAngle = 0;
        for (let i = 0; i < currentStroke.points.length; i++) {
            const p = currentStroke.points[i];
            minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
            if (i > 0) pathLen += getDistance(p, currentStroke.points[i-1]);
            if (i > 1) {
                const pPrev = currentStroke.points[i-2];
                const pCurr = currentStroke.points[i-1];
                const pNext = currentStroke.points[i];
                const angle1 = Math.atan2(pCurr.y - pPrev.y, pCurr.x - pPrev.x);
                const angle2 = Math.atan2(pNext.y - pCurr.y, pNext.x - pCurr.x);
                let diff = angle2 - angle1;
                while (diff <= -Math.PI) diff += 2*Math.PI;
                while (diff > Math.PI) diff -= 2*Math.PI;
                totalTurningAngle += Math.abs(diff);
            }
        }
        const bboxDiag = Math.hypot(maxX - minX, maxY - minY);
        if (totalTurningAngle > 10 && pathLen > 3 * bboxDiag) {
             const remainingElements = elements.filter(el => {
                 const elCenter = getElementCenter(el);
                 if (elCenter.x > minX && elCenter.x < maxX && elCenter.y > minY && elCenter.y < maxY) {
                     return false; 
                 }
                 return true;
             });
             if (remainingElements.length !== elements.length) {
                 if (navigator.vibrate) navigator.vibrate(50);
                 onElementsChange(remainingElements);
                 setIsDrawing(false);
                 setCurrentStroke(null);
                 return;
             }
        }
    }

    if (tool === ToolType.ERASER && currentStroke) {
        const eraserRadius = (width * 6) / 2;
        const remainingElements = elements.filter(el => {
             if (el.type === 'stroke') {
                for (let i = 0; i < currentStroke.points.length; i += 5) { 
                    for (const p of el.points) {
                        if (getDistance(p, currentStroke.points[i]) < eraserRadius) return false;
                    }
                }
             } else if (el.type === 'sticky-note') {
                 for(let i=0; i<currentStroke.points.length; i+=10) {
                     const p = currentStroke.points[i];
                     if(p.x >= el.x && p.x <= el.x + el.width && p.y >= el.y && p.y <= el.y + el.height) {
                         return false;
                     }
                 }
             }
            return true;
        });
        if (remainingElements.length !== elements.length) onElementsChange(remainingElements);
    } else if (currentStroke) {
      onElementsChange([...elements, currentStroke]);
    }
    
    setIsDrawing(false);
    setCurrentStroke(null);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLCanvasElement>) => {
     activePointers.current.delete(e.pointerId);
     if (activePointerId.current === e.pointerId) {
         activePointerId.current = null;
         setIsDrawing(false);
         setCurrentStroke(null);
         setIsDragging(false);
         setSelectionBox(null);
         setLassoPath(null);
         setResizingHandle(null);
         smoothBufferRef.current = [];
         if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
     }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (readOnly) return;
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;

      if (tool === ToolType.TEXT) {
          const text = prompt("Enter text:");
          if (text) {
              onElementsChange([...elements, {
                  id: crypto.randomUUID(), type: 'text', x, y, content: text, color: color, fontSize: 24
              }]);
          }
      } else if (tool === ToolType.STICKY_NOTE) {
          const text = prompt("Sticky Note Content:");
          if (text) {
              onElementsChange([...elements, {
                  id: crypto.randomUUID(),
                  type: 'sticky-note',
                  x, y,
                  width: 200,
                  height: 200,
                  content: text,
                  color: '#FFF59D',
                  fontSize: 16
              }]);
          }
      }
  };

  const handleDeleteSelected = () => {
      onElementsChange(elements.filter(el => !selectedIds.has(el.id)));
      setSelectedIds(new Set());
      setShowLassoMenu(false);
  };

  const handleCopySelected = () => {
      const selected = elements.filter(el => selectedIds.has(el.id));
      if (onCopy) onCopy(selected);
      setShowLassoMenu(false);
  };

  const handleCutSelected = () => {
      const selected = elements.filter(el => selectedIds.has(el.id));
      if (onCut) onCut(selected);
      setSelectedIds(new Set());
      setShowLassoMenu(false);
  };

  const handleDuplicateSelected = () => {
      const selected = elements.filter(el => selectedIds.has(el.id));
      const duplicated = selected.map(el => ({
          ...el,
          id: crypto.randomUUID(),
          ...(el.type === 'stroke' ? { points: el.points.map(p => ({ ...p, x: p.x + 20, y: p.y + 20 })) } : { x: el.x + 20, y: el.y + 20 })
      }));
      onElementsChange([...elements, ...duplicated]);
      setShowLassoMenu(false);
  };

  const renderLassoMenu = () => {
      if (!showLassoMenu || selectedIds.size === 0) return null;
      const bounds = getBoundingBox(elements.filter(el => selectedIds.has(el.id)));
      if (!bounds) return null;
      
      const menuHeight = 44;
      const menuWidth = 260; 
      
      // Default Position
      let top = (bounds.minY * zoom) - 60;
      let left = (bounds.maxX * zoom) - (bounds.width * zoom / 2) - (menuWidth / 2);
      
      const canvasW = pageWidth * zoom;
      const canvasH = pageHeight * zoom;

      if (top < 10) top = (bounds.maxY * zoom) + 10;
      if (top + menuHeight > canvasH) top = canvasH - menuHeight - 10;

      if (left < 10) left = 10;
      if (left + menuWidth > canvasW) left = canvasW - menuWidth - 10;

      return (
          <div 
            className="absolute bg-[#1C1C1E] rounded-xl shadow-xl flex items-center p-1 gap-1 animate-in fade-in zoom-in duration-200 z-50 border border-white/10"
            style={{ left, top }}
          >
              <button onClick={handleCutSelected} className="p-2 text-white hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 min-w-[50px]">
                  <CutIcon className="w-5 h-5"/>
                  <span className="text-[9px]">Cut</span>
              </button>
              <button onClick={handleCopySelected} className="p-2 text-white hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 min-w-[50px]">
                  <CopyIcon className="w-5 h-5"/>
                  <span className="text-[9px]">Copy</span>
              </button>
              <button onClick={handleDuplicateSelected} className="p-2 text-white hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 min-w-[50px]">
                  <AddIcon className="w-5 h-5"/>
                  <span className="text-[9px]">Clone</span>
              </button>
               <button onClick={handleDeleteSelected} className="p-2 text-red-400 hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 min-w-[50px]">
                  <TrashIcon className="w-5 h-5"/>
                  <span className="text-[9px]">Delete</span>
              </button>
              <div className="w-px h-6 bg-white/20 mx-1"></div>
              <button 
                onClick={() => setShowLassoMenu(false)}
                className="p-2 text-blue-400 hover:bg-white/10 rounded-lg flex flex-col items-center gap-1 min-w-[50px]"
              >
                  <SelectIcon className="w-5 h-5"/>
                  <span className="text-[9px]">Resize</span>
              </button>
          </div>
      );
  };

  return (
    <div ref={containerRef} className="relative shadow-2xl rounded-sm" style={{ width: pageWidth * zoom, height: pageHeight * zoom }}>
        <canvas
          ref={canvasRef}
          width={pageWidth * zoom}
          height={pageHeight * zoom}
          className={`touch-none w-full h-full ${readOnly ? 'cursor-grab active:cursor-grabbing' : tool === ToolType.TEXT ? 'cursor-text' : tool === ToolType.ERASER ? 'cursor-none' : 'cursor-crosshair'}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={() => { if (!isDrawing) setCursorPos(null); }}
          onClick={handleCanvasClick}
          style={{ transformOrigin: 'top left' }}
        />
        {renderLassoMenu()}
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
