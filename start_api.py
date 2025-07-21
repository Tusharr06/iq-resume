#!/usr/bin/env python3
import os
import sys
import subprocess

def check_requirements():
    required_files = ['clf.pkl', 'tfidf.pkl', 'encoder.pkl']
    missing_files = []
    
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print("❌ Missing required model files:")
        for file in missing_files:
            print(f"   - {file}")
        print("\nPlease ensure your trained model files are in the current directory.")
        return False
    
    print("✅ All required model files found!")
    return True

def install_requirements():
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements_api.txt'])
        print("✅ Packages installed successfully!")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install packages. Please install manually:")
        print("   pip install -r requirements_api.txt")
        return False

def start_server():
    print("🚀 Starting Resume Analyzer API server...")
    print("📡 Server will be available at: http://localhost:5000")
    print("🔗 API endpoints:")
    print("   - POST /api/analyze-text")
    print("   - POST /api/analyze-file") 
    print("   - GET /api/categories")
    print("   - GET /api/health")
    print("\n" + "="*50)
    
    try:
        # Import and run the Flask app
        from api_server import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Please make sure all required packages are installed.")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == "__main__":
    print("🎯 Resume Analyzer API Setup")
    print("="*40)
    
    # Check if model files exist
    if not check_requirements():
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        sys.exit(1)
    
    # Start the server
    start_server()