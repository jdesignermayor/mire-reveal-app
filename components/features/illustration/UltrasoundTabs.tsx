'use client'

import { cn } from '@/lib/utils'
import { ScanEyeIcon, ImageIcon, GitCompareArrowsIcon, LucideIcon } from 'lucide-react'

export type UltrasoundTab = 'reveal' | 'original' | 'compare'

const TABS: { id: UltrasoundTab; icon: LucideIcon; label: string }[] = [
  { id: 'reveal', icon: ScanEyeIcon, label: 'Reveal' },
  { id: 'original', icon: ImageIcon, label: 'Original' },
  { id: 'compare', icon: GitCompareArrowsIcon, label: 'Compare' },
]

export default function UltrasoundTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: UltrasoundTab
  onTabChange: (tab: UltrasoundTab) => void
}) {
  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-2xl p-1.5 border border-white/20">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300',
            activeTab === tab.id
              ? 'bg-white text-black shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/10',
          )}
        >
          <tab.icon className="size-4 shrink-0" />
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
