import fs from 'node:fs';
import path from 'node:path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as config from '../config/config.json';

const { DISCORD_TOKEN, BOT_CLIENT_ID, GUILD_IDS, GUILDS_INFO} = config;

interface Command {
    data: {
        toJSON: () => any;
    };
}

const commands: any[] = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command: Command = require(filePath);
    commands.push(command.data.toJSON());
}

Object.keys(GUILDS_INFO).forEach((key) => {
    console.log(key);
    rest.put(Routes.applicationGuildCommands(BOT_CLIENT_ID, key), { body: commands })
        .then(() => console.log(`Successfully registered application commands on ${key}'s server`))
        .catch(console.error);
});
