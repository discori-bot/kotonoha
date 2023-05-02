import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { EMBED_NEUTRAL_COLOR } from '../common/constants';
import getRequiredEnv from '../utils/getRequiredEnv';
import type Command from '../types/command';

const description = 'Invite me!';
const invite = getRequiredEnv('INVITE_URL');

const command: Command = {
  id: 'invite',
  command: new SlashCommandBuilder().setName('invite').setDescription(description),
  cmdNames: ['invite'],
  description,
  help: new EmbedBuilder()
    .setColor(EMBED_NEUTRAL_COLOR)
    .setTitle('Invite')
    .setDescription(description),

  execute: async (interaction) => {
    await interaction.reply({
      content: `[You can invite me to your server using this link!](${invite})`,
      ephemeral: true,
    });
  },
};

export default command;
