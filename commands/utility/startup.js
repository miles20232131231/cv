const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup')
        .setDescription('Sends a startup embed')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addIntegerOption(option =>
            option.setName('reactions')
                .setDescription('Amount of reactions for the session to occur')
                .setRequired(true)),
    async execute(interaction) {
        const reactions = interaction.options.getInteger('reactions');
        const user = interaction.user;

        const embed = new EmbedBuilder()
            .setTitle('<:blueheart:1269054575546073090> Centralville Startup <:blueheart:1269054575546073090> ')
            .setDescription(`<:blueperson:1269052709122609246> <@${interaction.user.id}> Is now Hosting a Session make sure to Read the Rules written Below!
                
                <:bluedot:1269054480335507510> Session Must Receive **7+** To begin!

                <:bluedot:1269054480335507510> Put Privacy setting for Private Servers to "Everyone"

                <:bluedot:1269054480335507510> Just in case the Host does Manual invites!

                <:bluedot:1269054480335507510> Make sure to Read over <#1268998996291227810>
                
                **And lastly Enjoy the Session!**.`)
            .setColor(`#565fad`)
            .setFooter({
                text: 'Centralville',
                iconURL: 'https://cdn.discordapp.com/icons/1253924000464375868/7b1ea8a02ca4a9baec6586c648b3b1e2.png?size=4096'
            });

        const message = await interaction.channel.send({
            content: '2',
            embeds: [embed]
        });

        await message.react('✅');

        const newEmbed = new EmbedBuilder()
            .setTitle("Session Startup")
            .setDescription(`<@${interaction.user.id}> has started up a session in <#1268999009532641293>`)
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
                    .setDescription('Setting up!')
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
