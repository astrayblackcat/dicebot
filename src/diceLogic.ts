const regex = /^(\d+)?d(\d+)(kh(\d))?/;

type Dice = {
  numDice: number; 
  sides: number;
  keepHighest: boolean; 
  khNum: number;
};

export const rollDice = (input: string) => {
  console.log(`Rolling with input: ${input}`);
  let inputArr = input.split("+");
  let rollStr = "";
  let bonusStr = "";
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
        keepHighest: typeof match![3] == "undefined" ? false : true,
        khNum: typeof match![4] == "undefined" ? 1 : parseInt(match![4]),
      };
      if (dice.numDice > 100 || dice.sides > 100) {
        const error = new Error(`Numbers cannot exceed 100 or Blake will yell at you for breaking the bot.`,);
        (error as any).code = "TooHigh";
        throw error;
      } else {
        let currentRoll = roll(dice);
        rollStr += `[${currentRoll.rolls}]`;
        total += currentRoll.sum;
      }
    }
  });
  return `Rolling ${input}: ${rollStr}${bonusStr} = ${total}`;
};

const roll = ({numDice, sides, keepHighest, khNum}: Dice) => {
  let diceRolls: number[] = [];
  let result = 0;
  for (let i = 0; i < numDice; i++) {
    diceRolls.push(Math.floor(Math.random() * sides + 1))
  }
  
  if (keepHighest) {
    let highestRolls = [...diceRolls];
    highestRolls.sort((a, b) => b - a).splice(khNum);
    result = highestRolls.reduce(
      (accumulator, currentValue) => accumulator + currentValue)
  } else {
    result = diceRolls.reduce(
      (accumulator, currentValue) => accumulator + currentValue)
  }
  let rollList = diceRolls.join(", ");
  if (sides == 6 && diceRolls.filter((num) => num == 6).length > 1) {
    rollList = rollList.replaceAll("6", "**6**");
  }
  return {
    rolls: rollList,
    sum: result,
  };
};