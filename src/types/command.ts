import type Bot from './bot';
import type Optional from './optional';
import type Yaritori from './yaritori';
import type {
  AutocompleteInteraction,
  Awaitable,
  ChatInputCommandInteraction,
  Message,
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

type Command = {
  autocomplete?: (interaction: AutocompleteInteraction) => Awaitable<void>;
  cmdNames: string[];
  command: /**
   * Discord.js removes the both of these functions whenever
   * you add an option to the command.
   */
  | Optional<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | SlashCommandSubcommandsOnlyBuilder;
  cooldown?: number;
  description: string;
  execute: <T extends ChatInputCommandInteraction | Message>(
    yaritori: Yaritori<T>,
  ) => Awaitable<void>;
  help: EmbedBuilder;
  id: string;
};

export default Command;
