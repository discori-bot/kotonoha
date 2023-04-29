import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type Command from '../types/command';

const command: Command = {
  command: new SlashCommandBuilder().setName('greet').setDescription('Greets the user'),
  execute: async (interaction) => {
    await interaction.reply({
      embeds: [new EmbedBuilder().setTitle('Hello!').setDescription('Hey!')],
    });
  },
};

export default command;
