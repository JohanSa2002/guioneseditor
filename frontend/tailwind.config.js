/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        // ── Fondos y superficies ──────────────────────────
        "canvas":                   "#0c0c0f",   // página principal
        "surface":                  "#141416",   // tarjetas / paneles
        "surface-muted":            "#1c1c1f",   // áreas sutiles
        "surface-subtle":           "#242428",   // más profundo

        // ── Bordes ───────────────────────────────────────
        "border":                   "#2e2e33",
        "border-strong":            "#3f3f46",

        // ── Texto ────────────────────────────────────────
        "ink":                      "#f4f4f5",   // texto primario
        "ink-2":                    "#a1a1aa",   // texto secundario
        "ink-3":                    "#71717a",   // texto atenuado / placeholder

        // ── Acento principal (azul) ───────────────────────
        "accent":                   "#3b82f6",
        "accent-hover":             "#60a5fa",
        "accent-subtle":            "#1e2d4e",
        "accent-border":            "#1e3a8a",

        // ── Éxito / secundario (esmeralda) ────────────────
        "success":                  "#10b981",
        "success-hover":            "#34d399",
        "success-subtle":           "#0d2e22",
        "success-border":           "#065f46",

        // ── Advertencia (ámbar) ───────────────────────────
        "warn":                     "#f59e0b",
        "warn-subtle":              "#2d1f00",
        "warn-border":              "#92400e",

        // ── Error ─────────────────────────────────────────
        "error":                    "#f87171",
        "error-subtle":             "#2d0b0b",
        "error-border":             "#991b1b",

        // ── Alias para compatibilidad con plantillas ──────
        "background":               "#0c0c0f",
        "surface-container":        "#141416",
        "surface-container-low":    "#1c1c1f",
        "surface-container-lowest": "#0c0c0f",
        "surface-container-high":   "#242428",
        "surface-container-highest":"#2e2e33",
        "surface-dim":              "#0c0c0f",
        "surface-bright":           "#2e2e33",
        "surface-variant":          "#1c1c1f",
        "on-surface":               "#f4f4f5",
        "on-surface-variant":       "#a1a1aa",
        "outline":                  "#71717a",
        "outline-variant":          "#2e2e33",
        "primary":                  "#3b82f6",
        "primary-container":        "#1e3a8a",
        "primary-fixed":            "#1e2d4e",
        "primary-fixed-dim":        "#1e3a8a",
        "on-primary":               "#ffffff",
        "on-primary-container":     "#bfdbfe",
        "on-primary-fixed":         "#93c5fd",
        "on-primary-fixed-variant": "#60a5fa",
        "secondary":                "#10b981",
        "secondary-container":      "#065f46",
        "secondary-fixed":          "#0d2e22",
        "secondary-fixed-dim":      "#065f46",
        "on-secondary":             "#ffffff",
        "on-secondary-container":   "#6ee7b7",
        "on-secondary-fixed":       "#a7f3d0",
        "on-secondary-fixed-variant":"#34d399",
        "tertiary":                 "#f59e0b",
        "tertiary-container":       "#92400e",
        "tertiary-fixed":           "#2d1f00",
        "tertiary-fixed-dim":       "#92400e",
        "on-tertiary":              "#ffffff",
        "on-tertiary-container":    "#fcd34d",
        "on-tertiary-fixed":        "#fde68a",
        "on-tertiary-fixed-variant":"#fbbf24",
        "inverse-surface":          "#f4f4f5",
        "inverse-on-surface":       "#141416",
        "inverse-primary":          "#1d4ed8",
        "surface-tint":             "#3b82f6",
        "on-background":            "#f4f4f5",
        "on-error":                 "#ffffff",
        "on-error-container":       "#fca5a5",
        "error-container":          "#2d0b0b",
      },
      fontFamily: {
        "headline": ["Bricolage Grotesque", "sans-serif"],
        "body":     ["Outfit", "sans-serif"],
        "label":    ["Outfit", "sans-serif"],
      },
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}
