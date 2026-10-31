'use client';

import React, { useRef, useState } from 'react';
import { Note, Folder, NoteColor } from '@/types/note';
import { ChecklistEditor } from './ChecklistEditor';
import { formatRelativeDate, getWordAndCharCount } from '@/lib/date-utils';
import { COLOR_SCHEMES } from '@/lib/theme-colors';
import {
  ChevronLeft,
  Pin,
  PinOff,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  CheckSquare,
  Share2,
  Folder as FolderIcon,
  Tag as TagIcon,
  Palette,
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  X,
  Plus,
} from 'lucide-react';

interface NoteEditorProps {
  note: Note | null;
  folders: Folder[];
  onUpdateNote: (updatedNote: Partial<Note>) => void;
  onTogglePin: () => void;
  onDeleteNote: () => void;
  onRestoreNote: () => void;
  onPermanentDeleteNote: () => void;
  onBackToMobileList?: () => void;
  onOpenExportModal: () => void;
}

export function NoteEditor({
  note,
  folders,
  onUpdateNote,
  onTogglePin,
  onDeleteNote,
  onRestoreNote,
  onPermanentDeleteNote,
  onBackToMobileList,
  onOpenExportModal,
}: NoteEditorProps) {
  const [copied, setCopied] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-[#121316]">
        <div className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-800/80 shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center justify-center text-amber-500 mb-4">
          <CheckSquare className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
          Nenhuma nota selecionada
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm">
          Selecione uma nota na lista ao lado ou crie uma nova para começar a escrever suas ideias e listas.
        </p>
      </div>
    );
  }

  const isTrash = note.isTrashed;
  const colorScheme = COLOR_SCHEMES[note.color] || COLOR_SCHEMES.default;
  const userFolders = folders.filter((f) => !f.isSystem);
  const { words, chars } = getWordAndCharCount(note.content, note.checklist);

  const handleCopy = () => {
    let fullText = `${note.title}\n\n${note.content}`;
    if (note.checklist && note.checklist.length > 0) {
      fullText += '\n\nTarefas:\n' + note.checklist.map((c) => `[${c.completed ? 'x' : ' '}] ${c.text}`).join('\n');
    }
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTag = newTagInput.trim().toLowerCase().replace(/^#/, '');
    if (!cleanTag) return;
    const currentTags = note.tags || [];
    if (!currentTags.includes(cleanTag)) {
      onUpdateNote({ tags: [...currentTags, cleanTag] });
    }
    setNewTagInput('');
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = note.tags || [];
    onUpdateNote({ tags: currentTags.filter((t) => t !== tagToRemove) });
  };

  const handleToggleChecklistMode = () => {
    if (note.checklist && note.checklist.length > 0) {
      // Keep it, but add an item if empty
      onUpdateNote({
        checklist: [
          ...note.checklist,
          {
            id: 'chk-' + Date.now(),
            text: '',
            completed: false,
          },
        ],
      });
    } else {
      onUpdateNote({
        checklist: [
          {
            id: 'chk-' + Date.now(),
            text: 'Primeira tarefa',
            completed: false,
          },
        ],
      });
    }
  };

  // Formatting helpers for textarea
  const applyFormat = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea || isTrash) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousContent = note.content;
    const selectedText = previousContent.substring(start, end);

    const replacement = `${prefix}${selectedText || 'texto'}${suffix}`;
    const newContent =
      previousContent.substring(0, start) +
      replacement +
      previousContent.substring(end);

    onUpdateNote({ content: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText ? selectedText.length : 5)
      );
    }, 0);
  };

  const insertLineFormat = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea || isTrash) return;

    const start = textarea.selectionStart;
    const previousContent = note.content;
    const beforeCursor = previousContent.substring(0, start);
    const afterCursor = previousContent.substring(start);

    const needsNewline = beforeCursor.length > 0 && !beforeCursor.endsWith('\n');
    const insertion = `${needsNewline ? '\n' : ''}${prefix} `;

    const newContent = beforeCursor + insertion + afterCursor;
    onUpdateNote({ content: newContent });

    setTimeout(() => {
      textarea.focus();
      const pos = start + insertion.length;
      textarea.setSelectionRange(pos, pos);
    }, 0);
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-hidden transition-colors ${colorScheme.bgLight} ${colorScheme.bgDark}`}
    >
      {/* Top Toolbar */}
      <div className="h-16 px-4 sm:px-6 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3 shrink-0 bg-white/70 dark:bg-[#15171c]/70 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          {onBackToMobileList && (
            <button
              type="button"
              onClick={onBackToMobileList}
              className="md:hidden flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Notas</span>
            </button>
          )}

          {/* Folder Selector */}
          {!isTrash && (
            <div className="relative flex items-center">
              <FolderIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={note.folderId}
                onChange={(e) => onUpdateNote({ folderId: e.target.value })}
                className="pl-8 pr-7 py-1.5 text-xs font-medium rounded-lg bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer appearance-none"
              >
                {userFolders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Color Palette Picker */}
          {!isTrash && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Cor de destaque da nota"
              >
                <Palette className="w-4 h-4" />
              </button>

              {showColorPicker && (
                <div className="absolute left-0 mt-2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-30 flex items-center gap-1.5">
                  {(Object.keys(COLOR_SCHEMES) as NoteColor[]).map((cKey) => {
                    const c = COLOR_SCHEMES[cKey];
                    return (
                      <button
                        key={cKey}
                        type="button"
                        onClick={() => {
                          onUpdateNote({ color: cKey });
                          setShowColorPicker(false);
                        }}
                        className={`w-5 h-5 rounded-full ${c.dot} transition-transform hover:scale-110 flex items-center justify-center ${
                          note.color === cKey ? 'ring-2 ring-offset-2 ring-slate-400' : ''
                        }`}
                        title={c.label}
                      >
                        {note.color === cKey && <Check className="w-3 h-3 text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Checklist Mode Toggle */}
          {!isTrash && (
            <button
              type="button"
              onClick={handleToggleChecklistMode}
              className={`p-2 rounded-lg transition-colors ${
                note.checklist && note.checklist.length > 0
                  ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Adicionar ou alternar tarefas"
            >
              <CheckSquare className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5">
          {!isTrash && (
            <button
              type="button"
              onClick={onTogglePin}
              className={`p-2 rounded-lg transition-colors ${
                note.isPinned
                  ? 'text-amber-500 hover:text-amber-600 bg-amber-500/10'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={note.isPinned ? 'Desafixar nota' : 'Fixar nota'}
            >
              {note.isPinned ? <Pin className="w-4 h-4 fill-amber-500" /> : <PinOff className="w-4 h-4" />}
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Copiar texto da nota"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenExportModal}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Exportar nota"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {isTrash ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onRestoreNote}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Deseja excluir esta nota permanentemente? Esta ação não pode ser desfeita.')) {
                    onPermanentDeleteNote();
                  }
                }}
                className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Excluir permanentemente"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onDeleteNote}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Mover para a lixeira"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Trash Alert banner */}
      {isTrash && (
        <div className="px-6 py-2.5 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-200/80 dark:border-rose-900/60 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
          <span>Esta nota está na lixeira. Restaure-a para fazer edições.</span>
          <button
            type="button"
            onClick={onRestoreNote}
            className="underline font-medium hover:text-rose-900 dark:hover:text-rose-100"
          >
            Restaurar agora
          </button>
        </div>
      )}

      {/* Formatting Toolbar */}
      {!isTrash && (
        <div className="px-4 sm:px-6 py-1.5 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center gap-1 overflow-x-auto bg-slate-50/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 shrink-0">
          <button
            type="button"
            onClick={() => applyFormat('**', '**')}
            className="p-1.5 rounded hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            title="Negrito (**texto**)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('*', '*')}
            className="p-1.5 rounded hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            title="Itálico (*texto*)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('~~', '~~')}
            className="p-1.5 rounded hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            title="Tachado (~~texto~~)"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          <button
            type="button"
            onClick={() => insertLineFormat('#')}
            className="p-1.5 rounded hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            title="Título 1 (# Título)"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertLineFormat('##')}
            className="p-1.5 rounded hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            title="Título 2 (## Subtítulo)"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          <button
            type="button"
            onClick={() => insertLineFormat('•')}
            className="p-1.5 rounded hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            title="Lista com marcadores"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertLineFormat('1.')}
            className="p-1.5 rounded hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            title="Lista numerada"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertLineFormat('>')}
            className="p-1.5 rounded hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            title="Citação (> Citação)"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('`', '`')}
            className="p-1.5 rounded hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            title="Código inline (`código`)"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Editor Body Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-10 lg:px-14 flex flex-col space-y-4 max-w-4xl w-full mx-auto">
        {/* Date & Stats Header */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-2 pb-1">
          <div className="flex items-center gap-1.5">
            <span>Editada {formatRelativeDate(note.updatedAt)}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-mono">{words} palavras</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-mono">{chars} caracteres</span>
          </div>
          <span className="text-[11px] text-emerald-600/90 dark:text-emerald-400/80 font-medium">
            Salvo localmente
          </span>
        </div>

        {/* Title Input */}
        <input
          type="text"
          disabled={isTrash}
          value={note.title}
          onChange={(e) => onUpdateNote({ title: e.target.value })}
          placeholder="Título da nota..."
          className="w-full text-2xl sm:text-3xl font-bold bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-colors"
        />

        {/* Tags Section */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {note.tags &&
            note.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
              >
                #{tag}
                {!isTrash && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-amber-900 dark:hover:text-amber-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}

          {!isTrash && (
            <>
              {isAddingTag ? (
                <form onSubmit={handleAddTag} className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    autoFocus
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder="tag..."
                    className="w-20 text-xs px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-amber-500 focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                  <button type="submit" className="text-xs text-amber-600 font-semibold px-1">
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingTag(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingTag(true)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Adicionar tag</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Interactive Checklist if present */}
        {note.checklist && note.checklist.length > 0 && (
          <ChecklistEditor
            items={note.checklist}
            readOnly={isTrash}
            onChange={(items) => onUpdateNote({ checklist: items })}
          />
        )}

        {/* Content Textarea */}
        <textarea
          ref={textareaRef}
          disabled={isTrash}
          value={note.content}
          onChange={(e) => onUpdateNote({ content: e.target.value })}
          placeholder="Comece a digitar seu texto aqui..."
          rows={16}
          className="flex-1 w-full bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none font-sans"
        />
      </div>
    </div>
  );
}
