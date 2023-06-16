import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { Command, Execute } from '../types/command';

const description = 'Invite me!';

const execute: Execute = async (interaction, bot) => {
  const invite = bot.configs.inviteURL as string;
  if (interaction.isSlashCommand())
    await interaction.reply({
      content: `[You can invite me to your server using this link!](${invite})`,
      ephemeral: true,
    });
  else
    await interaction.reply({
      content: `You can invite me to your server using this link!: \n${invite}`,
      ephemeral: true,
    });
};

const command: Command = {
  id: 'invite',
  command: new SlashCommandBuilder().setName('invite').setDescription(description),
  cmdNames: ['invite'],
  description,
  help: new EmbedBuilder().setTitle('Invite').setDescription(description),
  execute,
};

export default command;
