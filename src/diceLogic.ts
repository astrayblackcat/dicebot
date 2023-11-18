const regex = /^(\d+)?d(\d+)(k([hl])(\d)?)?/;

type Dice = {
  numDice: number; 
  sides: number;
  isKeep: boolean;
  keepType: string | undefined; //either undefined, h (highest), or l (lowest)
  keepNum: number;
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
      bonusStr += ` + ${elem}`;
    } else {
      let match = regex.exec(elem.toLowerCase());
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