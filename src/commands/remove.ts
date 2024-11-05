import { SlashCommandBuilder } from 'discord.js';
import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import Database from "better-sqlite3";
import { getNames } from '../functions/sqlite-helpers';

const db = new Database('sheets.db', { fileMustExist: true })
const deleteChar = db.prepare(`DELETE FROM sheets
                           WHERE user_id = $user_id
                           AND character_name = $character_name`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Select a Fabula Ultima character.')
    .addStringOption(option =>
      option.setName('character-name')
        .setDescription('The name of your character.')
        .setAutocomplete(true)
        .setRequired(true)),
  async autocomplete(interaction: AutocompleteInteraction) {
    const names = getNames(interaction.user.id);
    const focused = interaction.options.getFocused();
    const filtered = names.filter(charname => charname.startsWith(focused));
    await interaction.respond(
      filtered.map(charname => ({name: charname, value: charname})),
    );
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const user_id = interaction.user.id;
    const charname = interaction.options.getString('character-name')
    try {
      deleteChar.run({ user_id: user_id, character_name: charname });
      return interaction.reply({content: `Removed ${charname}.`, ephemeral: true});
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

