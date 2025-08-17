// Japanese Learning App - JLPT N5
// Main JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetSection = this.getAttribute('data-section');
            document.getElementById(targetSection).classList.add('active');
        });
    });

    // Practice exercise functionality
    const optionButtons = document.querySelectorAll('.option-btn');
    
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isCorrect = this.getAttribute('data-correct') === 'true';
            const feedback = this.parentElement.nextElementSibling;
            
            // Remove previous styling
            this.parentElement.querySelectorAll('.option-btn').forEach(btn => {
                btn.classList.remove('correct', 'incorrect');
            });
            
            // Add correct styling
            if (isCorrect) {
                this.classList.add('correct');
                feedback.textContent = '✅ Correct! Well done!';
                feedback.className = 'feedback correct';
            } else {
                this.classList.add('incorrect');
                feedback.textContent = '❌ Incorrect. Try again!';
                feedback.className = 'feedback incorrect';
            }
            
            // Show feedback
            feedback.classList.remove('hidden');
            
            // Disable all options after selection
            this.parentElement.querySelectorAll('.option-btn').forEach(btn => {
                btn.disabled = true;
                btn.style.cursor = 'not-allowed';
            });
        });
    });

    // Add smooth scrolling for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add interactive features for vocabulary items
    const vocabItems = document.querySelectorAll('.vocab-item');
    
    vocabItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add a subtle highlight effect
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
            
            // Reset after animation
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            }, 200);
        });
    });

    // Add interactive features for kanji cards
    const kanjiCards = document.querySelectorAll('.kanji-card');
    
    kanjiCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add a subtle highlight effect
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 16px 48px rgba(102, 126, 234, 0.25)';
            
            // Reset after animation
            setTimeout(() => {
                this.style.transform = 'translateY(-5px) scale(1)';
                this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }, 300);
        });
    });

    // Add progress tracking (local storage)
    let progress = JSON.parse(localStorage.getItem('japaneseProgress')) || {
        grammar: 0,
        vocabulary: 0,
        kanji: 0,
        reading: 0,
        practice: 0
    };

    // Update progress when sections are viewed
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            if (progress[section] === 0) {
                progress[section] = 1;
                localStorage.setItem('japaneseProgress', JSON.stringify(progress));
                updateProgressIndicator();
            }
        });
    });

    // Create progress indicator
    function updateProgressIndicator() {
        const totalSections = Object.keys(progress).length;
        const completedSections = Object.values(progress).reduce((a, b) => a + b, 0);
        const progressPercentage = (completedSections / totalSections) * 100;
        
        // Add progress bar to header if it doesn't exist
        let progressBar = document.querySelector('.progress-bar');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.innerHTML = `
                <div class="progress-text">Progress: ${Math.round(progressPercentage)}%</div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
            `;
            document.querySelector('.header .container').appendChild(progressBar);
        } else {
            progressBar.innerHTML = `
                <div class="progress-text">Progress: ${Math.round(progressPercentage)}%</div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
            `;
        }
    }

    // Initialize progress indicator
    updateProgressIndicator();

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const currentActive = document.querySelector('.nav-link.active');
            const currentIndex = Array.from(navLinks).indexOf(currentActive);
            
            let newIndex;
            if (e.key === 'ArrowRight') {
                newIndex = (currentIndex + 1) % navLinks.length;
            } else {
                newIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
            }
            
            navLinks[newIndex].click();
        }
    });

    // Add search functionality for vocabulary
    function createSearchBar() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="text" id="vocabSearch" placeholder="Search vocabulary..." class="search-input">
            <div class="search-results"></div>
        `;
        
        document.querySelector('#vocabulary .vocab-categories').insertBefore(
            searchContainer, 
            document.querySelector('#vocabulary .vocab-categories').firstChild
        );
        
        const searchInput = document.getElementById('vocabSearch');
        const searchResults = document.querySelector('.search-results');
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const vocabItems = document.querySelectorAll('.vocab-item');
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                vocabItems.forEach(item => item.style.display = 'flex');
                return;
            }
            
            let results = [];
            vocabItems.forEach(item => {
                const japanese = item.querySelector('.japanese').textContent.toLowerCase();
                const english = item.querySelector('.english').textContent.toLowerCase();
                
                if (japanese.includes(query) || english.includes(query)) {
                    results.push(item);
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show search results count
            searchResults.innerHTML = results.length > 0 ? 
                `<p>Found ${results.length} matching items</p>` : 
                '<p>No matches found</p>';
        });
    }

    // Initialize search functionality
    createSearchBar();

    // Add pronunciation hints (basic implementation)
    function addPronunciationHints() {
        const japaneseTexts = document.querySelectorAll('.japanese');
        
        japaneseTexts.forEach(text => {
            if (text.textContent.includes('は')) {
                text.title = 'は is pronounced "wa" when used as a topic marker';
            } else if (text.textContent.includes('を')) {
                text.title = 'を is pronounced "o" in modern Japanese';
            } else if (text.textContent.includes('へ')) {
                text.title = 'へ is pronounced "e" when used as a direction marker';
            }
        });
    }

    // Initialize pronunciation hints
    addPronunciationHints();

    // Add study timer
    function createStudyTimer() {
        const timerContainer = document.createElement('div');
        timerContainer.className = 'timer-container';
        timerContainer.innerHTML = `
            <div class="timer-display">
                <span class="timer-label">Study Time:</span>
                <span class="timer-value">00:00</span>
            </div>
            <button class="timer-btn" id="startTimer">Start Timer</button>
        `;
        
        document.querySelector('.header .container').appendChild(timerContainer);
        
        let startTime = null;
        let timerInterval = null;
        let isRunning = false;
        
        const timerBtn = document.getElementById('startTimer');
        const timerValue = document.querySelector('.timer-value');
        
        timerBtn.addEventListener('click', function() {
            if (!isRunning) {
                startTime = Date.now();
                timerInterval = setInterval(updateTimer, 1000);
                timerBtn.textContent = 'Stop Timer';
                timerBtn.style.background = '#e53e3e';
                isRunning = true;
            } else {
                clearInterval(timerInterval);
                timerBtn.textContent = 'Start Timer';
                timerBtn.style.background = '#38a169';
                isRunning = false;
            }
        });
        
        function updateTimer() {
            const elapsed = Date.now() - startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            timerValue.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // Initialize study timer
    createStudyTimer();

    console.log('Japanese Learning App initialized successfully! 🇯🇵');
});
