import React, { useState, useEffect } from 'react';
import { Plus, X, Folder } from 'lucide-react';
import { TabInfo } from '../types';

interface TabsBarProps {
  tabs: TabInfo[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewTab: () => void;
}

export const TabsBar: React.FC<TabsBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleMinimize = () => {
    alert("FileFlow: Minimized");
  };

  const handleClose = () => {
    alert("FileFlow: Window Closed");
  };

  return (
    <div className="flex items-center justify-between bg-[#EFEFEF] px-4 py-2.5 border-b border-[#D1D1D1] select-none rounded-t-xl">
      {/* Left: Window Control Buttons */}
      <div className="flex items-center gap-2 group/traffic mr-4">
        {/* Close (Red) */}
        <button
          onClick={handleClose}
          className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center cursor-pointer shadow-xs active:brightness-90"
          title="Close window"
        >
          <span className="text-[8px] font-bold text-[#4C0000] opacity-0 group-hover/traffic:opacity-100 leading-none">✕</span>
        </button>

        {/* Minimize (Yellow) */}
        <button
          onClick={handleMinimize}
          className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center cursor-pointer shadow-xs active:brightness-90"
          title="Minimize"
        >
          <span className="text-[9px] font-bold text-[#5C3D00] opacity-0 group-hover/traffic:opacity-100 leading-none pb-0.5">−</span>
        </button>

        {/* Zoom / Fullscreen (Green) */}
        <button
          onClick={toggleFullscreen}
          className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center cursor-pointer shadow-xs active:brightness-90"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          <span className="text-[8px] font-bold text-[#0A4714] opacity-0 group-hover/traffic:opacity-100 leading-none">⤢</span>
        </button>
      </div>

      {/* Center: FileFlow Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-1 max-w-2xl">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center gap-2 px-3 py-1 rounded-md text-xs cursor-pointer max-w-[200px] min-w-[120px] transition-all ${
                isActive
                  ? 'bg-white shadow-xs text-neutral-800 font-semibold border border-neutral-200/80'
                  : 'bg-neutral-200/60 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate flex-1 text-[12px]">{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="p-0.5 rounded-full hover:bg-neutral-300 text-neutral-400 hover:text-neutral-700 opacity-60 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add Tab Button */}
        <button
          onClick={onNewTab}
          className="p-1 rounded-md hover:bg-neutral-300/80 text-neutral-600 cursor-pointer"
          title="New tab (Cmd+T / Ctrl+T)"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right title text */}
      <div className="text-[12px] font-semibold text-neutral-500 pl-2 hidden sm:block tracking-tight">
        FileFlow
      </div>
    </div>
  );
};
