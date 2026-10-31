'use client';

import React, { useState } from 'react';
import { Folder, Note } from '@/types/note';
import {
  Folder as FolderIcon,
  FolderPlus,
  Pin,
  Trash2,
  FileText,
  Moon,
  Sun,
  Database,
  X,
  Tag as TagIcon,
  Check,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  folders: Folder[];
  notes: Note[];
  activeFolderId: string;
  onSelectFolder: (folderId: string) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (folderId: string) => void;
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenExportModal: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  folders,
  notes,
  activeFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  activeTag,
  onSelectTag,
  isDarkMode,
  onToggleTheme,
  onOpenExportModal,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Counts
  const nonTrashedNotes = notes.filter((n) => !n.isTrashed);
  const totalCount = nonTrashedNotes.length;
  const pinnedCount = nonTrashedNotes.filter((n) => n.isPinned).length;
  const trashCount = notes.filter((n) => n.isTrashed).length;

  const getFolderCount = (folderId: string) => {
    return nonTrashedNotes.filter((n) => n.folderId === folderId).length;
  };

  // Collect unique tags
  const tagsMap: Record<string, number> = {};
  nonTrashedNotes.forEach((note) => {
    note.tags?.forEach((tag) => {
      tagsMap[tag] = (tagsMap[tag] || 0) + 1;
    });
  });
  const tagsList = Object.entries(tagsMap).sort((a, b) => b[1] - a[1]);

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim());
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const systemFolders = folders.filter((f) => f.isSystem && f.id !== 'trash');
  const userFolders = folders.filter((f) => !f.isSystem);
  const trashFolder = folders.find((f) => f.id === 'trash');

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-[#15171c] border-r border-slate-200/90 dark:border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-400/15 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base text-slate-900 dark:text-slate-100 leading-tight">
              Notas
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
              Seu caderno digital
            </span>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation & Folders */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Core System Views */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => {
              onSelectFolder('all');
              onSelectTag(null);
              onCloseMobile?.();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
              activeFolderId === 'all' && activeTag === null
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Todas as Notas</span>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectFolder('pinned');
              onSelectTag(null);
              onCloseMobile?.();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
              activeFolderId === 'pinned' && activeTag === null
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Pin className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Fixadas</span>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
              {pinnedCount}
            </span>
          </button>
        </div>

        {/* User Folders */}
        <div className="space-y-1.5">
          <div className="px-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <span>Pastas</span>
            <button
              type="button"
              onClick={() => setIsCreatingFolder(true)}
              className="p-1 rounded-md hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Criar nova pasta"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          {isCreatingFolder && (
            <form onSubmit={handleCreateFolderSubmit} className="px-2 pt-1 pb-2">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 p-1 rounded-lg border border-amber-500/40">
                <input
                  type="text"
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Nome da pasta..."
                  className="flex-1 text-xs bg-transparent border-0 px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="p-1 text-emerald-600 hover:text-emerald-700 disabled:opacity-30"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          <div className="space-y-0.5">
            {userFolders.map((folder) => {
              const count = getFolderCount(folder.id);
              const isActive = activeFolderId === folder.id && activeTag === null;
              return (
                <div
                  key={folder.id}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
                  onClick={() => {
                    onSelectFolder(folder.id);
                    onSelectTag(null);
                    onCloseMobile?.();
                  }}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FolderIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                    <span className="truncate">{folder.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                      {count}
                    </span>
                    {!folder.isSystem && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Deseja excluir a pasta "${folder.name}"? As notas serão mantidas em "Todas as Notas".`)) {
                            onDeleteFolder(folder.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                        title="Excluir pasta"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags Section */}
        {tagsList.length > 0 && (
          <div className="space-y-2">
            <div className="px-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                <TagIcon className="w-3 h-3" />
                Tags
              </span>
              {activeTag && (
                <button
                  type="button"
                  onClick={() => onSelectTag(null)}
                  className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline capitalize"
                >
                  Limpar
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1 px-3">
              {tagsList.map(([tag, count]) => {
                const isSelected = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      onSelectTag(isSelected ? null : tag);
                      onCloseMobile?.();
                    }}
                    className={`px-2 py-1 rounded-md text-xs transition-colors flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-500 text-white font-medium'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>#{tag}</span>
                    <span className="text-[10px] opacity-75 tabular-nums">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Trash */}
        {trashFolder && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={() => {
                onSelectFolder('trash');
                onSelectTag(null);
                onCloseMobile?.();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                activeFolderId === 'trash' && activeTag === null
                  ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>Lixeira</span>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                {trashCount}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Utility Controls */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#121316]/50 flex items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          <span>{isDarkMode ? 'Claro' : 'Escuro'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title="Backup e exportação"
        >
          <Database className="w-4 h-4 text-slate-500" />
          <span>Backup</span>
        </button>
      </div>
    </aside>
  );
}
