
import { list } from './data.js';

const feedbackOptions = [
    [0, 1],
    [0, 1, 2],
    [0, 1, 2],
    [0, 1],
    [0, 1, 2],
    [0, 1, 2],
    [0, 3, 4]
]

const compareArrays = (guessArray, targetArray) => {
    if (guessArray.length === targetArray.length && guessArray.every(item => targetArray.includes(item))) {
        return 0;
    }
    if (guessArray.some((item) => targetArray.includes(item))) {
        return 2;
    }
    return 1;
}


const getFeedbackArray = (guess, target) => {
    const feedbackArray = [];
    feedbackArray.push(guess.gender === target.gender ? 0 : 1);
    feedbackArray.push(compareArrays(guess.positions, target.positions));
    feedbackArray.push(compareArrays(guess.species, target.species));
    feedbackArray.push(guess.resource === target.resource ? 0 : 1);
    feedbackArray.push(compareArrays(guess.range_type, target.range_type));
    feedbackArray.push(compareArrays(guess.regions, target.regions));
    if (guess.year === target.year) {
        feedbackArray.push(0);;
    } else {
      feedbackArray.push(guess.year < target.year ? 3 : 4);
    }
    return feedbackArray;
};

const lookup = {};

list.forEach((guess) => {
    list.forEach((target) => {
      if (guess.championId === target.championId) {
        return;
      }
      if (!lookup[guess.championId]) {
        lookup[guess.championId] = {};
      }
      lookup[guess.championId][target.championId] = getFeedbackArray(guess, target);
    });
})

export default lookup;

export {
  getFeedbackArray,
}