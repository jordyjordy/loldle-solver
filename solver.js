import lookup from './lookup.js';

const feedbackOptions = [
    [0, 1],
    [0, 1, 2],
    [0, 1, 2],
    [0, 1],
    [0, 1, 2],
    [0, 1, 2],
    [0, 3, 4]
]

const bestGuess = (pool) => {
    const poolSize = pool.length;
    pool.forEach((champion, index) => {
        const buckets = {};
        pool.forEach(target => {
            if (target.championId === champion.championId) {
                return;
            }
            const feedback = lookup[champion.championId][target.championId].join(",");
            if (buckets[feedback] === undefined) {
                buckets[feedback] = 1
            } else {
                buckets[feedback] += 1;
            }
        });
        let entropy = 0;
        Object.values(buckets).forEach((bucket) => {
            const ratio = bucket/poolSize;
            entropy -= ratio * Math.log2(ratio);  
        })
        champion.entropy = entropy;
    });
    const newPool = [...pool];
    newPool.sort((a, b) => b.entropy - a.entropy);
    return newPool[0];
}

const filterPool = (pool, guess, feedback) => {
    return pool.filter((target) => {
        if (guess.championId === target.championId) {
            return false
        }
        return lookup[guess.championId][target.championId].join(",") === feedback;
    })
}

export {
    bestGuess,
    filterPool,
}

