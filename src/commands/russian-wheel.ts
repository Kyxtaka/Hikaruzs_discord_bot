import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits } from 'discord.js';

function delay(milliseconds: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export const data = new SlashCommandBuilder()
    .setName('russian-wheel')
    .setDescription("Set a chance for a user to get temporarily banned")
    .addUserOption(option => 
        option
            .setName('target')
            .setDescription('Choose a player')
            .setRequired(true))
    .addIntegerOption(option => 
        option
            .setName('time')
            .setDescription('Ban duration')
            .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    // Checking member permission and bot permission
    const permissionMember = (interaction.member as GuildMember).permissions.has(PermissionFlagsBits.BanMembers);
    if (!permissionMember) return interaction.reply("❌ | You don't have permission to use this command");

    const targetUsertype = interaction.options.getUser('target');
    if (!targetUsertype) return interaction.reply("❌ | No target user specified");

    if (targetUsertype.id === interaction.member?.user.id) {
        return interaction.reply(`❌ | You cannot ban yourself!`);
    }
    if (targetUsertype.id === interaction.guild?.ownerId) {
        return interaction.reply(`❌ | Can't ban the owner`);
    }

    const requestUserRolePosition = (interaction.member as GuildMember).roles.highest.position;
    const targetUser = await interaction.guild?.members.fetch(targetUsertype.id);
    if (!targetUser) return interaction.reply("❌ | Target user not found");

    const targetUserRolePosition = targetUser.roles.highest.position;
    const botRolePosition = interaction.guild?.members.me?.roles.highest.position;
    if (!botRolePosition) return interaction.reply("❌ | Bot role position not found");

    if (requestUserRolePosition <= targetUserRolePosition) {
        return interaction.reply(`❌ | You can't ban that user because they have the same/higher role than you`);
    }
    if (botRolePosition <= targetUserRolePosition) {
        return interaction.reply(`❌ | I can't ban that user because they have the same/higher role than me`);
    }

    // Ban state initialization
    const chooseStatusInt = getRandomInt(100);
    let chooseStatus = (chooseStatusInt % 6) === 0;
    console.log(`${chooseStatusInt} : ${chooseStatus}`);

    const iteration = getRandomInt(50);
    console.log("nb iteration : " + iteration);
    const banTime = interaction.options.get('time')?.value;
    await interaction.reply("The wheel is wheeling...");

    try {
        for (let i = iteration; i > 0; i--) {
            chooseStatus = !chooseStatus;
            if (i > 30) {
                await interaction.editReply(`The wheel is wheeling.... \nDoes @${targetUsertype.username} will get banned? \nChoice state: ${chooseStatus}`);
                await delay(200);
            } else if (i > 15) {
                await interaction.editReply(`The wheel is wheeling.... \nDoes @${targetUsertype.username} will get banned? \nChoice state: ${chooseStatus}`);
                await delay(400);
            } else if (i > 5) {
                await interaction.editReply(`The wheel is wheeling.... \nDoes @${targetUsertype.username} will get banned? \nChoice state: ${chooseStatus}`);
                await delay(600);
            } else {
                await interaction.editReply(`The wheel is wheeling.... \nDoes @${targetUsertype.username} will get banned? \nChoice state: ${chooseStatus}`);
                await delay(800);
            }
        }

        if (chooseStatus) {
            await targetUser.ban({ reason: 'Russian Wheel decided' });
            await interaction.editReply(`🔨 | @${targetUsertype.username} has been banned for ${banTime} minutes!`);
        } else {
            await interaction.editReply(`😅 | @${targetUsertype.username} got lucky and was not banned!`);
        }
    } catch (error) {
        console.error(error);
        await interaction.editReply('❌ | There was an error executing the command.');
    }
}