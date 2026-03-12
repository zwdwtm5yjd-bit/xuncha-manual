import { useState, useCallback, useEffect } from 'react';
import { useChapterNav } from '@/hooks/useManual';
import { ChevronDown, ChevronRight, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Chapter } from '@/types/manual';

interface SidebarProps {
  activeChapterId: string | null;
  activeSectionId: string | null;
  onNavigate: (chapterId: string, sectionId?: string) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ activeChapterId, activeSectionId, onNavigate, isMobileOpen, onMobileClose }: SidebarProps) {
  const { chapters, getChapterIcon } = useChapterNav();
  // Only keep one chapter expanded at a time (the active one)
  const [manuallyExpanded, setManuallyExpanded] = useState<string | null>(null);

  // The effectively expanded chapter is either the manually toggled one or the active one
  const expandedChapterId = manuallyExpanded !== undefined ? manuallyExpanded : activeChapterId;

  // When active chapter changes, auto-expand it and reset manual override
  useEffect(() => {
    if (activeChapterId && activeChapterId !== 'preface') {
      setManuallyExpanded(activeChapterId);
    }
  }, [activeChapterId]);

  const toggleChapter = useCallback((chapterId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setManuallyExpanded(prev => prev === chapterId ? null : chapterId);
  }, []);

  const handleChapterClick = useCallback((chapter: Chapter) => {
    onNavigate(chapter.id);
    setManuallyExpanded(chapter.id);
    if (window.innerWidth < 1024) onMobileClose();
  }, [onNavigate, onMobileClose]);

  const handleSectionClick = useCallback((chapterId: string, sectionId: string) => {
    onNavigate(chapterId, sectionId);
    if (window.innerWidth < 1024) onMobileClose();
  }, [onNavigate, onMobileClose]);

  const sidebarContent = (
    <div className="h-full flex flex-col" style={{ background: 'oklch(0.15 0.025 250)' }}>
      {/* Header */}
      <div className="p-5 pb-4" style={{ borderBottom: '1px solid oklch(0.25 0.025 250)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold shadow-lg"
              style={{ 
                background: 'linear-gradient(135deg, oklch(0.55 0.22 25), oklch(0.45 0.2 25))', 
                color: 'oklch(0.97 0.01 80)',
                fontFamily: "'Noto Serif SC', serif",
              }}>
              巡
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide" style={{ color: 'oklch(0.93 0.01 80)', fontFamily: "'Noto Serif SC', serif" }}>
                巡察工作手册
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'oklch(0.55 0.015 250)' }}>
                贵州联合民爆器材经营有限责任公司
              </p>
            </div>
          </div>
          <button 
            className="lg:hidden p-1.5 rounded-md transition-colors"
            onClick={onMobileClose}
            style={{ color: 'oklch(0.6 0.02 250)' }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-3 px-2.5">
        {/* Preface link */}
        <button
          onClick={() => { onNavigate('preface'); setManuallyExpanded(null); if (window.innerWidth < 1024) onMobileClose(); }}
          className="w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1.5 transition-all duration-200 flex items-center gap-3"
          style={{
            color: activeChapterId === 'preface' ? 'oklch(0.85 0.1 70)' : 'oklch(0.68 0.015 250)',
            background: activeChapterId === 'preface' ? 'oklch(0.22 0.025 250)' : 'transparent',
          }}
        >
          <span className="w-7 h-7 rounded-md flex items-center justify-center text-xs shrink-0 font-bold"
            style={{ 
              background: activeChapterId === 'preface' ? 'oklch(0.7 0.12 70 / 0.15)' : 'oklch(0.22 0.025 250)',
              color: activeChapterId === 'preface' ? 'oklch(0.85 0.1 70)' : 'oklch(0.5 0.015 250)',
              fontFamily: "'Noto Serif SC', serif",
            }}>
            序
          </span>
          <span className="font-medium">前言</span>
        </button>

        {/* Divider */}
        <div className="mx-3 my-2" style={{ borderTop: '1px solid oklch(0.22 0.025 250)' }} />

        {/* Chapters */}
        {chapters.map((chapter) => {
          const isExpanded = expandedChapterId === chapter.id;
          const isActive = activeChapterId === chapter.id;
          const icon = getChapterIcon(chapter);
          const hasSections = chapter.sections.length > 0;

          return (
            <div key={chapter.id} className="mb-0.5">
              <div className="flex items-center">
                <button
                  onClick={() => handleChapterClick(chapter)}
                  className="flex-1 text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 group"
                  style={{
                    color: isActive ? 'oklch(0.95 0.01 80)' : 'oklch(0.72 0.015 250)',
                    background: isActive ? 'oklch(0.22 0.025 250)' : 'transparent',
                  }}
                >
                  <span className="w-7 h-7 rounded-md flex items-center justify-center text-xs shrink-0 transition-colors font-bold"
                    style={{ 
                      background: isActive 
                        ? (chapter.isHighlight ? 'oklch(0.55 0.22 25 / 0.2)' : 'oklch(0.7 0.12 70 / 0.15)')
                        : 'oklch(0.22 0.025 250)',
                      color: isActive 
                        ? (chapter.isHighlight ? 'oklch(0.7 0.18 25)' : 'oklch(0.85 0.1 70)')
                        : 'oklch(0.5 0.015 250)',
                      fontFamily: "'Noto Serif SC', serif",
                    }}>
                    {icon}
                  </span>
                  <span className="flex-1 truncate leading-snug font-medium">
                    {chapter.title.replace(/第[一二三四五六七八九十]+章\s+/, '').replace('【亮点】', '')}
                  </span>
                  {chapter.isHighlight && (
                    <Star size={11} className="shrink-0" style={{ color: 'oklch(0.7 0.12 70)' }} fill="oklch(0.7 0.12 70)" />
                  )}
                  {hasSections && (
                    <span 
                      className="shrink-0 p-0.5 rounded transition-all"
                      style={{ 
                        color: isExpanded ? 'oklch(0.6 0.02 250)' : 'oklch(0.4 0.015 250)',
                        transform: isExpanded ? 'rotate(0deg)' : 'rotate(0deg)',
                      }}
                      onClick={(e) => toggleChapter(chapter.id, e)}
                    >
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {isExpanded && hasSections && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="ml-6 pl-3.5 py-1 my-0.5" style={{ borderLeft: '2px solid oklch(0.28 0.025 250)' }}>
                      {chapter.sections.map((section) => {
                        const isSectionActive = activeSectionId === section.id;
                        return (
                          <button
                            key={section.id}
                            onClick={() => handleSectionClick(chapter.id, section.id)}
                            className="w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all duration-150 block leading-relaxed mb-0.5"
                            style={{
                              color: isSectionActive ? 'oklch(0.85 0.1 70)' : 'oklch(0.58 0.015 250)',
                              background: isSectionActive ? 'oklch(0.7 0.12 70 / 0.08)' : 'transparent',
                              fontWeight: isSectionActive ? 500 : 400,
                            }}
                          >
                            {section.title}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4" style={{ borderTop: '1px solid oklch(0.22 0.025 250)' }}>
        <p className="text-xs text-center" style={{ color: 'oklch(0.4 0.015 250)' }}>
          党委巡察工作领导小组办公室
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 xl:w-80 h-screen fixed left-0 top-0 z-30 shadow-xl"
        style={{ boxShadow: '4px 0 24px oklch(0.1 0.02 250 / 0.15)' }}>
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'oklch(0.1 0.02 250 / 0.6)' }}
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 w-80 h-screen z-50 lg:hidden"
              style={{ boxShadow: '8px 0 32px oklch(0.1 0.02 250 / 0.3)' }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
