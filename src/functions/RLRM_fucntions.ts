import { RLRM_GUILDS_ID } from "../constant/RLRM._constants";
import { client } from "../main";
import * as DiscordModule from 'discord.js';

export function pingRandomGuildMember() {
    console.log("pingRandomGuildMember");
    RLRM_GUILDS_ID.forEach((guildID) => {
        let guild = client.guilds.resolve(guildID);
        if (guild) { 
            const members = guild.members.fetch();
                members.then((members) => {
                    console.log("=".repeat(50)+`guild name: ${guild.name}`+"=".repeat(50));   
                    console.log(`members size: ${members.size}`);
                    let randomMember: DiscordModule.GuildMember | undefined = members.random();
                    while (randomMember && randomMember.user.bot) {
                        console.log("random member is bot, retrying");
                        randomMember = members.random();
                    }
                    if (randomMember) {
                        console.log(`pinging ${randomMember.user.username}`);
                        // user.send("Wesh la famille, je suis un bot, je te ping aléatoirement parce que t AFK\n OH TA GRAND MERE");
                    }
                });
                members.catch((error) => {
                    console.log(error)
                });
        }
    });
}