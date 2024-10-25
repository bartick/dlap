import { ModalBuilder, ModalSubmitInteraction, TextInputStyle } from "discord.js";
import { BaseModal } from "../utils/BaseModal";
import { ActionRowBuilder, TextInputBuilder } from "@discordjs/builders";
import logger from "../utils/logger";
import { createWallet, encrypt, hash } from "../lib";
import { getDiscordUser } from "../lib/get-user";
import sequelize, { AccessTokenData, PublicData, SecretData } from "../database";
import { InferAttributes, Model } from "sequelize";
import { AccessTokenModel, PublicDataModel } from "../models";
import { refreshToken } from "../utils/oauth2";
import { saveToken } from "../helpers/saveToken";

export default class RegisterKeyPair extends BaseModal {
    constructor() {
        super({ customId: "registration-start" });
    }

    build() {
        return new ModalBuilder()
            .setCustomId(this.customId)
            .setTitle("Complete Registration")
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("password")
                            .setLabel("Password")
                            .setPlaceholder("Enter your password")
                            .setMinLength(8)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
            )
    }

    async run(interaction: ModalSubmitInteraction) {
        const password = interaction.fields.getTextInputValue("password"); // Get the password from the interaction

        // Defer the reply to show the loading state
        await interaction.deferReply({
            ephemeral: true,
        });

        interaction.message?.delete(); // Delete the message

        // check if user has already registered
        const publicData = await PublicData.findByPk<Model<InferAttributes<PublicDataModel>, InferAttributes<PublicDataModel>>>(interaction.user.id);
        if (publicData) {
            // Show error if the user is already registered
            interaction.editReply({
                content: "You have already registered for the bot. You can use the bot's features. To get your public key, use the `/publickey` command."
            });
            return;
        }

        // Get the access token data from the database
        const accessTokenData = await AccessTokenData.findByPk<Model<InferAttributes<AccessTokenModel>, InferAttributes<AccessTokenModel>>>(interaction.user.id)
        if (!accessTokenData) {
            // Show error if the access token is not found
            interaction.editReply({
                content: "It seems like there was some error with starting your registration. Please try again."
            });
            return;
        }

        const access_token = accessTokenData.getDataValue('token'); // Get the access token from the database
        const token_type = accessTokenData.getDataValue('tokenType'); // Get the token type from the database
        const refresh_token = accessTokenData.getDataValue('refreshToken'); // Get the refresh token from the database

        // Get the discord user data from the access token
        let specialDiscordUser = await getDiscordUser(token_type, access_token);
        if (!specialDiscordUser) {
            // If the access token is expired, refresh the token and try again
            const newToken = await refreshToken(refresh_token);
            if (!newToken) {
                // Show error if the token is not refreshed
                interaction.editReply({
                    content: "It seems like there was some error with starting your registration. Please try again."
                });
                return;
            }
            specialDiscordUser = await getDiscordUser(newToken.token_type, newToken.access_token);
            if (!specialDiscordUser) {
                // Show error if the user is still not found or issue with the token
                interaction.editReply({
                    content: "It seems like there was some error with starting your registration. Please try again."
                });
                return;
            }
            const saveError = await saveToken(specialDiscordUser.id, newToken.access_token, newToken.token_type, newToken.refresh_token); // Save the new token to the database
            if (saveError) {
                // Show error if the token is not saved
                interaction.editReply({
                    content: "It seems like there was some error with starting your registration. Please try again."
                });
                return;
            }
        }
        const keyPair = createWallet(); // Create a new wallet
        const hashedId = hash(specialDiscordUser.email, specialDiscordUser.id); // Hash the user's email and id
        const encryptedPrivateKey = encrypt(keyPair.secretKey, specialDiscordUser.email, specialDiscordUser.id, password); // Encrypt the private key with the user's email, id and password

        const transaction = await sequelize.transaction(); // Start a new transaction
        try {
            await (await PublicData.create({
                id: specialDiscordUser.id,
                data: keyPair.publicKey,
            }, { transaction })).save(); // Save the public key to the database

            await (await SecretData.create({
                id: hashedId,
                secret: encryptedPrivateKey,
            }, { transaction })).save(); // Save the encrypted private key to the database

            await transaction.commit(); // Commit the transaction

            // Show the success message
            await interaction.editReply({
                content: "You have successfully registered for the bot. You can now use the bot's features. To get your public key, use the `/publickey` command."
            });
        } catch (error) {
            await transaction.rollback(); // Rollback the transaction if there is an error
            logger.error(error); // Log the error

            // Show the error message
            interaction.editReply({
                content: "It seems like there was some error with starting your registration. Please try again."
            });
        }
    }
}