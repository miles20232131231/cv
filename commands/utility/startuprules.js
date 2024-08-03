const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup-msg')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Gives Startup msg'),
    async execute(interaction) {

        const embed1 = new EmbedBuilder()
            .setTitle('<:blueheart:1269054575546073090> Centralville | Startup 1 <:blueheart:1269054575546073090>')
            .setDescription(`<:bluedot:1269054480335507510> Welcome to the startup channel. Before joining a session you must follow all of the information provided at ⁠⁠server-guidelines. If you want to join any sessions being hosted you can wait here for notifications.
                
                __**Startup Rules**__
<:bluedot:1269054480335507510> You are not allowed to ask staff for sessions.
<:bluedot:1269054480335507510> Make sure you have registred your vehicle at ⁠vehicle-database.
<:bluedot:1269054480335507510> Click on the button below to view the banned vehicle list.`)
            .setColor(`#565fad`)
            .setFooter({
                text: 'Centralville',
                iconURL: 'https://cdn.discordapp.com/icons/1253924000464375868/7b1ea8a02ca4a9baec6586c648b3b1e2.png?size=4096'
            });
            
        const button1 = new ButtonBuilder()
            .setCustomId('startup')
            .setLabel('Banned Vehicle List')
            .setStyle(ButtonStyle.Primary);
            
        const row = new ActionRowBuilder()
            .addComponents(button1);

        // Send the embed message and the button to the channel
        await interaction.channel.send({ embeds: [embed1], components: [row] });

        // Send an ephemeral confirmation message
        await interaction.reply({ content: 'Command Sent Below.', ephemeral: true });
    },
};
