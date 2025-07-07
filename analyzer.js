// Resume categories for prediction simulation
const RESUME_CATEGORIES = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'Marketing Specialist',
    'Sales Representative',
    'Business Analyst',
    'UX/UI Designer',
    'Project Manager',
    'Financial Analyst',
    'Human Resources',
    'Operations Manager',
    'Content Writer',
    'Digital Marketing',
    'Customer Service',
    'Quality Assurance',
    'DevOps Engineer',
    'Research Scientist',
    'Consultant',
    'Account Manager',
    'Administrative Assistant'
];

// Keywords for different job categories
const CATEGORY_KEYWORDS = {
    'Software Engineer': ['javascript', 'python', 'java', 'react', 'node', 'programming', 'development', 'coding', 'software', 'algorithm', 'database', 'api', 'frontend', 'backend', 'fullstack'],
    'Data Scientist': ['python', 'r', 'machine learning', 'data analysis', 'statistics', 'sql', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'data mining', 'visualization', 'modeling'],
    'Product Manager': ['product management', 'roadmap', 'strategy', 'agile', 'scrum', 'stakeholder', 'requirements', 'user stories', 'market research', 'analytics'],
    'Marketing Specialist': ['marketing', 'campaigns', 'social media', 'content marketing', 'seo', 'sem', 'brand', 'advertising', 'promotion', 'market analysis'],
    'Sales Representative': ['sales', 'revenue', 'targets', 'crm', 'lead generation', 'negotiation', 'client relations', 'prospecting', 'closing deals'],
    'Business Analyst': ['business analysis', 'requirements', 'process improvement', 'stakeholder', 'documentation', 'workflow', 'business intelligence', 'reporting'],
    'UX/UI Designer': ['ux', 'ui', 'design', 'figma', 'sketch', 'adobe', 'user experience', 'user interface', 'wireframes', 'prototyping', 'usability'],
    'Project Manager': ['project management', 'pmp', 'agile', 'scrum', 'planning', 'coordination', 'timeline', 'budget', 'risk management', 'stakeholder'],
    'Financial Analyst': ['financial analysis', 'excel', 'modeling', 'forecasting', 'budgeting', 'accounting', 'finance', 'investment', 'valuation'],
    'Human Resources': ['hr', 'recruitment', 'hiring', 'employee relations', 'benefits', 'compensation', 'training', 'performance management'],
    'Operations Manager': ['operations', 'process improvement', 'supply chain', 'logistics', 'efficiency', 'quality control', 'management'],
    'Content Writer': ['writing', 'content creation', 'copywriting', 'editing', 'blogging', 'seo writing', 'content strategy', 'journalism'],
    'Digital Marketing': ['digital marketing', 'google ads', 'facebook ads', 'social media marketing', 'email marketing', 'content marketing', 'analytics'],
    'Customer Service': ['customer service', 'support', 'help desk', 'customer satisfaction', 'communication', 'problem solving', 'call center'],
    'Quality Assurance': ['qa', 'testing', 'quality assurance', 'test cases', 'bug tracking', 'automation testing', 'manual testing', 'selenium'],
    'DevOps Engineer': ['devops', 'aws', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'terraform', 'cloud', 'infrastructure', 'automation'],
    'Research Scientist': ['research', 'phd', 'publications', 'experiments', 'analysis', 'methodology', 'scientific', 'laboratory'],
    'Consultant': ['consulting', 'advisory', 'strategy', 'analysis', 'recommendations', 'client engagement', 'problem solving'],
    'Account Manager': ['account management', 'client relations', 'relationship building', 'retention', 'upselling', 'customer success'],
    'Administrative Assistant': ['administrative', 'office management', 'scheduling', 'coordination', 'data entry', 'customer service', 'organization']
};

class ResumeAnalyzer {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.currentText = '';
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
        
        try {
            let text = '';
            
            if (fileExtension === 'txt') {
                text = await this.extractTextFromTxt(file);
            } else if (fileExtension === 'pdf') {
                text = await this.extractTextFromPdf(file);
            } else if (fileExtension === 'docx') {
                text = await this.extractTextFromDocx(file);
            } else {
                throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
            }
            
            this.currentText = text;
            this.showProcessing();
            
            // Simulate processing time
            setTimeout(() => {
                this.analyzeResumeContent(text);
            }, 2000);
            
        } catch (error) {
            alert(`Error processing file: ${error.message}`);
        }
    }

    async extractTextFromTxt(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read text file'));
            reader.readAsText(file);
        });
    }

    async extractTextFromPdf(file) {
        // For demo purposes, we'll simulate PDF text extraction
        // In a real implementation, you'd use a library like PDF.js
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`[PDF Content Extracted from ${file.name}]\n\nThis is a simulated extraction of PDF content. In a real implementation, this would contain the actual text from your PDF resume including your experience, skills, education, and other relevant information.`);
            }, 1000);
        });
    }

    async extractTextFromDocx(file) {
        // For demo purposes, we'll simulate DOCX text extraction
        // In a real implementation, you'd use a library like mammoth.js
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`[DOCX Content Extracted from ${file.name}]\n\nThis is a simulated extraction of DOCX content. In a real implementation, this would contain the actual text from your Word document resume including your professional summary, work experience, technical skills, and educational background.`);
            }, 1000);
        });
    }

    analyzeText() {
        const text = this.resumeText.value.trim();
        
        if (!text) {
            alert('Please enter your resume text before analyzing.');
            return;
        }
        
        this.currentText = text;
        this.showProcessing();
        
        // Simulate processing time
        setTimeout(() => {
            this.analyzeResumeContent(text);
        }, 2000);
    }

    analyzeResumeContent(text) {
        const cleanedText = this.cleanResumeText(text);
        const predictedCategory = this.predictCategory(cleanedText);
        
        this.showResults(cleanedText, predictedCategory);
    }

    cleanResumeText(text) {
        // Simulate the cleaning process from the original Python code
        let cleanText = text.toLowerCase();
        
        // Remove URLs
        cleanText = cleanText.replace(/http\S+\s/g, ' ');
        
        // Remove special characters and extra spaces
        cleanText = cleanText.replace(/[^\w\s]/g, ' ');
        cleanText = cleanText.replace(/\s+/g, ' ');
        
        return cleanText.trim();
    }

    predictCategory(text) {
        // Simple keyword-based prediction simulation
        const scores = {};
        
        // Initialize scores
        Object.keys(CATEGORY_KEYWORDS).forEach(category => {
            scores[category] = 0;
        });
        
        // Count keyword matches
        Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
            keywords.forEach(keyword => {
                const regex = new RegExp(keyword, 'gi');
                const matches = text.match(regex);
                if (matches) {
                    scores[category] += matches.length;
                }
            });
        });
        
        // Find category with highest score
        let maxScore = 0;
        let predictedCategory = 'Software Engineer'; // default
        
        Object.entries(scores).forEach(([category, score]) => {
            if (score > maxScore) {
                maxScore = score;
                predictedCategory = category;
            }
        });
        
        // If no keywords matched, return a random category for demo
        if (maxScore === 0) {
            predictedCategory = RESUME_CATEGORIES[Math.floor(Math.random() * RESUME_CATEGORIES.length)];
        }
        
        return predictedCategory;
    }

    showProcessing() {
        this.featuresShowcase.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.processingSection.style.display = 'block';
    }

    showResults(text, category) {
        this.processingSection.style.display = 'none';
        this.featuresShowcase.style.display = 'none';
        
        // Update extracted text
        this.extractedText.textContent = this.currentText;
        
        // Update category
        this.categoryName.textContent = category;
        
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
        const results = {
            timestamp: new Date().toISOString(),
            predictedCategory: this.categoryName.textContent,
            extractedText: this.currentText.substring(0, 500) + '...' // Truncate for demo
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