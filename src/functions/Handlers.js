const fs = require('fs');
const mongoose = require('mongoose');

async function HandleAll(client, config) {
    HandleEvents(client);
    HandleCommands(client);
    if(config.mongoenabled === true) {
        HandleMongo(config.uri);
    } else return;
}

async function HandleEvents(client) {
    const folders = fs.readdirSync(`./src/events`);

    for (const folder of folders) {
        const files = fs.readdirSync(`./src/events/${folder}`).filter((file) => file.endsWith(".js"));

        for (const file of files) {
            const event = require(`../events/${folder}/${file}`);

            if(event.rest) {
                if(event.once) client.rest.once(event.name, (...args) => event.execute(...args, client));
                else client.rest.on(event.name, (...args) => event.execute(...args, client));
            } else {
                if(event.once) client.once(event.name, (...args) => event.execute(...args, client));
                else client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
        continue;
    }

    return console.log(`Events Handled.`);
}

async function HandleCommands(client) {
    let commandsArray = [];
    const folders = fs.readdirSync(`./src/cmd`);

    for (const folder of folders) {
        const files = fs.readdirSync(`./src/cmd/${folder}`).filter((file) => file.endsWith(".js"));

        for (const file of files) {
            const command = require(`../cmd/${folder}/${file}`);

            client.commands.set(command.data.name, command);

            commandsArray.push(command.data.toJSON());

            continue;
        }
        continue;
    }

    client.application.commands.set(commandsArray);

    return console.log(`Commands Handled.`);
}

async function HandleMongo(uri) {
    const models = fs.readdirSync(`./src/models`).filter((file) => file.endsWith(".js"));

    const connection = await mongoose.connect(uri);
    if(connection) {
        return console.log(`Connected to Stylar Database, loaded ${models.length} models.`);
    } else {
        return console.log(`There was an error connecting to the MongoDB Database.`);
    }
}

module.exports = { HandleCommands, HandleEvents, HandleMongo, HandleAll }