/**
 * Slide Inserter - Insert slides from library and fill placeholders
 * Uses base64 to preserve source formatting
 */

// Mapping of layout types to slide library files
const LAYOUT_LIBRARY = {
  'title': 'slide-library/title-slide.txt',
  'content': 'slide-library/content-slide.txt',
  'two-column': 'slide-library/two-column-slide.txt',
  'section': 'slide-library/section-slide.txt'
};

// Placeholder mappings by layout type
const PLACEHOLDER_MAPPINGS = {
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
      
      // For now, we'll create slides with built-in layouts
      // In a real implementation, you would load base64 from slide library
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
      
      // Get placeholder mappings for this layout type
      const mappings = PLACEHOLDER_MAPPINGS[slideSpec.layoutType] || {};
      
      // Fill each placeholder
      for (const [placeholderKey, content] of Object.entries(slideSpec.placeholders)) {
        if (!content) continue;
        
        const possibleNames = mappings[placeholderKey] || [placeholderKey];
        
        // Find shape by name or alt-text
        for (const shape of shapes.items) {
          shape.load(['name', 'textFrame']);
          await context.sync();
          
          // Check if shape name matches any of the possible names
          const shapeName = shape.name || '';
          const isMatch = possibleNames.some(name => 
            shapeName.toLowerCase().includes(name.toLowerCase())
          );
          
          if (isMatch) {
            try {
              const textFrame = shape.textFrame;
              textFrame.load('textRange');
              await context.sync();
              
              // Set the text content
              textFrame.textRange.text = content;
              await context.sync();
              
              console.log(`Filled placeholder '${placeholderKey}' in slide ${i + 1}`);
              break; // Move to next placeholder
            } catch (error) {
              console.warn(`Could not fill shape ${shapeName}:`, error);
            }
          }
        }
      }
    }
    
    console.log('All placeholders filled');
  });
}

/**
 * Load slide from library as base64 (preserves formatting)
 * This is a placeholder for actual implementation
 * In production, you would:
 * 1. Store pre-formatted PPTX slides as base64
 * 2. Use PowerPoint.createPresentation() with base64
 * 3. Copy slides from the created presentation
 */
async function loadSlideFromLibraryBase64(layoutType) {
  // Mock implementation
  // In real scenario, fetch base64 from server or embed it
  const libraryPath = LAYOUT_LIBRARY[layoutType];
  
  if (!libraryPath) {
    throw new Error(`Unknown layout type: ${layoutType}`);
  }
  
  // Placeholder: would fetch actual base64 encoded slide
  return null;
}
