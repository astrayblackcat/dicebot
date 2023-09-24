const regex = /^(\d+)?d(\d+)((kh(\d)?)|(kl(\d)?)?)/;

type Dice = {
  numDice: number; 
  sides: number;
  keepHighest: boolean; 
  khNum: number;
  keepLowest: boolean;
  klNum: number;
};

export const rollDice = (input: string) => {
  console.log(`Rolling with input: ${input}`);
  let inputArr = input.split("+");
  let rollStr = "";
  let bonusStr = "";
  let maxRoll = 0;
  let total = 0;

  inputArr.forEach((elem) => {
    if (!regex.test(elem) && !Number(elem)) {
      throw new Error("Invalid input!");
    }
  })

  inputArr.forEach((elem) => {
    if (Number(elem)) {
      total += Number(elem);
      bonusStr += ` + ${elem}`;
    } else {
      let match = regex.exec(elem.toLowerCase());
      let dice = {
        numDice: typeof match![1] == "undefined" ? 1 : parseInt(match![1]),
        sides: parseInt(match![2]),
        keepHighest: typeof match![4] == "undefined" ? false : true,
        khNum: typeof match![5] == "undefined" ? 1 : parseInt(match![5]),
        keepLowest: typeof match![6] == "undefined" ? false : true,
        klNum: typeof match![7] == "undefined" ? 1 : parseInt(match![7]),
      };
      if (dice.numDice > 100 || dice.sides > 100) {
        const error = new Error(`Numbers cannot exceed 100 or Blake will yell at you for breaking the bot.`,);
        (error as any).code = "TooHigh";
        throw error;
      } else {
        let currentRoll = roll(dice);
        rollStr += `[${currentRoll.rolls}]`;
        total += currentRoll.sum;
        maxRoll += getMaxRoll(dice)
      }
    }
  });
  if (total === maxRoll) {
    return `Rolling ${input}: ${rollStr}${bonusStr} = **${total}!**`;
  } else {
    return `Rolling ${input}: ${rollStr}${bonusStr} = ${total}`;
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

const checkKeep = (rolls: number[], {keepHighest, khNum, keepLowest, klNum}: Dice) => {
  let result = 0;
  if (!keepHighest && !keepLowest) {
    result = rolls.reduce(
      (accumulator, currentValue) => accumulator + currentValue)
  } else {
    let sortedRolls = [...rolls]
    if (keepHighest) {
      sortedRolls.sort((a, b) => b - a).splice(khNum);
    } else if (keepLowest) {
      sortedRolls.sort((a, b) => a - b).splice(klNum);
    }
    result = sortedRolls.reduce(
      (accumulator, currentValue) => accumulator + currentValue)
  }
  return result;
}

const getMaxRoll = ({numDice, sides, keepHighest, khNum, keepLowest, klNum}: Dice) => {
  if (keepHighest && numDice > khNum) {
    return sides * khNum
  } else if (keepLowest && numDice > klNum) {
    return sides * klNum
  } else {
    return sides * numDice;
  }
}