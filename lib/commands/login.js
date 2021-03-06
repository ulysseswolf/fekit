// Generated by CoffeeScript 1.4.0
(function() {
  var async, env, prompt, schema, utils, _;

  env = require('../env');

  utils = require('../util');

  _ = require('underscore');

  async = require('async');

  prompt = require('prompt');

  exports.usage = "登录至源服务器";

  exports.set_options = function(optimist) {
    return optimist;
  };

  exports.run = function(options) {
    prompt.start();
    return prompt.get(schema, function(err, result) {
      if (err) {
        return;
      }
      return utils.http.put(env.getRegistryUrl('/user/signin'), {
        username: result.username,
        password: result.password
      }, function(err, body, res) {
        if (err) {
          return utils.logger.error(err);
        }
        body = JSON.parse(body);
        if (!body.ret) {
          return utils.logger.error(body.errmsg);
        }
        if (!body.data) {
          return utils.logger.error("出现未知错误，请联系管理员.");
        }
        if (body.data.name !== result.username) {
          return utils.logger.error("出现未知错误，请联系管理员.");
        }
        utils.file.io.write(utils.path.join(utils.path.get_user_home(), ".fekit.pas"), body.data.password_md5);
        env.set("user", body.data.name);
        return utils.logger.log("" + body.data.name + " 已登录成功");
      });
    });
  };

  schema = {
    properties: {
      username: {
        pattern: /^.+$/i,
        required: true,
        description: 'username'
      },
      password: {
        pattern: /^.+$/,
        required: true,
        description: 'password',
        hidden: true
      }
    }
  };

}).call(this);
