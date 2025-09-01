import fs, { accessSync } from 'node:fs';
import path from 'node:path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as config from '../config/config.json';
import { client } from '.';

const { DISCORD_TOKEN, BOT_CLIENT_ID, GUILD_IDS, GUILDS_INFO} = config;
interface ICommand {
    data: {
        toJSON: () => any;
    };
}

//export the function that push commands to the client and set them to the bot client
export function updateCommands(commandFiles: Array<string>, commandsPath: string, PROD_MOD: boolean) {
    console.log("Updating commands");
    const commands: any[] = [];
    // const commandsPath = path.join(__dirname, 'commands');
    // const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
    const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command: ICommand = require(filePath);
        commands.push(command.data.toJSON());
    }
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
    
    Object.keys(GUILDS_INFO).forEach((key) => {
        console.log(key);
        rest.put(Routes.applicationGuildCommands(BOT_CLIENT_ID, key), { body: commands })
            .then(() => console.log(`Successfully registered application commands on ${key}'s server`))
            .catch(console.error);
    });
}

