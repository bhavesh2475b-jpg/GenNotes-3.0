
import React, { useRef } from 'react';
import { Page, PageTemplate } from '../types';
import { AddIcon, TrashIcon, CloseIcon, GridIcon } from './Icons';

interface PageNavigatorProps {
    pages: Page[];
    currentPageIndex: number;
    onSelectPage: (index: number) => void;
    onAddPage: () => void;
    onDeletePage: (index: number) => void;
    onReorderPage: (fromIndex: number, toIndex: number) => void;
    isOpen: boolean;
    onClose: () => void;
}

const PageNavigator: React.FC<PageNavigatorProps> = ({
    pages,
    currentPageIndex,
    onSelectPage,
    onAddPage,
    onDeletePage,
    onReorderPage,
    isOpen,
    onClose
}) => {
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        dragItem.current = position;
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        e.preventDefault();
        dragOverItem.current = position;
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const fromIndex = dragItem.current;
        const toIndex = dragOverItem.current;
        
        if (fromIndex !== null && toIndex !== null && fromIndex !== toIndex) {
            onReorderPage(fromIndex, toIndex);
        }
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const renderPageThumbnail = (page: Page, index: number) => {
        // Simple visual representation of page content based on template
        let bg = '#FDFBF7';
        if (page.template === 'black' || page.template === 'geometric') bg = '#1E1E1E';
        if (page.template === 'legal') bg = '#FFF9C4';

        const isActive = index === currentPageIndex;

        return (
            <div 
                key={page.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={handleDrop}
                onClick={() => onSelectPage(index)}
                className={`relative group flex flex-col items-center gap-2 p-2 rounded-xl transition-all cursor-pointer ${isActive ? 'bg-[#007AFF]/10' : 'hover:bg-white/5'}`}
            >
                <div className={`relative w-28 h-36 rounded-md shadow-sm bg-white overflow-hidden border-2 transition-all ${isActive ? 'border-[#007AFF]' : 'border-transparent group-hover:border-white/20'}`}>
                    <div 
                        className="w-full h-full opacity-80" 
                        style={{ backgroundColor: bg }}
                    >
                        {/* Mini visual indicator for content */}
                        {page.elements.length > 0 && (
                             <div className="absolute inset-4 border border-black/5 rounded-sm flex items-center justify-center">
                                 <div className="w-8 h-1 bg-black/10 rounded-full"></div>
                             </div>
                        )}
                        <div className="absolute bottom-2 right-2 text-[10px] text-black/30 font-bold">{index + 1}</div>
                    </div>
                    
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDeletePage(index); }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                        title="Delete Page"
                    >
                        <TrashIcon className="w-3 h-3" />
                    </button>
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-[#007AFF]' : 'text-gray-400'}`}>
                    Page {index + 1}
                </span>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-16 left-0 bottom-0 w-48 bg-[#1C1C1E] border-r border-white/10 shadow-2xl z-40 flex flex-col animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Pages</span>
                <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <CloseIcon className="w-4 h-4" />
                </button>
            </div>
            
            {/* Add Page Button Moved to Top */}
            <div className="p-4 border-b border-white/10">
                <button 
                    onClick={onAddPage}
                    className="w-full py-2 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-xs font-medium border border-white/5"
                >
                    <AddIcon className="w-4 h-4" />
                    Add Page
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar">
                {pages.map((page, index) => renderPageThumbnail(page, index))}
            </div>
        </div>
    );
};

export default PageNavigator;
