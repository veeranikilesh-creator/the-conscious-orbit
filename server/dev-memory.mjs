/* Dev convenience: run the API against an in-memory MongoDB, for machines
   with no Mongo installed. Data lives only as long as the process.
   Usage: node dev-memory.mjs   (from server/) */
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongo = await MongoMemoryServer.create();
process.env.MONGODB_URI = mongo.getUri('conscious-orbit');

const { connectDb } = await import('./src/config/db.js');
const { createApp } = await import('./src/app.js');
const { env } = await import('./src/config/env.js');

await connectDb();
const server = createApp().listen(env.port, () => {
  console.log(`[dev-memory] api on http://localhost:${env.port}/api (in-memory MongoDB — data is not persisted)`);
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, async () => {
    server.close();
    await mongo.stop();
    process.exit(0);
  });
}
