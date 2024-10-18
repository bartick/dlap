import { BaseCommand } from '../utils/BaseCommand';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export default class Ping extends BaseCommand {
    constructor() {
        super({
            name: 'ping'
        });
    }

    build() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Shows Bot Latency');
    }

    async run(interaction: ChatInputCommandInteraction) {
        const start = Date.now();
        await interaction.reply({ content: 'Pinging...' });
        await interaction.editReply(`Bot Latency: \`${Date.now() - start}ms\`, \nAPI Latency: \`${interaction.client.ws.ping}ms\``);
    }
}