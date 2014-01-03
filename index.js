var util   = require('util');
var crypto = require('crypto');
var http   = require('http');
var querystring = require('querystring');

var PROTOCOL_SCHEMA = 'http://';
var SERVER_HOST     = 'channel.api.duapp.com';
var COMMON_PATH     = '/rest/2.0/channel/';

function urlencode(string) {
  string = (string + '').toString();
  return encodeURIComponent(string).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

function getTimestamp() {
  var timestamp = Math.floor(new Date().getTime() / 1000);
  return timestamp;
}

function sortObject(originObject) {
  var index = [];
  var tempObject = {};
  for (var i in originObject) {
    if (originObject.hasOwnProperty(i)) {
      index.push(i);
    }
  }

  index.sort();

  for(i = 0; i < index.length; i++) {
    tempObject[index[i]] = originObject[index[i]];
  }
  return tempObject;
}

function generateSign(method, url, params, secretKey) {
  var baseString = method + url;

  for (var i in params) {
    baseString += (i + '=' + params[i]);
  }

  baseString += secretKey;
  var encodeString = urlencode(baseString);
  var md5sum = crypto.createHash('md5');
  md5sum.update(encodeString);

  var sign = md5sum.digest('hex');
  return sign;
}

function request(bodyArgs, path, secretKey, id, host, callback) {
  callback = callback || function () {};
  bodyArgs.sign = generateSign('POST', PROTOCOL_SCHEMA + host + path, bodyArgs, secretKey);

  var bodyArgsArray = [];
  for (var i in bodyArgs) {
    if (bodyArgs.hasOwnProperty(i)) {
      bodyArgsArray.push(i + '=' + urlencode(bodyArgs[i]));
    }
  }

  var bodyString = bodyArgsArray.join('&');
  var options = {
    host: host,
    method: 'POST',
    path: path,
    headers: {
      'Content-Length': bodyString.length,
      'Content-Type':   'application/x-www-form-urlencoded'
    }
  };

  var req = http.request(options, function (res) {
    var resBody = '';
    res.on('data', function (chunk) {
      resBody += chunk;
    });

    res.on('end', function () {
      try {
        var jsonObj = JSON.parse(resBody);
      } catch (e) {
        return callback(e);
      }
      var errObj = null;
      id.request_id = jsonObj['request_id'];
      if (res.statusCode !== 200) {
        errObj = new Error(jsonObj);
      }
      callback(errObj, jsonObj);
    });
  });

  req.on('error', function (e) {
    callback(e, null);
  });
  req.write(bodyString);
  req.end();
}

function Push(options) {
  var self   = this;
  var option = {
    apiKey:    process.env.BAE_ENV_AK,
    secretKey: process.env.BAE_ENV_SK,
    host:      process.env.BAE_ENV_ADDR_CHANNEL || SERVER_HOST
  }

  if (options) {
    for (var i in options) {
      if (options.hasOwnProperty(i)) {
        if (typeof options[i] === 'string') {
          option[i] = options[i];
        } else {
          throw new Error('Invalid apiKey, secretKey, or counter host');
        }
      }
    }
  }

  self.apiKey     = option.apiKey;
  self.secretKey  = option.secretKey;
  self.host       = option.host;
  self.request_id = null;
}

Push.prototype.pushMessage = function (options, callback) {
  callback   = callback || function () {};
  var path   = COMMON_PATH + 'channel';
  var self   = this;
  var option = {};

  if (typeof options.messages !== 'string') {//兼容旧版本
    options.messages = JSON.stringify(options.messages);
  }
  if (typeof options.msg_keys !== 'string') {
    options.msg_keys = JSON.stringify(options.msg_keys);
  }

  for (var i in options) {
    if (options.hasOwnProperty(i)) { option[i] = options[i]; }
  }

  option['method']    = 'push_msg';
  option['apikey']    = self.apiKey;
  option['timestamp'] = getTimestamp();
  option              = sortObject(option);

  var wrap_id = { request_id: null };
  request(option, path, self.secretKey, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;
    if (err) {
      return callback(err, result);
    }
    return callback(null, result);
  });
}

Push.prototype.setTag = function (options, callback) {
  callback   = callback || function () {};
  var path   = COMMON_PATH + 'channel';
  var self   = this;
  var option = {};

  for (var i in options) {
    if (options.hasOwnProperty(i)) { option[i] = options[i]; }
  }

  option['method']    = 'set_tag';
  option['apikey']    = self.apiKey;
  option['timestamp'] = getTimestamp();
  option              = sortObject(option);

  var wrap_id = { request_id: null };
  request(option, path, self.secretKey, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;
    if (err) {
      return callback(err, result);
    }
    return callback(null, result);
  });
}

Push.prototype.fetchTag = function (options, callback) {
  callback   = callback || function () {};
  var path   = COMMON_PATH + 'channel';
  var self   = this;
  var option = {};

  for (var i in options) {
    if (options.hasOwnProperty(i)) { option[i] = options[i]; }
  }

  option['method']    = 'fetch_tag';
  option['apikey']    = self.apiKey;
  option['timestamp'] = getTimestamp();
  option              = sortObject(option);

  var wrap_id = { request_id: null };
  request(option, path, self.secretKey, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;
    if (err) {
      return callback(err, result);
    }
    return callback(null, result);
  });
}

Push.prototype.queryTag = function (options, callback) {
  callback   = callback || function () {};
  var path   = COMMON_PATH + 'channel';
  var self   = this;
  var option = {};

  for (var i in options) {
    if (options.hasOwnProperty(i)) { option[i] = options[i]; }
  }

  option['method']    = 'query_user_tags';
  option['apikey']    = self.apiKey;
  option['timestamp'] = getTimestamp();
  option              = sortObject(option);

  var wrap_id = { request_id: null };
  request(option, path, self.secretKey, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;
    if (err) {
      return callback(err, result);
    }
    return callback(null, result);
  });
}

/*
* just the same to `queryTag`, and will be removed!
*/
Push.prototype.queryUserTag = function (options, callback) {
  callback   = callback || function () {};
  var path   = COMMON_PATH + 'channel';
  var self   = this;
  var option = {};

  for (var i in options) {
    if (options.hasOwnProperty(i)) { option[i] = options[i]; }
  }

  option['method']    = 'query_user_tags';
  option['apikey']    = self.apiKey;
  option['timestamp'] = getTimestamp();
  option              = sortObject(option);

  var wrap_id = { request_id: null };
  request(option, path, self.secretKey, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;
    if (err) {
      return callback(err, result);
    }
    return callback(null, result);
  });
}

Push.prototype.deleteTag = function (options, callback) {
  callback   = callback || function () {};
  var path   = COMMON_PATH + 'channel';
  var self   = this;
  var option = {};

  for (var i in options) {
    if (options.hasOwnProperty(i)) { option[i] = options[i]; }
  }

  option['method']    = 'delete_tag';
  option['apikey']    = self.apiKey;
  option['timestamp'] = getTimestamp();
  option              = sortObject(option);

  var wrap_id = { request_id: null };
  request(option, path, self.secretKey, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;
    if (err) {
      return callback(err, result);
    }
    return callback(null, result);
  });
}

Push.prototype.queryBindList = function (options, callback) {
  callback   = callback || function () {};
  var path   = COMMON_PATH + (options['channel_id'] || 'channel');
  var self   = this;
  var option = {};

  for (var i in options) {
    if (options.hasOwnProperty(i)) { option[i] = options[i]; }
  }

  option['method']    = 'query_bindlist';
  option['apikey']    = self.apiKey;
  option['timestamp'] = getTimestamp();
  option              = sortObject(option);

  var wrap_id = { request_id: null };
  request(option, path, self.secretKey, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;
    if (err) {
      return callback(err, result);
    }
    return callback(null, result);
  });
}

module.exports = Push;
