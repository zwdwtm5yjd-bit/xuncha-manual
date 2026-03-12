import { useEffect, useCallback, useState } from 'react';
import { useManual } from '@/hooks/useManual';
import ContentRenderer from './ContentRenderer';
import { Star, ArrowUp, ChevronRight, Layers, FileText, Shield, Users, ClipboardCheck, AlertTriangle, BookOpen, Scale, Megaphone, Wrench, Lock, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Chapter, Section } from '@/types/manual';

const HERO_BANNER_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663344760698/77i6REtwKQZndjJjx9BhPY/hero-banner_a3a8d8a3.png';
const TEMPLATE_BG_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663344760698/77i6REtwKQZndjJjx9BhPY/template-card-bg_0b7d69a3.png';

interface ContentAreaProps {
  activeChapterId: string | null;
  activeSectionId: string | null;
  onSectionVisible: (sectionId: string) => void;
  onNavigate: (chapterId: string, sectionId?: string) => void;
}

export default function ContentArea({ activeChapterId, activeSectionId, onSectionVisible, onNavigate }: ContentAreaProps) {
  const manual = useManual();
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    if (activeSectionId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(activeSectionId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeSectionId]);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const activeChapter = manual.chapters.find(c => c.id === activeChapterId);
  const isPreface = !activeChapterId || activeChapterId === 'preface';

  // Chapter number display
  const chapterNum = activeChapter 
    ? (activeChapter.number === 11 ? '附件' : `第${['一','二','三','四','五','六','七','八','九','十'][activeChapter.number - 1] || activeChapter.number}章`)
    : '';

  return (
    <div style={{ background: 'oklch(0.965 0.004 80)' }}>
      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ height: isPreface ? '220px' : '180px' }}>
        <div className="absolute inset-0">
          <img src={HERO_BANNER_URL} alt="" className="w-full h-full object-cover" style={{ filter: 'brightness(0.4) saturate(0.8)' }} />
          <div className="absolute inset-0" style={{ 
            background: isPreface 
              ? 'linear-gradient(135deg, oklch(0.15 0.03 250 / 0.92), oklch(0.2 0.04 250 / 0.85))'
              : 'linear-gradient(135deg, oklch(0.15 0.03 250 / 0.88), oklch(0.22 0.04 250 / 0.82))'
          }} />
          {/* Decorative lines */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
              <path d="M 0 200 Q 200 50 400 100" stroke="oklch(0.7 0.12 70)" strokeWidth="1" fill="none" />
              <path d="M 0 180 Q 250 30 400 80" stroke="oklch(0.7 0.12 70)" strokeWidth="0.5" fill="none" />
              <path d="M 100 200 Q 300 80 400 140" stroke="oklch(0.7 0.12 70)" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
        </div>

        <div className="relative h-full flex flex-col justify-center px-6 sm:px-10 lg:px-12 max-w-5xl">
          <motion.div
            key={activeChapterId || 'preface'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isPreface ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ 
                      background: 'linear-gradient(135deg, oklch(0.55 0.22 25), oklch(0.45 0.2 25))',
                      boxShadow: '0 4px 16px oklch(0.5 0.2 25 / 0.3)'
                    }}>
                    <span className="text-white font-bold text-xl" style={{ fontFamily: "'Noto Serif SC', serif" }}>巡</span>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest mb-1" style={{ color: 'oklch(0.65 0.08 70)' }}>
                      贵州联合民爆器材经营有限责任公司
                    </p>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide"
                      style={{ color: 'oklch(0.95 0.01 80)', fontFamily: "'Noto Serif SC', serif" }}>
                      巡察工作手册
                    </h1>
                  </div>
                </div>
                <p className="text-xs sm:text-sm mt-4 ml-16 max-w-lg leading-relaxed"
                  style={{ color: 'oklch(0.68 0.01 80)' }}>
                  系统、规范、实用的巡察工作操作指南
                </p>
                <div className="flex gap-3 mt-3 ml-16">
                  {['十章正文', '十个附件', '实操模板'].map((tag, i) => (
                    <span key={i} className="text-xs px-2.5 py-0.5 rounded-full"
                      style={{ 
                        background: 'oklch(0.7 0.12 70 / 0.12)', 
                        color: 'oklch(0.78 0.08 70)',
                        border: '1px solid oklch(0.7 0.12 70 / 0.15)'
                      }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ 
                    background: activeChapter?.isHighlight 
                      ? 'linear-gradient(135deg, oklch(0.55 0.22 25), oklch(0.45 0.2 25))'
                      : 'linear-gradient(135deg, oklch(0.35 0.04 250), oklch(0.25 0.03 250))',
                    boxShadow: activeChapter?.isHighlight 
                      ? '0 4px 16px oklch(0.5 0.2 25 / 0.3)' 
                      : '0 4px 16px oklch(0.15 0.03 250 / 0.3)'
                  }}>
                  <span className="text-white font-bold text-lg" style={{ fontFamily: "'Noto Serif SC', serif" }}>巡</span>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'oklch(0.6 0.02 250)' }}>{chapterNum}</p>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight"
                    style={{ color: 'oklch(0.95 0.01 80)', fontFamily: "'Noto Serif SC', serif" }}>
                    {activeChapter?.title || ''}
                  </h1>
                  {activeChapter?.isHighlight && (
                    <div className="mt-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
                        style={{ background: 'oklch(0.5 0.2 25 / 0.2)', color: 'oklch(0.9 0.08 25)' }}>
                        <Star size={10} fill="currentColor" />
                        亮点章节
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-8 lg:px-12 py-8 max-w-5xl">
        {isPreface ? (
          <PrefaceContent manual={manual} onNavigate={onNavigate} />
        ) : activeChapter ? (
          <motion.div
            key={activeChapter.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChapterContent chapter={activeChapter} />
          </motion.div>
        ) : null}
      </div>

      {/* Footer */}
      <footer className="px-4 sm:px-8 lg:px-12 py-8" style={{ borderTop: '1px solid oklch(0.9 0.004 80)' }}>
        <div className="max-w-5xl text-center">
          <p className="text-xs" style={{ color: 'oklch(0.5 0.015 250)' }}>
            贵州联合民爆器材经营有限责任公司 · 党委巡察工作领导小组办公室
          </p>
          <p className="text-xs mt-1" style={{ color: 'oklch(0.62 0.015 250)' }}>
            本手册仅供内部巡察工作使用，请严格遵守保密规定
          </p>
        </div>
      </footer>

      {/* Back to top */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-11 h-11 rounded-full shadow-lg flex items-center justify-center z-20"
            style={{ 
              background: 'linear-gradient(135deg, oklch(0.28 0.04 250), oklch(0.22 0.03 250))', 
              color: 'oklch(0.9 0.01 80)',
              boxShadow: '0 4px 16px oklch(0.15 0.03 250 / 0.3)'
            }}
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ Preface Content ============

function PrefaceContent({ manual, onNavigate }: { manual: ReturnType<typeof useManual>; onNavigate: (id: string) => void }) {
  return (
    <div>
      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: '正文章节', value: '10', icon: BookOpen, color: 'oklch(0.28 0.04 250)' },
          { label: '附件模板', value: '10', icon: Paperclip, color: 'oklch(0.65 0.1 70)' },
          { label: '亮点专题', value: '2', icon: Star, color: 'oklch(0.5 0.2 25)' },
          { label: '实操工具', value: '20+', icon: Wrench, color: 'oklch(0.4 0.12 160)' },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl p-4 text-center transition-all duration-200 hover:shadow-md"
            style={{ 
              background: 'oklch(1 0 0)', 
              border: '1px solid oklch(0.92 0.004 80)',
              boxShadow: '0 1px 3px oklch(0.5 0.02 250 / 0.06)'
            }}>
            <stat.icon size={22} className="mx-auto mb-2" style={{ color: stat.color }} />
            <div className="text-2xl font-bold" style={{ color: stat.color, fontFamily: "'Noto Serif SC', serif" }}>{stat.value}</div>
            <div className="text-xs mt-1" style={{ color: 'oklch(0.5 0.015 250)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Preface card */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 chapter-title-bar"
          style={{ color: 'oklch(0.18 0.02 250)', fontFamily: "'Noto Serif SC', serif" }}>
          前言
        </h2>
        <div className="rounded-xl p-6 shadow-sm" 
          style={{ 
            background: 'oklch(1 0 0)', 
            border: '1px solid oklch(0.92 0.004 80)',
            boxShadow: '0 1px 4px oklch(0.5 0.02 250 / 0.06)'
          }}>
          <ContentRenderer content={manual.preface} />
          <div className="mt-6 pt-4 text-right text-sm" style={{ borderTop: '1px solid oklch(0.93 0.004 80)', color: 'oklch(0.42 0.015 250)' }}>
            <p>贵州联合民爆器材经营有限责任公司</p>
            <p>党委巡察工作领导小组办公室</p>
          </div>
        </div>
      </div>

      {/* Chapter overview */}
      <h3 className="text-lg font-bold mb-4 section-title-gold"
        style={{ color: 'oklch(0.18 0.02 250)', fontFamily: "'Noto Serif SC', serif" }}>
        目录总览
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {manual.chapters.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} onClick={() => onNavigate(chapter.id)} />
        ))}
      </div>
    </div>
  );
}

// ============ Chapter Card ============

const chapterIcons: Record<number, typeof BookOpen> = {
  1: Scale, 2: Users, 3: ClipboardCheck, 4: Layers,
  5: AlertTriangle, 6: FileText, 7: BookOpen, 8: Megaphone,
  9: Wrench, 10: Lock, 11: Paperclip,
};

const chineseNums: Record<number, string> = {
  1: '壹', 2: '贰', 3: '叁', 4: '肆', 5: '伍',
  6: '陆', 7: '柒', 8: '捌', 9: '玖', 10: '拾', 11: '附'
};

function ChapterCard({ chapter, onClick }: { chapter: Chapter; onClick: () => void }) {
  const Icon = chapterIcons[chapter.number] || BookOpen;

  return (
    <button
      onClick={onClick}
      className="rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group text-left w-full"
      style={{
        background: chapter.isHighlight ? 'oklch(0.5 0.2 25 / 0.03)' : 'oklch(1 0 0)',
        border: `1px solid ${chapter.isHighlight ? 'oklch(0.5 0.2 25 / 0.12)' : 'oklch(0.92 0.004 80)'}`,
        boxShadow: '0 1px 3px oklch(0.5 0.02 250 / 0.05)',
      }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: chapter.isHighlight ? 'oklch(0.5 0.2 25 / 0.1)' : 'oklch(0.28 0.04 250 / 0.07)',
            color: chapter.isHighlight ? 'oklch(0.5 0.2 25)' : 'oklch(0.28 0.04 250)',
          }}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold shrink-0" style={{ 
              color: chapter.isHighlight ? 'oklch(0.5 0.2 25 / 0.5)' : 'oklch(0.28 0.04 250 / 0.35)',
              fontFamily: "'Noto Serif SC', serif"
            }}>
              {chineseNums[chapter.number]}
            </span>
            <h4 className="text-sm font-semibold truncate"
              style={{ color: 'oklch(0.18 0.02 250)', fontFamily: "'Noto Serif SC', serif" }}>
              {chapter.title.replace(/第[一二三四五六七八九十]+章\s+/, '').replace('【亮点】', '')}
            </h4>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {chapter.isHighlight && (
              <span className="highlight-badge shrink-0">
                <Star size={9} fill="currentColor" />
                亮点
              </span>
            )}
            <span className="text-xs" style={{ color: 'oklch(0.55 0.015 250)' }}>
              {chapter.sections.length} 个小节
            </span>
          </div>
        </div>
        <ChevronRight size={16} className="shrink-0 mt-1 opacity-0 group-hover:opacity-60 transition-opacity"
          style={{ color: 'oklch(0.45 0.015 250)' }} />
      </div>
    </button>
  );
}

// ============ Chapter Content ============

function ChapterContent({ chapter }: { chapter: Chapter }) {
  return (
    <div id={chapter.id}>
      {/* Chapter intro */}
      {chapter.intro && (
        <div className="mb-6 rounded-xl p-5 shadow-sm" style={{ 
          background: chapter.isHighlight ? 'oklch(0.5 0.2 25 / 0.02)' : 'oklch(1 0 0)', 
          border: `1px solid ${chapter.isHighlight ? 'oklch(0.5 0.2 25 / 0.08)' : 'oklch(0.92 0.004 80)'}`,
          boxShadow: '0 1px 4px oklch(0.5 0.02 250 / 0.05)'
        }}>
          <div className="flex items-center gap-2 mb-3 text-xs font-medium" style={{ color: 'oklch(0.48 0.015 250)' }}>
            <BookOpen size={14} />
            本章导读
          </div>
          <ContentRenderer content={chapter.intro} />
        </div>
      )}

      {/* Section quick nav */}
      {chapter.sections.length > 2 && (
        <div className="mb-6 rounded-xl p-4" style={{ 
          background: 'oklch(0.985 0.002 80)', 
          border: '1px solid oklch(0.92 0.004 80)' 
        }}>
          <div className="text-xs font-medium mb-2.5" style={{ color: 'oklch(0.48 0.015 250)' }}>本章目录</div>
          <div className="flex flex-wrap gap-2">
            {chapter.sections.map((section, idx) => (
              <a key={section.id} href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(section.id);
                  if (el) {
                    const top = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
                className="text-xs px-3 py-1.5 rounded-lg transition-all hover:shadow-sm"
                style={{ 
                  border: '1px solid oklch(0.9 0.004 80)', 
                  color: 'oklch(0.32 0.02 250)',
                  background: 'oklch(1 0 0)'
                }}>
                {idx + 1}. {section.title.replace(/第[一二三四五六七八九十]+节\s+/, '').replace(/附件\d+[：:]\s*/, '')}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Sections */}
      {chapter.sections.map((section, idx) => (
        <SectionContent key={section.id} section={section} index={idx} isHighlightChapter={chapter.isHighlight} />
      ))}
    </div>
  );
}

// ============ Section Content ============

function SectionContent({ section, index, isHighlightChapter }: { section: Section; index: number; isHighlightChapter: boolean }) {
  return (
    <div id={section.id} className="mb-6 scroll-mt-20">
      <div className="rounded-xl overflow-hidden shadow-sm" style={{ 
        background: 'oklch(1 0 0)', 
        border: `1px solid ${isHighlightChapter ? 'oklch(0.5 0.2 25 / 0.08)' : 'oklch(0.92 0.004 80)'}`,
        boxShadow: '0 1px 4px oklch(0.5 0.02 250 / 0.05)'
      }}>
        {/* Section header */}
        <div className="px-5 sm:px-6 py-3.5 flex items-center gap-3" style={{ 
          borderBottom: '1px solid oklch(0.94 0.004 80)',
          background: isHighlightChapter ? 'oklch(0.5 0.2 25 / 0.025)' : 'oklch(0.98 0.003 80)'
        }}>
          <span className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              background: isHighlightChapter ? 'oklch(0.5 0.2 25 / 0.1)' : 'oklch(0.28 0.04 250 / 0.08)',
              color: isHighlightChapter ? 'oklch(0.5 0.2 25)' : 'oklch(0.28 0.04 250)',
            }}>
            {index + 1}
          </span>
          <h3 className="text-sm sm:text-base font-bold"
            style={{ color: 'oklch(0.18 0.02 250)', fontFamily: "'Noto Serif SC', serif" }}>
            {section.title}
          </h3>
        </div>

        {/* Section content */}
        <div className="px-5 sm:px-6 py-5">
          {section.content && <ContentRenderer content={section.content} />}

          {/* Subsections */}
          {section.subsections.map((sub) => (
            <div key={sub.id} id={sub.id} className="mt-5 first:mt-0 pt-4 first:pt-0"
              style={{ borderTop: '1px solid oklch(0.94 0.004 80)' }}>
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2"
                style={{ color: 'oklch(0.22 0.02 250)', fontFamily: "'Noto Serif SC', serif" }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'oklch(0.65 0.1 70)' }} />
                {sub.title}
              </h4>
              <ContentRenderer content={sub.content} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
