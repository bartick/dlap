import { Client, MessageCreateOptions, MessagePayload } from "discord.js";
import client from "../index";

export async function sendDM(userId: string, message: string | MessagePayload | MessageCreateOptions) {
    try {
        const user = await client.users.fetch(userId); // Fetch the user
        await user.send(message); // Send the message
    } catch (error) {
        console.error(error);
    }
}