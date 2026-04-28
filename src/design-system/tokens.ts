/**
 * HJX Design System - Design Tokens
 * Material Design 3 inspired color palette and spacing scale
 */

export interface DesignTokens {
  colors: ColorTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
  shadows: ShadowTokens;
  borderRadius: BorderRadiusTokens;
  transitions: TransitionTokens;
  breakpoints: BreakpointTokens;
}

export interface ColorTokens {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  success: string;
  successLight: string;
  error: string;
  errorLight: string;
  warning: string;
  warningLight: string;
  info: string;
  infoLight: string;
  neutral: string;
  neutralLight: string;
  neutralDark: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  outline: string;
  text: string;
  textSecondary: string;
  textDisabled: string;
}

export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface TypographyTokens {
  h1: TypographyValue;
  h2: TypographyValue;
  h3: TypographyValue;
  h4: TypographyValue;
  h5: TypographyValue;
  h6: TypographyValue;
  body: TypographyValue;
  bodySmall: TypographyValue;
  caption: TypographyValue;
}

export interface TypographyValue {
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface BorderRadiusTokens {
  sm: string;
  md: string;
  lg: string;
  full: string;
}

export interface TransitionTokens {
  fast: string;
  normal: string;
  slow: string;
}

export interface BreakpointTokens {
  mobile: string;
  tablet: string;
  desktop: string;
}

// Default Material Design 3 tokens
export const defaultTokens: DesignTokens = {
  colors: {
    primary: '#6200EE',
    primaryLight: '#BB86FC',
    primaryDark: '#3700B3',
    secondary: '#03DAC6',
    secondaryLight: '#03DAC6',
    secondaryDark: '#018786',
    success: '#4CAF50',
    successLight: '#81C784',
    error: '#CF6679',
    errorLight: '#EF9A9A',
    warning: '#FFC107',
    warningLight: '#FFD54F',
    info: '#2196F3',
    infoLight: '#64B5F6',
    neutral: '#757575',
    neutralLight: '#BDBDBD',
    neutralDark: '#424242',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    outline: '#E0E0E0',
    text: '#212121',
    textSecondary: '#757575',
    textDisabled: '#BDBDBD',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  typography: {
    h1: {
      fontSize: '32px',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '0px',
    },
    h2: {
      fontSize: '28px',
      fontWeight: '700',
      lineHeight: '1.3',
      letterSpacing: '0px',
    },
    h3: {
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '1.4',
      letterSpacing: '0px',
    },
    h4: {
      fontSize: '20px',
      fontWeight: '600',
      lineHeight: '1.4',
      letterSpacing: '0px',
    },
    h5: {
      fontSize: '16px',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0px',
    },
    h6: {
      fontSize: '14px',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0px',
    },
    body: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0px',
    },
    bodySmall: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0px',
    },
    caption: {
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '1.4',
      letterSpacing: '0px',
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
    xl: '0 15px 35px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.10)',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
};

// Light theme (default)
export const lightTheme: DesignTokens = defaultTokens;

// Dark theme
export const darkTheme: DesignTokens = {
  ...defaultTokens,
  colors: {
    ...defaultTokens.colors,
    primary: '#BB86FC',
    primaryLight: '#BB86FC',
    primaryDark: '#3700B3',
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    outline: '#3F3F3F',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textDisabled: '#616161',
  },
};

export function getTheme(themeName: 'light' | 'dark' = 'light'): DesignTokens {
  return themeName === 'dark' ? darkTheme : lightTheme;
}

export function mergeTokens(base: DesignTokens, overrides: Partial<DesignTokens>): DesignTokens {
  return {
    colors: { ...base.colors, ...overrides.colors },
    spacing: { ...base.spacing, ...overrides.spacing },
    typography: { ...base.typography, ...overrides.typography },
    shadows: { ...base.shadows, ...overrides.shadows },
    borderRadius: { ...base.borderRadius, ...overrides.borderRadius },
    transitions: { ...base.transitions, ...overrides.transitions },
    breakpoints: { ...base.breakpoints, ...overrides.breakpoints },
  };
}

// Utility functions
export function getToken(path: string, tokens: DesignTokens = defaultTokens): string | undefined {
  const keys = path.split('.');
  let value: any = tokens;

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return undefined;
  }

  return value;
}

export function getTokens(category: keyof DesignTokens, tokens: DesignTokens = defaultTokens): any {
  return tokens[category];
}

export function tokenToCssVar(path: string): string {
  return `var(--${path.replace(/\./g, '-')})`;
}

export function generateCssVariables(tokens: DesignTokens = defaultTokens): string {
  const lines: string[] = [':root {'];

  function addTokens(obj: any, prefix: string = '') {
    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}-${key}` : key;

      if (typeof value === 'object' && value !== null) {
        addTokens(value, path);
      } else {
        lines.push(`  --${path}: ${value};`);
      }
    }
  }

  addTokens(tokens);
  lines.push('}');

  return lines.join('\n');
}

// Alias for compatibility
export const designTokens = defaultTokens;
