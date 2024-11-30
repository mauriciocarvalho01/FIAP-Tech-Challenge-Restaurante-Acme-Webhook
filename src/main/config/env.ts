export const env = {
  appName: process.env.APP_NAME ?? 'restaurante_acme',
  isProduction: false, //process.env.TS_NODE_DEV === undefined,
  port: process.env.PORT ?? 4000,
  apiAccessKey: process.env.API_ACCESS_KEY,
  checkIpAuthorization: /true/.test(
    process.env.CHECK_IP_AUTHORIZATION ?? 'false'
  ),
  whitelistIps: process.env.WHITE_LIST_IPS,
  database: {
    mongodb: {
      uri: process.env.MONGODB_HOST || 'localhost',
      database: process.env.MONGODB_DATABASE || '',
    },
  },
  messageBroker: {
    host: process.env.MESSAGE_BROKER_HOST ?? 'amqp://localhost:5672'
  }
};
