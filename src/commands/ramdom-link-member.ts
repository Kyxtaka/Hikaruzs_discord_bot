import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";
import { RLRM_GUILDS_ID } from "../constant/RLRM._constants";

export const data = new SlashCommandBuilder()
    .setName('random-member-link')
    .setDescription(
        "Service that chose a ramdom membver of the server and send random link him every 24 hours"
    );

export async function execute(interaction: CommandInteraction) {
    const guild = interaction.guild;
    if (guild) {
        if (!RLRM_GUILDS_ID.includes(guild.id)) {
            RLRM_GUILDS_ID.push(guild.id);
            interaction.reply("Service activated");
        } else {
            RLRM_GUILDS_ID.splice(RLRM_GUILDS_ID.indexOf(guild.id), 1);
            interaction.reply("Service desactivated");
        }
    }
}