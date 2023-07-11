"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollDice = void 0;
const regex = /^(\d+)?d(\d+)(kh(\d))?/;
const rollDice = (input) => {
    if (regex.test(input) == false) {
        throw new Error('Invalid input!');
    }
    let match = regex.exec(input.toLowerCase());
    let dice = {
        rollStr: match[0],
        numDice: (typeof match[1] == 'undefined') ? 1 : parseInt(match[1]),
        sides: parseInt(match[2]),
        keepHighest: (typeof match[3] == 'undefined') ? false : true,
        khNum: (typeof match[4] == 'undefined') ? 1 : parseInt(match[4]),
    };
    return (roll(dice));
};
exports.rollDice = rollDice;
const roll = (dice) => {
    let diceRolls = [];
    let result = 0;
    for (let i = 0; i < dice.numDice; i++) {
        diceRolls.push(Math.floor(Math.random() * dice.sides + 1));
    }
    if (dice.keepHighest) {
        let highestRolls = [...diceRolls];
        highestRolls.sort((a, b) => b - a).splice(dice.khNum);
        result = highestRolls.reduce((accumulator, currentValue) => accumulator + currentValue, result);
    }
    else {
        result = diceRolls.reduce((accumulator, currentValue) => accumulator + currentValue, result);
    }
    return `Rolling ${dice.rollStr}: [${diceRolls.join(', ')}] = ${result}`;
};
