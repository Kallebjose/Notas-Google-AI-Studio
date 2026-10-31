'use client';

import React, { useRef } from 'react';
import { Note, Folder } from '@/types/note';
import { Download, Upload, Copy, Check, X, FileText, Database } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNote: Note | null;
  allNotes: Note[];
  allFolders: Folder[];
  onImportBackup: (importedNotes: Note[], importedFolders: Folder[]) => void;
}

export function ExportModal({
  isOpen,
  onClose,
  currentNote,
  allNotes,
  allFolders,
  onImportBackup,
}: ExportModalProps) {
  const [copied, setCopied] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCopyCurrentNote = () => {
    if (!currentNote) return;
    let fullText = `${currentNote.title}\n\n${currentNote.content}`;
    if (currentNote.checklist && currentNote.checklist.length > 0) {
      fullText += '\n\nTarefas:\n' + currentNote.checklist.map(c => `[${c.completed ? 'x' : ' '}] ${c.text}`).join('\n');
    }
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadNote = (format: 'txt' | 'md') => {
    if (!currentNote) return;
    let content = '';
    if (format === 'md') {
      content = `# ${currentNote.title || 'Sem título'}\n\n${currentNote.content}`;
      if (currentNote.checklist && currentNote.checklist.length > 0) {
        content += '\n\n### Tarefas\n' + currentNote.checklist.map(c => `- [${c.completed ? 'x' : ' '}] ${c.text}`).join('\n');
      }
      if (currentNote.tags && currentNote.tags.length > 0) {
        content += '\n\n' + currentNote.tags.map(t => `#${t}`).join(' ');
      }
    } else {
      content = `${currentNote.title || 'Sem título'}\n\n${currentNote.content}`;
      if (currentNote.checklist && currentNote.checklist.length > 0) {
        content += '\n\nTarefas:\n' + currentNote.checklist.map(c => `[${c.completed ? 'X' : ' '}] ${c.text}`).join('\n');
      }
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = (currentNote.title || 'nota').replace(/[^a-z0-9а-я]/gi, '_').toLowerCase();
    a.download = `${safeTitle}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAllJSON = () => {
    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      notes: allNotes,
      folders: allFolders,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notas_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed.notes)) {
          onImportBackup(parsed.notes, Array.isArray(parsed.folders) ? parsed.folders : []);
          onClose();
        } else {
          alert('Arquivo de backup inválido. Não foi possível encontrar a lista de notas.');
        }
      } catch (err) {
        console.error(err);
        alert('Erro ao ler o arquivo JSON de backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-[#181a20] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Exportar & Backup
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentNote && !currentNote.isTrashed && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Nota Atual ({currentNote.title || 'Sem título'})
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleCopyCurrentNote}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500 mb-1" /> : <Copy className="w-4 h-4 mb-1 text-slate-500" />}
                <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadNote('md')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                <Download className="w-4 h-4 mb-1 text-amber-500" />
                <span>Markdown (.md)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadNote('txt')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                <Download className="w-4 h-4 mb-1 text-sky-500" />
                <span>Texto (.txt)</span>
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Backup Completo ({allNotes.length} notas)
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleExportAllJSON}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 transition-opacity text-xs font-medium"
            >
              <Database className="w-4 h-4" />
              <span>Baixar Backup JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Restaurar Backup</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
