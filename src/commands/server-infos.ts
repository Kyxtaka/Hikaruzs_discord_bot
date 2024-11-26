import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('server-infos')
    .setDescription("show the server's infos");

export async function execute(interaction: CommandInteraction) {
    await interaction.reply(`Server's name: ${interaction.guild?.name}\nTotal number of members: ${interaction.guild?.memberCount}`);
}