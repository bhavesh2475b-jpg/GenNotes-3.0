
import React, { useState, useEffect } from 'react';
import { PageTemplate } from '../types';
import { ChevronDownIcon, CloseIcon } from './Icons';

interface CreateNotebookModalProps {
    onClose: () => void;
    onCreate: (title: string, coverColor: string, template: PageTemplate, orientation: 'portrait' | 'landscape', paperColor: string) => void;
}

interface PaperThumbnailProps {
    template: PageTemplate;
    label: string;
    isSelected: boolean;
    onSelect: (template: PageTemplate) => void;
    orientation: 'portrait' | 'landscape';
    paperColorMode: 'White Paper' | 'Dark Paper' | 'Yellow Paper';
}

const PaperThumbnail: React.FC<PaperThumbnailProps> = ({ template, label, isSelected, onSelect, orientation, paperColorMode }) => {
    // Determine background color based on mode
    let bg = '#FDFBF7'; // Default White
    if (paperColorMode === 'Dark Paper') bg = '#1E1E1E';
    if (paperColorMode === 'Yellow Paper') bg = '#FFF9C4';

    // Pattern logic
    const getBgStyle = () => {
        // Line colors need to adapt to background
        const isDark = paperColorMode === 'Dark Paper' || template === 'black' || template === 'geometric';
        
        // Adjust grid/line colors based on mode
        const lineColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        const strongLineColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
        const redLine = '#FF5252';
        const blueLine = '#42A5F5';

        const line = `linear-gradient(${lineColor} 1px, transparent 1px)`;
        const line90 = `linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`;
        
        // Special case overrides for specific named templates that imply color
        if (template === 'black') return { backgroundColor: '#1E1E1E' };

        switch (template) {
            case 'squared': return { backgroundImage: `${line}, ${line90}`, backgroundSize: '10px 10px', backgroundColor: bg };
            case 'dotted': return { backgroundImage: `radial-gradient(${strongLineColor} 1px, transparent 1px)`, backgroundSize: '10px 10px', backgroundColor: bg };
            case 'ruled-narrow': return { backgroundImage: line, backgroundSize: '100% 12px', backgroundColor: bg };
            case 'ruled-wide': return { backgroundImage: line, backgroundSize: '100% 20px', backgroundColor: bg };
            case 'legal': return { backgroundColor: bg, borderLeft: `4px solid ${redLine}`, backgroundImage: `linear-gradient(${blueLine} 1px, transparent 1px)`, backgroundSize: '100% 20px' };
            case 'cornell': return { backgroundColor: bg, backgroundImage: `linear-gradient(90deg, transparent 30%, ${redLine} 30%, ${redLine} 31%, transparent 31%)` };
            case 'geometric': return { backgroundColor: isDark ? '#1E1E1E' : bg, border: '1px solid #333', backgroundImage: `repeating-linear-gradient(45deg, ${lineColor} 0, ${lineColor} 1px, transparent 0, transparent 50%)`, backgroundSize: '10px 10px' };
            case 'hexagonal': return { backgroundColor: bg, backgroundImage: `radial-gradient(${strongLineColor} 2px, transparent 2px)`, backgroundSize: '15px 15px' };
            case 'isometric': return { backgroundColor: bg, backgroundImage: `linear-gradient(30deg, ${lineColor} 1px, transparent 1px), linear-gradient(150deg, ${lineColor} 1px, transparent 1px)`, backgroundSize: '10px 10px' };
            case 'letters': return { backgroundColor: isDark ? '#1E1E1E' : bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#333' : '#eee', fontSize: '20px', fontWeight: 'bold' }; 
            default: return { backgroundColor: bg };
        }
    };

    const isPortrait = orientation === 'portrait';
    const width = isPortrait ? 'w-24' : 'w-32';
    const height = isPortrait ? 'h-32' : 'h-24';
    const style = getBgStyle();

    return (
        <div 
            onClick={() => onSelect(template)}
            className="flex flex-col gap-2 items-center cursor-pointer group flex-shrink-0 snap-start"
        >
            <div 
                className={`${width} ${height} rounded-md shadow-sm relative overflow-hidden transition-all duration-200 ${isSelected ? 'ring-2 ring-[#007AFF] ring-offset-2 ring-offset-[#1C1C1E]' : 'hover:ring-2 hover:ring-white/20'}`} 
                style={style}
            >
                {template === 'monthly-b' && <div className={`grid grid-cols-7 grid-rows-5 w-full h-full border opacity-20 ${paperColorMode === 'Dark Paper' ? 'border-white' : 'border-black'}`}><div className={`border-r border-b ${paperColorMode === 'Dark Paper' ? 'border-white' : 'border-black'}`}></div></div>}
                {template.includes('column') && <div className="absolute inset-0 flex"><div className={`w-1/2 border-r ${paperColorMode === 'Dark Paper' ? 'border-white/10' : 'border-black/10'}`}></div></div>}
                {template === 'letters' && 'Aa'}
            </div>
            <span className={`text-[11px] text-center max-w-[100px] leading-tight truncate px-1 ${isSelected ? 'text-[#007AFF] font-medium' : 'text-gray-400 group-hover:text-white'}`}>
                {label}
            </span>
        </div>
    );
};

type PaperColor = 'All Paper' | 'White Paper' | 'Dark Paper' | 'Yellow Paper';

const CreateNotebookModal: React.FC<CreateNotebookModalProps> = ({ onClose, onCreate }) => {
    const [title, setTitle] = useState('Untitled Notebook');
    const [activeTab, setActiveTab] = useState<'cover' | 'paper'>('paper');
    const [selectedCover, setSelectedCover] = useState('#89CFF0'); 
    const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate>('squared');
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    
    // Dropdown State
    const [selectedPaperColor, setSelectedPaperColor] = useState<PaperColor>('White Paper');
    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);

    // Categories without hardcoded color filtering (we apply dynamic colors now)
    const paperCategories = [
        {
            name: "Essentials",
            items: [
                { id: 'blank', label: 'Blank' },
                { id: 'dotted', label: 'Dotted Paper' },
                { id: 'ruled-narrow', label: 'Ruled Narrow' },
                { id: 'ruled-wide', label: 'Ruled Wide' },
                { id: 'squared', label: 'Squared Paper' },
            ]
        },
        {
            name: "Writing papers",
            items: [
                { id: 'cornell', label: 'Cornell' },
                { id: 'legal', label: 'Legal' },
                { id: 'single-column', label: 'Single Column' },
                { id: 'single-column-mix', label: 'Single Column Mix' },
                { id: 'two-column', label: 'Two Column' },
                { id: 'three-column', label: 'Three Column' },
            ]
        },
        {
            name: "Planner",
            items: [
                { id: 'accounting', label: 'Accounting' },
                { id: 'monthly-b', label: 'Monthly Planner B' },
                { id: 'monthly-c', label: 'Monthly Planner C' },
                { id: 'todos', label: 'Todos' },
                { id: 'weekly-a', label: 'Weekly Planner A' },
                { id: 'weekly-i', label: 'Weekly Planner I' },
            ]
        },
        {
            name: "Music",
            items: [
                 { id: 'guitar-score', label: 'Guitar Score' },
                 { id: 'guitar-tab', label: 'Guitar Tablature' },
                 { id: 'music-paper', label: 'Music Paper' },
            ]
        },
        {
            name: "Black and white",
            items: [
                { id: 'circle-dots', label: 'Circle And Dots' },
                { id: 'geometric', label: 'Geometric' },
                { id: 'letters', label: 'Letters' },
                { id: 'line-waves', label: 'Line Waves' },
                { id: 'line-waves-black', label: 'Line Waves Black' },
                { id: 'isometric', label: 'Isometric' },
                { id: 'hexagonal', label: 'Hexagonal' },
                { id: 'black', label: 'Black' },
            ]
        }
    ];

    const coverCategories = [
        {
            name: "Common",
            items: [
                { color: '#89CFF0', name: 'Solid Babyblue' },
                { color: '#D7CCC8', name: 'Simple Beige' },
                { color: '#212121', name: 'Simple Black' },
                { color: '#424242', name: 'Simple Allblack' },
            ]
        },
        {
            name: "Simple",
            items: [
                { color: '#D7CCC8', name: 'Simple Beige' },
                { color: '#F0F4C3', name: 'Simple Lime' },
                { color: '#37474F', name: 'Simple Dark' },
                { color: '#5D4037', name: 'Simple Brown' },
                { color: '#90CAF9', name: 'Simple Blue' },
                { color: '#A5D6A7', name: 'Simple Green' },
            ]
        },
        {
            name: "Solid",
            items: [
                { color: '#1976D2', name: 'Solid Blue' },
                { color: '#388E3C', name: 'Solid Green' },
                { color: '#757575', name: 'Solid Gray' },
                { color: '#F48FB1', name: 'Solid Pink' },
                { color: '#D32F2F', name: 'Solid Red' },
            ]
        }
    ];

    const getHexFromMode = (mode: PaperColor) => {
        if (mode === 'Dark Paper') return '#1E1E1E';
        if (mode === 'Yellow Paper') return '#FFF9C4';
        return '#FDFBF7';
    };

    const handleCreate = () => {
        const paperHex = getHexFromMode(selectedPaperColor);
        onCreate(title, selectedCover, selectedTemplate, orientation, paperHex);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1C1C1E] w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/10 text-white font-sans">
                
                {/* LEFT PREVIEW SIDEBAR */}
                <div className="w-full md:w-[320px] bg-[#121212] p-6 flex flex-col border-r border-white/10 shrink-0 overflow-y-auto">
                    
                    {/* Title */}
                    <div className="mb-6">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 block">Title</label>
                        <input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-[#2C2C2E] text-white rounded-lg px-4 py-3 border border-transparent focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] outline-none transition-all placeholder-gray-500"
                            placeholder="Untitled Notebook"
                        />
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Cover Preview Section */}
                        <div 
                            className={`group cursor-pointer rounded-xl p-4 transition-all ${activeTab === 'cover' ? 'bg-[#1C1C1E] ring-2 ring-[#007AFF]' : 'hover:bg-[#1C1C1E]'}`}
                            onClick={() => setActiveTab('cover')}
                        >
                            <label className={`text-[10px] font-bold uppercase tracking-wider mb-4 block ${activeTab === 'cover' ? 'text-[#007AFF]' : 'text-gray-400'}`}>Cover</label>
                            <div className="flex justify-center items-center py-4 bg-[#1C1C1E]/50 rounded-lg border border-white/5">
                                <div 
                                    className="rounded-l-sm rounded-r-lg shadow-2xl relative transition-all duration-300" 
                                    style={{ 
                                        backgroundColor: selectedCover,
                                        width: orientation === 'portrait' ? '120px' : '150px',
                                        height: orientation === 'portrait' ? '150px' : '120px'
                                    }}
                                >
                                     <div className="absolute left-[6%] top-0 bottom-0 w-[8%] bg-black/20 backdrop-blur-sm rounded-l-sm"></div>
                                </div>
                            </div>
                            <p className="text-center text-xs text-gray-400 mt-3 font-medium">
                                {coverCategories.flatMap(c => c.items).find(c => c.color === selectedCover)?.name || 'Solid Babyblue'}
                            </p>
                        </div>

                        {/* Paper Preview Section */}
                        <div 
                            className={`group cursor-pointer rounded-xl p-4 transition-all ${activeTab === 'paper' ? 'bg-[#1C1C1E] ring-2 ring-[#007AFF]' : 'hover:bg-[#1C1C1E]'}`}
                            onClick={() => setActiveTab('paper')}
                        >
                            <label className={`text-[10px] font-bold uppercase tracking-wider mb-4 block ${activeTab === 'paper' ? 'text-[#007AFF]' : 'text-gray-400'}`}>Paper</label>
                            <div className="flex justify-center items-center py-4 bg-[#1C1C1E]/50 rounded-lg border border-white/5">
                                <PaperThumbnail 
                                    template={selectedTemplate}
                                    label=""
                                    isSelected={false}
                                    onSelect={() => {}}
                                    orientation={orientation}
                                    paperColorMode={selectedPaperColor === 'All Paper' ? 'White Paper' : selectedPaperColor}
                                />
                            </div>
                            <p className="text-center text-xs text-gray-400 mt-3 font-medium capitalize">{selectedTemplate.replace(/-/g, ' ')}</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT SELECTION */}
                <div className="flex-1 flex flex-col bg-[#1C1C1E] min-w-0">
                    
                    {/* Header: Dropdowns & Action Buttons */}
                    <div className="h-16 border-b border-white/10 flex items-center px-6 gap-3 shrink-0 bg-[#1C1C1E] z-20">
                         {/* Dropdowns */}
                         <button className="flex items-center gap-2 bg-[#2C2C2E] px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-colors border border-white/5">
                             <span className="opacity-90">Goodnotes Standard</span>
                             <ChevronDownIcon className="w-3 h-3 opacity-50" />
                         </button>
                         
                         {/* Paper Color Dropdown */}
                         <div className="relative">
                            <button 
                                onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                                className="flex items-center gap-2 bg-[#2C2C2E] px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-colors border border-white/5"
                            >
                                <span className="opacity-90">{selectedPaperColor}</span>
                                <ChevronDownIcon className="w-3 h-3 opacity-50" />
                            </button>
                            {isColorDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 w-40 bg-[#2C2C2E] border border-white/10 rounded-lg shadow-xl py-1 z-50">
                                    {(['All Paper', 'White Paper', 'Dark Paper', 'Yellow Paper'] as PaperColor[]).map(color => (
                                        <button 
                                            key={color}
                                            onClick={() => { setSelectedPaperColor(color); setIsColorDropdownOpen(false); }}
                                            className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 text-gray-200"
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            )}
                         </div>

                         {/* Orientation Toggles */}
                         <div className="flex bg-[#2C2C2E] rounded-lg p-1 border border-white/5 ml-2">
                             <button 
                                onClick={() => setOrientation('portrait')}
                                className={`p-1.5 rounded transition-colors ${orientation === 'portrait' ? 'bg-[#636366] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                title="Portrait"
                             >
                                 <div className="w-3 h-4 border-2 border-current rounded-[1px]"></div>
                             </button>
                             <button 
                                onClick={() => setOrientation('landscape')}
                                className={`p-1.5 rounded transition-colors ${orientation === 'landscape' ? 'bg-[#636366] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                title="Landscape"
                             >
                                 <div className="w-4 h-3 border-2 border-current rounded-[1px]"></div>
                             </button>
                         </div>

                         <div className="flex-1"></div>

                         {/* Action Buttons - Moved to Top Right */}
                         <button 
                            onClick={onClose}
                            className="px-4 py-1.5 rounded-full text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleCreate}
                            className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#007AFF] hover:bg-[#0062CC] text-white transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                            Create
                        </button>

                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        
                        {activeTab === 'paper' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
                                {paperCategories.map((category) => (
                                    <div key={category.name}>
                                        <div className="flex items-center justify-between mb-3 px-1">
                                            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                                                <ChevronDownIcon className="w-3 h-3 text-gray-500"/> {category.name}
                                            </h3>
                                            <button className="text-xs text-[#007AFF] hover:text-[#409CFF] font-medium transition-colors">See all</button>
                                        </div>
                                        
                                        {/* Horizontal Slider */}
                                        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent snap-x">
                                            {category.items.map((item) => (
                                                <PaperThumbnail 
                                                    key={item.id}
                                                    template={item.id as PageTemplate}
                                                    label={item.label}
                                                    isSelected={selectedTemplate === item.id}
                                                    onSelect={(t) => setSelectedTemplate(t)}
                                                    orientation={orientation}
                                                    paperColorMode={selectedPaperColor === 'All Paper' ? 'White Paper' : selectedPaperColor}
                                                />
                                            ))}
                                        </div>
                                        <div className="h-px bg-white/5 w-full mt-2"></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'cover' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
                                {coverCategories.map((category) => (
                                    <div key={category.name}>
                                        <div className="flex items-center justify-between mb-3 px-1">
                                            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                                                <ChevronDownIcon className="w-3 h-3 text-gray-500"/> {category.name}
                                            </h3>
                                        </div>
                                        
                                        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent snap-x">
                                            {category.items.map((cover) => (
                                                <div 
                                                    key={cover.color}
                                                    onClick={() => setSelectedCover(cover.color)}
                                                    className="flex flex-col gap-2 items-center cursor-pointer group flex-shrink-0 snap-start"
                                                >
                                                    <div 
                                                        className={`rounded-l-sm rounded-r-lg shadow-sm relative transition-all duration-200 ${selectedCover === cover.color ? 'ring-2 ring-[#007AFF] ring-offset-2 ring-offset-[#1C1C1E] scale-105' : 'hover:ring-2 hover:ring-white/20'}`} 
                                                        style={{ 
                                                            backgroundColor: cover.color,
                                                            width: orientation === 'portrait' ? '96px' : '120px',
                                                            height: orientation === 'portrait' ? '120px' : '96px'
                                                        }}
                                                    >
                                                        <div className="absolute left-[6%] top-0 bottom-0 w-[8%] bg-black/10 rounded-l-sm backdrop-blur-sm"></div>
                                                    </div>
                                                    <span className={`text-[11px] text-center max-w-[100px] truncate ${selectedCover === cover.color ? 'text-[#007AFF] font-medium' : 'text-gray-400 group-hover:text-white'}`}>
                                                        {cover.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="h-px bg-white/5 w-full mt-2"></div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNotebookModal;
