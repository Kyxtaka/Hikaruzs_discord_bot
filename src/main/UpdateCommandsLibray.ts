import fs from 'node:fs';
import path from 'node:path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as config from '../config/config.json';

const { DISCORD_TOKEN, OWNER_CLIENT_ID, GUILD_IDS } = config;

interface Command {
    data: {
        toJSON: () => any;
    };
}

const commands: any[] = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command: Command = require(filePath);
    commands.push(command.data.toJSON());
}

for (let i = 0; i < GUILD_IDS.length; i++) {
    console.log(GUILD_IDS[i]);
    rest.put(Routes.applicationGuildCommands(OWNER_CLIENT_ID, GUILD_IDS[i]), { body: commands })
        .then(() => console.log(`Successfully registered application commands on ${GUILD_IDS[i]}'s server`))
        .catch(console.error);
}