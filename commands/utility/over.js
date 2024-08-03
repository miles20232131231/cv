const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('over')
        .setDescription('Purges messages from today between specified start and end times, excluding the first 2 messages.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('start-time')
                .setDescription('Start time in HH:MM format')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('end-time')
                .setDescription('End time in HH:MM format')
                .setRequired(true)),
    async execute(interaction) {
        const startTime = interaction.options.getString('start-time');
        const endTime = interaction.options.getString('end-time');

        const now = new Date();
        const start = new Date(now);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        start.setHours(startHours, startMinutes, 0, 0);

        const end = new Date(now);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        end.setHours(endHours, endMinutes, 0, 0);

        if (start > end) {
            end.setDate(end.getDate() + 1); 
        }

        try {
            const messages = await interaction.channel.messages.fetch({ limit: 100 });

            const sortedMessages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

            const messagesToDelete = sortedMessages.filter((msg, index) => {
                const msgDate = new Date(msg.createdTimestamp);
                return index >= 2 && msgDate >= start && msgDate <= end;
            });

            for (const msg of messagesToDelete.values()) {
                await msg.delete();
            }

            const embed = new EmbedBuilder()
                .setTitle('<:blueheart:1269054575546073090> Centralville Session Concluded!<:blueheart:1269054575546073090>')
                .setDescription(`<:bluedot:1269054480335507510> This Session has now been Concluded. And is Over Thank you all for joining this Session and Participating in it! **Have a Wonderful Day!**
                
                **__Session Details:__**
                
                Session Host: **<@${interaction.user.id}>**
                Start Time: **${startTime}** 
                End Time: **${endTime}** 
                `)
                .setColor(`#565fad`)
                .setFooter({
                    text: 'Centralville',
                    iconURL: 'https://cdn.discordapp.com/icons/1253924000464375868/7b1ea8a02ca4a9baec6586c648b3b1e2.png?size=4096'
                });

                const newEmbed = new EmbedBuilder()
                .setTitle("Session Over")
                .setDescription(`<@${interaction.user.id}> has ended their session in <#1268999009532641293>`)
                .setFooter({
                    text: 'Centralville',
                    iconURL: 'https://cdn.discordapp.com/icons/1253924000464375868/7b1ea8a02ca4a9baec6586c648b3b1e2.png?size=4096'
                });
    
            const targetChannel = await interaction.client.channels.fetch('1269305317645094973');
            await targetChannel.send({ embeds: [newEmbed] });

            await interaction.channel.send({ embeds: [embed] });

            await interaction.reply({ content: 'Command sent below.', ephemeral: true });
        } catch (error) {
            console.error('Error deleting messages:', error);
            await interaction.reply({ content: 'Failed to delete messages. Please try again later.', ephemeral: true });
        }
    },
};
