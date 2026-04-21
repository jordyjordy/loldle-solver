import { list, options } from './data.js';
import { getFeedbackArray } from './lookup.js';
import { bestGuess, filterPool } from './solver.js';

const champName = process.argv.slice(" ")[2]?.toLowerCase();

const secret = list.find((champ) => champ.championName.toLowerCase() === champName);

let checklist = JSON.parse(JSON.stringify(list));

let guess = bestGuess(checklist);
let attempt = 0;
const feedback = getFeedbackArray(guess, secret).join(",");
checklist = filterPool(checklist, guess, feedback);

while (guess.championId !== secret.championId && attempt <= 10) {
    console.log(`Guessed: ${guess.championName}`);
    const feedback = getFeedbackArray(guess, secret).join(",");

    checklist = filterPool(checklist, guess, feedback);
    console.log(`${checklist.length} champion remaining`);
    guess = bestGuess(checklist);
    attempt++;
}

if (guess.championId !== secret.championId) {
    console.log('Did not guess', secret.championName, 'correctly!')
} else {
    console.log("found", guess.championName, "in", attempt + 1, "attempts!");
}