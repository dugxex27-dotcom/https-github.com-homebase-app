/**
 * Automatic Task Content Generator
 * 
 * Generates action summaries, steps, and tools/supplies for maintenance tasks
 * based on their title and description
 */

export interface GeneratedTaskContent {
  actionSummary: string;
  steps: string[];
  toolsAndSupplies: string[];
}

/**
 * Generate action summary from task title and description
 * Creates a concise, action-oriented single sentence
 */
function generateActionSummary(title: string, description: string): string {
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();
  
  // Safety/Emergency tasks
  if (lowerTitle.includes('carbon monoxide') || lowerTitle.includes('co detector') || lowerTitle.includes('smoke detector')) {
    return 'Test your safety detectors monthly to protect your family from invisible dangers.';
  }
  
  if (lowerTitle.includes('emergency') || lowerDesc.includes('emergency')) {
    return 'Complete these essential safety checks to prepare for unexpected emergencies.';
  }
  
  // Inspection tasks
  if (lowerTitle.includes('inspect') || lowerTitle.includes('check for')) {
    const target = extractTarget(title);
    return `Perform a thorough inspection of your ${target} to catch problems early.`;
  }
  
  // Testing tasks
  if (lowerTitle.includes('test ')) {
    const target = extractTarget(title);
    return `Run these quick tests to ensure your ${target} works when you need it.`;
  }
  
  // Cleaning tasks
  if (lowerTitle.includes('clean ')) {
    const target = extractTarget(title);
    return `Clean your ${target} to maintain performance and prevent buildup.`;
  }
  
  // Monitor/Check tasks
  if (lowerTitle.includes('monitor') || lowerTitle.includes('check ')) {
    const target = extractTarget(title);
    return `Check your ${target} with these quick steps to ensure everything runs smoothly.`;
  }
  
  // Winterization/Preparation tasks
  if (lowerTitle.includes('winterize') || lowerTitle.includes('prepare for winter')) {
    return 'Complete these essential steps to protect your home from winter damage.';
  }
  
  // Default action-oriented summary
  return `Follow these steps to ${title.toLowerCase()}.`;
}

/**
 * Extract the main target/subject from a task title
 */
function extractTarget(title: string): string {
  // Remove common action words
  const cleaned = title
    .toLowerCase()
    .replace(/^(test|inspect|check|clean|monitor|replace|service|maintain)\s+/i, '')
    .replace(/\s+for.*$/, '') // Remove "for X" endings
    .replace(/\s+if.*$/, ''); // Remove "if applicable" endings
  
  return cleaned || 'system';
}

/**
 * Generate step-by-step instructions from description
 */
function generateSteps(title: string, description: string): string[] {
  const steps: string[] = [];
  const lowerTitle = title.toLowerCase();
  
  // Try to extract numbered steps or bullet points from description
  const numberMatches = description.match(/\d+\.\s+([^.]+\.)/g);
  if (numberMatches && numberMatches.length > 0) {
    return numberMatches.map(m => m.replace(/^\d+\.\s+/, '').trim());
  }
  
  // Generate contextual steps based on task type
  if (lowerTitle.includes('test') && lowerTitle.includes('detector')) {
    steps.push('Press the test button on the detector until it beeps');
    steps.push('Verify the alarm sound is loud and clear');
    steps.push('Replace batteries if the low-battery chirp sounds');
  } else if (lowerTitle.includes('inspect') && lowerTitle.includes('roof')) {
    steps.push('Use binoculars to inspect roof from the ground');
    steps.push('Look for missing, cracked, or curled shingles');
    steps.push('Check flashing around chimneys and vents');
    steps.push('Schedule professional inspection if damage is found');
  } else if (lowerTitle.includes('clean') && lowerTitle.includes('gutter')) {
    steps.push('Set up stable ladder on level ground');
    steps.push('Remove debris by hand or with scoop');
    steps.push('Flush gutters with garden hose');
    steps.push('Ensure downspouts drain away from foundation');
  } else if (lowerTitle.includes('filter')) {
    steps.push('Locate the filter access panel');
    steps.push('Remove the old filter and note its size');
    steps.push('Insert new filter with airflow arrow pointing toward unit');
    steps.push('Mark calendar to check again in 30-90 days');
  } else {
    // Generic steps based on description
    const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 20);
    if (sentences.length >= 2) {
      return sentences.slice(0, 4).map(s => s.trim());
    }
    
    // Fallback generic steps
    steps.push('Read the task description carefully');
    steps.push('Gather necessary tools and supplies');
    steps.push('Complete the maintenance task as described');
    steps.push('Document completion and note any issues');
  }
  
  return steps;
}

/**
 * Generate tools and supplies list based on task type
 */
function generateToolsAndSupplies(title: string, description: string): string[] {
  const tools: string[] = [];
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();
  
  // Safety equipment
  if (lowerTitle.includes('roof') || lowerTitle.includes('gutter') || lowerTitle.includes('ladder')) {
    tools.push('Ladder');
    tools.push('Safety gloves');
  }
  
  // Detector tasks
  if (lowerTitle.includes('detector') || lowerTitle.includes('alarm')) {
    tools.push('9V or AA batteries (check detector type)');
    tools.push('Step stool');
  }
  
  // Filter tasks
  if (lowerTitle.includes('filter')) {
    tools.push('Replacement filter (note size)');
    tools.push('Vacuum (optional, to clean area)');
  }
  
  // Gutter cleaning
  if (lowerTitle.includes('gutter')) {
    tools.push('Gutter scoop or trowel');
    tools.push('Garden hose');
    tools.push('Bucket for debris');
    tools.push('Work gloves');
  }
  
  // HVAC tasks
  if (lowerTitle.includes('hvac') || lowerTitle.includes('furnace') || lowerTitle.includes('air conditioning')) {
    tools.push('Replacement filter');
    tools.push('Screwdriver');
    tools.push('Flashlight');
  }
  
  // Plumbing tasks
  if (lowerDesc.includes('plumb') || lowerDesc.includes('pipe') || lowerDesc.includes('leak')) {
    tools.push('Flashlight');
    tools.push('Towels or bucket');
    tools.push('Adjustable wrench');
  }
  
  // Electrical tasks
  if (lowerDesc.includes('electrical') || lowerDesc.includes('outlet') || lowerDesc.includes('gfci')) {
    tools.push('Outlet tester or lamp');
    tools.push('Flashlight');
  }
  
  // Cleaning tasks
  if (lowerTitle.includes('clean')) {
    tools.push('Cleaning supplies');
    tools.push('Bucket and water');
    tools.push('Clean rags or towels');
  }
  
  // Inspection tasks
  if (lowerTitle.includes('inspect') && !tools.length) {
    tools.push('Flashlight');
    tools.push('Notepad for recording issues');
  }
  
  // Default if no specific tools identified
  if (tools.length === 0) {
    tools.push('Basic hand tools');
    tools.push('Flashlight');
  }
  
  return tools;
}

/**
 * Main function to generate all content for a task
 */
export function generateTaskContent(title: string, description: string): GeneratedTaskContent {
  return {
    actionSummary: generateActionSummary(title, description),
    steps: generateSteps(title, description),
    toolsAndSupplies: generateToolsAndSupplies(title, description)
  };
}
