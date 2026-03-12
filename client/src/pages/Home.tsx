import { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import ContentArea from '@/components/ContentArea';
import SearchBar from '@/components/SearchBar';
import { Menu, BookOpen } from 'lucide-react';

export default function Home() {
  const [activeChapterId, setActiveChapterId] = useState<string | null>('preface');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = useCallback((chapterId: string, sectionId?: string) => {
    setActiveChapterId(chapterId);
    setActiveSectionId(sectionId || null);
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleSectionVisible = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.965 0.004 80)' }}>
      {/* Sidebar */}
      <Sidebar
        activeChapterId={activeChapterId}
        activeSectionId={activeSectionId}
        onNavigate={handleNavigate}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main content area */}
      <div className="lg:ml-72 xl:ml-80">
        {/* Top bar */}
        <header className="sticky top-0 z-20 backdrop-blur-lg"
          style={{ 
            background: 'oklch(0.965 0.004 80 / 0.88)',
            borderBottom: '1px solid oklch(0.9 0.004 80)',
            boxShadow: '0 1px 3px oklch(0.5 0.02 250 / 0.04)'
          }}>
          <div className="flex items-center gap-3 px-4 sm:px-6 py-2.5">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'oklch(0.3 0.02 250)' }}
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-xs shrink-0" style={{ color: 'oklch(0.5 0.015 250)' }}>
              <BookOpen size={14} />
              <span>巡察工作手册</span>
              {activeChapterId && activeChapterId !== 'preface' && (
                <>
                  <span style={{ color: 'oklch(0.7 0.01 80)' }}>/</span>
                  <span style={{ color: 'oklch(0.3 0.02 250)', fontWeight: 500 }}>
                    {activeChapterId === 'appendix' ? '附件' : `第${getChineseNum(activeChapterId)}章`}
                  </span>
                </>
              )}
            </div>

            {/* Search */}
            <div className="flex-1 flex justify-end">
              <SearchBar onNavigate={handleNavigate} />
            </div>
          </div>
        </header>

        {/* Content */}
        <ContentArea
          activeChapterId={activeChapterId}
          activeSectionId={activeSectionId}
          onSectionVisible={handleSectionVisible}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}

function getChineseNum(chapterId: string): string {
  const match = chapterId.match(/chapter-(\d+)/);
  if (!match) return '';
  const nums: Record<string, string> = {
    '1': '一', '2': '二', '3': '三', '4': '四', '5': '五',
    '6': '六', '7': '七', '8': '八', '9': '九', '10': '十'
  };
  return nums[match[1]] || match[1];
}
