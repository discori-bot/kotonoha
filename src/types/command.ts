import type { AutocompleteInteraction, CommandInteraction, SlashCommandBuilder } from 'discord.js';

type Command = {
  autocomplete?: (interaction: AutocompleteInteraction) => void;
  command: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
};

export default Command;
