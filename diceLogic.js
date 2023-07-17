"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollDice = void 0;
const regex = /^(\d+)?d(\d+)(kh(\d))?/;
/*
relevant details of the dice array returned from the regex is structured as so:
[
  rollStr,
  numDice (defaults to 1)
  sides,
  keepHighest (optional, defaults to false),
  khNum (optional, defaults to 1)
]
*/
const rollDice = (input) => {
    console.log(`Rolling with input: ${input}`);
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
    if (dice.numDice > 100 || dice.sides > 100) {
        return "Numbers cannot exceed 100 or Blake will yell at you for breaking the bot.";
    }
    else {
        return (roll(dice));
    }
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
    if (dice.sides == 6 && diceRolls.filter(num => num == 6).length > 1) {
        return `Rolling ${dice.rollStr}: [${diceRolls
            .join(", ")
            .replaceAll("6", "**6**")}] = **${result}!**`;
    }
    return `Rolling ${dice.rollStr}: [${diceRolls.join(', ')}] = ${result}`;
};
