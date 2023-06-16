import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { EMBED_NEUTRAL_COLOR } from '../common/constants';
import embed from '../pages/helpAll';
import type { Command, Execute } from '../types/command';

const description = 'Get description for the previous command or show a list of commands.';

const execute: Execute = async (interaction, bot, args, prefix) => {
  const normalArgs = args?._.map((str) => str.toLowerCase());
  const userData = bot.users.get(interaction.user.id);
  const history = userData?.history;
  if (history === undefined || history.length <= 1 || normalArgs?.includes('all')) {
    await interaction.reply({
      embeds: [embed],
    });
    return;
  }
  await interaction.reply({
    // send the help page for the previously ran command
    embeds: [
      history[history.length - 2].help.setFooter({
        text: `*This command shows the help page for the previous command. To show the help page for all commands, enter ${prefix}help all*`,
      }),
    ],
  });
};

const command: Command = {
  id: 'help',
  command: new SlashCommandBuilder().setName('help').setDescription(description),
  cmdNames: ['help', 'h'],
  description,

  help: new EmbedBuilder()
    .setColor(EMBED_NEUTRAL_COLOR)
    .setTitle('Help')
    .setDescription(description),

  execute,
};

export default command;
