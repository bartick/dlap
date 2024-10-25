// A base class to create a button in discord.js v14

import type {
    ButtonBuilder,
    ButtonInteraction,
} from 'discord.js';

export abstract class BaseButton {
    public customId: string;

    constructor(options: { customId: string }) {
        this.customId = options.customId;
    }

    abstract build(): ButtonBuilder;
    abstract run(interaction: ButtonInteraction): Promise<void>;
}