export type NoteColor = 'default' | 'amber' | 'emerald' | 'sky' | 'rose' | 'purple' | 'slate';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  isPinned: boolean;
  isTrashed: boolean;
  color: NoteColor;
  tags: string[];
  checklist: ChecklistItem[];
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  icon?: string;
  isSystem?: boolean;
}

export type SortField = 'updatedAt' | 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'list' | 'grid';
export type MobileView = 'sidebar' | 'list' | 'editor';
