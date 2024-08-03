const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('release')
        .setDescription('Releases the session for everyone to join.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that civilians may join.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('peacetime-status')
                .setDescription('Current peacetime status.')
                .addChoices(
                    { name: 'Peacetime On', value: 'On' },
                    { name: 'Peacetime Normal', value: 'Normal' },
                    { name: 'Peacetime Off', value: 'Off' }
                )
                .setRequired(true))
        .addStringOption(option =>
            option.setName('frp-speed')
                .setDescription('FRP speeds.')
                .addChoices(
                    { name: '75', value: '75' },
                    { name: '80', value: '80' },
                    { name: '85 (should not be used frequently)', value: '85' }
                )
                .setRequired(true))
        .addStringOption(option =>
            option.setName('ps')
                .setDescription('Tells us if PS is avabile in the session or not.')
                .addChoices(
                    { name: 'Online', value: '🟢' },
                    { name: 'Offline', value: '🔴' },
                )
                .setRequired(true)),
    async execute(interaction) {
        try {
            const sessionLink = interaction.options.getString('session-link');
            const peacetimeStatus = interaction.options.getString('peacetime-status');
            const frpSpeed = interaction.options.getString('frp-speed');
            const ps = interaction.options.getString('ps');

            const embed = new EmbedBuilder()
                .setTitle('<:blueheart:1269054575546073090> Session Link Released! <:blueheart:1269054575546073090>')
                .setDescription(`<:bluedot:1269054480335507510> <@${interaction.user.id}>! Has now Released the Session make your way down into the Session and make sure to Park up when Arriving!

<:blueclipboard:1269052250098106470> **__Session Information:__**<:blueclipboard:1269052250098106470> 

Session Host: <@${interaction.user.id}>
__Peacetime Status:__ ${peacetimeStatus}
__FRP Speeds:__ ${frpSpeed} MPH
__Public Services:__ ${ps}

**Leaking this Link will Not be Tolerated and Will Have Major Consequences that will not be Disclosed here!**`)
                .setColor(`#565fad`)
                .setFooter({
                    text: 'Centralville',
                    iconURL: 'https://cdn.discordapp.com/icons/1253924000464375868/7b1ea8a02ca4a9baec6586c648b3b1e2.png?size=4096'
                });

            const button = new ButtonBuilder()
                .setLabel('Session Link')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('ls');

            const row = new ActionRowBuilder()
                .addComponents(button);

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Release")
                .setDescription(`<@${interaction.user.id}> has released their session in <#1268999009532641293>`)
                .setFooter({
                    text: 'Centralville',
                    iconURL: 'https://cdn.discordapp.com/icons/1253924000464375868/7b1ea8a02ca4a9baec6586c648b3b1e2.png?size=4096'
                });

            const logChannel = await interaction.client.channels.fetch('1269305317645094973');
            await logChannel.send({ embeds: [newEmbed] });

            await interaction.channel.send({ content: '2', embeds: [embed], components: [row] });

            await interaction.reply({ content: 'You have successfully released the session.', ephemeral: true });

            const filter = i => i.customId === 'ls';
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.BUTTON, time: 9999999 });

            collector.on('collect', async i => {
                try {
                    await i.deferUpdate();

                    await i.followUp({ content: `**Link:** ${sessionLink}`, ephemeral: true });

                    const logEmbed = new EmbedBuilder()
                        .setTitle(`Session Link Button`)
                        .setDescription(`Button clicked by <@${i.user.id}>. Session link in <#1268920429746061393>`)
                        .setFooter({
                            text: 'Centralville',
                            iconURL: 'https://cdn.discordapp.com/icons/1253924000464375868/7b1ea8a02ca4a9baec6586c648b3b1e2.png?size=4096'
                        });
                        
                    await logChannel.send({ embeds: [logEmbed] });
                } catch (error) {
                    console.error('Error responding to interaction:', error);
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
        }
    },
};
