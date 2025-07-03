const { createClient } = require('redis');
const redis = createClient({
    url: process.env.REDIS_AIVEN,
    socket: {
      tls: true, // ✅ This is critical for Aiven
      rejectUnauthorized: false // optional: only if you get TLS cert errors
    }
  });

// createClient({
//   username: process.env.REDIS_USERNAME,
//   password: process.env.REDIS_PASSWORD,
//   socket: {
//       host: process.env.REDIS_HOST,
//       port: process.env.REDIS_PORT
//   }
// }); 



redis.on('error', err => console.error('Redis Client Error', err));

redis.connect().then(console.log("Redis connected"));

module.exports = redis;
