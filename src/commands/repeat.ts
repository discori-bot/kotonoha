import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type Command from '../types/command';
import { EMBED_NEUTRAL_COLOR } from '../common/constants';

const description = 'Repeat the last command you entered.';

const command: Command = {
  id: 'repeat',
  command: new SlashCommandBuilder().setName('repeat').setDescription(description),
  cmdNames: ['!!'],
  description: description,

  help: new EmbedBuilder()
    .setColor(EMBED_NEUTRAL_COLOR)
    .setTitle('Repeat')
    .setDescription(description),

  execute: async (interaction, bot) => {
    let userData = bot.users.get(interaction.user.id); // msg.author.id
    if (userData == undefined) return;
    if (userData['history'] == undefined) return;

    await userData['history'].pop()?.execute(interaction, bot);
  },
};

export default command;
