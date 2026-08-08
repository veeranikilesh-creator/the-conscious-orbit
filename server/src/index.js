import { createApp } from './app.js';
import { connectDb, disconnectDb } from './config/db.js';
import { env } from './config/env.js';

async function main() {
  await connectDb();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`[api] listening on http://localhost:${env.port}/api`);
    console.log(`[api] gemini: ${env.gemini.enabled ? env.gemini.model : 'disabled (heuristic verdicts)'}`);
    console.log(`[api] spyfu: ${env.spyfu.enabled ? 'enabled' : 'disabled (placeholder data)'}`);
  });

  const shutdown = async (signal) => {
    console.log(`\n[api] ${signal} — shutting down`);
    server.close(async () => {
      await disconnectDb();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  console.error('[api] failed to start:', err);
  process.exit(1);
});
