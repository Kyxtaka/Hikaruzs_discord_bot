import { DISCORD_TOKEN, BOT_CLIENT_ID, GUILD_IDS,GUILDS_INFO} from "../config/config.json";
import * as DiscordModule from 'discord.js';
import fs from 'node:fs';
import path from 'node:path'

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

const interval10seconds = 1000 * 10; // 10 seconds 
const interval24 = 1000 * 60 * 60 * 24; // 24 hours
//Bot ready to use
client.on("ready", () => {
    if (client.user) {
        console.log("I'm still alive2");
        console.log(`bot is running as ${client.user.tag}`);
    } else {
        console.log('bot is running');
    }
    doAlways();
});

//Ping random guild member
function pingRandomGuildMember() {
    const guild = client.guilds.resolve(GUILDS_INFO["982561842364833793"]["ID"]);
    if (guild) {    
        const members = guild.members.fetch();
            members.then((members) => {
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
}

function doAlways() {
    console.log("Do always has been called");
    pingRandomGuildMember();
    setTimeout(() => {  doAlways(); }, interval10seconds);
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



//Lis les fichier pour les commande dynamiquement
let commandFilesExt: string;
if (PROD_MOD) {
    commandFilesExt = ".js";
} else { 
    commandFilesExt = ".ts";
}
client.commands = new DiscordModule.Collection<string, any>();
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(commandFilesExt));

// Load all commands
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.login(DISCORD_TOKEN);


