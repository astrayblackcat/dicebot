import { SlashCommandBuilder } from 'discord.js';
import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import { setActive, getNames } from '../functions/set-active';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('select')
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
