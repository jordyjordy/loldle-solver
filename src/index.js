import { restart as helpRestart } from './help.js';
import { restart as analyzeRestart } from './analyze.js';

let mode = 'help';

const helpModeButton = document.getElementById("help-mode-btn");
const helpMode = document.getElementById("help-mode");

const analyzeModeButton = document.getElementById("analyze-mode-btn");
const analyzeMode = document.getElementById("analyze-mode");


helpModeButton.addEventListener('click', () => {
    if (mode === 'help') {
        return;
    }
    mode = 'help';
    analyzeMode.classList.add("hidden");
    helpMode.classList.remove("hidden");
    helpRestart();
    helpModeButton.classList.add("active");
    analyzeModeButton.classList.remove("active");
});


analyzeModeButton.addEventListener('click', () => {
    if (mode === 'analyze') {
        return;
    }
    mode = 'analyze';
    helpMode.classList.add("hidden");
    analyzeMode.classList.remove("hidden");
    analyzeRestart();

    helpModeButton.classList.remove("active");
    analyzeModeButton.classList.add("active");
});
