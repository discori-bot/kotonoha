import type { AutocompleteInteraction, CommandInteraction, SlashCommandBuilder } from 'discord.js';

type Command = {
  autocomplete?: (interaction: AutocompleteInteraction) => void | Promise<void>;
  command: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => void | Promise<void>;
};

export default Command;
