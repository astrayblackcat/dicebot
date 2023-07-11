const { SlashCommandBuilder } = require('discord.js');
const { rollDice } = require('../diceLogic');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls dice.')
        .addStringOption(option =>
            option.setName('dice')
                .setDescription('How many, and what type of dice to roll. e.g. "1d6" or "2d20kh1"')
                .setRequired(true)),
    async execute(interaction) {
        const roll = interaction.options.getString('dice');
        let output = rollDice(roll)
		return interaction.reply(output);
    },
};
