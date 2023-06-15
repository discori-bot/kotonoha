import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { EMBED_NEUTRAL_COLOR } from '../common/constants';
import getRequiredEnv from '../utils/getRequiredEnv';
import type { Command, Execute } from '../types/command';

const description = 'Invite me!';
const invite = getRequiredEnv('INVITE_URL');

const execute: Execute = async (interaction) => {
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
  help: new EmbedBuilder()
    .setColor(EMBED_NEUTRAL_COLOR)
    .setTitle('Invite')
    .setDescription(description),

  execute,
};

export default command;
