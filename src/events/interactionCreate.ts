import { InteractionType, type Interaction, GatewayDispatchEvents } from 'discord.js';
import type Bot from '../types/bot';
import type EventHandler from '../types/event';

const handler: EventHandler = {
  events: [GatewayDispatchEvents.IntegrationCreate],
  execute: async (bot: Bot, interaction: Interaction) => {
    if (
      interaction.type !== InteractionType.ApplicationCommand &&
      interaction.type !== InteractionType.ApplicationCommandAutocomplete
    )
      return;

    const command = bot.commands.get(interaction.commandName);
    if (command === undefined) return;

    if (interaction.isChatInputCommand()) {
      await command.execute(interaction);
    } else if (interaction.isAutocomplete()) {
      await command.autocomplete?.(interaction);
    }
  },
};

export default handler;
