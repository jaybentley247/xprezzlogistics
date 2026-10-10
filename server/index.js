const path = require("node:path");
const { createApp } = require("./app");
const { createStore } = require("./store");

const {
  PORT = 5000,
  ADMIN_USERNAME = "admin",
  ADMIN_PASSWORD,
  TOKEN_SECRET,
  CORS_ORIGIN,
  DATA_FILE = path.join(__dirname, "data", "db.json"),
} = process.env;

if (!ADMIN_PASSWORD || !TOKEN_SECRET) {
  console.error(
    "ADMIN_PASSWORD and TOKEN_SECRET must be set. Copy server/.env.example to server/.env and fill them in.",
  );
  process.exit(1);
}

const app = createApp({
  store: createStore(DATA_FILE),
  adminUsername: ADMIN_USERNAME,
  adminPassword: ADMIN_PASSWORD,
  tokenSecret: TOKEN_SECRET,
  corsOrigin: CORS_ORIGIN,
});

app.listen(PORT, () => {
  console.log(`Xprezz Logistics API listening on http://localhost:${PORT}`);
});
