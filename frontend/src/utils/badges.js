export function getPlatformBadge(p) {
  const map = {
    tiktok: 'bg-[#ff0050]/10 text-[#ff0050] border-[#ff0050]/20 shadow-[0_0_8px_rgba(255,0,80,0.1)]',
    reels:  'bg-gradient-to-r from-[#f09433]/10 via-[#e6683c]/10 to-[#bc1888]/10 text-[#bc1888] border-[#bc1888]/20 shadow-[0_0_8px_rgba(188,24,136,0.1)]',
    shorts: 'bg-[#ff0000]/10 text-[#ff0000] border-[#ff0000]/20 shadow-[0_0_8px_rgba(255,0,0,0.1)]',
  }
  return map[p] || 'bg-surface-muted text-ink-3 border border-border'
}

export function getReplicabilidadBadge(r) {
  return {
    alta:  'bg-success/10 text-success border border-success/30 shadow-[0_0_8px_rgba(16,185,129,0.15)]',
    media: 'bg-warn/10 text-warn border border-warn/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]',
    baja:  'bg-error/10 text-error border border-error/30',
  }[r] ?? 'bg-surface-muted text-ink-3 border border-border'
}
