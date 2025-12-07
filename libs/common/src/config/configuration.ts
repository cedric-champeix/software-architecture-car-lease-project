export default () => ({
  consumers: {
    enabled: process.env.DISABLE_CONSUMERS !== 'true',
  },
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost/car-lease',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
});
