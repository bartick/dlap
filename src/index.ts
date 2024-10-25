import {
    ActivityType,
    ChatInputCommandInteraction,
    Client,
    Events,
    Interaction
} from 'discord.js';
import fs from "fs";
import path from "path";
import * as http from "http";``

import sequelize from './database';
import { TOKEN } from './utils/config';
import { BaseCommand } from './utils/BaseCommand';
import app from './rest';

// Create a new client instance for the discord bot
const client = new Client({
    intents: [
        'Guilds',
        'GuildMessages',
    ],
    presence: {
        activities: [{ name: 'with the API', type: ActivityType.Playing }],
        status: 'online',
    }
});

// Listen for the ready event and log when the bot is ready
client.once(Events.ClientReady, (client) => {
    console.log(`Logged in as ${client.user?.tag}`);
});

// Create an array to store all the commands
const commands: BaseCommand[] = [];

// Listen for the interactionCreate event and handle the commands
client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isCommand()) {
        const command = commands.find(cmd => cmd.name === interaction.commandName);
        if (!command) return;

        try {
            await command.run(interaction as ChatInputCommandInteraction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
    
})

// Create a server to listen for incoming rest requests
let server: http.Server;


console.log('Logging in...');

// Load all the commands and then start the required services
(async () => {
    // Get all commands from the commands folder
    const commandFiles = fs.readdirSync(path.join(__dirname, "./commands")).filter(file => file.endsWith(".ts"));
    // Import all the commands and add them to the commands array
    for (const file of commandFiles) {
        const command = await import(`./commands/${file}`);
        if (command.default?.prototype instanceof BaseCommand) {
            commands.push(new command.default());
        }
    }

    // Connect to the database
    await sequelize.authenticate().then(async () => {
        console.log('Connected to the database');

        // Sync the database
        await sequelize.sync().then(() => {
            console.log('Database synced');
        }).catch(console.error);

    }).catch(console.error);

})().then(() => {
    // Start the bot
    client.login(TOKEN);

    // Start the rest server
    server = app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});

process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await sequelize.close(); // Close the database connection
    await client.destroy(); // Destroy the discord client
    if(server) server.close(); // Close the rest server
    process.exit(0); // Exit the process
});
