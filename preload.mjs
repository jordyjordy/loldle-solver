import { contextBridge } from 'electron';
import { list } from './data.js';
import { getFeedbackArray } from './lookup.js';
import { bestGuess, filterPool } from './solver.js';
contextBridge.exposeInMainWorld('worldApi', {
    champions: list,
    getFeedbackArray,
    bestGuess,
    filterPool,
})