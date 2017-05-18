/*
 * Created by izayl on 2017/5/5.
 * @Project: iChat-Server
 * @Author: izayl
 * @Contact: izayl@163.com
 */

/**
 * return a response json with following structure
 * { code: 200, data: 'Success', error: null }
 * @param code   http code
 * @param data   response data
 * @param error  error message
 */
module.exports = formatJson = (data = 'success', code = 200, error) => ({ code, data, error });

