/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'smiley-sans': ['Smiley Sans', 'sans-serif'],
      },
      colors: {
        // 新的色彩调色板
        'primary-blue': '#0000FF',        // 主蓝色
        'light-gray': '#F0F0F0',          // 浅灰色
        'medium-gray': '#A0A0A0',         // 中灰色
        'dark-gray': '#000000',           // 深灰色/黑色
        'accent-blue-1': '#3366FF',       // 强调蓝色1
        'accent-blue-2': '#6699FF',       // 强调蓝色2
        'accent-brown': '#B8A78F',        // 强调棕色
        'accent-lime': '#A7FF00',         // 强调青柠色
        'accent-orange': '#FF4500',       // 强调橙红色
        'accent-yellow': '#FFFF00',       // 强调黄色
        'accent-green': '#E0FFC0',        // 强调浅绿色
        'accent-pink': '#FFC0CB',         // 强调粉色
        
        // 保留原有的 Base 品牌颜色
        'base-blue': '#0052FF',
        'base-purple': '#8B5CF6',
        'base-green': '#00D4AA',
        'base-orange': '#FF6B35',
        'base-pink': '#FF0080',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
