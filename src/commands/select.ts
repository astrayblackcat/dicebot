import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import Database from 'better-sqlite3';
import { setActive } from '../functions/set-active';

const db = new Database('sheets.db', { fileMustExist: true })
const search = db.prepare(`SELECT user_id, character_name
                           FROM sheets
                           WHERE user_id = $user_id
                           AND character_name = $character_name`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('select')
    .setDescription('Select a Fabula Ultima character.')
    .addStringOption(option =>
      option.setName('character-name')
        .setDescription('The name of your character.')
        .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const user_id = interaction.user.id;
    const charname = interaction.options.getString('character-name')
    try {
      setActive(user_id, charname!);
      return interaction.reply({content: `Selected ${charname}!`, ephemeral: true});
    } 
    catch (err: any) {
        if (err.code === 'MissingChar') {
          return interaction.reply({ content: "No character found with that name.", ephemeral: true })
        } else if (err instanceof Error) {
          return interaction.reply({ content: `${err.message}. If this is unexpected, report it as a bug.`, ephemeral: true });
        } else {
          return interaction.reply({ content: 'Error, invalid input. You probably used an invalid ID or your sheet is private.', ephemeral: true })
        }
    }
  }
}
