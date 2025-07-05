import streamlit as st
import pickle
import docx
import PyPDF2
import re

svc_model = pickle.load(open('clf.pkl', 'rb'))
tfidf = pickle.load(open('tfidf.pkl', 'rb'))
le = pickle.load(open('encoder.pkl', 'rb'))

def cleanResume(txt):
    cleanText = re.sub('http\S+\s', ' ', txt)
    cleanText = re.sub('RT|cc', ' ', cleanText)
    cleanText = re.sub('#\S+\s', ' ', cleanText)
    cleanText = re.sub('@\S+', '  ', cleanText)
    cleanText = re.sub('[%s]' % re.escape("""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', cleanText)
    cleanText = re.sub(r'[^\x00-\x7f]', ' ', cleanText)
    cleanText = re.sub('\s+', ' ', cleanText)
    return cleanText

def extract_text_from_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file)
    text = ''
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(file):
    doc = docx.Document(file)
    text = ''
    for paragraph in doc.paragraphs:
        text += paragraph.text + '\n'
    return text

def extract_text_from_txt(file):
    try:
        text = file.read().decode('utf-8')
    except UnicodeDecodeError:
        text = file.read().decode('latin-1')
    return text

def handle_file_upload(uploaded_file):
    file_extension = uploaded_file.name.split('.')[-1].lower()
    if file_extension == 'pdf':
        text = extract_text_from_pdf(uploaded_file)
    elif file_extension == 'docx':
        text = extract_text_from_docx(uploaded_file)
    elif file_extension == 'txt':
        text = extract_text_from_txt(uploaded_file)
    else:
        raise ValueError("Unsupported file type. Please upload a PDF, DOCX, or TXT file.")
    return text

def pred(input_resume):
    cleaned_text = cleanResume(input_resume)
    vectorized_text = tfidf.transform([cleaned_text])
    vectorized_text = vectorized_text.toarray()
    predicted_category = svc_model.predict(vectorized_text)
    predicted_category_name = le.inverse_transform(predicted_category)
    return predicted_category_name[0]

def main():
    st.set_page_config(
        page_title="AI Resume Analyzer",
        page_icon="🎯",
        layout="wide",
        initial_sidebar_state="collapsed"
    )
    
    st.markdown("""
    <style>
    .main-header {
        text-align: center;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }
    .sub-header {
        text-align: center;
        color: #666;
        font-size: 1.2rem;
        margin-bottom: 2rem;
    }
    .upload-section {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 2rem;
        border-radius: 15px;
        margin: 2rem 0;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    .result-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        margin: 2rem 0;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    .success-message {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        text-align: center;
        margin: 1rem 0;
    }
    .stFileUploader > div > div > div > div {
        text-align: center;
    }
    .feature-box {
        background: linear-gradient(135deg, #f8f9ff 0%, #e6f0ff 100%);
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        margin: 1rem 0;
        border-left: 4px solid #667eea;
        color: #333;
    }
    .feature-box h4 {
        color: #667eea;
        margin-bottom: 0.5rem;
    }
    .feature-box p {
        color: #666;
        margin: 0;
    }
    </style>
    """, unsafe_allow_html=True)
    
    st.markdown('<h1 class="main-header">🎯 AI Resume Analyzer</h1>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">Discover your resume\'s job category with advanced AI technology</p>', unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        st.markdown('<div class="upload-section">', unsafe_allow_html=True)
        
        input_method = st.radio(
            "Choose input method:",
            ["📤 Upload Resume File", "✍️ Enter Text Directly"],
            horizontal=True
        )
        
        uploaded_file = None
        direct_text = None
        
        if input_method == "📤 Upload Resume File":
            st.markdown("### 📤 Upload Your Resume")
            st.markdown("*Supported formats: PDF, DOCX, TXT*")
            uploaded_file = st.file_uploader(
                "",
                type=["pdf", "docx", "txt"],
                help="Upload your resume in PDF, DOCX, or TXT format"
            )
        else:
            st.markdown("### ✍️ Enter Resume Text")
            st.markdown("*Paste your resume content below*")
            direct_text = st.text_area(
                "",
                height=250,
                placeholder="Paste your resume text here...",
                help="Copy and paste your resume content directly"
            )
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    if uploaded_file is not None or (direct_text and direct_text.strip()):
        try:
            if uploaded_file is not None:
                with st.spinner('🔍 Analyzing your resume...'):
                    resume_text = handle_file_upload(uploaded_file)
            else:
                resume_text = direct_text
            
            st.markdown('<div class="success-message">✅ Resume successfully processed!</div>', unsafe_allow_html=True)
            
            col1, col2 = st.columns([1, 1])
            
            with col1:
                if st.checkbox("👁️ Preview extracted text"):
                    st.markdown("### 📄 Extracted Content")
                    st.text_area("", resume_text, height=300, disabled=True)
            
            with col2:
                st.markdown("### 🎯 Analysis Result")
                category = pred(resume_text)
                
                st.markdown(f'''
                <div class="result-section">
                    <h2>🏆 Predicted Category</h2>
                    <h1 style="margin: 1rem 0; font-size: 2.5rem;">{category}</h1>
                    <p style="font-size: 1.1rem; opacity: 0.9;">
                        Your resume best matches this job category based on our AI analysis
                    </p>
                </div>
                ''', unsafe_allow_html=True)
        
        except Exception as e:
            st.error(f"❌ Error processing file: {str(e)}")
    
    else:
        st.markdown("### ✨ Features")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.markdown('''
            <div class="feature-box">
                <h4>🤖 AI-Powered</h4>
                <p>Advanced machine learning algorithms analyze your resume content</p>
            </div>
            ''', unsafe_allow_html=True)
        
        with col2:
            st.markdown('''
            <div class="feature-box">
                <h4>✍️ Flexible Input</h4>
                <p>Upload files or paste text directly for instant analysis</p>
            </div>
            ''', unsafe_allow_html=True)
        
        with col3:
            st.markdown('''
            <div class="feature-box">
                <h4>⚡ Instant Results</h4>
                <p>Get your resume category prediction in seconds</p>
            </div>
            ''', unsafe_allow_html=True)
        
        st.markdown("---")
        st.markdown("### 🚀 How to Use")
        st.markdown("""
        1. **Choose** your preferred input method (file upload or direct text entry)
        2. **Upload** your resume file OR **paste** your resume text directly
        3. **Wait** for the AI to process and analyze your content  
        4. **View** your predicted job category and insights
        5. **Optional**: Preview the extracted/entered text
        """)

if __name__ == "__main__":
    main()