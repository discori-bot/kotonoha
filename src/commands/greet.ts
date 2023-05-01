import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type Command from '../types/command';

const command: Command = {
  id: 'greet',
  command: new SlashCommandBuilder().setName('greet').setDescription('Greets the user'),
  cmdNames: ['greet'],
  execute: async (interaction) => {
    await interaction.reply({
      embeds: [new EmbedBuilder().setTitle('Hello!').setDescription('Hey!')],
    });
  },
};

export default command;
