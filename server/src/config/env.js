import 'dotenv/config';

/** Centralised, validated environment access. Import this rather than
 *  reaching into process.env from feature code. */
export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/conscious-orbit',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV ?? 'development',

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY ?? '',
    model: process.env.ANTHROPIC_MODEL ?? 'claude-opus-5',
    get enabled() {
      return Boolean(process.env.ANTHROPIC_API_KEY);
    },
  },

  spyfu: {
    apiId: process.env.SPYFU_API_ID ?? '',
    secretKey: process.env.SPYFU_SECRET_KEY ?? '',
    baseUrl: 'https://www.spyfu.com/apis',
    get enabled() {
      return Boolean(process.env.SPYFU_API_ID && process.env.SPYFU_SECRET_KEY);
    },
  },
};

export const isProduction = env.nodeEnv === 'production';
