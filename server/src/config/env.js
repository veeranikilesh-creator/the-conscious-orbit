import 'dotenv/config';

/** Centralised, validated environment access. Import this rather than
 *  reaching into process.env from feature code. */
export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/conscious-orbit',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  nodeEnv: process.env.NODE_ENV ?? 'development',

  /* Gemini is the platform's AI provider. Every AI feature degrades to a
     deterministic heuristic when no key is set, so the pipeline still runs. */
  gemini: {
    apiKey: process.env.GEMINI_API_KEY ?? '',
    model: process.env.GEMINI_MODEL ?? 'gemini-3.6-flash',
    get enabled() {
      return Boolean(process.env.GEMINI_API_KEY);
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

  smtp: {
    host: process.env.SMTP_HOST ?? '',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
    from: process.env.SMTP_FROM ?? '"The Conscious Orbit" <reports@consciousorbit.com>',
    get enabled() {
      return Boolean(process.env.SMTP_HOST);
    },
  },
};

export const isProduction = env.nodeEnv === 'production';
