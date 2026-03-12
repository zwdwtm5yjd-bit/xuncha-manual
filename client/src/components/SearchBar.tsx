import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '@/hooks/useManual';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onNavigate: (chapterId: string, sectionId?: string) => void;
}

export default function SearchBar({ onNavigate }: SearchBarProps) {
  const { query, setQuery, results } = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (chapterId: string, sectionId?: string) => {
    onNavigate(chapterId, sectionId);
    setQuery('');
    setIsFocused(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        isFocused ? 'shadow-md' : ''
      }`}
        style={{
          background: isFocused ? 'oklch(1 0 0)' : 'oklch(0.98 0.003 80)',
          border: `1px solid ${isFocused ? 'oklch(0.28 0.04 250 / 0.3)' : 'oklch(0.9 0.004 80)'}`,
        }}>
        <Search size={15} style={{ color: 'oklch(0.5 0.015 250)' }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="搜索手册内容..."
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: 'oklch(0.2 0.02 250)', fontFamily: "'Noto Sans SC', sans-serif" }}
        />
        {query && (
          <button onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="p-0.5 rounded transition-colors"
            style={{ color: 'oklch(0.5 0.015 250)' }}>
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFocused && query.trim().length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden z-50"
            style={{ 
              background: 'oklch(1 0 0)', 
              border: '1px solid oklch(0.9 0.004 80)',
              boxShadow: '0 8px 32px oklch(0.15 0.025 250 / 0.12)'
            }}
          >
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm" style={{ color: 'oklch(0.5 0.015 250)' }}>
                未找到相关内容
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {results.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(result.chapterId, result.sectionId)}
                    className="w-full text-left px-4 py-3 transition-colors"
                    style={{ borderBottom: idx < results.length - 1 ? '1px solid oklch(0.95 0.004 80)' : 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'oklch(0.97 0.004 80)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="text-xs font-medium mb-1" style={{ color: 'oklch(0.5 0.2 25)' }}>
                      {result.chapterTitle}
                      {result.sectionTitle && (
                        <span style={{ color: 'oklch(0.5 0.015 250)' }}> / {result.sectionTitle}</span>
                      )}
                    </div>
                    <div className="text-xs leading-relaxed" style={{ color: 'oklch(0.38 0.015 250)' }}>
                      {highlightQuery(result.snippet, query)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function highlightQuery(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} style={{ background: 'oklch(0.7 0.12 70 / 0.25)', color: 'inherit', borderRadius: '2px', padding: '0 2px' }}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
