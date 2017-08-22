const egg = require("egg");
const path = require("path");

if (!process.env.EGG_SERVER_ENV) process.env.EGG_SERVER_ENV = "local";

egg.startCluster({
  baseDir: path.join(__dirname, ".."),
  port: process.env.PORT || 8001,
  workers: 1
});
