'use client';

import React, { useState, useEffect, useMemo, useCallback, useSyncExternalStore } from 'react';
import { Note, Folder, ViewMode, SortField, MobileView } from '@/types/note';
import { INITIAL_FOLDERS, INITIAL_NOTES } from '@/lib/initial-data';
import { Sidebar } from '@/components/Sidebar';
import { NotesList } from '@/components/NotesList';
import { NoteEditor } from '@/components/NoteEditor';
import { ExportModal } from '@/components/ExportModal';

const LOCAL_STORAGE_NOTES_KEY = 'notas_app_notes_v1';
const LOCAL_STORAGE_FOLDERS_KEY = 'notas_app_folders_v1';
const LOCAL_STORAGE_THEME_KEY = 'notas_app_theme_v1';

function getInitialNotes(): Note[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_NOTES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading notes from localStorage', e);
    }
  }
  return INITIAL_NOTES;
}

function getInitialFolders(): Folder[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FOLDERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading folders from localStorage', e);
    }
  }
  return INITIAL_FOLDERS;
}

function getInitialTheme(): boolean {
  if (typeof window !== 'undefined') {
    try {
      const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        return true;
      } else if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        return false;
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        return true;
      }
    } catch (e) {
      console.error('Error reading theme from localStorage', e);
    }
  }
  return false;
}

export default function NotesPage() {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [notes, setNotes] = useState<Note[]>(getInitialNotes);
  const [folders, setFolders] = useState<Folder[]>(getInitialFolders);
  const [activeFolderId, setActiveFolderId] = useState<string>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(() => {
    const init = getInitialNotes();
    return init[0]?.id || null;
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<MobileView>('list');

  // Save notes to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_NOTES_KEY, JSON.stringify(notes));
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  }, [notes, isMounted]);

  // Save folders to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_FOLDERS_KEY, JSON.stringify(folders));
    } catch (err) {
      console.error('Failed to save folders:', err);
    }
  }, [folders, isMounted]);

  // Theme Toggle handler
  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, 'light');
      }
      return next;
    });
  };

  // Create note callback
  const handleCreateNote = useCallback(() => {
    let targetFolderId = 'pessoal';
    if (activeFolderId && !['all', 'pinned', 'trash'].includes(activeFolderId)) {
      targetFolderId = activeFolderId;
    }

    const newNote: Note = {
      id: 'note-' + Date.now(),
      title: '',
      content: '',
      folderId: targetFolderId,
      isPinned: activeFolderId === 'pinned',
      isTrashed: false,
      color: 'default',
      tags: activeTag ? [activeTag] : [],
      checklist: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setMobileView('editor');
  }, [activeFolderId, activeTag]);

  // Keyboard shortcut Ctrl+N / Cmd+N to create a note
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleCreateNote();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCreateNote]);

  // Active folder object
  const activeFolder = useMemo(() => {
    return folders.find((f) => f.id === activeFolderId) || folders[0];
  }, [folders, activeFolderId]);

  // Filter notes based on folder, tag, and search query
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // Trash filter
        if (activeFolderId === 'trash') {
          return note.isTrashed;
        }
        if (note.isTrashed) {
          return false;
        }

        // Tag filter
        if (activeTag) {
          if (!note.tags || !note.tags.includes(activeTag)) {
            return false;
          }
        }

        // Folder filter
        if (activeFolderId === 'pinned') {
          if (!note.isPinned) return false;
        } else if (activeFolderId !== 'all') {
          if (note.folderId !== activeFolderId) return false;
        }

        // Search query filter
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = note.title.toLowerCase().includes(query);
          const matchContent = note.content.toLowerCase().includes(query);
          const matchTag = note.tags?.some((t) => t.toLowerCase().includes(query));
          const matchChecklist = note.checklist?.some((c) =>
            c.text.toLowerCase().includes(query)
          );
          if (!matchTitle && !matchContent && !matchTag && !matchChecklist) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortField === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortField === 'createdAt') {
          return b.createdAt - a.createdAt;
        }
        return b.updatedAt - a.updatedAt;
      });
  }, [notes, activeFolderId, activeTag, searchTerm, sortField]);

  // Active selected note
  const currentSelectedNote = useMemo(() => {
    if (!selectedNoteId) return null;
    return notes.find((n) => n.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  const handleUpdateNote = (updatedFields: Partial<Note>) => {
    if (!selectedNoteId) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId
          ? { ...n, ...updatedFields, updatedAt: Date.now() }
          : n
      )
    );
  };

  const handleTogglePin = (noteId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleDeleteNote = (noteId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isTrashed: true } : n))
    );

    // If active note was trashed, pick next available
    if (selectedNoteId === noteId) {
      const remaining = filteredNotes.filter((n) => n.id !== noteId);
      setSelectedNoteId(remaining[0]?.id || null);
    }
  };

  const handleRestoreNote = (noteId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isTrashed: false } : n))
    );
  };

  const handlePermanentDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (selectedNoteId === noteId) {
      const remaining = notes.filter((n) => n.id !== noteId && n.isTrashed);
      setSelectedNoteId(remaining[0]?.id || null);
    }
  };

  const handleEmptyTrash = () => {
    if (confirm('Tem certeza de que deseja esvaziar a lixeira? Todas as notas excluídas serão removidas permanentemente.')) {
      setNotes((prev) => prev.filter((n) => !n.isTrashed));
      setSelectedNoteId(null);
    }
  };

  const handleCreateFolder = (name: string) => {
    const newFolder: Folder = {
      id: 'folder-' + Date.now(),
      name,
    };
    setFolders((prev) => [...prev, newFolder]);
    setActiveFolderId(newFolder.id);
  };

  const handleDeleteFolder = (folderId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.folderId === folderId ? { ...n, folderId: 'pessoal' } : n))
    );
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    if (activeFolderId === folderId) {
      setActiveFolderId('all');
    }
  };

  const handleImportBackup = (importedNotes: Note[], importedFolders: Folder[]) => {
    if (importedNotes.length > 0) {
      setNotes(importedNotes);
      setSelectedNoteId(importedNotes[0]?.id || null);
    }
    if (importedFolders.length > 0) {
      const existingIds = new Set(folders.map((f) => f.id));
      const combinedFolders = [...folders];
      importedFolders.forEach((f) => {
        if (!existingIds.has(f.id)) {
          combinedFolders.push(f);
        }
      });
      setFolders(combinedFolders);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#f9f9fb] dark:bg-[#121316] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f9f9fb] dark:bg-[#121316] select-none">
      {/* Mobile Backdrop for sidebar drawer */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Column 1: Sidebar */}
      <Sidebar
        folders={folders}
        notes={notes}
        activeFolderId={activeFolderId}
        onSelectFolder={(id) => {
          setActiveFolderId(id);
          setMobileView('list');
        }}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        activeTag={activeTag}
        onSelectTag={(tag) => {
          setActiveTag(tag);
          setMobileView('list');
        }}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace: 2 Columns on desktop, or switched on mobile */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 2: Notes List */}
        <div
          className={`h-full ${
            mobileView === 'editor' ? 'hidden md:flex' : 'flex w-full md:w-auto'
          }`}
        >
          <NotesList
            notes={filteredNotes}
            selectedNoteId={selectedNoteId}
            onSelectNote={(id) => {
              setSelectedNoteId(id);
              setMobileView('editor');
            }}
            onCreateNote={handleCreateNote}
            onTogglePin={handleTogglePin}
            onDeleteNote={(id, e) => handleDeleteNote(id, e)}
            onRestoreNote={(id, e) => handleRestoreNote(id, e)}
            onEmptyTrash={handleEmptyTrash}
            activeFolder={activeFolder}
            activeTag={activeTag}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            viewMode={viewMode}
            onToggleViewMode={() =>
              setViewMode((prev) => (prev === 'list' ? 'grid' : 'list'))
            }
            sortField={sortField}
            onSortChange={setSortField}
            folders={folders}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />
        </div>

        {/* Column 3: Note Editor */}
        <div
          className={`flex-1 h-full ${
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <NoteEditor
            note={currentSelectedNote}
            folders={folders}
            onUpdateNote={handleUpdateNote}
            onTogglePin={() => {
              if (currentSelectedNote) handleTogglePin(currentSelectedNote.id);
            }}
            onDeleteNote={() => {
              if (currentSelectedNote) handleDeleteNote(currentSelectedNote.id);
            }}
            onRestoreNote={() => {
              if (currentSelectedNote) handleRestoreNote(currentSelectedNote.id);
            }}
            onPermanentDeleteNote={() => {
              if (currentSelectedNote) handlePermanentDeleteNote(currentSelectedNote.id);
            }}
            onBackToMobileList={() => setMobileView('list')}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        </div>
      </div>

      {/* Export & Backup Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentNote={currentSelectedNote}
        allNotes={notes}
        allFolders={folders}
        onImportBackup={handleImportBackup}
      />
    </div>
  );
}
