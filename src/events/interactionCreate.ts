import { InteractionType, type Interaction } from 'discord.js';
import Yaritori from '../types/yaritori';
import type Bot from '../types/bot';
import type BotEvent from '../types/event';

const event: BotEvent = {
  name: 'interactionCreate',
  execute: async (bot: Bot, interaction: Interaction) => {
    if (
      interaction.type !== InteractionType.ApplicationCommand &&
      interaction.type !== InteractionType.ApplicationCommandAutocomplete
    )
      return;

    const command = bot.commands.get(interaction.commandName);
    if (command === undefined) return;

    if (interaction.isChatInputCommand()) {
      await command.execute(new Yaritori(interaction));
    } else if (interaction.isAutocomplete()) {
      await command.autocomplete?.(interaction);
    }
  },
};

export default event;
