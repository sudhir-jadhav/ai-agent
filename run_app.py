#!/usr/bin/env python3
"""
Japanese Learning App - Streamlit Launcher
Simple script to run the Streamlit application with error handling
"""

import subprocess
import sys
import os

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    return True

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import streamlit
        import pandas
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please install dependencies with: pip install -r requirements.txt")
        return False

def install_dependencies():
    """Install required dependencies"""
    print("📦 Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies")
        return False

def run_streamlit():
    """Run the Streamlit application"""
    print("🚀 Starting Japanese Learning App...")
    print("🌐 The app will open in your browser at: http://localhost:8501")
    print("⏹️  Press Ctrl+C to stop the application")
    print("-" * 50)
    
    try:
        subprocess.run([sys.executable, "-m", "streamlit", "run", "app.py"], check=True)
    except subprocess.CalledProcessError:
        print("❌ Failed to start Streamlit")
        return False
    except KeyboardInterrupt:
        print("\n👋 Application stopped by user")
        return True
    return True

def main():
    """Main launcher function"""
    print("🇯🇵 Japanese Learning App - Streamlit Launcher")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check if app.py exists
    if not os.path.exists("app.py"):
        print("❌ Error: app.py not found in current directory")
        print("Please run this script from the project directory")
        sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        print("\n🔧 Would you like to install dependencies automatically? (y/n): ", end="")
        response = input().lower().strip()
        if response in ['y', 'yes']:
            if not install_dependencies():
                sys.exit(1)
        else:
            print("Please install dependencies manually and try again")
            sys.exit(1)
    
    # Run the application
    if not run_streamlit():
        sys.exit(1)

if __name__ == "__main__":
    main()
