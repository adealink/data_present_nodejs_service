const VError = require("verror");
const e = require("../../config/error");

module.exports = {
  /**
   * 构造运行异常对象
   * @param {*} options
   */
  error(options = {}) {
    const {
      name = this.ERROR_TYPE.DATA_PRESENT_ERROR.name,
      error,
      message = "",
      info = {}
    } = options;

    if (this.user) {
      info.user_id = this.user.id;
      info.user_role = this.user.role;
    }
    throw new VError({ name, cause: error, info }, message);
  },

  /**
   * 获取错误属性
   * @param {*} err
   */
  getErrorProperties(err) {
    if (!err || !(err instanceof VError) || !this.typeofError(err)) {
      return {};
    }
    return VError.info(err);
  },

  /**
   * 将非Error对象类型的错误包装成VError
   * 默认的错误码为-1。若参数为string，则以参数作为message输出，否则以错误码的msg输出
   * 兼容现业务中抛出各种对象的情况
   * @param {*} code
   */
  wrapObjToError(obj) {
    let errCode;
    if (obj in this.ERR_MSG) {
      errCode = obj;
    } else {
      errCode = this.ERR_CODE.FAIL;
    }
    return new VError(
      {
        name: this.ERROR_TYPE.DATA_PRESENT_ERROR.name,
        info: { code: errCode }
      },
      typeof obj === "string" ? obj : this.ERR_MSG[errCode]
    );
  },

  /**
   * 返回错误类型
   * @param {*} err
   */
  typeofError(err) {
    if (!(err instanceof VError)) {
      throw err;
    }
    return this.ERROR_TYPE[err.name].name || "";
  },

  /**
   * assert的封装
   * @param {boolean} b 参数校验bool值
   * @param {*} options 构造运行异常的参数
   * 校验失败会抛出ASSERT_ERROR异常
   */
  assert(b, options = {}) {
    let { message } = options;
    const { info } = options;
    const name = this.ERROR_TYPE.ASSERT_ERROR.name;
    message = message || "";
    if (!b) {
      this.error({ name, info }, message);
    }
  },

  // 错误码 自定义模块规则 前两位为模块编号,后两位为具体错误码 如1001
  get ERR_CODE() {
    return e.err_code;
  },

  get ERR_MSG() {
    return e.err_msg;
  },

  get ERROR_TYPE() {
    return e.err_type;
  },

  /**
  * 返回成功
  * @param {*} argData 返回数据
  */
  success(argData) {
    this.body = this.formatResult(this.ERR_CODE.SUCCESS, null, argData);
  },

  /**
   * 返回失败
   * @param {*} argCode 错误码
   * @param argMsg
   * @param argData
   */
  fail(argCode, argMsg, argData) {
    this.body = this.formatResult(argCode, argMsg, argData);
  },

  /**
   * 构造json返回
   * @param argCode
   * @param argData
   * @returns {{code: number, msg: string, data: {}}}
   */
  formatResult(argCode = this.ERR_CODE.FAIL, argMsg = null, argData = null) {
    let code = argCode;
    let data = argData;
    let msg = "";

    // 判断code类型
    if (typeof argCode !== "number" || !(argCode in this.ERR_MSG))
      code = this.ERR_CODE.FAIL;

    msg = argMsg || this.ERR_MSG[code]; // 手动构造了返回的msg就用该msg，没有构造就返回code对应的msg

    if (
      (code !== this.ERR_CODE.SUCCESS && data === "") ||
      typeof data === "undefined"
    )
      data = null;

    return {
      code,
      msg,
      data
    };
  }
};
