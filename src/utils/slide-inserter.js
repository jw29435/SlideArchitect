/**
 * Slide Inserter - Insert slides from library and fill placeholders
 * Uses base64 to preserve source formatting
 */

import { LAYOUT_LIBRARY, PLACEHOLDER_MAPPINGS } from './constants.js';

/**
 * Insert slides from library based on slide plan
 * @param {Object} slidePlan - The slide plan with layout and content
 */
export async function insertSlidesFromLibrary(slidePlan) {
  return await PowerPoint.run(async (context) => {
    const presentation = context.presentation;
    
    // Get or create slides
    for (let i = 0; i < slidePlan.slides.length; i++) {
      const slideSpec = slidePlan.slides[i];
      const layoutType = slideSpec.layoutType;
      
      // TODO: Implement base64 slide loading from library to preserve exact template formatting
      // Current implementation uses built-in PowerPoint layouts which don't preserve custom templates
      // Future: Load base64-encoded slides from LAYOUT_LIBRARY and insert with formatting preserved
      let slide;
      
      // Insert slide with appropriate layout
      switch (layoutType) {
        case 'title':
          slide = presentation.slides.add('Title');
          break;
        case 'content':
          slide = presentation.slides.add('TitleAndContent');
          break;
        case 'two-column':
          slide = presentation.slides.add('TwoColumnText');
          break;
        case 'section':
          slide = presentation.slides.add('SectionHeader');
          break;
        default:
          slide = presentation.slides.add('Blank');
      }
      
      slide.load('shapes');
    }
    
    await context.sync();
    console.log(`Inserted ${slidePlan.slides.length} slides`);
  });
}

/**
 * Fill placeholders in slides by shape name/alt-text
 * @param {Object} slidePlan - The slide plan with placeholder content
 */
export async function fillPlaceholders(slidePlan) {
  return await PowerPoint.run(async (context) => {
    const presentation = context.presentation;
    const slides = presentation.slides;
    slides.load('items');
    
    await context.sync();
    
    // Skip the first slide if it already exists (might be default)
    const startIndex = slides.items.length - slidePlan.slides.length;
    
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
      
      // Load all shape properties at once for better performance
      shapes.items.forEach(shape => {
        shape.load(['name', 'textFrame']);
      });
      
      await context.sync();
      
      // Load all textRanges upfront to minimize sync calls
      shapes.items.forEach(shape => {
        try {
          shape.textFrame.load('textRange');
        } catch (error) {
          // Shape might not have a text frame
        }
      });
      
      await context.sync();
      
      // Get placeholder mappings for this layout type
      const mappings = PLACEHOLDER_MAPPINGS[slideSpec.layoutType] || {};
      
      // Fill each placeholder (text assignment only, no sync yet)
      for (const [placeholderKey, content] of Object.entries(slideSpec.placeholders)) {
        if (!content) continue;
        
        const possibleNames = mappings[placeholderKey] || [placeholderKey];
        
        // Find shape by name or alt-text
        for (const shape of shapes.items) {
          // Check if shape name matches any of the possible names
          const shapeName = shape.name || '';
          const isMatch = possibleNames.some(name => 
            shapeName.toLowerCase().includes(name.toLowerCase())
          );
          
          if (isMatch) {
            try {
              // Set the text content (no sync needed yet)
              shape.textFrame.textRange.text = content;
              console.log(`Filled placeholder '${placeholderKey}' in slide ${i + 1}`);
              break; // Move to next placeholder
            } catch (error) {
              console.warn(`Could not fill shape ${shapeName}:`, error);
            }
          }
        }
      }
      
      // Single sync after all placeholders on this slide are set
      await context.sync();
    }
    
    console.log('All placeholders filled');
  });
}

// TODO: Implement base64 slide loading
// Future implementation would:
// 1. Store pre-formatted PPTX slides as base64 in slide library
// 2. Use PowerPoint.createPresentation() with base64 to load templates
// 3. Copy slides from the created presentation to preserve exact formatting
// Current implementation uses built-in PowerPoint layouts instead.
