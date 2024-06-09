import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import Database from 'better-sqlite3';
import { getCharacter } from '../functions/fabula-roll';

const db = new Database('sheets.db', { fileMustExist: true })
const store = db.prepare(`INSERT INTO sheets (user_id, username, sheet_id)
                          VALUES ($user_id, $username, $sheet_id)
                          ON CONFLICT (user_id) DO
                          UPDATE SET username=excluded.username, sheet_id=excluded.sheet_id`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sheet')
    .setDescription('Register your Fabula Ultima character sheet')
    .addStringOption(option =>
      option.setName('sheetid')
        .setDescription('The ID of the google sheet, found in the URL. example: (...)/spreadsheets/d/SHEET_ID_HERE/(...)')
        .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const user_id = interaction.user.id;
    const username = interaction.user.displayName
    const sheet_id = interaction.options.getString('sheetid');
    if (sheet_id == null) throw new Error();
    try {
      let char = await getCharacter(sheet_id);
      store.run({ user_id: user_id, username: username, sheet_id: sheet_id })
      return interaction.reply({
        content: `Character sheet found and stored in database with stats: 
                  DEX: ${char.dex}, INS: ${char.ins}, MIG: ${char.mig}, WLP: ${char.wlp}`
      })
    } catch (err: any) {
      return interaction.reply({ content: 'Error, invalid input. You probably used an invalid ID or your sheet is private.', ephemeral: true })
    }
  }
}

