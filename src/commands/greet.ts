import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type Command from '../types/command';

const command: Command = {
  command: new SlashCommandBuilder().setName('greet').setDescription('Greets the user'),
  cmdNames: ['greet'],
  execute: async (interaction) => {
    await interaction.reply({
      embeds: [new EmbedBuilder().setTitle('Hello!').setDescription('Hey!')],
    });

    await interaction.reply('follow up message!');
  },
};

export default command;
