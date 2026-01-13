// Design System Constants - Contest Platform Enhancement
// Ensures consistency across all components (Requirements 1.1, 1.3, 1.4)

export const COLORS = {
  // Primary Colors (Maximum 3 + Neutral as per Requirements 1.1)
  PRIMARY: {
    light: '#3b82f6',    // Blue - Primary actions, CTAs
    dark: '#60a5fa'      // Lighter blue for dark mode contrast
  },
  SECONDARY: {
    light: '#10b981',    // Green - Success, positive actions
    dark: '#34d399'      // Lighter green for dark mode contrast
  },
  ACCENT: {
    light: '#f59e0b',    // Amber - Highlights, warnings, contests
    dark: '#fbbf24'      // Lighter amber for dark mode contrast
  },
  NEUTRAL: {
    light: '#6b7280',    // Gray - Neutral elements, borders
    dark: '#9ca3af'      // Lighter gray for dark mode contrast
  }
};

export const SPACING = {
  XS: '0.25rem',    // 4px
  SM: '0.5rem',     // 8px
  MD: '1rem',       // 16px
  LG: '1.5rem',     // 24px
  XL: '2rem',       // 32px
  XXL: '3rem'       // 48px
};

export const BORDER_RADIUS = {
  CARD: '0.5rem',     // 8px - Contest cards, containers
  BUTTON: '0.375rem', // 6px - Buttons, inputs
  BADGE: '1rem',      // 16px - Badges, tags
  FULL: '9999px'      // Full rounded - Pills, avatars
};

export const TYPOGRAPHY = {
  FONT_FAMILY: '"Urbanist", sans-serif',
  FONT_WEIGHTS: {
    NORMAL: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700
  },
  LINE_HEIGHTS: {
    TIGHT: 1.25,
    NORMAL: 1.5,
    RELAXED: 1.75
  }
};

export const ANIMATIONS = {
  DURATION: {
    FAST: '0.15s',
    NORMAL: '0.25s',
    SLOW: '0.4s'
  },
  EASING: {
    EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  XXL: '1536px'
};

export const GRID = {
  CONTEST_CARDS: {
    DESKTOP: 4,    // 4 cards per row on desktop (Requirements 4.4)
    TABLET: 3,     // 3 cards per row on tablet
    MOBILE: 2,     // 2 cards per row on mobile
    SMALL: 1       // 1 card per row on small screens
  }
};

export const Z_INDEX = {
  DROPDOWN: 10,
  STICKY: 20,
  FIXED: 30,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  POPOVER: 60,
  TOOLTIP: 70,
  NOTIFICATION: 80
};

// Theme configuration
export const THEMES = {
  LIGHT: 'contest-light',
  DARK: 'contest-dark'
};

// Component size variants
export const SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl'
};

// Contest card dimensions (Requirements 4.2, 4.3)
export const CARD_DIMENSIONS = {
  ASPECT_RATIO: '4/3',
  MIN_HEIGHT: '320px',
  PADDING: SPACING.MD,
  BORDER_RADIUS: BORDER_RADIUS.CARD
};

// Form validation states (Requirements 1.5)
export const FORM_STATES = {
  DEFAULT: 'default',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  DISABLED: 'disabled'
};

// Navigation requirements (Requirements 2.2, 2.3)
export const NAVIGATION = {
  MIN_ROUTES_LOGGED_OUT: 3,
  MIN_ROUTES_LOGGED_IN: 5
};

// Hero section constraints (Requirements 3.1)
export const HERO_SECTION = {
  MIN_HEIGHT_PERCENT: 60,
  MAX_HEIGHT_PERCENT: 70
};

// Content sections requirement (Requirements 3.4)
export const CONTENT_SECTIONS = {
  MINIMUM_COUNT: 10
};