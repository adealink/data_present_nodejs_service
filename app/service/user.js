"use strict";

module.exports = app => {
  class User extends app.Service {
    /**
     * 注册
     * @param argPhone
     * @param argUserName
     * @param argPassword
     * @param argVerifyCode
     * @returns {Promise.<*>}
     */
    async register({ argPhone, argUserName, argPassword, argVerifyCode }) {
      if (!/^1\d{10}$/.test(phone)) {
        return this.ctx.error({
          name: this.ctx.ERROR_TYPE.DATA_PRESENT_ERROR.name,
          info: {
            code: this.ctx.ERR_CODE.AUTH.PHONE_FORMAT_ERR
          }
        });
      }
    }
  }
  return User;
};
