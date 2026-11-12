import React, { useState } from 'react';
import { X, Save, Film, Music, Download } from 'lucide-react';
import { FileItem } from '../types';
import { formatBytes, formatDate } from '../utils/formatters';

interface FilePreviewModalProps {
  item: FileItem;
  onClose: () => void;
  onSaveContent: (itemId: string, newContent: string) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  item,
  onClose,
  onSaveContent,
}) => {
  const [content, setContent] = useState(item.content || '');
  const [hasChanges, setHasChanges] = useState(false);

  const ext = item.extension?.toLowerCase() || '';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext) || item.category === 'image';
  const isVideo = ['mp4', 'webm', 'ogg'].includes(ext) || item.category === 'video';
  const isAudio = ['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(ext) || item.category === 'audio';

  const handleSave = () => {
    onSaveContent(item.id, content);
    setHasChanges(false);
  };

  const handleDownload = () => {
    if (item.videoUrl) {
      window.open(item.videoUrl, '_blank');
      return;
    }
    if (item.audioUrl) {
      window.open(item.audioUrl, '_blank');
      return;
    }
    const blob = new Blob([content || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-3xl h-[80vh] flex flex-col bg-white border border-neutral-300 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-100/80">
          <div className="flex items-center gap-2 truncate">
            <span className="text-sm font-semibold text-neutral-800 truncate">
              {item.name}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-neutral-200 text-neutral-600 uppercase font-mono">
              {item.extension || 'file'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-md hover:bg-neutral-200 text-neutral-600 cursor-pointer"
              title="Download to PC"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-rose-500 hover:text-white text-neutral-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center bg-neutral-50/70">
          {isImage ? (
            <div className="h-full flex flex-col items-center justify-center">
              <img
                src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'}
                alt={item.name}
                className="max-h-[60vh] max-w-full rounded-lg shadow-lg object-contain"
              />
              <span className="mt-3 text-xs text-neutral-500">
                Resolution preview • {formatBytes(item.size)}
              </span>
            </div>
          ) : isVideo ? (
            <div className="h-full flex flex-col items-center justify-center w-full max-w-2xl">
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center shadow-xl">
                {item.videoUrl ? (
                  <video
                    src={item.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support HTML5 video.
                  </video>
                ) : (
                  <div className="flex flex-col items-center justify-center text-white/80 p-4">
                    <Film className="w-12 h-12 mb-2 animate-bounce" />
                    <span>No playable video stream link</span>
                  </div>
                )}
              </div>
              <p className="mt-3 text-xs text-neutral-600 text-center">
                {item.content || 'Media preview loaded.'}
              </p>
            </div>
          ) : isAudio ? (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-md w-full bg-white rounded-2xl border border-neutral-200/80 shadow-md">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center mb-4 text-white shadow-lg animate-pulse">
                <Music className="w-12 h-12" />
              </div>
              <h3 className="font-semibold text-neutral-800 text-base mb-1">{item.name}</h3>
              <p className="text-xs text-neutral-500 mb-6">{item.content || 'Windows Media Audio Player'}</p>
              
              {/* HTML5 Audio Player */}
              {item.audioUrl ? (
                <div className="w-full bg-neutral-100 p-3 rounded-xl border border-neutral-200">
                  <audio
                    src={item.audioUrl}
                    controls
                    autoPlay
                    className="w-full"
                  >
                    Your browser does not support HTML5 audio.
                  </audio>
                </div>
              ) : (
                <div className="w-full bg-neutral-100 p-4 rounded-xl border border-neutral-200 text-neutral-500 text-xs">
                  Audio file preview available. Connect external URL or import audio.
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <div className="flex items-center justify-between pb-2 text-xs text-neutral-500">
                <span>Text / Code Editor</span>
                <span>{content.length} characters</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setHasChanges(true);
                }}
                className="w-full flex-1 p-3.5 font-mono text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-800 resize-none shadow-inner"
                placeholder="Empty document. Start typing here..."
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-200 bg-neutral-100/70 text-xs text-neutral-600">
          <div>
            <span>Modified: {formatDate(item.dateModified)}</span>
            <span className="mx-2">•</span>
            <span>Size: {formatBytes(item.size)}</span>
          </div>

          {!isImage && !isVideo && !isAudio && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-medium transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
