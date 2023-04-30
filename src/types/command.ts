import type Optional from './optional';
import type {
  AutocompleteInteraction,
  Awaitable,
  CommandInteraction,
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
  execute: (interaction: CommandInteraction) => Awaitable<void>;
};

export default Command;
