export type ItemType = 'file' | 'folder';

export interface FileItem {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null; // null if in root drive or special system root
  size?: number; // in bytes
  dateModified: string;
  category?: 'document' | 'image' | 'video' | 'audio' | 'code' | 'archive' | 'system' | 'other';
  extension?: string;
  content?: string; // Preview text, note content, or placeholder description
  thumbnailUrl?: string; // For images/videos
  videoUrl?: string; // Direct streamable/playable video URL
  audioUrl?: string; // Direct streamable/playable audio URL
  isStarred?: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  originalParentId?: string | null;
  tagColor?: string;
}

export type SpecialFolder = 
  | 'home' 
  | 'favorites'
  | 'desktop' 
  | 'documents' 
  | 'downloads' 
  | 'pictures' 
  | 'music' 
  | 'videos' 
  | 'recycle_bin'
  | 'c_drive';

export type ViewMode = 'details' | 'large_icons' | 'medium_icons' | 'small_icons' | 'list' | 'tiles';

export type SortField = 'name' | 'dateModified' | 'type' | 'size';
export type SortOrder = 'asc' | 'desc';

export interface TabInfo {
  id: string;
  title: string;
  currentFolderId: string | SpecialFolder;
  history: (string | SpecialFolder)[];
  historyIndex: number;
}
