import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type Command from '../types/command';

const command: Command = {
  id: 'repeat',
  command: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Repeat the last command you entered!'),
  cmdNames: ['!!'],
  execute: async (interaction, bot) => {
    let userData = bot.users.get(interaction.user.id); // msg.author.id
    if (userData == undefined) return;
    if (userData['history'] == undefined) return;
    
    await userData['history'].pop()?.execute(interaction, bot);
  },
};

export default command;
