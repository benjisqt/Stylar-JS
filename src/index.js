const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [
        'GuildMessages',
        'MessageContent',
        'Guilds',
        'GuildMembers',
        'GuildModeration',
        'GuildEmojisAndStickers',
        'GuildBans'
    ]
});

const { HandleAll } = require('./functions/Handlers');

const config = require('../BootOptions.json');

client.on('ready', async(c) => {
    return console.log(`${c.user.tag} has logged in.`);
});

client.login(config.token).then(async() => {
    HandleAll(client, config);
});