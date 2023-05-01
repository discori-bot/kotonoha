import type Optional from './optional';
import type Bot from './bot';
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
  cooldown?: number;
  id: string;
  cmdNames: string[];
  command: /**
   * Discord.js removes the both of these functions whenever
   * you add an option to the command.
   */
  | Optional<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | SlashCommandSubcommandsOnlyBuilder;
  description: string;
  help: EmbedBuilder;
  execute: (interaction: CommandInteraction, bot: Bot) => Awaitable<void>;
};

export default Command;
