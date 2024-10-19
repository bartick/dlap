import { ActionRowBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { BaseModal } from "../utils/BaseModal";

export default class CompressedNFT extends BaseModal {
    constructor() {
        super({ customId: "compressed" });
    }

    build() {
        return new ModalBuilder()
            .setCustomId(this.customId)
            .setTitle('Create Compressed NFT')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('hobbiesInput')
                            .setLabel("What's some of your favorite hobbies?")
                            .setStyle(TextInputStyle.Paragraph)
                ),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('favoriteColorInput')
                            .setLabel("What's your favorite color?")
                            .setStyle(TextInputStyle.Short)
                    )
            )
    }

    async run(interaction: ModalSubmitInteraction) {
        const favoriteColor = interaction.fields.getTextInputValue('favoriteColorInput');
        const hobbies = interaction.fields.getTextInputValue('hobbiesInput');
        console.log(favoriteColor, hobbies);
        await interaction.reply({ content: "NFT modal" });
    }
}