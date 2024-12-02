

import './config/module-alias';
import { env } from '@/main/config/env';
import { logger } from '@/infra/helpers';
import { MongoDBConnection } from '@/infra/repos/mongodb/helpers';
import { setupMessageBrokerQueues } from '@/main/config/queues';
import { makeMessageBroker } from '@/main/factories/infra/message-broker';


import 'reflect-metadata';

MongoDBConnection.getInstance()
  .connect({
    uri: env.database.mongodb.uri,
    dbName: env.database.mongodb.database
  })
  .then(async () => {

    logger.info(`Loading application configuration...`)
    const { app } = await import('@/main/config/app');
    app.listen(env.port, () =>
      logger.log(`Server running at http://localhost:${env.port}`)
    );

    await setupMessageBrokerQueues(makeMessageBroker())
    .then(() => void 0)
    .catch((error: Error) => {
      logger.error(error.message)
    })

  })
  .catch((error: Error) => {
    logger.error(`Mysql connection error: ${error.message} ${JSON.stringify(env.database.mongodb)}`);
  });
