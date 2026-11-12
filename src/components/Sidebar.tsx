import React from 'react';
import { 
  Clock, 
  Monitor, 
  FileText, 
  Download, 
  Image, 
  Film, 
  Music, 
  Star, 
  Trash2, 
  HardDrive
} from 'lucide-react';
import { SpecialFolder } from '../types';

interface SidebarProps {
  currentFolderId: string | SpecialFolder;
  onNavigate: (folderId: string | SpecialFolder) => void;
  recycleBinCount: number;
  favoritesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentFolderId,
  onNavigate,
  recycleBinCount,
  favoritesCount,
}) => {
  const favoriteItems = [
    { id: 'home', label: 'Recents', icon: Clock, color: 'text-blue-500' },
    { id: 'favorites', label: 'Starred', icon: Star, color: 'text-amber-500', count: favoritesCount },
    { id: 'desktop', label: 'Desktop', icon: Monitor, color: 'text-blue-500' },
    { id: 'documents', label: 'Documents', icon: FileText, color: 'text-blue-500' },
    { id: 'downloads', label: 'Downloads', icon: Download, color: 'text-blue-500' },
    { id: 'pictures', label: 'Pictures', icon: Image, color: 'text-blue-500' },
    { id: 'videos', label: 'Movies', icon: Film, color: 'text-blue-500' },
    { id: 'music', label: 'Music', icon: Music, color: 'text-blue-500' },
  ];

  return (
    <aside className="w-52 sm:w-56 h-full bg-[#E8E8E8]/70 border-r border-[#D3D3D3] p-3 flex flex-col justify-between select-none overflow-y-auto backdrop-blur-md">
      <div className="space-y-4">
        {/* Favorites Header */}
        <div>
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 mb-1.5">
            Favorites
          </div>
          <div className="space-y-0.5">
            {favoriteItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentFolderId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as SpecialFolder)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12px] transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#007AFF] text-white font-medium shadow-xs'
                      : 'text-neutral-700 hover:bg-neutral-300/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.color}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-white/25 text-white' : 'bg-neutral-300 text-neutral-700'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Storage / Locations */}
        <div>
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 mb-1.5">
            Locations
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => onNavigate('c_drive')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[12px] transition-colors cursor-pointer ${
                currentFolderId === 'c_drive'
                  ? 'bg-[#007AFF] text-white font-medium shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-300/50'
              }`}
            >
              <HardDrive className={`w-4 h-4 shrink-0 ${currentFolderId === 'c_drive' ? 'text-white' : 'text-neutral-500'}`} />
              <div className="flex flex-col text-left truncate">
                <span className="truncate">Local Storage</span>
                <span className={`text-[9px] ${currentFolderId === 'c_drive' ? 'text-white/80' : 'text-neutral-400'}`}>
                  158 GB available
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 mb-1.5">
            Tags
          </div>
          <div className="space-y-1 px-2 text-[12px]">
            <div className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 cursor-pointer">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <span>Red</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 cursor-pointer">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
              <span>Work</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 cursor-pointer">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              <span>Personal</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 cursor-pointer">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Important</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trash */}
      <div className="pt-2 border-t border-[#D3D3D3] mt-auto">
        <button
          onClick={() => onNavigate('recycle_bin')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12px] transition-colors cursor-pointer ${
            currentFolderId === 'recycle_bin'
              ? 'bg-[#007AFF] text-white font-medium shadow-xs'
              : 'text-neutral-700 hover:bg-neutral-300/50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Trash2 className={`w-4 h-4 shrink-0 ${currentFolderId === 'recycle_bin' ? 'text-white' : 'text-neutral-500'}`} />
            <span>Trash</span>
          </div>
          {recycleBinCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
              currentFolderId === 'recycle_bin' ? 'bg-white/25 text-white' : 'bg-neutral-300 text-neutral-700'
            }`}>
              {recycleBinCount}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};
