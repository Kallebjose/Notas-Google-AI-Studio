'use client';

import React, { useState } from 'react';
import { ChecklistItem } from '@/types/note';
import { CheckSquare, Square, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface ChecklistEditorProps {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}

export function ChecklistEditor({ items, onChange, readOnly = false }: ChecklistEditorProps) {
  const [newText, setNewText] = useState('');

  const handleToggle = (id: string) => {
    if (readOnly) return;
    const updated = items.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onChange(updated);
  };

  const handleTextChange = (id: string, text: string) => {
    if (readOnly) return;
    const updated = items.map((item) =>
      item.id === id ? { ...item, text } : item
    );
    onChange(updated);
  };

  const handleRemove = (id: string) => {
    if (readOnly) return;
    const updated = items.filter((item) => item.id !== id);
    onChange(updated);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || readOnly) return;
    const newItem: ChecklistItem = {
      id: 'chk-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      text: newText.trim(),
      completed: false,
    };
    onChange([...items, newItem]);
    setNewText('');
  };

  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;

  return (
    <div className="my-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 transition-colors">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-600 dark:text-slate-300">
            Lista de Tarefas
          </span>
        </div>
        {totalCount > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="tabular-nums font-medium">
              {completedCount} de {totalCount} concluídas
            </span>
            <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 dark:bg-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${totalCount ? (completedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-2.5 py-1 px-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800/80 transition-colors"
          >
            <button
              type="button"
              onClick={() => handleToggle(item.id)}
              disabled={readOnly}
              className="text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors shrink-0"
              aria-label={item.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
            >
              {item.completed ? (
                <CheckSquare className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>
            <input
              type="text"
              value={item.text}
              disabled={readOnly}
              onChange={(e) => handleTextChange(item.id, e.target.value)}
              className={`flex-1 text-sm bg-transparent border-0 focus:ring-0 p-0 transition-colors ${
                item.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-200'
              }`}
            />
            {!readOnly && (
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-all"
                title="Remover item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {!readOnly && (
        <form onSubmit={handleAdd} className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Adicionar item à lista... (Enter)"
            className="flex-1 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 text-slate-800 dark:text-slate-200"
          />
          <button
            type="submit"
            disabled={!newText.trim()}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        </form>
      )}
    </div>
  );
}
