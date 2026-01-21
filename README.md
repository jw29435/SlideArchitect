# SlideArchitect

A PowerPoint Web Add-in that generates professional slide decks from text using AI. Built with Office.js, SlideArchitect preserves your template formatting exactly while intelligently converting text into structured presentations.

## Features

- **AI-Powered Generation**: Uses OpenAI's GPT-4 to analyze text and create structured slide plans
- **Template Preservation**: Maintains exact formatting from your slide library PPTX
- **Flexible Layouts**: Supports title, content, two-column, and section layouts
- **Smart Placeholder Filling**: Automatically fills placeholders by shape name or alt-text
- **Overflow Protection**: Enforces deterministic layout and overflow rules
- **Base64 Slide Insertion**: Preserves source formatting when inserting slides

## Architecture

### Core Components

1. **LLM Service** (`src/utils/llm-service.js`)
   - Generates strict slide-plan JSON with layout + placeholder content
   - Supports OpenAI API integration or mock generation
   - Output format:
     ```json
     {
       "slides": [
         {
           "layoutType": "title",
           "placeholders": {
             "title": "text content",
             "subtitle": "text content"
           }
         }
       ]
     }
     ```

2. **Slide Inserter** (`src/utils/slide-inserter.js`)
   - Inserts slides from library using base64 (preserves formatting)
   - Fills placeholders by matching shape names/alt-text
   - Supports multiple layout types

3. **Overflow Handler** (`src/utils/overflow-handler.js`)
   - Enforces character limits per placeholder
   - Validates and adjusts font sizes
   - Ensures deterministic layout behavior

### Supported Layout Types

- **title**: Title slide with title and subtitle
- **content**: Standard content slide with title and body text
- **two-column**: Two-column layout for side-by-side content
- **section**: Section divider with title only

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Sideload the add-in in PowerPoint:
   - Open PowerPoint Online or Desktop
   - Go to Insert > Add-ins > Upload My Add-in
   - Select `manifest.xml`

## GitHub Pages Deployment

The add-in is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### Accessing the Deployed Add-in

Once deployed, you can use the production add-in:

1. Download the production manifest:
   ```
   https://jw29435.github.io/SlideArchitect/manifest.xml
   ```

2. Sideload in PowerPoint:
   - Open PowerPoint Online or Desktop
   - Go to Insert > Add-ins > Upload My Add-in
   - Upload the downloaded `manifest.xml`

The deployed version is available at: https://jw29435.github.io/SlideArchitect/

### Manual Deployment

To manually trigger a deployment:

1. Go to the Actions tab in GitHub
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

## Development

### Project Structure

```
SlideArchitect/
├── manifest.xml              # Add-in manifest
├── package.json              # Dependencies and scripts
├── webpack.config.js         # Build configuration
├── src/
│   ├── taskpane/             # Main UI
│   │   ├── taskpane.html
│   │   ├── taskpane.css
│   │   └── taskpane.js
│   ├── commands/             # Ribbon commands
│   │   ├── commands.html
│   │   └── commands.js
│   ├── utils/                # Core functionality
│   │   ├── llm-service.js    # LLM integration
│   │   ├── slide-inserter.js # Slide insertion
│   │   └── overflow-handler.js # Layout rules
│   └── slide-library/        # Base64 slide templates
│       ├── title-slide.txt
│       ├── content-slide.txt
│       ├── two-column-slide.txt
│       └── section-slide.txt
└── assets/                   # Icons and resources
```

### Building

```bash
npm run build
```

### Validation

Validate the manifest:
```bash
npm run validate
```

## Usage

1. Open the SlideArchitect add-in in PowerPoint
2. Enter your text content in the text area
3. (Optional) Provide an OpenAI API key for AI-powered generation
4. Click "Generate Slides"
5. The add-in will:
   - Analyze your text and create a slide plan
   - Insert slides from the library
   - Fill placeholders with content
   - Apply overflow rules

### Example Input

```
Introduction to AI

Artificial Intelligence is transforming industries worldwide.
Key benefits include automation, insights, and efficiency.

Machine Learning
- Supervised learning
- Unsupervised learning
- Reinforcement learning

Applications
Smart assistants, autonomous vehicles, medical diagnosis
```

## Slide Library Setup

To use custom templates:

1. Create a PowerPoint template (.pptx) with your branding
2. Create slides for each layout type (title, content, two-column, section)
3. Name shapes/placeholders using the convention:
   - "Title" or "title"
   - "Subtitle" or "subtitle"
   - "Content" or "Body"
   - "Left Column", "Right Column"
4. Export slides as base64 or use Office.js extraction
5. Place base64 strings in `src/slide-library/*.txt` files

## Overflow Rules

The add-in enforces these limits:

**Character Limits:**
- Title: 60 characters
- Subtitle: 100 characters
- Content: 800 characters
- Columns: 400 characters each

**Font Size Limits:**
- Title text: 32-44pt
- Subtitle: 20-28pt
- Content: 14-20pt

## API Integration

### OpenAI

To use OpenAI for slide generation:

1. Get an API key from https://platform.openai.com/
2. Enter the key in the add-in UI
3. The add-in will use GPT-4 to analyze text and create slide plans

### Mock Generation

Without an API key, the add-in uses rule-based generation:
- Splits text by paragraphs
- Detects titles and sections
- Creates appropriate layouts
- Distributes content intelligently

## Security

- API keys are not stored, only used in-memory
- All slide generation happens client-side
- No data is sent to external servers except OpenAI (if API key provided)

## Requirements

- PowerPoint Online or Desktop (Microsoft 365)
- Modern web browser
- Internet connection for Office.js CDN

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.