import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageComponentInteraction, ModalBuilder, ModalSubmitInteraction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { PublicKey } from "@solana/web3.js";

import { BaseModal } from "../utils/BaseModal";
import { SUPPORTED_TOKENS } from '../utils/constants';

export default class TransferValue extends BaseModal {
    constructor() {
        super({ customId: "transfer" });
    }

    build() {
        return new ModalBuilder()
            .setCustomId(this.customId)
            .setTitle('Create Token Transfer')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('account')
                            .setLabel("Enter the account to send the token with")
                            .setStyle(TextInputStyle.Short)
                    ),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('amount')
                            .setLabel("Enter the amount of tokens to send")
                            .setStyle(TextInputStyle.Short)
                    )
            )
    }

    async run(interaction: ModalSubmitInteraction) {
        const account = interaction.fields.getTextInputValue('account');
        let PublicKeyAccount;

        try {
            PublicKeyAccount = new PublicKey(account);
        } catch (error) {
            await interaction.reply({ content: "Invalid account number. Please enter a valid account", ephemeral: true });
            return;
        }

        const amount = interaction.fields.getTextInputValue('amount');
        let amountNumber = parseInt(amount);
        if (isNaN(amountNumber)) {
            await interaction.reply({ content: "Invalid amount. Please enter a valid number", ephemeral: true });
            return;
        }

        console.log(`Sending ${amountNumber} tokens to ${PublicKeyAccount.toBase58()}`);

        const embed = new EmbedBuilder()
            .setTitle('Token Transfer')
            .setDescription('Please select the token you want to get')
            .addFields(
                { name: 'Account', value: PublicKeyAccount.toBase58() },
                { name: 'Amount', value: `${amountNumber}` }
            )
            .setColor('Green')
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.avatarURL() || undefined
            })
            .setTimestamp();
        
        const dropdown = new StringSelectMenuBuilder()
            .setCustomId('token')
            .addOptions(
                Object.keys(SUPPORTED_TOKENS).map((token) => {
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(token)
                        .setValue(token)
                        .setEmoji(SUPPORTED_TOKENS[token] as string);
                })
            )

        const image = interaction.fields.getTextInputValue('image');
        if (image) {
            embed.setImage(image);
        }

        const message = await interaction.reply({ embeds: [embed], components: [
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(dropdown)
        ], fetchReply: true });

        const filter = (i: MessageComponentInteraction) => i.customId === 'token' && i.user.id === interaction.user.id;

        // 3WfFiChZ5FzP4ygoPaTWGZL6BMMf8mGaZsEeURd6HpZv

        await message.awaitMessageComponent({ filter, time: 60_000 })
            .then(async (i) => {
                console.log("Something happened");
                if(i.isAnySelectMenu()) {
                    const token = i.values[0];
                    embed.addFields({ name: 'Token', value: token });
                    const confirmButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId('confirm')
                            .setLabel('Confirm')
                            .setEmoji('✅')
                            .setStyle(ButtonStyle.Primary)
                    );
                    const rejectButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId('reject')
                            .setLabel('Reject')
                            .setEmoji('❌')
                            .setStyle(ButtonStyle.Danger)
                    );
                    const confirmCheckMessage = await i.update({ embeds:[embed], components: [confirmButton, rejectButton], fetchReply: true });

                    const filter = (i: MessageComponentInteraction) => (i.customId === 'confirm' || i.customId === 'reject') && i.user.id === interaction.user.id;

                    await confirmCheckMessage.awaitMessageComponent({ filter, time: 30_000 })
                        .then(async (i) => {
                            if(i.customId === 'confirm') {
                                await i.update({ content: 'Transaction confirmed', components: [] });
                            } else {
                                await i.update({ content: 'Transaction rejected', components: [] });
                            }
                        })
                        .catch(async (error) => {
                            console.error(error);
                            await confirmCheckMessage.edit({ content: 'Transaction timed out', components: [] });
                        });

                }
            })
            .catch(async (error) => {
                console.error(error);
                await message.edit({ content: 'Token selection timed out', components: []});
            });
    }
}