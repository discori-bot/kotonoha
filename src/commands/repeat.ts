import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { EMBED_NEUTRAL_COLOR } from '../common/constants';
import type Command from '../types/command';

const description = 'Repeat the last command you entered.';

const command: Command = {
  id: 'repeat',
  command: new SlashCommandBuilder().setName('repeat').setDescription(description),
  cmdNames: ['!!'],
  description,

  help: new EmbedBuilder()
    .setColor(EMBED_NEUTRAL_COLOR)
    .setTitle('Repeat')
    .setDescription(description),

  execute: async (interaction, bot) => {
    const userData = bot.users.get(interaction.user.id); // msg.author.id
    if (userData === undefined) return;
    if (userData.history === undefined) return;

    await userData.history.pop()?.execute(interaction, bot);
  },
};

export default command;
