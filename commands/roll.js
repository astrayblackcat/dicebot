const { SlashCommandBuilder } = require('discord.js');
const { rollDice } = require('../functions/dice-logic');

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
        try {
            let output = rollDice(roll)
            return interaction.reply(output);
        } catch (err) {
            if (err.code === `TooHigh`) {
                return interaction.reply(err.message);
            } else {
                return interaction.reply({content: 'Error, invalid input. (You probably had spaces, or typed gibberish)', ephemeral: true})
            }
            
        }
        
    },
};
