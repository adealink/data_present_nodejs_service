"use strict";

// module.exports = appInfo => {
//   const config = {};

//   // should change to your own
//   config.keys = appInfo.name + "_1503300839569_799";

//   // add your config here

//   return config;
// };

// ========== 请求中间件配置 ==========
exports.middleware = ["errorHandler", "compress"];
// ========== 安全配置 ===============
exports.security = {
  csrf: {
    enable: false
  }
};
// ========== mysql配置 ==============
exports.mysql = {
  // 单数据库信息配置
  client: {
    // host
    host: "127.0.0.1",
    // 端口号
    port: "3306",
    // 用户名
    user: "sxd",
    // 密码
    password: "11111111",
    // 数据库名
    database: "present"
  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false
};
// ========== knex设置 ==============
exports.knex = {
  client: "mysql",
  connection: {
    host: mysql.client.host,
    port: mysql.client.port,
    user: mysql.client.user,
    password: mysql.client.password,
    database: mysql.client.database
  },
  pool: {
    max: 10,
    min: 1,
    idleTimeoutMillis: 120000
  }
};
