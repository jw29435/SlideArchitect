# Slide Library

This directory contains base64-encoded slide templates from the slide library PPTX.

Each file represents a slide layout type:
- `title-slide.txt` - Title slide layout
- `content-slide.txt` - Content slide with title and body
- `two-column-slide.txt` - Two-column layout
- `section-slide.txt` - Section header layout

## Format

Each file contains a base64-encoded representation of the slide that can be inserted
into PowerPoint while preserving the exact formatting from the template.

## Creating Library Slides

1. Create a PowerPoint template (.pptx) with your desired formatting
2. Create one slide for each layout type
3. Name shapes/placeholders appropriately:
   - Title shapes: "Title" or "title"
   - Subtitle shapes: "Subtitle" or "subtitle"
   - Content shapes: "Content" or "Body"
   - Column shapes: "Left Column", "Right Column"
4. Export each slide or use Office.js to extract as base64
5. Store the base64 string in the corresponding .txt file

## Placeholder Naming Convention

To enable automatic filling, name your shapes or set their alt-text to match these patterns:
- **Title layouts**: "Title", "Subtitle"
- **Content layouts**: "Title", "Content"/"Body"
- **Two-column layouts**: "Title", "Left Column"/"Column 1", "Right Column"/"Column 2"
- **Section layouts**: "Title"/"Section Title"
