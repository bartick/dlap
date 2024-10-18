import NFT from '../modals/nft';
import { BaseCommand } from '../utils/BaseCommand';
import { BaseModal } from '../utils/BaseModal';
import { ApplicationCommandType, ChatInputCommandInteraction, ContextMenuCommandBuilder, SlashCommandBuilder } from 'discord.js';

export default class Ping extends BaseCommand {
    constructor() {
        super({
            name: 'quick'
        });
    }

    build() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Create a quick blink')
            .addStringOption(option =>
                option.setName('type')
                    .setDescription('The type of the blink')
                    .setRequired(true)
                    .addChoices(
                        { name: 'NFT', value: 'nft' },
                        { name: 'Compressed NFT', value: 'compressed' },
                        { name: 'Transfer Token', value: 'transfer' },
                    )
            )
    }

    async run(interaction: ChatInputCommandInteraction) {
        const blinkType = interaction.options.getString('type', true);
        const handlerFunctions: {
            [key: string]: BaseModal
        } = {
            'nft': new NFT(),
            // 'compressed': this.createCompressedNFT,
            // 'transfer': this.createTransferToken
        }

        await interaction.showModal(handlerFunctions[blinkType].build());
    }
}