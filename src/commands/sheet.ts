import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import Database from 'better-sqlite3';
import { getCharacter } from '../functions/fabula-roll';
import { setActive } from '../functions/set-active';

const db = new Database('sheets.db', { fileMustExist: true })
const store = db.prepare(`INSERT INTO sheets (user_id, sheet_id, character_name)
                          VALUES ($user_id, $sheet_id, $character_name)`
                          );
module.exports = {
  data: new SlashCommandBuilder()
    .setName('sheet')
    .setDescription('Register your Fabula Ultima character sheet')
    .addStringOption(option =>
      option.setName('character-name')
        .setDescription('The name of your character. Must be unique among your existing characters.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('sheet-id')
        .setDescription('The ID of the google sheet, found in the URL. example: (...)/spreadsheets/d/SHEET_ID_HERE/(...)')
        .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const user_id = interaction.user.id;
    const sheet_id = interaction.options.getString('sheet-id');
    const charname = interaction.options.getString('character-name')
    if (sheet_id == null) throw new Error();
    try {
      let char = await getCharacter(sheet_id);
      store.run({ user_id: user_id, sheet_id: sheet_id, character_name: charname })
      setActive(user_id, charname!);
      return interaction.reply({
        content: `Character sheet found and stored in database: Name: ${charname}, DEX: ${char.dex}, INS: ${char.ins}, MIG: ${char.mig}, WLP: ${char.wlp}`
      })
    } 
    catch (err: any) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return interaction.reply({ content: "Error, character name already in use. Delete or change your existing character's name.", ephemeral: true });
        } else if (err instanceof Error) {
          return interaction.reply({ content: `${err.message}. If this is unexpected, report it as a bug.`, ephemeral: true });
        } else {
          return interaction.reply({ content: `There was some unexpected bug, please report it!`, ephemeral: true});
        }
    }
  }
}

