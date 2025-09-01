import { DISCORD_TOKEN, BOT_CLIENT_ID, GUILD_IDS,GUILDS_INFO} from "../config/config.json";
import * as DiscordModule from 'discord.js';
import fs from 'node:fs';
import path from 'node:path'
import { updateCommands } from "./UpdateCommandsLibray";
import { interval10seconds, interval24, RLRM_GUILDS_ID } from "../constant/RLRM._constants";
import { pingRandomGuildMember } from "../functions/RLRM_fucntions";

const PROD_MOD  = false; //true for production mode ==> .js files, false for development mode ==> .ts files

// Extend the Client class to include commands
interface ExtendedClient extends DiscordModule.Client {
    commands: DiscordModule.Collection<string, any>;
}

//Bot client
const client: ExtendedClient = Object.assign(new DiscordModule.Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildMembers",
    ]
}), { commands: new DiscordModule.Collection<string, any>() });

//Bot ready to use
client.on("ready", () => {
    if (client.user) {
        console.log(`bot is running as ${client.user.tag}`);
    } else {
        console.log('bot is running');
    }
    doAlways(1000, [pingRandomGuildMember], "Do always has been called for client ready Event");
});

//Do always function ==> call pingRandomGuildMember every 10 seconds / Default every 5 minutes
async function doAlways(
    interval: number = 1000 * 60 * 5 , 
    functions: Array<Function> = [], 
    desc: string = "Do always has been called"
) {
    //print separator line on prompt '='
    console.log("=".repeat(50));
    console.log(desc);
    functions.forEach((func) => {func() });
    setTimeout(() => {  doAlways(interval, functions, desc); }, interval);
}

//Test reply message
client.on("messageCreate", (message:DiscordModule.Message) => {
    if(message.author.bot) return;
    console.log("Msg received");
    if(message.content.includes("Salut BG")) {
        message.reply('Salut à toi très cher BG');
    }
});

//welcome message for new membe
// const WelcomeChannelID = GUILD_WELCOME_CHANNEL_IDS[0]
// client.on("guildMemberAdd", (member:any) => {
//     member.guild.channels.cache.get(WelcomeChannelID).send(`<@${member.id}> Bienvenue ici frérot`)
// });

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//Load all commands + set them to the bot client
function setCommands() {
    let commandFilesExt: string;
    if (PROD_MOD) {
        commandFilesExt = ".js";
    } else { 
        commandFilesExt = ".ts";
    }
    client.commands = new DiscordModule.Collection<string, any>();
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(commandFilesExt));
    updateCommands(commandFiles,commandsPath, PROD_MOD);
}
export {client, ExtendedClient, PROD_MOD}; //Export Initialized constants
setCommands(); //Set commands to the bot client
client.login(DISCORD_TOKEN); //Bot login with token 


