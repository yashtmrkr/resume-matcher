cat > content.js << 'EOF'
// Content script that scrapes job description from the current page
// This runs on every webpage and can extract content

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapeJobDescription') {
    const jobDescription = scrapePageContent();
    sendResponse({ 
      success: true, 
      content: jobDescription,
      url: window.location.href
    });
  }
  return true;
});

function scrapePageContent() {
  // Remove unwanted elements
  const elementsToRemove = [
    'script', 'style', 'nav', 'header', 'footer', 
    'iframe', 'noscript', '[role="navigation"]',
    '[role="banner"]', '[role="contentinfo"]',
    '.cookie-banner', '.advertisement', '.ad',
    '#cookie-consent', '.social-share'
  ];
  
  // Clone body to avoid modifying actual page
  const bodyClone = document.body.cloneNode(true);
  
  elementsToRemove.forEach(selector => {
    bodyClone.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Try to find job description in common containers
  const jobDescriptionSelectors = [
    // LinkedIn
    '.jobs-description__content',
    '.jobs-description',
    '.job-view-layout',
    
    // Indeed
    '#jobDescriptionText',
    '.jobsearch-JobComponent-description',
    
    // Greenhouse
    '#content',
    '.job-post',
    
    // Lever
    '.posting-headline',
    '.posting-description',
    
    // Workday
    '[data-automation-id="jobPostingDescription"]',
    
    // Generic
    '[class*="job-description"]',
    '[id*="job-description"]',
    '[class*="description"]',
    'main',
    'article',
    '.content',
    '#content'
  ];

  let content = '';
  
  // Try to find specific job description container
  for (const selector of jobDescriptionSelectors) {
    const element = bodyClone.querySelector(selector);
    if (element) {
      content = element.innerText || element.textContent;
      if (content.length > 200) {
        break;
      }
    }
  }

  // If no specific container found, get all text
  if (!content || content.length < 200) {
    content = bodyClone.innerText || bodyClone.textContent;
  }

  // Clean up the text
  content = content
    .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
    .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
    .trim();

  // Limit content length (Claude has token limits)
  const maxLength = 15000;
  if (content.length > maxLength) {
    content = content.substring(0, maxLength) + '...[truncated]';
  }

  return content;
}
EOF