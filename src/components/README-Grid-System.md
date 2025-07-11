# Homepage Grid System Documentation

## Overview
This document outlines the unified grid system implemented across all homepage sections to ensure consistent layouts and visual harmony.

## Problem Solved
- **Inconsistent Grid Layouts**: Different sections used varying grid configurations
- **Visual Disconnect**: Sections appeared to have different "visual weights"
- **Maintenance Issues**: Hard to maintain consistent spacing and alignment

## Solution: Unified Grid System

### Core Classes

#### Basic Grid Classes
```css
.homepage-grid          /* Base grid with gap-6 */
.homepage-grid-2        /* 1 col mobile, 2 cols tablet+ */
.homepage-grid-3        /* 1 col mobile, 2 cols tablet, 3 cols desktop */
.homepage-grid-4        /* 1 col mobile, 2 cols tablet, 4 cols desktop */
```

#### Centered Grid Classes
```css
.homepage-grid-centered      /* Base grid + max-w-6xl mx-auto */
.homepage-grid-2-centered    /* 2 cols + max-w-4xl mx-auto */
.homepage-grid-3-centered    /* 3 cols + max-w-6xl mx-auto */
.homepage-grid-4-centered    /* 4 cols + max-w-7xl mx-auto */
```

#### Content Width Classes
```css
.section-content-narrow      /* max-w-4xl mx-auto */
.section-content-medium      /* max-w-6xl mx-auto */
.section-content-wide        /* max-w-7xl mx-auto */
```

## Implementation by Section

### 1. HeroSection
- **Stats Cards**: `homepage-grid-3-centered` (3 cards, centered, narrow width)

### 2. EventsLocationsSection
- **Container**: `section-content-medium` (max-w-6xl)
- **Event Cards**: `homepage-grid-2` (2 cards side by side)

### 3. HowItWorksSection
- **Process Steps**: `homepage-grid-4-centered` (4 cards, centered, wide width)
- **Info Cards**: `homepage-grid-3-centered` (3 cards, centered, medium width)
- **FAQ**: `section-content-narrow` (single centered card)

### 4. InspiringContentSection
- **Success Stories**: `homepage-grid-2-centered` (2 cards, centered, narrow width)
- **News & Gallery**: `homepage-grid-2` (2 cards side by side, full width)

### 5. ContactSupportSection
- **Contact Cards**: `homepage-grid-4-centered` (4 cards, centered, wide width)
- **Emergency Contact**: `section-content-narrow` (single centered card)

## Benefits

### ✅ Visual Consistency
- All sections now have predictable content widths
- Cards align consistently across the page
- Professional, polished appearance

### ✅ Responsive Design
- Mobile-first approach with progressive enhancement
- Consistent breakpoints across all sections
- Optimal viewing on all device sizes

### ✅ Maintainability
- Single source of truth for grid configurations
- Easy to update spacing and alignment globally
- Reduced CSS duplication

### ✅ Performance
- Optimized grid classes with minimal CSS
- Consistent gap spacing (gap-6) across all grids
- Efficient responsive behavior

## Usage Guidelines

### When to Use Each Grid Type

#### `homepage-grid-2-centered`
- **Use for**: Featured content, hero elements, important CTAs
- **Examples**: Success stories, featured events
- **Width**: Narrow (max-w-4xl) for focused attention

#### `homepage-grid-3-centered`
- **Use for**: Balanced content distribution
- **Examples**: Stats cards, feature highlights
- **Width**: Medium (max-w-6xl) for good readability

#### `homepage-grid-4-centered`
- **Use for**: Comprehensive information display
- **Examples**: Process steps, contact options
- **Width**: Wide (max-w-7xl) for maximum content

#### `homepage-grid-2` (not centered)
- **Use for**: Side-by-side content that spans full width
- **Examples**: News and gallery sections
- **Width**: Full container width

## Best Practices

1. **Always use the unified grid classes** instead of custom grid configurations
2. **Choose appropriate content width** based on content type and importance
3. **Maintain consistent spacing** with the gap-6 standard
4. **Test responsive behavior** on all breakpoints
5. **Keep content balanced** within each grid layout

## Future Enhancements

- Add more specialized grid classes if needed
- Consider implementing CSS Grid areas for complex layouts
- Monitor performance and optimize as needed
- Document any new grid patterns that emerge

## Migration Notes

All existing sections have been updated to use the unified grid system. The changes maintain the same visual hierarchy while ensuring consistency across the homepage. 