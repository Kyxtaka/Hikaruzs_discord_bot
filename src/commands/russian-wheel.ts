import { CommandInteraction, GuildMember, Permissions, PermissionFlagsBits } from 'discord.js';

function delay(milliseconds: number | undefined) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

async function execute(interaction: CommandInteraction) {
    // Checking member permission and bot permission
    const permissionMember = (interaction.member as GuildMember).permissions.has(PermissionFlagsBits.BanMembers); // bool ==> check if bot has permission to ban members
    if (!permissionMember) return interaction.reply("❌ | You don't have permission to use this command");

    const targetUsertype = (interaction.options as any).getUser('target'); // targeted player (User type)
    if (!targetUsertype) return interaction.reply("❌ | No target user specified");

    if (targetUsertype.id === interaction.member?.user.id) {
        return interaction.reply(`❌ | You cannot ban yourself!`); // can't ban yourself
    }
    if (targetUsertype.id === interaction.guild?.ownerId) {
        return interaction.reply(`❌ | Can't ban the owner`); // can't ban owner
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
    const chooseStatusInt = getRandomInt(10); // initialize the default value of the ban status
    const chooseStatus = (chooseStatusInt % 2) === 0;
    console.log(`${chooseStatusInt} : ${chooseStatus}`);
}

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export { execute };