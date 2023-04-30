import type { AutocompleteInteraction, CommandInteraction, SlashCommandBuilder } from 'discord.js';

type Command = {
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
  command: SlashCommandBuilder;
  cmdNames: string[];
  execute: (interaction: CommandInteraction) => Promise<void>;
};

export default Command;
