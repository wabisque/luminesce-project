export default {
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  secret: process.env.DB_SECRET,
};
