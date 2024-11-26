const {SlashCommandBuilder} = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-infos')
        .setDescription("show the server's infos"),
    async execute(interaction) {
        await interaction.reply(`Sever's name  : ${interaction.guild.name}\nTotel number of member : ${interaction.guild.memberCount}`);
    },
};