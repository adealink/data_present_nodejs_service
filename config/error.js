/**
 * 错误码
 */
exports.err_code = {
  SUCCESS: 1,
  FAIL: 0,
  PARAM_ERR: -1,

  AUTH: {
    PHONE_FORMAT_ERR: 1000 // 手机号格式错误
  }
};

/**
 * 错误信息
 */
exports.err_msg = {
  "1": "成功",
  "0": "失败",
  "-1": "参数错误",

  "1000": "手机号格式错误"
};

/**
 * 错误类型
 */
exports.err_type = {
  DATA_PRESENT_ERROR: {
    name: "DATA_PRESENT_ERROR",
    log: []
  },
  ASSERT_ERROR: {
    name: "REQUEST_PARAM_ERROR",
    log: []
  }
};
