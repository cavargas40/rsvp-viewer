(function () {
  const vscode = acquireVsCodeApi();

  let words = [];
  let currentIndex = 0;
  let isPlaying = false;
  let wpm = 300;
  let timerId = null;
  let hasUserAdjustedWpm = false;

  // DOM Elements
  const wordPrefixEl = document.getElementById('wordPrefix');
  const wordOrpEl = document.getElementById('wordOrp');
  const wordSuffixEl = document.getElementById('wordSuffix');
  const progressBarEl = document.getElementById('progressBar');
  const progressPercentEl = document.getElementById('progressPercentage');
  const timeRemainingEl = document.getElementById('timeRemaining');
  
  const btnPlayPause = document.getElementById('btnPlayPause');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  const btnStop = document.getElementById('btnStop');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  
  const wpmSlider = document.getElementById('wpmSlider');
  const wpmValueEl = document.getElementById('wpmValue');
  
  const btnSettings = document.getElementById('btnSettings');
  const btnSettingsClose = document.getElementById('btnSettingsClose');
  const settingsDrawer = document.getElementById('settingsDrawer');
  
  const selectFont = document.getElementById('selectFont');
  const inputFontSize = document.getElementById('inputFontSize');
  const colorSwatches = document.querySelectorAll('.color-swatch');

  const introContainer = document.getElementById('introContainer');
  const viewerBox = document.querySelector('.viewer-box');
  const playerHeader = document.querySelector('.player-header');
  const playerControls = document.querySelector('.player-controls');

  // Load state from history
  const previousState = vscode.getState();
  if (previousState && previousState.wpm) {
    wpm = previousState.wpm;
    wpmSlider.value = wpm;
    wpmValueEl.textContent = `${wpm} WPM`;
    hasUserAdjustedWpm = true;
  }

  // Set default view state to show welcome screen when empty
  togglePlayerMode(false);

  // Detect client OS and update Command Palette keyboard shortcut label
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
  const shortcutText = isMac ? 'Cmd + Shift + P' : 'Ctrl + Shift + P';
  const cmdShortcutEl = document.getElementById('cmdShortcut');
  if (cmdShortcutEl) {
    cmdShortcutEl.textContent = shortcutText;
  }

  // --- Playback Loop ---

  function start() {
    if (isPlaying || words.length === 0) return;
    isPlaying = true;
    togglePlayIcon(true);
    tick();
  }

  function pause() {
    if (!isPlaying) return;
    isPlaying = false;
    togglePlayIcon(false);
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    saveState();
  }

  function togglePlay() {
    if (isPlaying) {
      pause();
    } else {
      start();
    }
  }

  function stop() {
    pause();
    currentIndex = 0;
    updateDisplay();
  }

  function tick() {
    if (!isPlaying) return;

    if (currentIndex >= words.length) {
      pause();
      currentIndex = words.length;
      updateProgress();
      return;
    }

    const currentWord = words[currentIndex];
    displayWord(currentWord);
    updateProgress();

    // Calculate delay based on word delay factor and current WPM
    const baseDelay = 60000 / wpm;
    const wordDelay = baseDelay * (currentWord.delayFactor || 1.0);

    currentIndex++;
    timerId = setTimeout(tick, wordDelay);
  }

  // --- Display Updates ---

  function displayWord(word) {
    if (!word) {
      wordPrefixEl.textContent = "";
      wordOrpEl.textContent = "";
      wordSuffixEl.textContent = "";
      return;
    }

    if (word.text === "") {
      // Blank pause token (paragraph / header separator)
      wordPrefixEl.textContent = "";
      wordOrpEl.textContent = "";
      wordSuffixEl.textContent = "";
    } else if (word.text === "[Code_Block]") {
      wordPrefixEl.textContent = "[";
      wordOrpEl.textContent = "Code";
      wordSuffixEl.textContent = " Block]";
    } else if (word.text === "[Image]") {
      wordPrefixEl.textContent = "[";
      wordOrpEl.textContent = "Image";
      wordSuffixEl.textContent = "]";
    } else {
      wordPrefixEl.textContent = word.prefix;
      wordOrpEl.textContent = word.orp;
      wordSuffixEl.textContent = word.suffix;
    }
  }

  function togglePlayerMode(hasContent) {
    if (hasContent) {
      if (introContainer) introContainer.classList.add('hidden');
      if (viewerBox) viewerBox.classList.remove('hidden');
      if (playerHeader) playerHeader.classList.remove('hidden');
      if (playerControls) playerControls.classList.remove('hidden');
    } else {
      if (introContainer) introContainer.classList.remove('hidden');
      if (viewerBox) viewerBox.classList.add('hidden');
      if (playerHeader) playerHeader.classList.add('hidden');
      if (playerControls) playerControls.classList.add('hidden');
    }
  }

  function updateDisplay() {
    if (words.length === 0) {
      wordPrefixEl.textContent = "";
      wordOrpEl.textContent = "Ready";
      wordSuffixEl.textContent = "";
      progressBarEl.style.width = "0%";
      progressPercentEl.textContent = "0%";
      timeRemainingEl.textContent = "--:-- remaining";
      return;
    }

    const showIndex = Math.min(currentIndex, words.length - 1);
    displayWord(words[showIndex]);
    updateProgress();
  }

  function updateProgress() {
    if (words.length === 0) return;

    const percent = Math.min(Math.round((currentIndex / words.length) * 100), 100);
    progressBarEl.style.width = `${percent}%`;
    progressPercentEl.textContent = `${percent}%`;

    // Estimate time remaining
    const remainingWords = words.length - currentIndex;
    const minutesRemaining = remainingWords / wpm;
    const totalSecondsRemaining = Math.round(minutesRemaining * 60);

    if (totalSecondsRemaining <= 0) {
      timeRemainingEl.textContent = "Done";
    } else if (totalSecondsRemaining < 60) {
      timeRemainingEl.textContent = `${totalSecondsRemaining}s remaining`;
    } else {
      const mins = Math.floor(totalSecondsRemaining / 60);
      const secs = totalSecondsRemaining % 60;
      timeRemainingEl.textContent = `${mins}m ${secs.toString().padStart(2, '0')}s remaining`;
    }
  }

  function togglePlayIcon(playing) {
    if (playing) {
      iconPlay.classList.add('hidden');
      iconPause.classList.remove('hidden');
    } else {
      iconPlay.classList.remove('hidden');
      iconPause.classList.add('hidden');
    }
  }

  // --- Skip Actions ---

  function skipForward() {
    pause();
    if (currentIndex < words.length - 1) {
      currentIndex++;
      updateDisplay();
    }
  }

  function skipBackward() {
    pause();
    if (currentIndex > 0) {
      currentIndex--;
      updateDisplay();
    }
  }

  function skipSentenceForward() {
    pause();
    // Search for next word that is a sentence ender or pause
    let found = false;
    for (let i = currentIndex + 1; i < words.length; i++) {
      // check delayFactor representing punctuation
      if (words[i].delayFactor >= 2.0 || words[i].text === "") {
        currentIndex = Math.min(i + 1, words.length - 1);
        found = true;
        break;
      }
    }
    if (!found) {
      currentIndex = words.length - 1;
    }
    updateDisplay();
  }

  function skipSentenceBackward() {
    pause();
    // Search backward for start of current sentence or previous sentence
    let found = false;
    // We look starting 2 words back to skip past current sentence ending punctuation
    for (let i = currentIndex - 2; i >= 0; i--) {
      if (words[i].delayFactor >= 2.0 || words[i].text === "") {
        currentIndex = i + 1;
        found = true;
        break;
      }
    }
    if (!found) {
      currentIndex = 0;
    }
    updateDisplay();
  }

  // --- Setting Application ---

  function applySettings(settings) {
    if (!settings) return;

    if (settings.defaultWpm !== undefined && !hasUserAdjustedWpm) {
      wpm = settings.defaultWpm;
      wpmSlider.value = wpm;
      wpmValueEl.textContent = `${wpm} WPM`;
    }

    if (settings.fontSize !== undefined) {
      document.documentElement.style.setProperty('--rsvp-font-size', `${settings.fontSize}px`);
      inputFontSize.value = settings.fontSize;
    }

    if (settings.preferredFont !== undefined) {
      document.documentElement.style.setProperty('--rsvp-font-family', settings.preferredFont);
      selectFont.value = settings.preferredFont;
    }

    if (settings.orpColor !== undefined) {
      document.documentElement.style.setProperty('--rsvp-orp-color', settings.orpColor);
      colorSwatches.forEach(swatch => {
        if (swatch.dataset.color === settings.orpColor) {
          swatch.classList.add('active');
        } else {
          swatch.classList.remove('active');
        }
      });
    }
  }

  function saveState() {
    vscode.setState({
      wpm: wpm,
      currentIndex: currentIndex
    });
  }

  // --- Event Listeners & Handlers ---

  // Controls UI
  btnPlayPause.addEventListener('click', togglePlay);
  btnStop.addEventListener('click', stop);
  btnPrev.addEventListener('click', skipBackward);
  btnNext.addEventListener('click', skipForward);

  wpmSlider.addEventListener('input', (e) => {
    wpm = parseInt(e.target.value);
    wpmValueEl.textContent = `${wpm} WPM`;
    updateProgress();
    hasUserAdjustedWpm = true;
    saveState();
  });

  // Settings drawer toggles
  btnSettings.addEventListener('click', () => {
    settingsDrawer.classList.toggle('open');
  });
  btnSettingsClose.addEventListener('click', () => {
    settingsDrawer.classList.remove('open');
  });

  // Settings changes inside drawer
  selectFont.addEventListener('change', (e) => {
    const font = e.target.value;
    document.documentElement.style.setProperty('--rsvp-font-family', font);
    vscode.postMessage({ type: 'updateSetting', key: 'preferredFont', value: font });
  });

  inputFontSize.addEventListener('change', (e) => {
    const size = parseInt(e.target.value);
    document.documentElement.style.setProperty('--rsvp-font-size', `${size}px`);
    vscode.postMessage({ type: 'updateSetting', key: 'fontSize', value: size });
  });

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const color = swatch.dataset.color;
      document.documentElement.style.setProperty('--rsvp-orp-color', color);
      vscode.postMessage({ type: 'updateSetting', key: 'orpColor', value: color });
    });
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // If inside a text input, don't capture shortcuts
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
      if (e.key === 'Escape') {
        e.target.blur();
      }
      return;
    }

    switch (e.key) {
      case ' ':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        skipBackward();
        break;
      case 'ArrowRight':
        e.preventDefault();
        skipForward();
        break;
      case 'ArrowUp':
        e.preventDefault();
        skipSentenceBackward();
        break;
      case 'ArrowDown':
        e.preventDefault();
        skipSentenceForward();
        break;
      case 'Escape':
        e.preventDefault();
        if (settingsDrawer.classList.contains('open')) {
          settingsDrawer.classList.remove('open');
        } else {
          pause();
        }
        break;
    }
  });

  // Messages from extension host
  window.addEventListener('message', (event) => {
    const message = event.data;
    switch (message.type) {
      case 'load':
        words = message.words || [];
        currentIndex = 0;
        isPlaying = false;
        togglePlayIcon(false);
        togglePlayerMode(words.length > 0);
        updateDisplay();
        break;
      case 'settings':
        applySettings(message.settings);
        break;
    }
  });

  // Signal webview is ready
  vscode.postMessage({ type: 'ready' });
})();
