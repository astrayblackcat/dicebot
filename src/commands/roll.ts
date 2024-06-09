import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { rollDice } from '../functions/dice-logic';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rolls dice.')
    .addStringOption(option =>
      option.setName('dice')
        .setDescription('How many, and what type of dice to roll. e.g. "1d6", "2d10kh1", "dex", "initiative"')
        .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const roll = interaction.options.getString('dice');
    if (roll == null) return new Error();
    try {
      let output = await rollDice(roll, interaction.user.id)
      return interaction.reply(output);
    } catch (err: any) {
      if (err.code === `TooHigh`) {
        return interaction.reply(err.message);
      } else {
        return interaction.reply({ content: err.message, ephemeral: true })
      }
    }
  },
};
