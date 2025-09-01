import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get the avatar URL of the selected user, or your own avatar.')
    .addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show'));

export async function execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.get('target')?.user;
    if (user) {
        return interaction.reply(`${user.username}'s avatar: ${user.displayAvatarURL({ forceStatic: true })}`);
    }
    return interaction.reply(`Your avatar: ${interaction.user.displayAvatarURL({ forceStatic: true })}`);
}
