type Env = {
  CLIENT_ID: string;
  INVITE_URL: string;
  TOKEN: string;
  TZ?: string;
};

declare global {
  namespace NodeJS {
    /**
     * This actually *does* extend the ProcessEnv type
     * with our own, but ESLint thinks it does nothing.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends Env {}
  }
}

export default Env;
