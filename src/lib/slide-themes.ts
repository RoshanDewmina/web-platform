import { SlideTheme } from "@/types/slide-builder";

// Predefined themes
export const themes: Record<string, SlideTheme> = {
  default: {
    colors: {
      primary: "#3b82f6",      // blue-500
      secondary: "#10b981",    // emerald-500
      background: "#ffffff",
      text: "#1e293b",        // slate-800
      accent: "#f59e0b",      // amber-500
    },
    typography: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      headingFont: "'Inter', system-ui, -apple-system, sans-serif",
      fontSize: {
        base: 16,
        scale: 1.25, // Major third scale
      },
    },
    spacing: {
      unit: 8,
      scale: [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32],
    },
    borders: {
      radius: 8,
      width: 1,
      style: "solid",
    },
  },

  dark: {
    colors: {
      primary: "#60a5fa",      // blue-400
      secondary: "#34d399",    // emerald-400
      background: "#0f172a",   // slate-900
      text: "#f1f5f9",        // slate-100
      accent: "#fbbf24",      // amber-400
    },
    typography: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      headingFont: "'Inter', system-ui, -apple-system, sans-serif",
      fontSize: {
        base: 16,
        scale: 1.25,
      },
    },
    spacing: {
      unit: 8,
      scale: [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32],
    },
    borders: {
      radius: 8,
      width: 1,
      style: "solid",
    },
  },

  professional: {
    colors: {
      primary: "#1e40af",      // blue-800
      secondary: "#059669",    // emerald-600
      background: "#f8fafc",   // slate-50
      text: "#0f172a",        // slate-900
      accent: "#dc2626",      // red-600
    },
    typography: {
      fontFamily: "'Roboto', 'Helvetica Neue', sans-serif",
      headingFont: "'Roboto Slab', 'Georgia', serif",
      fontSize: {
        base: 16,
        scale: 1.333, // Perfect fourth scale
      },
    },
    spacing: {
      unit: 8,
      scale: [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32],
    },
    borders: {
      radius: 4,
      width: 1,
      style: "solid",
    },
  },

  playful: {
    colors: {
      primary: "#8b5cf6",      // violet-500
      secondary: "#ec4899",    // pink-500
      background: "#fef3c7",   // amber-100
      text: "#451a03",        // amber-950
      accent: "#10b981",      // emerald-500
    },
    typography: {
      fontFamily: "'Comic Neue', 'Comic Sans MS', cursive",
      headingFont: "'Fredoka', 'Comic Neue', cursive",
      fontSize: {
        base: 18,
        scale: 1.2,
      },
    },
    spacing: {
      unit: 8,
      scale: [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32],
    },
    borders: {
      radius: 16,
      width: 2,
      style: "solid",
    },
  },

  minimal: {
    colors: {
      primary: "#000000",
      secondary: "#6b7280",    // gray-500
      background: "#ffffff",
      text: "#000000",
      accent: "#ef4444",      // red-500
    },
    typography: {
      fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
      headingFont: "'Helvetica Neue', 'Arial', sans-serif",
      fontSize: {
        base: 16,
        scale: 1.414, // Augmented fourth scale
      },
    },
    spacing: {
      unit: 8,
      scale: [0, 0.5, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64],
    },
    borders: {
      radius: 0,
      width: 1,
      style: "solid",
    },
  },

  tech: {
    colors: {
      primary: "#00ff88",      // Matrix green
      secondary: "#00aaff",    // Cyan
      background: "#0a0e27",   // Dark blue
      text: "#e0e0e0",
      accent: "#ff0080",      // Hot pink
    },
    typography: {
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      headingFont: "'Orbitron', 'JetBrains Mono', monospace",
      fontSize: {
        base: 15,
        scale: 1.25,
      },
    },
    spacing: {
      unit: 8,
      scale: [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32],
    },
    borders: {
      radius: 2,
      width: 1,
      style: "solid",
    },
  },

  education: {
    colors: {
      primary: "#2563eb",      // blue-600
      secondary: "#7c3aed",    // violet-600
      background: "#fefce8",   // yellow-50
      text: "#1e293b",        // slate-800
      accent: "#dc2626",      // red-600
    },
    typography: {
      fontFamily: "'Open Sans', 'Segoe UI', sans-serif",
      headingFont: "'Merriweather', 'Georgia', serif",
      fontSize: {
        base: 17,
        scale: 1.3,
      },
    },
    spacing: {
      unit: 8,
      scale: [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32],
    },
    borders: {
      radius: 8,
      width: 2,
      style: "solid",
    },
  },

  corporate: {
    colors: {
      primary: "#1e3a8a",      // blue-900
      secondary: "#64748b",    // slate-500
      background: "#ffffff",
      text: "#1e293b",        // slate-800
      accent: "#059669",      // emerald-600
    },
    typography: {
      fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
      headingFont: "'IBM Plex Sans', 'Segoe UI', sans-serif",
      fontSize: {
        base: 16,
        scale: 1.25,
      },
    },
    spacing: {
      unit: 8,
      scale: [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32],
    },
    borders: {
      radius: 4,
      width: 1,
      style: "solid",
    },
  },
};

// Design token generator
export class DesignTokens {
  private theme: SlideTheme;

  constructor(theme: SlideTheme) {
    this.theme = theme;
  }

  // Color tokens
  getColor(name: keyof SlideTheme["colors"]): string {
    return this.theme.colors[name];
  }

  getColorWithOpacity(name: keyof SlideTheme["colors"], opacity: number): string {
    const color = this.theme.colors[name];
    // Convert hex to rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Typography tokens
  getFontSize(level: number = 0): number {
    const { base, scale } = this.theme.typography.fontSize;
    return Math.round(base * Math.pow(scale, level));
  }

  getLineHeight(fontSize: number): number {
    // Golden ratio for line height
    return Math.round(fontSize * 1.618);
  }

  getFont(type: "body" | "heading" = "body"): string {
    return type === "heading" && this.theme.typography.headingFont
      ? this.theme.typography.headingFont
      : this.theme.typography.fontFamily;
  }

  // Spacing tokens
  getSpacing(level: number): number {
    const { unit, scale } = this.theme.spacing;
    const multiplier = scale[Math.min(level, scale.length - 1)];
    return unit * multiplier;
  }

  // Border tokens
  getBorderRadius(multiplier: number = 1): number {
    return this.theme.borders.radius * multiplier;
  }

  getBorder(color?: string): string {
    const { width, style } = this.theme.borders;
    const borderColor = color || this.getColorWithOpacity("text", 0.2);
    return `${width}px ${style} ${borderColor}`;
  }

  // Shadow tokens
  getShadow(level: "sm" | "md" | "lg" | "xl" = "md"): string {
    const shadows = {
      sm: `0 1px 2px 0 ${this.getColorWithOpacity("text", 0.05)}`,
      md: `0 4px 6px -1px ${this.getColorWithOpacity("text", 0.1)}, 0 2px 4px -1px ${this.getColorWithOpacity("text", 0.06)}`,
      lg: `0 10px 15px -3px ${this.getColorWithOpacity("text", 0.1)}, 0 4px 6px -2px ${this.getColorWithOpacity("text", 0.05)}`,
      xl: `0 20px 25px -5px ${this.getColorWithOpacity("text", 0.1)}, 0 10px 10px -5px ${this.getColorWithOpacity("text", 0.04)}`,
    };
    return shadows[level];
  }

  // Generate CSS variables
  getCSSVariables(): Record<string, string> {
    const vars: Record<string, string> = {};

    // Colors
    Object.entries(this.theme.colors).forEach(([key, value]) => {
      vars[`--color-${key}`] = value;
    });

    // Typography
    vars["--font-family"] = this.theme.typography.fontFamily;
    vars["--font-family-heading"] = this.theme.typography.headingFont || this.theme.typography.fontFamily;
    vars["--font-size-base"] = `${this.theme.typography.fontSize.base}px`;

    // Font sizes using scale
    for (let i = -2; i <= 8; i++) {
      vars[`--font-size-${i}`] = `${this.getFontSize(i)}px`;
    }

    // Spacing
    this.theme.spacing.scale.forEach((multiplier, index) => {
      vars[`--spacing-${index}`] = `${this.getSpacing(index)}px`;
    });

    // Borders
    vars["--border-radius"] = `${this.theme.borders.radius}px`;
    vars["--border-width"] = `${this.theme.borders.width}px`;
    vars["--border-style"] = this.theme.borders.style;

    return vars;
  }

  // Apply theme to element
  applyToElement(element: HTMLElement): void {
    const cssVars = this.getCSSVariables();
    Object.entries(cssVars).forEach(([key, value]) => {
      element.style.setProperty(key, value);
    });
  }
}

// Theme utilities
export function getTheme(name: string): SlideTheme {
  return themes[name] || themes.default;
}

export function getThemeNames(): string[] {
  return Object.keys(themes);
}

export function createCustomTheme(base: string, overrides: Partial<SlideTheme>): SlideTheme {
  const baseTheme = getTheme(base);
  return {
    colors: { ...baseTheme.colors, ...overrides.colors },
    typography: { ...baseTheme.typography, ...overrides.typography },
    spacing: { ...baseTheme.spacing, ...overrides.spacing },
    borders: { ...baseTheme.borders, ...overrides.borders },
  } as SlideTheme;
}

// Component-specific theming
export function getComponentStyles(
  component: string,
  theme: SlideTheme,
  variant?: string
): React.CSSProperties {
  const tokens = new DesignTokens(theme);

  switch (component) {
    case "title":
      return {
        fontFamily: tokens.getFont("heading"),
        fontSize: tokens.getFontSize(variant === "h1" ? 4 : variant === "h2" ? 3 : 2),
        fontWeight: 700,
        color: tokens.getColor("text"),
        lineHeight: 1.2,
        marginBottom: tokens.getSpacing(3),
      };

    case "text":
      return {
        fontFamily: tokens.getFont("body"),
        fontSize: tokens.getFontSize(0),
        color: tokens.getColor("text"),
        lineHeight: tokens.getLineHeight(tokens.getFontSize(0)) / tokens.getFontSize(0),
      };

    case "button":
      return {
        fontFamily: tokens.getFont("body"),
        fontSize: tokens.getFontSize(0),
        padding: `${tokens.getSpacing(2)}px ${tokens.getSpacing(4)}px`,
        backgroundColor: variant === "secondary" 
          ? tokens.getColor("secondary") 
          : tokens.getColor("primary"),
        color: tokens.getColor("background"),
        border: "none",
        borderRadius: tokens.getBorderRadius(),
        cursor: "pointer",
        transition: "all 0.2s ease",
      };

    case "card":
      return {
        backgroundColor: tokens.getColor("background"),
        border: tokens.getBorder(),
        borderRadius: tokens.getBorderRadius(),
        padding: tokens.getSpacing(4),
        boxShadow: tokens.getShadow("md"),
      };

    case "callout":
      const calloutColors = {
        info: tokens.getColor("primary"),
        warning: tokens.getColor("accent"),
        error: "#ef4444",
        success: tokens.getColor("secondary"),
      };
      return {
        backgroundColor: tokens.getColorWithOpacity("primary", 0.1),
        borderLeft: `4px solid ${calloutColors[variant as keyof typeof calloutColors] || calloutColors.info}`,
        borderRadius: tokens.getBorderRadius(0.5),
        padding: tokens.getSpacing(3),
        color: tokens.getColor("text"),
      };

    default:
      return {};
  }
}
