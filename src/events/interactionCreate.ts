import { type JsonMap } from '@iarna/toml';
import { Collection, InteractionType, type Interaction } from 'discord.js';
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

    let userData = bot.users.get(interaction.user.id);

    if (userData === undefined) {
      userData = {
        history: [],
        cooldowns: new Collection<string, number>(),
      };
      bot.users.set(interaction.user.id, userData);
    }

    if (interaction.commandName !== 'repeat') {
      if (userData.history.push(command) > 10) {
        userData.history.shift();
      }
    }

    const now = Date.now();
    const cooldownDuration =
      (command.cooldown ?? ((bot.configs.server as JsonMap).defaultCooldown as number)) * 1000;

    if (interaction.isChatInputCommand()) {
      const prevTimestamp = userData.cooldowns.get(command.id);
      if (prevTimestamp !== undefined) {
        const expirationTime = prevTimestamp + cooldownDuration;

        if (now < expirationTime) {
          const expiredTimestamp = Math.round(expirationTime / 1000);

          await interaction.reply({
            content: `You are on cooldown for this command. You can use it again in <t:${expiredTimestamp}:R>.`,
            ephemeral: true,
          });

          return;
        }
      }
      userData.cooldowns.set(command.id, now);
      setTimeout(() => userData?.cooldowns.delete(command.id), cooldownDuration);
      await command.execute(new Yaritori(interaction), bot);
    } else if (interaction.isAutocomplete()) {
      await command.autocomplete?.(interaction);
    }
  },
};

export default event;
