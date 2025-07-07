// Resume categories matching your trained model (will be fetched from API)
let RESUME_CATEGORIES = [];

// API configuration
const API_BASE_URL = 'http://localhost:5000/api';

class ResumeAnalyzer {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.currentText = '';
        this.loadCategories();
    }

    async loadCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            const data = await response.json();
            if (data.success) {
                RESUME_CATEGORIES = data.categories;
                console.log('Loaded categories:', RESUME_CATEGORIES);
            }
        } catch (error) {
            console.warn('Could not load categories from API, using fallback');
            // Fallback categories based on your model
            RESUME_CATEGORIES = [
                'Advocate', 'Arts', 'Automation Testing', 'Blockchain', 'Business Analyst',
                'Civil Engineer', 'Data Science', 'Database', 'DevOps Engineer', 'DotNet Developer',
                'ETL Developer', 'Electrical Engineering', 'HR', 'Hadoop', 'Health and fitness',
                'Java Developer', 'Mechanical Engineer', 'Network Security Engineer', 'Operations Manager',
                'PMO', 'Python Developer', 'SAP Developer', 'Sales', 'Testing', 'Web Designing'
            ];
        }
    }

    initializeElements() {
        // Method buttons
        this.uploadMethodBtn = document.querySelector('[data-method="upload"]');
        this.textMethodBtn = document.querySelector('[data-method="text"]');
        
        // Input areas
        this.uploadArea = document.getElementById('uploadArea');
        this.textInputArea = document.getElementById('textInputArea');
        this.fileInput = document.getElementById('fileInput');
        this.resumeText = document.getElementById('resumeText');
        
        // Buttons
        this.analyzeTextBtn = document.getElementById('analyzeTextBtn');
        this.togglePreview = document.getElementById('togglePreview');
        this.analyzeAnotherBtn = document.getElementById('analyzeAnotherBtn');
        this.downloadResultBtn = document.getElementById('downloadResultBtn');
        
        // Sections
        this.processingSection = document.getElementById('processingSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.featuresShowcase = document.getElementById('featuresShowcase');
        
        // Result elements
        this.previewContent = document.getElementById('previewContent');
        this.extractedText = document.getElementById('extractedText');
        this.categoryName = document.getElementById('categoryName');
    }

    setupEventListeners() {
        // Method selection
        this.uploadMethodBtn.addEventListener('click', () => this.switchMethod('upload'));
        this.textMethodBtn.addEventListener('click', () => this.switchMethod('text'));
        
        // File upload
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        // Text analysis
        this.analyzeTextBtn.addEventListener('click', () => this.analyzeText());
        
        // Preview toggle
        this.togglePreview.addEventListener('click', () => this.togglePreviewContent());
        
        // Action buttons
        this.analyzeAnotherBtn.addEventListener('click', () => this.resetAnalyzer());
        this.downloadResultBtn.addEventListener('click', () => this.downloadResults());
    }

    switchMethod(method) {
        if (method === 'upload') {
            this.uploadMethodBtn.classList.add('active');
            this.textMethodBtn.classList.remove('active');
            this.uploadArea.style.display = 'block';
            this.textInputArea.style.display = 'none';
        } else {
            this.textMethodBtn.classList.add('active');
            this.uploadMethodBtn.classList.remove('active');
            this.uploadArea.style.display = 'none';
            this.textInputArea.style.display = 'block';
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    async processFile(file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (!['pdf', 'docx', 'txt'].includes(fileExtension)) {
            alert('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
            return;
        }
        
        this.showProcessing();
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch(`${API_BASE_URL}/analyze-file`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentText = result.extracted_text;
                this.showResults(result.extracted_text, result.predicted_category, result.confidence);
            } else {
                throw new Error(result.error || 'Failed to analyze file');
            }
            
        } catch (error) {
            console.error('File processing error:', error);
            this.hideProcessing();
            
            if (error.message.includes('fetch')) {
                alert('Could not connect to the analysis server. Please make sure the Python API server is running on localhost:5000');
            } else {
                alert(`Error processing file: ${error.message}`);
            }
        }
    }

    async analyzeText() {
        const text = this.resumeText.value.trim();
        
        if (!text) {
            alert('Please enter your resume text before analyzing.');
            return;
        }
        
        this.showProcessing();
        
        try {
            const response = await fetch(`${API_BASE_URL}/analyze-text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentText = text;
                this.showResults(text, result.predicted_category, result.confidence);
            } else {
                throw new Error(result.error || 'Failed to analyze text');
            }
            
        } catch (error) {
            console.error('Text analysis error:', error);
            this.hideProcessing();
            
            if (error.message.includes('fetch')) {
                alert('Could not connect to the analysis server. Please make sure the Python API server is running on localhost:5000');
            } else {
                alert(`Error analyzing text: ${error.message}`);
            }
        }
    }

    showProcessing() {
        this.featuresShowcase.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.processingSection.style.display = 'block';
    }

    hideProcessing() {
        this.processingSection.style.display = 'none';
        this.featuresShowcase.style.display = 'block';
    }

    showResults(text, category, confidence) {
        this.processingSection.style.display = 'none';
        this.featuresShowcase.style.display = 'none';
        
        // Update extracted text
        this.extractedText.textContent = text;
        
        // Update category with confidence
        this.categoryName.innerHTML = `
            <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 10px;">${category}</div>
            <div style="font-size: 1.1rem; opacity: 0.9;">Confidence: ${confidence}%</div>
        `;
        
        // Show results
        this.resultsSection.style.display = 'block';
    }

    togglePreviewContent() {
        const isVisible = this.previewContent.style.display !== 'none';
        
        if (isVisible) {
            this.previewContent.style.display = 'none';
            this.togglePreview.innerHTML = '<i class="fas fa-eye"></i> Show Preview';
        } else {
            this.previewContent.style.display = 'block';
            this.togglePreview.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Preview';
        }
    }

    resetAnalyzer() {
        // Reset form
        this.fileInput.value = '';
        this.resumeText.value = '';
        this.currentText = '';
        
        // Reset UI
        this.resultsSection.style.display = 'none';
        this.processingSection.style.display = 'none';
        this.featuresShowcase.style.display = 'block';
        this.previewContent.style.display = 'none';
        this.togglePreview.innerHTML = '<i class="fas fa-eye"></i> Show Preview';
        
        // Reset to upload method
        this.switchMethod('upload');
    }

    downloadResults() {
        const categoryElement = this.categoryName;
        const categoryText = categoryElement.textContent || categoryElement.innerText;
        
        const results = {
            timestamp: new Date().toISOString(),
            predictedCategory: categoryText.split('Confidence:')[0].trim(),
            confidence: categoryText.includes('Confidence:') ? categoryText.split('Confidence:')[1].trim() : 'N/A',
            extractedText: this.currentText.substring(0, 1000) + (this.currentText.length > 1000 ? '...' : ''),
            textLength: this.currentText.length,
            modelUsed: 'SVC with TF-IDF (Python ML Model)'
        };
        
        const dataStr = JSON.stringify(results, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'resume-analysis-results.json';
        link.click();
    }
}

// Initialize the analyzer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ResumeAnalyzer();
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });
});