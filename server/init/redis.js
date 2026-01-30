const { createClient } = require("redis");
const { REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = require("../config/keys");

const redisClient = createClient({
  username: "default",
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.info("Redis connected successfully");
  } catch (error) {
    console.error("Redis client error", error);
  }
};

module.exports = {
  redisClient,
  connectRedis,
};
