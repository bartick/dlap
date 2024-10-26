import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandOptionsOnlyBuilder, ChatInputCommandInteraction } from "discord.js";
import { BaseCommand } from "../utils/BaseCommand";
import { PublicData } from "../database";
import { InferAttributes, Model } from "sequelize";
import { PublicDataModel } from "../models";

export default class publicKey extends BaseCommand {
    constructor() {
        super({
            name: 'publickey',
        })
    }

    build(): SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Get your public key');
    }

    async run(interaction: ChatInputCommandInteraction) {
        // Defer the reply to show the loading state
        await interaction.deferReply({
            ephemeral: true,
        });

        // Get the public key from the database
        const publicData = await PublicData.findByPk<Model<InferAttributes<PublicDataModel>, InferAttributes<PublicDataModel>>>(interaction.user.id)
            .then((data) => data?.toJSON());
        if (!publicData) {
            // Show error if the user is not registered
            await interaction.editReply('You have yet to register with the bot to have a public key');
            return;
        }

        await interaction.editReply(`Your public key is \`\`\`${publicData.data}\`\`\``); // Send the public key
    }
}