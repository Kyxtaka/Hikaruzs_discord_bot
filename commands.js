const fs = require('node:fs');
const path = require('node:path');
const { REST }  = require('@discordjs/rest');
const { Routes } =  require('discord-api-types/v9');
const {clientID, guildID, TOKEN, guildIDList} = require('./config.json')


const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const rest = new REST({ version: '9' }).setToken(TOKEN)

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

for (i=0; i < guildIDList.length; i++) {
    console.log(guildIDList[i])
    rest.put(Routes.applicationGuildCommands(clientID, guildIDList[i]), { body: commands })
        .then(() => console.log(`Successfully registered application commands on ${guildIDList[i]}'s server`))
        .catch(console.error);
}



