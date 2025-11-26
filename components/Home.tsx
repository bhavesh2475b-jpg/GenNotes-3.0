
import React, { useState } from 'react';
import { Notebook } from '../types';
import { 
    FolderIcon, StarIcon, PeopleIcon, StoreIcon, TrashIcon, 
    SettingsIcon, AddIcon, ChevronDownIcon, CheckCircleIcon, 
    SearchIcon, NoteIcon, BoardIcon, DocumentIcon 
} from './Icons';

interface HomeProps {
    notebooks: Notebook[];
    onOpenNotebook: (id: string) => void;
    onCreateNotebook: () => void;
}

const Home: React.FC<HomeProps> = ({ notebooks, onOpenNotebook, onCreateNotebook }) => {
    const [selectedTab, setSelectedTab] = useState<'docs'|'fav'|'shared'|'trash'>('docs');
    const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);

    const SidebarItem = ({ id, icon, active, onClick }: { id: string, icon: React.ReactNode, active: boolean, onClick: () => void }) => (
        <button 
            onClick={onClick}
            className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 transition-colors ${active ? 'bg-[#007AFF] text-white' : 'text-gray-400 hover:text-white'}`}
        >
            {icon}
        </button>
    );

    return (
        <div className="flex w-full h-full bg-[#121212] text-white font-sans overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-[80px] bg-[#1E1E1E] flex flex-col items-center py-6 border-r border-[#333]">
                <SidebarItem 
                    id="docs" 
                    icon={<FolderIcon className="w-6 h-6"/>} 
                    active={selectedTab === 'docs'} 
                    onClick={() => setSelectedTab('docs')}
                />
                <SidebarItem 
                    id="fav" 
                    icon={<StarIcon className="w-6 h-6"/>} 
                    active={selectedTab === 'fav'} 
                    onClick={() => setSelectedTab('fav')}
                />
                <SidebarItem 
                    id="shared" 
                    icon={<PeopleIcon className="w-6 h-6"/>} 
                    active={selectedTab === 'shared'} 
                    onClick={() => setSelectedTab('shared')}
                />
                <SidebarItem 
                    id="store" 
                    icon={<StoreIcon className="w-6 h-6"/>} 
                    active={false} 
                    onClick={() => {}}
                />
                <div className="flex-1"></div>
                <SidebarItem 
                    id="trash" 
                    icon={<TrashIcon className="w-6 h-6"/>} 
                    active={selectedTab === 'trash'} 
                    onClick={() => setSelectedTab('trash')}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header Row */}
                <div className="h-20 flex items-center justify-between px-8 border-b border-[#333]/50">
                    <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
                    <button className="p-2 text-gray-400 hover:text-white rounded-full transition-colors">
                        <SettingsIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between px-8 py-6">
                    <div className="relative">
                        <button 
                            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
                            className="flex items-center gap-2 bg-[#007AFF] hover:bg-[#0062CC] text-white px-5 py-2.5 rounded-full font-medium transition-colors"
                        >
                            <AddIcon className="w-5 h-5" />
                            <span>New</span>
                            <ChevronDownIcon className="w-4 h-4 ml-1" />
                        </button>
                        
                        {isNewMenuOpen && (
                            <div className="absolute top-12 left-0 w-48 bg-[#2C2C2E] border border-white/10 rounded-xl shadow-2xl py-2 z-50 flex flex-col">
                                <button 
                                    onClick={() => { onCreateNotebook(); setIsNewMenuOpen(false); }}
                                    className="px-4 py-3 hover:bg-white/10 text-left text-sm flex items-center gap-3"
                                >
                                    <NoteIcon className="w-5 h-5 text-blue-400"/> Notebook
                                </button>
                                <button 
                                    onClick={() => { onCreateNotebook(); setIsNewMenuOpen(false); }}
                                    className="px-4 py-3 hover:bg-white/10 text-left text-sm flex items-center gap-3"
                                >
                                    <BoardIcon className="w-5 h-5 text-green-400"/> Whiteboard
                                </button>
                                <div className="h-px bg-white/10 my-1"></div>
                                <button className="px-4 py-3 hover:bg-white/10 text-left text-sm flex items-center gap-3">
                                    <DocumentIcon className="w-5 h-5 text-purple-400"/> Quick Note
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-[#2C2C2E] px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-[#3A3A3C] transition-colors">
                            <span>Date</span>
                            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                        </div>
                        <button className="p-2 text-gray-400 hover:text-white rounded-full transition-colors">
                            <CheckCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto px-8 pb-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {notebooks.map(nb => (
                            <div 
                                key={nb.id} 
                                onClick={() => onOpenNotebook(nb.id)}
                                className="group cursor-pointer flex flex-col gap-3"
                            >
                                <div className="aspect-[4/5] w-full relative transition-transform group-hover:-translate-y-1">
                                    {/* Notebook Cover Simulation */}
                                    {nb.type === 'notebook' && (
                                        <div 
                                            className="w-full h-full rounded-lg shadow-lg relative flex flex-col"
                                            style={{ backgroundColor: nb.coverColor }}
                                        >
                                            {/* Binding Band */}
                                            <div className="absolute left-[10%] top-0 bottom-0 w-[5%] bg-black/10 rounded-l-sm backdrop-blur-sm"></div>
                                            {/* Bookmark */}
                                            <div className="absolute top-0 right-4 w-6 h-8 bg-white/30 rounded-b-sm">
                                                <StarIcon className="w-4 h-4 text-white mx-auto mt-1" />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Whiteboard Preview Simulation */}
                                    {nb.type === 'whiteboard' && (
                                        <div className="w-full h-full bg-[#F2F2F7] rounded-lg shadow-lg p-2 flex flex-col items-center justify-center border-4 border-gray-300">
                                            <BoardIcon className="w-16 h-16 text-gray-300" />
                                            {/* Scribble mockup */}
                                            <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 100 100">
                                                <path d="M20,50 Q40,20 60,50 T90,50" fill="none" stroke="black" strokeWidth="2" />
                                            </svg>
                                        </div>
                                    )}

                                    {nb.type === 'doc' && (
                                        <div className="w-full h-full bg-white rounded-lg shadow-lg p-4 relative">
                                            <div className="w-full h-2 bg-gray-200 mb-2 rounded"></div>
                                            <div className="w-3/4 h-2 bg-gray-200 mb-2 rounded"></div>
                                            <div className="w-full h-2 bg-gray-200 mb-2 rounded"></div>
                                        </div>
                                    )}

                                    {/* Title overlay on hover (optional, but requested layout implies title below) */}
                                </div>
                                
                                <div className="flex flex-col px-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-white truncate">{nb.title}</span>
                                        <ChevronDownIcon className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                        <span>{nb.updatedAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at {nb.updatedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
