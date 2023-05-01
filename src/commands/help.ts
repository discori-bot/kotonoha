import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type Command from '../types/command';
import { EMBED_NEUTRAL_COLOR } from '../common/constants';
import embed from '../pages/helpAll';

const description = 'Get description for the previous command or show a list of commands.';

const command: Command = {
  id: 'help',
  command: new SlashCommandBuilder().setName('help').setDescription(description),
  cmdNames: ['help', 'h'],
  description: description,

  help: new EmbedBuilder()
    .setColor(EMBED_NEUTRAL_COLOR)
    .setTitle('Help')
    .setDescription(description),

  execute: async (interaction, bot) => {
    const userData = bot.users.get(interaction.user.id);
    const history = userData?.history;
    if (history == undefined || history.length <= 1) {
      await interaction.reply({
        embeds: [embed],
      });
      return;
    }
    await interaction.reply({
      // send the help page for the previously ran command
      embeds: [history[history.length - 2].help],
    });
  },
};

export default command;
