const { ButtonInteraction } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Check if the interaction is a ButtonInteraction
        if (!(interaction instanceof ButtonInteraction)) return;

        // Check if the custom ID matches the session ping button
        if (interaction.customId === 'startup') {
            try {
                await interaction.reply({
                    content: 'https://docs.google.com/document/d/1Ziv-EqMLckXqaHIYM9ryI8AKXZgo6EIUncg4XiQtz2s/edit?usp=sharing',
                    ephemeral: true
                });
            } catch (error) {
                console.error('Error handling interaction:', error);
                await interaction.reply({
                    content: 'There was an error while processing your request.',
                    ephemeral: true
                });
            }
        }
    },
};
