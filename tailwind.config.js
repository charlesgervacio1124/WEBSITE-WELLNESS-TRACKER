/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#2d6cf5", 
        "primary-container": "#dbeafe",
        "on-primary": "#ffffff",
        "surface": "#f0f7ff",
        "on-surface": "#0f172a",
        "on-surface-variant": "#475569",
        "outline": "#cbd5e1",
        "error": "#2d6cf5",
        "tertiary": "#6366f1",
        "sapphire": "#1e40af",
        "sky-soft": "#e0f2fe",
        
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
      },
      fontFamily: {
        "headline": ["'Plus Jakarta Sans'", "sans-serif"],
        "body": ["'Plus Jakarta Sans'", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "2xl": "2rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
