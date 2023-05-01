import type Bot from './bot';
import type Optional from './optional';
import type {
  AutocompleteInteraction,
  Awaitable,
  CommandInteraction,
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
  execute: (interaction: CommandInteraction, bot: Bot) => Awaitable<void>;
  help: EmbedBuilder;
  id: string;
};

export default Command;
