import { BaseCommand } from '../utils/BaseCommand';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export default class Start extends BaseCommand {
    constructor() {
        super({
            name: 'start'
        });
    }

    build() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Starts the bot');
    }

    async run(interaction: ChatInputCommandInteraction) {
        await interaction.reply({ content: 'Starting bot...' });
        await interaction.editReply('Bot started!');
    }
}