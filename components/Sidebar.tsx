
import React, { useState } from 'react';
import { Notebook, NotebookType } from '../types';
import { AddIcon, MenuIcon, SearchIcon, NoteIcon, BoardIcon, DocumentIcon } from './Icons';

interface SidebarProps {
  notebooks: Notebook[];
  currentNotebookId: string;
  onSelectNotebook: (id: string) => void;
  onAddNotebook: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  notebooks, 
  currentNotebookId, 
  onSelectNotebook, 
  onAddNotebook 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<NotebookType | 'all'>('all');

  const filteredNotebooks = notebooks.filter(nb => {
    const matchesTitle = nb.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContent = nb.pages.some(p => p.transcription?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSearch = matchesTitle || matchesContent;
    const matchesType = filterType === 'all' || nb.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-20 md:w-80 h-full bg-surfaceContainer flex flex-col border-r border-outline/10 transition-all duration-300">
      <div className="p-6 flex items-center gap-3 text-onPrimaryContainer">
        <MenuIcon className="md:hidden" />
        <h1 className="hidden md:block text-2xl font-bold tracking-tight text-primary">NoteGenius</h1>
      </div>

      {/* Search */}
      <div className="px-4 mb-4 hidden md:block">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-2.5 text-secondary w-5 h-5" />
          <input 
            type="text"
            placeholder="Search notes & content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surfaceContainerHigh rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto no-scrollbar md:flex-wrap">
          {(['all', 'notebook', 'whiteboard', 'doc'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize border transition-colors ${
                    filterType === type 
                    ? 'bg-secondaryContainer text-onPrimaryContainer border-transparent' 
                    : 'border-outline/30 text-secondary hover:bg-surfaceContainerHigh'
                }`}
              >
                  {type === 'doc' ? 'Docs' : type === 'all' ? 'All' : type + 's'}
              </button>
          ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-2">
        <button 
          onClick={onAddNotebook}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-primaryContainer text-onPrimaryContainer font-medium hover:shadow-md transition-all mb-6"
        >
          <AddIcon />
          <span className="hidden md:inline">New...</span>
        </button>

        <div className="text-sm font-semibold text-secondary ml-2 mb-2 hidden md:block">
          Recent
        </div>

        {filteredNotebooks.length === 0 && (
            <div className="text-center text-outline text-sm mt-10">
                No notes found.
            </div>
        )}

        {filteredNotebooks.map(nb => {
           const hasTextMatch = searchQuery && nb.pages.some(p => p.transcription?.toLowerCase().includes(searchQuery.toLowerCase()));
           
           return (
            <button
                key={nb.id}
                onClick={() => onSelectNotebook(nb.id)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group ${
                currentNotebookId === nb.id 
                    ? 'bg-secondaryContainer text-onPrimaryContainer font-medium' 
                    : 'text-secondary hover:bg-surfaceContainerHigh'
                }`}
            >
                <div className="relative">
                    <div 
                    className="w-10 h-12 rounded-md shadow-sm flex items-center justify-center text-white/50" 
                    style={{ backgroundColor: nb.coverColor }} 
                    >
                        {nb.type === 'notebook' && <NoteIcon className="w-5 h-5"/>}
                        {nb.type === 'whiteboard' && <BoardIcon className="w-5 h-5"/>}
                        {nb.type === 'doc' && <DocumentIcon className="w-5 h-5"/>}
                    </div>
                </div>
                
                <div className="hidden md:flex flex-col items-start overflow-hidden text-left w-full">
                    <div className="flex justify-between w-full">
                        <span className="truncate">{nb.title}</span>
                        {hasTextMatch && (
                            <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full whitespace-nowrap ml-2">Text match</span>
                        )}
                    </div>
                    <span className="text-xs opacity-60 truncate">
                        {nb.updatedAt.toLocaleDateString()}
                    </span>
                </div>
            </button>
           );
        })}
      </div>
      
      <div className="p-4 border-t border-outline/10 hidden md:block">
         <div className="text-xs text-center text-outline">
            Goodnotes AI • Premium
         </div>
      </div>
    </div>
  );
};

export default Sidebar;
