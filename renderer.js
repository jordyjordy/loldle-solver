// populate dropdown
const championSelect = document.getElementById('champion-select');

let selectedChampion = '';

let list = [
    ...window.worldApi.champions,
]

let proposedGuess = window.worldApi.bestGuess(list);

const suggestedGuessEl = document.getElementById('suggested-guess');

const updateProposedGuess = (champ) => {
    proposedGuess = champ;
    suggestedGuessEl.innerHTML = proposedGuess.championName;
}

suggestedGuessEl.innerHTML = proposedGuess.championName;

const feedbackOptions = [
    [0, 1],
    [0, 1, 2],
    [0, 1, 2],
    [0, 1],
    [0, 1, 2],
    [0, 1, 2],
    [0, 3, 4]
]

const buttonIdOptionMap = {
    'gender-feedback': [1, 0],
    'position-feedback': [1, 0, 2],
    'species-feedback': [1, 0, 2],
    'resource-feedback': [1, 0],
    'range-feedback': [1, 0, 2],
    'region-feedback': [1, 0, 2],
    'release-feedback': [0, 3, 4],
}

const guessButton = document.getElementById("submit-guess");

const defaultFeedback = [1, 1, 1, 1, 1, 1, 1];
let feedback = [
    ...defaultFeedback,
]

championSelect.addEventListener('change', (val) => {
    selectedChampion = val.target.value;
    guessButton.disabled = false;
})

window.worldApi.champions.forEach((champion) => {
    const option = document.createElement('option');
    option.value = champion.championId;
    option.textContent = champion.championName;
    championSelect.appendChild(option);
});

const buttons = [];

Object.entries(buttonIdOptionMap).forEach(([buttonId, mapping], index) => {
    const buttonEl = document.getElementById(buttonId);

    buttons.push(buttonEl);

    buttonEl.addEventListener('click', () => {
        const current = feedback[index];
        buttonEl.classList.remove(`class-${current}`);
        const currentPos = mapping.indexOf(current);
        const nextPos = (currentPos + 1) % mapping.length;
        feedback[index] = mapping[nextPos];
        buttonEl.classList.add(`class-${feedback[index]}`);
    })
});

const historyEl = document.getElementById('history-box');

const setDefaultState = () => {
    feedback = [...defaultFeedback];
    championSelect.selectedIndex = 0;
    buttons.forEach((buttonEl) => {
        buttonEl.classList = 'class-1'
    })
    selectedChampion = '';
    guessButton.disabled = true;
}

const insertHistory = (guessedChampion, feedback) => {
    const nameDiv = document.createElement("div");
    nameDiv.classList = "name"
    nameDiv.innerHTML = guessedChampion.championName;
    historyEl.appendChild(nameDiv);
    feedback.forEach((item) => {
        const feedbackDiv = document.createElement("div");
        feedbackDiv.classList.add(`class-${item}`);
        historyEl.appendChild(feedbackDiv);
    })
}

const restart = () => {
        historyEl.innerHTML = '';
    list = [
        ...window.worldApi.champions,
    ]
    updateProposedGuess(window.worldApi.bestGuess(list));
    setDefaultState();
}

guessButton.addEventListener('click', () => {
    {
        if (selectedChampion !== '') {
            const guessedChampion = window.worldApi.champions.find((champion) => champion.championId === selectedChampion)
            insertHistory(guessedChampion, feedback);
            list = window.worldApi.filterPool(list, guessedChampion, feedback.join(","));
            if (list.length > 0) {
                setDefaultState();
                updateProposedGuess(window.worldApi.bestGuess(list));
            } else {
                alert("Could not find any matching champions, either the set is different or you made a mistake.")
                restart();
            }
        }
    }
})

const restartButtonEl = document.getElementById('restart-button');


restartButtonEl.addEventListener('click', () => {
    restart();
});