export function getScoreColor(score) {
  if (!score) return 'text-ink-3'
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-accent'
  if (score >= 40) return 'text-warn'
  return 'text-error'
}

export function getScoreBarColor(score) {
  if (!score) return 'bg-border'
  if (score >= 80) return 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]'
  if (score >= 60) return 'bg-accent shadow-[0_0_8px_rgba(59,130,246,0.5)]'
  if (score >= 40) return 'bg-warn'
  return 'bg-error'
}

export function getScoreBadge(score) {
  if (!score) return 'bg-surface-muted border-border text-ink-3'
  if (score >= 80) return 'bg-success/10 border-success/30 text-success shadow-[0_0_10px_rgba(16,185,129,0.15)]'
  if (score >= 60) return 'bg-accent/10 border-accent/30 text-accent shadow-[0_0_10px_rgba(59,130,246,0.15)]'
  if (score >= 40) return 'bg-warn/10 border-warn/30 text-warn'
  return 'bg-error/10 border-error/30 text-error'
}
