import {
    ChatInputCommandInteraction,
    Client,
    Events,
    Interaction
} from 'discord.js';
import fs from "fs";
import path from "path";

import { TOKEN } from './utils/config';
import { BaseCommand } from './utils/BaseCommand';
import { BaseModal } from './utils/BaseModal';
import { dbclose, dbconnect } from './database';

const client = new Client({
    intents: []
});

client.once(Events.ClientReady, (client) => {
    console.log(`Logged in as ${client.user?.tag}`);
});

const commands: BaseCommand[] = [];
const modals: BaseModal[] = [];

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
    } else if (interaction.isModalSubmit()) {
        const modal = modals.find(modal => modal.customId === interaction.customId);
        if (!modal) return;

        try {
            await modal.run(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this modal!', ephemeral: true });
        }
    }

    
})

console.log('Logging in...');
(async () => {
    const commandFiles = fs.readdirSync(path.join(__dirname, "./commands")).filter(file => file.endsWith(".ts"));
    for (const file of commandFiles) {
        const command = await import(`./commands/${file}`);
        if (command.default?.prototype instanceof BaseCommand) {
            commands.push(new command.default());
        }
    }

    const modalFiles = fs.readdirSync(path.join(__dirname, "./modals")).filter(file => file.endsWith(".ts"));
    for (const file of modalFiles) {
        const modal = await import(`./modals/${file}`);
        if (modal.default?.prototype instanceof BaseModal) {
            if (modals.find(_modal => _modal.customId === (modal.default?.prototype.customId)))
                throw new Error(`Duplicate customId found in ${file}`);
            modals.push(new modal.default());
        }
    }

    // await dbconnect();

})().then(() => {
    client.login(TOKEN);
});

process.on('SIGINT', async () => {
    console.log('Shutting down...');
    // await dbclose();
    await client.destroy();
    process.exit(0);
});
