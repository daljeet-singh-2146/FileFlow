import React, { useState, useRef, useEffect } from 'react';
import { FileItem, ViewMode, SpecialFolder } from '../types';
import { FileIcon } from './FileIcon';
import { FlowFolderIcon } from './FlowFolderIcon';
import { formatBytes, formatDate } from '../utils/formatters';
import { Star, Folder } from 'lucide-react';

interface FileGridProps {
  items: FileItem[];
  currentFolderId: string | SpecialFolder;
  viewMode: ViewMode;
  selectedIds: string[];
  onSelectItem: (id: string, multiSelect: boolean) => void;
  onClearSelection: () => void;
  onOpenItem: (item: FileItem) => void;
  onItemContextMenu: (e: React.MouseEvent, item: FileItem) => void;
  onPaneContextMenu: (e: React.MouseEvent) => void;
  renamingId: string | null;
  onFinishRename: (id: string, newName: string) => void;
  onCancelRename: () => void;
  onNavigate: (folderId: string | SpecialFolder) => void;
  isRecycleBin: boolean;
}

export const FileGrid: React.FC<FileGridProps> = ({
  items,
  currentFolderId,
  viewMode,
  selectedIds,
  onSelectItem,
  onClearSelection,
  onOpenItem,
  onItemContextMenu,
  onPaneContextMenu,
  renamingId,
  onFinishRename,
  onCancelRename,
  onNavigate,
  isRecycleBin,
}) => {
  const [renameValue, setRenameValue] = useState('');
  const [selectedPinnedId, setSelectedPinnedId] = useState<string | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renamingId) {
      const item = items.find((i) => i.id === renamingId);
      if (item) {
        setRenameValue(item.name);
        setTimeout(() => {
          renameInputRef.current?.focus();
          renameInputRef.current?.select();
        }, 50);
      }
    }
  }, [renamingId, items]);

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      onFinishRename(id, renameValue.trim());
    } else if (e.key === 'Escape') {
      onCancelRename();
    }
  };

  const isHome = currentFolderId === 'home';

  // Render Pinned Quick Access Folders in Recents
  const renderHomeShortcuts = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Quick Access Folders
        </h3>
        <span className="text-[11px] text-neutral-400">Double-click to open</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
        {[
          { id: 'desktop', label: 'Desktop', folderType: 'desktop' as const },
          { id: 'documents', label: 'Documents', folderType: 'documents' as const },
          { id: 'downloads', label: 'Downloads', folderType: 'downloads' as const },
          { id: 'pictures', label: 'Pictures', folderType: 'pictures' as const },
          { id: 'music', label: 'Music', folderType: 'music' as const },
          { id: 'videos', label: 'Movies', folderType: 'videos' as const },
        ].map((folder) => {
          const isPinnedSelected = selectedPinnedId === folder.id;
          return (
            <div
              key={folder.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPinnedId(folder.id);
                onClearSelection();
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onNavigate(folder.id as SpecialFolder);
              }}
              className={`flex flex-col items-center p-3.5 rounded-xl border transition-all text-center cursor-pointer group select-none ${
                isPinnedSelected
                  ? 'bg-[#E3F2FD] border-[#90CAF9] ring-2 ring-[#007AFF] shadow-xs'
                  : 'bg-white/90 border-neutral-200/80 hover:bg-neutral-100/80 shadow-xs'
              }`}
              title="Double click to open"
            >
              <div className="shrink-0 mb-2.5 group-hover:scale-105 transition-transform">
                <FlowFolderIcon type={folder.folderType} size={78} />
              </div>
              <span className="text-xs font-semibold text-neutral-800 truncate w-full">
                {folder.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      onClick={() => {
        setSelectedPinnedId(null);
        onClearSelection();
      }}
      onContextMenu={onPaneContextMenu}
      className="flex-1 h-full overflow-y-auto p-4 select-none outline-none bg-white"
    >
      {isHome && renderHomeShortcuts()}

      {isHome && (
        <div className="flex items-center justify-between mb-3 mt-4">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Recent Files ({items.length})
          </h3>
          <span className="text-[11px] text-neutral-400">Top recent items</span>
        </div>
      )}

      {items.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-neutral-400 text-sm">
          <Folder className="w-12 h-12 text-neutral-300 stroke-1 mb-2" />
          <p className="font-medium text-neutral-500">
            {isRecycleBin ? 'Trash is empty' : 'No items found'}
          </p>
          <span className="text-xs text-neutral-400 mt-1">
            {isRecycleBin ? 'Deleted files will appear here' : 'Create a new folder or import files using the toolbar'}
          </span>
        </div>
      ) : viewMode === 'details' ? (
        /* List View */
        <div className="w-full text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-medium">
                <th className="py-2 px-3 font-semibold text-neutral-600 w-[45%]">Name</th>
                <th className="py-2 px-3 font-semibold text-neutral-600 w-[25%]">Date Modified</th>
                <th className="py-2 px-3 font-semibold text-neutral-600 w-[15%]">Kind</th>
                <th className="py-2 px-3 font-semibold text-neutral-600 text-right w-[15%]">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((item, idx) => {
                const isSelected = selectedIds.includes(item.id);
                const isRenaming = renamingId === item.id;
                const isEven = idx % 2 === 0;

                return (
                  <tr
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPinnedId(null);
                      onSelectItem(item.id, e.ctrlKey || e.metaKey);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onOpenItem(item);
                    }}
                    onContextMenu={(e) => onItemContextMenu(e, item)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#007AFF] text-white font-medium'
                        : isEven ? 'bg-[#FDFDFD] hover:bg-neutral-100' : 'bg-white hover:bg-neutral-100'
                    }`}
                  >
                    <td className="py-1.5 px-3 flex items-center gap-2.5 truncate">
                      <FileIcon item={item} className="w-4 h-4 shrink-0" size={18} />
                      {isRenaming ? (
                        <input
                          ref={renameInputRef}
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, item.id)}
                          onBlur={() => onFinishRename(item.id, renameValue.trim())}
                          onClick={(e) => e.stopPropagation()}
                          className="px-1.5 py-0.5 border border-blue-400 rounded bg-white text-neutral-900 outline-none w-full shadow-xs"
                        />
                      ) : (
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="truncate">{item.name}</span>
                          {item.isStarred && (
                            <Star className={`w-3 h-3 ${isSelected ? 'text-amber-200 fill-amber-200' : 'text-amber-500 fill-amber-400'} shrink-0`} />
                          )}
                        </div>
                      )}
                    </td>
                    <td className={`py-1.5 px-3 ${isSelected ? 'text-white/80' : 'text-neutral-500'}`}>
                      {formatDate(item.dateModified)}
                    </td>
                    <td className={`py-1.5 px-3 capitalize ${isSelected ? 'text-white/80' : 'text-neutral-500'}`}>
                      {item.type === 'folder' ? 'Folder' : `${item.extension || 'Document'}`}
                    </td>
                    <td className={`py-1.5 px-3 text-right font-mono text-[11px] ${isSelected ? 'text-white/90' : 'text-neutral-500'}`}>
                      {item.type === 'folder' ? '--' : formatBytes(item.size)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Icon Grid View */
        <div
          className={`grid gap-4 ${
            viewMode === 'large_icons'
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
              : viewMode === 'medium_icons'
              ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isRenaming = renamingId === item.id;

            return (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPinnedId(null);
                  onSelectItem(item.id, e.ctrlKey || e.metaKey);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onOpenItem(item);
                }}
                onContextMenu={(e) => onItemContextMenu(e, item)}
                className={`relative flex ${
                  viewMode === 'tiles' ? 'flex-row items-center gap-3 p-3' : 'flex-col items-center p-3'
                } rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#007AFF] text-white shadow-md'
                    : 'bg-transparent hover:bg-neutral-100/90 text-neutral-800'
                }`}
              >
                {item.isStarred && (
                  <Star className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-200 fill-amber-200' : 'text-amber-500 fill-amber-400'} absolute top-2 right-2 drop-shadow-xs`} />
                )}

                {/* Thumbnail / Icon preview */}
                {item.thumbnailUrl ? (
                  <div className={`${
                    viewMode === 'large_icons' ? 'w-20 h-20' : 'w-14 h-14'
                  } rounded-lg overflow-hidden bg-neutral-100 flex items-center justify-center shrink-0 mb-2 shadow-sm border border-neutral-200/60`}>
                    <img
                      src={item.thumbnailUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`${
                      viewMode === 'large_icons' ? 'w-16 h-16' : 'w-12 h-12'
                    } flex items-center justify-center mb-2 shrink-0`}
                  >
                    <FileIcon
                      item={item}
                      size={viewMode === 'large_icons' ? 56 : 42}
                      className={viewMode === 'large_icons' ? 'w-14 h-14' : 'w-10 h-10'}
                    />
                  </div>
                )}

                {/* Name / Rename Input */}
                <div className={`w-full ${viewMode === 'tiles' ? 'text-left' : 'text-center'}`}>
                  {isRenaming ? (
                    <input
                      ref={renameInputRef}
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, item.id)}
                      onBlur={() => onFinishRename(item.id, renameValue.trim())}
                      onClick={(e) => e.stopPropagation()}
                      className="px-1.5 py-0.5 text-xs border border-blue-400 rounded bg-white text-neutral-900 outline-none w-full text-center shadow-xs"
                    />
                  ) : (
                    <>
                      <p className={`text-xs font-medium line-clamp-2 break-all leading-tight ${isSelected ? 'text-white' : 'text-neutral-800'}`}>
                        {item.name}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-neutral-400'}`}>
                        {item.type === 'folder' ? 'Folder' : formatBytes(item.size)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
