import type {
  AutocompleteInteraction,
  Awaitable,
  CommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

type Command = {
  autocomplete?: (interaction: AutocompleteInteraction) => Awaitable<void>;
  command: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Awaitable<void>;
};

export default Command;
