const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cohost')
        .setDescription('Sends a cohost embed')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers),
    async execute(interaction) {
        const reactions = interaction.options.getInteger('reactions');
        const user = interaction.user;

        const embed = new EmbedBuilder()
            .setTitle('<:blueheart:1269054575546073090> Session Co-Host! <:blueheart:1269054575546073090>')
            .setDescription(`<@${interaction.user.id}>! Has decided to Become Co-Host for this Session if you have any Questions or Concerns and the Host is currently AFK (Away From Keyboard), and Etc! Make sure to go to the Co-Host for Answers!`)
            .setFooter({
                text: 'Centralville',
                iconURL: 'https://cdn.discordapp.com/icons/1253924000464375868/7b1ea8a02ca4a9baec6586c648b3b1e2.png?size=4096'
            });


        const message = await interaction.channel.send({
            content: `<@${interaction.user.id}>`,
            embeds: [embed]
        });


        const newEmbed = new EmbedBuilder()
            .setTitle("Cohost")
            .setDescription(`<@${interaction.user.id}> has is cohosting the session being hosted.`)
            .setFooter({
                text: 'Centralville',
                iconURL: 'https://cdn.discordapp.com/icons/1253924000464375868/7b1ea8a02ca4a9baec6586c648b3b1e2.png?size=4096'
            });

        const targetChannel = await interaction.client.channels.fetch('1269305317645094973');
        await targetChannel.send({ embeds: [newEmbed] });

        const filter = (reaction, user) => reaction.emoji.name === '✅';

        const collector = message.createReactionCollector({ filter, time: 86400000 });

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.count} reactions`);
            if (reaction.count >= reactions) {
                const settingUpEmbed = new EmbedBuilder()
                    .setDescription('Cohost')
                    .setFooter({
                        text: 'Centralville',
                        iconURL: 'https://cdn.discordapp.com/icons/1253924000464375868/7b1ea8a02ca4a9baec6586c648b3b1e2.png?size=4096'
                    });

                interaction.channel.send({ embeds: [settingUpEmbed] });
                collector.stop();
            }
        });

        collector.on('end', collected => {
            console.log(`Collector ended. Total reactions: ${collected.size}`);
        });

        await interaction.reply({ content: `Message has been sent below.`, ephemeral: true });
    },
};
