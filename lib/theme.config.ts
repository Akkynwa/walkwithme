// lib/theme.config.ts

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorScheme = 'amber' | 'emerald' | 'blue' | 'purple' | 'rose';

export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  background: {
    light: string;
    dark: string;
    card: string;
    elevated: string;
    surface: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  border: {
    light: string;
    dark: string;
    default: string;
  };
}

export const colorSchemes: Record<ColorScheme, ThemeColors> = {
  amber: {
    primary: {
      50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
      400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
      800: '#92400e', 900: '#78350f'
    },
    accent: {
      50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5',
      400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c',
      800: '#991b1b', 900: '#7f1d1d'
    },
    background: {
      light: '#faf9f6',
      dark: '#1a1a1a',
      card: '#ffffff',
      elevated: '#f5f5f0',
      surface: '#f0f0eb'
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#4a4a4a',
      tertiary: '#8a8a8a',
      inverse: '#ffffff'
    },
    border: {
      light: '#e5e5e5',
      dark: '#2a2a2a',
      default: '#d4d4d4'
    }
  },
  emerald: {
    primary: {
      50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
      400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
      800: '#065f46', 900: '#064e3b'
    },
    accent: {
      50: '#fef3c7', 100: '#fde68a', 200: '#fcd34d', 300: '#fbbf24',
      400: '#f59e0b', 500: '#d97706', 600: '#b45309', 700: '#92400e',
      800: '#78350f', 900: '#451a03'
    },
    background: {
      light: '#f4f7f5',
      dark: '#0f1a14',
      card: '#ffffff',
      elevated: '#e8f0ec',
      surface: '#e0ebe6'
    },
    text: {
      primary: '#1a2e24',
      secondary: '#4a6658',
      tertiary: '#7a9688',
      inverse: '#ffffff'
    },
    border: {
      light: '#d4e6dc',
      dark: '#1e3328',
      default: '#c0d6ca'
    }
  },
  blue: {
    primary: {
      50: '#f3f7fb', 100: '#dce9f2', 200: '#bfd8e8', 300: '#8fb7d0',
      400: '#5f95b7', 500: '#356f98', 600: '#24577b', 700: '#183b63',
      800: '#112d49', 900: '#0b1f31'
    },
    accent: {
      50: '#eef5fb', 100: '#d8e7f4', 200: '#bdd8e7', 300: '#91bdda',
      400: '#5f93bf', 500: '#37749f', 600: '#24577b', 700: '#183b63',
      800: '#112d49', 900: '#0b1f31'
    },
    background: {
      light: '#f4f7fb',
      dark: '#0b1724',
      card: '#ffffff',
      elevated: '#e8eef5',
      surface: '#e6edf5'
    },
    text: {
      primary: '#10253b',
      secondary: '#415a72',
      tertiary: '#6f8296',
      inverse: '#ffffff'
    },
    border: {
      light: '#dce6f0',
      dark: '#213449',
      default: '#c8d7e5'
    }
  },
  purple: {
    primary: {
      50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe',
      400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce',
      800: '#6b21a8', 900: '#581c87'
    },
    accent: {
      50: '#fef3c7', 100: '#fde68a', 200: '#fcd34d', 300: '#fbbf24',
      400: '#f59e0b', 500: '#d97706', 600: '#b45309', 700: '#92400e',
      800: '#78350f', 900: '#451a03'
    },
    background: {
      light: '#faf5ff',
      dark: '#1a0b2e',
      card: '#ffffff',
      elevated: '#f3e8ff',
      surface: '#f0e6f8'
    },
    text: {
      primary: '#2d1b4e',
      secondary: '#5a3d7c',
      tertiary: '#9b7db8',
      inverse: '#ffffff'
    },
    border: {
      light: '#e9d5ff',
      dark: '#2d1b4e',
      default: '#d8b4fe'
    }
  },
  rose: {
    primary: {
      50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af',
      400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c',
      800: '#9f1239', 900: '#881337'
    },
    accent: {
      50: '#fef3c7', 100: '#fde68a', 200: '#fcd34d', 300: '#fbbf24',
      400: '#f59e0b', 500: '#d97706', 600: '#b45309', 700: '#92400e',
      800: '#78350f', 900: '#451a03'
    },
    background: {
      light: '#fff5f6',
      dark: '#1a0b10',
      card: '#ffffff',
      elevated: '#ffe4e8',
      surface: '#fce8eb'
    },
    text: {
      primary: '#3d1a24',
      secondary: '#6d3a48',
      tertiary: '#a06d7a',
      inverse: '#ffffff'
    },
    border: {
      light: '#fecdd3',
      dark: '#3d1a24',
      default: '#fda4af'
    }
  }
};

export const defaultTheme: ThemeMode = 'auto';
export const defaultColorScheme: ColorScheme = 'blue';