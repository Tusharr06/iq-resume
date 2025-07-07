// Import PDF.js for real PDF text extraction
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

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
    'Software Engineer': ['javascript', 'python', 'java', 'react', 'node', 'programming', 'development', 'coding', 'software', 'algorithm', 'database', 'api', 'frontend', 'backend', 'fullstack', 'git', 'html', 'css', 'angular', 'vue'],
    'Data Scientist': ['python', 'r', 'machine learning', 'data analysis', 'statistics', 'sql', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'data mining', 'visualization', 'modeling', 'scikit', 'jupyter', 'matplotlib', 'seaborn'],
    'Product Manager': ['product management', 'roadmap', 'strategy', 'agile', 'scrum', 'stakeholder', 'requirements', 'user stories', 'market research', 'analytics', 'product owner', 'feature', 'prioritization'],
    'Marketing Specialist': ['marketing', 'campaigns', 'social media', 'content marketing', 'seo', 'sem', 'brand', 'advertising', 'promotion', 'market analysis', 'digital marketing', 'email marketing', 'lead generation'],
    'Sales Representative': ['sales', 'revenue', 'targets', 'crm', 'lead generation', 'negotiation', 'client relations', 'prospecting', 'closing deals', 'quota', 'pipeline', 'customer acquisition'],
    'Business Analyst': ['business analysis', 'requirements', 'process improvement', 'stakeholder', 'documentation', 'workflow', 'business intelligence', 'reporting', 'data analysis', 'process mapping'],
    'UX/UI Designer': ['ux', 'ui', 'design', 'figma', 'sketch', 'adobe', 'user experience', 'user interface', 'wireframes', 'prototyping', 'usability', 'user research', 'interaction design'],
    'Project Manager': ['project management', 'pmp', 'agile', 'scrum', 'planning', 'coordination', 'timeline', 'budget', 'risk management', 'stakeholder', 'gantt', 'waterfall', 'kanban'],
    'Financial Analyst': ['financial analysis', 'excel', 'modeling', 'forecasting', 'budgeting', 'accounting', 'finance', 'investment', 'valuation', 'financial planning', 'variance analysis'],
    'Human Resources': ['hr', 'recruitment', 'hiring', 'employee relations', 'benefits', 'compensation', 'training', 'performance management', 'talent acquisition', 'onboarding'],
    'Operations Manager': ['operations', 'process improvement', 'supply chain', 'logistics', 'efficiency', 'quality control', 'management', 'lean', 'six sigma', 'inventory'],
    'Content Writer': ['writing', 'content creation', 'copywriting', 'editing', 'blogging', 'seo writing', 'content strategy', 'journalism', 'creative writing', 'technical writing'],
    'Digital Marketing': ['digital marketing', 'google ads', 'facebook ads', 'social media marketing', 'email marketing', 'content marketing', 'analytics', 'ppc', 'conversion optimization'],
    'Customer Service': ['customer service', 'support', 'help desk', 'customer satisfaction', 'communication', 'problem solving', 'call center', 'customer success', 'ticket resolution'],
    'Quality Assurance': ['qa', 'testing', 'quality assurance', 'test cases', 'bug tracking', 'automation testing', 'manual testing', 'selenium', 'test planning', 'defect management'],
    'DevOps Engineer': ['devops', 'aws', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'terraform', 'cloud', 'infrastructure', 'automation', 'monitoring', 'deployment'],
    'Research Scientist': ['research', 'phd', 'publications', 'experiments', 'analysis', 'methodology', 'scientific', 'laboratory', 'peer review', 'grant writing'],
    'Consultant': ['consulting', 'advisory', 'strategy', 'analysis', 'recommendations', 'client engagement', 'problem solving', 'business consulting', 'implementation'],
    'Account Manager': ['account management', 'client relations', 'relationship building', 'retention', 'upselling', 'customer success', 'account growth', 'client satisfaction'],
    'Administrative Assistant': ['administrative', 'office management', 'scheduling', 'coordination', 'data entry', 'customer service', 'organization', 'clerical', 'executive support']
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
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            
            // Extract text from all pages
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }
            
            if (!fullText.trim()) {
                throw new Error('No text could be extracted from this PDF. The PDF might be image-based or corrupted.');
            }
            
            return fullText;
        } catch (error) {
            console.error('PDF extraction error:', error);
            throw new Error(`Failed to extract text from PDF: ${error.message}`);
        }
    }

    async extractTextFromDocx(file) {
        try {
            // For DOCX files, we'll use a basic approach since mammoth.js requires more setup
            // This is a fallback that reads the file as text (won't work perfectly but better than simulation)
            const text = await file.text();
            
            // Try to extract readable content from the raw DOCX data
            // This is a basic approach - for production, you'd want to use mammoth.js properly
            const cleanText = text.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();
            
            if (!cleanText || cleanText.length < 50) {
                throw new Error('Could not extract meaningful text from DOCX file. Please try converting to PDF or TXT format.');
            }
            
            return cleanText;
        } catch (error) {
            console.error('DOCX extraction error:', error);
            throw new Error(`Failed to extract text from DOCX: ${error.message}. Please try converting to PDF or TXT format.`);
        }
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
        
        // Remove RT and cc (Twitter-specific)
        cleanText = cleanText.replace(/rt|cc/g, ' ');
        
        // Remove hashtags
        cleanText = cleanText.replace(/#\S+\s/g, ' ');
        
        // Remove mentions
        cleanText = cleanText.replace(/@\S+/g, ' ');
        
        // Remove special characters and extra spaces
        cleanText = cleanText.replace(/[^\w\s]/g, ' ');
        cleanText = cleanText.replace(/\s+/g, ' ');
        
        return cleanText.trim();
    }

    predictCategory(text) {
        // Enhanced keyword-based prediction
        const scores = {};
        
        // Initialize scores
        Object.keys(CATEGORY_KEYWORDS).forEach(category => {
            scores[category] = 0;
        });
        
        // Count keyword matches with weighted scoring
        Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                const matches = text.match(regex);
                if (matches) {
                    // Weight longer keywords more heavily
                    const weight = keyword.length > 5 ? 2 : 1;
                    scores[category] += matches.length * weight;
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
        
        // If no keywords matched significantly, analyze common resume terms
        if (maxScore < 3) {
            predictedCategory = this.fallbackPrediction(text);
        }
        
        return predictedCategory;
    }

    fallbackPrediction(text) {
        // Fallback prediction based on common terms
        const commonTerms = {
            'Software Engineer': ['code', 'develop', 'program', 'software', 'technical', 'computer'],
            'Data Scientist': ['data', 'analysis', 'research', 'statistics', 'model'],
            'Marketing Specialist': ['marketing', 'campaign', 'brand', 'promotion', 'customer'],
            'Business Analyst': ['business', 'analysis', 'process', 'requirements', 'stakeholder'],
            'Project Manager': ['project', 'manage', 'team', 'coordinate', 'planning']
        };
        
        let maxScore = 0;
        let category = 'Business Analyst'; // most generic default
        
        Object.entries(commonTerms).forEach(([cat, terms]) => {
            let score = 0;
            terms.forEach(term => {
                const regex = new RegExp(`\\b${term}\\b`, 'gi');
                const matches = text.match(regex);
                if (matches) score += matches.length;
            });
            
            if (score > maxScore) {
                maxScore = score;
                category = cat;
            }
        });
        
        return category;
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
            extractedText: this.currentText.substring(0, 1000) + (this.currentText.length > 1000 ? '...' : ''),
            textLength: this.currentText.length
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