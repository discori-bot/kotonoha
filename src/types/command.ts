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
import type { ParsedArgs } from 'minimist';

export type Execute = <T extends ChatInputCommandInteraction | Message>(
  yaritori: Yaritori<T>,
  bot: Bot,
  args?: ParsedArgs,
  prefix?: string,
) => Awaitable<void>;

export type Command = {
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
  execute: Execute;
  help: EmbedBuilder;
  id: string;
};
