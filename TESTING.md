# SlideArchitect Testing Guide

## Overview

This guide covers manual testing procedures for the SlideArchitect PowerPoint Web Add-in since no automated test suite exists yet.

## Prerequisites

- PowerPoint Desktop or PowerPoint Online (Microsoft 365)
- Node.js and npm installed
- SSL certificates for local development
- Text editor (VS Code recommended)

## Setup for Testing

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Generate SSL Certificates** (first time only)
   ```bash
   npx office-addin-dev-certs install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Server runs at https://localhost:3000

4. **Sideload Add-in**
   - PowerPoint Desktop: Insert > Get Add-ins > Upload My Add-in > manifest.xml
   - PowerPoint Online: Insert > Office Add-ins > Upload My Add-in > manifest.xml

## Test Scenarios

### Test 1: Basic Slide Generation (Mock)

**Purpose**: Verify basic functionality without API key

**Steps**:
1. Open SlideArchitect task pane
2. Enter test text from EXAMPLES.md (Example 1)
3. Leave API Key field empty
4. Check "Enforce overflow rules"
5. Click "Generate Slides"

**Expected Results**:
- Status shows progress through 4 steps
- Slide plan JSON appears in preview
- Multiple slides created in presentation
- No errors in browser console

**Pass Criteria**:
- ✅ At least 3 slides created
- ✅ Title slide present
- ✅ Content slides have text
- ✅ No console errors

---

### Test 2: OpenAI Integration

**Purpose**: Verify LLM integration works

**Prerequisites**: Valid OpenAI API key

**Steps**:
1. Open SlideArchitect task pane
2. Enter complex text (Example 5 from EXAMPLES.md)
3. Enter OpenAI API key in password field
4. Check "Enforce overflow rules"
5. Click "Generate Slides"

**Expected Results**:
- AI analyzes text intelligently
- Better layout selection than mock
- Slide plan shows logical structure
- All slides generated successfully

**Pass Criteria**:
- ✅ Slides match content semantics
- ✅ Layout types appropriate for content
- ✅ No API errors (check console)
- ✅ Preview shows valid JSON

---

### Test 3: Layout Type Validation

**Purpose**: Verify all layout types work

**Steps**:
1. Generate slides with text that triggers each layout:
   - Title layout: "Welcome to AI" (first paragraph)
   - Section layout: "Section: Overview"
   - Content layout: Regular paragraphs
   - Two-column layout: Very long content (>500 chars)

**Expected Results**:
- Each layout type represented
- Layouts match content structure
- No missing layouts in output

**Pass Criteria**:
- ✅ Title slide created
- ✅ Section slide created
- ✅ Content slide created
- ✅ Two-column slide created (if applicable)

---

### Test 4: Overflow Rules Enforcement

**Purpose**: Verify character limits and truncation

**Steps**:
1. Open SlideArchitect task pane
2. Enter overflow test text from EXAMPLES.md (Example 4)
3. Check "Enforce overflow rules"
4. Click "Generate Slides"
5. Inspect generated slides

**Expected Results**:
- Title truncated to 60 chars + "..."
- Content truncated to 800 chars + "..."
- Console logs show violations
- Slides remain properly formatted

**Pass Criteria**:
- ✅ No text overflow off slide
- ✅ Ellipsis added to truncated content
- ✅ Console shows violation warnings
- ✅ Slides readable and formatted

---

### Test 5: Placeholder Matching

**Purpose**: Verify shape name matching works

**Steps**:
1. Open PowerPoint Selection Pane (View > Selection Pane)
2. Note shape names in template
3. Generate slides
4. Verify content filled in correct shapes

**Expected Results**:
- Title content in Title shapes
- Body content in Content/Body shapes
- Subtitle in Subtitle shapes
- All placeholders filled

**Pass Criteria**:
- ✅ No empty placeholders
- ✅ Content in correct shapes
- ✅ No text in wrong locations
- ✅ Case-insensitive matching works

---

### Test 6: Clear Functionality

**Purpose**: Verify clear button works

**Steps**:
1. Enter text and API key
2. Generate slides (let it complete)
3. Click "Clear" button

**Expected Results**:
- Text area cleared
- API key field cleared
- Preview cleared
- Status cleared
- Ready for new input

**Pass Criteria**:
- ✅ All fields reset
- ✅ No residual data
- ✅ Can generate again

---

### Test 7: Error Handling

**Purpose**: Verify error cases handled gracefully

**Test 7a: Empty Input**
1. Click "Generate Slides" with empty text
2. Expect error message: "Please enter some text"

**Test 7b: Invalid API Key**
1. Enter invalid API key
2. Try to generate
3. Expect error about API failure

**Test 7c: Network Error**
1. Disconnect network (if using OpenAI)
2. Try to generate
3. Expect timeout/network error

**Pass Criteria**:
- ✅ User-friendly error messages
- ✅ No crashes or freezes
- ✅ Can recover and try again

---

### Test 8: Multiple Generations

**Purpose**: Verify add-in stable across multiple uses

**Steps**:
1. Generate slides (any example)
2. Click Clear
3. Generate different slides
4. Repeat 5 times

**Expected Results**:
- Each generation succeeds
- No memory leaks
- Performance consistent
- No accumulated errors

**Pass Criteria**:
- ✅ All 5 generations succeed
- ✅ No slowdown over time
- ✅ Console clean (no accumulating errors)

---

### Test 9: Browser Compatibility

**Purpose**: Verify works across environments

**Environments to Test**:
- PowerPoint Desktop (Windows)
- PowerPoint Desktop (Mac)
- PowerPoint Online (Chrome)
- PowerPoint Online (Edge)
- PowerPoint Online (Safari)

**Pass Criteria**:
- ✅ Add-in loads in all environments
- ✅ UI displays correctly
- ✅ Generation works consistently

---

### Test 10: Performance Testing

**Purpose**: Measure generation time

**Steps**:
1. Use Example 5 (largest test case)
2. Time from click to completion
3. Repeat 3 times, average

**Expected Results**:
- Mock generation: < 5 seconds
- OpenAI generation: < 15 seconds
- No freezing or blocking

**Pass Criteria**:
- ✅ Meets time expectations
- ✅ Progress indicator shows activity
- ✅ UI remains responsive

---

## Regression Testing Checklist

Before each release, verify:

- [ ] All layout types generate correctly
- [ ] Mock generation works without API key
- [ ] OpenAI integration works with valid key
- [ ] Overflow rules enforce limits
- [ ] Placeholders fill correctly
- [ ] Error handling graceful
- [ ] Clear button resets state
- [ ] Multiple generations work
- [ ] Build completes without errors
- [ ] No console errors during normal use

## Known Issues

Document any known issues here:

1. **Network Timeouts**: OpenAI calls may timeout on slow connections
2. **Shape Names**: Custom templates need specific shape naming
3. **Font Sizes**: May not adjust if shape has custom formatting

## Bug Reporting Template

When reporting bugs, include:

```
**Environment**:
- OS: [Windows/Mac/Browser]
- PowerPoint: [Desktop/Online]
- Browser: [if Online]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**:


**Actual Behavior**:


**Screenshots**:
[If applicable]

**Console Errors**:
[Copy from browser DevTools Console]

**Slide Plan JSON**:
[Copy from preview if generated]
```

## Debugging Tips

1. **Open DevTools**: F12 in browser, right-click task pane
2. **Check Console**: Look for errors and warnings
3. **Network Tab**: Verify API calls if using OpenAI
4. **Breakpoints**: Set in taskpane.js for debugging
5. **localStorage**: Clear if add-in behaves oddly

## Performance Profiling

To profile performance:

1. Open DevTools > Performance tab
2. Click Record
3. Generate slides
4. Stop recording
5. Analyze timeline

Look for:
- Long tasks (> 50ms)
- Excessive API calls
- Memory leaks

## Test Data

Use examples from EXAMPLES.md:
- Example 1: Simple, 4-5 slides
- Example 2: Multi-section, 7+ slides
- Example 3: Technical, mixed layouts
- Example 4: Overflow testing
- Example 5: Complex, all features

## Automated Testing (Future)

Recommendations for automated tests:

1. **Unit Tests**: Jest for utility functions
2. **Integration Tests**: Mock Office.js
3. **E2E Tests**: Puppeteer or Playwright
4. **Visual Regression**: Percy or BackstopJS

## Conclusion

Manual testing is currently required. Follow this guide systematically before each release. Document any failures and track fixes. Consider implementing automated tests as the project matures.
