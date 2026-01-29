/**
 * Theme Configuration for Hospital Management System
 * 
 * IMPORTANT: Customize these colors to be unique and professional.
 * DO NOT use standard AI-generated colors.
 * 
 * Research real hospital/medical websites for authentic color inspiration.
 */

export const theme = {
  // Primary Color Palette - Choose unique, professional colors
  colors: {
    // Primary brand color (main actions, links, active states)
    primary: '#1a5f7a', // Deep Teal - CUSTOMIZE THIS
    
    // Secondary accent color (highlights, secondary actions)
    secondary: '#d97757', // Warm Coral - CUSTOMIZE THIS
    
    // Background colors
    background: {
      main: '#faf9f7', // Warm off-white
      card: '#ffffff',
      sidebar: '#1a1a1a', // Dark sidebar
      navbar: '#ffffff',
    },
    
    // Text colors
    text: {
      primary: '#2c2c2c', // Charcoal
      secondary: '#6c757d', // Muted gray
      light: '#ffffff',
      muted: '#9ca3af',
    },
    
    // Status colors (customize to match your palette)
    status: {
      success: '#4a7c59', // Forest green
      warning: '#c9a961', // Muted gold
      error: '#b85c57', // Muted red
      info: '#5a8a9f', // Teal blue
    },
    
    // Border colors
    border: {
      light: '#e5e7eb',
      medium: '#d1d5db',
      dark: '#9ca3af',
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '40px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
      loose: 1.8,
    },
  },
  
  // Spacing (8px base unit)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '40px',
    '3xl': '48px',
    '4xl': '64px',
  },
  
  // Border radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  // Shadows (for depth and elevation)
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 2px 8px rgba(0, 0, 0, 0.08)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.12)',
    xl: '0 8px 24px rgba(0, 0, 0, 0.16)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  },
  
  // Animation timings
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '400ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    },
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Layout
  layout: {
    sidebarWidth: '260px',
    navbarHeight: '72px',
    containerMaxWidth: '1200px',
  },
};

export default theme;

