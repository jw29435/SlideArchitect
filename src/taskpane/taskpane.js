import './taskpane.css';
import { generateSlidePlan } from '../utils/llm-service.js';
import { insertSlidesFromLibrary, fillPlaceholders } from '../utils/slide-inserter.js';
import { enforceOverflowRules } from '../utils/overflow-handler.js';

Office.onReady((info) => {
  if (info.host === Office.HostType.PowerPoint) {
    document.getElementById('generateBtn').onclick = generateSlides;
    document.getElementById('clearBtn').onclick = clearForm;
  }
});

async function generateSlides() {
  const textInput = document.getElementById('textInput').value.trim();
  const apiKey = document.getElementById('apiKey').value.trim();
  const enforceOverflow = document.getElementById('enforceOverflow').checked;
  
  if (!textInput) {
    showStatus('Please enter some text to generate slides.', 'error');
    return;
  }
  
  // Basic API key format validation (for OpenAI-style keys) to catch common typos
  if (apiKey && !apiKey.startsWith('sk-')) {
    showStatus('Invalid API key format. OpenAI API keys should start with "sk-".', 'error');
    return;
  }
  
  const generateBtn = document.getElementById('generateBtn');
  generateBtn.disabled = true;
  
  try {
    showStatus('Generating slide plan...', 'info');
    updateProgress('Step 1/4: Analyzing text and creating slide plan...');
    
    // Generate slide plan JSON using LLM
    const slidePlan = await generateSlidePlan(textInput, apiKey);
    
    // Display slide plan preview
    document.getElementById('slidePlanPreview').textContent = JSON.stringify(slidePlan, null, 2);
    
    showStatus('Inserting slides from library...', 'info');
    updateProgress('Step 2/4: Inserting slides from slide library...');
    
    // Insert slides from library using base64 (preserves formatting)
    await insertSlidesFromLibrary(slidePlan);
    
    showStatus('Filling placeholders...', 'info');
    updateProgress('Step 3/4: Filling placeholders with content...');
    
    // Fill placeholders by shape name/alt-text
    await fillPlaceholders(slidePlan);
    
    if (enforceOverflow) {
      showStatus('Enforcing overflow rules...', 'info');
      updateProgress('Step 4/4: Applying overflow rules...');
      
      // Enforce deterministic layout and overflow rules
      await enforceOverflowRules(slidePlan);
    }
    
    showStatus(`Successfully generated ${slidePlan.slides.length} slide(s)!`, 'success');
    updateProgress('');
    
  } catch (error) {
    console.error('Error generating slides:', error);
    showStatus(`Error: ${error.message}`, 'error');
    updateProgress('');
  } finally {
    generateBtn.disabled = false;
  }
}

function clearForm() {
  document.getElementById('textInput').value = '';
  document.getElementById('apiKey').value = '';
  document.getElementById('slidePlanPreview').textContent = '';
  showStatus('', '');
  updateProgress('');
}

function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
}

function updateProgress(message) {
  document.getElementById('progress').textContent = message;
}
