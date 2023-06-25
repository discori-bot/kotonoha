import type Bot from '../types/bot';

/**
 * Gets the value of a config variable and panics if the variable isn't set.
 */
const requireConfig = (bot: Bot, name: string) => {
  const value = bot.configs[name];

  if (value === undefined) {
    console.error(`[!] Config variable ${name} is required!`);
    process.exit(1);
  }

  return value;
};

export default requireConfig;
