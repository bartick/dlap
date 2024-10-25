// A base class to create a slash command in discord.js v14

import {
    SlashCommandBuilder,
} from 'discord.js';
import type {
    ChatInputCommandInteraction,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

// Create a base class to create a slash command
export abstract class BaseCommand {
    public name: string; // The name of the command

    constructor(options: { name: string }) {
        this.name = options.name;
    }

    /**
     * Create an abstract method to build the command
     * 
     * @returns SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder
     */
    abstract build(): SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;

    /**
     * Create an abstract method to run the command
     * 
     * @param interaction ChatInputCommandInteraction
     * @returns Promise<void>
     */
    abstract run(interaction: ChatInputCommandInteraction): Promise<void>;
}