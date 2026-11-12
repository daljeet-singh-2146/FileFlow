import React from 'react';
import { 
  Copy, 
  Scissors, 
  Clipboard, 
  Trash2, 
  Edit3, 
  Eye, 
  Download, 
  Info, 
  RotateCw, 
  Star,
  FolderPlus,
  FilePlus,
  Folder
} from 'lucide-react';
import { FileItem } from '../types';

interface ContextMenuProps {
  x: number;
  y: number;
  selectedItem: FileItem | null;
  selectedCount: number;
  onClose: () => void;
  onOpen: () => void;
  onPreview: () => void;
  onRename: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  canPaste: boolean;
  onNewFolder: () => void;
  onNewFile: () => void;
  onShowProperties: () => void;
  onToggleStar: () => void;
  isRecycleBin: boolean;
  onRestore?: () => void;
  onDownloadFile?: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  selectedItem,
  selectedCount,
  onClose,
  onOpen,
  onPreview,
  onRename,
  onDelete,
  onCopy,
  onCut,
  onPaste,
  canPaste,
  onNewFolder,
  onNewFile,
  onShowProperties,
  onToggleStar,
  isRecycleBin,
  onRestore,
  onDownloadFile,
}) => {
  // Adjust position so it doesn't overflow screen
  const menuWidth = 220;
  const menuHeight = 280;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - 10);
  const adjustedY = Math.min(y, window.innerHeight - menuHeight - 10);

  return (
    <>
      <div 
        className="fixed inset-0 z-50" 
        onClick={onClose} 
        onContextMenu={(e) => { e.preventDefault(); onClose(); }}
      />
      <div
        style={{ left: adjustedX, top: adjustedY }}
        className="fixed z-50 w-56 rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xl py-1 text-xs text-neutral-800 dark:text-neutral-200 select-none animate-in fade-in zoom-in-95"
      >
        {selectedItem ? (
          <>
            {isRecycleBin ? (
              <>
                <button
                  onClick={() => { onClose(); onRestore && onRestore(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Restore</span>
                </button>
                <button
                  onClick={() => { onClose(); onDelete(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-rose-600 hover:text-white transition-colors text-rose-600 dark:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete permanently</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { onClose(); onOpen(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 font-semibold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                >
                  <Folder className="w-3.5 h-3.5 text-blue-500" />
                  <span>Open</span>
                </button>

                {selectedItem.type === 'file' && (
                  <button
                    onClick={() => { onClose(); onPreview(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Quick Preview / Edit</span>
                  </button>
                )}

                <button
                  onClick={() => { onClose(); onToggleStar(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                >
                  <Star className={`w-3.5 h-3.5 ${selectedItem.isStarred ? 'text-amber-500 fill-amber-500' : 'text-neutral-400'}`} />
                  <span>{selectedItem.isStarred ? 'Unfavorite' : 'Add to Favorites'}</span>
                </button>

                <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800 my-1" />

                <button
                  onClick={() => { onClose(); onCut(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Cut</span>
                </button>
                <button
                  onClick={() => { onClose(); onCopy(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>

                {selectedCount === 1 && (
                  <button
                    onClick={() => { onClose(); onRename(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Rename</span>
                  </button>
                )}

                {selectedItem.type === 'file' && (
                  <button
                    onClick={() => { onClose(); onDownloadFile && onDownloadFile(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download file</span>
                  </button>
                )}

                <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800 my-1" />

                <button
                  onClick={() => { onClose(); onDelete(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-rose-600 hover:text-white transition-colors text-rose-600 dark:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </>
            )}

            <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800 my-1" />

            <button
              onClick={() => { onClose(); onShowProperties(); }}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-blue-500" />
              <span>Properties</span>
            </button>
          </>
        ) : (
          /* Empty Space Background Menu */
          <>
            {!isRecycleBin && (
              <>
                <button
                  onClick={() => { onClose(); onNewFolder(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
                  <span>New folder</span>
                </button>
                <button
                  onClick={() => { onClose(); onNewFile(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                >
                  <FilePlus className="w-3.5 h-3.5 text-blue-500" />
                  <span>New text document</span>
                </button>
                <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800 my-1" />
              </>
            )}

            <button
              disabled={!canPaste || isRecycleBin}
              onClick={() => { onClose(); onPaste(); }}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit transition-colors"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste</span>
            </button>
          </>
        )}
      </div>
    </>
  );
};
