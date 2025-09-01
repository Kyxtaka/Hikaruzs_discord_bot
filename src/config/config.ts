import {DISCORD_TOKEN, GUILD_IDS, BOT_CLIENT_ID, GUILDS_INFO, PROD_MODE} from './config.json';

if (!DISCORD_TOKEN) {
    throw new Error('DISCORD_TOKEN is not set');
}
if (!BOT_CLIENT_ID) {
    throw new Error('BOT_CLIENT_ID is not set');
}
if (!GUILD_IDS) {
    throw new Error('GUILD_IDS is not set');
}


export const config = {
    DISCORD_TOKEN,
    GUILD_IDS,
    BOT_CLIENT_ID,
    GUILDS_INFO,
    PROD_MODE
};