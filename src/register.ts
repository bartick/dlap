import { REST, Routes } from "discord.js";
import { BOTID, TOKEN } from "./utils/config";
import fs from "fs";
import path from "path";


async function register() {
    const commands = [];
    const commandFiles = fs.readdirSync(path.join(__dirname, "./commands")).filter(file => file.endsWith(".ts"));

    for (const file of commandFiles) {
        const command = await import(`./commands/${file}`);
        commands.push(new command.default().build().toJSON());
    }

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    try {
        console.log("Started refreshing application (/) commands.");

        const data = await rest.put(
			Routes.applicationCommands(BOTID),
			{ body: commands },
		) as Array<unknown>;

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}

register();