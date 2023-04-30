import { InteractionType, type Interaction } from 'discord.js';
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

    if (interaction.commandName != 'repeat') {
      let userData = bot.users.get(interaction.user.id);
      if (userData == undefined) {
        bot.users.set(interaction.user.id, { history: [command] });
      } else if (userData['history'] == undefined) {
        userData['history'] = [command];
      } else {
        if (userData['history'].push(command) > 10) {
          userData['history'].shift();
        }
      }
    }
    if (interaction.isChatInputCommand()) {
      await command.execute(interaction, bot);
    } else if (interaction.isAutocomplete()) {
      await command.autocomplete?.(interaction);
    }
  },
};

export default event;
