import 'dotenv/config'

type Stat = "d12" | "d10" | "d8" | "d6"

type Character = {
  dex: Stat
  ins: Stat
  mig: Stat
  wlp: Stat
  slow: boolean
  dazed: boolean
  weak: boolean
  shaken: boolean
  enraged: boolean
  poisoned: boolean
}

type responseData = {
  range: string
  majorDimension: string
  values: Stat[][] | string[][] | number[][]
}

const sheetsApi = process.env.sheetsApi

const dice_sizes: Stat[] = [
  "d6", "d8", "d10", "d12"
]

const statuses = {
  slow: 'BM2:BN3',
  dazed: 'BM4:BN5',
  weak: 'BM6:BN7',
  shaken: 'BM8:BN9',
  enraged: 'BR3:BS4',
  poisoned: 'BR7:BS8',
}
const RANGES = ["DexBase", "InsBase", "MigBase", "WlpBase",
  statuses.slow, statuses.dazed, statuses.weak, statuses.shaken,
  statuses.enraged, statuses.poisoned]

export const getCharacter = async(sheetId: string) => {
  const ranges = RANGES.map((x) => `ranges=${x}`).join("&");
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet?key=${sheetsApi}&${ranges}`
  let res = await fetch(url);
  if (!res.ok) {
    throw new Error('Could not find sheet, probably an invalid sheet ID.')
  }
  let data: responseData[] = await res.json().then((res) => res.valueRanges);
  let character: Character = {
    dex: data[0].values[0][0] as Stat,
    ins: data[1].values[0][0] as Stat,
    mig: data[2].values[0][0] as Stat,
    wlp: data[3].values[0][0] as Stat,
    slow: data[4].values[0][0] === 'TRUE',  // Sheets returns booleans as strings of either 'TRUE' or 'FALSE'.
    dazed: data[5].values[0][0] === 'TRUE', // This just happens to be the cleanest way to convert them to actual booleans
    weak: data[6].values[0][0] === 'TRUE',
    shaken: data[7].values[0][0] === 'TRUE',
    enraged: data[8].values[0][0] === 'TRUE',
    poisoned: data[9].values[0][0] === 'TRUE',
  }
  return character
}

const applyStatusEffects = (character: Character): { dex: Stat, ins: Stat, mig: Stat, wlp: Stat } => {
  let dex = character.dex
  let ins = character.ins
  let mig = character.mig
  let wlp = character.wlp

  if (character.slow) {
    dex = dice_sizes[Math.max(0, dice_sizes.indexOf(dex)-1)]
  }

  if (character.dazed) {
    ins = dice_sizes[Math.max(0, dice_sizes.indexOf(ins)-1)]
  }

  if (character.weak) {
    mig = dice_sizes[Math.max(0, dice_sizes.indexOf(mig)-1)]
  }

  if (character.shaken) {
    wlp = dice_sizes[Math.max(0, dice_sizes.indexOf(wlp)-1)]
  }

  if (character.enraged) {
    dex = dice_sizes[Math.max(0, dice_sizes.indexOf(dex)-1)]
    ins = dice_sizes[Math.max(0, dice_sizes.indexOf(ins)-1)]
  }

  if (character.poisoned) {
    mig = dice_sizes[Math.max(0, dice_sizes.indexOf(mig)-1)]
    wlp = dice_sizes[Math.max(0, dice_sizes.indexOf(wlp)-1)]
  }

  return { dex, ins, mig, wlp }
}

export const replaceStats = (strArr: string[], char: Character) => {
  const modStats = applyStatusEffects(char);
  strArr.forEach((elem, i) => {
    strArr[i] = elem.replace('dex', modStats.dex)
                    .replace('ins', modStats.ins)
                    .replace('mig', modStats.mig)
                    .replace('wlp', modStats.wlp)
  })
  return strArr
}
