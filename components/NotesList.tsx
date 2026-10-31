'use client';

import React from 'react';
import { Note, Folder, ViewMode, SortField } from '@/types/note';
import { formatRelativeDate } from '@/lib/date-utils';
import { COLOR_SCHEMES } from '@/lib/theme-colors';
import {
  Search,
  Plus,
  Pin,
  PinOff,
  Trash2,
  RotateCcw,
  LayoutGrid,
  List as ListIcon,
  CheckCircle2,
  Menu,
  X,
  FileQuestion,
  ArrowUpDown,
} from 'lucide-react';

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onCreateNote: () => void;
  onTogglePin: (noteId: string, e: React.MouseEvent) => void;
  onDeleteNote: (noteId: string, e: React.MouseEvent) => void;
  onRestoreNote: (noteId: string, e: React.MouseEvent) => void;
  onEmptyTrash: () => void;
  activeFolder: Folder | undefined;
  activeTag: string | null;
  searchTerm: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  sortField: SortField;
  onSortChange: (field: SortField) => void;
  folders: Folder[];
  onOpenMobileSidebar: () => void;
}

export function NotesList({
  notes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  onTogglePin,
  onDeleteNote,
  onRestoreNote,
  onEmptyTrash,
  activeFolder,
  activeTag,
  searchTerm,
  onSearchChange,
  viewMode,
  onToggleViewMode,
  sortField,
  onSortChange,
  folders,
  onOpenMobileSidebar,
}: NotesListProps) {
  const isTrash = activeFolder?.id === 'trash';
  const isPinnedView = activeFolder?.id === 'pinned';

  // Find folder name helper
  const getFolderName = (folderId: string) => {
    const f = folders.find((item) => item.id === folderId);
    return f ? f.name : '';
  };

  // Group notes into pinned and unpinned (unless we are in pinned view or trash)
  const showSeparatedPinned = !isTrash && !isPinnedView && !searchTerm;
  const pinnedNotes = showSeparatedPinned ? notes.filter((n) => n.isPinned) : [];
  const otherNotes = showSeparatedPinned ? notes.filter((n) => !n.isPinned) : notes;

  const renderNoteCard = (note: Note) => {
    const isSelected = selectedNoteId === note.id;
    const colorScheme = COLOR_SCHEMES[note.color] || COLOR_SCHEMES.default;
    const folderName = getFolderName(note.folderId);
    const dateFormatted = formatRelativeDate(note.updatedAt);

    const checklistTotal = note.checklist?.length || 0;
    const checklistDone = note.checklist?.filter((c) => c.completed).length || 0;

    return (
      <div
        key={note.id}
        onClick={() => onSelectNote(note.id)}
        className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer ${colorScheme.bgLight} ${colorScheme.bgDark} ${
          isSelected
            ? 'ring-2 ring-amber-500/80 border-transparent shadow-xs'
            : `${colorScheme.borderLight} ${colorScheme.borderDark} hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs`
        }`}
      >
        {/* Top row: Title and Pin / Restore */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate flex-1">
            {note.title.trim() ? note.title : 'Nota sem título'}
          </h4>

          <div className="flex items-center gap-1 shrink-0">
            {isTrash ? (
              <button
                type="button"
                onClick={(e) => onRestoreNote(note.id, e)}
                className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                title="Restaurar nota"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => onTogglePin(note.id, e)}
                className={`p-1 rounded-md transition-colors ${
                  note.isPinned
                    ? 'text-amber-500 hover:text-amber-600'
                    : 'text-slate-400 opacity-0 group-hover:opacity-100 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title={note.isPinned ? 'Desafixar nota' : 'Fixar nota no topo'}
              >
                {note.isPinned ? (
                  <Pin className="w-3.5 h-3.5 fill-amber-500" />
                ) : (
                  <PinOff className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content Preview Snippet */}
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {note.content.trim() ? note.content : 'Sem conteúdo adicional...'}
        </p>

        {/* Checklist Progress if present */}
        {checklistTotal > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="tabular-nums">
              {checklistDone} de {checklistTotal} concluídas
            </span>
          </div>
        )}

        {/* Bottom Unboxed Metadata (Zero-pill discipline) */}
        <div className="mt-2.5 pt-2 border-t border-slate-100/80 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <span>{dateFormatted}</span>
            {folderName && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate">{folderName}</span>
              </>
            )}
            {note.tags && note.tags.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate text-amber-600/80 dark:text-amber-400/80">
                  #{note.tags[0]}
                </span>
              </>
            )}
          </div>

          {!isTrash && (
            <button
              type="button"
              onClick={(e) => onDeleteNote(note.id, e)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity shrink-0"
              title="Mover para lixeira"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-[#181a20] border-r border-slate-200/90 dark:border-slate-800/80 flex flex-col shrink-0 h-full overflow-hidden">
      {/* Top Header & Search Bar */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 space-y-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <button
              type="button"
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Abrir menu de pastas"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="truncate">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                {activeTag ? `#${activeTag}` : activeFolder?.name || 'Notas'}
              </h2>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
                {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onToggleViewMode}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={viewMode === 'list' ? 'Visualizar em grade' : 'Visualizar em lista'}
            >
              {viewMode === 'list' ? <LayoutGrid className="w-4 h-4" /> : <ListIcon className="w-4 h-4" />}
            </button>

            {!isTrash && (
              <button
                type="button"
                onClick={onCreateNote}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium text-xs shadow-xs transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="font-semibold">Nova</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar em títulos e conteúdo..."
            className="w-full text-xs sm:text-sm pl-9 pr-8 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-transparent focus:border-amber-500/50 dark:focus:border-amber-500/50 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sorting selection row */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <div className="flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <span>Ordenar:</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onSortChange('updatedAt')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                sortField === 'updatedAt'
                  ? 'text-amber-600 dark:text-amber-400 font-semibold'
                  : 'hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Recentes
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onSortChange('createdAt')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                sortField === 'createdAt'
                  ? 'text-amber-600 dark:text-amber-400 font-semibold'
                  : 'hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Criadas
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onSortChange('title')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                sortField === 'title'
                  ? 'text-amber-600 dark:text-amber-400 font-semibold'
                  : 'hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              A-Z
            </button>
          </div>
        </div>
      </div>

      {/* Trash Warning Banner */}
      {isTrash && notes.length > 0 && (
        <div className="p-3 mx-3 my-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between gap-2 shrink-0">
          <span className="text-xs text-rose-700 dark:text-rose-300">
            Itens na lixeira
          </span>
          <button
            type="button"
            onClick={onEmptyTrash}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
          >
            Esvaziar
          </button>
        </div>
      )}

      {/* Notes List Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {notes.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
              <FileQuestion className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {searchTerm ? 'Nenhuma nota encontrada' : 'Nenhuma nota por aqui'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {searchTerm
                  ? 'Tente buscar por outras palavras-chave ou limpe a busca.'
                  : isTrash
                  ? 'A lixeira está vazia.'
                  : 'Clique no botão acima para criar sua primeira nota nesta pasta.'}
              </p>
            </div>
            {!isTrash && !searchTerm && (
              <button
                type="button"
                onClick={onCreateNote}
                className="mt-2 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs hover:bg-amber-600 transition-colors"
              >
                Criar Nova Nota
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Pinned Section */}
            {pinnedNotes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <Pin className="w-3 h-3 fill-amber-500" />
                  <span>Fixadas ({pinnedNotes.length})</span>
                </div>
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5' : 'space-y-2'}>
                  {pinnedNotes.map(renderNoteCard)}
                </div>
              </div>
            )}

            {/* Other / All Notes Section */}
            {otherNotes.length > 0 && (
              <div className="space-y-2">
                {pinnedNotes.length > 0 && (
                  <div className="px-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 pt-2">
                    <span>Outras Notas ({otherNotes.length})</span>
                  </div>
                )}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5' : 'space-y-2'}>
                  {otherNotes.map(renderNoteCard)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
