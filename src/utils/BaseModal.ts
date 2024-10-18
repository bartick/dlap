// A base class to create a slash command in discord.js v14

import {
    ModalBuilder,
} from 'discord.js';
import type {
    ModalSubmitInteraction,
} from 'discord.js';

export abstract class BaseModal {
    public customId: string;

    constructor(options: { customId: string }) {
        this.customId = options.customId;
    }

    abstract build(): ModalBuilder;
    abstract run(interaction: ModalSubmitInteraction): Promise<void>;
}