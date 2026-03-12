import { useState, useMemo, useCallback } from 'react';
import manualData from '@/data/manual.json';
import type { ManualData, Chapter, Section } from '@/types/manual';

const data = manualData as ManualData;

export function useManual() {
  return data;
}

export function useSearch() {
  const manual = useManual();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return [];

    const q = query.trim().toLowerCase();
    const matches: Array<{
      chapterId: string;
      chapterTitle: string;
      sectionId?: string;
      sectionTitle?: string;
      snippet: string;
      type: 'chapter' | 'section' | 'subsection';
    }> = [];

    for (const chapter of manual.chapters) {
      // Search chapter intro
      if (chapter.intro.toLowerCase().includes(q)) {
        const idx = chapter.intro.toLowerCase().indexOf(q);
        const start = Math.max(0, idx - 30);
        const end = Math.min(chapter.intro.length, idx + q.length + 30);
        matches.push({
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          snippet: (start > 0 ? '...' : '') + chapter.intro.slice(start, end) + (end < chapter.intro.length ? '...' : ''),
          type: 'chapter',
        });
      }

      for (const section of chapter.sections) {
        // Search section title
        if (section.title.toLowerCase().includes(q)) {
          matches.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            sectionId: section.id,
            sectionTitle: section.title,
            snippet: section.title,
            type: 'section',
          });
        }

        // Search section content
        if (section.content.toLowerCase().includes(q)) {
          const idx = section.content.toLowerCase().indexOf(q);
          const start = Math.max(0, idx - 30);
          const end = Math.min(section.content.length, idx + q.length + 30);
          matches.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            sectionId: section.id,
            sectionTitle: section.title,
            snippet: (start > 0 ? '...' : '') + section.content.slice(start, end) + (end < section.content.length ? '...' : ''),
            type: 'section',
          });
        }

        // Search subsections
        for (const sub of section.subsections) {
          if (sub.content.toLowerCase().includes(q) || sub.title.toLowerCase().includes(q)) {
            const text = sub.content || sub.title;
            const idx = text.toLowerCase().indexOf(q);
            const start = Math.max(0, idx - 30);
            const end = Math.min(text.length, idx + q.length + 30);
            matches.push({
              chapterId: chapter.id,
              chapterTitle: chapter.title,
              sectionId: section.id,
              sectionTitle: section.title,
              snippet: (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : ''),
              type: 'subsection',
            });
          }
        }
      }
    }

    return matches.slice(0, 20);
  }, [query, manual]);

  return { query, setQuery, results };
}

export function useChapterNav() {
  const manual = useManual();
  
  const getChapterIcon = useCallback((chapter: Chapter) => {
    const iconMap: Record<number, string> = {
      1: '壹',
      2: '贰',
      3: '叁',
      4: '肆',
      5: '伍',
      6: '陆',
      7: '柒',
      8: '捌',
      9: '玖',
      10: '拾',
      11: '附',
    };
    return iconMap[chapter.number] || '章';
  }, []);

  return { chapters: manual.chapters, getChapterIcon };
}
