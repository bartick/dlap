// A base class to create a slash command in discord.js v14

import {
    SlashCommandBuilder,
} from 'discord.js';
import type {
    ChatInputCommandInteraction,
    Interaction,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

export abstract class BaseCommand {
    public name: string;

    constructor(options: { name: string }) {
        this.name = options.name;
    }

    abstract build(): SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;
    abstract run(interaction: ChatInputCommandInteraction): Promise<void>;
}