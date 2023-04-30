import type BotEvent from '../types/event';

const event: BotEvent = {
  name: 'ready',
  once: true,
  execute: () => {
    console.log('[*] bot ready!');
  },
};

export default event;
