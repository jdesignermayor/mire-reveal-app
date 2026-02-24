'use client'

import { cn } from '@/lib/utils'

export type UltrasoundTab = 'reveal' | 'original' | 'compare'

const TABS: { id: UltrasoundTab; label: string }[] = [
  { id: 'reveal', label: '✨ Ecografía revelada' },
  { id: 'original', label: '📷 Original' },
  { id: 'compare', label: '🔍 Comparar' },
]

export default function UltrasoundTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: UltrasoundTab
  onTabChange: (tab: UltrasoundTab) => void
}) {
  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300',
            activeTab === tab.id
              ? 'bg-white text-black shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/10',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
