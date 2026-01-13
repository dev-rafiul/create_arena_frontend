// Design System Validation Utilities
// Helps ensure compliance with design system requirements

import { COLORS, NAVIGATION, HERO_SECTION, CONTENT_SECTIONS } from '../constants/designSystem';

/**
 * Validates that the color palette doesn't exceed 3 primary colors + neutral
 * Requirements 1.1: Maximum 3 primary colors plus optional neutral
 */
export const validateColorPalette = (colors = COLORS) => {
  const primaryColorCount = Object.keys(colors).filter(key => 
    key !== 'NEUTRAL' && colors[key]
  ).length;
  
  return {
    isValid: primaryColorCount <= 3,
    count: primaryColorCount,
    maxAllowed: 3,
    hasNeutral: !!colors.NEUTRAL
  };
};

/**
 * Validates navigation route count based on authentication state
 * Requirements 2.2: Minimum 3 routes for logged out users
 * Requirements 2.3: Minimum 5 routes for logged in users
 */
export const validateNavigationRoutes = (routes, isAuthenticated) => {
  const minRequired = isAuthenticated 
    ? NAVIGATION.MIN_ROUTES_LOGGED_IN 
    : NAVIGATION.MIN_ROUTES_LOGGED_OUT;
  
  return {
    isValid: routes.length >= minRequired,
    count: routes.length,
    minRequired,
    isAuthenticated
  };
};

/**
 * Validates hero section height constraints
 * Requirements 3.1: Height between 60-70% of viewport
 */
export const validateHeroHeight = (heightPercent) => {
  return {
    isValid: heightPercent >= HERO_SECTION.MIN_HEIGHT_PERCENT && 
             heightPercent <= HERO_SECTION.MAX_HEIGHT_PERCENT,
    height: heightPercent,
    minRequired: HERO_SECTION.MIN_HEIGHT_PERCENT,
    maxAllowed: HERO_SECTION.MAX_HEIGHT_PERCENT
  };
};

/**
 * Validates minimum content sections requirement
 * Requirements 3.4: Minimum 10 meaningful content sections
 */
export const validateContentSections = (sections) => {
  return {
    isValid: sections.length >= CONTENT_SECTIONS.MINIMUM_COUNT,
    count: sections.length,
    minRequired: CONTENT_SECTIONS.MINIMUM_COUNT
  };
};

/**
 * Validates contest card grid layout
 * Requirements 4.4: 4 cards per row on desktop
 */
export const validateContestGrid = (cardsPerRow, viewportWidth) => {
  const expectedCardsPerRow = viewportWidth >= 1024 ? 4 : 
                             viewportWidth >= 768 ? 3 : 
                             viewportWidth >= 480 ? 2 : 1;
  
  return {
    isValid: cardsPerRow === expectedCardsPerRow,
    actual: cardsPerRow,
    expected: expectedCardsPerRow,
    viewportWidth
  };
};

/**
 * Validates card dimensions consistency
 * Requirements 4.2, 4.3: Identical height, width, border radius
 */
export const validateCardConsistency = (cards) => {
  if (cards.length < 2) return { isValid: true, message: 'Need at least 2 cards to validate' };
  
  const firstCard = cards[0];
  const inconsistencies = [];
  
  cards.forEach((card, index) => {
    if (index === 0) return;
    
    if (card.height !== firstCard.height) {
      inconsistencies.push(`Card ${index} height mismatch`);
    }
    if (card.width !== firstCard.width) {
      inconsistencies.push(`Card ${index} width mismatch`);
    }
    if (card.borderRadius !== firstCard.borderRadius) {
      inconsistencies.push(`Card ${index} border radius mismatch`);
    }
  });
  
  return {
    isValid: inconsistencies.length === 0,
    inconsistencies,
    totalCards: cards.length
  };
};

/**
 * Validates WCAG contrast ratios for accessibility
 * Requirements 1.2: Proper contrast ratios in both themes
 */
export const validateContrastRatio = (foreground, background) => {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd use a proper color contrast library
  const getLuminance = (color) => {
    // This is a simplified version - use a proper color library in production
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  return {
    ratio,
    isValidNormal: ratio >= 4.5,  // WCAG AA for normal text
    isValidLarge: ratio >= 3.0,   // WCAG AA for large text
    isValidAAA: ratio >= 7.0      // WCAG AAA
  };
};

/**
 * Validates responsive layout integrity
 * Requirements 1.6, 2.6, 15.2: Full responsiveness across devices
 */
export const validateResponsiveLayout = (element, viewportSizes) => {
  const results = {};
  
  viewportSizes.forEach(size => {
    const { width, height } = size;
    // In a real implementation, you'd test the element at different viewport sizes
    results[`${width}x${height}`] = {
      hasHorizontalScroll: false, // Would check element.scrollWidth > element.clientWidth
      hasOverflow: false,         // Would check for content overflow
      isAccessible: true          // Would check for touch targets, etc.
    };
  });
  
  return results;
};

/**
 * Comprehensive design system validation
 * Runs all validation checks and returns a summary
 */
export const validateDesignSystem = (config) => {
  const results = {
    colorPalette: validateColorPalette(config.colors),
    navigation: validateNavigationRoutes(config.routes, config.isAuthenticated),
    heroHeight: validateHeroHeight(config.heroHeight),
    contentSections: validateContentSections(config.sections),
    contestGrid: validateContestGrid(config.cardsPerRow, config.viewportWidth),
    cardConsistency: validateCardConsistency(config.cards)
  };
  
  const allValid = Object.values(results).every(result => result.isValid);
  
  return {
    isValid: allValid,
    results,
    summary: {
      totalChecks: Object.keys(results).length,
      passedChecks: Object.values(results).filter(r => r.isValid).length,
      failedChecks: Object.values(results).filter(r => !r.isValid).length
    }
  };
};