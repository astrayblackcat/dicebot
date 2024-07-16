import { getCharacter, replaceStats } from "./fabula-roll";
import Database from "better-sqlite3";

const regex = /^(\d+)?d(\d+)(k([hl])(\d)?)?/i;
const db = new Database('sheets.db', { fileMustExist: true })
const getSheet = db.prepare(`SELECT sheet_id 
                             FROM sheets
                             WHERE user_id = ?`)

type Dice = {
  numDice: number; 
  sides: number;
  isKeep: boolean;
  keepType: string | undefined; //either undefined, h (highest), or l (lowest)
  keepNum: number;
};

export const rollDice = async(input: string, user_id: string) => {
  console.log(`Rolling with input: ${input}`);
  const stats = ['dex', 'ins', 'mig', 'wlp'];
  let inputArr = input.toLowerCase().split("+");
  let rollStr = "";
  let bonusStr = "";
  let maxRoll = 0;
  let total = 0;

  inputArr.forEach((elem) => {
    if (!regex.test(elem) && !Number(elem) && !stats.includes(elem)) {
      throw new Error("Invalid input! Maybe you had a typo.");
    }
  })

  if (stats.some(stat => inputArr.includes(stat))) {
    let sheet_id = getSheet.get(user_id) as {sheet_id: string} | undefined | null
    if (sheet_id === undefined || sheet_id === null) {
      throw new Error('Sheet ID not found. Try registering your sheet ID with /sheet first.')
    }
    let char = await getCharacter(sheet_id.sheet_id)
    inputArr = replaceStats(inputArr, char)
    stats.forEach((stat) => input = input.replaceAll(stat, stat.toUpperCase() + `(${char[stat as keyof typeof char]})`))
  }

  inputArr.forEach((elem) => {
    if (Number(elem)) {
      total += +elem;
      maxRoll += +elem;
      bonusStr += `+ ${elem} `;
    } else {
      let match = regex.exec(elem);
      let dice = {
        numDice: typeof match![1] == "undefined" ? 1 : parseInt(match![1]),
        sides: parseInt(match![2]),
        isKeep: typeof match![3] == "undefined" ? false : true,
        keepType: typeof match![3] == "undefined" ? undefined : match![4],
        keepNum: typeof match![5] == "undefined" ? 1 : parseInt(match![5]),
      };
      if (dice.numDice > 100 || dice.sides > 100) {
        const error = new Error(`Numbers cannot exceed 100 or Blake will yell at you for breaking the bot.`,);
        (error as any).code = "TooHigh";
        throw error;
      } else {
        let currentRoll = roll(dice);
        rollStr += `[${currentRoll.rolls}] `;
        total += currentRoll.sum;
        maxRoll += getMaxRoll(dice)
      }
    }
  });
  if (total === maxRoll) {
    return `Rolling ${input}:\n${rollStr}${bonusStr}= ***${total}!!!***`;
  } else {
    return `Rolling ${input}:\n${rollStr}${bonusStr}= **${total}**`;
  }
};

const roll = (dice: Dice) => {
  let diceRolls: number[] = [];
  let result = 0;
  for (let i = 0; i < dice.numDice; i++) {
    diceRolls.push(Math.floor(Math.random() * dice.sides + 1))
  }
  
  result = checkKeep(diceRolls, dice)
  
  let rollList = diceRolls.join(", ");
  rollList = rollList.replaceAll(`${dice.sides}`, `**${dice.sides}**`);
  return {
    rolls: rollList,
    sum: result,
  };
};

const checkKeep = (rolls: number[], {isKeep, keepType, keepNum}: Dice) => {
  let result = 0;
  if (!isKeep) {
    result = rolls.reduce(
      (accumulator, currentValue) => accumulator + currentValue)
  } else {
    let sortedRolls = [...rolls]
    if (keepType === "h") {
      sortedRolls.sort((a, b) => b - a).splice(keepNum);
    } else if (keepType === "l") {
      sortedRolls.sort((a, b) => a - b).splice(keepNum);
    }
    result = sortedRolls.reduce(
      (accumulator, currentValue) => accumulator + currentValue)
  }
  return result;
}

const getMaxRoll = ({numDice, sides, isKeep, keepNum}: Dice) => {
  if (isKeep && numDice > keepNum) {
    return sides * keepNum
  } else {
    return sides * numDice;
  }
}
