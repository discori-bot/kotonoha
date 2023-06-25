import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import embed from '../pages/helpAll';
import type { Command, Execute } from '../types/command';

const description = 'Get description for the previous command or show a list of commands.';

const execute: Execute = async (interaction, bot) => {
  const userData = bot.users.get(interaction.user.id);
  const history = userData?.history;
  if (history === undefined || history.length <= 1) {
    await interaction.reply({
      embeds: [embed],
    });
    return;
  }
  await interaction.reply({
    // send the help page for the previously ran command
    embeds: [history[history.length - 2].help],
  });
};

const command: Command = {
  id: 'help',
  command: new SlashCommandBuilder().setName('help').setDescription(description),
  cmdNames: ['help', 'h'],
  description,
  help: new EmbedBuilder().setTitle('Help').setDescription(description),
  execute,
};

export default command;
