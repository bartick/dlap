import { REST, Routes } from "discord.js";
import { CLIENT_ID, TOKEN } from "./utils/config";
import fs from "fs";
import path from "path";
import logger from "./utils/logger";

// Register all the commands with the discord api
async function register() {
    const commands = []; // Create an array to store all the commands
    const commandFiles = fs.readdirSync(path.join(__dirname, "./commands")).filter(file => file.endsWith(".ts")); // Get all commands from the commands folder

    // Loop through all the commands and add them to the commands array
    for (const file of commandFiles) {
        const command = await import(`./commands/${file}`);
        commands.push(new command.default().build().toJSON());
    }

    const rest = new REST({ version: "10" }).setToken(TOKEN); // Create a new rest client using version 10 of the discord api

    try {
        logger.info("Started refreshing application (/) commands.");

        // Register all the commands with the discord api
        const data = await rest.put(
			Routes.applicationCommands(CLIENT_ID),
			{ body: commands },
		) as Array<unknown>;

        logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        logger.error(error);
    }
}

register();