import React, { useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  List, 
  Columns3, 
  ArrowUpDown, 
  Search, 
  Upload, 
  FolderPlus, 
  FilePlus, 
  Trash2, 
  RotateCw, 
  Scissors, 
  Copy, 
  Clipboard, 
  Edit3,
  Check
} from 'lucide-react';
import { ViewMode, SortField, SortOrder, SpecialFolder } from '../types';

interface TopBarProps {
  currentPath: string;
  pathSegments: { label: string; id: string | SpecialFolder }[];
  onNavigate: (targetId: string | SpecialFolder) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
  selectedCount: number;
  onNewFolder: () => void;
  onNewFile: () => void;
  onDeleteSelected: () => void;
  onRenameSelected: () => void;
  onCopySelected: () => void;
  onCutSelected: () => void;
  onPaste: () => void;
  canPaste: boolean;
  isRecycleBin: boolean;
  onEmptyRecycleBin?: () => void;
  onRestoreSelected?: () => void;
  onImportFiles: (files: FileList) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  pathSegments,
  onNavigate,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortField,
  sortOrder,
  onSortChange,
  selectedCount,
  onNewFolder,
  onNewFile,
  onDeleteSelected,
  onRenameSelected,
  onCopySelected,
  onCutSelected,
  onPaste,
  canPaste,
  isRecycleBin,
  onEmptyRecycleBin,
  onRestoreSelected,
  onImportFiles,
}) => {
  const [showSortMenu, setShowSortMenu] = React.useState(false);
  const [showActionMenu, setShowActionMenu] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImportFiles(e.target.files);
      e.target.value = '';
    }
  };

  const currentFolderTitle = pathSegments[pathSegments.length - 1]?.label || 'FileFlow';

  return (
    <div className="relative z-30 flex flex-col bg-[#F6F6F6] border-b border-[#D8D8D8] select-none shadow-xs">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        className="hidden"
      />

      {/* Main Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 gap-3">
        {/* Left: Nav Chevrons & Title */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#E5E5E5] rounded-md p-0.5 border border-[#CCCCCC]">
            <button
              onClick={onGoBack}
              disabled={!canGoBack}
              className="p-1 rounded text-neutral-600 hover:text-neutral-900 hover:bg-white/80 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
              title="Back"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onGoForward}
              disabled={!canGoForward}
              className="p-1 rounded text-neutral-600 hover:text-neutral-900 hover:bg-white/80 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
              title="Forward"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="font-semibold text-neutral-800 text-[13px] ml-1">
            {currentFolderTitle}
          </span>
        </div>

        {/* Center: Segmented View Controls (Icon, List, Columns) */}
        <div className="flex items-center bg-[#E5E5E5] p-0.5 rounded-lg border border-[#CCCCCC] shadow-inner">
          <button
            onClick={() => onViewModeChange('large_icons')}
            className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1 cursor-pointer transition-all ${
              viewMode === 'large_icons'
                ? 'bg-white shadow-xs text-neutral-800 font-medium'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            title="Icons View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('details')}
            className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1 cursor-pointer transition-all ${
              viewMode === 'details'
                ? 'bg-white shadow-xs text-neutral-800 font-medium'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            title="List View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('tiles')}
            className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1 cursor-pointer transition-all ${
              viewMode === 'tiles'
                ? 'bg-white shadow-xs text-neutral-800 font-medium'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            title="Columns View"
          >
            <Columns3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Actions, Sort, Import, Search */}
        <div className="flex items-center gap-2">
          {/* Action menu button */}
          {!isRecycleBin && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowActionMenu(!showActionMenu);
                  setShowSortMenu(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white rounded-md border border-neutral-300 hover:bg-neutral-50 shadow-xs cursor-pointer text-neutral-700"
                title="Action menu"
              >
                <FolderPlus className="w-3.5 h-3.5 text-blue-500" />
                <span>New</span>
                <span className="text-[9px] text-neutral-400">▼</span>
              </button>

              {showActionMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowActionMenu(false)} />
                  <div className="absolute right-0 mt-1 w-44 rounded-lg bg-white border border-neutral-200 shadow-2xl py-1 z-50 text-xs animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => {
                        setShowActionMenu(false);
                        onNewFolder();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-blue-500 hover:text-white text-neutral-700 cursor-pointer"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>New Folder</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowActionMenu(false);
                        onNewFile();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-blue-500 hover:text-white text-neutral-700 cursor-pointer"
                    >
                      <FilePlus className="w-3.5 h-3.5" />
                      <span>New Document</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Import Button */}
          {!isRecycleBin && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white rounded-md border border-neutral-300 hover:bg-neutral-50 shadow-xs cursor-pointer text-neutral-700"
              title="Import files from your device"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>Import</span>
            </button>
          )}

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSortMenu(!showSortMenu);
                setShowActionMenu(false);
              }}
              className="p-1.5 bg-white rounded-md border border-neutral-300 hover:bg-neutral-50 shadow-xs cursor-pointer text-neutral-700"
              title="Sort Items"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>

            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                <div className="absolute right-0 mt-1 w-40 rounded-lg bg-white border border-neutral-200 shadow-2xl py-1 z-50 text-xs">
                  {(['name', 'dateModified', 'type', 'size'] as SortField[]).map((field) => (
                    <button
                      key={field}
                      onClick={() => {
                        onSortChange(field);
                        setShowSortMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-blue-500 hover:text-white text-neutral-700 capitalize cursor-pointer text-left"
                    >
                      <span>{field === 'dateModified' ? 'Date Modified' : field}</span>
                      {sortField === field && (
                        <Check className="w-3 h-3 text-blue-600 hover:text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Trash buttons if inside trash */}
          {isRecycleBin && (
            <div className="flex items-center gap-1">
              <button
                onClick={onRestoreSelected}
                disabled={selectedCount === 0}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-white rounded-md border border-neutral-300 hover:bg-neutral-50 disabled:opacity-40 cursor-pointer"
              >
                <RotateCw className="w-3 h-3 text-emerald-600" />
                <span>Restore</span>
              </button>
              <button
                onClick={onEmptyRecycleBin}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-rose-50 rounded-md border border-rose-200 text-rose-600 hover:bg-rose-100 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Empty Trash</span>
              </button>
            </div>
          )}

          {/* Cut/Copy/Paste/Delete quick buttons */}
          <div className="hidden md:flex items-center gap-0.5 bg-neutral-200/70 p-0.5 rounded-md border border-neutral-300">
            <button
              onClick={onCutSelected}
              disabled={selectedCount === 0 || isRecycleBin}
              title="Cut (Ctrl+X)"
              className="p-1 rounded hover:bg-white text-neutral-600 disabled:opacity-30 cursor-pointer"
            >
              <Scissors className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onCopySelected}
              disabled={selectedCount === 0 || isRecycleBin}
              title="Copy (Ctrl+C)"
              className="p-1 rounded hover:bg-white text-neutral-600 disabled:opacity-30 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onPaste}
              disabled={!canPaste || isRecycleBin}
              title="Paste (Ctrl+V)"
              className="p-1 rounded hover:bg-white text-neutral-600 disabled:opacity-30 cursor-pointer"
            >
              <Clipboard className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onRenameSelected}
              disabled={selectedCount !== 1 || isRecycleBin}
              title="Rename"
              className="p-1 rounded hover:bg-white text-neutral-600 disabled:opacity-30 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDeleteSelected}
              disabled={selectedCount === 0}
              title="Move to Trash"
              className="p-1 rounded hover:bg-rose-100 hover:text-rose-600 text-neutral-600 disabled:opacity-30 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Spotlight Search Pill */}
          <div className="relative w-40 sm:w-48">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search"
              className="w-full bg-white border border-neutral-300 rounded-md pl-7 pr-6 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 text-neutral-800 h-7"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-[10px] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Path Bar */}
      <div className="flex items-center px-4 py-1 bg-[#ECECEC] border-t border-[#DFDFDF] text-[11px] text-neutral-600 gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-neutral-400 font-medium">Primary Storage</span>
        {pathSegments.map((seg, idx) => (
          <React.Fragment key={seg.id + idx}>
            <span className="text-neutral-400">›</span>
            <button
              onClick={() => onNavigate(seg.id)}
              className="hover:underline hover:text-neutral-900 font-medium cursor-pointer"
            >
              {seg.label}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
