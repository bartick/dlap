import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { BaseButton } from "../utils/BaseButton";
import RegisterKeyPair from "../modals/registerKeyPair.modal";

export default class RegistrationStartButton extends BaseButton {
    constructor() {
        super({ customId: "registration-start" });
    }

    build() {
        return new ButtonBuilder()
            .setCustomId(this.customId)
            .setLabel("Enter Password")
            .setStyle(ButtonStyle.Primary);
    }

    async run(interaction: ButtonInteraction) {
        await interaction.showModal(new RegisterKeyPair().build()); // Show the modal to enter the password
    }
}