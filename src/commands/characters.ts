
import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import  Database  from 'better-sqlite3';

const db = new Database('sheets.db', { fileMustExist: true })
const search = db.prepare(`SELECT character_name, sheet_id, active
                           FROM sheets
                           WHERE user_id = ?`);
module.exports = {
  data: new SlashCommandBuilder()
    .setName('characters')
    .setDescription('List your Fabula Ultima characters.'),
  async execute(interaction: ChatInputCommandInteraction) {
    const user_id = interaction.user.id;
    try {
      const chars = search.all(user_id) as {character_name: string, sheet_id: string, active: 1|null|string}[];
      let output: string = ""
      chars.forEach(char => {
        if (Boolean(char.active)) {
          char.active = "✅";
        } else {
          char.active = "❌";
        }}
      );
      chars.reverse(); // make the most recently changed character first in the list
      chars.forEach((char) => {output += `Name: ${char.character_name} - [Sheet](<https://docs.google.com/spreadsheets/d/${char.sheet_id}>) - Active: ${char.active}\n`});
      return interaction.reply({ content: `${output}`});
    }
    catch (err: any) {
        if (err instanceof Error) {
          return interaction.reply({ content: `${err.message}. If this is unexpected, report it as a bug.`, ephemeral: true });
        } else {
          return interaction.reply({ content: 'Error of some unknown sort.', ephemeral: true })
        }
    }
  }
}
