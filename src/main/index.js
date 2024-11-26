const {TOKEN} = require('./config.json')
const Discord = require('discord.js');
const fs = require('node:fs')
const path = require('node:path')
const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS",
    ]
});

//Bot ready to use
client.on("ready", () => {
    console.log(`bot is running as ${client.user.tag}`); 
});

//Test message
client.on("messageCreate", (message) => {
    if(message.content.includes("Salut BG")) {
        message.reply('Salut à toi très cher BG');
    }
});
/*
//welcome message for new member
const WelcomeChannelID = "1196156952103886858"
client.on("guildMemberAdd", (member) => {
    member.guild.channels.cache.get(WelcomeChannelID).send(`<@${member.id}> Bienvenue ici frérot`)
});
*/
//Lis les fichier pour les commande dynamiquement
client.commands = new Discord.Collection()
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for(const file of commandFiles ) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
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


client.login(TOKEN);


