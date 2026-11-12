import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileItem, 
  SpecialFolder, 
  ViewMode, 
  SortField, 
  SortOrder, 
  TabInfo 
} from './types';
import { INITIAL_FILES } from './initialData';
import { getCurrentTimestamp } from './utils/formatters';
import { TabsBar } from './components/TabsBar';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { FileGrid } from './components/FileGrid';
import { ContextMenu } from './components/ContextMenu';
import { FilePreviewModal } from './components/FilePreviewModal';
import { PropertiesModal } from './components/PropertiesModal';

export function App() {
  // Ensure document is in clean light mode
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Files state
  const [files, setFiles] = useState<FileItem[]>(() => {
    const saved = localStorage.getItem('fileflow_files_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_FILES;
      }
    }
    return INITIAL_FILES;
  });

  // Persist files
  useEffect(() => {
    localStorage.setItem('fileflow_files_v1', JSON.stringify(files));
  }, [files]);

  // Tabs management
  const [tabs, setTabs] = useState<TabInfo[]>([
    {
      id: 'tab-1',
      title: 'Recents',
      currentFolderId: 'home',
      history: ['home'],
      historyIndex: 0,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // View & Sort Settings
  const [viewMode, setViewMode] = useState<ViewMode>('large_icons');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [renamingId, setRenamingId] = useState<string | null>(null);

  // Clipboard (Copy / Cut)
  const [clipboard, setClipboard] = useState<{
    action: 'copy' | 'cut';
    itemIds: string[];
  } | null>(null);

  // Modals
  const [previewItem, setPreviewItem] = useState<FileItem | null>(null);
  const [propertiesItem, setPropertiesItem] = useState<FileItem | null>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: FileItem | null;
  } | null>(null);

  // Active Tab
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const currentFolderId = activeTab.currentFolderId;

  // Folder Name mapping
  const getFolderTitle = (id: string | SpecialFolder): string => {
    const specialTitles: Record<string, string> = {
      home: 'Recents',
      favorites: 'Starred',
      desktop: 'Desktop',
      documents: 'Documents',
      downloads: 'Downloads',
      pictures: 'Pictures',
      videos: 'Movies',
      music: 'Music',
      recycle_bin: 'Trash',
      c_drive: 'Local Storage',
    };
    if (specialTitles[id]) return specialTitles[id];
    const found = files.find((f) => f.id === id);
    return found ? found.name : 'Folder';
  };

  // Build breadcrumb segments
  const pathSegments = useMemo(() => {
    const segments: { label: string; id: string | SpecialFolder }[] = [];
    if (currentFolderId === 'home') {
      return [{ label: 'Recents', id: 'home' }];
    }
    if (currentFolderId === 'favorites') {
      return [{ label: 'Starred', id: 'favorites' }];
    }
    if (currentFolderId === 'recycle_bin') {
      return [{ label: 'Trash', id: 'recycle_bin' }];
    }

    let current: string | null = currentFolderId;
    const chain: { label: string; id: string | SpecialFolder }[] = [];

    while (current) {
      if (['desktop', 'downloads', 'documents', 'pictures', 'videos', 'music', 'c_drive'].includes(current)) {
        chain.unshift({ label: getFolderTitle(current), id: current as SpecialFolder });
        break;
      }
      const item = files.find((f) => f.id === current);
      if (item) {
        chain.unshift({ label: item.name, id: item.id });
        current = item.parentId;
      } else {
        break;
      }
    }

    return chain;
  }, [currentFolderId, files]);

  // Navigate folder
  const handleNavigate = (targetFolderId: string | SpecialFolder) => {
    setSelectedIds([]);
    setRenamingId(null);
    setSearchQuery('');

    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id !== activeTabId) return tab;
        const newHistory = tab.history.slice(0, tab.historyIndex + 1);
        newHistory.push(targetFolderId);
        return {
          ...tab,
          title: getFolderTitle(targetFolderId),
          currentFolderId: targetFolderId,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      })
    );
  };

  // Back / Forward
  const canGoBack = activeTab.historyIndex > 0;
  const canGoForward = activeTab.historyIndex < activeTab.history.length - 1;

  const handleGoBack = () => {
    if (!canGoBack) return;
    const newIdx = activeTab.historyIndex - 1;
    const target = activeTab.history[newIdx];
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              title: getFolderTitle(target),
              currentFolderId: target,
              historyIndex: newIdx,
            }
          : tab
      )
    );
  };

  const handleGoForward = () => {
    if (!canGoForward) return;
    const newIdx = activeTab.historyIndex + 1;
    const target = activeTab.history[newIdx];
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              title: getFolderTitle(target),
              currentFolderId: target,
              historyIndex: newIdx,
            }
          : tab
      )
    );
  };

  // Tab operations
  const handleNewTab = () => {
    const newTabId = `tab-${Date.now()}`;
    const newTab: TabInfo = {
      id: newTabId,
      title: 'Recents',
      currentFolderId: 'home',
      history: ['home'],
      historyIndex: 0,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTabId);
  };

  const handleCloseTab = (tabId: string) => {
    if (tabs.length === 1) return;
    const index = tabs.findIndex((t) => t.id === tabId);
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      const nextActive = newTabs[Math.max(0, index - 1)];
      setActiveTabId(nextActive.id);
    }
  };

  // Items to display in active view
  const currentItems = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      let pool = files;

      if (currentFolderId === 'recycle_bin') {
        pool = files.filter((f) => f.isDeleted);
      } else if (currentFolderId === 'favorites') {
        pool = files.filter((f) => !f.isDeleted && f.isStarred);
      } else {
        pool = files.filter((f) => !f.isDeleted);
      }

      const searchFiltered = pool.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.category?.toLowerCase().includes(q) ||
          f.extension?.toLowerCase().includes(q) ||
          f.content?.toLowerCase().includes(q)
      );

      return [...searchFiltered].sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    }

    let result: FileItem[] = [];

    if (currentFolderId === 'recycle_bin') {
      result = files.filter((f) => f.isDeleted);
    } else if (currentFolderId === 'favorites') {
      result = files.filter((f) => !f.isDeleted && f.isStarred);
    } else if (currentFolderId === 'home') {
      const nonDeletedFiles = files.filter((f) => !f.isDeleted && f.type === 'file');
      const sortedRecents = [...nonDeletedFiles].sort((a, b) => 
        new Date(b.dateModified.replace(' ', 'T')).getTime() - new Date(a.dateModified.replace(' ', 'T')).getTime()
      );
      result = sortedRecents.slice(0, 8);
    } else if (currentFolderId === 'c_drive') {
      result = files.filter((f) => !f.isDeleted && (f.parentId === null || f.parentId === 'c_drive'));
    } else {
      result = files.filter((f) => !f.isDeleted && f.parentId === currentFolderId);
    }

    if (currentFolderId !== 'home') {
      return [...result].sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        let valA: any = a[sortField] || '';
        let valB: any = b[sortField] || '';

        if (sortField === 'size') {
          valA = a.size || 0;
          valB = b.size || 0;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [files, currentFolderId, searchQuery, sortField, sortOrder]);

  // Actions: Import files from user's device
  const handleImportFiles = (fileList: FileList) => {
    const parent = ['home', 'favorites', 'recycle_bin'].includes(currentFolderId) ? 'documents' : currentFolderId;
    const newItems: FileItem[] = [];

    Array.from(fileList).forEach((file) => {
      const ext = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : '';
      let category: FileItem['category'] = 'other';
      if (file.type.startsWith('image/') || ['jpg', 'png', 'jpeg', 'svg', 'gif', 'webp'].includes(ext || '')) {
        category = 'image';
      } else if (file.type.startsWith('video/') || ['mp4', 'webm', 'mov', 'mkv'].includes(ext || '')) {
        category = 'video';
      } else if (file.type.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'aac'].includes(ext || '')) {
        category = 'audio';
      } else if (['txt', 'pdf', 'docx', 'xlsx', 'md'].includes(ext || '')) {
        category = 'document';
      }

      const objectUrl = URL.createObjectURL(file);

      const newItem: FileItem = {
        id: `import-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        type: 'file',
        parentId: parent,
        size: file.size,
        dateModified: getCurrentTimestamp(),
        category,
        extension: ext,
        thumbnailUrl: category === 'image' || category === 'video' ? objectUrl : undefined,
        videoUrl: category === 'video' ? objectUrl : undefined,
        audioUrl: category === 'audio' ? objectUrl : undefined,
        content: `Imported file: ${file.name}\nSize: ${file.size} bytes\nType: ${file.type || 'Unknown'}`,
      };

      newItems.push(newItem);
    });

    setFiles((prev) => [...newItems, ...prev]);
    setSelectedIds(newItems.map((i) => i.id));
  };

  // Actions: Create Folder
  const handleCreateFolder = () => {
    const parent = ['home', 'favorites', 'recycle_bin'].includes(currentFolderId) ? 'documents' : currentFolderId;
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name: 'untitled folder',
      type: 'folder',
      parentId: parent,
      dateModified: getCurrentTimestamp(),
    };
    setFiles((prev) => [newFolder, ...prev]);
    setSelectedIds([newFolder.id]);
    setRenamingId(newFolder.id);
  };

  // Actions: Create File
  const handleCreateFile = () => {
    const parent = ['home', 'favorites', 'recycle_bin'].includes(currentFolderId) ? 'documents' : currentFolderId;
    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name: 'untitled note.txt',
      type: 'file',
      parentId: parent,
      size: 0,
      dateModified: getCurrentTimestamp(),
      category: 'document',
      extension: 'txt',
      content: '',
    };
    setFiles((prev) => [newFile, ...prev]);
    setSelectedIds([newFile.id]);
    setRenamingId(newFile.id);
  };

  // Actions: Delete
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    if (currentFolderId === 'recycle_bin') {
      if (window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} item(s)?`)) {
        setFiles((prev) => prev.filter((f) => !selectedIds.includes(f.id)));
        setSelectedIds([]);
      }
    } else {
      setFiles((prev) =>
        prev.map((f) =>
          selectedIds.includes(f.id)
            ? {
                ...f,
                isDeleted: true,
                deletedAt: getCurrentTimestamp(),
                originalParentId: f.parentId,
              }
            : f
        )
      );
      setSelectedIds([]);
    }
  };

  // Empty Trash
  const handleEmptyRecycleBin = () => {
    if (window.confirm('Are you sure you want to permanently erase the items in the Trash?')) {
      setFiles((prev) => prev.filter((f) => !f.isDeleted));
      setSelectedIds([]);
    }
  };

  // Put Back / Restore
  const handleRestoreSelected = () => {
    setFiles((prev) =>
      prev.map((f) =>
        selectedIds.includes(f.id) && f.isDeleted
          ? {
              ...f,
              isDeleted: false,
              parentId: f.originalParentId || 'documents',
              deletedAt: undefined,
            }
          : f
      )
    );
    setSelectedIds([]);
  };

  // Rename
  const handleFinishRename = (id: string, newName: string) => {
    setRenamingId(null);
    if (!newName) return;
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const ext = f.type === 'file' && newName.includes('.') ? newName.split('.').pop() : f.extension;
        return {
          ...f,
          name: newName,
          extension: ext,
          dateModified: getCurrentTimestamp(),
        };
      })
    );
  };

  // Save Content
  const handleSaveFileContent = (itemId: string, newContent: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === itemId
          ? {
              ...f,
              content: newContent,
              size: new Blob([newContent]).size,
              dateModified: getCurrentTimestamp(),
            }
          : f
      )
    );
  };

  // Copy / Cut / Paste
  const handleCopy = () => {
    if (selectedIds.length === 0) return;
    setClipboard({ action: 'copy', itemIds: selectedIds });
  };

  const handleCut = () => {
    if (selectedIds.length === 0) return;
    setClipboard({ action: 'cut', itemIds: selectedIds });
  };

  const handlePaste = () => {
    if (!clipboard || clipboard.itemIds.length === 0) return;
    const targetParent = ['home', 'favorites', 'recycle_bin'].includes(currentFolderId) ? 'documents' : currentFolderId;

    if (clipboard.action === 'cut') {
      setFiles((prev) =>
        prev.map((f) =>
          clipboard.itemIds.includes(f.id)
            ? { ...f, parentId: targetParent, dateModified: getCurrentTimestamp() }
            : f
        )
      );
      setClipboard(null);
    } else {
      const copiedItems = files.filter((f) => clipboard.itemIds.includes(f.id));
      const newItems: FileItem[] = copiedItems.map((item) => ({
        ...item,
        id: `${item.id}-copy-${Date.now()}`,
        name: `Copy of ${item.name}`,
        parentId: targetParent,
        dateModified: getCurrentTimestamp(),
      }));
      setFiles((prev) => [...newItems, ...prev]);
    }
  };

  // Toggle Star / Favorite
  const handleToggleStar = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isStarred: !f.isStarred } : f))
    );
  };

  // Single file download
  const handleDownloadItem = (item: FileItem) => {
    if (item.videoUrl) {
      window.open(item.videoUrl, '_blank');
      return;
    }
    if (item.audioUrl) {
      window.open(item.audioUrl, '_blank');
      return;
    }
    const content = item.content || `File placeholder: ${item.name}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Open item
  const handleOpenItem = (item: FileItem) => {
    if (item.type === 'folder') {
      handleNavigate(item.id);
    } else {
      setPreviewItem(item);
    }
  };

  // Context Menu Handlers
  const handleItemContextMenu = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedIds.includes(item.id)) {
      setSelectedIds([item.id]);
    }
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
    });
  };

  const handlePaneContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedIds([]);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item: null,
    });
  };

  // Sort toggle handler
  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Keyboard Shortcuts (Cmd/Ctrl + C, V, X, A, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (renamingId || previewItem || propertiesItem) return;

      if ((e.key === 'Backspace' || e.key === 'Delete') && (e.metaKey || e.ctrlKey)) {
        handleDeleteSelected();
      } else if (e.key === 'Enter' && selectedIds.length === 1) {
        setRenamingId(selectedIds[0]);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        handleCopy();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x') {
        handleCut();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        handlePaste();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelectedIds(currentItems.map((i) => i.id));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, renamingId, previewItem, propertiesItem, clipboard, currentItems]);

  const recycleBinCount = files.filter((f) => f.isDeleted).length;
  const favoritesCount = files.filter((f) => !f.isDeleted && f.isStarred).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#D8D8D8] text-neutral-800 font-sans text-xs p-2 sm:p-4">
      {/* FileFlow Window */}
      <div className="flex-1 flex flex-col h-full bg-white rounded-xl shadow-2xl border border-[#B0B0B0] overflow-hidden">
        {/* Title Bar with Traffic Lights & Tabs */}
        <TabsBar
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={setActiveTabId}
          onCloseTab={handleCloseTab}
          onNewTab={handleNewTab}
        />

        {/* FileFlow Toolbar */}
        <TopBar
          currentPath={getFolderTitle(currentFolderId)}
          pathSegments={pathSegments}
          onNavigate={handleNavigate}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onGoBack={handleGoBack}
          onGoForward={handleGoForward}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          selectedCount={selectedIds.length}
          onNewFolder={handleCreateFolder}
          onNewFile={handleCreateFile}
          onDeleteSelected={handleDeleteSelected}
          onRenameSelected={() => selectedIds[0] && setRenamingId(selectedIds[0])}
          onCopySelected={handleCopy}
          onCutSelected={handleCut}
          onPaste={handlePaste}
          canPaste={!!clipboard && clipboard.itemIds.length > 0}
          isRecycleBin={currentFolderId === 'recycle_bin'}
          onEmptyRecycleBin={handleEmptyRecycleBin}
          onRestoreSelected={handleRestoreSelected}
          onImportFiles={handleImportFiles}
        />

        {/* Content Area (Sidebar + FileGrid) */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            currentFolderId={currentFolderId}
            onNavigate={handleNavigate}
            recycleBinCount={recycleBinCount}
            favoritesCount={favoritesCount}
          />

          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <FileGrid
              items={currentItems}
              currentFolderId={currentFolderId}
              viewMode={viewMode}
              selectedIds={selectedIds}
              onSelectItem={(id, multi) => {
                if (multi) {
                  setSelectedIds((prev) =>
                    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                  );
                } else {
                  setSelectedIds([id]);
                }
              }}
              onClearSelection={() => setSelectedIds([])}
              onOpenItem={handleOpenItem}
              onItemContextMenu={handleItemContextMenu}
              onPaneContextMenu={handlePaneContextMenu}
              renamingId={renamingId}
              onFinishRename={handleFinishRename}
              onCancelRename={() => setRenamingId(null)}
              onNavigate={handleNavigate}
              isRecycleBin={currentFolderId === 'recycle_bin'}
            />

            {/* FileFlow Status Bar */}
            <div className="h-6 px-4 border-t border-[#E5E5E5] bg-[#F6F6F6] flex items-center justify-between text-[11px] text-neutral-500 select-none">
              <div>
                <span>{currentItems.length} items</span>
                {selectedIds.length > 0 && (
                  <span className="ml-2 font-medium text-neutral-800">
                    ({selectedIds.length} selected)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span>158.42 GB available in Local Storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          selectedItem={contextMenu.item}
          selectedCount={selectedIds.length}
          onClose={() => setContextMenu(null)}
          onOpen={() => contextMenu.item && handleOpenItem(contextMenu.item)}
          onPreview={() => contextMenu.item && setPreviewItem(contextMenu.item)}
          onRename={() => contextMenu.item && setRenamingId(contextMenu.item.id)}
          onDelete={handleDeleteSelected}
          onCopy={handleCopy}
          onCut={handleCut}
          onPaste={handlePaste}
          canPaste={!!clipboard && clipboard.itemIds.length > 0}
          onNewFolder={handleCreateFolder}
          onNewFile={handleCreateFile}
          onShowProperties={() => contextMenu.item && setPropertiesItem(contextMenu.item)}
          onToggleStar={() => contextMenu.item && handleToggleStar(contextMenu.item.id)}
          isRecycleBin={currentFolderId === 'recycle_bin'}
          onRestore={handleRestoreSelected}
          onDownloadFile={() => contextMenu.item && handleDownloadItem(contextMenu.item)}
        />
      )}

      {/* File Preview & Editor Modal */}
      {previewItem && (
        <FilePreviewModal
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onSaveContent={handleSaveFileContent}
        />
      )}

      {/* Properties Modal */}
      {propertiesItem && (
        <PropertiesModal
          item={propertiesItem}
          onClose={() => setPropertiesItem(null)}
        />
      )}
    </div>
  );
}

export default App;