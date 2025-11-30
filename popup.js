// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    btn.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
  });
});

// Check API key on load
chrome.storage.local.get(['anthropicApiKey'], (result) => {
  if (result.anthropicApiKey) {
    document.getElementById('api-status').textContent = 'Saved';
    document.getElementById('api-status').className = 'status-badge status-saved';
    document.getElementById('api-key').value = '••••••••••••••••';
  } else {
    document.getElementById('api-warning').style.display = 'block';
  }
});

// Save API Key
document.getElementById('save-key-btn').addEventListener('click', () => {
  const apiKey = document.getElementById('api-key').value.trim();
  
  if (!apiKey || apiKey === '••••••••••••••••') {
    showStatus('Please enter a valid API key', 'error');
    return;
  }

  if (!apiKey.startsWith('sk-ant-')) {
    showStatus('Invalid API key format. Should start with sk-ant-', 'error');
    return;
  }

  chrome.storage.local.set({ anthropicApiKey: apiKey }, () => {
    document.getElementById('api-status').textContent = 'Saved';
    document.getElementById('api-status').className = 'status-badge status-saved';
    document.getElementById('api-key').value = '••••••••••••••••';
    showStatus('API key saved successfully!', 'success');
    document.getElementById('api-warning').style.display = 'none';
  });
});

// Clear API Key
document.getElementById('clear-key-btn').addEventListener('click', () => {
  chrome.storage.local.remove('anthropicApiKey', () => {
    document.getElementById('api-status').textContent = 'Not Saved';
    document.getElementById('api-status').className = 'status-badge status-not-saved';
    document.getElementById('api-key').value = '';
    showStatus('API key cleared', 'success');
    document.getElementById('api-warning').style.display = 'block';
  });
});

function showStatus(message, type) {
  const statusDiv = document.getElementById('save-status');
  statusDiv.className = `alert alert-${type}`;
  statusDiv.textContent = message;
  statusDiv.style.display = 'block';
  
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}

// Analyze Job Match
document.getElementById('analyze-btn').addEventListener('click', async () => {
  const jdFile = document.getElementById('jd-file').files[0];
  const resumeFile = document.getElementById('resume-file').files[0];

  if (!jdFile) {
    alert('Please upload the job description PDF');
    return;
  }

  if (!resumeFile) {
    alert('Please upload your resume PDF');
    return;
  }

  // Check API key
  chrome.storage.local.get(['anthropicApiKey'], async (result) => {
    if (!result.anthropicApiKey) {
      document.getElementById('api-warning').style.display = 'block';
      alert('Please set your Anthropic API key in Settings first');
      return;
    }

    try {
      document.getElementById('loading').style.display = 'block';
      document.getElementById('results').style.display = 'none';
      document.getElementById('analyze-btn').disabled = true;

      // Read both PDF files as base64
      const jdBase64 = await fileToBase64(jdFile);
      const resumeBase64 = await fileToBase64(resumeFile);

      // Analyze match with both PDFs
      const analysis = await analyzeMatch(jdBase64, resumeBase64, result.anthropicApiKey);

      // Display results
      displayResults(analysis);

    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    } finally {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('analyze-btn').disabled = false;
    }
  });
});

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function fetchJobDescription(url, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `Please visit this URL and extract the complete job description: ${url}

Return ONLY the job description text including:
- Job title
- Responsibilities
- Required qualifications
- Preferred qualifications
- Any other relevant details

Do not include any commentary, just the extracted job description.`
      }]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch job description');
  }

  const data = await response.json();
  const jobDescription = data.content
    .filter(item => item.type === 'text')
    .map(item => item.text)
    .join('\n');

  if (!jobDescription || jobDescription.length < 100) {
    throw new Error('Could not extract job description from URL. Please try a different URL or paste the JD directly.');
  }

  return jobDescription;
}

async function analyzeMatch(jdBase64, resumeBase64, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: jdBase64
            }
          },
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: resumeBase64
            }
          },
          {
            type: 'text',
            text: `You are an expert resume optimizer and career counselor. I've uploaded two PDFs:
1. Job Description PDF
2. Resume PDF

Analyze the match between the resume and job description.

Provide your analysis in PURE JSON format (no markdown, no backticks, no preamble):
{
  "matchScore": <number 0-100>,
  "summary": "<brief summary of match quality>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
  "optimizedBullets": [
    {
      "original": "<original bullet point from resume>",
      "optimized": "<improved version tailored to JD>",
      "reason": "<why this change helps>"
    }
  ],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"]
}

Requirements:
- matchScore: 0-100 based on skills, experience, qualifications alignment
- Include 5-8 optimizedBullets that are most impactful to improve
- Make optimized bullets achievement-focused with metrics when possible
- Use keywords from job description naturally
- Provide actionable recommendations`
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to analyze resume');
  }

  const data = await response.json();
  const analysisText = data.content
    .filter(item => item.type === 'text')
    .map(item => item.text)
    .join('\n')
    .trim();

  // Extract JSON from response
  const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Invalid response format from AI');
  }

  return JSON.parse(jsonMatch[0]);
}

function displayResults(analysis) {
  const resultsDiv = document.getElementById('results');
  
  const scoreColor = analysis.matchScore >= 75 ? '#059669' : 
                     analysis.matchScore >= 50 ? '#d97706' : '#dc2626';

  let html = `
    <div class="score-card" style="background: linear-gradient(135deg, ${scoreColor}, ${scoreColor}dd);">
      <div>Match Score</div>
      <div class="score-value">${analysis.matchScore}%</div>
      <div style="font-size: 14px; opacity: 0.95;">${analysis.summary}</div>
    </div>

    <div class="section">
      <div class="section-title">✅ Strengths</div>
      ${analysis.strengths.map(s => `<div class="list-item">${s}</div>`).join('')}
    </div>

    <div class="section">
      <div class="section-title">⚠️ Gaps to Address</div>
      ${analysis.gaps.map(g => `<div class="list-item">${g}</div>`).join('')}
    </div>
  `;

  if (analysis.matchScore >= 40 && analysis.optimizedBullets.length > 0) {
    html += `
      <div class="section">
        <div class="section-title">✨ Optimized Resume Points</div>
        ${analysis.optimizedBullets.map(bullet => `
          <div class="bullet-optimization">
            <div class="bullet-label" style="color: #6b7280;">Original:</div>
            <div class="bullet-original">${bullet.original}</div>
            
            <div class="bullet-label" style="color: #059669;">Optimized:</div>
            <div class="bullet-optimized">${bullet.optimized}</div>
            
            <div class="bullet-reason">💡 ${bullet.reason}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  html += `
    <div class="section">
      <div class="section-title">📋 Recommendations</div>
      ${analysis.recommendations.map((rec, idx) => `
        <div class="list-item">
          <strong>${idx + 1}.</strong> ${rec}
        </div>
      `).join('')}
    </div>
  `;

  resultsDiv.innerHTML = html;
  resultsDiv.style.display = 'block';
}