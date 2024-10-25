import { BaseCommand } from '../utils/BaseCommand';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CLIENT_ID, REDIRECT_URL } from '../utils/config';

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
        const url = 'https://discord.com/api/oauth2/authorize?' + new URLSearchParams({
            client_id: CLIENT_ID, // Add your client ID
            response_type: 'code', 
            redirect_uri: REDIRECT_URL, // Add your redirect URL
        }).toString() + '&scope=identify+email'; // Add the scopes you need
        
        // Send the user the link to authorize the bot with the required scopes
        await interaction.reply({
            content: 'Now starting you registered for the bot',
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('Authorize')
                            .setURL(url)
                            .setStyle(ButtonStyle.Link)
                    )
            ],
            ephemeral: true
        });
    }
}