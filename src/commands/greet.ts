import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { EMBED_NEUTRAL_COLOR } from '../common/constants';
import type Command from '../types/command';

const description = 'Greets the user';

const command: Command = {
  id: 'greet',
  command: new SlashCommandBuilder().setName('greet').setDescription(description),
  cmdNames: ['greet'],
  description,
  help: new EmbedBuilder()
  .setColor(EMBED_NEUTRAL_COLOR)
  .setTitle('Greet')
  .setDescription(description),

  execute: async (interaction) => {
    await interaction.reply({
      embeds: [new EmbedBuilder().setTitle('Hello!').setDescription('Hey!')],
    });
  },
};

export default command;
