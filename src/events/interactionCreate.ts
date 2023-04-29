import { type Interaction } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import type BotEvent from '../types/event';

const event: BotEvent = {
  name: 'interactionCreate',
  execute: async (interaction: Interaction) => {
    if (!(interaction instanceof CommandInteraction)) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (command === undefined) return;

    if (interaction.isChatInputCommand()) {
      await command.execute(interaction);
    } else if (interaction.isAutocomplete()) {
      await command.autocomplete?.(interaction);
    }
  },
};

export default event;
