import React from 'react';
import { X, HardDrive, FileText, Calendar, ShieldCheck, Tag } from 'lucide-react';
import { FileItem } from '../types';
import { formatBytes, formatDate } from '../utils/formatters';
import { FileIcon } from './FileIcon';

interface PropertiesModalProps {
  item: FileItem;
  onClose: () => void;
}

export const PropertiesModal: React.FC<PropertiesModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-2xl p-4 text-xs select-none animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <FileIcon item={item} className="w-5 h-5" />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[200px]">
              {item.name}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Header Style */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 mt-2 mb-3">
          <span className="pb-1 px-1 border-b-2 border-blue-500 font-medium text-blue-600 dark:text-blue-400">
            General
          </span>
        </div>

        {/* Properties Details */}
        <div className="space-y-3 text-neutral-600 dark:text-neutral-400">
          <div className="flex justify-between items-center py-0.5">
            <span className="font-medium text-neutral-500">Type:</span>
            <span className="text-neutral-800 dark:text-neutral-200 font-medium">
              {item.type === 'folder' ? 'File folder' : `${(item.extension || 'File').toUpperCase()} document`}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="font-medium text-neutral-500">Location:</span>
            <span className="text-neutral-800 dark:text-neutral-200 font-mono text-[11px] truncate max-w-[180px]">
              C:\{item.parentId || 'Root'}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="font-medium text-neutral-500">Size:</span>
            <span className="text-neutral-800 dark:text-neutral-200">
              {item.type === 'folder' ? '--' : `${formatBytes(item.size)} (${item.size?.toLocaleString() || 0} bytes)`}
            </span>
          </div>

          <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800 my-2" />

          <div className="flex justify-between items-center py-0.5">
            <span className="font-medium text-neutral-500">Created:</span>
            <span className="text-neutral-800 dark:text-neutral-200">{formatDate(item.dateModified)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="font-medium text-neutral-500">Modified:</span>
            <span className="text-neutral-800 dark:text-neutral-200">{formatDate(item.dateModified)}</span>
          </div>

          {item.isDeleted && (
            <div className="flex justify-between items-center py-0.5 text-rose-500">
              <span className="font-medium">Deleted on:</span>
              <span>{formatDate(item.deletedAt || '')}</span>
            </div>
          )}

          <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800 my-2" />

          <div className="flex items-center gap-4 text-neutral-500">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600 pointer-events-none" />
              <span>Read-only</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" className="rounded text-blue-600 pointer-events-none" />
              <span>Hidden</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
