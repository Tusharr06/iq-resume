# 🎯 IQ Resume

<div align="center">
  <img src="https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge&logo=brain&logoColor=white" alt="AI Powered">
  <img src="https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white" alt="Streamlit">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Machine%20Learning-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="ML">
</div>

<div align="center">
  <h3>🚀 Intelligent Resume Analysis & Job Category Prediction</h3>
  <p><em>Discover your resume's job category with advanced AI technology</em></p>
  
  <a href="https://iqresume.streamlit.app/" target="_blank">
    <img src="https://img.shields.io/badge/🌐%20Live%20Demo-Try%20Now-success?style=for-the-badge" alt="Live Demo">
  </a>
</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🤖 **AI-Powered Analysis**
- Advanced machine learning algorithms
- Support Vector Classifier (SVC) model
- TF-IDF vectorization for text processing
- High accuracy job category prediction

### 📁 **Multi-Format Support**
- **PDF** documents
- **DOCX** Word files  
- **TXT** plain text files
- **Direct text input** for instant analysis

</td>
<td width="50%">

### ⚡ **Instant Results**
- Real-time processing
- Immediate category prediction
- Clean, professional interface
- Mobile-responsive design

### 🎨 **Beautiful UI**
- Modern gradient designs
- Intuitive user experience
- Interactive elements
- Professional styling

</td>
</tr>
</table>

---

## 🚀 Quick Start

### 🌐 **Try it Online**
Visit the live application: **[iqresume.streamlit.app](https://iqresume.streamlit.app/)**

### 💻 **Local Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tusharr06/iq-resume.git
   cd iq-resume
   ```

2. **Install dependencies**
   ```bash
   pip install streamlit scikit-learn python-docx PyPDF2
   ```

3. **Run the application**
   ```bash
   streamlit run app.py
   ```

4. **Open in browser**
   ```
   http://localhost:8501
   ```

---

## 🎯 How to Use

<div align="center">
  <table>
    <tr>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/1-Upload-blue?style=for-the-badge&logo=upload&logoColor=white"><br>
        <strong>Choose Input Method</strong><br>
        <em>File upload or direct text</em>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/2-Process-green?style=for-the-badge&logo=cog&logoColor=white"><br>
        <strong>AI Analysis</strong><br>
        <em>Advanced ML processing</em>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/3-Predict-orange?style=for-the-badge&logo=target&logoColor=white"><br>
        <strong>Get Category</strong><br>
        <em>Instant job classification</em>
      </td>
      <td align="center" width="25%">
        <img src="https://img.shields.io/badge/4-Review-purple?style=for-the-badge&logo=eye&logoColor=white"><br>
        <strong>View Results</strong><br>
        <em>Detailed insights</em>
      </td>
    </tr>
  </table>
</div>

---

## 🛠️ Technology Stack

<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <img src="https://img.shields.io/badge/Frontend-Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white"><br>
        <strong>Interactive Web Interface</strong>
      </td>
      <td align="center" width="33%">
        <img src="https://img.shields.io/badge/ML-Scikit%20Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white"><br>
        <strong>Machine Learning Models</strong>
      </td>
      <td align="center" width="33%">
        <img src="https://img.shields.io/badge/Backend-Python-3776AB?style=for-the-badge&logo=python&logoColor=white"><br>
        <strong>Core Processing Logic</strong>
      </td>
    </tr>
  </table>
</div>

### 📚 **Dependencies**
```python
streamlit          # Web application framework
scikit-learn      # Machine learning library
python-docx       # Word document processing
PyPDF2            # PDF text extraction
pickle            # Model serialization
re                # Text preprocessing
```

---

## 🏗️ Project Structure

```
iq-resume/
├── 📄 app.py                 # Main Streamlit application
├── 🤖 clf.pkl               # Trained SVC model
├── 📊 tfidf.pkl             # TF-IDF vectorizer
├── 🏷️ encoder.pkl           # Label encoder
├── 📖 README.md             # Project documentation
└── 📋 requirements.txt      # Python dependencies
```

---

## 🔧 Core Features

### 📝 **Text Processing Pipeline**
- **Cleaning**: Remove URLs, special characters, and noise
- **Normalization**: Standardize text format
- **Vectorization**: Convert text to numerical features using TF-IDF
- **Prediction**: Classify using trained SVC model

### 🎨 **User Interface**
- **Responsive Design**: Works on all devices
- **Gradient Styling**: Modern visual appeal
- **Interactive Elements**: Smooth user experience
- **Real-time Feedback**: Instant processing status

### 🚀 **Performance**
- **Fast Processing**: Optimized algorithms
- **Memory Efficient**: Lightweight model loading
- **Error Handling**: Robust file processing
- **Cross-platform**: Works on any system

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **🍴 Fork the repository**
2. **🌟 Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **💾 Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **📤 Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **🔄 Open a Pull Request**

---

## 📊 Model Performance

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>Algorithm</strong></td>
      <td align="center"><strong>Accuracy</strong></td>
      <td align="center"><strong>Processing Speed</strong></td>
      <td align="center"><strong>Model Size</strong></td>
    </tr>
    <tr>
      <td align="center">Support Vector Classifier</td>
      <td align="center">🎯 High Accuracy</td>
      <td align="center">⚡ Fast</td>
      <td align="center">💾 Lightweight</td>
    </tr>
  </table>
</div>

<div align="center">
  <h3>🚀 Ready to analyze your resume?</h3>
  <p>
    <a href="https://iqresume.streamlit.app/" target="_blank">
      <img src="https://img.shields.io/badge/🌐%20Try%20IQ%20Resume%20Now-success?style=for-the-badge&logo=streamlit&logoColor=white" alt="Try Now">
    </a>
  </p>
  
  <p><em>Built with ❤️ using Python & Streamlit</em></p>
  
  <p>
    <a href="https://github.com/yourusername/iq-resume/stargazers">
      <img src="https://img.shields.io/github/stars/yourusername/iq-resume?style=social" alt="GitHub Stars">
    </a>
    <a href="https://github.com/yourusername/iq-resume/network/members">
      <img src="https://img.shields.io/github/forks/yourusername/iq-resume?style=social" alt="GitHub Forks">
    </a>
  </p>
</div>
