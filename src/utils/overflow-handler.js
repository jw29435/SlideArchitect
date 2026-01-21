/**
 * Overflow Handler - Enforce deterministic layout and overflow rules
 */

import { PLACEHOLDER_MAPPINGS, VALID_LAYOUTS } from './constants.js';

// Maximum character limits per layout type
const CHARACTER_LIMITS = {
  'title': {
    'title': 60,
    'subtitle': 100
  },
  'content': {
    'title': 60,
    'content': 800
  },
  'two-column': {
    'title': 60,
    'leftColumn': 400,
    'rightColumn': 400
  },
  'section': {
    'title': 80
  }
};

// Font size limits (in points)
const FONT_SIZE_LIMITS = {
  'title': {
    'title': { min: 32, max: 44 },
    'subtitle': { min: 20, max: 28 }
  },
  'content': {
    'title': { min: 32, max: 40 },
    'content': { min: 14, max: 20 }
  },
  'two-column': {
    'title': { min: 32, max: 40 },
    'leftColumn': { min: 14, max: 18 },
    'rightColumn': { min: 14, max: 18 }
  },
  'section': {
    'title': { min: 36, max: 48 }
  }
};

/**
 * Enforce overflow rules on generated slides
 * @param {Object} slidePlan - The slide plan to validate
 */
export async function enforceOverflowRules(slidePlan) {
  return await PowerPoint.run(async (context) => {
    const presentation = context.presentation;
    const slides = presentation.slides;
    slides.load('items');
    
    await context.sync();
    
    const startIndex = slides.items.length - slidePlan.slides.length;
    const violations = [];
    
    for (let i = 0; i < slidePlan.slides.length; i++) {
      const slideSpec = slidePlan.slides[i];
      const slideIndex = startIndex + i;
      
      if (slideIndex < 0 || slideIndex >= slides.items.length) {
        continue;
      }
      
      const slide = slides.items[slideIndex];
      const shapes = slide.shapes;
      shapes.load('items');
      
      await context.sync();
      
      // Load all shape properties at once
      shapes.items.forEach(shape => {
        shape.load(['name', 'textFrame']);
      });
      
      await context.sync();
      
      // Load all textRanges and fonts upfront
      shapes.items.forEach(shape => {
        try {
          shape.textFrame.load('textRange');
        } catch (error) {
          // Shape might not have a text frame
        }
      });
      
      await context.sync();
      
      // Load font properties
      shapes.items.forEach(shape => {
        try {
          shape.textFrame.textRange.load('font');
        } catch (error) {
          // Shape might not have a text range
        }
      });
      
      await context.sync();
      
      // Load font sizes
      shapes.items.forEach(shape => {
        try {
          shape.textFrame.textRange.font.load('size');
        } catch (error) {
          // Shape might not have a font
        }
      });
      
      await context.sync();
      
      // Check character limits and update text
      const limits = CHARACTER_LIMITS[slideSpec.layoutType] || {};
      const mappings = PLACEHOLDER_MAPPINGS[slideSpec.layoutType] || {};
      
      for (const [placeholderKey, content] of Object.entries(slideSpec.placeholders)) {
        const limit = limits[placeholderKey];
        
        if (limit && content.length > limit) {
          violations.push({
            slide: i + 1,
            placeholder: placeholderKey,
            issue: 'character_overflow',
            current: content.length,
            limit: limit
          });
          
          // Truncate and add ellipsis
          const truncated = content.substring(0, limit - 3) + '...';
          slideSpec.placeholders[placeholderKey] = truncated;
          
          // Find and update the shape (no sync yet)
          const possibleNames = mappings[placeholderKey] || [placeholderKey];
          for (const shape of shapes.items) {
            const shapeName = shape.name || '';
            const isMatch = possibleNames.some(name => 
              shapeName.toLowerCase().includes(name.toLowerCase())
            );
            
            if (isMatch) {
              try {
                shape.textFrame.textRange.text = truncated;
                break;
              } catch (error) {
                console.warn(`Could not update shape ${shapeName}:`, error);
              }
            }
          }
        }
      }
      
      // Enforce font sizes (no sync yet)
      const fontLimits = FONT_SIZE_LIMITS[slideSpec.layoutType] || {};
      
      for (const shape of shapes.items) {
        try {
          const shapeName = (shape.name || '').toLowerCase();
          
          // Determine which placeholder this shape represents
          let placeholderType = null;
          if (shapeName.includes('title')) {
            placeholderType = 'title';
          } else if (shapeName.includes('subtitle')) {
            placeholderType = 'subtitle';
          } else if (shapeName.includes('content') || shapeName.includes('body')) {
            placeholderType = 'content';
          } else if (shapeName.includes('left') || shapeName.includes('column 1')) {
            placeholderType = 'leftColumn';
          } else if (shapeName.includes('right') || shapeName.includes('column 2')) {
            placeholderType = 'rightColumn';
          }
          
          if (placeholderType && fontLimits[placeholderType]) {
            const { min, max } = fontLimits[placeholderType];
            const currentSize = shape.textFrame.textRange.font.size;
            
            if (currentSize < min) {
              shape.textFrame.textRange.font.size = min;
              console.log(`Increased font size for ${shape.name} to ${min}pt`);
            } else if (currentSize > max) {
              shape.textFrame.textRange.font.size = max;
              console.log(`Decreased font size for ${shape.name} to ${max}pt`);
            }
          }
        } catch (error) {
          console.warn(`Could not enforce font size for shape:`, error);
        }
      }
      
      // Single sync after all updates on this slide
      await context.sync();
    }
    
    if (violations.length > 0) {
      console.warn('Overflow violations detected and corrected:', violations);
    }
    
    console.log('Overflow rules enforced');
  });
}

/**
 * Validate slide plan before generation
 * @param {Object} slidePlan - The slide plan to validate
 * @returns {Array} Array of validation errors
 */
export function validateSlidePlan(slidePlan) {
  const errors = [];
  
  if (!slidePlan || !slidePlan.slides || !Array.isArray(slidePlan.slides)) {
    errors.push('Invalid slide plan structure');
    return errors;
  }
  
  // Define expected placeholder keys for each layout type
  const expectedPlaceholders = {
    'title': ['title', 'subtitle'],
    'content': ['title', 'content'],
    'two-column': ['title', 'leftColumn', 'rightColumn'],
    'section': ['title']
  };
  
  slidePlan.slides.forEach((slide, index) => {
    if (!slide.layoutType) {
      errors.push(`Slide ${index + 1}: Missing layoutType`);
    } else if (!VALID_LAYOUTS.includes(slide.layoutType)) {
      errors.push(`Slide ${index + 1}: Invalid layoutType '${slide.layoutType}'`);
    }
    
    if (!slide.placeholders || typeof slide.placeholders !== 'object') {
      errors.push(`Slide ${index + 1}: Missing or invalid placeholders`);
    } else if (slide.layoutType && expectedPlaceholders[slide.layoutType]) {
      // Validate that placeholder keys match the layout type
      const expected = expectedPlaceholders[slide.layoutType];
      const actualKeys = Object.keys(slide.placeholders);
      
      // Check for unexpected placeholders
      const unexpected = actualKeys.filter(key => !expected.includes(key));
      if (unexpected.length > 0) {
        errors.push(`Slide ${index + 1}: Unexpected placeholder(s) '${unexpected.join(', ')}' for layout type '${slide.layoutType}'`);
      }
    }
  });
  
  return errors;
}
