export function formatRelativeDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  if (isToday) {
    return `Hoje às ${timeStr}`;
  }
  if (isYesterday) {
    return `Ontem às ${timeStr}`;
  }

  const isThisYear = date.getFullYear() === now.getFullYear();
  const day = date.getDate();
  const months = [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez',
  ];
  const monthStr = months[date.getMonth()];

  if (isThisYear) {
    return `${day} de ${monthStr}`;
  }

  return `${day}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function getWordAndCharCount(text: string, checklist: { text: string }[] = []) {
  const allText = text + ' ' + checklist.map(c => c.text).join(' ');
  const words = allText.trim() ? allText.trim().split(/\s+/).length : 0;
  const chars = allText.length;
  return { words, chars };
}
