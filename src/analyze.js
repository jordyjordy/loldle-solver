import { list as championList } from './data.js';
import { getFeedbackArray } from './lookup';
import { bestGuess, filterPool, giveAverageAndFilter } from './solver.js';

// populate dropdown
const championSelect = document.getElementById('analyze-champion-select');
const historyEl = document.getElementById('analyze-result-box');
const botHistoryEl = document.getElementById('bot-analyze-result-box');
const resultEl = document.getElementById("guess-results");
const botResultEl = document.getElementById("bot-guess-results")
let selectedChampion = '';

championList.forEach((champion) => {
    const option = document.createElement('option');
    option.value = champion.championId;
    option.id = `analyze-option-${champion.championId}`;
    option.textContent = champion.championName;
    championSelect.appendChild(option);
});

let guesses = [];

const analyzeList = document.getElementById("analyze-list-box");
console.log(championList);
const analyzeButton = document.getElementById("analyze-guess");
const addButton = document.getElementById("add-button");

championSelect.addEventListener('change', (val) => {
    selectedChampion = val.target.value;
})

const resultAnalysisEl = document.getElementById('result-analysis');
const botResultAnalysisEl = document.getElementById('bot-results');
const buttons = [];

const setDefaultState = () => {
    guesses = [];
    championSelect.selectedIndex = 0;
    analyzeButton.disabled = true;
    analyzeList.innerHTML = '';
    historyEl.innerHTML = '';
    resultEl.innerHTML = '';
    resultAnalysisEl.classList.add('hidden');
    botResultAnalysisEl.classList.add('hidden');
    botHistoryEl.innerHTML = '';
    botResultEl.innerHTML = '';
    addButton.disabled = false;
    championList.forEach((champion) => {
        document.getElementById(`analyze-option-${champion.championId}`).hidden = false;
    })
}

const insertGuess = (guessedChampion) => {
    const guessDiv = document.createElement("div");
    guessDiv.classList.add("guess-row");
    analyzeButton.disabled = false;
    const nameDiv = document.createElement("div");

    nameDiv.classList = "name"
    nameDiv.innerHTML = guessedChampion.championName;
    guessDiv.appendChild(nameDiv);

    const buttonEl = document.createElement("button");
    buttonEl.classList.add("guess-row__button");
    buttonEl.innerHTML = 'X';
    buttonEl.addEventListener('click', () => {
        guesses = guesses.filter((id) => id !== guessedChampion.championId);
        guessDiv.remove();
        document.getElementById(`analyze-option-${ guessedChampion.championId}`).hidden = false;
        console.log(guesses);
        if (guesses.length === 0) {
            analyzeButton.disabled = true;
        }
    });
    guessDiv.appendChild(buttonEl);
    analyzeList.appendChild(guessDiv);
}

const restart = () => {
    setDefaultState();
}

addButton.addEventListener('click', () => {
    if (selectedChampion !== '') {
        const guessedChampion = championList.find((champion) => champion.championId === selectedChampion);
        guesses.push(selectedChampion);
        insertGuess(guessedChampion);
        const option = document.getElementById(`analyze-option-${selectedChampion}`);
        option.hidden = true;
        selectedChampion = '';
        championSelect.selectedIndex = 0;
    }
})


const insertHistory = (guessedChampion, feedback, target) => {
    console.log(guessedChampion);
    const nameDiv = document.createElement("div");
    nameDiv.classList = "name"
    nameDiv.innerHTML = guessedChampion.championName;
    target.appendChild(nameDiv);
    feedback.forEach((item) => {
        const feedbackDiv = document.createElement("div");
        feedbackDiv.classList.add(`class-${item}`);
        target.appendChild(feedbackDiv);
    })
}

const insertGuessQuality = (guessChampion, data, target) => {
    const div = document.createElement("div");
    div.innerHTML = `${guessChampion.championName} guess: average remaining: ${data.expectedRemaining.toFixed(2)}, actual remaining: ${data.pool.length}, ${data.luck}`;
    const remainingDiv = document.createElement("div");
    remainingDiv.innerHTML = 'remaining: ' + data.pool.map((champ) => champ.championName);
    target.appendChild(div);
    target.appendChild(remainingDiv);
}

analyzeButton.addEventListener('click', () => {
    if (guesses.length <= 0) {
        return;
    }
    analyzeButton.disabled = true;
    const answerId = guesses[guesses.length - 1];
    const answerChampion = championList.find((champ) => champ.championId === answerId);
    addButton.disabled = true;
    const filteredGuesses = [...guesses];
    filteredGuesses.pop();
    let list = [...championList];
    filteredGuesses.forEach((guess) => {
        const guessChampion = championList.find((champ) => champ.championId === guess);
        const data = giveAverageAndFilter(list, guessChampion, answerChampion);
        const feedback = getFeedbackArray(guessChampion, answerChampion);
        insertHistory(guessChampion, feedback, historyEl);
        insertGuessQuality(guessChampion, data, resultEl);

        list = data.pool;
    });
    const finalFeedback = getFeedbackArray(answerChampion, answerChampion);
    const data = giveAverageAndFilter(list, answerChampion, answerChampion);
    insertGuessQuality(answerChampion, data, resultEl);
    insertHistory(answerChampion, finalFeedback, historyEl);
    resultAnalysisEl.classList.remove('hidden');

    // bot playthrough

    list = [...championList];
    while (list.length > 0) {
        const guessChampion = bestGuess(list);
        console.log(guessChampion);
        const data = giveAverageAndFilter(list, guessChampion, answerChampion);
        const feedback = getFeedbackArray(guessChampion, answerChampion);
        insertHistory(guessChampion, feedback, botHistoryEl);
        if (data.pool.length > 0) {
            insertGuessQuality(guessChampion, data, botResultEl);
        }

        list = data.pool;
        console.log(list);
    }
    const newData = giveAverageAndFilter(list, answerChampion, answerChampion);
    insertGuessQuality(answerChampion, data, botResultEl);
    botResultAnalysisEl.classList.remove('hidden');
})

const restartButtonEl = document.getElementById('restart-analysis');

restartButtonEl.addEventListener('click', () => {
    restart();
});

export {
    restart
}
