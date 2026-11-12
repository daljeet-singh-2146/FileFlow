import React from 'react';
import { 
  Folder, 
  FileText, 
  Image, 
  Film, 
  Music, 
  FileArchive, 
  FileCode, 
  FileQuestion,
  FileSpreadsheet,
  Binary
} from 'lucide-react';
import { FileItem } from '../types';
import { FlowFolderIcon } from './FlowFolderIcon';

interface FileIconProps {
  item: FileItem;
  className?: string;
  size?: number;
}

export const FileIcon: React.FC<FileIconProps> = ({ item, className = 'w-5 h-5', size = 20 }) => {
  if (item.type === 'folder') {
    return <FlowFolderIcon type="generic" size={size} className={className} />;
  }

  const ext = item.extension?.toLowerCase() || '';

  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext) || item.category === 'image') {
    return <Image size={size} className={`${className} text-teal-500`} />;
  }

  if (['mp4', 'mkv', 'mov', 'avi', 'webm'].includes(ext) || item.category === 'video') {
    return <Film size={size} className={`${className} text-purple-500`} />;
  }

  if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext) || item.category === 'audio') {
    return <Music size={size} className={`${className} text-rose-500`} />;
  }

  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || item.category === 'archive') {
    return <FileArchive size={size} className={`${className} text-amber-500`} />;
  }

  if (['xlsx', 'xls', 'csv'].includes(ext)) {
    return <FileSpreadsheet size={size} className={`${className} text-emerald-600`} />;
  }

  if (['docx', 'doc', 'pdf', 'txt', 'md', 'rtf'].includes(ext) || item.category === 'document') {
    if (ext === 'pdf') {
      return <FileText size={size} className={`${className} text-red-500`} />;
    }
    return <FileText size={size} className={`${className} text-blue-500`} />;
  }

  if (['js', 'ts', 'tsx', 'jsx', 'json', 'html', 'css', 'py', 'cpp', 'rs'].includes(ext) || item.category === 'code') {
    return <FileCode size={size} className={`${className} text-indigo-500`} />;
  }

  if (['exe', 'dmg', 'app', 'pkg', 'bin'].includes(ext) || item.category === 'system') {
    return <Binary size={size} className={`${className} text-neutral-500`} />;
  }

  return <FileQuestion size={size} className={`${className} text-neutral-400`} />;
};
