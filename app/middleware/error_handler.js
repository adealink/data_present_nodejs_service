/**
 * 错误处理中间件
 * 将该中间件放在所有中间件的前面，就可以捕获所有错误了
 */

module.exports = () =>
  function* errorHandler(next) {
    try {
      yield next;
    } catch (err) {
      let error = err;
      if (!(error instanceof Error)) {
        // 如果不是Error类型，则包装成VError
        error = this.wrapObjToError(error);
      }
      this.fail(
        this.getErrorProperties(error).code, // 错误码
        this.getErrorProperties(err).msg // 返回的错误信息
      );
      switch (this.typeofError(error)) {
        // 未处理的运行错误
        case this.ERROR_TYPE.SHENSZ_ERROR.name: {
          this.logger.error({
            msg: error.message,
            info: this.getErrorProperties(error)
          });
          break;
        }
        case this.ERROR_TYPE.ASSERT_ERROR.name:
          // 断言错误，记录调试日志
          this.logger.debug({
            msg: error.message,
            info: this.getErrorProperties(error)
          });
          break;
        default:
          break;
      }
    }
  };
