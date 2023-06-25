import { type Interaction } from 'discord.js';
import dispatchCommand from '../utils/commandDispatcher';
import type Bot from '../types/bot';
import type BotEvent from '../types/event';

const event: BotEvent = {
  name: 'interactionCreate',
  execute: async (bot: Bot, interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      await dispatchCommand(bot, interaction);
    } else if (interaction.isAutocomplete()) {
      const command = bot.commands.get(interaction.commandName);
      await command?.autocomplete?.(interaction);
    }
  },
};

export default event;
