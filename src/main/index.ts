import { DISCORD_TOKEN, OWNER_CLIENT_ID, GUILD_IDS,SECOND_PREFIX,GUILD_WELCOME_CHANNEL_IDS} from "../config/config.json";
import * as DiscordModule from 'discord.js';
import fs from 'node:fs';
import path from 'node:path'

const PROD_MOD  = false; //true for production mode
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
});

//Test reply message
client.on("messageCreate", (message:DiscordModule.Message) => {
    if(message.content.includes("Salut BG")) {
        message.reply('Salut à toi très cher BG');
    }
});

//welcome message for new membe
// const WelcomeChannelID = GUILD_WELCOME_CHANNEL_IDS[0]
// client.on("guildMemberAdd", (member:any) => {
//     member.guild.channels.cache.get(WelcomeChannelID).send(`<@${member.id}> Bienvenue ici frérot`)
// });

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

// for(const file of commandFiles ) {
//     const filePath = path.join(commandsPath, file);
//     const command = require(filePath);
//     client.commands.set(command.data.name, command);
// }

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

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

client.login(DISCORD_TOKEN);


