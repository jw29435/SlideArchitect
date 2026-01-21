# SlideArchitect Implementation Guide

## Quick Start

### 1. Initial Setup

```bash
# Install dependencies
npm install

# Generate SSL certificates for local development
npx office-addin-dev-certs install

# Start development server
npm run dev
```

### 2. Sideload the Add-in

**PowerPoint Desktop:**
1. Open PowerPoint
2. Go to Insert > Get Add-ins > Upload My Add-in
3. Browse to `manifest.xml`
4. Click Upload

**PowerPoint Online:**
1. Open PowerPoint Online
2. Go to Insert > Office Add-ins > Upload My Add-in
3. Browse to `manifest.xml`
4. Click Upload

### 3. Test the Add-in

1. Open the SlideArchitect task pane
2. Enter sample text
3. Click "Generate Slides"
4. Verify slides are created

## Implementation Details

### Slide Plan JSON Schema

The LLM generates JSON following this strict schema:

```json
{
  "slides": [
    {
      "layoutType": "title" | "content" | "two-column" | "section",
      "placeholders": {
        "title": "string",
        "subtitle": "string",      // title layout only
        "content": "string",        // content layout only
        "leftColumn": "string",     // two-column layout only
        "rightColumn": "string"     // two-column layout only
      }
    }
  ]
}
```

### Layout Specifications

#### Title Layout
- **Purpose**: Opening slide or major section breaks
- **Placeholders**: title, subtitle
- **Character Limits**: title (60), subtitle (100)
- **Font Sizes**: title (32-44pt), subtitle (20-28pt)

#### Content Layout
- **Purpose**: Standard content slide
- **Placeholders**: title, content
- **Character Limits**: title (60), content (800)
- **Font Sizes**: title (32-40pt), content (14-20pt)

#### Two-Column Layout
- **Purpose**: Comparisons, side-by-side content
- **Placeholders**: title, leftColumn, rightColumn
- **Character Limits**: title (60), each column (400)
- **Font Sizes**: title (32-40pt), columns (14-18pt)

#### Section Layout
- **Purpose**: Section dividers
- **Placeholders**: title
- **Character Limits**: title (80)
- **Font Sizes**: title (36-48pt)

### Base64 Slide Insertion

To preserve exact template formatting:

1. **Create Template PPTX**: Design slides with your brand styling
2. **Export as Base64**: Use Office.js or external tool
3. **Store in Library**: Place base64 strings in `src/slide-library/*.txt`
4. **Insertion Process**:
   - Load base64 from library
   - Create presentation from base64
   - Copy slides to active presentation
   - Fill placeholders by name/alt-text

### Placeholder Matching

The system matches placeholders using:
1. **Shape Name**: Primary matching method
2. **Alt Text**: Fallback if name doesn't match
3. **Case-Insensitive**: Handles variations (Title, title, TITLE)
4. **Partial Match**: Matches "Title 1" to "Title"

Example shape naming:
```
Layout: title
  - Shape 1: name="Title 1" or alt-text="title"
  - Shape 2: name="Subtitle 1" or alt-text="subtitle"

Layout: content
  - Shape 1: name="Title 1" or alt-text="title"
  - Shape 2: name="Text Placeholder 2" or alt-text="content"
```

### Overflow Enforcement

Deterministic rules prevent layout breaking:

1. **Character Truncation**:
   - Count characters in content
   - If exceeds limit, truncate to limit-3
   - Append "..." ellipsis
   - Update slide immediately

2. **Font Size Adjustment**:
   - Check current font size
   - If below minimum, increase to minimum
   - If above maximum, decrease to maximum
   - Ensures readability and consistency

3. **Layout Validation**:
   - Verify layoutType is valid
   - Check all required placeholders present
   - Validate placeholder content types
   - Return errors for invalid plans

## Testing

### Manual Testing Scenarios

1. **Basic Text Conversion**:
   - Input: Simple paragraph text
   - Expected: 1-2 content slides

2. **Multiple Sections**:
   - Input: Text with headers and sections
   - Expected: Title + section + content slides

3. **Long Content**:
   - Input: Very long paragraphs
   - Expected: Two-column split or truncation

4. **Overflow Handling**:
   - Input: Titles > 60 chars
   - Expected: Truncation with "..."

5. **OpenAI Integration**:
   - Input: Complex text with API key
   - Expected: Intelligent slide structure

### Debug Mode

Enable console logging:
```javascript
// In browser DevTools console
localStorage.setItem('slideArchitect:debug', 'true');
```

View detailed logs:
- Slide plan JSON
- Placeholder matching
- Overflow violations
- Font size adjustments

## Troubleshooting

### Add-in Doesn't Load
- Verify manifest.xml is valid: `npm run validate`
- Check SSL certificates are installed
- Ensure dev server is running on port 3000
- Clear Office cache: `npx office-addin-dev-settings clear`

### Slides Not Generated
- Open browser console (F12) for errors
- Check Office.js is loaded
- Verify presentation has write permissions
- Test with mock generation (no API key)

### Placeholders Not Filled
- Inspect shape names in PowerPoint (Selection Pane)
- Verify names match expected patterns
- Check console for matching attempts
- Ensure shapes have text frames

### Overflow Rules Not Applied
- Verify "Enforce overflow rules" is checked
- Check console for violation logs
- Ensure character limits are appropriate
- Test with deliberately long content

## Advanced Usage

### Custom Layouts

Add a new layout type:

1. Define layout in `LAYOUT_LIBRARY` (slide-inserter.js)
2. Add placeholder mappings in `PLACEHOLDER_MAPPINGS`
3. Set character limits in `CHARACTER_LIMITS` (overflow-handler.js)
4. Add font size limits in `FONT_SIZE_LIMITS`
5. Create library slide file
6. Update LLM prompt to include new layout

### Custom LLM Integration

Replace OpenAI with another LLM:

1. Modify `generateWithOpenAI` in llm-service.js
2. Change API endpoint and authentication
3. Adjust prompt format for your LLM
4. Parse response to match slide plan schema

### Batch Processing

Process multiple documents:

```javascript
const documents = ['doc1.txt', 'doc2.txt', 'doc3.txt'];

for (const doc of documents) {
  const text = await loadDocument(doc);
  await generateSlides(text);
}
```

## Production Deployment

### 1. Build for Production

```bash
npm run build
```

### 2. Update Manifest

- Change URLs from `localhost:3000` to your domain
- Update `<Id>` with a unique GUID
- Set proper `<ProviderName>` and support URLs

### 3. Host Files

Upload to web server:
- `dist/` folder contents
- `manifest.xml`
- SSL certificate (if required)

### 4. Distribute

Options:
- **AppSource**: Submit to Microsoft AppSource
- **Centralized Deployment**: Admin deploys to organization
- **Direct Install**: Users install via manifest URL

## Performance Optimization

- Cache slide library base64 strings
- Batch Office.js operations with `context.sync()`
- Minimize API calls by processing locally
- Use mock generation for testing
- Lazy load non-critical resources

## Security Best Practices

- Never commit API keys to repository
- Use environment variables for sensitive data
- Validate all user input
- Sanitize text before LLM processing
- Implement rate limiting for API calls
- Use HTTPS for all requests
