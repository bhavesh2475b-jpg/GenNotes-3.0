
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Toolbar from './components/Toolbar';
import Header from './components/Header';
import Canvas from './components/Canvas';
import Home from './components/Home';
import AIAssistant from './components/AIAssistant';
import CreateNotebookModal from './components/CreateNotebookModal';
import PageNavigator from './components/PageNavigator';
import { ToolType, Notebook, Page, CanvasElement, NotebookType, PageTemplate, TextElement, AppMode, ShapeType, CanvasHandle, ToolbarDockPosition, StrokeStyle, StrokeCap, PenType, ScrollDirection, ViewMode } from './types';
import { SparklesIcon, CloseIcon, ZoomInIcon, ZoomOutIcon, ScanIcon, UndoIcon, RedoIcon, CopyIcon } from './components/Icons';
import { generateMeetingTemplate, recognizeHandwriting } from './services/geminiService';
import { loadNotebooksFromCloud, saveNotebooksToCloud } from './services/storageService';

// Initial Mock Data
const createPage = (template: PageTemplate = 'ruled-narrow'): Page => ({
  id: crypto.randomUUID(),
  elements: [],
  template
});

const createNotebook = (title: string, color: string, type: NotebookType = 'notebook', template: PageTemplate = 'ruled-narrow', orientation: 'portrait' | 'landscape' = 'portrait', paperColor?: string): Notebook => ({
  id: crypto.randomUUID(),
  title,
  type,
  coverColor: color,
  orientation,
  paperColor,
  pages: [createPage(template)],
  updatedAt: new Date(),
});

const initialNotebooks = [
  createNotebook('Physics 101', '#89CFF0', 'notebook', 'squared'),
  createNotebook('Project Brainstorm', '#FFFFFF', 'whiteboard', 'dotted'),
  createNotebook('Daily Journal', '#E6EE9C', 'notebook', 'ruled-narrow'),
];

type ViewState = 'HOME' | 'WORKSPACE';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [notebooks, setNotebooks] = useState<Notebook[]>(initialNotebooks);
  const [currentNotebookId, setCurrentNotebookId] = useState<string>(initialNotebooks[0].id);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewPageModalOpen, setIsNewPageModalOpen] = useState(false); 
  const [isCreateNotebookModalOpen, setIsCreateNotebookModalOpen] = useState(false); 
  const [isPageNavOpen, setIsPageNavOpen] = useState(false);

  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isAIContextMenuOpen, setIsAIContextMenuOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [readOnly, setReadOnly] = useState(false);
  
  // Settings
  const [drawAndHoldEnabled, setDrawAndHoldEnabled] = useState(true);
  const [drawToConvert, setDrawToConvert] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<ToolbarDockPosition>('top');
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('vertical');
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [defaultTemplate, setDefaultTemplate] = useState<PageTemplate>('ruled-narrow');

  // Cloud Sync State
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
  const [hasLoadedFromCloud, setHasLoadedFromCloud] = useState(false);

  // App Mode & Tools
  const [activeMode, setActiveMode] = useState<AppMode>('HANDWRITING');
  // Set default tool to LASSO as requested
  const [tool, setTool] = useState<ToolType>(ToolType.LASSO);
  const [color, setColor] = useState('#000000');
  const [width, setWidth] = useState(2);
  const [penType, setPenType] = useState<PenType>('fountain');
  const [penStability, setPenStability] = useState<Record<PenType, number>>({
      fountain: 0.2,
      ball: 0.5,
      brush: 0.1
  });
  
  // Shape State
  const [shapeType, setShapeType] = useState<ShapeType>('rectangle');
  const [isShapeFilled, setIsShapeFilled] = useState(false);
  const [shapeStyle, setShapeStyle] = useState<StrokeStyle>('solid');
  const [shapeCap, setShapeCap] = useState<StrokeCap>('round');
  
  // History State
  const [history, setHistory] = useState<Record<string, { past: CanvasElement[][], future: CanvasElement[][] }>>({});

  // Clipboard
  const [clipboard, setClipboard] = useState<CanvasElement[]>([]);

  // Refs
  const canvasRef = useRef<CanvasHandle>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentNotebook = notebooks.find(n => n.id === currentNotebookId) || notebooks[0];
  const currentPage = currentNotebook.pages[currentPageIndex];
  const currentHistory = history[currentPage.id] || { past: [], future: [] };

  useEffect(() => {
    const initCloud = async () => {
        setSyncStatus('syncing');
        const cloudData = await loadNotebooksFromCloud();
        if (cloudData) {
            setNotebooks(cloudData);
            if (cloudData.length > 0) setCurrentNotebookId(cloudData[0].id);
        }
        setHasLoadedFromCloud(true);
        setSyncStatus('synced');
    };
    initCloud();
  }, []);

  useEffect(() => {
      if (!hasLoadedFromCloud) return;
      setSyncStatus('syncing');
      const timer = setTimeout(async () => {
          try {
              await saveNotebooksToCloud(notebooks);
              setSyncStatus('synced');
          } catch (e) {
              setSyncStatus('error');
          }
      }, 2000); 
      return () => clearTimeout(timer);
  }, [notebooks, hasLoadedFromCloud]);

  useEffect(() => {
    if (activeMode === 'SELECT') setTool(ToolType.SELECT);
    else if (activeMode === 'TEXT') setTool(ToolType.TEXT);
    else if (activeMode === 'HANDWRITING') {
        if (tool !== ToolType.PEN && tool !== ToolType.HIGHLIGHTER && tool !== ToolType.ERASER && tool !== ToolType.SHAPE && tool !== ToolType.LASSO) {
            setTool(ToolType.PEN);
        }
    }
  }, [activeMode]);

  const handleSetTool = (newTool: ToolType) => {
      if (readOnly) return;
      setTool(newTool);
      if (newTool === ToolType.SELECT) setActiveMode('SELECT');
      else if (newTool === ToolType.TEXT) setActiveMode('TEXT');
      else setActiveMode('HANDWRITING');
  };

  const handleUpdatePage = (newElements: CanvasElement[], pageIndex: number = currentPageIndex, addToHistory = true) => {
    const targetPage = currentNotebook.pages[pageIndex];

    if (addToHistory) {
      setHistory(prev => ({
        ...prev,
        [targetPage.id]: {
          past: [...(prev[targetPage.id]?.past || []), targetPage.elements],
          future: []
        }
      }));
    }

    setNotebooks(prev => prev.map(nb => {
      if (nb.id === currentNotebookId) {
        const newPages = [...nb.pages];
        newPages[pageIndex] = { ...newPages[pageIndex], elements: newElements };
        return { ...nb, pages: newPages, updatedAt: new Date() };
      }
      return nb;
    }));
  };

  const handleUndo = useCallback(() => {
    if (currentHistory.past.length === 0) return;
    const previousElements = currentHistory.past[currentHistory.past.length - 1];
    const newPast = currentHistory.past.slice(0, -1);
    setHistory(prev => ({
      ...prev,
      [currentPage.id]: {
        past: newPast,
        future: [currentPage.elements, ...currentHistory.future]
      }
    }));
    handleUpdatePage(previousElements, currentPageIndex, false);
  }, [currentHistory, currentPage, currentPageIndex]);

  const handleRedo = useCallback(() => {
    if (currentHistory.future.length === 0) return;
    const nextElements = currentHistory.future[0];
    const newFuture = currentHistory.future.slice(1);
    setHistory(prev => ({
      ...prev,
      [currentPage.id]: {
        past: [...currentHistory.past, currentPage.elements],
        future: newFuture
      }
    }));
    handleUpdatePage(nextElements, currentPageIndex, false);
  }, [currentHistory, currentPage, currentPageIndex]);

  // Handle detailed notebook creation from the modal
  const handleCreateNotebook = (title: string, coverColor: string, template: PageTemplate, orientation: 'portrait' | 'landscape', paperColor: string) => {
    const newNb = createNotebook(title, coverColor, 'notebook', template, orientation, paperColor);
    setNotebooks([...notebooks, newNb]);
    setCurrentNotebookId(newNb.id);
    setCurrentPageIndex(0);
    setIsCreateNotebookModalOpen(false);
    setCurrentView('WORKSPACE');
  };

  const handleAddPage = async (template: PageTemplate, topic?: string) => {
      setIsNewPageModalOpen(false);
      let newPage = createPage(template);

      if (template === 'meeting' && topic) {
          setIsGeneratingTemplate(true);
          try {
              const data = await generateMeetingTemplate(topic);
              const textElements: TextElement[] = [
                  { id: crypto.randomUUID(), type: 'text', x: 50, y: 50, content: data.title, fontSize: 32, color: '#000000' },
                  { id: crypto.randomUUID(), type: 'text', x: 50, y: 100, content: `Date: ${new Date().toLocaleDateString()}`, fontSize: 16, color: '#666666' },
                  { id: crypto.randomUUID(), type: 'text', x: 50, y: 140, content: "Attendees:", fontSize: 20, color: '#000000' },
                  ...data.attendees.map((att, i) => ({
                      id: crypto.randomUUID(), type: 'text' as const, x: 70, y: 170 + (i * 25), content: `• ${att}`, fontSize: 16, color: '#333333'
                  })),
                  { id: crypto.randomUUID(), type: 'text', x: 400, y: 140, content: "Agenda / Notes:", fontSize: 20, color: '#000000' },
                  ...data.agenda.map((item, i) => ({
                      id: crypto.randomUUID(), type: 'text' as const, x: 420, y: 170 + (i * 40), content: `${i+1}. ${item}`, fontSize: 16, color: '#333333'
                  })),
              ];
              newPage.elements = textElements;
          } catch(e) {
              console.error("Failed to generate template");
          } finally {
              setIsGeneratingTemplate(false);
          }
      }

      setNotebooks(prev => prev.map(nb => {
          if (nb.id === currentNotebookId) {
            return { ...nb, pages: [...nb.pages, newPage], updatedAt: new Date() };
          }
          return nb;
      }));
      
      // If we are in single view mode, jump to new page
      if (viewMode === 'single') {
         setTimeout(() => {
             const nb = notebooks.find(n => n.id === currentNotebookId);
             if (nb) setCurrentPageIndex(nb.pages.length); 
         }, 100);
      }
  };

  const handleDeletePage = (index: number) => {
      if (currentNotebook.pages.length <= 1) {
          alert("Cannot delete the last page.");
          return;
      }
      setNotebooks(prev => prev.map(nb => {
          if (nb.id === currentNotebookId) {
              const newPages = nb.pages.filter((_, i) => i !== index);
              return { ...nb, pages: newPages, updatedAt: new Date() };
          }
          return nb;
      }));
      if (currentPageIndex >= index && currentPageIndex > 0) {
          setCurrentPageIndex(currentPageIndex - 1);
      }
  };

  const handleReorderPage = (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      
      setNotebooks(prev => prev.map(nb => {
          if (nb.id === currentNotebookId) {
              const newPages = [...nb.pages];
              const [movedPage] = newPages.splice(fromIndex, 1);
              newPages.splice(toIndex, 0, movedPage);
              return { ...nb, pages: newPages, updatedAt: new Date() };
          }
          return nb;
      }));

      // Update current page index if the active page was moved
      if (currentPageIndex === fromIndex) {
          setCurrentPageIndex(toIndex);
      } else if (currentPageIndex > fromIndex && currentPageIndex <= toIndex) {
          setCurrentPageIndex(currentPageIndex - 1);
      } else if (currentPageIndex < fromIndex && currentPageIndex >= toIndex) {
          setCurrentPageIndex(currentPageIndex + 1);
      }
  };

  const handleCopy = (elements: CanvasElement[]) => {
      setClipboard(JSON.parse(JSON.stringify(elements)));
  };

  const handleCut = (elements: CanvasElement[]) => {
      handleCopy(elements);
      // Remove elements from canvas
      const newElements = currentPage.elements.filter(el => !elements.some(cutEl => cutEl.id === el.id));
      handleUpdatePage(newElements, currentPageIndex);
  };

  const handlePaste = useCallback(() => {
      if (clipboard.length === 0 || readOnly) return;
      
      const newElements = clipboard.map(el => ({
          ...el,
          id: crypto.randomUUID(),
          // Offset pasted elements slightly so they don't overlap perfectly
          ...(el.type === 'stroke' ? { points: el.points.map(p => ({ ...p, x: p.x + 20, y: p.y + 20 })) } : { x: el.x + 20, y: el.y + 20 })
      }));
      
      handleUpdatePage([...currentPage.elements, ...newElements], currentPageIndex);
  }, [clipboard, currentPage, currentPageIndex, readOnly]);

  const handleScanPage = async () => {
      if (!canvasRef.current) return;
      const snapshot = canvasRef.current.getSnapshot();
      if (!snapshot) return;

      setIsScanning(true);
      try {
          const transcription = await recognizeHandwriting(snapshot);
          // Update the current page with transcription
          setNotebooks(prev => prev.map(nb => {
              if (nb.id === currentNotebookId) {
                  const newPages = [...nb.pages];
                  newPages[currentPageIndex] = { 
                      ...newPages[currentPageIndex], 
                      transcription: transcription 
                  };
                  return { ...nb, pages: newPages };
              }
              return nb;
          }));
          alert("Handwriting recognized and indexed!");
      } catch (e) {
          console.error("Scanning failed", e);
          alert("Failed to scan handwriting.");
      } finally {
          setIsScanning(false);
      }
  };
  
  const handleZoomChange = (newZoom: number) => {
      setZoom(Math.min(3, Math.max(0.5, newZoom)));
  };

  const handlePan = (dx: number, dy: number) => {
      if (scrollContainerRef.current) {
          if (scrollDirection === 'vertical' || scrollDirection === 'none') {
             scrollContainerRef.current.scrollTop -= dy;
          }
          if (scrollDirection === 'horizontal' || scrollDirection === 'none') {
             scrollContainerRef.current.scrollLeft -= dx;
          }
      }
  };

  const pageContext = useMemo(() => {
    const textElements = currentPage.elements
      .filter(el => el.type === 'text')
      .map(el => (el as any).content)
      .join('\n');
    return textElements ? `Text on page:\n${textElements}` : "The page contains drawings.";
  }, [currentPage]);

  const handleOpenNotebook = (id: string) => {
      setCurrentNotebookId(id);
      setCurrentPageIndex(0);
      setCurrentView('WORKSPACE');
      setReadOnly(false);
  };

  if (currentView === 'HOME') {
      return (
          <>
            <Home 
                notebooks={notebooks} 
                onOpenNotebook={handleOpenNotebook}
                onCreateNotebook={() => setIsCreateNotebookModalOpen(true)}
            />
            {isCreateNotebookModalOpen && (
                <CreateNotebookModal 
                    onClose={() => setIsCreateNotebookModalOpen(false)}
                    onCreate={handleCreateNotebook}
                />
            )}
          </>
      );
  }

  // Calculate canvas margin based on docked toolbar
  const getCanvasMargin = () => {
      if (activeMode !== 'HANDWRITING' || readOnly) return '';
      if (toolbarPosition === 'top') return 'mt-[60px]';
      if (toolbarPosition === 'left') return 'ml-[72px]';
      if (toolbarPosition === 'right') return 'mr-[72px]';
      return '';
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#242424] font-sans overflow-hidden">
      
      <Header 
        activeMode={activeMode}
        setMode={setActiveMode}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onAddPage={() => setIsNewPageModalOpen(true)}
        title={currentNotebook.title}
        syncStatus={syncStatus}
        onGoHome={() => setCurrentView('HOME')}
        onScan={handleScanPage}
        drawAndHoldEnabled={drawAndHoldEnabled}
        setDrawAndHoldEnabled={setDrawAndHoldEnabled}
        toolbarPosition={toolbarPosition}
        setToolbarPosition={setToolbarPosition}
        scrollDirection={scrollDirection}
        setScrollDirection={setScrollDirection}
        viewMode={viewMode}
        setViewMode={setViewMode}
        readOnly={readOnly}
        setReadOnly={setReadOnly}
        isPageNavOpen={isPageNavOpen}
        togglePageNav={() => setIsPageNavOpen(!isPageNavOpen)}
        defaultTemplate={defaultTemplate}
        setDefaultTemplate={setDefaultTemplate}
      />

      <div className="flex flex-1 relative overflow-hidden">
        
        {/* Page Navigator Sidebar */}
        <PageNavigator 
            pages={currentNotebook.pages}
            currentPageIndex={currentPageIndex}
            onSelectPage={(index) => { setCurrentPageIndex(index); }}
            onAddPage={() => handleAddPage(defaultTemplate)}
            onDeletePage={handleDeletePage}
            onReorderPage={handleReorderPage}
            isOpen={isPageNavOpen}
            onClose={() => setIsPageNavOpen(false)}
        />

        <div className="flex-1 relative bg-[#333333] overflow-hidden flex flex-col">
           
           {/* Floating Undo/Redo Tabs + Paste */}
            <div className="absolute top-6 left-6 z-40 bg-[#1C1C1E]/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg flex items-center p-1 gap-1">
                <button 
                    onClick={handleUndo} 
                    disabled={currentHistory.past.length === 0 || readOnly} 
                    className="p-2 text-white/90 hover:bg-white/10 rounded-lg disabled:opacity-40 transition-colors"
                    title="Undo"
                >
                    <UndoIcon className="w-5 h-5" />
                </button>
                <div className="w-px h-5 bg-white/10"></div>
                <button 
                    onClick={handleRedo} 
                    disabled={currentHistory.future.length === 0 || readOnly} 
                    className="p-2 text-white/90 hover:bg-white/10 rounded-lg disabled:opacity-40 transition-colors"
                    title="Redo"
                >
                    <RedoIcon className="w-5 h-5" />
                </button>
                
                {/* Paste Shortcut */}
                {!readOnly && clipboard.length > 0 && (
                    <>
                    <div className="w-px h-5 bg-white/10"></div>
                    <button 
                        onClick={handlePaste} 
                        className="p-2 text-white/90 hover:bg-white/10 rounded-lg transition-colors"
                        title="Paste"
                    >
                        <CopyIcon className="w-5 h-5" />
                        <span className="sr-only">Paste</span>
                    </button>
                    </>
                )}
            </div>

           <div 
             ref={scrollContainerRef}
             className={`flex-1 overflow-auto flex relative p-4 md:p-8 touch-pan-x touch-pan-y ${getCanvasMargin()}`}
           >
               {(isGeneratingTemplate || isScanning) && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-sm pointer-events-none">
                        <div className="flex items-center gap-3 bg-white p-5 rounded-xl shadow-xl">
                            {isScanning ? <ScanIcon className="animate-pulse text-primary w-6 h-6" /> : <SparklesIcon className="animate-spin text-primary w-6 h-6" />}
                            <span className="font-medium text-lg text-gray-800">{isScanning ? "Analyzing Handwriting..." : "Generating Template..."}</span>
                        </div>
                    </div>
                )}
                
                {/* Content Area */}
                {viewMode === 'single' ? (
                     <div className="m-auto relative shadow-2xl origin-top-left">
                        <Canvas 
                            ref={canvasRef}
                            elements={currentPage.elements}
                            onElementsChange={(elements) => handleUpdatePage(elements, currentPageIndex)}
                            tool={tool}
                            color={color}
                            width={width}
                            zoom={zoom}
                            template={currentPage.template}
                            onCopy={handleCopy}
                            onCut={handleCut}
                            shapeType={shapeType}
                            isShapeFilled={isShapeFilled}
                            orientation={currentNotebook.orientation}
                            paperColor={currentNotebook.paperColor}
                            onZoomChange={handleZoomChange}
                            drawAndHoldEnabled={drawAndHoldEnabled}
                            drawToConvert={drawToConvert}
                            shapeStyle={shapeStyle}
                            shapeCap={shapeCap}
                            onPan={handlePan}
                            penType={penType}
                            penStability={penStability[penType]}
                            readOnly={readOnly}
                        />
                    </div>
                ) : (
                    <div 
                        className={`flex gap-6 m-auto ${scrollDirection === 'horizontal' ? 'flex-row' : 'flex-col'}`}
                    >
                        {currentNotebook.pages.map((page, index) => (
                             <div 
                                key={page.id} 
                                className="relative shadow-2xl origin-top-left"
                                onClick={() => setCurrentPageIndex(index)} // Click to make active
                             >
                                <Canvas 
                                    // Use ref only for active page if needed, or null in continuous mode to avoid refs conflict
                                    ref={index === currentPageIndex ? canvasRef : null} 
                                    elements={page.elements}
                                    onElementsChange={(elements) => handleUpdatePage(elements, index)}
                                    tool={tool}
                                    color={color}
                                    width={width}
                                    zoom={zoom}
                                    template={page.template}
                                    onCopy={handleCopy}
                                    onCut={handleCut}
                                    shapeType={shapeType}
                                    isShapeFilled={isShapeFilled}
                                    orientation={currentNotebook.orientation}
                                    paperColor={currentNotebook.paperColor}
                                    onZoomChange={handleZoomChange}
                                    drawAndHoldEnabled={drawAndHoldEnabled}
                                    drawToConvert={drawToConvert}
                                    shapeStyle={shapeStyle}
                                    shapeCap={shapeCap}
                                    onPan={handlePan}
                                    penType={penType}
                                    penStability={penStability[penType]}
                                    readOnly={readOnly}
                                />
                                {index === currentPageIndex && (
                                     <div className="absolute -left-4 top-4 w-1 h-12 bg-blue-500 rounded-full shadow-lg" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
           </div>
           
           <Toolbar 
             currentTool={tool}
             setTool={handleSetTool}
             setColor={setColor}
             currentColor={color}
             setWidth={setWidth}
             currentWidth={width}
             visible={activeMode === 'HANDWRITING' && !readOnly}
             currentShapeType={shapeType}
             setShapeType={setShapeType}
             isShapeFilled={isShapeFilled}
             setShapeFilled={setIsShapeFilled}
             drawToConvert={drawToConvert}
             setDrawToConvert={setDrawToConvert}
             dockPosition={toolbarPosition}
             shapeStyle={shapeStyle}
             setShapeStyle={setShapeStyle}
             shapeCap={shapeCap}
             setShapeCap={setShapeCap}
             penType={penType}
             setPenType={setPenType}
             penStability={penStability}
             setPenStability={setPenStability}
           />

           {viewMode === 'single' && (
               <div className="absolute bottom-6 left-6 bg-[#1C1C1E] text-white/90 px-4 py-2 rounded-full shadow-lg text-sm font-medium z-40 backdrop-blur-md bg-opacity-90 flex items-center gap-2 border border-white/10">
                   <button 
                    disabled={currentPageIndex === 0}
                    onClick={() => setCurrentPageIndex(p => p - 1)}
                    className="hover:text-blue-300 disabled:opacity-30"
                   >
                     &lt;
                   </button>
                   <span>Page {currentPageIndex + 1} of {currentNotebook.pages.length}</span>
                   <button 
                    disabled={currentPageIndex === currentNotebook.pages.length - 1}
                    onClick={() => setCurrentPageIndex(p => p + 1)}
                    className="hover:text-blue-300 disabled:opacity-30"
                   >
                     &gt;
                   </button>
               </div>
           )}
           
           {viewMode === 'continuous' && (
                <div className="absolute bottom-6 left-6 bg-[#1C1C1E] text-white/90 px-4 py-2 rounded-full shadow-lg text-sm font-medium z-40 backdrop-blur-md bg-opacity-90 border border-white/10">
                    <span>{currentNotebook.pages.length} Pages</span>
                </div>
           )}

           <div className="absolute bottom-6 right-6 bg-[#1C1C1E] text-white/90 p-2 rounded-full shadow-lg flex items-center gap-3 z-40 backdrop-blur-md bg-opacity-90 border border-white/10">
              <button 
                onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} 
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                  <ZoomOutIcon className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium w-10 text-center select-none">{Math.round(zoom * 100)}%</span>
              <button 
                onClick={() => setZoom(z => Math.min(3, z + 0.1))} 
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                  <ZoomInIcon className="w-5 h-5" />
              </button>
           </div>

        </div>
      </div>

      <AIAssistant 
        isOpen={isAIContextMenuOpen} 
        onClose={() => setIsAIContextMenuOpen(false)}
        pageContent={pageContext}
      />

      {isNewPageModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setIsNewPageModalOpen(false)}>
              <div className="bg-[#1E1E1E] text-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '80vh' }} onClick={e => e.stopPropagation()}>
                  <div className="p-6 border-b border-white/10 flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Add New Page</h2>
                      <button onClick={() => setIsNewPageModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                          <CloseIcon />
                      </button>
                  </div>
                  <div className="p-6 grid grid-cols-3 gap-4 overflow-y-auto">
                      <button onClick={() => handleAddPage('blank')} className="p-4 bg-[#2C2C2E] rounded-lg hover:bg-[#3A3A3C]">Blank</button>
                      <button onClick={() => handleAddPage('ruled-narrow')} className="p-4 bg-[#2C2C2E] rounded-lg hover:bg-[#3A3A3C]">Ruled</button>
                      <button onClick={() => handleAddPage('dotted')} className="p-4 bg-[#2C2C2E] rounded-lg hover:bg-[#3A3A3C]">Dotted</button>
                      <button onClick={() => handleAddPage('squared')} className="p-4 bg-[#2C2C2E] rounded-lg hover:bg-[#3A3A3C]">Squared</button>
                      <button onClick={() => handleAddPage('cornell')} className="p-4 bg-[#2C2C2E] rounded-lg hover:bg-[#3A3A3C]">Cornell</button>
                      <button onClick={() => { const t = prompt("Topic?"); if(t) handleAddPage('meeting', t); }} className="p-4 bg-blue-900 rounded-lg hover:bg-blue-800">AI Meeting</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default App;
