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
import { PORT, TOKEN } from './utils/config';
import { BaseCommand } from './utils/BaseCommand';
import app from './rest';
import logger from './utils/logger';
import { BaseModal } from './utils/BaseModal';
import { BaseButton } from './utils/BaseButton';

// Create a new client instance for the discord bot
const client = new Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'DirectMessages',
    ],
    presence: {
        activities: [{ name: 'with the API', type: ActivityType.Playing }],
        status: 'online',
    }
});

// Listen for the ready event and log when the bot is ready
client.once(Events.ClientReady, (client) => {
    logger.info(`Logged in as ${client.user?.tag}`);
});

const commands: BaseCommand[] = []; // Create an array to store all the commands
const modals: BaseModal[] = []; // Create an array to store all the modals
const buttons: BaseButton[] = []; // Create an array to store all the buttons

// Listen for the interactionCreate event and handle the commands
client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isCommand()) {
        const command = commands.find(cmd => cmd.name === interaction.commandName);
        if (!command) return;

        try {
            await command.run(interaction as ChatInputCommandInteraction);
        } catch (error) {
            logger.error(error);
            if (interaction.replied) {
                await interaction.editReply({ content: 'There was an error while executing this command!' });
                return;
            }
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    } else if (interaction.isButton()) {
        const buttonSubmit = buttons.find(btn => btn.customId === interaction.customId);
        if (!buttonSubmit) return;

        try {
            await buttonSubmit.run(interaction);
        } catch (error) {
            logger.error(error);
            if (interaction.replied) {
                await interaction.editReply({ content: 'There was an error while executing this button!' });
                return;
            }
            await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
        }
    } else if (interaction.isModalSubmit()) {
        const modalSubmit = modals.find(modal => modal.customId === interaction.customId);
        if (!modalSubmit) return;

        try {
            await modalSubmit.run(interaction);
        } catch (error) {
            logger.error(error);
            if (interaction.replied) {
                await interaction.editReply({ content: 'There was an error while executing this modal!' });
                return;
            }
            await interaction.reply({ content: 'There was an error while executing this modal!', ephemeral: true });
        }
    }
    
})

// Create a server to listen for incoming rest requests
let server: http.Server;


logger.info('Logging in...');

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

    // Get all modals from the modals folder
    const modalFiles = fs.readdirSync(path.join(__dirname, "./modals")).filter(file => file.endsWith(".modal.ts"));
    // Import all the modals and add them to the modals array
    for (const file of modalFiles) {
        const modal = await import(`./modals/${file}`);
        if (modal.default?.prototype instanceof BaseModal) {
            modals.push(new modal.default());
        }
    }

    // Get all buttons from the buttons folder
    const buttonFiles = fs.readdirSync(path.join(__dirname, "./buttons")).filter(file => file.endsWith(".button.ts"));
    // Import all the buttons and add them to the buttons array
    for (const file of buttonFiles) {
        const button = await import(`./buttons/${file}`);
        if (button.default?.prototype instanceof BaseButton) {
            buttons.push(new button.default());
        }
    }

    // Connect to the database
    await sequelize.authenticate().then(async () => {
        logger.info('Connected to the database');
    }).catch(logger.error);

})().then(() => {
    // Start the bot
    client.login(TOKEN);

    // Start the rest server
    server = app.listen(PORT, () => {
        logger.info('Server is running on port 3000');
    });
});

process.on('SIGINT', async () => {
    logger.info('Shutting down...');
    await sequelize.close(); // Close the database connection
    await client.destroy(); // Destroy the discord client
    if(server) server.close(); // Close the rest server
    process.exit(0); // Exit the process
});

export default client;