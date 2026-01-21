/**
 * Shared constants for slide layouts and placeholder mappings
 */

// Mapping of layout types to slide library files
export const LAYOUT_LIBRARY = {
  'title': 'slide-library/title-slide.txt',
  'content': 'slide-library/content-slide.txt',
  'two-column': 'slide-library/two-column-slide.txt',
  'section': 'slide-library/section-slide.txt'
};

// Placeholder mappings by layout type
export const PLACEHOLDER_MAPPINGS = {
  'title': {
    'title': ['Title', 'title', 'TITLE'],
    'subtitle': ['Subtitle', 'subtitle', 'SUBTITLE']
  },
  'content': {
    'title': ['Title', 'title', 'TITLE'],
    'content': ['Content', 'content', 'CONTENT', 'Body']
  },
  'two-column': {
    'title': ['Title', 'title', 'TITLE'],
    'leftColumn': ['Left Column', 'LeftColumn', 'Column 1'],
    'rightColumn': ['Right Column', 'RightColumn', 'Column 2']
  },
  'section': {
    'title': ['Title', 'title', 'TITLE', 'Section Title']
  }
};

// Valid layout types
export const VALID_LAYOUTS = ['title', 'content', 'two-column', 'section'];
