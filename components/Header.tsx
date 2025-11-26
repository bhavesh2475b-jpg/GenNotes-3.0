
import React, { useState } from 'react';
import { 
  HomeIcon, 
  NoteIcon, 
  SelectIcon, 
  PenIcon, 
  TextIcon, 
  ImageIcon, 
  ShapeIcon, 
  MicIcon, 
  AddIcon, 
  ShareIcon, 
  MoreIcon,
  CloudDoneIcon,
  CloudSyncIcon,
  CloudOffIcon,
  ScanIcon,
  ChevronRightIcon,
  LayoutTopIcon,
  LayoutLeftIcon,
  LayoutRightIcon,
  LayoutFloatIcon,
  VerticalScrollIcon,
  HorizontalScrollIcon,
  ViewSingleIcon,
  ViewContinuousIcon,
  EyeIcon,
  EditIcon,
  LayersIcon
} from './Icons';
import { AppMode, ToolbarDockPosition, ScrollDirection, ViewMode, PageTemplate } from '../types';

interface HeaderProps {
  activeMode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleSidebar: () => void;
  onAddPage: () => void;
  title: string;
  syncStatus?: 'synced' | 'syncing' | 'error' | 'offline';
  onGoHome?: () => void;
  onScan?: () => void;
  drawAndHoldEnabled?: boolean;
  setDrawAndHoldEnabled?: (enabled: boolean) => void;
  toolbarPosition?: ToolbarDockPosition;
  setToolbarPosition?: (pos: ToolbarDockPosition) => void;
  scrollDirection?: ScrollDirection;
  setScrollDirection?: (dir: ScrollDirection) => void;
  viewMode?: ViewMode;
  setViewMode?: (mode: ViewMode) => void;
  readOnly?: boolean;
  setReadOnly?: (readOnly: boolean) => void;
  isPageNavOpen?: boolean;
  togglePageNav?: () => void;
  defaultTemplate?: PageTemplate;
  setDefaultTemplate?: (t: PageTemplate) => void;
}

const Header: React.FC<HeaderProps> = ({
  activeMode,
  setMode,
  toggleSidebar,
  onAddPage,
  title,
  syncStatus = 'synced',
  onGoHome,
  onScan,
  drawAndHoldEnabled,
  setDrawAndHoldEnabled,
  toolbarPosition,
  setToolbarPosition,
  scrollDirection,
  setScrollDirection,
  viewMode,
  setViewMode,
  readOnly,
  setReadOnly,
  isPageNavOpen,
  togglePageNav,
  defaultTemplate,
  setDefaultTemplate
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const renderSyncIcon = () => {
      switch(syncStatus) {
          case 'synced':
              return <CloudDoneIcon className="w-5 h-5 text-green-400" />;
          case 'syncing':
              return <CloudSyncIcon className="w-5 h-5 text-blue-400 animate-pulse" />;
          case 'error':
          case 'offline':
              return <CloudOffIcon className="w-5 h-5 text-red-400" />;
      }
  };

  const templates: {label: string, value: PageTemplate}[] = [
      {label: 'Blank', value: 'blank'},
      {label: 'Ruled Narrow', value: 'ruled-narrow'},
      {label: 'Squared', value: 'squared'},
      {label: 'Dotted', value: 'dotted'},
      {label: 'Cornell', value: 'cornell'},
  ];

  return (
    <div className="h-16 bg-[#183566] flex items-center justify-between px-4 select-none shadow-md z-50">
      
      {/* Left Section: Nav */}
      <div className="flex items-center gap-2 text-white/90">
        <button onClick={onGoHome} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <HomeIcon className="w-6 h-6" />
        </button>
        <button onClick={toggleSidebar} className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden md:block">
          <NoteIcon className="w-6 h-6" />
        </button>
        {togglePageNav && (
            <button 
                onClick={togglePageNav} 
                className={`p-2 rounded-lg transition-colors ${isPageNavOpen ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/90'}`}
                title="Page Navigation"
            >
                <LayersIcon className="w-6 h-6" />
            </button>
        )}
      </div>

      {/* Center Section: Tools / Modes */}
      <div className="flex items-center gap-1">
        {readOnly ? (
            <div className="bg-black/20 px-4 py-2 rounded-full text-white/80 text-sm font-medium flex items-center gap-2">
                <EyeIcon className="w-4 h-4" />
                <span>View Only Mode</span>
            </div>
        ) : (
            <>
                <button 
                onClick={() => setMode('SELECT')}
                className={`p-2.5 rounded-lg transition-colors ${activeMode === 'SELECT' ? 'bg-[#3b5d96] text-white shadow-inner' : 'text-white/70 hover:bg-white/10'}`}
                title="Select"
                >
                <SelectIcon className="w-6 h-6" />
                </button>
                
                <button 
                onClick={() => setMode('HANDWRITING')}
                className={`p-2.5 rounded-lg transition-colors ${activeMode === 'HANDWRITING' ? 'bg-[#c3d8f8] text-[#183566]' : 'text-white/70 hover:bg-white/10'}`}
                title="Pen"
                >
                <PenIcon className="w-6 h-6" />
                </button>

                <button 
                onClick={() => setMode('TEXT')}
                className={`p-2.5 rounded-lg transition-colors ${activeMode === 'TEXT' ? 'bg-[#3b5d96] text-white shadow-inner' : 'text-white/70 hover:bg-white/10'}`}
                title="Text"
                >
                <TextIcon className="w-6 h-6" />
                </button>

                <button 
                onClick={() => setMode('IMAGE')}
                className={`p-2.5 rounded-lg transition-colors ${activeMode === 'IMAGE' ? 'bg-[#3b5d96] text-white shadow-inner' : 'text-white/70 hover:bg-white/10'}`}
                title="Image"
                >
                <ImageIcon className="w-6 h-6" />
                </button>

                <button 
                className={`p-2.5 rounded-lg transition-colors text-white/70 hover:bg-white/10`}
                title="Shapes"
                >
                <ShapeIcon className="w-6 h-6" />
                </button>
            </>
        )}
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2 text-white/90 relative">
         <div className="hidden md:flex items-center mr-2 gap-3">
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full text-xs font-medium">
                {renderSyncIcon()}
                <span className="opacity-80 capitalize">{syncStatus === 'synced' ? 'Saved' : syncStatus}</span>
            </div>
            <span className="text-sm font-medium text-white/80 max-w-[150px] truncate">{title}</span>
         </div>
         
         {/* View/Edit Toggle */}
         {setReadOnly && (
             <button 
                onClick={() => setReadOnly(!readOnly)}
                className={`p-2 rounded-lg transition-colors ${readOnly ? 'bg-[#3b5d96] text-white' : 'text-white/90 hover:bg-white/10'}`}
                title={readOnly ? "Enable Editing" : "View Only Mode"}
             >
                 {readOnly ? <EditIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
             </button>
         )}

         {/* Scan Button */}
         {!readOnly && (
            <button 
                onClick={onScan}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden sm:block text-white/90"
                title="Scan & Index Handwriting"
            >
                <ScanIcon className="w-6 h-6" />
            </button>
         )}
         
         <button className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden sm:block">
            <MicIcon className="w-6 h-6" />
         </button>
         
         <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block" />

         <button onClick={onAddPage} disabled={readOnly} className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50">
            <AddIcon className="w-6 h-6" />
         </button>
         <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ShareIcon className="w-6 h-6" />
         </button>
         
         {/* More Menu */}
         <div className="relative">
            <button 
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
                <MoreIcon className="w-6 h-6" />
            </button>

            {isMoreMenuOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsMoreMenuOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-72 bg-[#2C2C2E] border border-white/10 rounded-xl shadow-2xl py-2 z-50 text-white flex flex-col animate-in fade-in zoom-in duration-200 max-h-[80vh] overflow-y-auto">
                        <div className="px-4 py-2 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Settings
                        </div>
                        
                        <div className="px-4 py-3 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Draw and Hold</span>
                                <span className="text-[10px] text-gray-400">Auto-create shapes</span>
                            </div>
                            <button 
                                onClick={() => setDrawAndHoldEnabled?.(!drawAndHoldEnabled)}
                                className={`w-11 h-6 rounded-full transition-colors relative ${drawAndHoldEnabled ? 'bg-[#30D158]' : 'bg-[#3A3A3C]'}`}
                            >
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${drawAndHoldEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                        
                        {setDefaultTemplate && (
                             <div className="px-4 py-3 border-t border-white/10">
                                <div className="text-xs text-gray-400 mb-2">Change Template</div>
                                <select 
                                    value={defaultTemplate}
                                    onChange={(e) => setDefaultTemplate(e.target.value as PageTemplate)}
                                    className="w-full bg-[#1C1C1E] border border-white/20 rounded-md text-sm p-1.5 focus:outline-none focus:border-[#007AFF] text-white"
                                >
                                    {templates.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                    <option value="legal">Legal</option>
                                    <option value="music-paper">Music Paper</option>
                                </select>
                             </div>
                        )}

                        {setToolbarPosition && (
                            <div className="px-4 py-3 border-t border-white/10">
                                <div className="text-xs text-gray-400 mb-2">Toolbar Position</div>
                                <div className="flex bg-[#1C1C1E] rounded-lg p-1 border border-white/5 justify-between">
                                    <button 
                                        onClick={() => setToolbarPosition('top')}
                                        className={`p-1.5 rounded transition-colors ${toolbarPosition === 'top' ? 'bg-[#3A3A3C] text-white' : 'text-gray-500 hover:text-white'}`}
                                        title="Top"
                                    >
                                        <LayoutTopIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => setToolbarPosition('left')}
                                        className={`p-1.5 rounded transition-colors ${toolbarPosition === 'left' ? 'bg-[#3A3A3C] text-white' : 'text-gray-500 hover:text-white'}`}
                                        title="Left"
                                    >
                                        <LayoutLeftIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => setToolbarPosition('right')}
                                        className={`p-1.5 rounded transition-colors ${toolbarPosition === 'right' ? 'bg-[#3A3A3C] text-white' : 'text-gray-500 hover:text-white'}`}
                                        title="Right"
                                    >
                                        <LayoutRightIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => setToolbarPosition('floating')}
                                        className={`p-1.5 rounded transition-colors ${toolbarPosition === 'floating' ? 'bg-[#3A3A3C] text-white' : 'text-gray-500 hover:text-white'}`}
                                        title="Floating"
                                    >
                                        <LayoutFloatIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {setViewMode && (
                             <div className="px-4 py-3 border-t border-white/10">
                                <div className="text-xs text-gray-400 mb-2">Page View</div>
                                <div className="flex bg-[#1C1C1E] rounded-lg p-1 border border-white/5 justify-between gap-1">
                                    <button 
                                        onClick={() => setViewMode('single')}
                                        className={`flex-1 flex items-center justify-center gap-1.5 p-1.5 rounded transition-colors ${viewMode === 'single' ? 'bg-[#3A3A3C] text-white' : 'text-gray-500 hover:text-white'}`}
                                        title="Single Page"
                                    >
                                        <ViewSingleIcon className="w-5 h-5" />
                                        <span className="text-[10px]">Single</span>
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('continuous')}
                                        className={`flex-1 flex items-center justify-center gap-1.5 p-1.5 rounded transition-colors ${viewMode === 'continuous' ? 'bg-[#3A3A3C] text-white' : 'text-gray-500 hover:text-white'}`}
                                        title="Continuous"
                                    >
                                        <ViewContinuousIcon className="w-5 h-5" />
                                        <span className="text-[10px]">Continuous</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {setScrollDirection && (
                            <div className="px-4 py-3 border-t border-white/10">
                                <div className="text-xs text-gray-400 mb-2">Scrolling Direction</div>
                                <div className="flex bg-[#1C1C1E] rounded-lg p-1 border border-white/5 justify-between gap-1">
                                    <button 
                                        onClick={() => setScrollDirection('vertical')}
                                        className={`flex-1 flex items-center justify-center gap-1.5 p-1.5 rounded transition-colors ${scrollDirection === 'vertical' ? 'bg-[#3A3A3C] text-white' : 'text-gray-500 hover:text-white'}`}
                                        title="Vertical Scrolling"
                                    >
                                        <VerticalScrollIcon className="w-5 h-5" />
                                        <span className="text-[10px]">Vertical</span>
                                    </button>
                                    <button 
                                        onClick={() => setScrollDirection('horizontal')}
                                        className={`flex-1 flex items-center justify-center gap-1.5 p-1.5 rounded transition-colors ${scrollDirection === 'horizontal' ? 'bg-[#3A3A3C] text-white' : 'text-gray-500 hover:text-white'}`}
                                        title="Horizontal Scrolling"
                                    >
                                        <HorizontalScrollIcon className="w-5 h-5" />
                                        <span className="text-[10px]">Horizontal</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="h-px bg-white/10 my-1 mx-4"></div>
                        
                        <button className="px-4 py-3 hover:bg-white/10 text-left text-sm flex items-center justify-between">
                            <span>Stylus & Palm Rejection</span>
                            <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </>
            )}
         </div>
      </div>

    </div>
  );
};

export default Header;
