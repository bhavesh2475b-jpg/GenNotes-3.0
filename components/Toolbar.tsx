
import React, { useState, useRef, useEffect } from 'react';
import { ToolType, ShapeType, ToolbarDockPosition, StrokeStyle, StrokeCap, PenType } from '../types';
import { 
  PenIcon, 
  HighlighterIcon, 
  EraserIcon, 
  LassoIcon, 
  ShapeIcon, 
  DragHandleIcon,
  SquareIcon,
  CircleIcon,
  TriangleIcon,
  FillIcon,
  StrokeWidthIcon,
  RefreshIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PaletteIcon,
  StickyNoteIcon,
  MagicIcon,
  DashIcon,
  DotIcon,
  SolidLineIcon,
  FountainPenIcon,
  BallPenIcon,
  BrushPenIcon,
  CloseIcon
} from './Icons';

interface ToolbarProps {
  currentTool: ToolType;
  setTool: (tool: ToolType) => void;
  setColor: (color: string) => void;
  currentColor: string;
  setWidth: (width: number) => void;
  currentWidth: number;
  visible: boolean;
  currentShapeType: ShapeType;
  setShapeType: (shape: ShapeType) => void;
  isShapeFilled: boolean;
  setShapeFilled: (filled: boolean) => void;
  drawToConvert: boolean;
  setDrawToConvert: (enabled: boolean) => void;
  dockPosition: ToolbarDockPosition;
  shapeStyle: StrokeStyle;
  setShapeStyle: (style: StrokeStyle) => void;
  shapeCap: StrokeCap;
  setShapeCap: (cap: StrokeCap) => void;
  penType: PenType;
  setPenType: (type: PenType) => void;
  penStability: Record<PenType, number>;
  setPenStability: (stability: Record<PenType, number>) => void;
}

const defaultColors = ['#000000', '#D32F2F', '#1976D2', '#388E3C'];

const Toolbar: React.FC<ToolbarProps> = ({ 
  currentTool, 
  setTool, 
  setColor, 
  currentColor, 
  setWidth, 
  currentWidth,
  visible,
  currentShapeType,
  setShapeType,
  isShapeFilled,
  setShapeFilled,
  drawToConvert,
  setDrawToConvert,
  dockPosition = 'top',
  shapeStyle,
  setShapeStyle,
  shapeCap,
  setShapeCap,
  penType,
  setPenType,
  penStability,
  setPenStability
}) => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 200, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const toolbarStartPos = useRef({ x: 0, y: 0 });

  // Stroke Presets State
  const [presets, setPresets] = useState([2, 5, 12]);
  const [activePresetIndex, setActivePresetIndex] = useState(1);
  const [isStrokeSettingsOpen, setIsStrokeSettingsOpen] = useState(false);
  const [isPenSettingsOpen, setIsPenSettingsOpen] = useState(false);
  const penSettingsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync internal state when prop changes, but don't cause a loop
  useEffect(() => {
      // Check if currentWidth matches any preset
      const index = presets.indexOf(currentWidth);
      if (index !== -1) {
          setActivePresetIndex(index);
      }
  }, [currentWidth, presets]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (dockPosition !== 'floating') return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    toolbarStartPos.current = { x: position.x, y: position.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    setPosition({
      x: toolbarStartPos.current.x + dx,
      y: toolbarStartPos.current.y + dy
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handlePenButtonDown = (e: React.PointerEvent) => {
       if (currentTool === ToolType.PEN) {
           penSettingsTimeoutRef.current = setTimeout(() => {
               setIsPenSettingsOpen(true);
           }, 500); 
       }
  };

  const handlePenButtonUp = () => {
      if (penSettingsTimeoutRef.current) {
          clearTimeout(penSettingsTimeoutRef.current);
          penSettingsTimeoutRef.current = null;
      }
      if (currentTool !== ToolType.PEN) {
          setTool(ToolType.PEN);
      }
  };

  const handlePenButtonLeave = () => {
      if (penSettingsTimeoutRef.current) {
          clearTimeout(penSettingsTimeoutRef.current);
          penSettingsTimeoutRef.current = null;
      }
  };

  const handlePresetClick = (index: number) => {
      if (activePresetIndex === index) {
          setIsStrokeSettingsOpen(!isStrokeSettingsOpen);
      } else {
          setActivePresetIndex(index);
          setWidth(presets[index]); 
          setIsStrokeSettingsOpen(false); 
      }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = parseFloat(e.target.value);
      const newPresets = [...presets];
      newPresets[activePresetIndex] = newVal;
      setPresets(newPresets);
      setWidth(newVal); 
  };
  
  const handleStabilityChange = (val: number) => {
      setPenStability({
          ...penStability,
          [penType]: val
      });
  };

  if (!visible) return null;

  const isVertical = dockPosition === 'left' || dockPosition === 'right';
  const isFloating = dockPosition === 'floating';

  const containerStyle: React.CSSProperties = isFloating 
    ? { left: position.x, top: position.y, touchAction: 'none' }
    : {};

  const containerClassName = isFloating
    ? "fixed z-40 transition-all select-none max-w-[90vw]"
    : `fixed z-40 bg-[#1C1C1E] border-white/10 ${
        dockPosition === 'top' ? 'top-16 left-0 right-0 border-b flex justify-center py-2' : ''
      } ${
        dockPosition === 'left' ? 'top-16 left-0 bottom-0 w-[72px] border-r flex flex-col items-center py-4' : ''
      } ${
        dockPosition === 'right' ? 'top-16 right-0 bottom-0 w-[72px] border-l flex flex-col items-center py-4' : ''
      }`;

  const innerClassName = isFloating
    ? "bg-[#1C1C1E] text-white shadow-2xl rounded-full px-4 py-2 flex items-center gap-4 relative overflow-x-auto no-scrollbar max-w-full"
    : `flex ${isVertical ? 'flex-col gap-4 overflow-y-auto no-scrollbar max-h-full' : 'items-center gap-4 overflow-x-auto no-scrollbar max-w-full'} relative px-2`;

  const renderPenIcon = () => {
      switch(penType) {
          case 'fountain': return <FountainPenIcon className="w-6 h-6" />;
          case 'ball': return <BallPenIcon className="w-6 h-6" />;
          case 'brush': return <BrushPenIcon className="w-6 h-6" />;
          default: return <PenIcon className="w-6 h-6" />;
      }
  };

  return (
    <div 
      className={containerClassName}
      style={containerStyle}
    >
      <div className={innerClassName}>
        {/* Drag Handle (Only for Floating) */}
        {isFloating && (
             <div 
                className="absolute left-0 top-0 bottom-0 w-8 cursor-move flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-l-full bg-gradient-to-r from-black/20 to-transparent"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                <DragHandleIcon className="w-4 h-4 text-white/50" />
            </div>
        )}

        {/* Tools */}
        <div className={`flex items-center gap-1 ${isVertical ? 'flex-col' : ''} relative shrink-0`}>
            {/* Pen Tool with Popover */}
            <div className="relative">
                <button 
                    onPointerDown={handlePenButtonDown}
                    onPointerUp={handlePenButtonUp}
                    onPointerLeave={handlePenButtonLeave}
                    onDoubleClick={() => setIsPenSettingsOpen(true)}
                    className={`p-2 rounded-lg transition-colors relative ${currentTool === ToolType.PEN ? 'bg-[#3A3A3C] text-[#64D2FF]' : 'text-white/60 hover:text-white'}`}
                    title="Pen (Hold or Double Click for Settings)"
                >
                    {renderPenIcon()}
                    {currentTool === ToolType.PEN && (
                         <div className="absolute bottom-1 right-1 w-1 h-1 bg-current rounded-full opacity-70"></div>
                    )}
                </button>
                
                {isPenSettingsOpen && (
                    <div 
                        className={`absolute z-50 bg-[#1C1C1E] border border-white/10 rounded-xl shadow-2xl p-3 flex flex-col gap-3 min-w-[220px] animate-in fade-in zoom-in duration-200 origin-top-left
                             ${isVertical ? 'left-full top-0 ml-3' : 'top-full left-0 mt-3'}
                        `}
                    >
                        <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <span>Pen Settings</span>
                            <button onClick={() => setIsPenSettingsOpen(false)} className="hover:text-white bg-white/5 rounded-full p-1">
                                <CloseIcon className="w-3 h-3"/>
                            </button>
                        </div>
                        
                        <div className="flex bg-[#2C2C2E] p-1 rounded-lg">
                             <button 
                                onClick={() => setPenType('fountain')}
                                className={`flex-1 flex items-center justify-center py-2 rounded-md transition-all ${penType === 'fountain' ? 'bg-[#636366] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                                title="Fountain Pen"
                             >
                                 <FountainPenIcon className="w-5 h-5" />
                             </button>
                             <div className="w-px bg-white/5 my-1 mx-1"></div>
                             <button 
                                onClick={() => setPenType('ball')}
                                className={`flex-1 flex items-center justify-center py-2 rounded-md transition-all ${penType === 'ball' ? 'bg-[#636366] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                                title="Ball Pen"
                             >
                                 <BallPenIcon className="w-5 h-5" />
                             </button>
                             <div className="w-px bg-white/5 my-1 mx-1"></div>
                             <button 
                                onClick={() => setPenType('brush')}
                                className={`flex-1 flex items-center justify-center py-2 rounded-md transition-all ${penType === 'brush' ? 'bg-[#636366] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                                title="Brush Pen"
                             >
                                 <BrushPenIcon className="w-5 h-5" />
                             </button>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs text-gray-300 mb-2">
                                <span>Stroke Stability</span>
                                <span className="text-[#007AFF] font-mono">{Math.round(penStability[penType] * 100)}%</span>
                            </div>
                            <div className="relative h-6 flex items-center">
                                <div className="absolute inset-x-0 h-1 bg-gray-700 rounded-full"></div>
                                <input 
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={penStability[penType]}
                                    onChange={(e) => handleStabilityChange(parseFloat(e.target.value))}
                                    className="relative w-full h-1 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button 
            onClick={() => setTool(ToolType.ERASER)}
            className={`p-2 rounded-lg transition-colors ${currentTool === ToolType.ERASER ? 'bg-[#3A3A3C] text-[#FF453A]' : 'text-white/60 hover:text-white'}`}
            title="Eraser"
            >
            <EraserIcon className="w-6 h-6" />
            </button>
            <button 
            onClick={() => setTool(ToolType.HIGHLIGHTER)}
            className={`p-2 rounded-lg transition-colors ${currentTool === ToolType.HIGHLIGHTER ? 'bg-[#3A3A3C] text-[#FFD60A]' : 'text-white/60 hover:text-white'}`}
            title="Highlighter"
            >
            <HighlighterIcon className="w-6 h-6" />
            </button>
            <button 
            onClick={() => setTool(ToolType.SHAPE)}
            className={`p-2 rounded-lg transition-colors ${currentTool === ToolType.SHAPE ? 'bg-[#3A3A3C] text-[#4ADE80]' : 'text-white/60 hover:text-white'}`}
            title="Shape"
            >
            <ShapeIcon className="w-6 h-6" />
            </button>
            <button 
            onClick={() => setTool(ToolType.LASSO)}
            className={`p-2 rounded-lg transition-colors ${currentTool === ToolType.LASSO ? 'bg-[#3A3A3C] text-[#30D158]' : 'text-white/60 hover:text-white'}`}
            title="Lasso"
            >
            <LassoIcon className="w-6 h-6" />
            </button>
             <button 
            onClick={() => setTool(ToolType.STICKY_NOTE)}
            className={`p-2 rounded-lg transition-colors ${currentTool === ToolType.STICKY_NOTE ? 'bg-[#3A3A3C] text-[#FF9F0A]' : 'text-white/60 hover:text-white'}`}
            title="Sticky Note"
            >
            <StickyNoteIcon className="w-6 h-6" />
            </button>
        </div>

        <div className={`shrink-0 ${isVertical ? "h-px w-6 bg-white/20" : "w-px h-6 bg-white/20"}`}></div>

        {/* Colors */}
        <div className={`flex items-center gap-3 ${isVertical ? 'flex-col' : ''} shrink-0`}>
            {defaultColors.map(c => (
            <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border border-white/10 transition-transform ${currentColor === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#1C1C1E]' : ''}`}
                style={{ backgroundColor: c }}
            />
            ))}
            
            <label className={`w-6 h-6 rounded-full border border-white/10 transition-transform cursor-pointer relative flex items-center justify-center overflow-hidden ${!defaultColors.includes(currentColor) ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#1C1C1E]' : ''}`}>
                 <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-red-500 to-blue-500 opacity-80" />
                 <PaletteIcon className="w-4 h-4 text-white z-10 drop-shadow-md" />
                 <input 
                    type="color" 
                    value={currentColor}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 />
            </label>
        </div>

        <div className={`shrink-0 ${isVertical ? "h-px w-6 bg-white/20" : "w-px h-6 bg-white/20"}`}></div>

        {/* Shape Options or Width Presets */}
        {currentTool === ToolType.SHAPE ? (
            <div className={`flex items-center gap-1 animate-in fade-in zoom-in duration-200 ${isVertical ? 'flex-col' : ''} shrink-0`}>
                {!drawToConvert && (
                    <>
                        <button 
                            onClick={() => setShapeType('rectangle')}
                            className={`p-2 rounded-lg transition-all ${currentShapeType === 'rectangle' ? 'bg-[#3A3A3C] text-[#4ADE80] ring-1 ring-[#4ADE80]' : 'text-white/60 hover:text-white'}`}
                        >
                            <SquareIcon className="w-5 h-5"/>
                        </button>
                        <button 
                            onClick={() => setShapeType('circle')}
                            className={`p-2 rounded-lg transition-all ${currentShapeType === 'circle' ? 'bg-[#3A3A3C] text-[#4ADE80] ring-1 ring-[#4ADE80]' : 'text-white/60 hover:text-white'}`}
                        >
                            <CircleIcon className="w-5 h-5"/>
                        </button>
                        <button 
                            onClick={() => setShapeType('triangle')}
                            className={`p-2 rounded-lg transition-all ${currentShapeType === 'triangle' ? 'bg-[#3A3A3C] text-[#4ADE80] ring-1 ring-[#4ADE80]' : 'text-white/60 hover:text-white'}`}
                        >
                            <TriangleIcon className="w-5 h-5"/>
                        </button>
                         <div className={isVertical ? "h-px w-4 bg-white/20 my-1" : "w-px h-4 bg-white/20 mx-1"}></div>
                    </>
                )}
           
            <button 
                onClick={() => setDrawToConvert(!drawToConvert)}
                className={`p-2 rounded-lg transition-all ${drawToConvert ? 'bg-[#3A3A3C] text-[#4ADE80] ring-1 ring-[#4ADE80]' : 'text-white/60 hover:text-white'}`}
                title="Draw to Convert"
            >
                <MagicIcon className="w-5 h-5"/>
            </button>
            
            <div className={isVertical ? "h-px w-4 bg-white/20 my-1" : "w-px h-4 bg-white/20 mx-1"}></div>

            <button 
                onClick={() => setShapeStyle(shapeStyle === 'solid' ? 'dashed' : shapeStyle === 'dashed' ? 'dotted' : 'solid')}
                className={`p-2 rounded-lg transition-colors text-white/60 hover:text-white`}
                title="Line Style"
            >
                {shapeStyle === 'solid' && <SolidLineIcon className="w-5 h-5" />}
                {shapeStyle === 'dashed' && <DashIcon className="w-5 h-5" />}
                {shapeStyle === 'dotted' && <DotIcon className="w-5 h-5" />}
            </button>

             <button 
                onClick={() => setShapeCap(shapeCap === 'round' ? 'square' : 'round')}
                className={`p-2 rounded-lg transition-colors text-white/60 hover:text-white`}
                title="Line Cap"
            >
                <div className={`w-3 h-3 border border-current ${shapeCap === 'round' ? 'rounded-full' : 'rounded-none'}`}></div>
            </button>

             <div className={isVertical ? "h-px w-4 bg-white/20 my-1" : "w-px h-4 bg-white/20 mx-1"}></div>
            
            <button 
                onClick={() => setShapeFilled(!isShapeFilled)}
                className={`p-2 rounded-lg transition-colors ${isShapeFilled ? 'bg-[#3A3A3C] text-[#4ADE80]' : 'text-white/60 hover:text-white'}`}
                title="Toggle Fill"
            >
                <FillIcon className="w-5 h-5"/>
            </button>
            </div>
        ) : (
            <div className={`flex items-center gap-4 relative ${isVertical ? 'flex-col' : ''} shrink-0`}>
                {/* 3 Preset Slots */}
                {presets.map((presetWidth, i) => (
                    <button
                        key={i}
                        onClick={() => handlePresetClick(i)}
                        className={`relative rounded-full transition-all flex items-center justify-center w-8 h-8 ${activePresetIndex === i ? 'text-blue-400' : 'text-white/60 hover:text-white'}`}
                    >
                         <StrokeWidthIcon height={Math.min(14, Math.max(2, presetWidth / 2 + 2))} className="w-6" />
                        
                        {activePresetIndex === i && (
                            <div className="absolute inset-0 rounded-full ring-2 ring-blue-400 opacity-100" />
                        )}
                    </button>
                ))}

                {/* Detailed Stroke Settings Modal */}
                {isStrokeSettingsOpen && (
                    <div 
                        className={`absolute w-72 bg-[#1C1C1E]/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/10 p-4 animate-in fade-in zoom-in duration-200 z-50
                            ${isVertical && dockPosition === 'left' ? 'left-full top-0 ml-4 origin-left' : ''}
                            ${isVertical && dockPosition === 'right' ? 'right-full top-0 mr-4 origin-right' : ''}
                            ${!isVertical ? 'bottom-full left-1/2 -translate-x-1/2 mb-4 origin-bottom' : ''}
                        `}
                    >
                         <div className="flex items-center justify-between mb-4">
                             <span className="text-sm font-semibold">Stroke Settings</span>
                             <div className="flex items-center gap-2">
                                 <span className="text-xs text-gray-400">{(presets[activePresetIndex] * 0.25).toFixed(2)} mm</span>
                                 <button onClick={() => {}} className="text-gray-400 hover:text-white">
                                    <RefreshIcon className="w-4 h-4" />
                                 </button>
                             </div>
                         </div>
                         
                         <div className="flex justify-between items-center mb-6 px-4">
                             {presets.map((val, idx) => (
                                 <button 
                                    key={`modal-${idx}`}
                                    onClick={() => {
                                        setActivePresetIndex(idx);
                                        setWidth(presets[idx]);
                                    }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${activePresetIndex === idx ? 'bg-[#007AFF] text-white' : 'bg-[#2C2C2E] text-gray-400 hover:bg-[#3A3A3C]'}`}
                                 >
                                    <StrokeWidthIcon height={Math.min(12, Math.max(2, val / 2 + 2))} className="w-6" />
                                 </button>
                             ))}
                         </div>

                         <div className="mb-6 px-1">
                             <input 
                                type="range"
                                min="0.5"
                                max="20"
                                step="0.5"
                                value={presets[activePresetIndex]}
                                onChange={handleSliderChange}
                                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#007AFF]"
                             />
                         </div>
                         
                         <div className="flex items-center justify-between py-2 border-t border-white/10 mt-2 cursor-pointer hover:bg-white/5 rounded px-2 -mx-2">
                             <span className="text-sm font-medium text-gray-300">Stroke Type</span>
                             <div className="flex items-center gap-1 text-gray-400">
                                 <span className="text-xs">Solid</span>
                                 <ChevronRightIcon className="w-4 h-4" />
                             </div>
                         </div>
                    </div>
                )}
            </div>
        )}

      </div>
    </div>
  );
};

export default Toolbar;
