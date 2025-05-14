/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary, #2563eb)',
                'primary-hover': 'var(--primary-hover, #1d4ed8)',
                secondary: 'var(--secondary, #e02424)',
                neutral: 'var(--neutral, #4b5563)',
                'neutral-light': 'var(--neutral-light, #d1d5db)',
                background: 'var(--background, #ffffff)',
                border: 'var(--border, #e5e7eb)',

                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))',
                  },
            },
        },
    },
    plugins: [],
}
