@echo off
echo 🇯🇵 Japanese Learning App - Streamlit Launcher
echo ================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://python.org
    pause
    exit /b 1
)

REM Check if app.py exists
if not exist "app.py" (
    echo ❌ Error: app.py not found in current directory
    echo Please run this script from the project directory
    pause
    exit /b 1
)

REM Check if requirements are installed
echo 📦 Checking dependencies...
python -c "import streamlit, pandas" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Dependencies not found. Installing...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
)

echo.
echo 🚀 Starting Japanese Learning App...
echo 🌐 The app will open in your browser at: http://localhost:8501
echo ⏹️  Press Ctrl+C to stop the application
echo.

REM Run the Streamlit application
streamlit run app.py

echo.
echo 👋 Application stopped
pause
