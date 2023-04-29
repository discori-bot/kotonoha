import type Env from '../types/env';

/**
 * Gets the value of an environment variable and panics if the variable isn't set.
 */
const getRequiredEnv = (name: keyof Env): string => {
  const value = process.env[name];

  if (value === undefined) {
    console.error(`[!] Environment variable ${name} is required!`);
    process.exit(1);
  }

  return value;
};

export default getRequiredEnv;
