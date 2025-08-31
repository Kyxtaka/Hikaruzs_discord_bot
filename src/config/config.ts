import {DISCORD_TOKEN, OWNER_CLIENT_ID, GUILD_IDS, SECOND_PREFIX, GUILD_WELCOME_CHANNEL_IDS} from './config.json';

if (!DISCORD_TOKEN) {
    throw new Error('DISCORD_TOKEN is not set');
}
if (!OWNER_CLIENT_ID) {
    throw new Error('CLIENT_ID is not set');
}
if (!GUILD_IDS) {
    throw new Error('GUILD_IDS is not set');
}

export const config = {
    DISCORD_TOKEN,
    OWNER_CLIENT_ID,
    GUILD_IDS,
    SECOND_PREFIX,
    GUILD_WELCOME_CHANNEL_IDS 
};