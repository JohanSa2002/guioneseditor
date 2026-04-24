/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        // ── Fondos y superficies ──────────────────────────
        "canvas":                   "#050507",   // página principal muy oscura
        "surface":                  "rgba(18, 18, 22, 0.65)",   // tarjetas / paneles con transparencia para glassmorphism
        "surface-solid":            "#121216",   // tarjetas / paneles sólidos
        "surface-muted":            "rgba(28, 28, 35, 0.6)",   // áreas sutiles
        "surface-subtle":           "rgba(36, 36, 44, 0.6)",   // más profundo

        // ── Bordes ───────────────────────────────────────
        "border":                   "rgba(255, 255, 255, 0.08)",
        "border-strong":            "rgba(255, 255, 255, 0.15)",

        // ── Texto ────────────────────────────────────────
        "ink":                      "#ffffff",   // texto primario brillante
        "ink-2":                    "#a1a1aa",   // texto secundario
        "ink-3":                    "#71717a",   // texto atenuado / placeholder

        // ── Acento principal (azul/cian vibrante) ───────────────────────
        "accent":                   "#00f0ff", // cyan neon
        "accent-hover":             "#5cffff",
        "accent-subtle":            "rgba(0, 240, 255, 0.1)",
        "accent-border":            "rgba(0, 240, 255, 0.3)",

        // ── Éxito / secundario (esmeralda vibrante) ────────────────
        "success":                  "#00ff9d",
        "success-hover":            "#5cffc1",
        "success-subtle":           "rgba(0, 255, 157, 0.1)",
        "success-border":           "rgba(0, 255, 157, 0.3)",

        // ── Advertencia (ámbar vibrante) ───────────────────────────
        "warn":                     "#ffb800",
        "warn-subtle":              "rgba(255, 184, 0, 0.1)",
        "warn-border":              "rgba(255, 184, 0, 0.3)",

        // ── Error (rojo vibrante) ─────────────────────────────────────────
        "error":                    "#ff2a5f",
        "error-subtle":             "rgba(255, 42, 95, 0.1)",
        "error-border":             "rgba(255, 42, 95, 0.3)",
      },
      fontFamily: {
        "headline": ["Outfit", "sans-serif"],
        "body":     ["Inter", "sans-serif"],
        "label":    ["Inter", "sans-serif"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'neon-accent': '0 0 15px rgba(0, 240, 255, 0.4)',
        'neon-success': '0 0 15px rgba(0, 255, 157, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0,240,255,0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0,240,255,0.6), 0 0 30px rgba(0,240,255,0.4)' },
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}
