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
      
      // Check character limits
      const limits = CHARACTER_LIMITS[slideSpec.layoutType] || {};
      
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
          
          // Update the shape text
          await updateShapeText(shapes, placeholderKey, truncated, slideSpec.layoutType, context);
        }
      }
      
      // Enforce font sizes
      await enforceFontSizes(shapes, slideSpec.layoutType, context);
    }
    
    await context.sync();
    
    if (violations.length > 0) {
      console.warn('Overflow violations detected and corrected:', violations);
    }
    
    console.log('Overflow rules enforced');
  });
}

/**
 * Update shape text by placeholder key
 */
async function updateShapeText(shapes, placeholderKey, text, layoutType, context) {
  const mappings = PLACEHOLDER_MAPPINGS;
  
  const possibleNames = (mappings[layoutType] || {})[placeholderKey] || [placeholderKey];
  
  // Load all shape properties at once
  shapes.items.forEach(shape => {
    shape.load(['name', 'textFrame']);
  });
  await context.sync();
  
  for (const shape of shapes.items) {
    const shapeName = shape.name || '';
    const isMatch = possibleNames.some(name => 
      shapeName.toLowerCase().includes(name.toLowerCase())
    );
    
    if (isMatch) {
      try {
        const textFrame = shape.textFrame;
        textFrame.load('textRange');
        await context.sync();
        
        textFrame.textRange.text = text;
        await context.sync();
        break;
      } catch (error) {
        console.warn(`Could not update shape ${shapeName}:`, error);
      }
    }
  }
}

/**
 * Enforce font size limits
 */
async function enforceFontSizes(shapes, layoutType, context) {
  const fontLimits = FONT_SIZE_LIMITS[layoutType] || {};
  
  // Load all shape properties at once for better performance
  shapes.items.forEach(shape => {
    shape.load(['name', 'textFrame']);
  });
  await context.sync();
  
  for (const shape of shapes.items) {
    try {
      const textFrame = shape.textFrame;
      textFrame.load('textRange');
      await context.sync();
      
      const textRange = textFrame.textRange;
      textRange.load('font');
      await context.sync();
      
      const font = textRange.font;
      font.load('size');
      await context.sync();
      
      // Determine which placeholder this shape represents
      let placeholderType = null;
      const shapeName = (shape.name || '').toLowerCase();
      
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
        const currentSize = font.size;
        
        if (currentSize < min) {
          font.size = min;
          console.log(`Increased font size for ${shape.name} to ${min}pt`);
        } else if (currentSize > max) {
          font.size = max;
          console.log(`Decreased font size for ${shape.name} to ${max}pt`);
        }
        
        await context.sync();
      }
    } catch (error) {
      console.warn(`Could not enforce font size for shape:`, error);
    }
  }
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
  
  slidePlan.slides.forEach((slide, index) => {
    if (!slide.layoutType) {
      errors.push(`Slide ${index + 1}: Missing layoutType`);
    } else if (!VALID_LAYOUTS.includes(slide.layoutType)) {
      errors.push(`Slide ${index + 1}: Invalid layoutType '${slide.layoutType}'`);
    }
    
    if (!slide.placeholders || typeof slide.placeholders !== 'object') {
      errors.push(`Slide ${index + 1}: Missing or invalid placeholders`);
    }
  });
  
  return errors;
}
