import { SlashCommandBuilder } from 'discord.js';
import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import Database from "better-sqlite3";
import { getNames } from '../functions/sqlite-helpers';

const db = new Database('sheets.db', { fileMustExist: true })
const renameChar = db.prepare(`UPDATE sheets
                               SET character_name = $new_name
                               WHERE user_id = $user_id
                               AND character_name = $character_name`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('Rename a Fabula Ultima character.')
    .addStringOption(option =>
      option.setName('character-name')
        .setDescription('The name of your character.')
        .setAutocomplete(true)
        .setRequired(true))
    .addStringOption(option =>
      option.setName('new-name')
        .setDescription('The new name for your character')
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
    const newname = interaction.options.getString('new-name')
    try {
      renameChar.run({ new_name: newname, user_id: user_id, character_name: charname });
      return interaction.reply({content: `Renamed ${charname} to ${newname}.`, ephemeral: true});
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

