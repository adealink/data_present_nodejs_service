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
exports.security = {
  csrf: {
    enable: false
  }
};
