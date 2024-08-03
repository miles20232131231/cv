const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('early')
        .setDescription('Sends the early access embed.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that EA people can join.')
                .setRequired(true)),
    async execute(interaction) {
        const sessionLink = interaction.options.getString('session-link');

        const embed = new EmbedBuilder()
            .setTitle('<:blueheart:1269054575546073090> Early Access Session Link <:blueheart:1269054575546073090>')
            .setDescription(`<:bluedot:1269054480335507510> <@${interaction.user.id}>  Has now Released the Link for the Early Access Members! Make your way into the Session but make sure to follow the rules written down **Below!*
                
                <:bluedot:1269054480335507510> You are **Not Allowed** to Leak this Early Access Session Link it will result into **Major Consequences** that will not be disclosed here!
                
                <:bluedot:1269054480335507510> Before Joining make sure to look over the <#1268998996291227810> channel!.`)
            .setColor(`#565fad`)
            .setFooter({
                text: 'Centralville',
                iconURL: 'https://cdn.discordapp.com/icons/1253924000464375868/7b1ea8a02ca4a9baec6586c648b3b1e2.png?size=4096'
            });

        const button = new ButtonBuilder()
            .setLabel('Early Access')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('ea');

        const row = new ActionRowBuilder()
            .addComponents(button);

        await interaction.channel.send({ 
            content: '<@&1268998889646592031>, <@&1268998906201509921>', 
            embeds: [embed], 
            components: [row] 
        });

        await interaction.reply({ content: 'Early Access Sent.', ephemeral: true });

        const filter = i => i.customId === 'ea';
        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 9999999 });

        collector.on('collect', async i => {
            const logChannel = interaction.guild.channels.cache.get('1269305317645094973');
            if (logChannel) {
                await logChannel.send(`Interaction collected from ${i.user.tag} at ${new Date().toISOString()}`);
            }

            if (i.member.roles.cache.has('1268998906201509921') || 
                i.member.roles.cache.has('1268998889646592031') || 
                i.member.roles.cache.has('1268998881476350108') || 
                i.member.roles.cache.has('1268998895627800649') || 
                i.member.roles.cache.has('1268998904050094103') || 
                i.member.roles.cache.has('1268998899423641671')) {
                await i.reply({ content: `**Link:** ${sessionLink}`, ephemeral: true });
            } else {
                await i.reply({ 
                    content: 'You do not have this special role, given early access to some perks and content previews. If you wish to get this role, go to support ticket and follow the instructions. Start to enjoy all the benefits of being a holder of one of the special roles once you get the role!', 
                    ephemeral: true 
                });
            }
        });

        collector.on('end', async collected => {
            const logChannel = interaction.guild.channels.cache.get('1268998427644002305');
            if (logChannel) {
                await logChannel.send(`Collected ${collected.size} interactions.`);
            }
        });

        collector.on('error', async error => {
            const logChannel = interaction.guild.channels.cache.get('1268998427644002305');
            if (logChannel) {
                await logChannel.send(`Collector encountered an error: ${error}`);
            }
            console.error('Collector encountered an error:', error);
        });
    },
};
