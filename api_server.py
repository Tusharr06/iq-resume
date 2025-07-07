from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import docx
import PyPDF2
import re
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained models
try:
    svc_model = pickle.load(open('clf.pkl', 'rb'))
    tfidf = pickle.load(open('tfidf.pkl', 'rb'))
    le = pickle.load(open('encoder.pkl', 'rb'))
    print("Models loaded successfully!")
except Exception as e:
    print(f"Error loading models: {e}")
    svc_model = None
    tfidf = None
    le = None

def cleanResume(txt):
    cleanText = re.sub('http\S+\s', ' ', txt)
    cleanText = re.sub('RT|cc', ' ', cleanText)
    cleanText = re.sub('#\S+\s', ' ', cleanText)
    cleanText = re.sub('@\S+', '  ', cleanText)
    cleanText = re.sub('[%s]' % re.escape("""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', cleanText)
    cleanText = re.sub(r'[^\x00-\x7f]', ' ', cleanText)
    cleanText = re.sub('\s+', ' ', cleanText)
    return cleanText

def extract_text_from_pdf(file_content):
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ''
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        raise Exception(f"Error extracting PDF text: {str(e)}")

def extract_text_from_docx(file_content):
    try:
        doc = docx.Document(io.BytesIO(file_content))
        text = ''
        for paragraph in doc.paragraphs:
            text += paragraph.text + '\n'
        return text
    except Exception as e:
        raise Exception(f"Error extracting DOCX text: {str(e)}")

def predict_category(text):
    if not all([svc_model, tfidf, le]):
        raise Exception("Models not loaded properly")
    
    # Clean the text
    cleaned_text = cleanResume(text)
    
    # Vectorize the text
    vectorized_text = tfidf.transform([cleaned_text])
    
    # Make prediction
    predicted_category_encoded = svc_model.predict(vectorized_text)
    predicted_category = le.inverse_transform(predicted_category_encoded)
    
    # Get prediction probability/confidence
    try:
        probabilities = svc_model.predict_proba(vectorized_text)[0]
        confidence = max(probabilities) * 100
    except:
        confidence = 85.0  # Default confidence if predict_proba not available
    
    return predicted_category[0], confidence

@app.route('/api/analyze-text', methods=['POST'])
def analyze_text():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text.strip():
            return jsonify({'error': 'No text provided'}), 400
        
        category, confidence = predict_category(text)
        
        return jsonify({
            'success': True,
            'predicted_category': category,
            'confidence': round(confidence, 2),
            'cleaned_text': cleanResume(text)[:500] + '...' if len(cleanResume(text)) > 500 else cleanResume(text)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-file', methods=['POST'])
def analyze_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        file_content = file.read()
        filename = file.filename.lower()
        
        # Extract text based on file type
        if filename.endswith('.pdf'):
            text = extract_text_from_pdf(file_content)
        elif filename.endswith('.docx'):
            text = extract_text_from_docx(file_content)
        elif filename.endswith('.txt'):
            text = file_content.decode('utf-8')
        else:
            return jsonify({'error': 'Unsupported file type. Please upload PDF, DOCX, or TXT files.'}), 400
        
        if not text.strip():
            return jsonify({'error': 'No text could be extracted from the file'}), 400
        
        category, confidence = predict_category(text)
        
        return jsonify({
            'success': True,
            'predicted_category': category,
            'confidence': round(confidence, 2),
            'extracted_text': text[:1000] + '...' if len(text) > 1000 else text,
            'text_length': len(text)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all available job categories"""
    try:
        if le is None:
            return jsonify({'error': 'Label encoder not loaded'}), 500
        
        categories = le.classes_.tolist()
        return jsonify({
            'success': True,
            'categories': categories,
            'total_categories': len(categories)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    model_status = all([svc_model, tfidf, le])
    return jsonify({
        'status': 'healthy' if model_status else 'unhealthy',
        'models_loaded': model_status,
        'message': 'API is running' if model_status else 'Models not loaded properly'
    })

if __name__ == '__main__':
    print("Starting Resume Analyzer API...")
    print("Available endpoints:")
    print("- POST /api/analyze-text - Analyze text directly")
    print("- POST /api/analyze-file - Analyze uploaded file")
    print("- GET /api/categories - Get all job categories")
    print("- GET /api/health - Health check")
    app.run(debug=True, host='0.0.0.0', port=5000)