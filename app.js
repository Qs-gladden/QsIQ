// Application state
let currentFile = null;
let sentimentChart = null;

// Sample data from application_data_json
const sampleData = {
    sop: "Rule 1: Greeting - Step 1: Use professional greeting within 10 seconds, Step 2: Ask customer name and how you can help. Rule 2: Problem Identification - Step 1: Listen actively to customer concern, Step 2: Ask clarifying questions, Step 3: Summarize issue back to customer. Rule 3: Solution Provision - Step 1: Offer relevant solutions, Step 2: Explain benefits clearly, Step 3: Get customer agreement. Rule 4: Closing - Step 1: Confirm customer satisfaction, Step 2: Provide next steps or follow-up, Step 3: Professional closing.",
    generalKeywords: "price, cost, billing, refund, complaint, satisfaction, issue, problem, help, support",
    productKeywords: "warranty, features, installation, compatibility, upgrade, maintenance",
    transcript: "Speaker 1: Hello, thank you for calling TechCorp support. My name is Sarah. May I have your name please?\nSpeaker 2: Hi, I'm John Davis. I'm having trouble with the software I purchased last week.\nSpeaker 1: I'm sorry to hear that, John. Can you tell me specifically what issues you're experiencing?\nSpeaker 2: The program keeps crashing when I try to export files. It's really frustrating because I need this for work.\nSpeaker 1: I understand your frustration. Let me check your account and see what we can do to resolve this quickly.\nSpeaker 2: Thank you, I appreciate that.\nSpeaker 1: I can see you purchased our Pro version. There was a known issue with that version that we've since fixed. I can send you the updated version right away.\nSpeaker 2: That would be great! How long will it take?\nSpeaker 1: I'm sending it to your email now. You should receive it within 5 minutes. Is there anything else I can help you with today?\nSpeaker 2: No, that's perfect. Thank you so much for your help!\nSpeaker 1: You're very welcome, John. Have a great day!",
    analysisResults: {
        keyTakeaways: [
            "Customer experienced software crashes affecting work productivity",
            "Agent identified known issue and provided immediate solution",
            "Positive resolution with software update provided promptly",
            "Professional interaction with appropriate follow-up",
            "Customer expressed satisfaction with service received"
        ],
        topicsCovered: [
            {"topic": "Software Issues", "speaker": "Customer", "context": "Reported program crashing during file export"},
            {"topic": "Product Support", "speaker": "Agent", "context": "Provided technical assistance and solution"},
            {"topic": "Account Verification", "speaker": "Agent", "context": "Checked customer account for purchase details"},
            {"topic": "Update Distribution", "speaker": "Agent", "context": "Sent updated software version via email"}
        ],
        customerRequests: [
            {"request": "Help with software crashing issue", "transcript": "The program keeps crashing when I try to export files", "type": "Technical Support"},
            {"request": "Quick resolution for work requirement", "transcript": "It's really frustrating because I need this for work", "type": "Urgency"}
        ],
        sentimentData: [
            {"time": 1, "sentiment": 0.2, "label": "Initial Contact"},
            {"time": 2, "sentiment": -1.5, "label": "Problem Report"},
            {"time": 3, "sentiment": -1.2, "label": "Frustration Expression"},
            {"time": 4, "sentiment": 0.1, "label": "Agent Acknowledgment"},
            {"time": 5, "sentiment": 0.8, "label": "Solution Offered"},
            {"time": 6, "sentiment": 1.2, "label": "Positive Response"},
            {"time": 7, "sentiment": 1.5, "label": "Resolution Confirmed"},
            {"time": 8, "sentiment": 1.8, "label": "Satisfaction Expressed"}
        ],
        sopCompliance: {
            completed: [
                "Rule 1, Step 1: Professional greeting provided",
                "Rule 1, Step 2: Asked customer name and offered help",
                "Rule 2, Step 1: Listened to customer concern",
                "Rule 2, Step 2: Asked for clarification on specific issue",
                "Rule 3, Step 1: Offered relevant solution (software update)",
                "Rule 4, Step 1: Confirmed customer satisfaction"
            ],
            missed: [
                "Rule 2, Step 3: Did not summarize issue back to customer",
                "Rule 3, Step 2: Could have explained solution benefits more clearly"
            ]
        },
        overallRating: 4.2,
        ratingJustification: "Strong performance with professional greeting, effective problem resolution, and customer satisfaction. Minor areas for improvement in issue summarization and solution explanation."
    }
};

// DOM elements
const fileUploadArea = document.getElementById('file-upload-area');
const fileInput = document.getElementById('transcript-file');
const fileInfo = document.getElementById('file-info');
const analysisForm = document.getElementById('analysis-form');
const loadSampleBtn = document.getElementById('load-sample-btn');
const analyzeBtn = document.getElementById('analyze-btn');
const uploadSection = document.getElementById('upload-section');
const progressSection = document.getElementById('progress-section');
const resultsSection = document.getElementById('results-section');
const downloadReportBtn = document.getElementById('download-report-btn');
const newAnalysisBtn = document.getElementById('new-analysis-btn');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeFileUpload();
    initializeFormHandlers();
    initializeButtons();
});

// File upload functionality
function initializeFileUpload() {
    fileUploadArea.addEventListener('click', () => fileInput.click());
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('dragleave', handleDragLeave);
    fileUploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);
}

function handleDragOver(e) {
    e.preventDefault();
    fileUploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    fileUploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    fileUploadArea.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    // Validate file type
    const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.txt')) {
        alert('Please upload a .txt, .docx, or .pdf file');
        return;
    }

    currentFile = file;
    showFileInfo(file);
}

function showFileInfo(file) {
    const fileSize = formatFileSize(file.size);
    fileInfo.innerHTML = `
        <div class="file-info-content">
            <div class="file-details">
                <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
            </div>
            <button type="button" class="file-remove" onclick="removeFile()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `;
    fileInfo.classList.remove('hidden');
}

function removeFile() {
    currentFile = null;
    fileInput.value = '';
    fileInfo.classList.add('hidden');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Form handlers
function initializeFormHandlers() {
    analysisForm.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    startAnalysis();
}

function validateForm() {
    const sopInput = document.getElementById('sop-input').value.trim();
    const llmProvider = document.getElementById('llm-provider').value;
    const apiKey = document.getElementById('api-key').value.trim();
    
    if (!currentFile) {
        alert('Please upload a transcript file');
        return false;
    }
    
    if (!sopInput) {
        alert('Please enter your business interaction SOP');
        return false;
    }
    
    if (!llmProvider) {
        alert('Please select an LLM provider');
        return false;
    }
    
    if (!apiKey) {
        alert('Please enter your API key');
        return false;
    }
    
    return true;
}

// Button handlers
function initializeButtons() {
    loadSampleBtn.addEventListener('click', loadSampleData);
    downloadReportBtn.addEventListener('click', downloadReport);
    newAnalysisBtn.addEventListener('click', startNewAnalysis);
}

function loadSampleData() {
    // Create a mock file for the sample transcript
    const blob = new Blob([sampleData.transcript], { type: 'text/plain' });
    const file = new File([blob], 'sample_transcript.txt', { type: 'text/plain' });
    currentFile = file;
    showFileInfo(file);
    
    // Fill form fields
    document.getElementById('sop-input').value = sampleData.sop;
    document.getElementById('general-keywords').value = sampleData.generalKeywords;
    document.getElementById('product-keywords').value = sampleData.productKeywords;
    document.getElementById('llm-provider').value = 'anthropic';
    document.getElementById('api-key').value = 'sample-api-key-for-demo';
}

// Analysis process
function startAnalysis() {
    showProgressSection();
    simulateAnalysis();
}

function showProgressSection() {
    uploadSection.style.display = 'none';
    progressSection.classList.remove('hidden');
    
    // Set button loading state
    const btnText = analyzeBtn.querySelector('.btn-text');
    const btnSpinner = analyzeBtn.querySelector('.btn-spinner');
    btnText.style.display = 'none';
    btnSpinner.classList.remove('hidden');
    analyzeBtn.disabled = true;
}

function simulateAnalysis() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    const steps = [
        { progress: 10, text: 'Parsing transcript...' },
        { progress: 25, text: 'Analyzing conversation flow...' },
        { progress: 40, text: 'Identifying topics and keywords...' },
        { progress: 60, text: 'Evaluating sentiment patterns...' },
        { progress: 75, text: 'Checking SOP compliance...' },
        { progress: 90, text: 'Generating insights...' },
        { progress: 100, text: 'Analysis complete!' }
    ];
    
    let currentStep = 0;
    
    function nextStep() {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            progressFill.style.width = step.progress + '%';
            progressText.textContent = step.text;
            currentStep++;
            
            const delay = currentStep === steps.length ? 500 : Math.random() * 1000 + 500;
            setTimeout(nextStep, delay);
        } else {
            setTimeout(showResults, 500);
        }
    }
    
    nextStep();
}

function showResults() {
    progressSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    
    displayAnalysisResults(sampleData.analysisResults);
    
    // Reset button state
    const btnText = analyzeBtn.querySelector('.btn-text');
    const btnSpinner = analyzeBtn.querySelector('.btn-spinner');
    btnText.style.display = 'inline';
    btnSpinner.classList.add('hidden');
    analyzeBtn.disabled = false;
}

function displayAnalysisResults(results) {
    displayOverallRating(results.overallRating, results.ratingJustification);
    displayKeyTakeaways(results.keyTakeaways);
    displayTopicsCovered(results.topicsCovered);
    displayCustomerRequests(results.customerRequests);
    displaySentimentChart(results.sentimentData);
    displaySOPCompliance(results.sopCompliance);
}

function displayOverallRating(rating, justification) {
    document.getElementById('overall-rating').textContent = rating.toFixed(1);
    document.getElementById('rating-justification').textContent = justification;
    
    const starsContainer = document.getElementById('rating-stars');
    starsContainer.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        star.setAttribute('class', i <= Math.round(rating) ? 'star filled' : 'star');
        star.setAttribute('viewBox', '0 0 24 24');
        star.innerHTML = '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>';
        starsContainer.appendChild(star);
    }
}

function displayKeyTakeaways(takeaways) {
    const container = document.getElementById('key-takeaways');
    container.innerHTML = '';
    
    takeaways.forEach(takeaway => {
        const li = document.createElement('li');
        li.innerHTML = `
            <svg class="takeaway-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="m21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.67 0 3.22.46 4.55 1.26"></path>
            </svg>
            <span>${takeaway}</span>
        `;
        container.appendChild(li);
    });
}

function displayTopicsCovered(topics) {
    const container = document.getElementById('topics-covered');
    container.innerHTML = '';
    
    topics.forEach(topic => {
        const div = document.createElement('div');
        div.className = 'topic-card';
        div.innerHTML = `
            <h4 class="topic-title">${topic.topic}</h4>
            <span class="topic-speaker">${topic.speaker}</span>
            <p class="topic-context">${topic.context}</p>
        `;
        container.appendChild(div);
    });
}

function displayCustomerRequests(requests) {
    const container = document.getElementById('customer-requests');
    container.innerHTML = '';
    
    requests.forEach(request => {
        const div = document.createElement('div');
        div.className = 'request-item';
        div.innerHTML = `
            <div class="request-header">
                <h4 class="request-title">${request.request}</h4>
                <span class="request-type">${request.type}</span>
            </div>
            <p class="request-transcript">"${request.transcript}"</p>
        `;
        container.appendChild(div);
    });
}

function displaySentimentChart(sentimentData) {
    const ctx = document.getElementById('sentiment-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (sentimentChart) {
        sentimentChart.destroy();
    }
    
    sentimentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sentimentData.map(d => d.label),
            datasets: [{
                label: 'Sentiment Score',
                data: sentimentData.map(d => d.sentiment),
                borderColor: '#21808d',
                backgroundColor: 'rgba(33, 128, 141, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: sentimentData.map(d => d.sentiment > 1 ? '#10b981' : d.sentiment < -1 ? '#ef4444' : '#21808d'),
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            const value = context.parsed.y;
                            const sentiment = value > 1 ? 'Very Positive' : 
                                            value > 0 ? 'Positive' : 
                                            value > -1 ? 'Negative' : 'Very Negative';
                            return `${sentiment} (${value.toFixed(1)})`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    min: -2,
                    max: 2,
                    ticks: {
                        callback: function(value) {
                            if (value === 2) return 'Very Positive';
                            if (value === 1) return 'Positive';
                            if (value === 0) return 'Neutral';
                            if (value === -1) return 'Negative';
                            if (value === -2) return 'Very Negative';
                            return '';
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function displaySOPCompliance(compliance) {
    const completedContainer = document.getElementById('completed-steps');
    const missedContainer = document.getElementById('missed-steps');
    
    completedContainer.innerHTML = '';
    missedContainer.innerHTML = '';
    
    compliance.completed.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        completedContainer.appendChild(li);
    });
    
    compliance.missed.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        missedContainer.appendChild(li);
    });
}

// Utility functions
function downloadReport() {
    const reportContent = generateReportContent();
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-analysis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateReportContent() {
    const results = sampleData.analysisResults;
    let content = `TRANSCRIPT ANALYSIS REPORT\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `${'='.repeat(50)}\n\n`;
    
    content += `OVERALL RATING: ${results.overallRating}/5.0\n`;
    content += `${results.ratingJustification}\n\n`;
    
    content += `KEY TAKEAWAYS:\n`;
    results.keyTakeaways.forEach((takeaway, i) => {
        content += `${i + 1}. ${takeaway}\n`;
    });
    content += `\n`;
    
    content += `TOPICS COVERED:\n`;
    results.topicsCovered.forEach((topic, i) => {
        content += `${i + 1}. ${topic.topic} (${topic.speaker}): ${topic.context}\n`;
    });
    content += `\n`;
    
    content += `CUSTOMER REQUESTS:\n`;
    results.customerRequests.forEach((request, i) => {
        content += `${i + 1}. ${request.request} (${request.type})\n`;
        content += `   Quote: "${request.transcript}"\n`;
    });
    content += `\n`;
    
    content += `SOP COMPLIANCE:\n`;
    content += `Completed Steps:\n`;
    results.sopCompliance.completed.forEach((step, i) => {
        content += `  ✓ ${step}\n`;
    });
    content += `\nMissed Steps:\n`;
    results.sopCompliance.missed.forEach((step, i) => {
        content += `  ✗ ${step}\n`;
    });
    
    return content;
}

function startNewAnalysis() {
    // Reset form
    analysisForm.reset();
    removeFile();
    
    // Show upload section
    uploadSection.style.display = 'block';
    resultsSection.classList.add('hidden');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}